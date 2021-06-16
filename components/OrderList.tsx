import React from "react";
import { StyleSheet, Text, View, FlatList, ListRenderItem } from "react-native";
import { Order } from "../types";

export type OrderListProps = {
  style: object;
  data: Array<Order>;
  type: "bid" | "ask";
};

export default function OrderList({ style, data, type }: OrderListProps) {
  const renderItem: ListRenderItem<Order> = ({ item }) => {
    const { price, size, total } = item;
    return (
      <View style={styles.item}>
        <Text style={type == "bid" ? styles.bid : styles.ask}>{price}</Text>
        <Text style={styles.white}>{size}</Text>
        <Text style={styles.white}>{total}</Text>
      </View>
    );
  };
  return (
    <FlatList
      renderItem={renderItem}
      data={data}
      keyExtractor={(item: Order, index: number): string => {
        return `${item.price}`;
      }}
      style={[styles.container, style]}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  item: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  white: {
    color: "#fff",
    fontWeight: "500",
    fontSize: 16,
  },

  ask: {
    color: "#b6383c",
    fontWeight: "500",
    fontSize: 16,
  },
  bid: {
    color: "#0d9069",
    fontWeight: "500",
    fontSize: 16,
  },

  bidTotal: {
    backgroundColor: "#123839",
  },

  askTotal: {
    backgroundColor: "#3e212c",
  },
});
