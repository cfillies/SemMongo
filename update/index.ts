import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import { save } from '../mongo'

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
  const collection = (req.params.collection || (req.body && req.body.collection));
  const name = (req.params.name || (req.body && req.body.name));
  const value = (req.params.value || (req.body && req.body.value));
  const token = (req.params.token || (req.body && req.body.token));
  context.log('Update: ' + req.params);
  let response;
  try {
    let result = await save(collection, name, value, token);
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