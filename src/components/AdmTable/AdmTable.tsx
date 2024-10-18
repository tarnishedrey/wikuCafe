import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  Pressable,
  TextInput,
  StyleSheet,
  Alert,
  ActivityIndicator,
  SafeAreaView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

interface Table {
  table_id: number;
  table_number: string;
  is_available: string;
  maker_id: number;
  created_at: string;
  updated_at: string;
}

const AdmTable = () => {
  const [tables, setTables] = useState<Table[]>([]);
  const [editingTable, setEditingTable] = useState<Table | null>(null);
  const [newTableNumber, setNewTableNumber] = useState<string>(""); // State for the new table
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTables();
  }, []);

  const fetchTables = async () => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem("token");
      const response = await axios.get(
        "https://ukkcafe.smktelkom-mlg.sch.id/api/table",
        {
          headers: {
            Authorization: `Bearer ${token}`,
            makerID: "62",
          },
        }
      );
      setTables(response.data);
    } catch (err) {
      setError("Failed to fetch tables");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (table: Table) => {
    setEditingTable(table);
  };

  const handleSave = async () => {
    if (!editingTable) return;

    setLoading(true);
    try {
      const token = await AsyncStorage.getItem("token");
      await axios.put(
        `https://ukkcafe.smktelkom-mlg.sch.id/api/table/${editingTable.table_id}`,
        {
          table_number: editingTable.table_number,
          is_available: editingTable.is_available,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            makerID: "62",
          },
        }
      );
      setEditingTable(null);
      fetchTables(); // Refresh the table list
      Alert.alert("Success", "Table updated successfully");
    } catch (err) {
      setError("Failed to update table");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddTable = async () => {
    if (!newTableNumber) {
      Alert.alert("Error", "Please enter a table number");
      return;
    }

    setLoading(true);
    try {
      const token = await AsyncStorage.getItem("token");
      await axios.post(
        "https://ukkcafe.smktelkom-mlg.sch.id/api/table",
        {
          table_number: newTableNumber,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            makerID: "62",
            "Content-Type": "application/json",
          },
        }
      );
      setNewTableNumber(""); // Clear the input field
      fetchTables(); // Refresh the table list
      Alert.alert("Success", "Table added successfully");
    } catch (err) {
      setError("Failed to add table");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const renderTableItem = ({ item }: { item: Table }) => (
    <View style={styles.tableItem}>
      <View style={styles.tableInfo}>
        <Text style={styles.tableNumber}>Table {item.table_number}</Text>
        <Text style={styles.tableStatus}>
          Status: {item.is_available === "true" ? "Available" : "Occupied"}
        </Text>
      </View>
      <Pressable style={styles.editButton} onPress={() => handleEdit(item)}>
        <Text style={styles.editButtonText}>Edit</Text>
      </Pressable>
    </View>
  );

  const renderEditForm = () => {
    if (!editingTable) return null;

    return (
      <View style={styles.editForm}>
        <Text style={styles.editFormTitle}>Edit Table</Text>
        <TextInput
          style={styles.input}
          value={editingTable.table_number}
          onChangeText={(text) =>
            setEditingTable({ ...editingTable, table_number: text })
          }
          placeholder="Table Number"
        />

        <View style={styles.editFormButtons}>
          <Pressable
            style={[styles.button, styles.saveButton]}
            onPress={handleSave}
          >
            <Text style={styles.buttonText}>Save</Text>
          </Pressable>
          <Pressable
            style={[styles.button, styles.cancelButton]}
            onPress={() => setEditingTable(null)}
          >
            <Text style={styles.buttonText}>Cancel</Text>
          </Pressable>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Table Management</Text>
      <View style={styles.addTableContainer}>
        <TextInput
          style={styles.input}
          value={newTableNumber}
          onChangeText={setNewTableNumber}
          placeholder="Enter new table number"
        />
        <Pressable
          style={[styles.button, styles.addButton]}
          onPress={handleAddTable}
        >
          <Text style={styles.buttonText}>Add Table</Text>
        </Pressable>
      </View>
      {editingTable ? (
        renderEditForm()
      ) : (
        <FlatList
          data={tables}
          renderItem={renderTableItem}
          keyExtractor={(item) => item.table_id.toString()}
          contentContainerStyle={styles.listContainer}
        />
      )}
      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      )}
      {error && <Text style={styles.errorText}>Error: {error}</Text>}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
  },
  addTableContainer: {
    flexDirection: "row",
    marginBottom: 20,
  },
  input: {
    flex: 1,
    backgroundColor: "white",
    padding: 12,
    borderRadius: 8,
    marginRight: 10,
    fontSize: 16,
  },
  listContainer: {
    paddingBottom: 20,
  },
  tableItem: {
    backgroundColor: "white",
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  tableInfo: {
    flex: 1,
  },
  tableNumber: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  tableStatus: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  editButton: {
    backgroundColor: "#4CAF50",
    padding: 10,
    borderRadius: 6,
  },
  editButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  editForm: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 8,
    marginBottom: 20,
  },
  editFormTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#333",
  },
  editFormButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  button: {
    padding: 12,
    borderRadius: 6,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  addButton: {
    backgroundColor: "#2196F3",
    minWidth: 100,
  },
  saveButton: {
    backgroundColor: "#4CAF50",
    flex: 1,
    marginRight: 5,
  },
  cancelButton: {
    backgroundColor: "#f44336",
    flex: 1,
    marginLeft: 5,
  },
  toggleButton: {
    backgroundColor: "#FF9800",
  },
  loadingContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.7)",
  },
  errorText: {
    color: "#f44336",
    marginTop: 10,
    fontSize: 16,
    textAlign: "center",
  },
});

export default AdmTable;
