import {observable, decorate, action} from 'mobx';
import {createContext} from 'react';
import locations from '../locations_config';

class LocationsStore {
  loadingLocation = false;
  error = false;

  state = [];
  states = [];
  cities = [];
  country = [];
  countries = [];

  getCountries = () => {
    this.loadingLocation = true;
    locations
      .get('countries')
      .then((res) => {
        this.loadingLocation = false;
        if (res.data.data) {
          this.countries = res.data.data;
          // console.log(res.data.data)
        }
      })
      .catch((error) => {
        this.loadingLocation = false;
        console.log(error.response)
      });
  };

  getCountry = (id) => {
    this.loadingLocation = true;
    locations
      .get(`countries/${id}`)
      .then((res) => {
        this.loadingLocation = false;
        if (res.data.data) {
          this.country = res.data.data;
        }
      })
      .catch((error) => {
        this.loadingLocation = false;
      });
  };
  getStates = (id) => {
    this.loadingLocation = true;
    locations
      .get(`states?country_id=${id}`)
      .then((res) => {
        this.loadingLocation = false;
        if (res.data.data) {
          this.states = res.data.data;
        }
      })
      .catch((error) => {
        this.loadingLocation = false;
      });
  };

  getState = (id) => {
    this.loadingLocation = true;
    locations
      .get(`states/${id}`)
      .then((res) => {
        this.loadingLocation = false;
        if (res.data.data) {
          this.state = res.data.data;
        }
      })
      .catch((error) => {
        this.loadingLocation = false;
      });
  };

  getCities = (id) => {
    this.loadingLocation = true;
    locations
      .get(`cities?state_id=${id}`)
      .then((res) => {
        this.loadingLocation = false;
        if (res.data.data) {
          this.cities = res.data.data;
        }
      })
      .catch((error) => {
        this.loadingLocation = false;
      });
  };
}

decorate(LocationsStore, {
  loadingLocation: observable,
  error: observable,
  countries: observable,
  states: observable,
  cities: observable,
  country: observable,
  state: observable,

  getCountries: action,
  getCountry: action,
  getStates: action,
  getState: action,
  getCities: action,
});

export default createContext(new LocationsStore());
