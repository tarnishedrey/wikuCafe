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
import * as Print from "expo-print";
import * as Sharing from "expo-sharing";

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

interface OrderResponse {
  status: string;
  message: string;
  data: {
    order: {
      order_id: number;
      order_date: string;
      user_id: number;
      table_id: number;
      customer_name: string;
      status: string;
      maker_id: number;
      created_at: string;
      updated_at: string;
    };
  };
}

const MAKER_ID = "62";

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
  const [cashierName, setCashierName] = useState<string>("");

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

  useEffect(() => {
    const fetchCashierName = async () => {
      const name = await AsyncStorage.getItem("cashiername");
      setCashierName(name || "Unknown Cashier");
    };

    fetchCashierName();
  }, []);

  const fetchTables = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const response = await axios.get(
        "https://ukkcafe.smktelkom-mlg.sch.id/api/table/available",
        {
          headers: {
            Authorization: `Bearer ${token}`,
            makerID: "62",
          },
        }
      );

      setTables(response.data);
    } catch (error) {
      console.error("Error fetching tables:", error);
      setError("Failed to fetch tables");
    }
  };

  const generatePDF = async (
    orderData: any,
    responseData: OrderResponse["data"]["order"]
  ) => {
    try {
      console.log(
        "GeneratePDF - Order Data:",
        JSON.stringify(orderData, null, 2)
      );
      console.log(
        "GeneratePDF - Response Data:",
        JSON.stringify(responseData, null, 2)
      );
      console.log("GeneratePDF - Cashier Name:", cashierName);

      const totalPrice = calculateTotal(orderData.detail);
      const htmlContent = `
  <html>
    <head>
      <style>
        body {
          font-family: Arial, sans-serif;
          margin: 20px;
          color: #333;
        }
        h1 {
          text-align: center;
          color: #2E8B57;
        }
        h2 {
          color: #2E8B57;
        }
        p {
          font-size: 14px;
          line-height: 1.5;
        }
        ul {
          list-style-type: none;
          padding: 0;
        }
        li {
          margin: 5px 0;
          padding: 10px;
          border: 1px solid #ddd;
          border-radius: 5px;
          background-color: #f9f9f9;
        }
        .total {
          font-weight: bold;
          font-size: 16px;
          color: #d9534f;
        }
        .receipt {
          border: 1px solid #ddd;
          padding: 15px;
          border-radius: 5px;
          background-color: #f2f2f2;
          box-shadow: 0 0 10px rgba(0,0,0,0.1);
        }
      </style>
    </head>
    <body>
      <div class="receipt">
        <h1>Wikusama Cafe</h1>
        <p>Order ID: ${responseData.order_id || "N/A"}</p>
        <p>Order Date: ${responseData.order_date || "N/A"}</p>
        <p>Customer: ${responseData.customer_name || "N/A"}</p>
        <p>Table: ${responseData.table_id || "N/A"}</p>
        <p>Cashier: ${cashierName || "N/A"}</p>
        <h2>Items:</h2>
        <ul>
          ${orderData.detail
            .map(
              (item: any) => `
              <li>${item.name} - Quantity: ${item.quantity} - Price: Rp. ${item.price}</li>
            `
            )
            .join("")}
        </ul>
        <p class="total">Total: Rp. ${totalPrice.toFixed(2)}</p>
      </div>
    </body>
  </html>
`;

      const { uri } = await Print.printToFileAsync({ html: htmlContent });
      console.log("PDF file saved to:", uri);

      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(uri, {
          UTI: ".pdf",
          mimeType: "application/pdf",
        });
      } else {
        Alert.alert(
          "Sharing not available",
          "PDF has been generated but sharing is not available on this device."
        );
      }
    } catch (error) {
      console.error("Error generating PDF:", error);
      Alert.alert("Error", "Failed to generate PDF");
    }
  };

  const calculateTotal = (items: any[]): number => {
    return items.reduce((total, item) => total + item.price * item.quantity, 0);
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

      const orderData = {
        user_id: userId.toString(),
        table_id: selectedTable.toString(),
        customer_name: customerName.trim(),
        detail: groupedOrders.map((item) => ({
          menu_id: item.menu_id.toString(),
          quantity: item.quantity.toString(),
          name: item.name,
          price: item.price,
        })),
      };

      console.log(
        "Submitting order with data:",
        JSON.stringify(orderData, null, 2)
      );

      const response = await axios.post<OrderResponse>(
        "https://ukkcafe.smktelkom-mlg.sch.id/api/order",
        orderData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            makerID: MAKER_ID,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("API Response:", JSON.stringify(response.data, null, 2));
      console.log(
        "Response Data Order:",
        JSON.stringify(response.data.data.order, null, 2)
      );
      console.log("Cashier Name:", cashierName);

      if (response.data.status === "success") {
        await generatePDF(orderData, response.data.data.order);
        Alert.alert(
          "Success",
          "Order submitted successfully and PDF generated",
          [
            {
              text: "OK",
              onPress: () => {
                setGroupedOrders([]);
                router.back();
              },
            },
          ]
        );
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

  console.log();

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
