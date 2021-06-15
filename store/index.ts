import { makeAutoObservable } from "mobx";

class Store {
  constructor() {
    makeAutoObservable(this)
  }
}

// export instance 
export default new Store()