import React from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

const LoginScreen = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      {/* E-Commerce Icon & Slogan */}
      <View style={styles.logoContainer}>
        <MaterialIcons name="shopping-bag" size={80} color="#FF6347" />
        <Text style={styles.slogan}>Your Shopping Journey Starts Here</Text>
      </View>

      {/* Login Inputs */}
      <TextInput placeholder="Email" placeholderTextColor="#888" style={styles.input} />
      <TextInput placeholder="Password" placeholderTextColor="#888" style={styles.input} secureTextEntry />

      {/* Login Button */}
      <TouchableOpacity style={styles.loginButton}>
        <Text style={styles.loginButtonText}>Login</Text>
      </TouchableOpacity>

      {/* Create Account Button - Now Navigates to SignUp Screen */}
      <TouchableOpacity 
        style={styles.createAccountButton}
        onPress={() => navigation.navigate("SignUp")}  // Make sure "SignUp" screen exists in navigation
      >
        <Text style={styles.createAccountText}>Create an Account</Text>
      </TouchableOpacity>

      {/* Enter as Guest Button */}
      <TouchableOpacity
        style={styles.guestButton}
        onPress={() => navigation.navigate("Home")}
      >
        <Text style={styles.guestText}>Enter as Guest</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 30,
  },
  slogan: {
    color: "white",
    fontSize: 16,
    marginTop: 10,
    textAlign: "center",
  },
  input: {
    width: "100%",
    backgroundColor: "#1E1E1E",
    padding: 12,
    borderRadius: 10,
    color: "white",
    fontSize: 16,
    marginBottom: 15,
  },
  loginButton: {
    width: "100%",
    backgroundColor: "#FF6347",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 10,
  },
  loginButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  createAccountButton: {
    marginBottom: 10,
  },
  createAccountText: {
    color: "#FF6347",
    fontSize: 16,
  },
  guestButton: {
    marginTop: 10,
  },
  guestText: {
    color: "#888",
    fontSize: 16,
  },
});

export default LoginScreen;
