import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";

const useAuth = () => {
  const [role, setRole] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const checkUserRole = async () => {
      const storedRole = await AsyncStorage.getItem("role"); // Assuming the role is stored in AsyncStorage

      if (!storedRole) {
        router.push("/login"); // Redirect to login if no role is found
      } else {
        setRole(storedRole);
      }
    };

    checkUserRole();
  }, []);

  return role;
};

export default useAuth;
