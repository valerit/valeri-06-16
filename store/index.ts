import { makeAutoObservable } from "mobx";
import { Order } from "../types";

class Store {
  bids: Order[] = [];
  asks: Order[] = [];

  constructor() {
    makeAutoObservable(this);
  }
}

// export instance
export default new Store();
