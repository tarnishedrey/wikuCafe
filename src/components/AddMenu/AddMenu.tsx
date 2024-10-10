import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Alert,
  Image,
  StyleSheet,
  Pressable,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

type FileData = {
  uri: string;
  name: string;
  mimeType: string | null;
};

const AddMenu = () => {
  const [menuName, setMenuName] = useState("");
  const [menuType, setMenuType] = useState("");
  const [menuDescription, setMenuDescription] = useState("");
  const [price, setPrice] = useState("");
  const [file, setFile] = useState<FileData | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const pickImage = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      Alert.alert("Permission to access camera roll is required!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setFile({
        uri: result.assets[0].uri,
        name: result.assets[0].fileName || "image.jpg",
        mimeType: result.assets[0].mimeType || "image/jpeg", // Use mimeType instead of type
      });
    }
  };

  const handleSubmit = async () => {
    if (!menuName || !menuType || !menuDescription || !price || !file) {
      Alert.alert("Error", "Please fill out all fields and select an image.");
      return;
    }

    setIsLoading(true);

    try {
      const token = await AsyncStorage.getItem("token");
      console.log("Token:", token);

      if (!token) {
        Alert.alert("Error", "Token not found. Please log in.");
        return;
      }

      const formData = new FormData();
      formData.append("menu_name", menuName);
      formData.append("type", menuType);
      formData.append("menu_description", menuDescription);
      formData.append("price", price);
      // Append file with proper structure for React Native and explicit content-type
      formData.append("menu_image_name", {
        uri: file.uri,
        type: file.mimeType || "image/jpeg", // Provide a default if mimeType is null
        name: file.name,
      } as any);

      console.log("FormData contents:");
      console.log("menu_name:", menuName);
      console.log("type:", menuType);
      console.log("menu_description:", menuDescription);
      console.log("price:", price);
      console.log("menu_image_name:", {
        uri: file.uri,
        type: file.mimeType,
        name: file.name,
      });
      console.log(token);

      console.log("Request Headers:", {
        Accept: "application/json",
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
        makerID: "47",
      });
      console.log("FormData:", formData);

      formData.append("menu_image_name", {
        uri: file.uri,
        type: file.mimeType,
        name: file.name,
      } as any);

      const API_URL = "https://ukkcafe.smktelkom-mlg.sch.id/api/menu";
      console.log("Making request to:", API_URL);

      const response = await axios.post(API_URL, formData, {
        headers: {
          Accept: "application/json",
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
          makerID: "47",
        },
        timeout: 10000,
      });

      console.log("Response:", response.data); // Debug log
      Alert.alert("Success", "Menu item added successfully!");

      setMenuName("");
      setMenuType("");
      setMenuDescription("");
      setPrice("");
      setFile(null);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Full error object:", error); // Debug log
        console.error("Error config:", error.config); // Debug log

        if (error.response) {
          // The server responded with a status code outside of 2xx
          console.error("Response data:", error.response.data);
          console.error("Response status:", error.response.status);
          Alert.alert(
            "Server Error",
            `Error: ${error.response.data.message || error.response.statusText}`
          );
        } else if (error.request) {
          // The request was made but no response was received
          console.error("No response received:", error.request);
          if (error.code === "ECONNABORTED") {
            Alert.alert("Error", "Request timed out. Please try again.");
          } else {
            Alert.alert(
              "Connection Error",
              "Could not connect to the server. Please check your internet connection and try again."
            );
          }
        } else {
          // Something happened in setting up the request
          console.error("Error setting up request:", error.message);
          Alert.alert("Error", `Request setup failed: ${error.message}`);
        }
      } else {
        console.error("Non-Axios error:", error);
        Alert.alert("Error", "An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add a New Menu Item</Text>
      <TextInput
        placeholder="Menu Name"
        value={menuName}
        onChangeText={setMenuName}
        style={styles.input}
      />
      <TextInput
        placeholder="Menu Type"
        value={menuType}
        onChangeText={setMenuType}
        style={styles.input}
      />
      <TextInput
        placeholder="Menu Description"
        value={menuDescription}
        onChangeText={setMenuDescription}
        style={styles.input}
      />
      <TextInput
        placeholder="Price"
        value={price}
        onChangeText={setPrice}
        keyboardType="numeric"
        style={styles.input}
      />
      <Pressable
        style={[styles.button, isLoading && styles.buttonDisabled]}
        onPress={pickImage}
        disabled={isLoading}
      >
        <Text style={styles.buttonText}>Pick an Image</Text>
      </Pressable>
      {file && <Image source={{ uri: file.uri }} style={styles.image} />}
      <Pressable
        style={[styles.button, isLoading && styles.buttonDisabled]}
        onPress={handleSubmit}
        disabled={isLoading}
      >
        <Text style={styles.buttonText}>
          {isLoading ? "Submitting..." : "Submit"}
        </Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  button: {
    backgroundColor: "#2196F3",
    padding: 10,
    alignItems: "center",
    marginVertical: 10,
  },
  buttonDisabled: {
    backgroundColor: "#cccccc",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
  image: {
    width: 100,
    height: 100,
    marginVertical: 10,
  },
});

export default AddMenu;
