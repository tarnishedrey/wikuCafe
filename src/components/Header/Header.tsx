import React, { useState } from "react";
import { Link, router } from "expo-router";
import {
  View,
  Text,
  FlatList,
  Image,
  Button,
  Pressable,
  ScrollView,
} from "react-native";
import styles from "./Style";

const Header = () => {
  return (
    <View style={styles.headerContainer}>
      <Pressable onPress={() => router.back()}>
        <Text style={styles.headerText}>Back to menu</Text>
      </Pressable>
    </View>
  );
};

export default Header;
