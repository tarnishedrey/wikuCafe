import React, { useState } from "react";
import { View, Text, ScrollView, StyleSheet, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Greet from "../components/Welcome/Greet";
import AddMenu from "../components/AddMenu/AddMenu";
import Register from "../components/Register/Register";
import AdminMenu from "../components/AdminMenu/AdminMenu";
import AdminShowUsers from "../components/ShowUser/ShowUser";
import AdmTable from "../components/AdmTable/AdmTable";

interface DropdownProps {
  title: string;
  children: React.ReactNode;
  isOpen: boolean;
  onToggle: () => void;
}

const Dropdown: React.FC<DropdownProps> = ({
  title,
  children,
  isOpen,
  onToggle,
}) => (
  <View style={styles.dropdown}>
    <Pressable style={styles.dropdownHeader} onPress={onToggle}>
      <Text style={styles.dropdownTitle}>{title}</Text>
      <Text style={styles.dropdownIcon}>{isOpen ? "▲" : "▼"}</Text>
    </Pressable>
    {isOpen && <View style={styles.dropdownContent}>{children}</View>}
  </View>
);

type SectionName = "menuManagement" | "userManagement" | "tableManagement";

interface OpenSections {
  menuManagement: boolean;
  userManagement: boolean;
  tableManagement: boolean;
}

const Admin: React.FC = () => {
  const [openSections, setOpenSections] = useState<OpenSections>({
    menuManagement: false,
    userManagement: false,
    tableManagement: false,
  });

  const toggleSection = (section: SectionName) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  return (
    <SafeAreaView style={styles.container}>
      <Greet />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Dropdown
          title="Menu Management"
          isOpen={openSections.menuManagement}
          onToggle={() => toggleSection("menuManagement")}
        >
          <AddMenu />
          <AdminMenu />
        </Dropdown>

        <Dropdown
          title="User Management"
          isOpen={openSections.userManagement}
          onToggle={() => toggleSection("userManagement")}
        >
          <Register />
          <AdminShowUsers />
        </Dropdown>

        <Dropdown
          title="Table Management"
          isOpen={openSections.tableManagement}
          onToggle={() => toggleSection("tableManagement")}
        >
          <AdmTable />
        </Dropdown>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  scrollContent: {
    flexGrow: 1,
    padding: 16,
  },
  dropdown: {
    backgroundColor: "white",
    borderRadius: 8,
    marginBottom: 16,
    overflow: "hidden",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  dropdownHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#3498db",
  },
  dropdownTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
  },
  dropdownIcon: {
    fontSize: 18,
    color: "white",
  },
  dropdownContent: {
    padding: 16,
  },
});

export default Admin;
