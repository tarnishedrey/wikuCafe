import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Image,
  Pressable,
  ScrollView,
  Alert,
} from "react-native";
import axios, { AxiosResponse } from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import styles from "./Style";

export type MenuItem = {
  menu_id: number;
  name: string;
  price: number;
  imageUrl: string;
  type: "food" | "drink";
  description: string;
};

const API_URL = "https://ukkcafe.smktelkom-mlg.sch.id/api/menu";

const AdminMenu = () => {
  const [menus, setMenus] = useState<MenuItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedMenuId, setSelectedMenuId] = useState<number | null>(null);
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
          makerID: "62",
        },
      });

      const menuItems = response.data.data.map((item: any) => ({
        menu_id: Number(item.menu_id),
        name: item.menu_name,
        price: Number(item.price),
        imageUrl: `https://ukkcafe.smktelkom-mlg.sch.id/${item.menu_image_name}`,
        type: item.type.toLowerCase() as "food" | "drink",
        description: item.menu_description,
      }));

      setMenus(menuItems);
    } catch (error: any) {
      console.error("Error fetching menus:", error);
      setError("Failed to fetch menus");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (menu: MenuItem) => {
    setSelectedMenuId(menu.menu_id);
    setFormValues({
      name: menu.name,
      price: menu.price.toString(),
      type: menu.type,
      description: menu.description,
    });
  };

  const handleSave = async () => {
    if (selectedMenuId === null) return;

    const token = await AsyncStorage.getItem("token");
    if (!token) {
      setError("Unauthorized");
      return;
    }

    try {
      await axios.put(
        `${API_URL}/${selectedMenuId}`,
        {
          menu_name: formValues.name,
          price: Number(formValues.price),
          type: formValues.type,
          menu_description: formValues.description,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            makerID: "62",
          },
        }
      );

      Alert.alert("Success", "Menu item updated successfully");
      setSelectedMenuId(null);
      setFormValues({ name: "", price: "", type: "", description: "" });
      await fetchMenus(token);
    } catch (error: any) {
      console.error("Error updating menu:", error);
      setError("Failed to update menu");
    }
  };

  const handleDelete = async (menuId: number) => {
    const token = await AsyncStorage.getItem("token");
    if (!token) {
      setError("Unauthorized");
      return;
    }

    Alert.alert(
      "Confirm Delete",
      "Are you sure you want to delete this menu item?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await axios.delete(`${API_URL}/${menuId}`, {
                headers: {
                  Authorization: `Bearer ${token}`,
                  makerID: "62",
                },
              });

              Alert.alert("Success", "Menu item deleted successfully");
              await fetchMenus(token);
            } catch (error: any) {
              console.error("Error deleting menu:", error);
              setError("Failed to delete menu");
            }
          },
        },
      ]
    );
  };

  const handleCancelEdit = () => {
    setSelectedMenuId(null);
    setFormValues({ name: "", price: "", type: "", description: "" });
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

  const renderMenuItem = (item: MenuItem) => (
    <View key={`${item.type}-${item.menu_id}`} style={styles.foodContainer}>
      <Image style={styles.image} source={{ uri: item.imageUrl }} />
      {selectedMenuId === item.menu_id ? (
        <View style={styles.editForm}>
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
          <View style={styles.editButtonContainer}>
            <Pressable onPress={handleSave} style={styles.saveButton}>
              <Text style={styles.buttonText}>Save</Text>
            </Pressable>
            <Pressable onPress={handleCancelEdit} style={styles.cancelButton}>
              <Text style={styles.buttonText}>Cancel</Text>
            </Pressable>
          </View>
        </View>
      ) : (
        <>
          <View style={styles.menuInfo}>
            <Text style={styles.foodName}>{item.name}</Text>
            <Text style={styles.foodPrice}>Rp. {item.price}</Text>
            <Text style={styles.description}>{item.description}</Text>
          </View>
          <View style={styles.buttonContainer}>
            <Pressable
              onPress={() => handleEdit(item)}
              style={styles.editButton}
            >
              <Text style={styles.buttonText}>Edit</Text>
            </Pressable>
            <Pressable
              onPress={() => handleDelete(item.menu_id)}
              style={styles.deleteButton}
            >
              <Text style={styles.buttonText}>Delete</Text>
            </Pressable>
          </View>
        </>
      )}
    </View>
  );

  const renderMenuItems = (type: "food" | "drink") => (
    <View>
      {menus.filter((menu) => menu.type === type).map(renderMenuItem)}
    </View>
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
    </ScrollView>
  );
};

export default AdminMenu;
