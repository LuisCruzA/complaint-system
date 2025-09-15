import { NextRequest, NextResponse } from 'next/server'
import type { Prisma, ComplaintStatus } from '@prisma/client'
import { prisma } from '@/app/lib/prisma'
import { createComplaintSchema } from '@/app/lib/validation'
import { ZodError } from 'zod'

const STATUS_VALUES = ['NEW', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'] as const
type Status = typeof STATUS_VALUES[number]

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)

  const pageParam = searchParams.get('page')
  const pageSizeParam = searchParams.get('pageSize')
  const page = Math.max(Number(pageParam ?? '1'), 1)
  const pageSize = Math.min(Math.max(Number(pageSizeParam ?? '10'), 1), 50)

  const statusParam = searchParams.get('status')
  const q = (searchParams.get('q') || '').trim()

  const status: ComplaintStatus | undefined = STATUS_VALUES.includes(statusParam as Status)
    ? (statusParam as ComplaintStatus)
    : undefined

  const where: Prisma.ComplaintWhereInput = {
    ...(status ? { status } : {}),
    ...(q
      ? {
          OR: [
            { email: { contains: q, mode: 'insensitive' } },
            { description: { contains: q, mode: 'insensitive' } },
          ],
        }
      : {}),
  }

  const [total, items] = await Promise.all([
    prisma.complaint.count({ where }),
    prisma.complaint.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
  ])

  return NextResponse.json({ total, page, pageSize, items })
}

export async function POST(req: NextRequest) {
  try {
    const json = await req.json()
    const data = createComplaintSchema.parse(json)

    const created = await prisma.complaint.create({
      data: { email: data.email, description: data.description },
    })

    return NextResponse.json(created, { status: 201 })
  } catch (err: unknown) {

    if (err instanceof ZodError) {
      return NextResponse.json({ error: err.flatten() }, { status: 400 })
    }
    console.error(err)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
