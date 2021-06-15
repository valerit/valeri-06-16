import { makeAutoObservable } from "mobx";
import { Order, OrderMessage } from "../types";

class Store {
  bids: Order[] = [];
  asks: Order[] = [];

  dicBids: Map<number, number> = new Map();
  dicAsks: Map<number, number> = new Map();

  groupOffset: number = 0.5;

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

    ws.onmessage = (ev: MessageEvent<any>) => {
      try {
        const data: OrderMessage = JSON.parse(ev.data);
        this.onOrderMsg(data);
      } catch (e) {}
    };

    ws.onerror = (e) => {};

    ws.onclose = (e) => {
      // connection closed
      console.log(e.code, e.reason);
    };
  }

  onOrderMsg(msg: OrderMessage) {
    // console.info("addOrder - ", msg);
    this.registerPrices(this.dicBids, msg.bids);
    this.registerPrices(this.dicAsks, msg.asks);
  }

  registerPrices(dic: Map<number, number>, aryOrders: Array<Array<number>>) {
    aryOrders.forEach(([price, size]) => {
      if (size == 0) {
        dic.delete(price);
      } else {
        dic.set(price, size);
      }
    });
  }

  getGroupPrice(price: number) {
    const { groupOffset } = this;
    const remainder = price % groupOffset;
    return price - remainder;
  }
}

// export instance
export default new Store();
