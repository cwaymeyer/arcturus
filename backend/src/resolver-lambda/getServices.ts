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

  return await response;
};
