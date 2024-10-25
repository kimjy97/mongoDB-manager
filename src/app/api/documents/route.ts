import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { convertDates } from '@/utils/document';

export async function POST(req: NextRequest) {
  const database = req.headers.get('X-DB-Name');
  const apiKey = req.headers.get('X-API-Key');
  if (!apiKey) {
    return NextResponse.json({ error: 'apikey가 없습니다.' }, { status: 500 });
  }

  try {
    const db = await dbConnect(apiKey, database);

    if (!db) {
      return NextResponse.json({ error: 'Database connection failed' }, { status: 500 });
    }

    let { collectionName, document } = await req.json();

    if (!collectionName || !document) {
      return NextResponse.json({ message: "Missing collectionName or document in request body" }, { status: 400 });
    }

    document = convertDates(document);

    const result = await db.collection(collectionName).insertOne(document);

    return NextResponse.json({
      message: "Document added successfully",
      id: result.insertedId,
      collectionName: collectionName
    }, { status: 201 });
  } catch (e: any) {
    return NextResponse.json({ message: e.errorResponse.errmsg }, { status: 500 });
  }
}