import express from 'express';
import MUUID from 'uuid-mongodb'
import { connectDB, closeDB } from "../mdbUtil.js";
import { Img } from "../models/core.js";


const imgRouter = express.Router();





const fetchImg = async (UUIDIn: string): Promise<Img> => 
{
  const UUID = MUUID.from(UUIDIn);
 
  const mdb = await connectDB();

  const collection = mdb.collection("images");

  const result = await collection.findOne({ _id: UUID });

  let UUIDResult: Img = { _id: '', URL: '', annotations: [] };

  if(result && '_id' in result && 'URL' in result && 'annotations' in result)
  {
    UUIDResult = { _id: result._id.toString(), URL: result.URL, annotations: result.annotations } as Img;
  }
  else
  {
    console.warn('Result does not match Img interface:', result);
  }

  return(UUIDResult);
}





// get projects by UUID or multiple comma-separated UUIDs
// returns a JSON array of projects
imgRouter.get("/UUID/:UUID", async (req, res, next) =>
{
  const UUIDs: string[] = req.params.UUID.split(",").map(UUID => UUID.trim());

  let imgOut: Img[] = [];

  try
  {
    for(const UUIDStr of UUIDs)
    {
      console.log("Attempting to fetch images by uuid => " + UUIDStr);

      const imgResult = await fetchImg(UUIDStr);
      imgOut.push(imgResult);
    }

    res.json(imgOut);
  }
  catch (error)
  {
    console.error('Error fetching image by UUID:', error);
    res.status(500).json({ error: 'Failed to fetch image by UUID' });
    return next(error);
  }
  finally
  {
     await closeDB();
  }
});

export default imgRouter;