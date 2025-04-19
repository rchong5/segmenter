import express from 'express';
import morgan from 'morgan';
import { Db } from "mongodb";
import { connectDB, closeDB } from "./mdbUtil.js";


const app = express();

//const annotatorsRouter = require('./routes/annotators');

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));


app.get("/", async (req, res) =>
{
   try
   {
     const db = await connectDB();
     const collection = db.collection("staff");
     const count = await collection.countDocuments({}, { hint: "_id_" });
     //const data = await collection.find({"UUID": {$regex:".*"} });
     //res.json(data);
      
      
     console.log("count = " + `${count}`);
     res.json(count);
   }
   catch (error)
   {
     console.error("Error fetching data:", error);
     res.status(500).send("Internal Server Error");
   }
   finally
   {
      await closeDB();
   }
});
 
const PORT = 3000;
app.listen(PORT, () => 
{
   console.log(`Server is running on port ${PORT}`);
});





console.log("here");




//module.exports = app;