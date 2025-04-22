import express from 'express';
import MUUID from 'uuid-mongodb'
import { connectDB, closeDB } from "../mdbUtil.js";
import { Annotation, Img } from "../models/core.js"
import { fetchImg } from "./img.js";


const annotationRouter = express.Router();


interface AnnoArea
{
  UUID: string;
  area: number;
}





/*===========================================
utility functions
===========================================*/

const calculateAreaRank = async(target: string, targetArea: number, annotations: string[]): Promise<number> =>
{
  const areas: AnnoArea[] = [];

  areas.push({ UUID: target, area: targetArea });

  for(let i = 0; i < annotations.length; i++)
  {
    if(annotations[i] != target)
    {
      const annotationResult: Annotation = await fetchAnnotationByUUID(annotations[i]);
      areas.push({ UUID: annotations[i], area: annotationResult.area });
    }
  }

  areas.sort((a, b) => b.area - a.area);

  return(areas.findIndex(anno => anno.UUID === target) + 1);
}





/*===========================================
fetch (from database) functions
===========================================*/

export const fetchAnnotationByLabel = async (labelIn: string): Promise<Annotation> => 
{
  const mdb = await connectDB();

  const collection = mdb.collection("annotations");

  const result = await collection.findOne({ label: labelIn });

  let labelResult: Annotation = { _id: '', annotators: [], img: '', projects: [], label: '', area: 0, points: [] };

  if(result && '_id' in result && 'annotators' in result && 'img' in result && 'projects' in result && 'label' in result && 'area' in result && 'points' in result)
  {
    labelResult =
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

  return(labelResult);
}





export const fetchAnnotationByUUID = async (UUIDIn: string): Promise<Annotation> => 
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





export const fetchAnnotationAreaRankByUUID = async (UUIDIn: string): Promise<number> => 
{
  const UUID = MUUID.from(UUIDIn);

  const mdb = await connectDB();

  const collection = mdb.collection("annotations");

  const result = await collection.findOne({ _id: UUID });

  let UUIDResult: Annotation = { _id: '', annotators: [], img: '', projects: [], label: '', area: 0, points: [] };

  let rank: number = 0;

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

    const imgResult: Img = await fetchImg(UUIDResult.img);

    let annorray: string[] = imgResult.annotations;

    rank = (await calculateAreaRank(UUIDIn, UUIDResult.area, annorray)).valueOf();
  }
  else
  {
    console.warn('Result does not match Annotation interface:', result);
  }

  return(rank);
}





/*===========================================
routes to GET annotation area rank
===========================================*/

// get annotation area rank by UUID
// returns an integer value of the rank where 1 is the highest rank (most area)
annotationRouter.get("/UUID/:UUID/area/rank", async (req, res, next) =>
{
  try
  {
    console.log("Attempting to fetch annotation area rank by UUID => " + req.params.UUID);

    const annotationResult: number = await fetchAnnotationAreaRankByUUID(req.params.UUID);

    res.json(annotationResult);
  }
  catch (error)
  {
    console.error('Error fetching annotation area rank by UUID:', error);
    res.status(500).json({ error: 'Failed to fetch annotation area rank by UUID' });
    return next(error);
  }
  finally
  {
      await closeDB();
  }
});






/*===========================================
routes to GET full annotation documents
===========================================*/

// get annotations by label
// returns a JSON array of annotations
annotationRouter.get("/label/:label", async (req, res, next) =>
{
//    const UUIDs: string[] = req.params.UUID.split(",").map(UUID => UUID.trim());
  
    let annotationOut: Annotation[] = [];
  
    try
    {
      console.log("Attempting to fetch annotations by label => " + req.params.label);
  
      const annotationResult = await fetchAnnotationByLabel(req.params.label);
      annotationOut.push(annotationResult);
  
      res.json(annotationOut);
    }
    catch (error)
    {
      console.error('Error fetching annotation by label:', error);
      res.status(500).json({ error: 'Failed to fetch annotation by label' });
      return next(error);
    }
    finally
    {
       await closeDB();
    }
});





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

      const annotationResult = await fetchAnnotationByUUID(UUIDStr);
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