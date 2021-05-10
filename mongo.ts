
import { MongoClient, Db, Collection, CollationDocument } from 'mongodb'
import { createCipheriv, createDecipheriv, randomBytes } from 'crypto'

function encrypt(text: string) {
    const algorithm = 'aes-256-ctr';
    const secretKey = process.env.key;
    const siv = process.env.iv;
    // const iv = randomBytes(16);
    var cipher = createCipheriv(algorithm, secretKey, Buffer.from(siv, "hex"));

    const encrypted = Buffer.concat([cipher.update(text), cipher.final()]);
    return encrypted.toString('hex');
}

function decrypt(text: string) {
    const algorithm = 'aes-256-ctr';
    const secretKey = process.env.key;
    const siv = process.env.iv;
    var decipher = createDecipheriv(algorithm, secretKey, Buffer.from(siv, "hex"));
    var dec = decipher.update(text, 'hex', 'utf8')
    dec += decipher.final('utf8');
    return dec;
}
let defaultcon = JSON.stringify({
    "connect": process.env.CONNECTION_STRING,
    "database": process.env.DBName
});

export function encode(connection: string, database: string): string {
    let con = JSON.stringify({
        "connect": connection,
        "database": database
    });
    return encrypt(con);
}
// aef864f1cb11a4d5b9cd6421b56c113c7f7c9f17efeee15e1c03d3c67d55d6a832eb757e6e7a53cb9b1d54c74e73d291102e64b62818fb4cfd3feb6c6e76b12c54ef


export async function clone(collection: string, destcollection: string, desturl: string, token?: any): Promise<any> {
    let client: MongoClient;
    try {
        let mongoUrl = process.env.CONNECTION_STRING;
        let dbname = process.env.DBName;
        if (token) {
            let ts = JSON.parse(decrypt(token));
            mongoUrl = ts["connect"];
            dbname = ts["database"]
        }
        client = await MongoClient.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
        let db: Db = client.db(dbname);
        let coll: Collection = db.collection(collection);
        let result = await coll.find({});
        let res = await result.toArray();
        client.close();

        let client2 = await MongoClient.connect(desturl, { useNewUrlParser: true, useUnifiedTopology: true });
        let db2 = client2.db(dbname);
        let coll2 = db2.collection(destcollection);
        coll2.drop();
        let result2 = await coll2.insertMany(res);
        let res2 = await result2.result;
        client2.close();

        return res2;
    }
    catch (err) { console.error(err); }
}

export async function clonedb(desturl: string, destdbname: string, token?: any): Promise<any> {
    let client: MongoClient;
    try {
        let mongoUrl = process.env.CONNECTION_STRING;
        let dbname = process.env.DBName;
        if (token) {
            let ts = JSON.parse(decrypt(token));
            mongoUrl = ts["connect"];
            dbname = ts["database"]
        }
        client = await MongoClient.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
        let db = client.db(dbname);

        if (desturl == undefined && destdbname == undefined) {
            throw new Error("server or dbname need to be different!");
        }

        if (desturl == undefined) {
            desturl = mongoUrl;
        }

        if (destdbname == undefined) {
            destdbname = dbname;
        }
        let client2 = await MongoClient.connect(desturl, { useNewUrlParser: true, useUnifiedTopology: true });
        let db2: Db = client2.db(destdbname);

        const cols = await db.listCollections().toArray();
        for (let c of cols) {
            let cname = c.name;
            let coll = db.collection(cname);
            let result = await coll.find({});
            let res = await result.toArray();
            let coll2 = db2.collection(cname);
            try {
                coll2.drop();
            } catch (e) {

            }
            if (res.length > 0) {
                await coll2.insertMany(res);
            }
        }
        client.close();
        const cols2 = await db2.listCollections().toArray();
        client2.close();
        return cols2;
    }
    catch (err) { console.error(err); }
}

export async function getvalue(collection: string, name: any, attr: string, token?: any): Promise<any> {
    let client: MongoClient;
    try {
        let mongoUrl = process.env.CONNECTION_STRING;
        let dbname = process.env.DBName;
        if (token) {
            let ts = JSON.parse(decrypt(token));
            mongoUrl = ts["connect"];
            dbname = ts["database"]
        }
        client = await MongoClient.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
        let db = client.db(dbname);
        let coll = db.collection(collection);
        let result = await coll.find({ "name": name });
        let res: any;
        let ar: any[] = await result.toArray();
        if (ar.length > 0) {
            let item = ar[0];
            res = item[attr];
        }
        client.close();
        return res;
    }
    catch (err) { console.error(err); }

}
export async function setvalue(collection: string, name: any, attr: string, value: any, token?: any): Promise<any> {
    let client: MongoClient;
    try {
        let mongoUrl = process.env.CONNECTION_STRING;
        let dbname = process.env.DBName;
        if (token) {
            let ts = JSON.parse(decrypt(token));
            mongoUrl = ts["connect"];
            dbname = ts["database"]
        }
        client = await MongoClient.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
        let db = client.db(dbname);
        let coll = db.collection(collection);
        let v = {};
        v[attr] = value;
        let result = await coll.updateOne({ "name": name }, { $set: v });
        let res = await result.result;
        client.close();
        return res;
    }
    catch (err) { console.error(err); }
}

export async function find(collection: string, filter: any, token?: any): Promise<any> {
    let client: MongoClient;
    try {
        let mongoUrl = process.env.CONNECTION_STRING;
        let dbname = process.env.DBName;
        if (token) {
            let ts = JSON.parse(decrypt(token));
            mongoUrl = ts["connect"];
            dbname = ts["database"]
        }
        client = await MongoClient.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
        let db = client.db(dbname);
        let coll = db.collection(collection);
        if (filter == undefined) {
            filter = {};
        } else {
            delete filter["token"];
            delete filter["collection"];
        }
        let result = await coll.find(filter);
        let res = await result.toArray();
        client.close();
        return res;
    }
    catch (err) { console.error(err); }
}
export async function rename(collection: string, name: string, value: any, token?: any): Promise<any> {
    let client: MongoClient;
    try {
        let mongoUrl = process.env.CONNECTION_STRING;
        let dbname = process.env.DBName;
        if (token) {
            let ts = JSON.parse(decrypt(token));
            mongoUrl = ts["connect"];
            dbname = ts["database"]
        }
        client = await MongoClient.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
        let db = client.db(dbname);
        let coll = db.collection(collection);
        let result = await coll.updateOne({ "name": name }, { $set: { "name": value } });
        let res = await result.result;
        client.close();
        return res;
    }
    catch (err) { console.error(err); }
}
export async function save(collection: string, name: string, value: any, token?: any): Promise<any> {
    let client: MongoClient;
    try {
        let mongoUrl = process.env.CONNECTION_STRING;
        let dbname = process.env.DBName;
        if (token) {
            let ts = JSON.parse(decrypt(token));
            mongoUrl = ts["connect"];
            dbname = ts["database"]
        }
        client = await MongoClient.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
        let db = client.db(dbname);
        let coll = db.collection(collection);
        let result = await coll.updateOne({ "name": name }, { $set: { "value": value } }, { "upsert": true });
        let res = await result.result;
        client.close();
        return res;
    }
    catch (err) { console.error(err); }
}
export async function deletedocument(collection: string, filter: any, token?: any): Promise<any> {
    let client: MongoClient;
    try {
        let mongoUrl = process.env.CONNECTION_STRING;
        let dbname = process.env.DBName;
        if (token) {
            let ts = JSON.parse(decrypt(token));
            mongoUrl = ts["connect"];
            dbname = ts["database"]
        }
        client = await MongoClient.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
        let db = client.db(dbname);
        let coll = db.collection(collection);
        if (filter == undefined) {
            filter = {};
        } else {
            delete filter["token"];
            delete filter["collection"];
        }
        let result = await coll.deleteMany(filter);
        let res = await result.result;
        client.close();
        return res;
    }
    catch (err) { console.error(err); }
}
export async function findNames(collection: string, filter: any, token?: any): Promise<any> {
    let client: MongoClient;
    try {
        let mongoUrl = process.env.CONNECTION_STRING;
        let dbname = process.env.DBName;
        if (token) {
            let ts = JSON.parse(decrypt(token));
            mongoUrl = ts["connect"];
            dbname = ts["database"]
        }
        client = await MongoClient.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
        let db = client.db(dbname);
        let coll = db.collection(collection);
        if (filter == undefined) {
            filter = {};
        } else {
            delete filter["token"];
            delete filter["collection"];
        }
        let result = await coll.find(filter, {
            projection: { name: 1 }
        });
        let res = await result.toArray();
        client.close();
        return res;
    }
    catch (err) { console.error(err); }
}