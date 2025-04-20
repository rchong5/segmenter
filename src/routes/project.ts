import express from 'express';
import MUUID from 'uuid-mongodb'
import { connectDB, closeDB } from "../mdbUtil.js";
import { Project } from "../models/core.js";


const projectRouter = express.Router();





const fetchProjectByName = async (nameIn: string): Promise<Project> => 
{
  const mdb = await connectDB();

  const collection = mdb.collection("projects");

  const result = await collection.findOne({ name: nameIn });

  let UUIDResult: Project = { _id: '', name: '', annotated: 0, imgs: [] };

  if(result && '_id' in result && 'name' in result && 'annotated' in result && 'imgs' in result)
  {
    UUIDResult = { _id: result._id.toString(), name: result.name, annotated: result.annotated, imgs: result.imgs } as Project;
  }
  else
  {
    console.warn('Result does not match Project interface:', result);
  }

  return(UUIDResult);
}





const fetchProjectByUUID = async (UUIDIn: string): Promise<Project> => 
{
  const UUID = MUUID.from(UUIDIn);
 
  const mdb = await connectDB();

  const collection = mdb.collection("projects");

  const result = await collection.findOne({ _id: UUID });

  let UUIDResult: Project = { _id: '', name: '', annotated: 0, imgs: [] };

  if(result && '_id' in result && 'name' in result && 'annotated' in result && 'imgs' in result)
  {
    UUIDResult = { _id: result._id.toString(), name: result.name, annotated: result.annotated, imgs: result.imgs } as Project;
  }
  else
  {
    console.warn('Result does not match Project interface:', result);
  }

  return(UUIDResult);
}





// get projects by name or multiple comma-separated names
// returns a JSON array of projects
projectRouter.get("/name/:name", async (req, res, next) =>
  {
    const names: string[] = req.params.name.split(",").map(name => name.trim());
  
    let projectOut: Project[] = [];
  
    try
    {
      for(const nameStr of names)
      {
        console.log("Attempting to fetch projects by name => " + nameStr);
  
        const projectResult = await fetchProjectByName(nameStr);
        projectOut.push(projectResult);
      }
  
      res.json(projectOut);
    }
    catch (error)
    {
      console.error('Error fetching project by UUID:', error);
      res.status(500).json({ error: 'Failed to fetch project by UUID' });
      return next(error);
    }
    finally
    {
       await closeDB();
    }
  });





// get projects by UUID or multiple comma-separated UUIDs
// returns a JSON array of projects
projectRouter.get("/UUID/:UUID", async (req, res, next) =>
{
  const UUIDs: string[] = req.params.UUID.split(",").map(UUID => UUID.trim());

  let projectOut: Project[] = [];

  try
  {
    for(const UUIDStr of UUIDs)
    {
      console.log("Attempting to fetch projects by uuid => " + UUIDStr);

      const projectResult = await fetchProjectByUUID(UUIDStr);
      projectOut.push(projectResult);
    }

    res.json(projectOut);
  }
  catch (error)
  {
    console.error('Error fetching project by UUID:', error);
    res.status(500).json({ error: 'Failed to fetch project by UUID' });
    return next(error);
  }
  finally
  {
     await closeDB();
  }
});





export default projectRouter;