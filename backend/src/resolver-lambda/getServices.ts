import { Dynamo } from "../library/Dynamo";

export const getServices = async (tableName: string) => {
  console.log("☄️ Get Services ☄️");

  const query = "service = :SERVICE_NAMES";
  const returnAttributes = "sk";

  const result = Dynamo.queryTable(tableName, query, returnAttributes);

  return result;
};
