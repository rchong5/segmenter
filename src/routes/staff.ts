import express from 'express';
import MUUID from 'uuid-mongodb'
import { connectDB, closeDB } from "../mdbUtil.js";
import { Staff } from "../models/core.js";


const staffRouter = express.Router();





const fetchStaff = async (UUIDIn: string): Promise<Staff> => 
{
  const UUID = MUUID.from(UUIDIn);
 
  const mdb = await connectDB();

  const collection = mdb.collection("staff");

  const result = await collection.findOne({ _id: UUID });

  let UUIDResult: Staff = { _id: '', name: '' };

  if(result && '_id' in result && 'name' in result)
  {
    UUIDResult = { _id: result._id.toString(), name: result.name } as Staff;
  }
  else
  {
    console.warn('Result does not match UUIDJSON interface:', result);
  }

  return(UUIDResult);
}





// get staff by UUID or multiple comma-separated UUIDs
// returns a JSON array of staff
staffRouter.get("/:UUID", async (req, res, next) =>
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