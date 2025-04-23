import { Db, MongoClient, ServerApiVersion } from "mongodb";

const mdb_inst: string = "segmenter";

var client: MongoClient | null = null;
var db: Db | null = null;


export async function connectDB(): Promise<Db>
{
  if(db)
  {
    return db;
  }

  try
  {
    process.loadEnvFile('.env');
    const conn_str: string = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}/?retryWrites=true&w=majority&appName=${process.env.DB_APP_NAME}`;

    client = new MongoClient(conn_str, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      }
    });
    
    await client.connect();
    
    db = client.db(mdb_inst);
    console.log('Successfully connected to MongoDB');
    
    return db;
  }
  catch (error)
  {
    console.error('Error connecting to MongoDB:', error);
    throw error;
  }

}





export async function closeDB(): Promise<void>
{
  if(client)
  {
      await client.close();
      db = null;
      console.log('MongoDB connection closed');
      console.log("");
  }
}




