import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const filePath = path.join(process.cwd(), 'shipments.json');

interface Shipment {
  id: string;
  company: string;
  description: string;
  status: string;
  date: string;
}

function readShipments(): Shipment[] {
  if (!fs.existsSync(filePath)) {
    return [];
  }
  const data = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(data);
}

function writeShipments(shipments: Shipment[]) {
  fs.writeFileSync(filePath, JSON.stringify(shipments, null, 2));
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;
  const body = await request.json();
  const shipments = readShipments();
  const index = shipments.findIndex(s => s.id === id);
  if (index === -1) {
    return NextResponse.json({ error: 'Shipment not found' }, { status: 404 });
  }
  shipments[index] = { ...shipments[index], ...body };
  writeShipments(shipments);
  return NextResponse.json(shipments[index]);
}