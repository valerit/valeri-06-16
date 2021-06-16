import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, SafeAreaView, Pressable } from "react-native";
import { connectActionSheet } from "@expo/react-native-action-sheet";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";

import { observer } from "mobx-react";

import OrderList from "../components/OrderList";
import Store, { GROUP_OFFSETS } from "../store";

const offsets = ["0.50", "1.0", "2.5"];

function OrderBook(props: any) {
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
          <Text style={styles.title}>Order Book - {Store.product_id}</Text>
          <Pressable
            onPress={() => {
              setOpen(true);

              props.showActionSheetWithOptions(
                {
                  options: [
                    ...(Store.product_id === "PI_ETHUSD"
                      ? GROUP_OFFSETS.PI_ETHUSD
                      : GROUP_OFFSETS.PI_XBTUSD),
                    "Cancel",
                  ],
                  cancelButtonIndex: 3,
                  destructiveButtonIndex: 3,
                },
                (buttonIndex: number) => {
                  if (buttonIndex != 3) {
                    Store.setGroupOffset(parseFloat(offsets[buttonIndex]));
                  }
                  setOpen(false);
                }
              );
            }}
          >
            <View style={styles.group}>
              <Text style={styles.groupText}>Group {Store.groupOffset}</Text>
              <MaterialCommunityIcons
                name={open ? "chevron-up" : "chevron-down"}
                size={24}
                color="white"
              />
            </View>
          </Pressable>
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

        {/** Footer */}
        <View style={styles.footer}>
          <Pressable
            onPress={() => {
              Store.toggle();
            }}
          >
            <View style={[styles.button, { backgroundColor: "#5741d9" }]}>
              <FontAwesome name="exchange" size={14} color="#fff" />
              <Text style={styles.buttonText}>Toggle Feed</Text>
            </View>
          </Pressable>

          <Pressable onPress={() => {}}>
            <View style={[styles.button, { backgroundColor: "#b91d1d" }]}>
              <FontAwesome name="trash" size={14} color="#fff" />
              <Text style={styles.buttonText}>Kill Feed</Text>
            </View>
          </Pressable>
        </View>
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
    flex: 1,
  },

  header: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    paddingVertical: 8,
    padding: "5%",
    borderBottomWidth: 1,
    borderBottomColor: "#384252",
  },
  title: {
    fontSize: 18,
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
    paddingVertical: 4,
  },
  bids: {
    flex: 1,
    width: "100%",
  },
  asks: {
    marginTop: 24,
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
  buttonText: {
    color: "#fff",
    marginLeft: 4,
  },
  footer: {
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
    backgroundColor: "#242d3c",
  },
  button: {
    display: "flex",
    flexDirection: "row",
    borderRadius: 4,
    paddingVertical: 6,
    paddingHorizontal: 8,
    alignItems: "center",
  },
});

export default connectActionSheet(observer(OrderBook));
