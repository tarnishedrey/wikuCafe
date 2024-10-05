import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  headerContainer: {
    paddingVertical: 20,
    paddingHorizontal: 16,
    alignItems: "flex-start", // Align all items to the start
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
    backgroundColor: "#f8f9fa",
    width: "100%", // Ensure full width for better layout control
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#212529",
  },
  headerText: {
    fontSize: 20,
    color: "#333",
    marginVertical: 4,
  },
  roleContainer: {
    marginTop: 5,
    alignSelf: "flex-start", // Align role container to the start
    width: "100%", // Ensure full width for role text
  },
  roleText: {
    fontSize: 18,
    color: "#6c757d",
    textAlign: "left", // Ensure text is left aligned
  },
  logoutButton: {
    backgroundColor: "#dc3545",
    paddingVertical: 10,
    paddingHorizontal: 16,

    borderRadius: 5,
  },
  logoutButtonText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 18,
  },
  loginButton: {
    backgroundColor: "#007BFF",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 5,
    marginTop: 12,
    width: "100%",
  },
  loginButtonText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default styles;
