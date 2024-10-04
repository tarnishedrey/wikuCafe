import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  Pressable,
  ScrollView,
  Alert,
} from "react-native";
import axios, { AxiosResponse } from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import styles from "./Style";
import { useCart } from "@/src/contexts/CartContext";
import { useRouter } from "expo-router";

export type CartItem = {
  name: string;
  price: number;
  imageUrl: string;
  type: "food" | "drink";
  description: string;
  quantity: number;
};

const API_URL = "https://ukkcafe.smktelkom-mlg.sch.id/api/menu";

const Menu = () => {
  const { addToCart, orders } = useCart();
  const router = useRouter();
  const [menus, setMenus] = useState<CartItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false); // Track login state
  const [loading, setLoading] = useState<boolean>(true); // Track loading state

  // Function to fetch menus
  const fetchMenus = async (token: string) => {
    try {
      const response: AxiosResponse = await axios.get(API_URL, {
        headers: {
          Authorization: `Bearer ${token}`,
          makerID: "47",
        },
      });

      const menuItems = response.data.data.map((item: any) => ({
        name: item.menu_name,
        price: item.price,
        imageUrl: `https://ukkcafe.smktelkom-mlg.sch.id/api/${item.menu_image_name}`,
        type: item.type.toLowerCase() as "food" | "drink",
        description: item.menu_description,
        quantity: 1,
      }));

      setMenus(menuItems);
    } catch (error: any) {
      console.error("Error:", error.response?.data || error.message);
      setError("Failed to fetch menus");

      if (axios.isAxiosError(error)) {
        if (error.response) {
          Alert.alert(
            "Error",
            `Response error: ${
              error.response.data.message || "An error occurred"
            }`
          );
        } else if (error.request) {
          Alert.alert("Error", "No response received from the server.");
        } else {
          Alert.alert("Error", `Error message: ${error.message}`);
        }
      } else {
        Alert.alert("Error", "An unexpected error occurred.");
      }
    } finally {
      setLoading(false); // Stop loading
    }
  };

  // Check login state and fetch menus
  useEffect(() => {
    const checkLoginAndFetchMenus = async () => {
      const token = await AsyncStorage.getItem("token");
      if (token) {
        setIsLoggedIn(true);
        await fetchMenus(token);
      } else {
        setIsLoggedIn(false);
        setLoading(false); // Stop loading if not logged in
      }
    };

    checkLoginAndFetchMenus();
  }, [isLoggedIn]);

  // Helper function to render menu items
  const renderMenuItems = (type: "food" | "drink") => (
    <FlatList
      data={menus.filter((menu) => menu.type === type)}
      renderItem={({ item }) => (
        <Pressable
          style={styles.foodContainer}
          onPress={() => addToCart({ ...item, quantity: 1 })}
        >
          <Image style={styles.image} source={{ uri: item.imageUrl }} />
          <Text style={styles.foodName}>{item.name}</Text>
          <Text style={styles.foodPrice}>Rp. {item.price}</Text>
          <Text>{item.description}</Text>
        </Pressable>
      )}
      keyExtractor={(item, index) => index.toString()}
      numColumns={2}
      columnWrapperStyle={styles.row}
    />
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (!isLoggedIn) {
    return (
      <View style={styles.container}>
        <Text style={styles.header}>Nothing to show, please log in</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Drinks Section */}
      <View>
        <Text style={styles.header}>Drinks</Text>
        {renderMenuItems("drink")}
      </View>

      {/* Food Section */}
      <View>
        <Text style={styles.header}>Food</Text>
        {renderMenuItems("food")}
      </View>

      {/* Cart Summary and Navigation */}
      {orders.length > 0 && (
        <Pressable
          style={styles.totalContainer}
          onPress={() =>
            router.push({
              pathname: "/Cart/Cart",
              params: {
                menus: orders.map((order) => order.name).join(", "),
                itemPrices: orders.map((order) => order.price).join(", "),
                total: orders.reduce(
                  (total, order) => total + order.price * order.quantity,
                  0
                ),
              },
            })
          }
        >
          <Text style={styles.cartTitle}>Cart | </Text>
          <View style={styles.cartInfo}>
            <Text style={styles.cartItems}>
              {orders.length} {orders.length === 1 ? "item" : "items"}
            </Text>
            <Text style={styles.cartTotal}>
              Rp.
              {orders.reduce(
                (total, order) => total + order.price * order.quantity,
                0
              )}
            </Text>
          </View>
        </Pressable>
      )}
    </ScrollView>
  );
};

export default Menu;
