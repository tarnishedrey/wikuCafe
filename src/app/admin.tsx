import { View, Text, Button, TouchableOpacity, ScrollView } from "react-native";
import React, { useState } from "react";

import AdminShowUsers from "../components/ShowUser/ShowUser";
import { SafeAreaView } from "react-native-safe-area-context";
import Greet from "../components/Welcome/Greet";
import AddMenu from "../components/AddMenu/AddMenu";
import Register from "../components/Register/Register";

const Admin = () => {
  return (
    <SafeAreaView>
      <Greet />
      <ScrollView>
        <AddMenu />
        <Register />
        <AdminShowUsers />
      </ScrollView>
    </SafeAreaView>
  );
};

export default Admin;
