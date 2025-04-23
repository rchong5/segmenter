import MUUID from 'uuid-mongodb'
import { connectDB } from "../mdbUtil.js";





export const staffUUIDExists = async (UUIDIn: string): Promise<boolean> => 
{
    const UUIDObj = MUUID.from(UUIDIn);

    const mdb = await connectDB();

    const collection = mdb.collection("staff");

    const result = await collection.findOne({ _id: UUIDObj }, {projection: {name: 0, projects: 0, imgs: 0, annotations: 0}});

    let doesExist: boolean = false;

    if(result && '_id' in result)
    {
        if(result._id.toString() === UUIDObj.toString())
        {
            doesExist = true;
        }
    }
    else
    {
        console.warn('[staffUUIDExists] Result does not contain expected _id', result);
    }

    return(doesExist);
}





export const projectUUIDExists = async (UUIDIn: string): Promise<boolean> => 
{
    const UUIDObj = MUUID.from(UUIDIn);
    
    const mdb = await connectDB();

    const collection = mdb.collection("projects");

    const result = await collection.findOne({ _id: UUIDObj }, {projection: {name: 0, annotated: 0, annotators: 0, imgs: 0, annotations: 0}});

    let doesExist: boolean = false;

    if(result && '_id' in result)
    {
        if(result._id.toString() === UUIDObj.toString())
        {
            doesExist = true;
        }
    }
    else
    {
        console.warn('[projectUUIDExists] Result does not contain expected _id', result);
    }

    return(doesExist);
}





export const imgUUIDExists = async (UUIDIn: string): Promise<boolean> => 
{
    const UUIDObj = MUUID.from(UUIDIn);

    const mdb = await connectDB();

    const collection = mdb.collection("imgs");

    const result = await collection.findOne({ _id: UUIDObj }, {projection: {URL: 0, projects: 0, annotators: 0, annotations: 0}});

    let doesExist: boolean = false;

    if(result && '_id' in result)
    {
        if(result._id.toString() === UUIDObj.toString())
        {
            doesExist = true;
        }
    }
    else
    {
        console.warn('[imgUUIDExists] Result does not contain expected _id', result);
    }

    return(doesExist);
}





export const imgHasAnnotation = async (UUIDIn: string): Promise<boolean> => 
{
    const UUIDObj = MUUID.from(UUIDIn);

    const mdb = await connectDB();

    const collection = mdb.collection("imgs");

    const result = await collection.findOne({ _id: UUIDObj }, {projection: {annotations: 1}});

    let hasAnnotation: boolean = false;

    if(result && 'annotations' in result)
    {
        const annotationArray: string [] = result.annotations as string[];

        if(annotationArray.length >= 1)
        {
            hasAnnotation = true;
        }
    }
    else
    {
        console.warn('[imgHasAnnotation] Result unexpectedly missing annotations array', result);
    }

    return(hasAnnotation);
}