import React, { useEffect, useState } from "react";
import { View, Text, TextInput, Button, Alert, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

interface User {
  user_id: number;
  user_name: string;
  role: string;
  username: string;
}

const API_URL = "https://ukkcafe.smktelkom-mlg.sch.id/api/user";

const EditUser: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [userName, setUserName] = useState("");
  const [role, setRole] = useState("");
  const [username, setUsername] = useState("");

  const loadUserData = async () => {
    try {
      const userDataString = await AsyncStorage.getItem("userData");
      if (userDataString) {
        const userData: User = JSON.parse(userDataString);
        setUser(userData);
        setUserName(userData.user_name);
        setRole(userData.role);
        setUsername(userData.username);
      } else {
        Alert.alert("Error", "Failed to load user data.");
      }
    } catch (error) {
      console.error("Error loading user data:", error);
    }
  };

  useEffect(() => {
    loadUserData();
  }, []);

  const handleSubmit = async () => {
    if (!userName || !role || !username) {
      Alert.alert("Error", "Please fill out all fields.");
      return;
    }

    try {
      const token = await AsyncStorage.getItem("token");
      if (!token || !user) {
        Alert.alert("Error", "No token or user found. Please log in again.");
        return;
      }

      await axios.put(
        `${API_URL}/${user.user_id}`,
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

  if (!user) {
    return <Text>Loading...</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Edit User</Text>
      <TextInput
        style={styles.input}
        placeholder="User Name"
        value={userName}
        onChangeText={setUserName}
      />
      <TextInput
        style={styles.input}
        placeholder="Role"
        value={role}
        onChangeText={setRole}
      />
      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
      />
      <Button title="Submit" onPress={handleSubmit} />
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
