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
import ShowOrder from "../ShowOrder/ShowOrder";

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

      const menuItems = response.data.data.map((item: any) => {
        return {
          menu_id: Number(item.menu_id),
          name: item.menu_name,
          price: Number(item.price),
          imageUrl: `https://ukkcafe.smktelkom-mlg.sch.id/${item.menu_image_name}`,
          type: item.type.toLowerCase() as "food" | "drink",
          description: item.menu_description,
          quantity: 0,
        };
      });

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
      // Cari item yang sudah ada di cart
      const existingItemIndex = prevOrders.findIndex(
        (item) => item.menu_id === selectedItem.menu_id
      );

      if (existingItemIndex !== -1) {
        // Buat salinan array orders yang baru
        const updatedOrders = [...prevOrders];
        // Update hanya item yang dipilih
        updatedOrders[existingItemIndex] = {
          ...selectedItem, // Gunakan data dari selectedItem untuk memastikan data terbaru
          quantity: prevOrders[existingItemIndex].quantity + 1,
        };
        return updatedOrders;
      } else {
        // Tambahkan item baru dengan quantity 1
        return [...prevOrders, { ...selectedItem, quantity: 1 }];
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

  const navigateToCart = () => {
    // Filter out items with 0 quantity
    const validOrders = orders.filter((item) => item.quantity > 0);

    // Ensure we're only passing necessary data
    const simplifiedOrders = validOrders.map(
      ({ menu_id, name, price, quantity }) => ({
        menu_id,
        name,
        price,
        quantity,
      })
    );

    router.push({
      pathname: "/Cart",
      params: {
        orders: JSON.stringify(simplifiedOrders),
      },
    });
  };

  return (
    <ScrollView style={styles.container}>
      <ShowOrder />
      <View>
        <Text style={styles.header}>Drinks</Text>
        {renderMenuItems("drink")}
      </View>

      <View>
        <Text style={styles.header}>Food</Text>
        {renderMenuItems("food")}
      </View>

      {orders.length > 0 && (
        <Pressable style={styles.totalContainer} onPress={navigateToCart}>
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
