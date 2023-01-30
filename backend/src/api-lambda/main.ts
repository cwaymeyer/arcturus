import { getServices } from "./getServices";
import { getServiceActionsData } from "./getServiceActionsData";

export const handler = async (event: any, context: any) => {
  console.log("🚀 entering lambda handler with event:", event);

  switch (event.path) {
    case "/services":
      return await getServices();
    case "/service-actions-data":
      const { serviceName } = event.queryStringParameters;
      return await getServiceActionsData(serviceName);
    default:
      console.error("Field name not recognized");
      return null;
  }
};
