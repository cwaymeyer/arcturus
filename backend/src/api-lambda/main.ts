// import { Dynamo } from "../library/Dynamo";

export const handler = async (event: any, context: any) => {
  console.log("🌱 Entering lambda handler with event:", event);

  const name = event.queryStringParameters.name;

  return `Hello, ${name}`;
};
