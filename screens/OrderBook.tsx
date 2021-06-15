import React from "react";
import { StyleSheet, Text, View, SafeAreaView } from "react-native";

import OrderList from "../components/OrderList";

export default function OrderBook() {
  return (
    <SafeAreaView style={styles.container}>
      {/** Buy */}
      <OrderList style={styles.buy}/>

      {/** Sell */}
      <OrderList style={styles.sell}/>
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
    backgroundColor: 'red',
    width: '100%'
  },
  sell: {
    flex: 1,
    backgroundColor: 'blue',
    width: '100%'
  }
});
