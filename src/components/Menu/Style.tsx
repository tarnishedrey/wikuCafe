import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1, // This makes sure the cart summary stays at the bottom
  },
  menuContainer: {
    padding: 16,
    backgroundColor: "#f5f5f5",
  },
  header: {
    fontSize: 22,
    paddingVertical: 10,
    fontWeight: "bold",
    color: "#333",
    textAlign: "left",
    marginBottom: 10,
  },
  foodContainer: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 12,
    margin: 8,
    width: "47%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  foodName: {
    fontSize: 16,
    color: "#333",
    textAlign: "left",
    marginTop: 10,
    fontWeight: "500",
  },
  foodPrice: {
    fontSize: 16,
    color: "#333",
    fontWeight: "bold",
    textAlign: "left",
    marginTop: 5,
  },
  image: {
    height: 120,
    width: "100%",
    alignSelf: "center",
    borderRadius: 6,
  },
  row: {
    justifyContent: "space-between",
    marginTop: 15,
  },
  cartContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 10,
    backgroundColor: "#fff",
    elevation: 6,
  },
  totalContainer: {
    padding: 16,
    backgroundColor: "#fff",
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "#ddd",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
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
    marginRight: 20,
    marginTop: 2,
  },
  errorMessage: {
    color: "red",
    textAlign: "center",
    marginVertical: 10,
  },
  container: {
    padding: 12,
    backgroundColor: "#f8f8f8",
  },

  quantityBadge: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "#FF4B4B",
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  quantityText: {
    color: "white",
    fontSize: 14,
    fontWeight: "bold",
  },
  description: {
    fontSize: 12,
    color: "#666",
    marginTop: 4,
  },
  addToCartButton: {
    backgroundColor: "#4CAF50",
    padding: 10,
    borderRadius: 5,
    marginTop: 5,
  },
  addToCartButtonText: {
    color: "white",
    textAlign: "center",
  },
});

export default styles;
