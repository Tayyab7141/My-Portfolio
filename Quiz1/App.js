import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, Button, Alert, Image } from 'react-native';
import axios from 'axios';

const API_KEY = 'c079103a808c404a94494328251103'; // Replace with your key

const App = () => {
  const [city, setCity] = useState('New York');
  const [weather, setWeather] = useState(null);

  const fetchWeather = async (cityName) => {
    try {
      const response = await axios.get(
        `https://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${cityName}`
      );
      setWeather(response.data);
    } catch (error) {
      console.error('Error fetching weather:', error.response?.data || error.message);
      Alert.alert('Error', 'Failed to fetch weather. Please check API key and city name.');
    }
  };

  useEffect(() => {
    fetchWeather(city);
  }, []);

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Enter City"
        value={city}
        onChangeText={setCity}
      />
      <Button title="Get Weather" onPress={() => fetchWeather(city)} />

      {weather && (
        <>
          <Text style={styles.city}>{weather.location.name}</Text>
          <Image 
            source={{ uri: `https:${weather.current.condition.icon}` }} 
            style={styles.weatherIcon} 
          />
          <Text style={styles.temperature}>{weather.current.temp_c}°C</Text>
          <Text style={styles.description}>{weather.current.condition.text}</Text>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#87CEEB' },
  input: { borderWidth: 1, width: 200, padding: 8, marginBottom: 10, textAlign: 'center' },
  city: { fontSize: 30, fontWeight: 'bold' },
  weatherIcon: { width: 100, height: 100, marginVertical: 10 },
  temperature: { fontSize: 40, fontWeight: 'bold' },
  description: { fontSize: 20 },
}); 

export default App;
