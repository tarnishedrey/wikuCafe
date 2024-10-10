// components/ShowUser/ShowUser.tsx
import React from "react";
import { View, Text, FlatList, Alert, TouchableOpacity } from "react-native";
import axios, { AxiosResponse } from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import styles from "./Style";

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

      const response: AxiosResponse = await axios.get(API_URL, {
        headers: {
          Authorization: `Bearer ${token}`,
          makerID: "47",
        },
      });

      console.log("Fetched users:", response.data);
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

  const handleUserPress = async (user: User) => {
    try {
      await AsyncStorage.setItem("userData", JSON.stringify(user)); // Save full user object
      router.push("/editUser"); // Navigate to editUser page
    } catch (error) {
      console.error("Error saving user data to AsyncStorage:", error);
    }
  };

  const renderItem = ({ item }: { item: User }) => (
    <TouchableOpacity onPress={() => handleUserPress(item)}>
      <View style={styles.userCard}>
        <Text>User ID: {item.user_id}</Text>
        <Text>Name: {item.user_name}</Text>
        <Text>Role: {item.role}</Text>
        <Text>Username: {item.username}</Text>
        <Text>Created At: {item.created_at}</Text>
        <Text>Updated At: {item.updated_at}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View>
      {loading ? (
        <Text>Loading users...</Text>
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
