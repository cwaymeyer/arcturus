import { Dynamo } from "../library/Dynamo";

export const getServices = async () => {
  console.log("☄️ Get Services ☄️");

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
    },
    body: JSON.stringify(response),
  };

  return returnObj;
};
