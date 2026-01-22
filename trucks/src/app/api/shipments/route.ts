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

export async function GET() {
  const shipments = readShipments();
  return NextResponse.json(shipments);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const shipments = readShipments();
  const newShipment: Shipment = {
    id: Date.now().toString(),
    ...body,
    date: new Date().toISOString().split('T')[0]
  };
  shipments.push(newShipment);
  writeShipments(shipments);
  return NextResponse.json(newShipment, { status: 201 });
}