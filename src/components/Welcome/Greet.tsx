import React, { useEffect, useState } from "react";
import { View, Text, Alert, Pressable, Image } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { Feather } from "@expo/vector-icons";
import styles from "./Style";

interface UserData {
  user_id: number;
  user_name: string;
  role: string;
  maker_id: number;
  created_at: string;
  updated_at: string;
}

const Greet = () => {
  const [isLogged, setIsLogged] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(null);
  const router = useRouter();

  useEffect(() => {
    const checkLoginStatus = async () => {
      const token = await AsyncStorage.getItem("token");
      const userDataString = await AsyncStorage.getItem("userData");
      const userData: UserData | null = userDataString
        ? JSON.parse(userDataString)
        : null;

      if (token && userData) {
        setIsLogged(true);
        setUserData(userData);
      } else {
        setIsLogged(false);
      }
    };

    checkLoginStatus();
  }, []);

  const handleLogout = async () => {
    await AsyncStorage.multiRemove(["token", "username", "userData"]);
    setIsLogged(false);
    setUserData(null);
    Alert.alert("Logged out", "You have been logged out.");
    router.replace("/");
  };

  return (
    <LinearGradient
      colors={["#000000", "#2d3436"]}
      style={styles.headerContainer}
    >
      {isLogged ? (
        <View style={styles.loggedInContainer}>
          <View style={styles.userInfoContainer}>
            <View style={styles.textContainer}>
              <Text style={styles.welcomeText}>Welcome back,</Text>
              <Text style={styles.usernameText}>{userData?.user_name}</Text>
              <Text style={styles.roleText}>{userData?.role}</Text>
            </View>
          </View>

          <Pressable style={styles.logoutButton} onPress={handleLogout}>
            <Feather name="log-out" size={24} color="white" />
          </Pressable>
        </View>
      ) : (
        <View style={styles.loggedOutContainer}>
          <Text style={styles.loginPromptText}>Please log in to continue</Text>
          <Pressable
            style={styles.loginButton}
            onPress={() => router.push("/login")}
          >
            <Text style={styles.loginButtonText}>Login</Text>
          </Pressable>
        </View>
      )}
    </LinearGradient>
  );
};

export default Greet;
