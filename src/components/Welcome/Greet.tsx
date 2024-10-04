import { View, Text, Alert, Pressable } from "react-native";
import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import styles from "./Style";

const Greet = () => {
  const [isLogged, setIsLogged] = useState(false);
  const [username, setUsername] = useState("");
  const router = useRouter();

  // Check login state when component is mounted
  useEffect(() => {
    const checkLoginStatus = async () => {
      const token = await AsyncStorage.getItem("token");
      const storedUsername = await AsyncStorage.getItem("username");

      if (token && storedUsername) {
        setUsername(storedUsername);
        setIsLogged(true);
      } else {
        setIsLogged(false);
      }
    };

    checkLoginStatus();
  }, []);

  // Logout function
  const handleLogout = async () => {
    await AsyncStorage.removeItem("token");
    await AsyncStorage.removeItem("username");
    setIsLogged(false); // Update state to reflect logout
    setUsername(""); // Clear username
    Alert.alert("Logged out", "You have been logged out.");

    // Automatically refresh the page after logout
    router.replace("/"); // Navigate to the same page to force a refresh
  };

  return (
    <View style={styles.headerContainer}>
      {isLogged ? (
        <>
          <Text style={styles.headerTitle}>
            Hallo <Text style={styles.headerText}>{username}</Text>
          </Text>
          <Pressable style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutButtonText}>Logout</Text>
          </Pressable>
        </>
      ) : (
        <Pressable
          style={styles.loginButton}
          onPress={() => {
            router.push("/login");
          }}
        >
          <Text style={styles.loginButtonText}>Login</Text>
        </Pressable>
      )}
    </View>
  );
};

export default Greet;
