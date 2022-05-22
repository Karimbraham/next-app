import MeetupList from "../components/meetups/MeetupList";
import { MongoClient, ServerApiVersion } from "mongodb";
import Head from "next/head";
import { Fragment } from "react";

const Homepage = (props) => {
  return (
    <Fragment>
      <Head>
        <title>React Meetups</title>
        <meta name="description" content="Browse a list of meetups" />
      </Head>
      <MeetupList meetups={props.meetups} />
    </Fragment>
  );
};

export async function getStaticProps() {
  // fetch data from mongoDB atlas (cloud)
  const uri =
    "mongodb+srv://Admin:Azertier1@devcluster.lwvq1xo.mongodb.net/?retryWrites=true&w=majority";

  const client = await MongoClient.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverApi: ServerApiVersion.v1,
  });

  const meetupCollection = client.db("meetups-app").collection("meetups");

  const meetups = await meetupCollection.find().toArray();

  client.close();

  return {
    props: {
      meetups: meetups.map((meetup) => ({
        title: meetup.title,
        image: meetup.image,
        address: meetup.address,
        id: meetup._id.toString(),
      })),
    },
    // incremental static generation
    // revalidate: 1,
  };
}

// export async function getServerSideProps(context) {
//   const req = context.req;
//   const res = context.res;

//   return {
//     props: {
//       meetups: DUMMY_DATA,
//     },
//   };
// }

export default Homepage;
