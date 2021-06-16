export type Order = {
  price: number;
  size: number;
  total: number;
  ratio: number;
};

export type OrderMessage = {
  feed: string;
  product_id: string;
  bids: Array<Array<number>>;
  asks: Array<Array<number>>;
};

export const PI_XBTUSD = "PI_XBTUSD";
export const PI_ETHUSD = "PI_ETHUSD";
