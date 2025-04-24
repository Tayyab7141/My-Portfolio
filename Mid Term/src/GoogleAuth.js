// GoogleAuth.js
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import { makeRedirectUri } from "expo-auth-session";
import { useEffect } from "react";
import { signInWithCredential, GoogleAuthProvider } from "firebase/auth";
import { auth } from "../firebaseConfig"; // your firebase config file

WebBrowser.maybeCompleteAuthSession();

export function useGoogleAuth() {
  const [request, response, promptAsync] = Google.useAuthRequest({
    expoClientId: "757384988910-ltcbg8qqpb76c5p2a15snffc1onpel7n.apps.googleusercontent.com",
    iosClientId: "757384988910-ltcbg8qqpb76c5p2a15snffc1onpel7n.apps.googleusercontent.com",
    androidClientId: "757384988910-ltcbg8qqpb76c5p2a15snffc1onpel7n.apps.googleusercontent.com",
    redirectUri: makeRedirectUri({ useProxy: true }),
  });

  useEffect(() => {
    if (response?.type === "success") {
      const { id_token } = response.authentication;
      const credential = GoogleAuthProvider.credential(id_token);
      signInWithCredential(auth, credential)
        .then((userCred) => {
          console.log("✅ Google Sign-in successful", userCred.user);
        })
        .catch((error) => {
          console.log("❌ Firebase sign-in error", error);
        });
    }
  }, [response]);

  return { promptAsync, request };
}
