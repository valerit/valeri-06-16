import { makeAutoObservable } from "mobx";
import { Order } from "../types";

class Store {
  bids: Order[] = [];
  asks: Order[] = [];
  ws: WebSocket | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  subscribe() {
    var ws = new WebSocket("wss://www.cryptofacilities.com/ws/v1");
    this.ws = ws;

    ws.onopen = () => {
      // connection opened
      // send a message
      ws.send(
        '{ "event": "subscribe", "feed": "book_ui_1", "product_ids": ["PI_XBTUSD"]}'
      );
    };

    ws.onmessage = (e) => {
      // a message was received
      console.log(e.data);
    };

    ws.onerror = (e) => {};

    ws.onclose = (e) => {
      // connection closed
      console.log(e.code, e.reason);
    };
  }
}

// export instance
export default new Store();
