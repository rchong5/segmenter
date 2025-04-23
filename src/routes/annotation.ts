import express from 'express';
import MUUID from 'uuid-mongodb'
import { connectDB, closeDB } from "../mdbUtil.js";
import { Annotation, Img, Pt } from "../models/core.js"
import { fetchImg } from "./img.js";
import { calcArea } from '../utils/calc.js';
import { updateProjectLattice, updateStaffLattice, updateImgLattice } from '../utils/lattice.js';
import { staffUUIDExists, projectUUIDExists, imgUUIDExists } from '../utils/validate.js';


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
  const UUIDObj = MUUID.from(UUIDIn);

  const mdb = await connectDB();

  const collection = mdb.collection("annotations");

  const result = await collection.findOne({ _id: UUIDObj });

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





export const fetchAnnotationByAnnotatorUUID = async (UUIDIn: string): Promise<Annotation[]> => 
{
  const UUIDObj = MUUID.from(UUIDIn);

  const mdb = await connectDB();

  const collection = mdb.collection("annotations");

  const result = collection.find({ annotators: { $in: [UUIDObj] } });

  let resultArray: Annotation[] = [];

  for await (const doc of result)
  {
    let UUIDResult: Annotation = { _id: '', annotators: [], img: '', projects: [], label: '', area: 0, points: [] };

    if(doc && '_id' in doc && 'annotators' in doc && 'img' in doc && 'projects' in doc && 'label' in doc && 'area' in doc && 'points' in doc)
    {
      UUIDResult =
      {
        _id: doc._id.toString(),
        annotators: doc.annotators,
        img: doc.img,
        projects: doc.projects,
        label: doc.label,
        area: doc.area,
        points: doc.points
      } as Annotation;

      resultArray.push(UUIDResult);
    }
    else
    {
      console.warn('Result does not match Annotation interface:', result);
    }
  }

  return(resultArray);
}





export const fetchAnnotationAreaRankByUUID = async (UUIDIn: string): Promise<number> => 
{
  const UUIDObj = MUUID.from(UUIDIn);

  const mdb = await connectDB();

  const collection = mdb.collection("annotations");

  const result = await collection.findOne({ _id: UUIDObj });

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

// get annotations by annotator's UUID
// returns a JSON array of annotations
annotationRouter.get("/annotator/UUID/:UUID", async (req, res, next) =>
{
    let annotationOut: Annotation[] = [];
  
    try
    {
      console.log("Attempting to fetch annotations by annotator's UUID => " + req.params.UUID);
  
      const annotationResult: Annotation[] = await fetchAnnotationByAnnotatorUUID(req.params.UUID);
      //annotationOut.push(annotationResult);
  
      res.json(annotationResult);
    }
    catch (error)
    {
      console.error("Error fetching annotations by annotator's UUID:", error);
      res.status(500).json({ error: "Failed to fetch annotations by annotator's UUID" });
      return next(error);
    }
    finally
    {
        await closeDB();
    }
});





// get annotations by label
// returns a JSON array of annotations
annotationRouter.get("/label/:label", async (req, res, next) =>
{
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
      console.log("Attempting to fetch annotations by UUID => " + UUIDStr);

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





/*===========================================
routes to POST annotation
===========================================*/

annotationRouter.post("/", async (req, res, next) =>
{
  const annotatorUUID = MUUID.from(req.body.annotator as string);
  const imgUUID = MUUID.from(req.body.img as string);
  const projectUUID = MUUID.from(req.body.project as string);
  const pts = req.body.points as Pt[];
  const label = req.body.label as string;


  try
  {
    if((await staffUUIDExists(annotatorUUID.toString())).valueOf())
    {
      if((await projectUUIDExists(projectUUID.toString())).valueOf())
      {
        if((await imgUUIDExists(imgUUID.toString())).valueOf())
        {
          const mdb = await connectDB();

          const collection = mdb.collection("annotations");
          
          const result = await collection.insertOne(
                                                    { // @ts-ignore
                                                      _id: MUUID.v4(),
                                                      annotators: [annotatorUUID],
                                                      img: imgUUID,
                                                      projects: [projectUUID],
                                                      label: label,
                                                      area: calcArea(pts),
                                                      points: pts
                                                    });


          const annotatorArray: string[] = [annotatorUUID.toString()];
          const projectArray: string[] = [projectUUID.toString()];
          const imgArray: string[] = [imgUUID.toString()];
          const annotationArray: string[] = [result.insertedId.toString()];

          await updateStaffLattice(annotatorArray, projectArray, imgArray, annotationArray);

          await updateProjectLattice(projectArray, annotatorArray, imgArray, annotationArray);

          await updateImgLattice(imgArray, projectArray, annotatorArray, annotationArray);


          if(result)
          {
            let successStr: string = "[Insert Annotation] Successfully inserted a new annotation (" + result.insertedId.toString();
            successStr += ") for annotator (" + annotatorUUID.toString() + ") and image (" + imgUUID.toString() + ") and project (" + projectUUID.toString() + ")";

            res.status(201).send(successStr);
          }
          else
          {
            let errorStr: string = "[Insert Annotation] ERROR: Failed to create a new annotation for annotator (" + annotatorUUID.toString();
            errorStr += ") and image (" + imgUUID.toString() + ") and project (" + projectUUID.toString() + ")";

            res.status(500).send(errorStr);
          }

        }
        else
        {
          throw new Error("[Insert Annotation] ERROR: Specified img does not exist. (" + imgUUID.toString() + ")");
        }
      }
      else
      {
        throw new Error("[Insert Annotation] ERROR: Specified project does not exist. (" + projectUUID.toString() + ")");
      }
    }
    else
    {
      throw new Error("[Insert Annotation] ERROR: Specified annotator is not a member of staff. (" + annotatorUUID.toString() + ")");
    }

  }
  catch (error)
  {
    let errorMessage: string = "[Insert Annotation] ERROR: ";
    errorMessage += "Failed to insert annotation by annotator " + annotatorUUID.toString();
    errorMessage += " and image " + imgUUID.toString() + " and project " + projectUUID.toString();

    console.error(errorMessage, error);

    res.status(500).json({ error: errorMessage});
    return next(error);
  }
  finally
  {
      await closeDB();
  }
});





/*===========================================
routes to PUT annotation
===========================================*/

annotationRouter.put("/", async (req, res, next) =>
{
  const annotationUUID = MUUID.from(req.body.annotation as string);
  const imgUUID = MUUID.from(req.body.img as string);
  const pts = req.body.points as Pt[];
  const label = req.body.label as string;

  const annotatorArray: string[] = req.body.annotators as string[];
  const projectArray: string[] = req.body.projects as string[];

  
  try
  {
    // confirm all annotators in the array exist while building the annotatorUUID array
    let annotatorUUIDs: MUUID.MUUID[] = [];

    for(let i = 0; i < annotatorArray.length; i++)
    {
      if(!(await staffUUIDExists(annotatorArray[i])).valueOf())
      {
        throw new Error("[Update Annotation] ERROR: Specified annotator is not a member of staff. (" + annotatorArray[i].toString() + ")");
      }
      else
      {
        annotatorUUIDs.push(MUUID.from(annotatorArray[i]));
      }
    }


    // confirm all projects in the array exist
    let projectUUIDs: MUUID.MUUID[] = [];

    for(let i = 0; i < projectArray.length; i++)
    {
      if(!(await projectUUIDExists(projectArray[i])).valueOf())
      {
        throw new Error("[Update Annotation] ERROR: Specified project does not exist. (" + projectArray[i].toString() + ")");
      }
      else
      {
        projectUUIDs.push(MUUID.from(projectArray[i]));
      }
    }


    if((await imgUUIDExists(imgUUID.toString())).valueOf())
    {
      const mdb = await connectDB();

      const collection = mdb.collection("annotations");

      const result = await collection.updateOne(
                                                { _id: annotationUUID },
                                                { $set: 
                                                  { annotators: annotatorUUIDs,
                                                    img: imgUUID,
                                                    projects: projectUUIDs,
                                                    label: label,
                                                    area: calcArea(pts),
                                                    points: pts
                                                  }});


      const imgArray: string[] = [imgUUID.toString()];
      const annotationArray: string[] = [annotationUUID.toString()];

      await updateStaffLattice(annotatorArray, projectArray, imgArray, annotationArray);

      await updateProjectLattice(projectArray, annotatorArray, imgArray, annotationArray);

      await updateImgLattice(imgArray, projectArray, annotatorArray, annotationArray);


      let annotatorStr: string = "(";

      for(let i = 0; i < annotatorArray.length; i++)
      {
        annotatorStr += annotatorArray[i].toString();

        if(i < annotatorArray.length - 1)
        {
          annotatorStr += ", ";
        }
      }

      annotatorStr += ")";


      let projectStr: string = "(";

      for(let i = 0; i < projectArray.length; i++)
      {
        projectStr += projectArray[i].toString();

        if(i < projectArray.length - 1)
        {
          projectStr += ", ";
        }
      }

      projectStr += ")";

      let inputStr: string = annotationUUID.toString() + ") for annotators " + annotatorStr;
      inputStr += " and image (" + imgUUID.toString() + ") and projects " + projectStr;


      if(result)
      {
        let successStr: string = "[Update Annotation] Successfully updated annotation (" + inputStr;

        res.status(201).send(successStr);
      }
      else
      {
        let errorStr: string = "[Update Annotation] ERROR: Failed to update annotation (" + inputStr

        res.status(500).send(errorStr);
      }

    }
    else
    {
      throw new Error("[Update Annotation] ERROR: Specified img does not exist. (" + imgUUID.toString() + ")");
    }

      
  }
  catch (error)
  {
    let errorMessage: string = "[Update Annotation] ERROR: Failed to update annotation (" + annotationUUID.toString() + ")";

    console.error(errorMessage, error);

    res.status(500).json({ error: errorMessage});
    return next(error);
  }
  finally
  {
    await closeDB();
  }
});


export default annotationRouter;