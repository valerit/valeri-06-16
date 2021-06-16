import Store from "./index";
Store.groupOffset = 1;

const msg = `{
  "feed":"book_ui_1",
  "product_id":"PI_XBTUSD",
  "bids":[[1, 1],[1.5, 1], [3, 2], [3.5, 3]],
  "asks":[[1, 1],[1.5, 1], [4, 3], [4.5, 4]]
}`;

describe("Store", () => {
  it("should get a correct group price", () => {
    const groupPrice = Store.getGroupPrice(1.5);

    expect(groupPrice).toBe(1);
  });

  it("should group data correctly", () => {
    const data = JSON.parse(msg);
    Store.onOrderMsg(data);
    Store.refresh();

    expect(Store.bids.length).toBe(2);
    expect(Store.bids[0].price).toBe(3);
    expect(Store.bids[0].size).toBe(5);

    expect(Store.asks.length).toBe(2);
    expect(Store.asks[0].price).toBe(1);
    expect(Store.asks[0].size).toBe(2);
  });
});
