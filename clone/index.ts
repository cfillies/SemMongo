import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import { clone } from '../mongo'

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
  const collection = (req.query.collection || (req.body && req.body.collection));
  const destcollection = (req.query.destcollection || (req.body && req.body.destcollection));
  const desturl = (req.query.desturl || (req.body && req.body.desturl));
  const token = (req.query.token || (req.body && req.body.token));
  context.log('clone: ' + req.params);
  let response;
  try {
    let result = await clone(collection, destcollection, desturl, token);
    response = {
      body: result, status: 200,
      headers: {
        "Access-Control-Allow-Credentials": "true",
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json"
      }
    };
  } catch (err) {
    response = { body: err.message, status: 500 };
  }
  context.res = response;

};

export default httpTrigger;