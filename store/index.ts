import { makeAutoObservable } from "mobx";
import { Order } from "../types";

class Store {
  sells: Order[] = [];
  buys: Order[] = [];

  constructor() {
    makeAutoObservable(this);
  }
}

// export instance
export default new Store();
