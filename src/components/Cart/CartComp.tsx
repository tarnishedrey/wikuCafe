import React from "react";
import { View, Text, FlatList } from "react-native";
import { useLocalSearchParams } from "expo-router";
import styles from "./Style";

interface CartItem {
  menu_id: number;
  name: string;
  price: number;
  quantity: number;
}

const CartComp = () => {
  const params = useLocalSearchParams();
  const orders: CartItem[] = params.orders
    ? JSON.parse(params.orders as string)
    : [];

  const renderCartItem = ({ item }: { item: CartItem }) => {
    const itemTotal = item.price * item.quantity;

    return (
      <View style={styles.cartItem}>
        <View style={styles.cartItemHeader}>
          <Text style={styles.itemName}>{item.name}</Text>
        </View>
        <View style={styles.itemDetails}>
          <Text style={styles.itemPrice}>Rp. {item.price}</Text>
          <Text style={styles.itemQuantity}>Qty: {item.quantity}</Text>
        </View>
        <View style={styles.priceRow}>
          <Text style={styles.priceLabel}>Total:</Text>
          <Text style={styles.itemTotal}>Rp. {itemTotal}</Text>
        </View>
      </View>
    );
  };

  const totalPrice = orders.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Your Cart</Text>

      <FlatList
        data={orders}
        renderItem={renderCartItem}
        keyExtractor={(item) => `cart-${item.menu_id}`}
        ListEmptyComponent={() => (
          <Text style={styles.emptyCart}>Your cart is empty</Text>
        )}
      />

      <View style={styles.totalContainer}>
        <Text style={styles.totalText}>Total Price: Rp. {totalPrice}</Text>
      </View>
    </View>
  );
};

export default CartComp;
