import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  headerContainer: {
    paddingVertical: 20,
    paddingHorizontal: 16,
    alignItems: "center",
    borderBottomWidth: 1,

    flexDirection: "row", // Use flexbox for horizontal layout
    justifyContent: "space-between", // Space between elements
  },
  headerTitle: {
    fontSize: 24,

    fontWeight: "bold",
  },
  headerText: {
    fontSize: 24,
  },
  logoutButton: {
    backgroundColor: "#dc3545", // Red color for the logout button
    padding: 8,
    borderRadius: 5,
  },
  logoutButtonText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  loginButton: {
    backgroundColor: "#007BFF", // Blue color for the login button
    padding: 12,
    borderRadius: 5,
    marginTop: 12,
  },
  loginButtonText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default styles;
