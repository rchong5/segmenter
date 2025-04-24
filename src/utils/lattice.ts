import MUUID from 'uuid-mongodb'
import { connectDB } from "../mdbUtil.js";
import { imgHasAnnotation } from "./validate.js"





const upsertStaffLattice = async (staffUUIDIn: string, projectUUIDIn: string, imgUUIDIn: string, annotationUUIDIn: string) => 
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





export const updateStaffLattice = async (staffUUIDsIn: string[], projectUUIDsIn: string[], imgUUIDsIn: string[], annotationUUIDsIn: string[]) => 
{
    for(let i = 0; i < staffUUIDsIn.length; i++)
    {
        for(let j = 0; j < projectUUIDsIn.length; j++)
        {
            for(let k = 0; k < imgUUIDsIn.length; k++)
            {
                for(let l = 0; l < annotationUUIDsIn.length; l++)
                {
                    await upsertStaffLattice(staffUUIDsIn[i], projectUUIDsIn[j], imgUUIDsIn[k], annotationUUIDsIn[l]);
                }
            }
        }
    }    
}





const upsertProjectLattice = async (projectUUIDIn: string, annotatorUUIDIn: string, imgUUIDIn: string, annotationUUIDIn: string) => 
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
                throw new Error("[upsertProjectLattice] ERROR: Unable to update the value of annotated to " + a + " for project (" + projectUUIDIn.toString() + ")");
            }
        }
        else
        {
            console.warn('[upsertProjectLattice] Result unexpectedly missing imgs array', imgResult);
        }
        
        
    }
}





export const updateProjectLattice = async (projectUUIDsIn: string[], annotatorUUIDsIn: string[], imgUUIDsIn: string[], annotationUUIDsIn: string[]) => 
{
    for(let i = 0; i < projectUUIDsIn.length; i++)
    {
        for(let j = 0; j < annotatorUUIDsIn.length; j++)
        {
            for(let k = 0; k < imgUUIDsIn.length; k++)
            {
                for(let l = 0; l < annotationUUIDsIn.length; l++)
                {
                    await upsertProjectLattice(projectUUIDsIn[i], annotatorUUIDsIn[j], imgUUIDsIn[k], annotationUUIDsIn[l]);
                }
            }
        }
    }   
}





const upsertImgLattice = async (imgUUIDIn: string, projectUUIDIn: string, annotatorUUIDIn: string, annotationUUIDIn: string) => 
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





export const updateImgLattice = async (imgUUIDsIn: string[], projectUUIDsIn: string[], annotatorUUIDsIn: string[], annotationUUIDsIn: string[]) => 
{
    for(let i = 0; i < imgUUIDsIn.length; i++)
    {
        for(let j = 0; j < projectUUIDsIn.length; j++)
        {
            for(let k = 0; k < annotatorUUIDsIn.length; k++)
            {
                for(let l = 0; l < annotationUUIDsIn.length; l++)
                {
                    await upsertImgLattice(imgUUIDsIn[i], projectUUIDsIn[j], annotatorUUIDsIn[k], annotationUUIDsIn[l]);
                }
            }
        }
    }   
}