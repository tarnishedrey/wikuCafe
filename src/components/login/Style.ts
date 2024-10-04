import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#f5f5f5", // Light background color
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#333", // Darker text color
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc", // Light border color
    borderRadius: 5,
    marginBottom: 15,
    padding: 10,
    backgroundColor: "white", // White background for input fields
    fontSize: 16,
  },
  button: {
    backgroundColor: "#007BFF", // Blue background for the login button
    paddingVertical: 12,
    borderRadius: 5,
    alignItems: "center", // Center text in button
  },
  buttonText: {
    color: "white", // White text for button
    fontWeight: "bold",
    fontSize: 16,
  },
  errorText: {
    color: "red", // Red color for error messages
    marginBottom: 10,
    textAlign: "center",
  },
});

export default styles;
