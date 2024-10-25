import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { collectionsAlias } from '@/constants/collectionsAlias';

export async function GET(req: NextRequest) {
  const database = req.headers.get('X-DB-Name');
  const apiKey = req.headers.get('X-API-Key');
  if (!apiKey || !database) {
    return NextResponse.json({ error: 'apiKey 또는 database가 없습니다.' }, { status: 400 });
  }

  try {
    const db = await dbConnect(apiKey, database);

    const collections = await db.listCollections().toArray();

    const collectionDetails = await Promise.all(
      collections.map(async (collection) => {
        const collectionInstance = db.collection(collection.name);
        const documentCount = await collectionInstance.countDocuments();
        return {
          name: collection.name,
          alias: collectionsAlias[collection.name] || collection.name,
          documentCount: documentCount,
        };
      })
    );

    return NextResponse.json({ collections: collectionDetails });
  } catch (error) {
    console.error('Error in GET route:', error);
    return NextResponse.json({ error: 'Failed to fetch collections' }, { status: 500 });
  }
}