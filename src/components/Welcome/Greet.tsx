import { View, Text, Button, Alert, Pressable, Image } from "react-native";
import React from "react";
import styles from "./Style";

const Greet = () => {
  const handleClick = () => {
    alert("berisik lu monye");
  };

  const cashierName = "Rey";

  return (
    <View>
      <Text style={styles.halloStyle}>
        Hallo <Text style={styles.cashierName}>{cashierName}</Text>
      </Text>
    </View>
  );
};

export default Greet;
