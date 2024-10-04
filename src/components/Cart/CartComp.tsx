import { View, Text, FlatList, ScrollView, Pressable } from "react-native";
import React from "react";
import styles from "./Style";

const CartComp = ({
  menus,
  itemPrices,
  quantities,
  total,
  onIncrease,
  onDecrease,
}: {
  menus: string[];
  itemPrices: number[];
  quantities: number[];
  total: number;
  onIncrease: (index: number) => void;
  onDecrease: (index: number) => void;
}) => {
  const data = menus.map((menu, index) => ({
    menu,
    price: itemPrices[index],
    quantity: quantities[index],
  }));

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Order List</Text>

      <FlatList
        data={data}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => (
          <View style={styles.itemContainer}>
            <Text style={styles.menuText}>{item.menu}</Text>
            <Text style={styles.priceText}>Rp. {item.price.toFixed(2)}</Text>
            <View style={styles.quantityContainer}>
              <Pressable
                onPress={() => onDecrease(index)}
                style={styles.button}
              >
                <Text style={styles.buttonText}>-</Text>
              </Pressable>
              <Text style={styles.quantityText}>{item.quantity}</Text>
              <Pressable
                onPress={() => onIncrease(index)}
                style={styles.button}
              >
                <Text style={styles.buttonText}>+</Text>
              </Pressable>
            </View>
          </View>
        )}
      />

      <View style={styles.totalContainer}>
        <Text style={styles.totalText}>Total: </Text>
        <Text style={styles.totalPriceText}>Rp. {total.toFixed(2)}</Text>
      </View>
    </ScrollView>
  );
};

export default CartComp;
