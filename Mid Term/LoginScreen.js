import React, { useEffect } from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import { useAuthRequest, makeRedirectUri } from "expo-auth-session";
import { auth } from "../src/firebaseConfig";
import { signInWithCredential, GoogleAuthProvider } from "firebase/auth";
import Constants from "expo-constants";
import axios from "axios";

WebBrowser.maybeCompleteAuthSession();

const LoginScreen = ({ navigation }) => {
  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId: "YOUR_EXPO_CLIENT_ID.apps.googleusercontent.com", // for Expo Go
    iosClientId: "YOUR_IOS_CLIENT_ID.apps.googleusercontent.com", // if standalone iOS
    androidClientId: "YOUR_ANDROID_CLIENT_ID.apps.googleusercontent.com", // if standalone Android
    redirectUri: makeRedirectUri({ useProxy: true }),
  });

  useEffect(() => {
    if (response?.type === "success") {
      const { id_token } = response.params;

      const credential = GoogleAuthProvider.credential(id_token);
      signInWithCredential(auth, credential)
        .then(async (userCred) => {
          const user = userCred.user;
          const userData = {
            name: user.displayName,
            email: user.email,
            profilePicture: user.photoURL,
          };
          await axios.post("http://localhost:5000/api/auth", userData);
          navigation.navigate("JobListings", { user: userData });
        })
        .catch((error) => {
          console.error("Firebase Sign-in Error:", error);
        });
    }
  }, [response]);

  return (
    <View style={styles.container}>
      <Image source={require("../assets/login-illustration.png")} style={styles.image} />
      <Text style={styles.title}>Welcome to JobFinder</Text>
      <TouchableOpacity style={styles.googleButton} onPress={() => promptAsync()}>
        <Image
          source={{ uri: "https://upload.wikimedia.org/wikipedia/commons/4/4a/Logo_2013_Google.png" }}
          style={styles.googleLogo}
        />
        <Text style={styles.buttonText}>Sign in with Google</Text>
      </TouchableOpacity>
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f3f4f6",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginVertical: 20,
    color: "#1f2937",
  },
  googleButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 8,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  googleLogo: {
    width: 24,
    height: 24,
    marginRight: 10,
  },
  buttonText: {
    fontSize: 16,
    color: "#111827",
  },
  image: {
    width: 250,
    height: 250,
    resizeMode: "contain",
  },
});
