import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Pressable,
  TextInput,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import styles from "./Style";

interface CartItem {
  menu_id: number;
  name: string;
  price: number;
  quantity: number;
}

interface Table {
  table_id: string;
  table_name: string;
  status: string;
  table_number: string;
  is_available: boolean;
}

const CartComp = () => {
  const params = useLocalSearchParams();
  const router = useRouter();
  const [groupedOrders, setGroupedOrders] = useState<CartItem[]>([]);
  const [tables, setTables] = useState<Table[]>([]);
  const [selectedTable, setSelectedTable] = useState<string>("");
  const [customerName, setCustomerName] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [token, setToken] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    if (params.orders) {
      try {
        const parsedOrders: CartItem[] = JSON.parse(params.orders as string);
        console.log("Parsed orders:", parsedOrders);
        setGroupedOrders(parsedOrders);
      } catch (error) {
        console.error("Error parsing orders:", error);
        setGroupedOrders([]);
      }
    }
    fetchTables();
  }, [params.orders]);

  const fetchTables = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const response = await axios.get(
        "https://ukkcafe.smktelkom-mlg.sch.id/api/table",
        {
          headers: {
            Authorization: `Bearer ${token}`,
            makerID: "47",
          },
        }
      );
      // Filter only available tables
      const availableTables = response.data.filter(
        (table: Table) => table.is_available
      );

      setTables(availableTables);
    } catch (error) {
      console.error("Error fetching tables:", error);
      setError("Failed to fetch tables");
    }
  };

  const handleSubmitOrder = async () => {
    if (!selectedTable) {
      setError("Please select a table");
      return;
    }
    if (!customerName) {
      setError("Please enter customer name");
      return;
    }

    try {
      setLoading(true);
      const token = await AsyncStorage.getItem("token");
      const userId = await AsyncStorage.getItem("user_id");

      if (!token || !userId) {
        throw new Error("Authentication data missing");
      }

      // Format the order data exactly as required by the API
      const orderData = {
        user_id: userId.toString(), // As string
        table_id: selectedTable.toString(), // As string
        customer_name: customerName.trim(),
        detail: groupedOrders.map((item) => ({
          menu_id: item.menu_id.toString(), // As string
          quantity: item.quantity.toString(), // As string
        })),
      };

      console.log(
        "Submitting order with data:",
        JSON.stringify(orderData, null, 2)
      );

      const response = await axios.post(
        "https://ukkcafe.smktelkom-mlg.sch.id/api/order",
        orderData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            makerID: "47",
            "Content-Type": "application/json",
          },
        }
      );

      console.log("API Response:", response.data);

      if (response.data.status === "success") {
        Alert.alert("Success", "Order submitted successfully", [
          {
            text: "OK",
            onPress: () => {
              setGroupedOrders([]);
              router.back();
            },
          },
        ]);
      } else {
        throw new Error(response.data.message || "Failed to submit order");
      }
    } catch (error) {
      console.error("Error submitting order:", error);

      if (axios.isAxiosError(error)) {
        console.error("Response data:", error.response?.data);
        console.error("Response status:", error.response?.status);

        const errorMessage =
          error.response?.data?.message ||
          error.message ||
          "Failed to submit order";

        setError(errorMessage);
        Alert.alert("Error", errorMessage);
      } else {
        setError("An unexpected error occurred");
        Alert.alert("Error", "An unexpected error occurred");
      }
    } finally {
      setLoading(false);
    }
  };
  const updateQuantity = (menuId: number, change: number) => {
    setGroupedOrders((prevOrders) => {
      return prevOrders
        .map((item) => {
          if (item.menu_id === menuId) {
            const newQuantity = Math.max(0, item.quantity + change);
            return { ...item, quantity: newQuantity };
          }
          return item;
        })
        .filter((item) => item.quantity > 0);
    });
  };

  const renderCartItem = ({ item }: { item: CartItem }) => {
    const itemTotal = item.price * item.quantity;
    return (
      <View style={styles.cartItem}>
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={styles.itemPrice}>Rp. {item.price}</Text>
        <View style={styles.quantityControls}>
          <Pressable
            style={styles.quantityButton}
            onPress={() => updateQuantity(item.menu_id, -1)}
          >
            <Text>-</Text>
          </Pressable>
          <Text>{item.quantity}</Text>
          <Pressable
            style={styles.quantityButton}
            onPress={() => updateQuantity(item.menu_id, 1)}
          >
            <Text>+</Text>
          </Pressable>
        </View>
        <Text style={styles.itemTotal}>Total: Rp. {itemTotal}</Text>
      </View>
    );
  };

  const renderTableItem = ({ item }: { item: Table }) => (
    <Pressable
      style={[
        styles.tableItem,
        selectedTable === item.table_id && styles.selectedTable,
      ]}
      onPress={() => setSelectedTable(item.table_id)}
    >
      <Text
        style={[
          styles.tableName,
          selectedTable === item.table_id && styles.selectedTableText,
        ]}
      >
        Table {item.table_number}
      </Text>
    </Pressable>
  );

  const totalPrice = groupedOrders.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Your Cart</Text>
      <FlatList
        data={groupedOrders}
        renderItem={renderCartItem}
        keyExtractor={(item) => `cart-${item.menu_id}`}
        ListEmptyComponent={() => (
          <Text style={styles.emptyCart}>Your cart is empty</Text>
        )}
      />

      {groupedOrders.length > 0 && (
        <View style={styles.orderSection}>
          <Text style={styles.sectionTitle}>Select Available Table</Text>
          <View style={styles.tablesContainer}>
            <FlatList
              data={tables}
              renderItem={renderTableItem}
              keyExtractor={(item) => item.table_id}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.tablesContent}
              ListEmptyComponent={() => (
                <Text style={styles.emptyTables}>No tables available</Text>
              )}
            />
          </View>

          <TextInput
            style={styles.input}
            placeholder="Enter customer name"
            value={customerName}
            onChangeText={setCustomerName}
          />

          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          <Text style={styles.totalText}>Total Price: Rp. {totalPrice}</Text>

          <Pressable
            style={styles.checkoutButton}
            onPress={handleSubmitOrder}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.checkoutButtonText}>Place Order</Text>
            )}
          </Pressable>
        </View>
      )}
    </View>
  );
};

export default CartComp;
