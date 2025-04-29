import React, { useContext, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, TextInput, StyleSheet, Alert } from "react-native";
import { CartContext } from "../context/CartContext";
import { useNavigation } from "@react-navigation/native";

const CartScreen = () => {
  const { cart, removeFromCart, clearCart } = useContext(CartContext);
  const navigation = useNavigation();
  
  // Address state
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [zipCode, setZipCode] = useState("");

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);
  };

  const handleCheckout = () => {
    if (cart.length === 0) {
      Alert.alert("Cart is Empty", "Please add items to your cart before proceeding.");
      return;
    }
    if (!address || !city || !zipCode) {
      Alert.alert("Incomplete Address", "Please fill in all address details before proceeding.");
      return;
    }
    
    // Navigate to Payment Screen with cart & address details
    navigation.navigate("PaymentMethod", { cart, addressDetails: { address, city, zipCode } });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Your Cart</Text>

      {cart.length === 0 ? (
        <Text style={styles.emptyCart}>Your cart is empty!</Text>
      ) : (
        <>
          <FlatList
            data={cart}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <View style={styles.cartItem}>
                <Text style={styles.itemText}>
                  {item.title} x {item.quantity}
                </Text>
                <TouchableOpacity onPress={() => removeFromCart(item.id)}>
                  <Text style={styles.removeButton}>Remove</Text>
                </TouchableOpacity>
              </View>
            )}
          />
          <Text style={styles.total}>Total: ${getTotalPrice()}</Text>

          {/* Address Input Fields */}
          <Text style={styles.addressTitle}>Enter Your Address</Text>
          <TextInput 
            style={styles.input} 
            placeholder="Street Address" 
            placeholderTextColor="#999" 
            value={address} 
            onChangeText={setAddress} 
          />
          <TextInput 
            style={styles.input} 
            placeholder="City" 
            placeholderTextColor="#999" 
            value={city} 
            onChangeText={setCity} 
          />
          <TextInput 
            style={styles.input} 
            placeholder="ZIP Code" 
            placeholderTextColor="#999" 
            value={zipCode} 
            onChangeText={setZipCode} 
            keyboardType="numeric"
          />

          <TouchableOpacity style={styles.checkoutButton} onPress={handleCheckout}>
            <Text style={styles.buttonText}>Proceed to Payment</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#121212" },
  header: { fontSize: 22, fontWeight: "bold", color: "#FF6347", marginBottom: 10, textAlign: "center" },
  emptyCart: { textAlign: "center", color: "white", marginTop: 20, fontSize: 16 },
  cartItem: {
    padding: 15,
    backgroundColor: "#1E1E1E",
    marginVertical: 10,
    borderRadius: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  itemText: { color: "white", fontSize: 16 },
  removeButton: { color: "#FF6347", fontWeight: "bold" },
  total: { color: "#FF6347", fontSize: 20, textAlign: "center", marginVertical: 20 },
  addressTitle: { color: "#FF6347", fontSize: 18, fontWeight: "bold", marginTop: 20 },
  input: {
    borderWidth: 1,
    borderColor: "#FF6347",
    padding: 10,
    borderRadius: 8,
    marginVertical: 10,
    color: "white",
  },
  checkoutButton: {
    backgroundColor: "#FF6347",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
  },
  buttonText: { color: "white", fontSize: 18, fontWeight: "bold" },
});

export default CartScreen;
