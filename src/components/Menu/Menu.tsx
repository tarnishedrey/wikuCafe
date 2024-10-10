import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  Pressable,
  ScrollView,
} from "react-native";
import axios, { AxiosResponse } from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import styles from "./Style";
import { useRouter } from "expo-router";

export type CartItem = {
  menu_id: number;
  name: string;
  price: number;
  imageUrl: string;
  type: "food" | "drink";
  description: string;
  quantity: number;
};

const API_URL = "https://ukkcafe.smktelkom-mlg.sch.id/api/menu";

const Menu = () => {
  const router = useRouter();
  const [menus, setMenus] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<CartItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchMenus = async (token: string) => {
    try {
      const response: AxiosResponse = await axios.get(API_URL, {
        headers: {
          Authorization: `Bearer ${token}`,
          makerID: "47",
        },
      });

      const menuItems = response.data.data.map((item: any) => ({
        menu_id: Number(item.id),
        name: item.menu_name,
        price: Number(item.price),
        imageUrl: `https://ukkcafe.smktelkom-mlg.sch.id/${item.menu_image_name}`,
        type: item.type.toLowerCase() as "food" | "drink",
        description: item.menu_description,
        quantity: 0, // Initialize quantity
      }));

      setMenus(menuItems);
    } catch (error: any) {
      console.error("Error fetching menus:", error);
      setError("Failed to fetch menus");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const checkLoginAndFetchMenus = async () => {
      const token = await AsyncStorage.getItem("token");
      if (token) {
        setIsLoggedIn(true);
        await fetchMenus(token);
      } else {
        setIsLoggedIn(false);
        setLoading(false);
      }
    };

    checkLoginAndFetchMenus();
  }, []);

  const addToCart = (selectedItem: CartItem) => {
    setOrders((prevOrders) => {
      // Deep copy current orders
      const currentOrders = [...prevOrders];

      // Find if item already exists in cart
      const existingItemIndex = currentOrders.findIndex(
        (item) => item.menu_id === selectedItem.menu_id
      );

      if (existingItemIndex !== -1) {
        // If item exists, just update its quantity
        currentOrders[existingItemIndex] = {
          ...currentOrders[existingItemIndex],
          quantity: currentOrders[existingItemIndex].quantity + 1,
        };
        return currentOrders;
      } else {
        // If item doesn't exist, add it with quantity 1
        return [...currentOrders, { ...selectedItem, quantity: 1 }];
      }
    });
  };

  const getItemQuantity = (menuId: number): number => {
    const cartItem = orders.find((item) => item.menu_id === menuId);
    return cartItem ? cartItem.quantity : 0;
  };

  const renderMenuItems = (type: "food" | "drink") => (
    <FlatList
      data={menus.filter((menu) => menu.type === type)}
      renderItem={({ item, index }) => {
        const quantity = getItemQuantity(item.menu_id);
        return (
          <Pressable
            style={styles.foodContainer}
            onPress={() => addToCart(item)}
          >
            <Image style={styles.image} source={{ uri: item.imageUrl }} />
            <Text style={styles.foodName}>{item.name}</Text>
            <Text style={styles.foodPrice}>Rp. {item.price}</Text>
            <Text style={styles.description}>{item.description}</Text>
            {quantity > 0 && (
              <View style={styles.quantityBadge}>
                <Text style={styles.quantityText}>{quantity}</Text>
              </View>
            )}
          </Pressable>
        );
      }}
      keyExtractor={(item, index) => `${type}-${item.menu_id}-${index}`}
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
      <View>
        <Text style={styles.header}>Drinks</Text>
        {renderMenuItems("drink")}
      </View>

      <View>
        <Text style={styles.header}>Food</Text>
        {renderMenuItems("food")}
      </View>

      {orders.length > 0 && (
        <Pressable
          style={styles.totalContainer}
          onPress={() => {
            // Make sure we only send orders with quantity > 0
            const validOrders = orders.filter((item) => item.quantity > 0);
            router.push({
              pathname: "/Cart",
              params: { orders: JSON.stringify(validOrders) },
            });
          }}
        >
          <Text style={styles.cartTitle}>Cart | </Text>
          <View style={styles.cartInfo}>
            <Text style={styles.cartItems}>
              {orders.reduce((total, item) => total + item.quantity, 0)} items
            </Text>
            <Text style={styles.cartTotal}>
              Rp.{" "}
              {orders.reduce(
                (total, item) => total + item.price * item.quantity,
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
