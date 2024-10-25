import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';

interface Params {
  params: {
    collection: string;
  };
}

export async function GET(req: Request, { params }: Params) {
  const { collection } = params;

  const url = new URL(req.url);
  const page = parseInt(url.searchParams.get('page') || '1', 10);
  const limit = parseInt(url.searchParams.get('limit') || '10', 10);

  const apiKey = req.headers.get('X-API-Key');
  const database = req.headers.get('X-DB-Name');
  if (!apiKey) {
    return NextResponse.json({ error: 'apikey가 없습니다.' }, { status: 500 });
  }

  try {
    const db = await dbConnect(apiKey, database);

    if (!db) {
      return NextResponse.json({ error: 'Database connection failed' }, { status: 500 });
    }

    const skip = (page - 1) * limit;

    const documents = await db.collection(collection).find({}).skip(skip).limit(limit).toArray();
    const totalDocuments = await db.collection(collection).countDocuments();

    return NextResponse.json({
      documents,
      page,
      limit,
      totalDocuments,
      totalPages: Math.ceil(totalDocuments / limit),
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch data', details: (error as Error).message }, { status: 500 });
  }
}

export async function POST(req: NextRequest, { params }: Params) {
  try {
    const { collection } = params;
    const { query, options } = await req.json();

    const apiKey = req.headers.get('X-API-Key');
    const database = req.headers.get('X-DB-Name');
    if (!apiKey) {
      return NextResponse.json({ error: 'apikey가 없습니다.' }, { status: 500 });
    }

    if (!collection) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const db = await dbConnect(apiKey, database);

    if (!db) {
      return NextResponse.json({ error: 'Database connection failed' }, { status: 500 });
    }

    const coll = db.collection(collection)

    let cursor = coll.find(query || {});

    if (options?.sort) {
      if (typeof options.sort === 'string' && options.sort === '$natural') {
        cursor = cursor.sort({ $natural: -1 });
      } else {
        cursor = cursor.sort(options.sort);
      }
    }

    if (options?.limit) {
      cursor = cursor.limit(options.limit);
    }

    if (options?.skip) {
      cursor = cursor.skip(options.skip);
    }

    const result = await cursor.toArray();

    return NextResponse.json({ documents: result }, { status: 200 });
  } catch (error) {
    console.error('Error processing request:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}