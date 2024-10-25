import { MongoClient, Db } from 'mongodb';

let client: MongoClient | null = null;

async function dbConnect(uri: string, database: string | null): Promise<Db> {
  if (!client) {
    client = new MongoClient(uri);
    await client.connect();
  }

  if (database) {
    return client.db(database);
  } else {
    return client.db();
  }
}

export default dbConnect;