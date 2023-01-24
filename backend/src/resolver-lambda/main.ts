import { getServices } from "./getServices";

const TABLE_NAME = "Canopus";

export const handler = async (event: any, context: any) => {
  console.log("🌱 Entering lambda handler with event:", event);

  switch (event.info.fieldName) {
    case "getServices":
      return await getServices(TABLE_NAME);
  }
};
