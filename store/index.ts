import { makeAutoObservable } from "mobx";
import _ from "lodash";

import { Order, OrderMessage, PI_XBTUSD, PI_ETHUSD } from "../types";

export const GROUP_OFFSETS = {
  PI_XBTUSD: ["0.50", "1.0", "2.5"],
  PI_ETHUSD: ["0.05", "0.1", "0.25"],
};

class Store {
  bids: Order[] = [];
  asks: Order[] = [];

  dicBids: Map<number, number> = new Map();
  dicAsks: Map<number, number> = new Map();

  groupOffset: number = 0.5;
  product_id: string = "";

  ws: WebSocket | null = null;
  status: string = "";

  constructor() {
    makeAutoObservable(this);
  }

  init() {
    this.bids = [];
    this.asks = [];
    this.dicBids = new Map();
    this.dicAsks = new Map();
    this.status = "";
  }

  subscribe(product_id: string = PI_XBTUSD) {
    // init data
    this.init();

    this.product_id = product_id;
    var ws = new WebSocket("wss://www.cryptofacilities.com/ws/v1");
    this.ws = ws;

    ws.onopen = () => {
      this.status = "open";
      // connection opened
      // send a message
      ws.send(
        `{ "event": "subscribe", "feed": "book_ui_1", "product_ids": ["${product_id}"]}`
      );
    };

    ws.onmessage = (ev: MessageEvent<any>) => {
      try {
        const data = JSON.parse(ev.data);
        if (data.event == "subscribed") {
          this.status = "subscribed";
        } else if (
          this.status === "subscribed" &&
          (data as OrderMessage).feed
        ) {
          this.onOrderMsg(data);
        }
      } catch (e) {}
    };

    ws.onerror = (e) => {
      this.status = "error";
    };

    ws.onclose = (e) => {
      this.status = "closed";
      // connection closed
      console.log(e.code, e.reason);
    };
  }

  disconnect(code: number = 1000, reason: string = "") {
    try {
      this.ws?.close(code, reason);
    } catch (e) {}
  }

  reconnect() {
    this.subscribe(this.product_id || PI_XBTUSD);
  }

  toggle() {
    if (this.product_id == PI_ETHUSD) {
      this.subscribe(PI_XBTUSD);
    } else {
      this.subscribe(PI_ETHUSD);
    }

    // Validate groupOffset is in GROUP_OFFSETS range
    const offsets =
      this.product_id === PI_ETHUSD
        ? GROUP_OFFSETS.PI_ETHUSD
        : GROUP_OFFSETS.PI_XBTUSD;

    // Can I use the current offset
    const offset = offsets.find((str) => parseFloat(str) == this.groupOffset);
    if (!offset) {
      this.groupOffset = parseFloat(offsets[0]);
    }
  }

  kill() {
    if (this.status === "subscribed" || this.status === "open") {
      this.disconnect();
    } else {
      this.reconnect();
    }
  }

  onOrderMsg(msg: OrderMessage) {
    this.registerPrices(this.dicBids, msg.bids);
    this.registerPrices(this.dicAsks, msg.asks);
  }

  refresh() {
    // generate grouped
    this.bids = this.getOrders(this.dicBids, "bid");
    this.asks = this.getOrders(this.dicAsks, "ask", true);
  }

  setGroupOffset(offset: number) {
    this.groupOffset = offset;
    this.refresh();
  }

  registerPrices(dic: Map<number, number>, orders: Array<Array<number>>) {
    try {
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
    } catch (e) {}
  }

  getOrders(dic: Map<number, number>, type: string, reverse: boolean = false) {
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
        ratio: 0,
        type,
      });
    });
    results = _.orderBy(results, "price", "desc");

    let total = 0;

    for (let i = results.length - 1; i >= 0; i--) {
      total += results[i].size;
      results[i].total = total;
    }
    results.forEach((order) => {
      order.ratio = (order.total / total) * 100; // as percent
    });

    return reverse ? results.reverse() : results;
  }

  getGroupPrice(price: number) {
    const { groupOffset } = this;
    const remainder = price % groupOffset;
    return price - remainder;
  }
}

// export instance
export default new Store();
