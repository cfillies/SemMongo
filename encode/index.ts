import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import { encode } from '../mongo'
const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
  context.log('Find Names: ' + req.url);
  const connection = (req.params.connect || (req.body && req.body.connect));
  const database = (req.params.database || (req.body && req.body.database));
  let response;
  try {
    let result = encode(connection, database);
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