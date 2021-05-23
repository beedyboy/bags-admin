// persist data t local storage
const Utils = {
    save:(key, value) => {
        localStorage.setItem(key, value);
    },
    get:(key) => {
      
        if (localStorage.getItem(key) === null) {
            //...
            return "";
          }
          return localStorage.getItem(key);
    },
    clear:() => {
        localStorage.clear();
    },
    remove:(key) => {
        localStorage.removeItem(key);
    },
     logout: () => {
        localStorage.removeItem('admin_token');  
        window.location.href = '/login'; 
    }
}
 
export default Utils;