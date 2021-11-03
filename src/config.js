import axios from "axios";
import Utils from "./shared/localStorage";

const env = {
  local: process.env.REACT_APP_LOCAL_URL,
  production: process.env.REACT_APP_PROD_URL,
  test: process.env.REACT_APP_TEST_URL,
};

const serverUrl = env.production;

const db = axios.create({
  baseURL: serverUrl,
  responseType: "json",
  timeout: 1000 * 50,
  headers: {
    common: {
      Authorization: `Bearer ${Utils.get("admin_token")}}`,
    },
    "Content-Type": "application/json",
  },
});

db.interceptors.request.use(function (config) {
  var token = Utils.get("admin_token");
  config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default db;
