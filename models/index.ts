import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import { findNames } from '../mongo'
const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    context.log('HTTP trigger function processed a request.');
    const name = (req.query.name || (req.body && req.body.name));

    const { filter } = req.query;
    let response;

    try {
      let result = await findNames("SDX", filter);
      response = { body: result, status: 200 };
    } catch (err) {
      response = { body: err.message, status: 500 };
    }
    context.res = response;
};

export default httpTrigger;