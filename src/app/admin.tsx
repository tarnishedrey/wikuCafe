import React, { useState } from "react";
import { View, ScrollView, StyleSheet, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import Greet from "../components/Welcome/Greet";
import AddMenu from "../components/AddMenu/AddMenu";
import Register from "../components/Register/Register";
import AdminMenu from "../components/AdminMenu/AdminMenu";
import AdminShowUsers from "../components/ShowUser/ShowUser";
import AdmTable from "../components/AdmTable/AdmTable";

type SectionName = "menuManagement" | "userManagement" | "tableManagement";

const Admin: React.FC = () => {
  const [activeSection, setActiveSection] =
    useState<SectionName>("menuManagement");

  const renderSectionContent = () => {
    switch (activeSection) {
      case "menuManagement":
        return (
          <>
            <AddMenu />
            <AdminMenu />
          </>
        );
      case "userManagement":
        return (
          <>
            <Register />
            <AdminShowUsers />
          </>
        );
      case "tableManagement":
        return <AdmTable />;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Greet />
      <View style={styles.navbar}>
        <Pressable
          style={[
            styles.navbarButton,
            activeSection === "menuManagement" && styles.activeButton,
          ]}
          onPress={() => setActiveSection("menuManagement")}
        >
          <Feather
            name="menu"
            size={24}
            color={activeSection === "menuManagement" ? "#ffffff" : "#a0a0a0"}
          />
        </Pressable>
        <Pressable
          style={[
            styles.navbarButton,
            activeSection === "userManagement" && styles.activeButton,
          ]}
          onPress={() => setActiveSection("userManagement")}
        >
          <Feather
            name="users"
            size={24}
            color={activeSection === "userManagement" ? "#ffffff" : "#a0a0a0"}
          />
        </Pressable>
        <Pressable
          style={[
            styles.navbarButton,
            activeSection === "tableManagement" && styles.activeButton,
          ]}
          onPress={() => setActiveSection("tableManagement")}
        >
          <Feather
            name="grid"
            size={24}
            color={activeSection === "tableManagement" ? "#ffffff" : "#a0a0a0"}
          />
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {renderSectionContent()}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  navbar: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#2d3436",
    paddingVertical: 12,
  },
  navbarButton: {
    padding: 10,
  },
  activeButton: {
    borderBottomWidth: 2,
    borderBottomColor: "white",
  },
  scrollContent: {
    flexGrow: 1,
    padding: 16,
  },
});

export default Admin;
