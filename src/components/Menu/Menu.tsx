import React, { useState } from "react";
import { Link, router } from "expo-router";
import {
  View,
  Text,
  FlatList,
  Image,
  Button,
  Pressable,
  ScrollView,
} from "react-native";
import styles from "./Style";
import Cart from "../Cart/CartComp";
import { SafeAreaView } from "react-native-safe-area-context";

const Menu = () => {
  const [numColumns, setNumColumns] = useState(2); // State to manage number of columns
  const [orders, setOrders] = useState<
    { name: string; price: number; type: "FOOD" | "DRINK" }[]
  >([]);

  const menus: {
    name: string;
    price: number;
    imageUrl: any;
    type: "FOOD" | "DRINK";
  }[] = [
    {
      name: "Nasi Goreng",
      price: 15000,
      imageUrl: require("../../assets/images/nasgor.jpg"),
      type: "FOOD",
    },
    {
      name: "Sate Taichan",
      price: 15000,
      imageUrl: require("../../assets/images/nasgor.jpg"),
      type: "FOOD",
    },
    {
      name: "Rawon",
      price: 15000,
      imageUrl: require("../../assets/images/nasgor.jpg"),
      type: "FOOD",
    },
    {
      name: "Sate Madura",
      price: 20000,
      imageUrl: require("../../assets/images/satemadura.jpeg"),
      type: "FOOD",
    },
    {
      name: "Es Jeruk",
      price: 30000,
      imageUrl: require("../../assets/images/ayambakar.jpg"),
      type: "DRINK",
    },
    {
      name: "Es Teh",
      price: 30000,
      imageUrl: require("../../assets/images/ayambakar.jpg"),
      type: "DRINK",
    },
  ];

  const toggleColumns = () => {
    setNumColumns(numColumns === 2 ? 1 : 2);
  };

  return (
    <>
      <ScrollView style={styles.container}>
        <View>
          <Text style={styles.header}>Minuman</Text>

          <FlatList
            data={menus.filter((menu) => menu.type === "DRINK")}
            renderItem={({ item, index }) => (
              <Pressable
                style={styles.foodContainer}
                onPress={() => {
                  setOrders([
                    ...orders,
                    { name: item.name, price: item.price, type: item.type },
                  ]);
                }}
              >
                <Image style={styles.image} source={item.imageUrl} />
                <Text style={styles.foodName}>{item.name}</Text>
                <Text style={styles.foodPrice}>{item.price}</Text>
              </Pressable>
            )}
            keyExtractor={(item, index) => index.toString()}
            numColumns={numColumns}
            key={numColumns}
            columnWrapperStyle={styles.row}
          />
        </View>
        <View>
          <Text style={styles.header}>Makanan</Text>

          <FlatList
            data={menus.filter((menu) => menu.type === "FOOD")}
            renderItem={({ item, index }) => (
              <Pressable
                style={styles.foodContainer}
                onPress={() => {
                  setOrders([
                    ...orders,
                    { name: item.name, price: item.price, type: item.type },
                  ]);
                }}
              >
                <Image style={styles.image} source={item.imageUrl} />
                <Text style={styles.foodName}>{item.name}</Text>
                <Text style={styles.foodPrice}>{item.price}</Text>
              </Pressable>
            )}
            keyExtractor={(item, index) => index.toString()}
            numColumns={numColumns}
            key={numColumns}
            columnWrapperStyle={styles.row}
          />
        </View>
      </ScrollView>

      {orders.length > 0 && (
        <Pressable
          style={styles.totalContainer}
          onPress={() =>
            router.push({
              pathname: "/Cart/Cart",
              params: {
                menus: orders.map((order) => order.name).join(", "),
                itemPrices: orders.map((order) => order.price).join(", "),
                total: orders.reduce((total, order) => total + order.price, 0),
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
              {orders.reduce((total, order) => total + order.price, 0)}
            </Text>
          </View>
        </Pressable>
      )}
    </>
  );
};

export default Menu;
