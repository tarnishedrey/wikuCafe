import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
  Pressable,
} from "react-native";
import axios, { AxiosResponse } from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import styles from "./Style"; // Import styles from the separate file
import { router } from "expo-router";

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

const API_URL = "https://ukkcafe.smktelkom-mlg.sch.id/api/order/57";
const MAKER_ID = "47";

const CaShowOrder: React.FC = () => {
  const [orders, setOrders] = useState<OrderData[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<OrderData | null>(null);
  const [orderDetails, setOrderDetails] = useState<OrderDetailItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [totalPrice, setTotalPrice] = useState<number>(0);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        setError("No authentication token available");
        setLoading(false);
        return;
      }

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
      } else {
        setError("No orders found or unexpected response format");
      }
    } catch (err) {
      setError("Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  const fetchOrderDetails = async (orderId: number) => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        setError("No authentication token available");
        return;
      }

      const detailsResponse: AxiosResponse<OrderDetailResponse> =
        await axios.get(
          `https://ukkcafe.smktelkom-mlg.sch.id/api/orderdetail/${orderId}`,
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
        setOrderDetails(detailsResponse.data.data);
        setTotalPrice(detailsResponse.data.total_price);
      } else {
        setError("No order details found or unexpected response format");
      }
    } catch (err) {
      setError("Failed to fetch order details");
    } finally {
      setLoading(false);
    }
  };

  const handleOrderPress = (order: OrderData) => {
    setSelectedOrder(order);
    fetchOrderDetails(order.order_id);
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

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Orders</Text>
      <Pressable
        onPress={() => {
          router.back();
        }}
      >
        <Text>go back</Text>
      </Pressable>
      {orders.map((order) => (
        <TouchableOpacity
          key={order.order_id}
          onPress={() => handleOrderPress(order)}
          style={styles.orderItem}
        >
          <Text style={styles.orderText}>Order ID: {order.order_id}</Text>
          <Text style={styles.orderText}>Customer: {order.customer_name}</Text>
          <Text style={styles.orderText}>Date: {order.order_date}</Text>
          <Text style={styles.orderText}>Status: {order.status}</Text>
        </TouchableOpacity>
      ))}
      {selectedOrder && (
        <View style={styles.orderDetails}>
          <Text style={styles.subtitle}>Selected Order Details</Text>
          <Text style={styles.detailText}>
            Order ID: {selectedOrder.order_id}
          </Text>
          <Text style={styles.detailText}>
            Customer: {selectedOrder.customer_name}
          </Text>
          <Text style={styles.detailText}>
            Date: {selectedOrder.order_date}
          </Text>
          <Text style={styles.detailText}>
            Table Number: {selectedOrder.table_number}
          </Text>
          <Text style={styles.detailText}>Status: {selectedOrder.status}</Text>
          <Text style={styles.detailText}>
            Created At: {selectedOrder.created_at}
          </Text>
          <Text style={styles.detailText}>
            Updated At: {selectedOrder.updated_at}
          </Text>
          {orderDetails.length > 0 && (
            <View>
              <Text style={styles.subtitle}>Order Items:</Text>
              {orderDetails.map((item, index) => (
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
                  Total Price: Rp.{totalPrice}
                </Text>
              </View>
            </View>
          )}
        </View>
      )}
    </ScrollView>
  );
};

export default CaShowOrder;
