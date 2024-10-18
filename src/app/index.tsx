import React, { useState } from "react";
import { View, ScrollView, StyleSheet, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import Greet from "../components/Welcome/Greet";
import Menu from "../components/Menu/Menu";
import CaShowOrder from "../components/CashierShowOrder/CaShowOrder";

type SectionName = "menu" | "order";

const Index: React.FC = () => {
  const [activeSection, setActiveSection] = useState<SectionName>("menu");

  const renderSectionContent = () => {
    switch (activeSection) {
      case "menu":
        return <Menu />;
      case "order":
        return <CaShowOrder />;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Greet />
      <View style={styles.navbar}>
        <Pressable
          style={[
            styles.navbarButton,
            activeSection === "menu" && styles.activeButton,
          ]}
          onPress={() => setActiveSection("menu")}
        >
          <Feather
            name="menu"
            size={24}
            color={activeSection === "menu" ? "#ffffff" : "#a0a0a0"}
          />
        </Pressable>
        <Pressable
          style={[
            styles.navbarButton,
            activeSection === "order" && styles.activeButton,
          ]}
          onPress={() => setActiveSection("order")}
        >
          <Feather
            name="clipboard"
            size={24}
            color={activeSection === "order" ? "#ffffff" : "#a0a0a0"}
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

export default Index;
