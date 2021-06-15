import React, { FC } from "react";
import { StyleSheet, Text, View } from "react-native";

export type OrderListProps = {
  style: object;
};

export default function OrderList({ style }: OrderListProps) {
  return (
    <View style={[styles.container, style]}>
      <Text>OrderList</Text>
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
});
