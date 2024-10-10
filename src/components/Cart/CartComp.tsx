import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  ScrollView,
  Pressable,
  TextInput,
  Alert,
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCart } from "@/src/contexts/CartContext";
import styles from "./Style";
import { useRouter } from "expo-router";

// Define the CartItem interface
interface CartItem {
  menu_id: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl: string;
  type: "food" | "drink";
}

interface Table {
  id: number;
  table_number: string;
}

const CartComp = () => {
  const router = useRouter();

  const { orders, reduceItem, addToCart, removeItem } = useCart();
  const [customerName, setCustomerName] = useState("");
  const [availableTables, setAvailableTables] = useState<Table[]>([]);
  const [selectedTable, setSelectedTable] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const total = orders.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  useEffect(() => {
    fetchAvailableTables();
  }, []);

  const fetchAvailableTables = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        Alert.alert("Error", "Please login first");
        return;
      }

      const response = await axios.get<{ data: Table[] }>(
        "https://ukkcafe.smktelkom-mlg.sch.id/api/table/available",
        {
          headers: {
            Authorization: `Bearer ${token}`,
            makerID: "47",
          },
        }
      );
      setAvailableTables(response.data.data);
    } catch (error) {
      console.error("Error fetching tables:", error);
      Alert.alert("Error", "Failed to fetch available tables");
    }
  };

  console.log("Orders:", orders);

  const createOrder = async () => {
    if (!customerName) {
      Alert.alert("Error", "Please enter customer name");
      return;
    }
    if (!selectedTable) {
      Alert.alert("Error", "Please select a table");
      return;
    }

    try {
      setLoading(true);
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        Alert.alert("Error", "Please login first");
        return;
      }

      const orderData = {
        user_id: "58",
        table_id: selectedTable,
        customer_name: customerName,
        detail: orders.map((order) => ({
          menu_id: order.menu_id,
          quantity: order.quantity.toString(),
        })),
      };

      const response = await axios.post(
        "https://ukkcafe.smktelkom-mlg.sch.id/api/order",
        orderData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            makerID: "47",
          },
        }
      );

      if (response.data.success) {
        Alert.alert("Success", "Order created successfully!", [
          {
            text: "OK",
            onPress: () => router.back(),
          },
        ]);
      }
    } catch (error: any) {
      console.error("Error creating order:", error.response?.data || error);
      Alert.alert("Error", "Failed to create order");
    } finally {
      setLoading(false);
    }
  };

  if (!orders.length) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>Your cart is empty</Text>
      </View>
    );
  }

  const renderItem = ({ item }: { item: CartItem }) => (
    <View style={styles.itemContainer}>
      <View style={styles.itemDetails}>
        <Text style={styles.menuText}>{item.name}</Text>
        <Text style={styles.priceText}>Rp. {item.price}</Text>
      </View>
      <View style={styles.quantityContainer}>
        <Pressable
          style={styles.quantityButton}
          onPress={() => reduceItem(item.name)}
        >
          <Text style={styles.quantityButtonText}>-</Text>
        </Pressable>
        <Text style={styles.quantityText}>{item.quantity}</Text>
        <Pressable
          style={styles.quantityButton}
          onPress={() => addToCart(item)}
        >
          <Text style={styles.quantityButtonText}>+</Text>
        </Pressable>
        <Pressable
          style={[styles.quantityButton, styles.removeButton]}
          onPress={() => removeItem(item.name)}
        >
          <Text style={styles.quantityButtonText}>×</Text>
        </Pressable>
      </View>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Order Details</Text>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Customer Name:</Text>
        <TextInput
          style={styles.input}
          value={customerName}
          onChangeText={setCustomerName}
          placeholder="Enter customer name"
        />
      </View>

      <View style={styles.tableContainer}>
        <Text style={styles.label}>Select Table:</Text>
        <ScrollView horizontal>
          {availableTables.map((table) => (
            <Pressable
              key={table.id}
              style={[
                styles.tableButton,
                selectedTable === table.id.toString() && styles.selectedTable,
              ]}
              onPress={() => setSelectedTable(table.id.toString())}
            >
              <Text
                style={[
                  styles.tableText,
                  selectedTable === table.id.toString() &&
                    styles.selectedTableText,
                ]}
              >
                Table {table.table_number}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      <FlatList
        data={orders}
        renderItem={renderItem}
        keyExtractor={(item) => item.menu_id}
        style={styles.listContainer}
      />

      <View style={styles.totalContainer}>
        <Text style={styles.totalText}>Total: Rp. {total}</Text>
      </View>

      <Pressable
        style={[styles.submitButton, loading && styles.submitButtonDisabled]}
        onPress={createOrder}
        disabled={loading}
      >
        <Text style={styles.submitButtonText}>
          {loading ? "Processing..." : "Submit Order"}
        </Text>
      </Pressable>
    </ScrollView>
  );
};

export default CartComp;
