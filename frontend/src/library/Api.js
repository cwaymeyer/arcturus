import axios from "axios";

const URL = "https://9u2cv827ni.execute-api.us-east-1.amazonaws.com/dev";

export class Api {
  static makeCall = async (endpoint, queryData) => {
    const config = {
      method: "GET",
      url: `${URL}${endpoint}`,
      params: queryData,
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

  // static getServiceData = async (serviceName) => {
  //   console.log("📞 frontend getServiceData");

  //   const params = { serviceName: serviceName };

  //   const response = await this.makeCall("/service-data", params);
  //   return response;
  // };

  static getServiceData = async (serviceName, category) => {
    console.log("📞 frontend getServiceData");

    const params = { serviceName: serviceName, category: category };

    const response = await this.makeCall("/service-actions-data", params);
    return response;
  };
}
