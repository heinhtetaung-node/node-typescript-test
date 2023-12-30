import axios from "axios";
import { apiCache } from "..";

export type CommonGetApiResponse = { status: number; data?: any };

const handleGetRequest = async (url: string): Promise<CommonGetApiResponse> => {
  const cacheData = apiCache.get(url);
  if (cacheData) {
    return cacheData as CommonGetApiResponse;
  }
  try {
    const { data, status } = await axios.get(url);
    const response = {
      status,
      data,
    };
    apiCache.set(url, response, 300);
    return response;
  } catch (error: any) {
    return {
      status: error?.response?.status ?? 501,
    };
  }
};

export default handleGetRequest;
