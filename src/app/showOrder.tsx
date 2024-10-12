import { View, Text, ScrollView } from "react-native";
import React from "react";
import CaShowOrder from "../components/CashierShowOrder/CaShowOrder";

const showOrder = () => {
  return (
    <ScrollView>
      <CaShowOrder />
    </ScrollView>
  );
};

export default showOrder;
