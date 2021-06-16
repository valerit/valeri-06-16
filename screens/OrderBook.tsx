import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, SafeAreaView } from "react-native";
import { connectActionSheet } from "@expo/react-native-action-sheet";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import { observer } from "mobx-react";

import OrderList from "../components/OrderList";
import Store from "../store";

const groups = [
  { label: "0.5", value: 0.5 },
  { label: "1", value: 1 },
  { label: "2.5", value: 2.5 },
];

function OrderBook() {
  const [open, setOpen] = useState(false);

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
        {/** Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Order Book</Text>
          <View style={styles.group}>
            <Text style={styles.groupText}>Group {Store.groupOffset}</Text>
            <MaterialCommunityIcons name="chevron-up" size={24} color="white" />
            <MaterialCommunityIcons
              name="chevron-down"
              size={24}
              color="white"
            />
          </View>
        </View>
        {/** List Header */}
        <View style={styles.listHeader}>
          <Text style={styles.price}>PRICE</Text>
          <Text style={styles.size}>SIZE</Text>
          <Text style={styles.total}>TOTAL</Text>
        </View>
        {/** Bid */}
        <OrderList style={styles.bids} data={Store.bids} type="bid" />

        {/** Ask */}
        <OrderList style={styles.asks} data={Store.asks} type="ask" />
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

  header: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
  },
  title: {
    fontSize: 24,
    color: "#fff",
  },
  picker: {
    width: 72,
    color: "#fff",
    backgroundColor: "#111827",
  },
  pickerText: {
    color: "#fff",
    backgroundColor: "#111827",
  },
  pickerContainer: {
    backgroundColor: "#111827",
  },
  listHeader: {
    display: "flex",
    flexDirection: "row",
  },
  bids: {
    flex: 1,
    width: "100%",
  },
  asks: {
    marginTop: 16,
    flex: 1,
    width: "100%",
  },
  price: {
    color: "#555",
    fontSize: 16,
    flex: 1,
    textAlign: "right",
    fontWeight: "bold",
  },
  size: {
    color: "#555",
    fontSize: 16,
    flex: 1,
    textAlign: "center",
    fontWeight: "bold",
  },
  total: {
    color: "#555",
    fontSize: 16,
    flex: 1,
    textAlign: "center",
    fontWeight: "bold",
  },
  group: {
    backgroundColor: "#384252",
    borderRadius: 4,
    padding: 4,
    flexDirection: "row",
    alignItems: "center",
  },
  groupText: {
    color: "#fff",
  },
});

export default observer(connectActionSheet(OrderBook));
