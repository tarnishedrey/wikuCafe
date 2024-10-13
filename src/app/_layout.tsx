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
          // udah login nih terus di cek rolenya yekan
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
              console.error("lu siapa hayo");
              router.replace("/login");
          }
        } else {
          router.replace("/login");
        }
      } catch (error) {
        console.error("Error checking auth status:", error);
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
