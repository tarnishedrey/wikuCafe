import { View, Text, Alert, Pressable } from "react-native";
import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
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
  const [username, setUsername] = useState("");
  const [userData, setUserData] = useState<UserData | null>(null);
  const router = useRouter();

  useEffect(() => {
    const checkLoginStatus = async () => {
      const token = await AsyncStorage.getItem("token");
      const storedUsername = await AsyncStorage.getItem("username");
      const userDataString = await AsyncStorage.getItem("userData");
      const userData: UserData | null = userDataString
        ? JSON.parse(userDataString)
        : null;

      if (token && storedUsername) {
        setUsername(storedUsername);
        setIsLogged(true);
        if (userData) {
          setUserData(userData);
        }
      } else {
        setIsLogged(false);
      }
    };

    checkLoginStatus();
  }, []);

  const handleLogout = async () => {
    await AsyncStorage.removeItem("token");
    await AsyncStorage.removeItem("username");
    await AsyncStorage.removeItem("userData");
    setIsLogged(false);
    setUsername("");
    setUserData(null);
    Alert.alert("Logged out", "You have been logged out.");
    router.replace("/");
  };

  return (
    <View style={styles.headerContainer}>
      {isLogged ? (
        <>
          <View style={styles.headerRow}>
            <Text style={styles.headerTitle}>
              Hallo <Text style={styles.headerText}>{userData?.user_name}</Text>
            </Text>
            <Pressable style={styles.logoutButton} onPress={handleLogout}>
              <Text style={styles.logoutButtonText}>Logout</Text>
            </Pressable>
          </View>
          {userData && (
            <View style={styles.roleContainer}>
              <Text style={styles.roleText}>Role: {userData.role}</Text>
            </View>
          )}
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
