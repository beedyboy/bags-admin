import {createContext} from 'react';
import {decorate, observable, action,} from 'mobx';
import db from '../config';

class RegionStore {
  error = false;
  loading = false;
  errMessage = '';
  regions = [];

  getRegions = () => {
    this.loading = true;
    try {
      db.get('regions').then((res) => {
        this.loading = false;
        this.error = false;
        if (res.data.status) {
          this.regions = res.data.data;
        }
      });
    } catch (error) {
      this.loading = false;
      this.error = true;
      this.errMessage = error.response.data.message;
      console.log(error.response.data);
    }
  };
}

decorate(RegionStore, {
  error: observable,
  loading: observable,
  errMessage: observable,
  regions: [],
  getRegions: action,
});

export default createContext(new RegionStore());
