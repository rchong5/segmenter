import express from 'express';
import MUUID from 'uuid-mongodb'
import { connectDB, closeDB } from "../mdbUtil.js";
import { Annotation } from "../models/core.js";


const annotationRouter = express.Router();





export const fetchAnnotation = async (UUIDIn: string): Promise<Annotation> => 
{
  const UUID = MUUID.from(UUIDIn);

  const mdb = await connectDB();

  const collection = mdb.collection("annotations");

  const result = await collection.findOne({ _id: UUID });

  let UUIDResult: Annotation = { _id: '', annotators: [], img: '', projects: [], label: '', area: 0, points: [] };

  if(result && '_id' in result && 'annotators' in result && 'img' in result && 'projects' in result && 'label' in result && 'area' in result && 'points' in result)
  {
    UUIDResult =
      {
        _id: result._id.toString(),
        annotators: result.annotators,
        img: result.img,
        projects: result.projects,
        label: result.label,
        area: result.area,
        points: result.points
      } as Annotation;
  }
  else
  {
    console.warn('Result does not match Annotation interface:', result);
  }

  return(UUIDResult);
}





// get annotations by UUID or multiple comma-separated UUIDs
// returns a JSON array of annotations
annotationRouter.get("/UUID/:UUID", async (req, res, next) =>
{
  const UUIDs: string[] = req.params.UUID.split(",").map(UUID => UUID.trim());

  let annotationOut: Annotation[] = [];

  try
  {
    for(const UUIDStr of UUIDs)
    {
      console.log("Attempting to fetch annotations by uuid => " + UUIDStr);

      const annotationResult = await fetchAnnotation(UUIDStr);
      annotationOut.push(annotationResult);
    }

    res.json(annotationOut);
  }
  catch (error)
  {
    console.error('Error fetching annotation by UUID:', error);
    res.status(500).json({ error: 'Failed to fetch annotation by UUID' });
    return next(error);
  }
  finally
  {
     await closeDB();
  }
});

export default annotationRouter;