// components/EditUser/EditUser.tsx
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Alert,
  StyleSheet,
  Pressable,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useRouter } from "expo-router";

interface User {
  user_id: number;
  user_name: string;
  role: string;
  username: string;
}

const API_URL = "https://ukkcafe.smktelkom-mlg.sch.id/api/user";

const EditUser: React.FC = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [editedUser, setEditedUser] = useState<User | null>(null);
  const [userName, setUserName] = useState("");
  const [role, setRole] = useState("");
  const [username, setUsername] = useState("");

  const loadUserToEdit = async () => {
    try {
      const userToEditString = await AsyncStorage.getItem("userToEdit");
      if (userToEditString) {
        const userToEditData: User = JSON.parse(userToEditString);
        setEditedUser(userToEditData);
        setUserName(userToEditData.user_name);
        setRole(userToEditData.role);
        setUsername(userToEditData.username);
      } else {
        Alert.alert("Error", "No user selected for editing");
        router.back();
      }
    } catch (error) {
      console.error("Error loading user data:", error);
      Alert.alert("Error", "Failed to load user data");
      router.back();
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadUserToEdit();
    return () => {
      AsyncStorage.removeItem("userToEdit");
    };
  }, []);

  const handleSubmit = async () => {
    if (!userName || !role || !username) {
      Alert.alert("Error", "Please fill out all fields.");
      return;
    }

    try {
      const token = await AsyncStorage.getItem("token");
      if (!token || !editedUser) {
        Alert.alert("Error", "No token or user found. Please log in again.");
        return;
      }

      await axios.put(
        `${API_URL}/${editedUser.user_id}`,
        {
          user_name: userName,
          role,
          username,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            makerID: "62",
          },
        }
      );

      await AsyncStorage.removeItem("userToEdit");

      Alert.alert("Success", "User details updated successfully!", [
        {
          text: "OK",
          onPress: () => router.back(),
        },
      ]);
    } catch (error) {
      console.error("Error updating user:", error);
      Alert.alert("Error", "Failed to update user details.");
    }
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable
          onPress={() => {
            AsyncStorage.removeItem("userToEdit");
            router.back();
          }}
          style={styles.backButton}
        >
          <Text style={styles.backButtonText}>← Back</Text>
        </Pressable>
        <Text style={styles.title}>Edit User</Text>
      </View>

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
      <Pressable style={styles.updateButton} onPress={handleSubmit}>
        <Text style={styles.updateButtonText}>Update User</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 12,
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 16,
    paddingHorizontal: 12,
  },
  backButton: {
    paddingVertical: 8,
  },
  backButtonText: {
    color: "#007AFF",
    fontSize: 16,
  },
  updateButton: {
    backgroundColor: "#007AFF",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  updateButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default EditUser;
