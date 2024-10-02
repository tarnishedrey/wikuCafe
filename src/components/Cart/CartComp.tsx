import { View, Text, FlatList, ScrollView } from "react-native";
import React, { useEffect } from "react";
import styles from "./Style";

const CartComp = ({
  menus,
  itemPrices,
  total,
}: {
  menus: string[];
  itemPrices: number[];
  total: number;
}) => {
  const data = menus.map((menu, index) => ({
    menu,
    price: itemPrices[index],
  }));

  useEffect(() => {
    console.log("Menus:", menus);
    console.log("Prices:", itemPrices);
    console.log("Total:", total);
  }, [menus, itemPrices, total]);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Order list</Text>

      <FlatList
        data={data}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.itemContainer}>
            <Text style={styles.menuText}>{item.menu}</Text>
            <Text style={styles.priceText}>Rp.{item.price.toFixed(2)}</Text>
          </View>
        )}
      />

      <View style={styles.totalContainer}>
        <Text style={styles.totalText}>Total: </Text>
        <Text style={styles.totalPriceText}>Rp.{total.toFixed(2)}</Text>
      </View>
    </ScrollView>
  );
};

export default CartComp;
