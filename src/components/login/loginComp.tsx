import { View, Text, TextInput, Alert, Pressable } from "react-native";
import React, { useState } from "react";
import { useRouter } from "expo-router";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import styles from "./Style";
import { SafeAreaView } from "react-native-safe-area-context";

const API_URL = "https://ukkcafe.smktelkom-mlg.sch.id/api/login";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async () => {
    if (!username || !password) {
      Alert.alert("Error", "Please enter both username and password.");
      return;
    }

    setLoading(true);
    try {
      console.log("Attempting login with:", { username });

      const loginData = {
        username,
        password,
      };

      console.log("Making API request to:", API_URL);

      const response = await axios.post(API_URL, loginData, {
        headers: {
          "Content-Type": "application/json",
          makerID: "47",
        },
      });

      console.log("Response status:", response.status);
      console.log("Response data:", JSON.stringify(response.data, null, 2));

      if (response.data.access_token) {
        const token = response.data.access_token;
        const user = response.data.user;
        const user_id = user.user_id;
        const role = user.role;

        console.log(
          "Storing auth data - Token:",
          token ? "exists" : "missing",
          "UserId:",
          user_id,
          role
        );

        await Promise.all([
          AsyncStorage.setItem("role", role),
          AsyncStorage.setItem("token", token),
          AsyncStorage.setItem("user_id", JSON.stringify(user_id)),
          AsyncStorage.setItem("username", user.username),
          AsyncStorage.setItem("cashiername", user.user_name),
          AsyncStorage.setItem("userData", JSON.stringify(user)),
        ]);

        // Verify storage
        const storedToken = await AsyncStorage.getItem("token");
        const storedUserId = await AsyncStorage.getItem("user_id");
        const storedRole = await AsyncStorage.getItem("role");
        console.log(
          "Verified stored data - Token:",
          storedToken ? "exists" : "missing",
          "UserId:",
          storedUserId,
          "role:",
          storedRole
        );

        Alert.alert("Success", "Login successful!");

        if (role === "cashier") {
          router.push("/");
        } else if (role === "manager") {
          router.push("/manager");
        } else if (role === "admin") {
          router.push("/admin");
        } else {
          Alert.alert("Error", `Unknown role: ${role}`);
        }
      } else {
        throw new Error("No access token in response");
      }
    } catch (error) {
      console.error("Login error:", error);

      if (axios.isAxiosError(error)) {
        console.error("API Error Details:");
        console.error("Status:", error.response?.status);
        console.error("Data:", JSON.stringify(error.response?.data, null, 2));

        const errorMessage =
          error.response?.data?.message ||
          error.message ||
          "Invalid credentials";

        Alert.alert("Login Failed", errorMessage);
      } else {
        Alert.alert(
          "Error",
          "An unexpected error occurred. Please try again later."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <TextInput
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
        style={styles.input}
        autoCapitalize="none"
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />
      <Pressable
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={handleLogin}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? "Logging in..." : "Login"}
        </Text>
      </Pressable>
    </SafeAreaView>
  );
};

export default Login;
