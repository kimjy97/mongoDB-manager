import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import dbConnect from '@/lib/mongodb';

export async function POST(req: NextRequest) {
  const database = req.headers.get('X-DB-Name');
  const apiKey = req.headers.get('X-API-Key');
  if (!apiKey || !database) {
    return NextResponse.json({ error: 'apiKey 또는 database가 없습니다.' }, { status: 400 });
  }

  try {
    const { collectionName } = await req.json();

    if (!collectionName) {
      return NextResponse.json({ error: 'Collection name is required' }, { status: 400 });
    }

    const db = await dbConnect(apiKey, database);

    await db.createCollection(collectionName);

    return NextResponse.json({ message: `Collection '${collectionName}' created successfully` }, { status: 201 });
  } catch (error) {
    console.error('Error creating collection:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const database = req.headers.get('X-DB-Name');
  const apiKey = req.headers.get('X-API-Key');
  if (!apiKey || !database) {
    return NextResponse.json({ error: 'apiKey 또는 database가 없습니다.' }, { status: 400 });
  }

  try {
    const { collectionName } = await req.json();

    if (!collectionName) {
      return NextResponse.json({ error: 'Collection name is required' }, { status: 400 });
    }

    const db = await dbConnect(apiKey, database);

    const collections = await db.listCollections().toArray();
    const collectionExists = collections.some(col => col.name === collectionName);

    if (!collectionExists) {
      return NextResponse.json({ error: `Collection '${collectionName}' does not exist` }, { status: 404 });
    }

    await db.collection(collectionName).drop();

    return NextResponse.json({ message: `Collection '${collectionName}' deleted successfully` }, { status: 200 });
  } catch (error) {
    console.error('Error deleting collection:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}