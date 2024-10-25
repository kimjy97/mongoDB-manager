import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';

const ISO_DATE_REGEX = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}(?:Z|[\+\-]\d{2}:\d{2})$/;

const convertDatesToObjects = (obj: any): any => {
  if (typeof obj !== 'object' || obj === null) {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(item => {
      if (typeof item === 'string' && ISO_DATE_REGEX.test(item)) {
        return new Date(item);
      }
      return convertDatesToObjects(item);
    });
  }

  return Object.fromEntries(
    Object.entries(obj).map(([key, value]) => {
      if (Array.isArray(value)) {
        return [key, value.map(item => {
          if (typeof item === 'string' && ISO_DATE_REGEX.test(item)) {
            return new Date(item);
          }
          return item;
        })];
      }
      if (typeof value === 'string' && ISO_DATE_REGEX.test(value)) {
        return [key, new Date(value)];
      }
      if (typeof value === 'object') {
        return [key, convertDatesToObjects(value)];
      }
      return [key, value];
    })
  );
}

const convertDataStructure = (arr: any[]) => {
  return convertDatesToObjects(arr.reduce((acc, item) => {
    if (typeof item.value === 'object' && !Array.isArray(item.value)) {
      acc[item.key] = { ...item.value };
    } else {
      acc[item.key] = item.value;
    }
    return acc;
  }, {}));
}

export async function POST(req: NextRequest) {
  const database = req.headers.get('X-DB-Name');
  const apiKey = req.headers.get('X-API-Key');
  if (!apiKey) {
    return NextResponse.json({ error: 'apikey가 없습니다.' }, { status: 500 });
  }
  await dbConnect(apiKey, database);

  try {
    const db = await dbConnect(apiKey, database);

    if (!db) {
      return NextResponse.json({ error: 'Database connection failed' }, { status: 500 });
    }

    let { collectionName, document, modifiedDocument } = await req.json();

    if (!collectionName || !document || !modifiedDocument) {
      return NextResponse.json({ message: "Missing required fields in request body" }, { status: 400 });
    }

    document = convertDatesToObjects(document);
    modifiedDocument = convertDataStructure(modifiedDocument);

    delete document._id;
    delete modifiedDocument._id;

    const collection = db.collection(collectionName);

    const result = await collection.findOneAndUpdate(
      document,
      { $set: modifiedDocument },
      { returnDocument: 'after' }
    );

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}