import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  header: {
    fontSize: 24,
    paddingVertical: 12,
    fontWeight: "bold",
    color: "#333",
  },
  foodContainer: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 10,
    margin: 5,
    width: "47%",
  },
  foodName: {
    fontSize: 16,
    color: "#333",
    textAlign: "left",
    marginTop: 5,
  },
  foodPrice: {
    fontSize: 16,
    color: "#333",
    textAlign: "left",
    marginTop: 5,
    fontWeight: "bold",
  },
  image: {
    height: 150,
    width: "100%",
    alignSelf: "center",
    borderRadius: 5,
  },
  row: {
    justifyContent: "space-between",
    marginTop: 10,
  },
  totalContainer: {
    position: "absolute",
    bottom: 10,
    left: 10,
    right: 10,
    padding: 16,
    backgroundColor: "#fff",
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "#ddd",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 6,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cartTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  cartInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  cartTotal: {
    fontSize: 16,
    fontWeight: "600",
    color: "#ff5733",
  },
  cartItems: {
    fontSize: 14,
    color: "#666",
    marginRight: 150,
    marginTop: 2,
  },
});

export default styles;
