import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import React, { useState } from "react";
import { Picker } from "@react-native-picker/picker";
import AsyncStorage from "@react-native-async-storage/async-storage";

type UserRole = "cashier" | "admin" | "manager";

interface UserData {
  user_name: string;
  role: UserRole;
  username: string;
  password: string;
}

interface FormErrors {
  user_name?: string;
  username?: string;
  password?: string;
}

const Register = () => {
  const [userData, setUserData] = useState<UserData>({
    user_name: "",
    role: "cashier",
    username: "",
    password: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});

  const validateForm = () => {
    let tempErrors: FormErrors = {};
    if (!userData.user_name) tempErrors.user_name = "Name is required";
    if (!userData.username) tempErrors.username = "Username is required";
    if (!userData.password) {
      tempErrors.password = "Password is required";
    } else if (userData.password.length < 6) {
      tempErrors.password = "Password must be at least 6 characters";
    }
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (validateForm()) {
      try {
        // Get token from AsyncStorage
        const token = await AsyncStorage.getItem("token");

        if (!token) {
          Alert.alert("Error", "Authentication token not found");
          return;
        }

        // Convert UserData to Record<string, string> for URLSearchParams
        const formData: Record<string, string> = {
          user_name: userData.user_name,
          role: userData.role,
          username: userData.username,
          password: userData.password,
        };

        const response = await fetch(
          "https://ukkcafe.smktelkom-mlg.sch.id/api/register",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
              Authorization: `Bearer ${token}`,
              makerID: "47",
            },
            body: new URLSearchParams(formData).toString(),
          }
        );

        const data = await response.json();

        if (response.ok) {
          Alert.alert("Success", "Registration successful!");
          // Add navigation or other success handling here
        } else {
          Alert.alert("Error", data.message || "Registration failed");
        }
      } catch (error) {
        Alert.alert("Error", "Network error occurred");
        console.error(error);
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Register</Text>

      <TextInput
        style={styles.input}
        placeholder="Name"
        value={userData.user_name}
        onChangeText={(text) => setUserData({ ...userData, user_name: text })}
      />
      {errors.user_name && (
        <Text style={styles.errorText}>{errors.user_name}</Text>
      )}

      <TextInput
        style={styles.input}
        placeholder="Username"
        value={userData.username}
        onChangeText={(text) => setUserData({ ...userData, username: text })}
      />
      {errors.username && (
        <Text style={styles.errorText}>{errors.username}</Text>
      )}

      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={userData.role}
          style={styles.picker}
          onValueChange={(itemValue: UserRole) =>
            setUserData({ ...userData, role: itemValue })
          }
        >
          <Picker.Item label="Cashier" value="cashier" />
          <Picker.Item label="Admin" value="admin" />
          <Picker.Item label="Manager" value="manager" />
        </Picker>
      </View>

      <TextInput
        style={styles.input}
        placeholder="Password"
        value={userData.password}
        onChangeText={(text) => setUserData({ ...userData, password: text })}
        secureTextEntry
      />
      {errors.password && (
        <Text style={styles.errorText}>{errors.password}</Text>
      )}

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Register</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
    fontSize: 16,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    marginBottom: 15,
  },
  picker: {
    height: 50,
  },
  button: {
    backgroundColor: "#007AFF",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginTop: -10,
    marginBottom: 10,
  },
});

export default Register;
