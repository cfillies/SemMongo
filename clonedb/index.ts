import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import { clonedb } from '../mongo'

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
  const destdbname = (req.query.destdbname || (req.body && req.body.destdbname));
  const desturl = (req.query.desturl || (req.body && req.body.desturl));
  const token = (req.query.token || (req.body && req.body.token));
  context.log('clone: ' + req.params);
  let response;
  try {
    let result = await clonedb(desturl, destdbname, token);
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