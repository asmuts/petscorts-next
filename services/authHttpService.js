import http from "./httpService";
import { getAccessToken } from "../util/user";

// Decorates the http facade adding access tokens

// I'll likely need to make the scope configurable later
async function addAccessTokenToConfig(config) {
  // NOTE: temp disabling the scoeps until I can get it to work properly
  // using email as a placeholder.
  //const accessToken = await getAccessToken({ scope: ["edit:pets"] });
  const accessToken = await getAccessToken({ scope: ["email"] });

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
