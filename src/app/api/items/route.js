import { connectMongoDB } from '@/lib/connection';
import Item from '@/models/Item';
import { NextResponse } from 'next/server';

export async function GET() {
  await connectMongoDB();
  const items = await Item.find({});
  return NextResponse.json(items);
}

export async function POST(request) {
  await connectMongoDB();
  const data = await request.json();
  const item = await Item.create(data);
  return NextResponse.json(item);
}

export async function PUT(request) {
  await connectMongoDB();
  const data = await request.json();
  const item = await Item.findByIdAndUpdate(data.id, { name: data.name }, { new: true });
  return NextResponse.json(item);
}

export async function DELETE(request) {
  await connectMongoDB();
  const data = await request.json();
  await Item.findByIdAndDelete(data.id);
  return NextResponse.json({ success: true });
}