import React from "react";
import { StyleSheet, Text, View, FlatList, ListRenderItem } from "react-native";
import { Order } from "../types";

export type OrderListProps = {
  style: object;
  data: Array<Order>;
};

const renderItem: ListRenderItem<Order> = ({ item }) => {
  const { price, size, total } = item;
  return (
    <View style={styles.item}>
      <Text style={styles.number}>{price}</Text>
      <Text style={styles.number}>{size}</Text>
      <Text style={styles.number}>{total}</Text>
    </View>
  );
};

export default function OrderList({ style, data }: OrderListProps) {
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
  number: {
    color: "#fff",
    fontWeight: "500",
    fontSize: 16,
  },
});
