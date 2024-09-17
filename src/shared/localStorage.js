import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

const Utils = {
    save: (key, value) => {
        localStorage.setItem(key, value);
    },
    get: (key) => {
        if (localStorage.getItem(key) === null) {
            return "";
        }
        return localStorage.getItem(key);
  },
  isAuthenticated: () =>
  {
      const token = localStorage.getItem("refresh_token");
    if (!token) return false;
    return true;
  },
    clear: () => {
        localStorage.clear();
    },
    remove: (key) => {
        localStorage.removeItem(key);
    },
    logout: () => {
        localStorage.removeItem("refresh_token");
        localStorage.removeItem("acl");
        localStorage.removeItem("name");
        window.location.href = "/#/auth/login";
    },
    setCookie: (name, value, days) => {
        let expires = "";
        if (days) {
            const date = new Date();
            date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
            expires = "; expires=" + date.toUTCString();
        }
        document.cookie = name + "=" + (value || "") + expires + "; path=/";
    },
    getCookie: (name) => {
        const cookies = document.cookie.split(";");
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            console.log(cookie);
            if (cookie.startsWith(`${name}=`)) {
                console.log("cookie ", cookie.substring(name.length + 1));
                return cookie.substring(name.length + 1);
            }
        }
        return "";
    },
    isCookieActive: (name) => {
        const token = Cookies.get(name);
        if (!token) return false;

        try {
            const { exp } = jwtDecode(token);
            console.log(exp);
            if (Date.now() >= exp * 1000) {
                console.log("token expired");
                // Token is expired
                return false;
            }
            return true; // Token is valid
        } catch (error) {
            return false; // Token is invalid
        }
    },
};

export default Utils;
