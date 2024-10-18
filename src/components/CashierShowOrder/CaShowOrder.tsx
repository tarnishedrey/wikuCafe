import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
  Pressable,
  Alert,
} from "react-native";
import axios, { AxiosResponse } from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import styles from "./Style";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import Greet from "../Welcome/Greet";

interface OrderData {
  order_id: number;
  order_date: string;
  customer_name: string;
  table_number: string;
  status: string;
  created_at: string;
  updated_at: string;
}

interface OrderDetailItem {
  id: number;
  menu_name: string;
  quantity: number;
  price: number;
  order_detail_price: number;
}

interface ApiResponse {
  status: string;
  message: string;
  data: OrderData[];
}

interface OrderDetailResponse {
  status: string;
  message: string;
  data: OrderDetailItem[];
  total_price: number;
}

interface StatusUpdateResponse {
  status: string;
  message: string;
}

const BASE_URL = "https://ukkcafe.smktelkom-mlg.sch.id/api/order";
const MAKER_ID = "62";

const CaShowOrder: React.FC = () => {
  const [orders, setOrders] = useState<OrderData[]>([]);
  const [orderDetails, setOrderDetails] = useState<{
    [key: number]: OrderDetailItem[];
  }>({});
  const [totalPrices, setTotalPrices] = useState<{ [key: number]: number }>({});
  const [expandedOrderId, setExpandedOrderId] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    const initializeComponent = async () => {
      try {
        const storedUserId = await AsyncStorage.getItem("user_id");
        if (storedUserId) {
          const parsedUserId = JSON.parse(storedUserId);
          setUserId(parsedUserId);
          await fetchOrders(parsedUserId);
        } else {
          setError("User ID not found");
          return;
        }
      } catch (err) {
        setError("Failed to retrieve user ID");
        return;
      }
    };

    initializeComponent();
  }, []);

  const fetchOrders = async (userId: string) => {
    if (!userId) {
      setError("User ID not available");
      setLoading(false);
      return;
    }

    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        setError("No authentication token available");
        setLoading(false);
        return;
      }

      const API_URL = `${BASE_URL}/${userId}`;
      const orderResponse: AxiosResponse<ApiResponse> = await axios.get(
        API_URL,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            makerID: MAKER_ID,
          },
        }
      );

      if (
        orderResponse.data.status === "success" &&
        Array.isArray(orderResponse.data.data)
      ) {
        setOrders(orderResponse.data.data);
        await fetchAllOrderDetails(orderResponse.data.data);
      } else {
        setError("No orders found or unexpected response format");
      }
    } catch (err) {
      setError("Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  const fetchAllOrderDetails = async (orders: OrderData[]) => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        setError("No authentication token available");
        return;
      }

      const fetchedDetails: { [key: number]: OrderDetailItem[] } = {};
      const fetchedTotalPrices: { [key: number]: number } = {};

      await Promise.all(
        orders.map(async (order) => {
          try {
            const detailsResponse: AxiosResponse<OrderDetailResponse> =
              await axios.get(
                `https://ukkcafe.smktelkom-mlg.sch.id/api/orderdetail/${order.order_id}`,
                {
                  headers: {
                    Authorization: `Bearer ${token}`,
                    makerID: MAKER_ID,
                  },
                }
              );

            if (
              detailsResponse.data.status === "success" &&
              Array.isArray(detailsResponse.data.data)
            ) {
              fetchedDetails[order.order_id] = detailsResponse.data.data;
              fetchedTotalPrices[order.order_id] =
                detailsResponse.data.total_price;
            }
          } catch (err) {
            console.warn(`Failed to fetch details for order ${order.order_id}`);
          }
        })
      );

      setOrderDetails(fetchedDetails);
      setTotalPrices(fetchedTotalPrices);
    } catch (err) {
      setError("Failed to fetch all order details");
    }
  };

  const handleOrderPress = (orderId: number) => {
    setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
  };

  if (loading) {
    return (
      <View style={styles.centeredContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centeredContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  const updateOrderStatus = async (orderId: number, newStatus: string) => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        Alert.alert("Error", "No authentication token available");
        return;
      }

      const response: AxiosResponse<StatusUpdateResponse> = await axios.put(
        `${BASE_URL}/${orderId}/status`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            makerID: MAKER_ID,
          },
        }
      );

      if (response.data.status === "success") {
        Alert.alert("Success", `Order status updated to ${newStatus}`);
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order.order_id === orderId ? { ...order, status: newStatus } : order
          )
        );
        setExpandedOrderId(null);
      } else {
        Alert.alert("Error", "Failed to update order status");
      }
    } catch (err) {
      Alert.alert("Error", "An error occurred while updating the status");
    }
  };

  const handleUpdateStatusPress = (orderId: number, currentStatus: string) => {
    const newStatus = currentStatus === "paid" ? "pending" : "paid";
    updateOrderStatus(orderId, newStatus);
  };

  const getStatusStyle = (status: string) => {
    return status.toLowerCase() === "paid"
      ? styles.paidStatus
      : styles.pendingStatus;
  };

  return (
    <SafeAreaView>
      <Text style={styles.title}>Orders history</Text>
      <ScrollView style={styles.container}>
        {orders.map((order) => (
          <View key={order.order_id}>
            <TouchableOpacity
              onPress={() => handleOrderPress(order.order_id)}
              style={styles.orderItem}
            >
              <Text style={styles.orderText}>Order ID: {order.order_id}</Text>
              <Text style={styles.orderText}>
                Customer: {order.customer_name}
              </Text>
              <Text style={styles.orderText}>Date: {order.order_date}</Text>
              <Text style={[styles.orderText, getStatusStyle(order.status)]}>
                Status: {order.status}
              </Text>
            </TouchableOpacity>

            {expandedOrderId === order.order_id && (
              <View style={styles.orderDetails}>
                <Text style={styles.detailText}>
                  Table Number: {order.table_number}
                </Text>
                <Text style={styles.detailText}>
                  Created At: {order.created_at}
                </Text>
                <Text style={styles.detailText}>
                  Updated At: {order.updated_at}
                </Text>
                <Text style={styles.subtitle}>Order Items:</Text>
                {orderDetails[order.order_id]?.map((item, index) => (
                  <View key={index} style={styles.itemRow}>
                    <Text style={styles.itemTextLeft}>
                      {item.menu_name} x{item.quantity}
                    </Text>
                    <Text style={styles.itemTextRight}>
                      Price: Rp.{item.price}
                    </Text>
                    <Text style={styles.itemTextRight}>
                      Subtotal: Rp.{item.order_detail_price}
                    </Text>
                  </View>
                ))}
                <View style={styles.totalPriceContainer}>
                  <Text style={styles.totalPriceText}>
                    Total Price: Rp.{totalPrices[order.order_id]}
                  </Text>
                </View>
                {order.status.toLowerCase() === "paid" ? (
                  <View style={styles.updateButtonPaid}>
                    <Text style={styles.updateButtonText}>
                      The order is already paid
                    </Text>
                  </View>
                ) : (
                  <TouchableOpacity
                    style={styles.updateButton}
                    onPress={() =>
                      handleUpdateStatusPress(order.order_id, order.status)
                    }
                  >
                    <Text style={styles.updateButtonText}>Set to Paid</Text>
                  </TouchableOpacity>
                )}
              </View>
            )}
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

export default CaShowOrder;
