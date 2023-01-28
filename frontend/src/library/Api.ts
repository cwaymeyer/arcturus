import axios from "axios";

const URL = "https://x8q1cpvc32.execute-api.us-east-1.amazonaws.com/dev";

export class Api {
  static makeCall = async (endpoint: any, queryData?: any) => {
    const config = {
      method: "GET",
      url: `${URL}${endpoint}`,
      params: queryData,
      // headers: { "Access-Control-Allow-Origin": "*" },
    };

    try {
      const response = await axios(config);
      return response.data;
    } catch (err) {
      console.error(err);
      return err;
    }
  };

  static getServices = async () => {
    console.log("📞 frontend getServices");

    const response = await this.makeCall("/services");
    return response;
  };
}
