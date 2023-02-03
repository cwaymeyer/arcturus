import { Dynamo } from "../library/Dynamo";

export const getServiceData = async (serviceName: string, category: string) => {
  console.log("☄️ Get Service Actions Data ☄️");

  const attributeValues = {
    ":pk": { S: serviceName },
    ":sk": { S: category },
  };
  const query = "pk = :pk AND begins_with(sk, :sk)";

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
