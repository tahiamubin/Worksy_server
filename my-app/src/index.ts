import express, { Request, Response } from "express";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const port = process.env.PORT || 8000;

import cors from "cors";
app.use(cors({ origin: process.env.FRONTEND }));

import { Collection, MongoClient, ObjectId, ServerApiVersion } from "mongodb";
const uri = process.env.MONGODB_URI;

app.use(express.json());

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

let projectCollection: Collection<Document>;
async function run() {
  try {
    // await client.connect();

    const database = client.db("worksy");
    const projectCollection = database.collection("Projects");

    // project

    app.post("/project", async (req: Request, res: Response) => {
      try {
        const data = await req.body;
        const result = await projectCollection.insertOne(data);
        res.send(result);
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Unknown error";
        res.status(500).json({ error: message });
      }
    });

    app.get("/project/:id", async (req: Request, res: Response) => {
      try {
        
        const id = req.params.id;
        const query = {
          _id: new ObjectId(id),
        };
        const result = await projectCollection.findOne(query);
        res.json(result);
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Unknown error";
        res.status(500).json({ error: message });
      }
    });

    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!",
    );
  } finally {
    // Ensures that the client will close when you finish/error
    //await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req: Request, res: Response) => {
  res.send("Server is running");
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
