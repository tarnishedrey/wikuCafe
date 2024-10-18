import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  centeredContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1a237e",
    marginBottom: 24,
    textAlign: "left",
    paddingLeft: 16,
  },
  subtitle: {
    fontSize: 22,
    fontWeight: "600",
    color: "#3f51b5",
    marginBottom: 16,
  },
  orderItem: {
    padding: 16,
    marginVertical: 8,
    backgroundColor: "#ffffff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  paidStatus: {
    color: "#4CAF50",
  },
  pendingStatus: {
    color: "#FFC107",
  },
  orderText: {
    fontSize: 16,
    color: "#424242",
    marginBottom: 4,
  },
  orderDetails: {
    marginTop: 16,
    padding: 16,
    backgroundColor: "#ffffff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  detailText: {
    fontSize: 16,
    color: "#616161",
    marginBottom: 8,
  },
  itemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eeeeee",
  },
  itemTextLeft: {
    fontSize: 16,
    color: "#424242",
    flex: 2,
  },
  itemTextRight: {
    fontSize: 14,
    color: "#757575",
    flex: 1,
    textAlign: "right",
  },
  totalPriceContainer: {
    marginTop: 20,
    padding: 12,
    backgroundColor: "#e8eaf6",
    borderRadius: 8,
  },
  totalPriceText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#3f51b5",
    textAlign: "right",
  },
  errorText: {
    fontSize: 18,
    color: "#d32f2f",
    textAlign: "center",
  },
  statusButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
  },
  statusButton: {
    padding: 12,
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 6,
  },
  paidButton: {
    backgroundColor: "#4caf50",
  },
  pendingButton: {
    backgroundColor: "#ffc107",
  },
  statusButtonText: {
    color: "white",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 16,
  },
  backButton: {
    marginBottom: 16,
    padding: 12,
    backgroundColor: "#e0e0e0",
    borderRadius: 8,
  },
  backButtonText: {
    fontSize: 16,
    color: "#424242",
    textAlign: "center",
  },
  updateButton: {
    backgroundColor: "#2196F3",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 10,
  },
  updateButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  updateButtonPaid: {
    backgroundColor: "#78706c",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 10,
  },
});

export default styles;
