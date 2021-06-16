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
      <Text>{price}</Text>
      <Text>{size}</Text>
      <Text>{total}</Text>
    </View>
  );
};

export default function OrderList({ style, data }: OrderListProps) {
  return (
    <View style={[styles.container, style]}>
      <FlatList
        renderItem={renderItem}
        data={data}
        keyExtractor={(item: Order, index: number): string => {
          return `${item.price}`;
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  item: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
});
