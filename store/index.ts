import { makeAutoObservable } from "mobx";
import _ from "lodash";

import { Order, OrderMessage } from "../types";

class Store {
  bids: Order[] = [];
  asks: Order[] = [];

  dicBids: Map<number, number> = new Map();
  dicAsks: Map<number, number> = new Map();

  groupOffset: number = 0.5;
  product_id: string = "";

  ws: WebSocket | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  subscribe(product_id: string = "PI_XBTUSD") {
    this.product_id = product_id;
    var ws = new WebSocket("wss://www.cryptofacilities.com/ws/v1");
    this.ws = ws;

    ws.onopen = () => {
      // connection opened
      // send a message
      ws.send(
        `{ "event": "subscribe", "feed": "book_ui_1", "product_ids": ["${product_id}"]}`
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
    this.registerPrices(this.dicBids, msg.bids);
    this.registerPrices(this.dicAsks, msg.asks);
  }

  refresh() {
    // generate grouped
    this.bids = this.getOrders(this.dicBids);
    this.asks = this.getOrders(this.dicAsks);
  }

  setGroupOffset(offset: number) {
    this.groupOffset = offset;
    this.refresh();
  }

  registerPrices(dic: Map<number, number>, orders: Array<Array<number>>) {
    orders.forEach(([price, size]) => {
      if (price > 0) {
        // strict check for price and size
        if (size == 0) {
          dic.delete(price);
        } else if (size > 0) {
          dic.set(price, size);
        }
      }
    });
  }

  getOrders(dic: Map<number, number>) {
    let results: Array<Order> = [];
    const dicOrders: Map<number, number> = new Map();

    dic.forEach((size, price) => {
      const groupPrice = this.getGroupPrice(price);

      dicOrders.set(groupPrice, (dicOrders.get(groupPrice) || 0) + size);
    });

    dicOrders.forEach((size, price) => {
      results.push({
        price,
        size,
        total: 0,
      });
    });
    results = _.orderBy(results, "price", "desc");

    let total = 0;

    for (let i = results.length - 1; i >= 0; i--) {
      total += results[i].size;
      results[i].total = total;
    }

    return results;
  }

  getGroupPrice(price: number) {
    const { groupOffset } = this;
    const remainder = price % groupOffset;
    return price - remainder;
  }
}

// export instance
export default new Store();
