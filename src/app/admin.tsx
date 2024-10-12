import { View, ScrollView } from "react-native";
import React, { useEffect } from "react";
import AdminShowUsers from "../components/ShowUser/ShowUser";
import { SafeAreaView } from "react-native-safe-area-context";
import Greet from "../components/Welcome/Greet";
import AddMenu from "../components/AddMenu/AddMenu";
import Register from "../components/Register/Register";
import AdminMenu from "../components/AdminMenu/AdminMenu";
import { useRouter } from "expo-router";
import useAuth from "../hooks/useAuth";
import AdmTable from "../components/AdmTable/AdmTable";

const Admin = () => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={{ flexGrow: 1, padding: 10 }}>
        <Greet />
        <AddMenu />
        <AdminMenu />
        <Register />
        <AdminShowUsers />
        <AdmTable />
      </ScrollView>
    </SafeAreaView>
  );
};

export default Admin;
