import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/app/lib/prisma'
import { createNoteSchema } from '@/app/lib/validation'
import { ZodError } from 'zod'
import { Prisma } from '@prisma/client'

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params
  const notes = await prisma.note.findMany({
    where: { complaintId: id },
    orderBy: { createdAt: 'desc' },
  })
  return NextResponse.json(notes)
}

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const json = await req.json()
    const data = createNoteSchema.parse(json) 

    const exists = await prisma.complaint.findUnique({ where: { id } })
    if (!exists) {
      return NextResponse.json({ error: 'Complaint not found' }, { status: 404 })
    }

    const created = await prisma.note.create({
      data: { complaintId: id, body: data.body },
    })
    return NextResponse.json(created, { status: 201 })
  } catch (err: unknown) {
    if (err instanceof ZodError) {
      return NextResponse.json({ error: err.flatten() }, { status: 400 })
    }
    if (err instanceof Prisma.PrismaClientKnownRequestError) {

        if (err.code === 'P2003') {
        return NextResponse.json({ error: 'Invalid complaintId' }, { status: 400 })
      }
    }
    console.error(err)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
