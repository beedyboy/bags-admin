import {createContext} from 'react';
import {decorate, observable, action, computed} from 'mobx';
import db from '../config';
// import Utils from "../shared/localStorage";

class SearchStore {
  loadingSearch = false;
  error = false;

  errorMsg = '';
  successMsg = '';
  result = [];

  searchProduct = (params) => {
    this.loadingSearch = true;
    try {
      db.post('/search', params)
        .then((res) => {
          this.loadingSearch = false;
          if (res.data.status) {
            this.result = res.data.data;
            this.successMsg = res.data.message;
          
          }
        })
        .catch((err) => {
          this.error = true;
          this.loadingSearch = false;
        
          //   this.errorMsg = error.response.data.message;
        });
    } catch (error) {
      this.error = true;
      this.loadingSearch = false;
      this.error = true;
    
    }
  };

  resetAction = () => {
    this.errorMsg = '';
    this.successMsg = '';
  };

  get searchResult() {
    return Object.keys(this.result.products || {}).map((key) => ({
      ...this.result.products[key],
    }));
  }
}
decorate(SearchStore, {
  loadingSearch: observable,
  error: observable,
  errorMsg: observable,
  successMsg: observable,
  result: observable,
  searchProduct: action,
  searchResult: computed,
});

export default createContext(new SearchStore());
