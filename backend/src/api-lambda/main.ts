import { getServices } from "./getServices";
import { getServiceData } from "./getServiceData";

export const handler = async (event: any, context: any) => {
  console.log("🚀 entering lambda handler with event:", event);

  switch (event.path) {
    case "/services":
      return await getServices();
    case "/service-data":
      const { serviceName } = event.queryStringParameters;
      return await getServiceData(serviceName);
    default:
      console.error("Field name not recognized");
      return null;
  }
};
