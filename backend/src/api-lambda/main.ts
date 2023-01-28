import { Dynamo } from "../library/Dynamo";

export const handler = async (event: any, context: any) => {
  console.log("☄️ entering lambda handler with event:", event);

  const attributeValues = { ":pk": { S: "SERVICE_NAMES" } };
  const query = "service = :pk";
  const returnAttributes = "sk";

  const response = await Dynamo.queryTable(
    attributeValues,
    query,
    returnAttributes
  );

  const returnObj = {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      // "Access-Control-Allow-Credentials": true,
    },
    body: JSON.stringify(response),
  };

  console.log(returnObj);
  return returnObj;
};
