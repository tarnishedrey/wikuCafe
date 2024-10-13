import React, { useEffect } from "react";
import { Slot, useRouter } from "expo-router";
import { SafeAreaView, StatusBar } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Layout = () => {
  const router = useRouter();

  useEffect(() => {
    const checkAuthAndRedirect = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        const role = await AsyncStorage.getItem("role");

        if (token && role) {
          // User is authenticated, redirect based on role
          switch (role) {
            case "cashier":
              router.replace("/");
              break;
            case "manager":
              router.replace("/manager");
              break;
            case "admin":
              router.replace("/admin");
              break;
            default:
              console.error("Unknown role:", role);
              // Optionally, you could log out the user here if the role is unknown
              // await AsyncStorage.multiRemove(["token", "role"]);
              router.replace("/login");
          }
        } else {
          // User is not authenticated, redirect to login
          router.replace("/login");
        }
      } catch (error) {
        console.error("Error checking auth status:", error);
        // If there's an error, redirect to login as a fallback
        router.replace("/login");
      }
    };

    checkAuthAndRedirect();
  }, []);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar barStyle="dark-content" />
      <Slot />
    </SafeAreaView>
  );
};

export default Layout;
