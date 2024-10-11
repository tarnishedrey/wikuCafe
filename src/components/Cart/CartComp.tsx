import React, { useEffect, useState } from "react";
import { View, Text, FlatList, Pressable } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import styles from "./Style";

interface CartItem {
  menu_id: number;
  name: string;
  price: number;
  quantity: number;
}

const CartComp = () => {
  const params = useLocalSearchParams();
  const router = useRouter();
  const [groupedOrders, setGroupedOrders] = useState<CartItem[]>([]);

  useEffect(() => {
    if (params.orders) {
      try {
        const parsedOrders: CartItem[] = JSON.parse(params.orders as string);
        console.log("Parsed orders:", parsedOrders); // Debug log

        // No need to group orders anymore since they're already grouped in Menu
        setGroupedOrders(parsedOrders);
      } catch (error) {
        console.error("Error parsing orders:", error);
        setGroupedOrders([]);
      }
    }
  }, [params.orders]);

  const updateQuantity = (menuId: number, change: number) => {
    setGroupedOrders((prevOrders) => {
      return prevOrders
        .map((item) => {
          if (item.menu_id === menuId) {
            const newQuantity = Math.max(0, item.quantity + change);
            return {
              ...item,
              quantity: newQuantity,
            };
          }
          return item; // Return item lain tanpa perubahan
        })
        .filter((item) => item.quantity > 0); // Hapus item dengan quantity 0
    });
  };

  const renderCartItem = ({ item }: { item: CartItem }) => {
    const itemTotal = item.price * item.quantity;

    return (
      <View style={styles.cartItem}>
        <View style={styles.cartItemHeader}>
          <Text style={styles.itemName}>{item.name}</Text>
        </View>
        <View style={styles.itemDetails}>
          <Text style={styles.itemPrice}>Rp. {item.price}</Text>
          <View style={styles.quantityControls}>
            <Pressable
              style={styles.quantityButton}
              onPress={() => updateQuantity(item.menu_id, -1)}
            >
              <Text style={styles.quantityButtonText}>-</Text>
            </Pressable>
            <Text style={styles.itemQuantity}>{item.quantity}</Text>
            <Pressable
              style={styles.quantityButton}
              onPress={() => updateQuantity(item.menu_id, 1)}
            >
              <Text style={styles.quantityButtonText}>+</Text>
            </Pressable>
          </View>
        </View>
        <View style={styles.priceRow}>
          <Text style={styles.priceLabel}>Total:</Text>
          <Text style={styles.itemTotal}>Rp. {itemTotal}</Text>
        </View>
      </View>
    );
  };

  const totalPrice = groupedOrders.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Your Cart</Text>

      <FlatList
        data={groupedOrders}
        renderItem={renderCartItem}
        keyExtractor={(item) => `cart-${item.menu_id}`}
        ListEmptyComponent={() => (
          <Text style={styles.emptyCart}>Your cart is empty</Text>
        )}
      />

      {groupedOrders.length > 0 && (
        <View style={styles.footer}>
          <View style={styles.totalContainer}>
            <Text style={styles.totalText}>Total Price: Rp. {totalPrice}</Text>
          </View>
          <Pressable
            style={styles.checkoutButton}
            onPress={() => {
              // Navigate to checkout with current grouped orders
              router.push({
                pathname: "/Checkout",
                params: { orders: JSON.stringify(groupedOrders) },
              });
            }}
          >
            <Text style={styles.checkoutButtonText}>Proceed to Checkout</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
};

export default CartComp;
