import axios from "axios";
import Utils from "./shared/localStorage";

const env = {
  local: "http://localhost:8080/",
  production: "https://api.wigtools.ng/",
  development: "https://solutioninflux-wigtools.herokuapp.com/",
};

const serverUrl = env.local;

const db = axios.create({
  baseURL: serverUrl,
  responseType: "json",
  timeout: 10000,
  headers: {
    common: {
      Authorization: `Bearer ${Utils.get("admin_token")}}`,
    },
    "Content-Type": "application/json",
  },
});

db.interceptors.request.use(function (config) {
  var token = Utils.get("customer_token");
  config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default db;
