import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';

const ISO_DATE_REGEX = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}(?:Z|[\+\-]\d{2}:\d{2})$/;

function convertDatesToObjects(obj: any): any {
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

export async function POST(req: NextRequest) {
  const database = req.headers.get('X-DB-Name');
  const apiKey = req.headers.get('X-API-Key');
  if (!apiKey) {
    return NextResponse.json({ error: 'apikey가 없습니다.' }, { status: 500 });
  }

  try {
    const db = await dbConnect(apiKey, database);;

    if (!db) {
      return NextResponse.json({ error: 'Database connection failed' }, { status: 500 });
    }

    let { collectionName, document } = await req.json();

    document = convertDatesToObjects(document);

    delete document._id;

    const collection = db.collection(collectionName);
    const result = await collection.deleteOne(document);

    if (result.deletedCount === 1) {
      return NextResponse.json({ message: 'Document deleted successfully' }, { status: 200 });
    } else {
      return NextResponse.json({ message: 'No matching document found' }, { status: 404 });
    }
  } catch (error: any) {
    return NextResponse.json({ message: 'Error deleting document', error: error.message }, { status: 500 });
  }
}