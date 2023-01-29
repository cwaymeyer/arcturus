import { Dynamo } from "../library/Dynamo";

export const getServiceData = async (serviceName: string) => {
  console.log("☄️ Get ServicesData ☄️");

  const attributeValues = { ":pk": { S: serviceName } };
  const query = "service = :pk";

  const response = await Dynamo.queryTable(attributeValues, query);

  const returnObj = {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
    body: JSON.stringify(response),
  };

  return returnObj;
};
