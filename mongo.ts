
import { MongoClient } from 'mongodb'
export async function lookup(collection: string, varname: any): Promise<any[]> {
    let client, db;
    // try{
    let mongoUrl = "mongodb://localhost:27017";
    client = await MongoClient.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
    let dbName = "semtalkonline" 
    db = client.db(dbName);
    let coll = db.collection(collection);
    let result = coll.find({ "name": varname });
    // let result = await dCollection.countDocuments();
    // your other codes ....
    console.log('connected to database')
    return result.toArray();
    // }
    // catch(err){ console.error(err); } // catch any mongo error here
    // finally{ if (client) client.close(); } // make sure to close your connection after
}
export async function find(collection: string, filter: any): Promise<any[]> {
    let client, db;
    // try{
    let mongoUrl = "mongodb://localhost:27017";
    client = await MongoClient.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
    let dbName = "semtalkonline"
    db = client.db(dbName);
    if (filter == undefined) {
        filter = {};
    }
    let coll = db.collection(collection);
    let result = coll.find(filter);
    // let result = await dCollection.countDocuments();
    // your other codes ....
    console.log('connected to database')
    return result.toArray();
    // }
    // catch(err){ console.error(err); } // catch any mongo error here
    // finally{ if (client) client.close(); } // make sure to close your connection after
}
export async function save(collection: string, name: string, value: any) {
    let client, db;
    //try{
    let mongoUrl = "mongodb://localhost:27017";
    client = await MongoClient.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
    let dbName = "semtalkonline"
    db = client.db(dbName);
    let dCollection = db.collection(collection);
    // let v = JSON.parse(value);
    // let result = await dCollection.insertOne({ "name": name, "value": value });
    let result = await dCollection.updateOne({ "name": name }, { $set: { "value": value } }, { "upsert": true });
    return result.result;
    // }
    // catch(err){ console.error(err); } // catch any mongo error here
    // finally{ if (client) client.close(); } // make sure to close your connection after
}

export async function deletedocument(collection: string, name: string) {
    let client, db;
    //try{
    let mongoUrl = "mongodb://localhost:27017";
    client = await MongoClient.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
    let dbName = "semtalkonline"
    db = client.db(dbName);
    let dCollection = db.collection(collection);
    // let v = JSON.parse(value);
    // let result = await dCollection.insertOne({ "name": name, "value": value });
    let result = await dCollection.deleteMany({ "name": name });
    return result.result;
    // }
    // catch(err){ console.error(err); } // catch any mongo error here
    // finally{ if (client) client.close(); } // make sure to close your connection after
}

export async function findNames(collection: string, filter: any): Promise<any> {
    let client, db;
    // try{
    let mongoUrl = "mongodb://localhost:27017";
    client = await MongoClient.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
    let dbName = "semtalkonline"
    db = client.db(dbName);
    if (filter == undefined) {
        filter = {};
    }
    let coll = db.collection(collection);
    let result = coll.find({}, {
        projection: { name: 1 }
    });
    return result.toArray();;
    // }
    // catch(err){ console.error(err); } // catch any mongo error here
    // finally{ if (client) client.close(); } // make sure to close your connection after
}