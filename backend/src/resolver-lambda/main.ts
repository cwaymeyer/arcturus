import { getServices } from "./getServices";

export const handler = async (event: any, context: any) => {
  console.log("🌱 Entering lambda handler with event:", event);

  switch (event.info.fieldName) {
    case "getServices":
      return await getServices();
    default:
      console.error("Field name not recognized");
      return null;
  }
};
