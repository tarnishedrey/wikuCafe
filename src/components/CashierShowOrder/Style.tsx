import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#f7f7f7",
  },
  centeredContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#555",
    marginBottom: 10,
  },
  orderItem: {
    padding: 15,
    marginVertical: 8,
    backgroundColor: "#ffffff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  orderText: {
    fontSize: 16,
    color: "#333",
  },
  orderDetails: {
    marginTop: 20,
    padding: 15,
    backgroundColor: "#ffffff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  detailText: {
    fontSize: 16,
    color: "#444",
    marginBottom: 5,
  },
  // Adjusted for price below the name
  itemRow: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  // Menu name takes up more space and is followed by price and subtotal below
  itemTextLeft: {
    fontSize: 16,
    color: "#444",
    marginBottom: 5,
  },
  itemTextRight: {
    fontSize: 14,
    color: "#666",
  },
  totalPriceContainer: {
    marginTop: 20,
    padding: 10,
    backgroundColor: "#e6f7ff",
    borderRadius: 5,
  },
  totalPriceText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#007acc",
  },
  errorText: {
    fontSize: 18,
    color: "red",
  },
});

export default styles;
