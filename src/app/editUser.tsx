// screens/EditUserScreen.tsx
import React from "react";
import { View, SafeAreaView, StyleSheet } from "react-native";
import EditUser from "../components/EditUser/EditUser";

const EditUserScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <EditUser />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  content: {
    flex: 1,
  },
});

export default EditUserScreen;
