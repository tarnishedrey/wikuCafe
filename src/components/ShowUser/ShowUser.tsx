// components/ShowUser/ShowUser.tsx
import React from "react";
import { View, Text, FlatList, Alert, TouchableOpacity } from "react-native";
import axios, { AxiosResponse } from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router"; // Import useRouter for navigation
import styles from "./Style"; // Import your styles

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
  const router = useRouter(); // Initialize the router

  const fetchUsers = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        Alert.alert("Error", "No token found. Please log in again.");
        return;
      }

      const response: AxiosResponse<User[]> = await axios.get(API_URL, {
        headers: {
          Authorization: `Bearer ${token}`,
          makerID: "47",
        },
      });

      console.log("Fetched users:", response.data); // Log the fetched data
      setUsers(response.data);
    } catch (error) {
      Alert.alert("Error", "Failed to fetch users. Please try again later.");
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchUsers();
  }, []);

  const renderItem = ({ item }: { item: User }) => (
    <TouchableOpacity
      style={styles.userCard}
      onPress={() => {
        router.push({
          pathname: "/editUser",
          params: { userId: item.user_id.toString() }, // Pass as a string
        });
      }}
    >
      <Text style={styles.userText}>User ID: {item.user_id}</Text>
      <Text style={styles.userText}>Name: {item.user_name}</Text>
      <Text style={styles.userText}>Role: {item.role}</Text>
      <Text style={styles.userText}>Username: {item.username}</Text>
      <Text style={styles.userText}>Created At: {item.created_at}</Text>
      <Text style={styles.userText}>Updated At: {item.updated_at}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {loading ? (
        <Text style={styles.loadingText}>Loading users...</Text>
      ) : (
        <FlatList
          data={users}
          keyExtractor={(item) => item.user_id.toString()}
          renderItem={renderItem}
        />
      )}
    </View>
  );
};

export default ShowUsers;
