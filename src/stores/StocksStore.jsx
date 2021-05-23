import { createContext } from "react";
import { decorate, observable, action, reaction } from "mobx";
import db from "../config";

class StockStore{
error = false;
loading = false;
message = "";

productStocks = []; 
 

getProductStock = (slug) => {
  this.loading = true;
  db.get(`/products?slug=${slug}`).then((res) => {
    this.loading = false;
    if (res.data.status) {
      this.productStocks = res.data.data;
    }
  });
};
  
};
export default createContext(new StockStore());