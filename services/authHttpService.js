import http from "./httpService";
import { getAccessToken } from "../util/user";

// I'll likely need to make the scope configurable later
async function addAccessTokenToConfig(config) {
  const accessToken = await getAccessToken({ scope: ["edit:pets"] });

  if (!config) {
    config = {};
  }
  config.headers = {
    Authorization: `Bearer ${accessToken}`,
  };
  return config;
}

export const get = async (url, config) => {
  return http.get(url, await addAccessTokenToConfig(config));
};

const post = async (url, values, config) => {
  return http.post(url, values, await addAccessTokenToConfig(config));
};

const put = async (url, values, config) => {
  return http.put(url, values, await addAccessTokenToConfig(config));
};

const deleteRequest = async (url, config) => {
  return http.delete(url, await addAccessTokenToConfig(config));
};

export default {
  get: get,
  post: post,
  put: put,
  delete: deleteRequest,
};
