import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const body = await request.json();
    const { status } = body;

    const updatedShipment = await prisma.shipment.update({
      where: { id },
      data: { status },
      include: {
        company: true,
      },
    });

    return NextResponse.json(updatedShipment);
  } catch (error) {
    console.error('Error updating shipment:', error);
    return NextResponse.json({ error: 'Failed to update shipment' }, { status: 500 });
  }
}