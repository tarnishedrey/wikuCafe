import { View, Text, TextInput, Alert, Pressable } from "react-native";
import React, { useState } from "react";
import { useRouter } from "expo-router";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import styles from "./Style";
import { SafeAreaView } from "react-native-safe-area-context";

const API_URL = "https://ukkcafe.smktelkom-mlg.sch.id/api/login?makerID";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = async () => {
    if (!username || !password) {
      Alert.alert("Error", "Please enter both username and password.");
      return;
    }

    try {
      const response = await axios.post(
        API_URL,
        { username, password },
        {
          headers: {
            "Content-Type": "application/json",
            makerID: 47,
          },
        }
      );

      if (response.status === 200) {
        const token = response.data.access_token;
        const user = response.data.user;
        const role = user.role;

        await AsyncStorage.setItem("token", token);
        await AsyncStorage.setItem("username", user.username);
        await AsyncStorage.setItem("userData", JSON.stringify(user));

        Alert.alert("Success", "Login successful!");

        // Redirect based on role
        if (role === "cashier") {
          router.push("/");
        } else if (role === "manager") {
          router.push("/manager");
        } else if (role === "admin") {
          router.push("/admin");
        } else {
          Alert.alert("Error", "Unknown role");
        }
      } else {
        console.log("token failed");
        Alert.alert(
          "Login failed",
          response.data.message || "Invalid credentials."
        );
      }
    } catch (error) {
      Alert.alert("Error", "An error occurred. Please try again later.");
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
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />
      <Pressable style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </Pressable>
    </SafeAreaView>
  );
};

export default Login;
