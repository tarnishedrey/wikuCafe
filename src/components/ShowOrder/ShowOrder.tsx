import { View, Text, Pressable } from "react-native";
import React from "react";
import { useRouter } from "expo-router";
import styles from "./Style";

const ShowOrder = () => {
  const router = useRouter();
  return (
    <View style={styles.buttonContainer}>
      <Pressable
        style={({ pressed }) => [
          styles.button,
          { opacity: pressed ? 0.8 : 1 }, // Add visual feedback on press
        ]}
        onPress={() => {
          router.push("/showOrder");
        }}
      >
        <Text style={styles.buttonText}>Show Order</Text>
      </Pressable>
    </View>
  );
};

export default ShowOrder;
