import React from "react";
import { View, Text, FlatList, Alert, TouchableOpacity } from "react-native";
import axios, { AxiosResponse } from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import styles from "./Style";
import { SafeAreaView } from "react-native-safe-area-context";

interface User {
  user_id: number;
  user_name: string;
  role: string;
  username: string;
  created_at: string;
  updated_at: string;
}

const API_URL = "https://ukkcafe.smktelkom-mlg.sch.id/api/user";

const ShowUsers: React.FC = () => {
  const [users, setUsers] = React.useState<User[]>([]);
  const [loading, setLoading] = React.useState(true);
  const router = useRouter();

  const fetchUsers = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        Alert.alert("Error", "No token found. Please log in again.");
        router.push("/login");
        return;
      }

      const response: AxiosResponse = await axios.get(API_URL, {
        headers: {
          Authorization: `Bearer ${token}`,
          makerID: "47",
        },
      });

      if (response.data && Array.isArray(response.data)) {
        setUsers(response.data);
      } else {
        console.error("Unexpected API response format:", response.data);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      Alert.alert(
        "Error",
        "Failed to fetch users. Please check your connection and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchUsers();
  }, []);

  // Function to delete a user with confirmation
  const confirmDeleteUser = (userId: number, userName: string) => {
    Alert.alert(
      "Confirm Delete",
      `Are you sure you want to delete the user "${userName}"?`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => handleDeleteUser(userId),
        },
      ]
    );
  };

  // Delete User API Call
  const handleDeleteUser = async (userId: number) => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        Alert.alert("Error", "No token found. Please log in again.");
        router.push("/login");
        return;
      }

      const response = await axios.delete(`${API_URL}/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          makerID: "47",
        },
      });

      if (response.status === 200) {
        Alert.alert("Success", "User deleted successfully");
        fetchUsers(); // Refresh the user list after deletion
      } else {
        Alert.alert("Error", "Failed to delete user");
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      Alert.alert("Error", "Failed to delete user. Please try again.");
    }
  };

  const handleEditUser = async (user: User) => {
    try {
      // Store the user to be edited in a separate storage key
      await AsyncStorage.setItem("userToEdit", JSON.stringify(user));
      router.push("/editUser");
    } catch (error) {
      console.error("Error preparing user edit:", error);
      Alert.alert("Error", "Failed to prepare user edit");
    }
  };

  const renderItem = ({ item }: { item: User }) => (
    <View style={styles.userCard}>
      <View style={styles.userInfo}>
        <Text style={styles.userName}>{item.user_name}</Text>
        <Text style={styles.userDetail}>Role: {item.role}</Text>
        <Text style={styles.userDetail}>Username: {item.username}</Text>
        <Text style={styles.userDetail}>ID: {item.user_id}</Text>
        <Text style={styles.timestamp}>
          Created: {new Date(item.created_at).toLocaleDateString()}
        </Text>
        <Text style={styles.timestamp}>
          Updated: {new Date(item.updated_at).toLocaleDateString()}
        </Text>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => handleEditUser(item)}
        >
          <Text style={styles.editButtonText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => confirmDeleteUser(item.user_id, item.user_name)}
        >
          <Text style={styles.deleteButtonText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  // Add pull-to-refresh functionality
  const onRefresh = React.useCallback(() => {
    setLoading(true);
    fetchUsers();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>User Management</Text>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <Text>Loading users...</Text>
        </View>
      ) : (
        <FlatList
          data={users}
          keyExtractor={(item) => item.user_id.toString()}
          renderItem={renderItem}
          refreshing={loading}
          onRefresh={onRefresh}
          contentContainerStyle={styles.listContainer}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
        />
      )}
    </SafeAreaView>
  );
};

export default ShowUsers;
