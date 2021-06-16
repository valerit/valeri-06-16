import React, { PureComponent } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  ListRenderItemInfo,
} from "react-native";

import { Order } from "../types";
import { numberWithCommas } from "../utils";

export type OrderListProps = {
  style: object;
  data: Array<Order>;
  align: "left" | "right";
};

class OrderItem extends PureComponent<
  ListRenderItemInfo<Order> & { align: string }
> {
  render() {
    const { price, size, total, ratio, type } = this.props.item;
    const { align = "right" } = this.props;

    return (
      <View style={styles.item}>
        <View
          style={[
            type == "bid" ? styles.bidTotal : styles.askTotal,
            { width: `${ratio}%` },
            align === "right" ? { right: 0 } : { left: 0 },
          ]}
        />
        <Text style={type == "bid" ? styles.bid : styles.ask}>
          {numberWithCommas(price)}
        </Text>
        <Text style={styles.size}>{numberWithCommas(size)}</Text>
        <Text style={styles.total}>{numberWithCommas(total)}</Text>
      </View>
    );
  }
}

export default function OrderList({ style, data, align }: OrderListProps) {
  return (
    <FlatList
      renderItem={(props: ListRenderItemInfo<Order>) => (
        <OrderItem {...props} align={align} />
      )}
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
    height: 24,
  },
  size: {
    color: "#fff",
    fontWeight: "500",
    fontSize: 16,
    flex: 1,
    textAlign: "center",
  },
  total: {
    color: "#fff",
    fontWeight: "500",
    fontSize: 16,
    flex: 1,
    textAlign: "center",
  },

  ask: {
    color: "#b6383c",
    fontWeight: "500",
    fontSize: 16,
    flex: 1,
    textAlign: "right",
  },
  bid: {
    color: "#0d9069",
    fontWeight: "500",
    fontSize: 16,
    flex: 1,
    textAlign: "right",
  },

  bidTotal: {
    backgroundColor: "#123839",
    position: "absolute",
    top: 0,
    height: "100%",
    zIndex: -1,
  },

  askTotal: {
    backgroundColor: "#3e212c",
    position: "absolute",
    top: 0,
    height: "100%",
    zIndex: -1,
  },
});
