import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Pressable,
  Platform,
} from "react-native";
import { connectActionSheet } from "@expo/react-native-action-sheet";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";
import * as ScreenOrientation from "expo-screen-orientation";
import Constants from "expo-constants";

import { observer } from "mobx-react";

import OrderList from "../components/OrderList";
import Store, { GROUP_OFFSETS } from "../store";
import { PI_ETHUSD, PI_XBTUSD } from "../types";

const ListHeader = () => (
  <View style={styles.listHeader}>
    <Text style={styles.price}>PRICE</Text>
    <Text style={styles.size}>SIZE</Text>
    <Text style={styles.total}>TOTAL</Text>
  </View>
);

function OrderBook(props: any) {
  const [open, setOpen] = useState(false);
  const [isLandscape, setIsLandscape] = useState(Platform.OS === "web");

  useEffect(() => {
    Store.subscribe();

    const timerId = setInterval(() => {
      if (Store.status == "subscribed") {
        // refresh only if subscribed
        Store.refresh();
      }
    }, 500);

    ScreenOrientation.getOrientationAsync().then(
      (orientation: ScreenOrientation.Orientation) => {
        setIsLandscape(
          orientation == ScreenOrientation.Orientation.LANDSCAPE_LEFT ||
            orientation == ScreenOrientation.Orientation.LANDSCAPE_RIGHT
        );
      }
    );

    return () => {
      clearInterval(timerId);
    };
  }, []);

  const offsets =
    Store.product_id === PI_XBTUSD
      ? GROUP_OFFSETS.PI_XBTUSD
      : GROUP_OFFSETS.PI_ETHUSD;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/** Header */}
        <View style={Platform.OS === "web" ? styles.headerWeb : styles.header}>
          <Text style={styles.title}>Order Book - {Store.product_id}</Text>
          <Pressable
            onPress={() => {
              setOpen(true);

              props.showActionSheetWithOptions(
                {
                  options: [...offsets, "Cancel"],
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

        <View style={isLandscape ? styles.listLandscape : styles.list}>
          {/** Bid */}
          <View style={styles.flex1}>
            <ListHeader />
            {isLandscape ? (
              <OrderList style={styles.asks} data={Store.asks} />
            ) : (
              <OrderList style={styles.bids} data={Store.bids} />
            )}
          </View>

          {!isLandscape && <View style={styles.separator} />}
          {/** Ask */}

          <View style={styles.flex1}>
            {isLandscape && <ListHeader />}
            {isLandscape ? (
              <OrderList
                style={styles.bids}
                data={Store.bids.slice().reverse()}
                align="left"
              />
            ) : (
              <OrderList style={styles.asks} data={Store.asks} />
            )}
          </View>
        </View>

        {/** Footer */}
        <View style={Platform.OS === "web" ? styles.footerWeb : styles.footer}>
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

          <Pressable
            onPress={() => {
              Store.kill();
            }}
          >
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
    paddingTop: Constants.statusBarHeight + 8,
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
  headerWeb: {
    position: Platform.OS == "web" ? "fixed" : "absolute",
    top: 0,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    paddingVertical: 8,
    padding: "5%",
    borderBottomWidth: 1,
    borderBottomColor: "#384252",
    backgroundColor: "#111827",
    zIndex: 2,
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
  listLandscape: {
    flex: 1,
    flexDirection: "row",
    paddingVertical: 60,
  },
  list: {
    flex: 1,
    flexDirection: "column",
  },
  flex1: {
    flex: 1,
    maxHeight: Platform.OS == "web" ? "85vh" : undefined,
  },
  bids: {
    flex: 1,
  },
  asks: {
    flex: 1,
  },
  separator: {
    flex: 0.05,
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
  footerWeb: {
    // FlatList bug in web
    position: Platform.OS == "web" ? "fixed" : "absolute",
    bottom: 0,
    width: "100%",
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
    backgroundColor: "#242d3c",
  },
});

export default connectActionSheet(observer(OrderBook));
