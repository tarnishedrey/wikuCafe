import { StyleSheet, Dimensions } from "react-native";

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#f0f0f0", // Lighter background for cleaner look
    flex: 1,
  },
  header: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
    textAlign: "center", // Center the header for better emphasis
  },
  cartItem: {
    padding: 15,
    marginBottom: 15,
    backgroundColor: "#fff", // White background for the cart items
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1, // Reduced shadow for a more subtle effect
    shadowRadius: 6,
    elevation: 3,
  },
  cartItemHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  itemName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  itemDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  itemPrice: {
    fontSize: 16,
    color: "#888",
  },
  itemQuantity: {
    fontSize: 16,
    color: "#888",
  },
  priceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 5,
  },
  priceLabel: {
    fontSize: 16,
    color: "#888",
  },
  itemTotal: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  totalContainer: {
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: "#ccc",
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  totalText: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center", // Center total price for emphasis
  },
  emptyCart: {
    textAlign: "center",
    fontSize: 18,
    color: "#666",
    marginTop: 30,
  },
});

export default styles;
