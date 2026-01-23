import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const shipments = await prisma.shipment.findMany({
      include: {
        company: true,
      },
    });
    return NextResponse.json(shipments);
  } catch (error) {
    console.error('Error fetching shipments:', error);
    return NextResponse.json({ error: 'Failed to fetch shipments' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { company, description, status = 'Pending' } = body;

    // Find company by name
    const companyRecord = await prisma.company.findFirst({
      where: { name: company },
    });

    if (!companyRecord) {
      return NextResponse.json({ error: 'Company not found' }, { status: 400 });
    }

    const newShipment = await prisma.shipment.create({
      data: {
        companyId: companyRecord.id,
        description,
        status,
      },
      include: {
        company: true,
      },
    });

    return NextResponse.json(newShipment, { status: 201 });
  } catch (error) {
    console.error('Error creating shipment:', error);
    return NextResponse.json({ error: 'Failed to create shipment' }, { status: 500 });
  }
}