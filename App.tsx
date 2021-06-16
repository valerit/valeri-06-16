import React from "react";
import { StatusBar, Platform } from "react-native";
import { ActionSheetProvider } from "@expo/react-native-action-sheet";

import OrderBook from "./screens/OrderBook";

export default function App() {
  return (
    <ActionSheetProvider>
      <>
        <StatusBar barStyle="light-content" translucent={true} />
        <OrderBook />
      </>
    </ActionSheetProvider>
  );
}
