import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function OrderList() {
  return (
    <View style={styles.container}>
      <Text>OrderList</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
