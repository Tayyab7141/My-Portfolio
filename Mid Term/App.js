import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList, TouchableOpacity, ActivityIndicator, Image, StyleSheet, Alert } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import { makeRedirectUri } from 'expo-auth-session';
import { signInWithCredential, GoogleAuthProvider } from 'firebase/auth';
import { auth } from './firebaseConfig';

WebBrowser.maybeCompleteAuthSession();

const Stack = createStackNavigator();

const LoginScreen = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const [request, response, promptAsync] = Google.useAuthRequest({
    expoClientId: '757384988910-ltcbg8qqpb76c5p2a15snffc1onpel7n.apps.googleusercontent.com',
    iosClientId: '757384988910-ltcbg8qqpb76c5p2a15snffc1onpel7n.apps.googleusercontent.com',
    androidClientId: '757384988910-ltcbg8qqpb76c5p2a15snffc1onpel7n.apps.googleusercontent.com',
    redirectUri: makeRedirectUri({ useProxy: true }),
  });

  useEffect(() => {
    if (response?.type === 'success') {
      const { id_token } = response.authentication;
      const credential = GoogleAuthProvider.credential(id_token);
      signInWithCredential(auth, credential)
        .then((userCred) => {
          const email = userCred.user.email;
          Alert.alert("Welcome 🎉", `Signed in as ${email}`);
          navigation.replace('JobList', { user: email });
        })
        .catch((error) => {
          console.log("Firebase sign-in error", error);
        });
    }
  }, [response]);

  const handleLogin = () => {
    if (username && password) {
      Alert.alert("Logged In ✅", `Hello, ${username}`);
      navigation.replace('JobList', { user: username });
    } else {
      Alert.alert("Missing Info", "Please enter both username and password");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🚀 Job Hunter</Text>
      <Text style={styles.subtitle}>Login to explore top job listings</Text>

      <TextInput
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
        style={styles.input}
        placeholderTextColor="#6C757D"
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
        placeholderTextColor="#6C757D"
      />
      <Button title="Login" onPress={handleLogin} color="#007BFF" />

      <Text style={{ textAlign: 'center', marginVertical: 10 }}>──────  OR  ──────</Text>

      <Button
        title="Sign in with Google"
        onPress={() => promptAsync()}
        disabled={!request}
        color="#DB4437"
      />
    </View>
  );
};

const JobListScreen = ({ navigation, route }) => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const username = route.params?.user;

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await fetch('https://jsonfakery.com/jobs'); // Replace with real job API
        const data = await response.json();
        if (Array.isArray(data)) {
          setJobs(data);
          await AsyncStorage.setItem('jobs', JSON.stringify(data));
        } else {
          console.error('Unexpected API response:', data);
        }
      } catch (error) {
        console.error('Error fetching jobs:', error);
        const cachedJobs = await AsyncStorage.getItem('jobs');
        if (cachedJobs) setJobs(JSON.parse(cachedJobs));
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  if (loading) {
    return <ActivityIndicator size="large" color="#007BFF" style={{ marginTop: 40 }} />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Hi {username} 👋</Text>
      <Text style={styles.subtitle}>Available Job Opportunities</Text>
      <FlatList
        data={jobs}
        keyExtractor={(item, index) => (item.id ? item.id.toString() : index.toString())}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => navigation.navigate('JobDetail', { job: item })} style={styles.jobItem}>
            {item.logo && <Image source={{ uri: item.logo }} style={styles.logo} />}
            <View>
              <Text style={styles.jobTitle}>{item.title}</Text>
              <Text style={styles.company}>{item.company}</Text>
              <Text style={styles.location}>{item.location}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const JobDetailScreen = ({ route }) => {
  const { job } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{job.title}</Text>
      {job.logo && <Image source={{ uri: job.logo }} style={styles.detailLogo} />}
      <Text style={styles.detailText}>Company: {job.company}</Text>
      <Text style={styles.detailText}>Location: {job.location}</Text>
      <Text style={styles.detailText}>Description: {job.description || 'No description available'}</Text>
      <Text style={styles.detailText}>Requirements: {job.requirements || 'No specific requirements'}</Text>
      <Button title="Apply Now" onPress={() => Alert.alert('Apply Here', job.apply_link || 'Link not provided')} color="#28A745" />
    </View>
  );
};

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerStyle: { backgroundColor: '#007BFF' }, headerTintColor: '#fff' }}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="JobList" component={JobListScreen} />
        <Stack.Screen name="JobDetail" component={JobDetailScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F8F9FA',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#007BFF',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    color: '#6C757D',
  },
  input: {
    borderWidth: 1,
    borderColor: '#CED4DA',
    padding: 12,
    marginBottom: 10,
    borderRadius: 8,
    backgroundColor: '#FFF',
    color: '#000',
  },
  jobItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderColor: '#CED4DA',
    backgroundColor: '#FFF',
    borderRadius: 8,
    marginBottom: 10,
    elevation: 2,
  },
  logo: {
    width: 50,
    height: 50,
    marginRight: 10,
    borderRadius: 25,
  },
  jobTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#343A40',
  },
  company: {
    color: '#6C757D',
  },
  location: {
    color: '#495057',
  },
  detailLogo: {
    width: 100,
    height: 100,
    alignSelf: 'center',
    marginBottom: 10,
    borderRadius: 50,
  },
  detailText: {
    fontSize: 16,
    marginBottom: 10,
    color: '#495057',
  },
});
