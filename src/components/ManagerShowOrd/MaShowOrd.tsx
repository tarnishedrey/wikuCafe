import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  Button,
  StyleSheet,
  Platform,
  TextInput,
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DateTimePicker from "@react-native-community/datetimepicker";
import { SafeAreaView } from "react-native-safe-area-context";

interface Order {
  order_id: number;
  order_date: string;
  customer_name: string;
  status: string;
  table_number: string;
  // Add other properties as needed
}

const MaShowOrd: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [date, setDate] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [searchKey, setSearchKey] = useState<string>("");

  useEffect(() => {
    const getToken = async () => {
      try {
        const storedToken = await AsyncStorage.getItem("token");
        setToken(storedToken);
      } catch (err) {
        console.error("Failed to get token from AsyncStorage", err);
        setError("Failed to authenticate. Please try logging in again.");
      }
    };

    getToken();
  }, []);

  const fetchOrders = async (
    searchDate: Date | null = null,
    search: string = ""
  ) => {
    if (!token) {
      setError("No authentication token found. Please log in.");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      let url = "https://ukkcafe.smktelkom-mlg.sch.id/api/order";

      // Determine the URL based on filtering options
      if (searchDate && search) {
        const formattedDate = searchDate.toISOString().split("T")[0]; // Format: YYYY-MM-DD
        url = `https://ukkcafe.smktelkom-mlg.sch.id/api/order/searchbydateandkey/${formattedDate}/${search}`;
      } else if (searchDate) {
        const formattedDate = searchDate.toISOString().split("T")[0]; // Format: YYYY-MM-DD
        url = `https://ukkcafe.smktelkom-mlg.sch.id/api/order/searchbydate/${formattedDate}`;
      } else if (search) {
        url = `https://ukkcafe.smktelkom-mlg.sch.id/api/order/search/${search}`;
      }

      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
          makerID: "62",
        },
      });

      if (
        response.data.status === "success" &&
        Array.isArray(response.data.data)
      ) {
        setOrders(response.data.data);
      } else {
        setOrders([]);
        setError("No orders found.");
      }
    } catch (err) {
      setError("Failed to fetch orders. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchOrders(date);
    }
  }, [token]);

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === "ios");
    if (selectedDate) {
      setDate(selectedDate);
      fetchOrders(selectedDate);
    }
  };

  const handleClearDate = () => {
    setDate(null);
    setSearchKey("");
    fetchOrders(null);
  };

  const handleSearch = () => {
    fetchOrders(null, searchKey);
  };

  const renderOrderItem = ({ item }: { item: Order }) => (
    <View style={styles.orderItem}>
      <Text>Order ID: {item.order_id}</Text>
      <Text>Date: {item.order_date}</Text>
      <Text>Customer: {item.customer_name}</Text>
      <Text>Status: {item.status}</Text>
      <Text>Table: {item.table_number}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.searchContainer}>
        <Button title="Select Date" onPress={() => setShowDatePicker(true)} />
        <Text>{date ? date.toDateString() : "All Orders"}</Text>
        <Button
          title="Clear"
          onPress={handleClearDate}
          disabled={!date && !searchKey}
        />
      </View>
      <View style={styles.searchInputContainer}>
        <TextInput
          style={styles.searchInput}
          value={searchKey}
          onChangeText={setSearchKey}
          placeholder="Search orders..."
        />
        <Button title="Search" onPress={handleSearch} />
      </View>
      {showDatePicker && (
        <DateTimePicker
          value={date || new Date()}
          mode="date"
          display="default"
          onChange={handleDateChange}
        />
      )}
      {loading ? (
        <Text>Loading...</Text>
      ) : error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : (
        <View style={styles.listContainer}>
          <FlatList
            data={orders}
            renderItem={renderOrderItem}
            keyExtractor={(item) => item.order_id.toString()}
            ListEmptyComponent={<Text>No orders found.</Text>}
            contentContainerStyle={{ flexGrow: 1 }}
          />
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  listContainer: {
    height: "60%",
  },
  searchContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  searchInputContainer: {
    flexDirection: "row",
    marginBottom: 20,
  },
  searchInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 8,
    marginRight: 10,
  },
  orderItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    marginBottom: 10,
  },
  errorText: {
    color: "red",
    fontSize: 16,
    textAlign: "center",
  },
});

export default MaShowOrd;
