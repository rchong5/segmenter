import express from 'express';
import MUUID from 'uuid-mongodb'
import { connectDB, closeDB } from "../mdbUtil.js";
import { Staff } from "../models/core.js";


const staffRouter = express.Router();





export const fetchStaff = async (UUIDIn: string): Promise<Staff> => 
{
  const UUID = MUUID.from(UUIDIn);
 
  const mdb = await connectDB();

  const collection = mdb.collection("staff");

  const result = await collection.findOne({ _id: UUID });

  let UUIDResult: Staff = { _id: '', name: '', projects: [], imgs: [], annotations: [] };

  if(result && '_id' in result && 'name' in result && 'projects' in result && 'imgs' in result && 'annotations' in result)
  {
    UUIDResult =
      {
        _id: result._id.toString(),
        name: result.name,
        projects: result.projects,
        imgs: result.imgs,
        annotations: result.annotations
      } as Staff;
  }
  else
  {
    console.warn('Result does not match Staff interface:', result);
  }

  return(UUIDResult);
}





// get staff by UUID or multiple comma-separated UUIDs
// returns a JSON array of staff
staffRouter.get("/UUID/:UUID", async (req, res, next) =>
{
  const UUIDs: string[] = req.params.UUID.split(",").map(UUID => UUID.trim());

  let staffOut: Staff[] = [];

  try
  {
    for(const UUIDStr of UUIDs)
    {
      console.log("Attempting to fetch staff by uuid => " + UUIDStr);

      const staffResult = await fetchStaff(UUIDStr);
      staffOut.push(staffResult);
    }

    res.json(staffOut);
  }
  catch (error)
  {
    console.error('Error fetching staff by UUID:', error);
    res.status(500).json({ error: 'Failed to fetch staff by UUID' });
    return next(error);
  }
  finally
  {
     await closeDB();
  }
});

export default staffRouter;