import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  Pressable,
  TextInput,
  StyleSheet,
  Alert,
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
            makerID: "47",
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
            makerID: "47",
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
            makerID: "47",
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
      <Text>Table ID: {item.table_id}</Text>
      <Text>Table Number: {item.table_number}</Text>
      <Text>Available: {item.is_available}</Text>
      <Text>Maker ID: {item.maker_id}</Text>
      <Text>Created at: {new Date(item.created_at).toLocaleString()}</Text>
      <Text>Updated at: {new Date(item.updated_at).toLocaleString()}</Text>
      <Pressable style={styles.editButton} onPress={() => handleEdit(item)}>
        <Text>Edit</Text>
      </Pressable>
    </View>
  );

  const renderEditForm = () => {
    if (!editingTable) return null;

    return (
      <View style={styles.editForm}>
        <TextInput
          style={styles.input}
          value={editingTable.table_number}
          onChangeText={(text) =>
            setEditingTable({ ...editingTable, table_number: text })
          }
          placeholder="Table Number"
        />
        <Pressable
          style={styles.button}
          onPress={() =>
            setEditingTable({
              ...editingTable,
              is_available:
                editingTable.is_available === "true" ? "false" : "true",
            })
          }
        >
          <Text>
            {editingTable.is_available === "true"
              ? "Set Unavailable"
              : "Set Available"}
          </Text>
        </Pressable>
        <Pressable style={styles.button} onPress={handleSave}>
          <Text>Save</Text>
        </Pressable>
        <Pressable style={styles.button} onPress={() => setEditingTable(null)}>
          <Text>Cancel</Text>
        </Pressable>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Table Management</Text>
      <TextInput
        style={styles.input}
        value={newTableNumber}
        onChangeText={setNewTableNumber}
        placeholder="Enter new table number"
      />
      <Pressable style={styles.button} onPress={handleAddTable}>
        <Text>Add Table</Text>
      </Pressable>
      {editingTable ? (
        renderEditForm()
      ) : (
        <FlatList
          data={tables}
          renderItem={renderTableItem}
          keyExtractor={(item) => item.table_id.toString()}
        />
      )}
      {loading && <Text>Loading...</Text>}
      {error && <Text style={styles.errorText}>Error: {error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  tableItem: {
    backgroundColor: "#f0f0f0",
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  editButton: {
    backgroundColor: "#4CAF50",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 10,
  },
  editForm: {
    backgroundColor: "#f0f0f0",
    padding: 20,
    borderRadius: 5,
  },
  input: {
    backgroundColor: "white",
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  button: {
    backgroundColor: "#2196F3",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 10,
  },
  errorText: {
    color: "red",
    marginTop: 10,
  },
});

export default AdmTable;
