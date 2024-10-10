// pages/EditUser.tsx
import React, { useEffect, useState } from "react";
import { View, Text, TextInput, Button, Alert, StyleSheet } from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface User {
  user_id: number;
  user_name: string;
  role: string;
  username: string;
}

const API_URL = "https://ukkcafe.smktelkom-mlg.sch.id/api/user";

const EditUser: React.FC<{ userId: number }> = ({ userId }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState("");
  const [role, setRole] = useState("");
  const [username, setUsername] = useState("");

  const fetchUser = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        Alert.alert("Error", "No token found. Please log in again.");
        return;
      }

      const response = await axios.get(`${API_URL}/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          makerID: "47",
        },
      });
      const userData = response.data;
      setUser(userData);
      setUserName(userData.user_name);
      setRole(userData.role);
      setUsername(userData.username);
    } catch (error) {
      Alert.alert("Error", "Failed to fetch user details.");
      console.error("Error fetching user:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, [userId]);

  const handleSubmit = async () => {
    if (!userName || !role || !username) {
      Alert.alert("Error", "Please fill out all fields.");
      return;
    }

    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        Alert.alert("Error", "No token found. Please log in again.");
        return;
      }

      const response = await axios.put(
        `${API_URL}/${userId}`,
        {
          user_name: userName,
          role,
          username,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            makerID: "47",
          },
        }
      );

      Alert.alert("Success", "User details updated successfully!");
    } catch (error) {
      Alert.alert("Error", "Failed to update user details.");
      console.error("Error updating user:", error);
    }
  };

  if (loading) {
    return <Text>Loading...</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Edit User</Text>
      <TextInput
        style={styles.input}
        placeholder={userName}
        value={userName}
        onChangeText={setUserName}
      />
      <TextInput
        style={styles.input}
        placeholder={role}
        value={role}
        onChangeText={setRole}
      />
      <TextInput
        style={styles.input}
        placeholder={username}
        value={username}
        onChangeText={setUsername}
      />
      <Button title="Save Changes" onPress={handleSubmit} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
});

export default EditUser;
