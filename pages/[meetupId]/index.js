import { Fragment } from "react";
import MeetupDetails from "../../components/meetups/MeetupDetails";
import { MongoClient, ServerApiVersion, ObjectId } from "mongodb";
import Head from "next/head";

const uri =
  "mongodb+srv://Admin:Azertier1@devcluster.lwvq1xo.mongodb.net/?retryWrites=true&w=majority";

const MeetupDetailsPage = (props) => {
  return (
    <Fragment>
      <Head>
        <title>{props.meetup.id}</title>
        <meta name="description" content={props.meetup.description} />
      </Head>
      <MeetupDetails {...props.meetup} />
    </Fragment>
  );
};

export async function getStaticPaths() {
  // fetch data from mongoDB atlas (cloud)

  const client = await MongoClient.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverApi: ServerApiVersion.v1,
  });

  const meetupCollection = client.db("meetups-app").collection("meetups");

  const meetupsIds = await meetupCollection.find({}, { _id: 1 }).toArray();

  client.close();

  return {
    fallback: "blocking",
    paths: meetupsIds.map((meetup) => ({
      params: { meetupId: meetup._id.toString() },
    })),
  };
}

export async function getStaticProps(context) {
  const meetupId = context.params.meetupId;

  // fetch data from mongoDB atlas (cloud)
  const client = await MongoClient.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverApi: ServerApiVersion.v1,
  });

  const meetupCollection = client.db("meetups-app").collection("meetups");

  const selectedMeetup = await meetupCollection.findOne({
    _id: ObjectId(meetupId),
  });

  client.close();

  return {
    props: {
      meetup: {
        id: selectedMeetup._id.toString(),
        image: selectedMeetup.image,
        address: selectedMeetup.address,
        description: selectedMeetup.description,
        title: selectedMeetup.title,
      },
    },
    // incremental static generation
    // revalidate: 1,
  };
}

export default MeetupDetailsPage;
