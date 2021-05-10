import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import { findNames } from '../mongo'
const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
  context.log('findNames: ' + req.url);
  const collection = (req.params.collection || (req.body && req.body.collection));
  const token = (req.params.token || (req.body && req.body.token));
  let response;
  try {
    let result = await findNames(collection, req.params, token);
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