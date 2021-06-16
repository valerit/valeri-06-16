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
      <View style={styles.content}>
        {/** Bid */}
        <OrderList style={styles.buy} data={Store.bids} type="bid" />

        {/** Ask */}
        <OrderList style={styles.sell} data={Store.asks} type="ask" />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: "flex",
    backgroundColor: "#111827",
  },
  content: {
    display: "flex",
    width: "100%",
    flexDirection: "column",
    padding: "5%",
    flex: 1,
  },
  buy: {
    flex: 1,
    width: "100%",
  },
  sell: {
    flex: 1,
    width: "100%",
  },
});

export default observer(OrderBook);
