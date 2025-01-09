import { MongoClient, ServerApiVersion } from "mongodb";

const uri = "";

const Handler = async (req, res) => {
  if (req.method === "POST") {
    const data = req.body;

    const client = new MongoClient(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverApi: ServerApiVersion.v1,
    });

    client.connect(async (err) => {
      const meetupCollection = client.db("meetups-app").collection("meetups");
      const result = await meetupCollection.insertOne(data);
      console.log(result);
      client.close();
      res.status(201).json({ message: "Meetup inserted!" });
    });

    // const db = client.db("meetups-app");
    // const meetupCollection = db.collection("meetups");
    // const result = await meetupCollection.insertOne(data);
    // console.log(result);
    // client.close();
  }
};

export default Handler;
