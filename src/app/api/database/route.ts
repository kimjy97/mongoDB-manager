import { NextRequest, NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';

export async function GET(req: NextRequest) {
  const apiKey = req.headers.get('X-API-Key');
  if (!apiKey) {
    return NextResponse.json({ error: 'apikey가 없습니다.' }, { status: 500 });
  }

  try {
    const client = new MongoClient(apiKey);
    await client.connect();

    const admin = client.db().admin();
    const dbList = await admin.listDatabases();

    await client.close();

    return new Response(JSON.stringify(dbList.databases), { status: 200 });
  } catch (error: any) {
    return new Response(JSON.stringify({ message: error.message }), { status: 500 });
  }
}