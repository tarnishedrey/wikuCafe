import { View, ScrollView } from "react-native";
import React from "react";
import AdminShowUsers from "../components/ShowUser/ShowUser";
import { SafeAreaView } from "react-native-safe-area-context";
import Greet from "../components/Welcome/Greet";
import AddMenu from "../components/AddMenu/AddMenu";
import Register from "../components/Register/Register";

const Admin = () => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={{ flexGrow: 1, padding: 10 }}>
        <Greet />
        <AddMenu />
        <Register />
        <AdminShowUsers />
      </ScrollView>
    </SafeAreaView>
  );
};

export default Admin;
