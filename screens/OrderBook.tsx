import React from "react";
import { StyleSheet, Text, View, SafeAreaView } from "react-native";

import OrderList from "../components/OrderList";

export default function OrderBook() {
  return (
    <SafeAreaView style={styles.container}>
      {/** Buy */}
      <OrderList />

      {/** Sell */}
      <OrderList />
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
});
