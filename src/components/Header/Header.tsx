import React from "react";
import { useRouter } from "expo-router"; // Correct import
import { View, Text, Pressable } from "react-native";
import styles from "./Style";

const Header = () => {
  const router = useRouter(); // Use router from useRouter hook

  return (
    <View style={styles.headerContainer}>
      <Pressable onPress={() => router.back()}>
        {" "}
        {/* This should now work */}
        <Text style={styles.headerText}>Back to menu</Text>
      </Pressable>
    </View>
  );
};

export default Header;
