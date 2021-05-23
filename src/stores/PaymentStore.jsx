import {createContext} from 'react';
import {decorate, observable, action} from 'mobx';
// import { Utils } from "../shared/localStorage";
import db from '../config';

class PaymentStore {
  sendingPayment = false;
  error = false;
  loading = false;
  Payment_id = null;
  message = '';
  deletedMsg = '';
  action = '';
  payment = [];
  payments = [];

  resetAction = () => {
    this.action = '';
  };

  getPaymentByOrder = (id) => {
    this.loading = true;
    try {
      db.get(`/payments?order_id=${id}`)
        .then((res) => {
          this.loading = false;

          if (res.data.status) {
            this.payments = res.data.data;
          }
        })
        .catch((err) => {
          this.error = err;
          this.message = err;
          
        });
    } catch (err) {
      
      this.error = err;
    }
  };

  makePayment = (data) => {
    this.sendingPayment = true;
    try {
      db.post('/payments', data)
        .then((res) => {
          this.sendingPayment = false;
          if (res.data.status) {
            this.action = 'payment_sent';
            this.message = res.data.message;
            //reset Payment_number in the localStorage
            //trigger getCart in the component that calls this
          }
        })
        .catch((error) => {
          this.sendingPayment = false;
          this.action = 'payment_error';
          this.paymentMessage = error.response.data.message;
          
        });
    } catch (err) {
      this.sendingPayment = false;
      
      this.error = err;
    }
  };

  resetProperty = (key, value) => {
    this[key] = value;
  };
  getPaymentById = (id) => {
    this.loading = true;
    try {
      db.get(`/payments/${id}`).then((res) => {
        this.loading = false;
        if (res.data.status) {
          this.payment = res.data.data;
        }
      });
    } catch (err) {
      
    }
  };
}
decorate(PaymentStore, {
  error: observable,
  action: observable,
  loading: observable,
  message: observable,
  sendingPayment: observable,
  payment: observable,
  payments: observable,
  getPaymentById: action,
  getPaymentByOrder: action,
  resetAction: action,
  resetProperty: action,

  //   getPayments: action,
});

export default createContext(new PaymentStore());
