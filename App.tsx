import React from "react";
import { StatusBar } from "react-native";

import OrderBook from "./screens/OrderBook";

export default function App() {
  return (
    <>
      <StatusBar barStyle="light-content" translucent={true} />
      <OrderBook />
    </>
  );
}
