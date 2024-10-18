import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  headerContainer: {
    paddingVertical: 30,
    paddingHorizontal: 20,

    height: 150,
    overflow: "hidden",
  },

  loggedInContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    height: "100%",
    width: "100%",
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  userInfoContainer: {
    flexDirection: "row",
    alignItems: "center",
  },

  textContainer: {
    justifyContent: "center",
  },
  welcomeText: {
    fontSize: 16,
    color: "#E3E3E3",
    marginBottom: 5,
  },
  usernameText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
    marginBottom: 5,
  },
  roleText: {
    fontSize: 16,
    color: "#E3E3E3",
    fontStyle: "italic",
  },
  logoutButton: {
    padding: 10,
    borderRadius: 50,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
  },
  loggedOutContainer: {
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
  },
  loginPromptText: {
    fontSize: 18,
    color: "white",
    marginBottom: 20,
  },
  loginButton: {
    backgroundColor: "white",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
  },
  loginButtonText: {
    color: "#4c669f",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default styles;
