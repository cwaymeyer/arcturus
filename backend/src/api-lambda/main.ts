import { getServices } from "./getServices";
import { getServiceData } from "./getServiceData";

export const handler = async (event: any, context: any) => {
  console.log("🚀 entering lambda handler with event:", event);

  switch (event.path) {
    case "/services":
      return await getServices();
    case "/service-actions-data":
      const { serviceName, category } = event.queryStringParameters;
      return await getServiceData(serviceName, category);
    default:
      console.error("Field name not recognized");
      return null;
  }
};
