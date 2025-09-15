import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/app/lib/prisma'
import { updateComplaintSchema } from '@/app/lib/validation'
import { ZodError } from 'zod'
import { Prisma } from '@prisma/client'

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const json = await req.json()
    const body = updateComplaintSchema.parse(json)

    const updated = await prisma.complaint.update({
      where: { id },
      data: {
        status: body.status ?? undefined,
        dueDate:
          body.dueDate === undefined
            ? undefined
            : body.dueDate === null
              ? null
              : new Date(body.dueDate),
      },
    })

    return NextResponse.json(updated)
  } catch (err: unknown) {

    if (err instanceof ZodError) {
      return NextResponse.json({ error: err.flatten() }, { status: 400 })
    }
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2025') {

        return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    console.error(err)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
