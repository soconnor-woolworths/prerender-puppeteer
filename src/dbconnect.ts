const { MongoClient, ServerApiVersion } = require('mongodb');

export const dbConnection = (hashedUrl: String) => {
  const uri =
    'mongodb+srv://hawykeye-prerender-user:6vfxSDABMAutWWTB@cluster0.bghoy.mongodb.net/?retryWrites=true&w=majority';
  const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverApi: ServerApiVersion.v1,
  });
  client.connect(async (err: any) => {
    const collection = client.db('HawkeyePrerender').collection('LookupUrl');
    const currentTimestamp = new Date();
    const lastUpdated = currentTimestamp
      .toISOString()
      .replace(/T/, ' ')
      .replace(/\..+/, '');
    const expiryDate = new Date(
      currentTimestamp.setDate(currentTimestamp.getDate() + 30)
    )
      .toISOString()
      .replace(/T/, ' ')
      .replace(/\..+/, '');
    try {
      await collection.updateMany(
        {
          hashedUrl,
        },
        [
          {
            $set: {
              hashedUrl,
              lastUpdated,
              expiryDate,
            },
          },
        ],
        {
          upsert: true,
        }
      );
      const data = await collection.find({}).toArray();
      console.log('DB records:');
      console.table(data);
    } catch {
      console.log(err);
    }

    // perform actions on the collection object
    client.close();
  });
};
