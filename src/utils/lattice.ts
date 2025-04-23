import MUUID from 'uuid-mongodb'
import { connectDB } from "../mdbUtil.js";
import { imgHasAnnotation } from "./validate.js"





export const updateStaffLattice = async (staffUUIDIn: string, projectUUIDIn: string, imgUUIDIn: string, annotationUUIDIn: string) => 
{
    const mdb = await connectDB();

    const collection = mdb.collection("staff");

    const result = await collection.updateOne(
                                                    {
                                                        _id: MUUID.from(staffUUIDIn)
                                                    },
                                                    {
                                                        $addToSet:  {
                                                                        projects: MUUID.from(projectUUIDIn),
                                                                        imgs: MUUID.from(imgUUIDIn),
                                                                        annotations: MUUID.from(annotationUUIDIn)
                                                                    }
                                                    }
                                                );
}





export const updateProjectLattice = async (projectUUIDIn: string, annotatorUUIDIn: string, imgUUIDIn: string, annotationUUIDIn: string) => 
{
    const mdb = await connectDB();

    const collection = mdb.collection("projects");

    const result = await collection.updateOne(
                                                    {
                                                        _id: MUUID.from(projectUUIDIn)
                                                    },
                                                    {
                                                        $addToSet:  {
                                                                        annotators: MUUID.from(annotatorUUIDIn),
                                                                        imgs: MUUID.from(imgUUIDIn),
                                                                        annotations: MUUID.from(annotationUUIDIn)
                                                                    }
                                                    }
                                                );

    if(result)
    {
        const imgResult = await collection.findOne({ _id: MUUID.from(projectUUIDIn) }, {projection: {imgs: 1}});
        
        if(imgResult && 'imgs' in imgResult)
        {
            const imgArray: string[] = imgResult.imgs as string[];

            let annotated: number = 0;

            for(let i = 0; i < imgArray.length; i++)
            {
                if(await imgHasAnnotation(imgArray[i]))
                {
                    annotated++;
                }
            }

            const a: number = (annotated / imgArray.length) * 100;

            const annotatedResult = await collection.updateOne({ _id: MUUID.from(projectUUIDIn) }, { $set: { annotated: a }});

            if(!annotatedResult)
            {
                throw new Error("[updateProjectLattice] ERROR: Unable to update the value of annotated to " + a + " for project (" + projectUUIDIn.toString() + ")");
            }
        }
        else
        {
            console.warn('[updateProjectLattice] Result unexpectedly missing imgs array', imgResult);
        }
        
        
    }
}





export const updateImgLattice = async (imgUUIDIn: string, projectUUIDIn: string, annotatorUUIDIn: string, annotationUUIDIn: string) => 
{
    const mdb = await connectDB();

    const collection = mdb.collection("imgs");

    const result = await collection.updateOne(
                                                    {
                                                        _id: MUUID.from(imgUUIDIn)
                                                    },
                                                    {
                                                        $addToSet:  {
                                                                        projects: MUUID.from(projectUUIDIn),
                                                                        annotators: MUUID.from(annotatorUUIDIn),
                                                                        annotations: MUUID.from(annotationUUIDIn)
                                                                    }
                                                    }
                                                );
}
    