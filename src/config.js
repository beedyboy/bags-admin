import axios from "axios";
import Utils from "./shared/localStorage";

const env = {
  local: "http://localhost:8080/",
  production: "http://server.mybagswarehouse.com/",
  test: "https://bags.youarecaptured.com/",
};

const serverUrl = env.local;

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
