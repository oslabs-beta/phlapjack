import { MongoClient } from '../deps.ts'
const client = new MongoClient();

await client.connect({
  tls: true,
  db:'',
  servers: [
    {
      host: "hostcluster2",
      port: 27017,
    },
  ],
  credential: {
    username: "userName2",
    password: "passWord2",
    db: "database2",
    mechanism: "SCRAM-SHA-1",
  },
});

interface model6{
  
}

const db = await client.database("database2");
const model6 = await db.collection("model6");

console.log('Successfully connected to model6!')
      