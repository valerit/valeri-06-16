import React, { useEffect } from "react";
import { StyleSheet, Text, View, SafeAreaView } from "react-native";
import { observer } from "mobx-react";

import OrderList from "../components/OrderList";
import Store from "../store";

function OrderBook() {
  useEffect(() => {
    Store.subscribe();

    const timerId = setInterval(() => {
      Store.refresh();
    }, 500);
    return () => {
      clearInterval(timerId);
    };
  }, []);
  return (
    <SafeAreaView style={styles.container}>
      {/** Bid */}
      <OrderList style={styles.buy} data={Store.bids} />

      {/** Ask */}
      <OrderList style={styles.sell} data={Store.asks} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  buy: {
    flex: 1,
    backgroundColor: "red",
    width: "100%",
  },
  sell: {
    flex: 1,
    backgroundColor: "blue",
    width: "100%",
  },
});

export default observer(OrderBook);
