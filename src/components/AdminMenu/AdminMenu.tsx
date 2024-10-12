import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  Image,
  Pressable,
  ScrollView,
  Alert,
} from "react-native";
import axios, { AxiosResponse } from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import styles from "./Style";
import { useRouter } from "expo-router";

export type MenuItem = {
  menu_id: number;
  name: string;
  price: number;
  imageUrl: string;
  type: "food" | "drink";
  description: string;
};

const API_URL = "https://ukkcafe.smktelkom-mlg.sch.id/api/menu";
const EDIT_API_URL = "https://ukkcafe.smktelkom-mlg.sch.id/api/menu";

const AdminMenu = () => {
  const router = useRouter();
  const [menus, setMenus] = useState<MenuItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedMenu, setSelectedMenu] = useState<MenuItem | null>(null);
  const [formValues, setFormValues] = useState({
    name: "",
    price: "",
    type: "",
    description: "",
  });

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

  const handleEdit = (menu: MenuItem) => {
    setSelectedMenu(menu);
    setFormValues({
      name: menu.name,
      price: menu.price.toString(),
      type: menu.type,
      description: menu.description,
    });
  };

  const handleSave = async () => {
    if (!selectedMenu) return;

    const token = await AsyncStorage.getItem("token");
    if (!token) {
      setError("Unauthorized");
      return;
    }

    try {
      await axios.put(
        `${EDIT_API_URL}/${selectedMenu.menu_id}`,
        {
          menu_name: formValues.name,
          price: Number(formValues.price),
          type: formValues.type,
          menu_description: formValues.description,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            makerID: "47",
          },
        }
      );

      Alert.alert("Success", "Menu item updated successfully");
      setSelectedMenu(null);
      setFormValues({ name: "", price: "", type: "", description: "" });
      await fetchMenus(token); // Refresh the menu list after saving
    } catch (error: any) {
      console.error("Error updating menu:", error);
      setError("Failed to update menu");
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

  const renderMenuItems = (type: "food" | "drink") => (
    <View>
      {menus
        .filter((menu) => menu.type === type)
        .map((item, index) => (
          <Pressable
            key={`${type}-${item.menu_id}-${index}`}
            style={styles.foodContainer}
            onPress={() => handleEdit(item)}
          >
            <Image style={styles.image} source={{ uri: item.imageUrl }} />
            <Text style={styles.foodName}>{item.name}</Text>
            <Text style={styles.foodPrice}>Rp. {item.price}</Text>
            <Text style={styles.description}>{item.description}</Text>
          </Pressable>
        ))}
    </View>
  );

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

      {selectedMenu && (
        <View style={styles.editForm}>
          <Text style={styles.header}>Edit Menu</Text>

          <TextInput
            style={styles.input}
            placeholder="Name"
            value={formValues.name}
            onChangeText={(value) =>
              setFormValues((prev) => ({ ...prev, name: value }))
            }
          />
          <TextInput
            style={styles.input}
            placeholder="Price"
            keyboardType="numeric"
            value={formValues.price}
            onChangeText={(value) =>
              setFormValues((prev) => ({ ...prev, price: value }))
            }
          />
          <TextInput
            style={styles.input}
            placeholder="Type (food/drink)"
            value={formValues.type}
            onChangeText={(value) =>
              setFormValues((prev) => ({ ...prev, type: value }))
            }
          />
          <TextInput
            style={styles.input}
            placeholder="Description"
            value={formValues.description}
            onChangeText={(value) =>
              setFormValues((prev) => ({ ...prev, description: value }))
            }
          />

          <Button title="Save" onPress={handleSave} />
        </View>
      )}
    </ScrollView>
  );
};

export default AdminMenu;
