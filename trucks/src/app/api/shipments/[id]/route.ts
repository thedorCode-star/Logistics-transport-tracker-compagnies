import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { status } = body;

    // Get current shipment to check if status changed
    const currentShipment = await prisma.shipment.findUnique({
      where: { id },
    });

    if (!currentShipment) {
      return NextResponse.json({ error: 'Shipment not found' }, { status: 404 });
    }

    const updatedShipment = await prisma.shipment.update({
      where: { id },
      data: { status },
      include: {
        company: true,
        statusHistory: {
          orderBy: {
            changedAt: 'desc',
          },
        },
      },
    });

    // If status changed, record in history
    if (currentShipment.status !== status) {
      await prisma.shipmentStatusHistory.create({
        data: {
          shipmentId: id,
          status: status,
        },
      });
    }

    return NextResponse.json(updatedShipment);
  } catch (error) {
    console.error('Error updating shipment:', error);
    return NextResponse.json({ error: 'Failed to update shipment' }, { status: 500 });
  }
}