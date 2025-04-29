import React from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useCart } from "../context/CartContext"; // Import useCart

const ProductDetailsScreen = ({ route }) => {
  const { product } = route.params;
  const navigation = useNavigation();
  const { addToCart, cart } = useCart(); // Get cart and addToCart function

  return (
    <View style={styles.container}>
      {/* Top Navigation (Back Button + Cart Icon) */}
      <View style={styles.topNav}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <MaterialIcons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>

        {/* Cart Button with Badge */}
        <TouchableOpacity style={styles.cartButton} onPress={() => navigation.navigate("CartScreen")}>
          <MaterialIcons name="shopping-cart" size={28} color="white" />
          {cart.length > 0 && (
            <View style={styles.cartBadge}>
              <Text style={styles.cartBadgeText}>{cart.length}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Product Image */}
        <Image source={{ uri: product.image }} style={styles.image} />

        {/* Product Details */}
        <View style={styles.detailsContainer}>
          <Text style={styles.title}>{product.title}</Text>
          <Text style={styles.category}>{product.category.toUpperCase()}</Text>
          <Text style={styles.price}>${product.price.toFixed(2)}</Text>

          {/* Rating */}
          <View style={styles.ratingContainer}>
            <MaterialIcons name="star" size={20} color="#FFD700" />
            <Text style={styles.rating}>{product.rating.rate} / 5</Text>
            <Text style={styles.ratingCount}>({product.rating.count} reviews)</Text>
          </View>

          {/* Description */}
          <Text style={styles.description}>{product.description}</Text>

          {/* Buttons */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.addToCartButton} onPress={() => addToCart(product)}>
              <MaterialIcons name="shopping-cart" size={24} color="white" />
              <Text style={styles.buttonText}>Add to Cart</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.buyNowButton}>
              <Text style={styles.buttonText}>Buy Now</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#121212" },

  /* Top Navigation */
  topNav: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  backButton: {
    backgroundColor: "#333",
    padding: 10,
    borderRadius: 50,
  },
  cartButton: {
    position: "relative",
    backgroundColor: "#333",
    padding: 10,
    borderRadius: 50,
  },
  cartBadge: {
    position: "absolute",
    top: 5,
    right: 5,
    backgroundColor: "red",
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  cartBadgeText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },

  /* Product Styling */
  scrollContainer: { paddingBottom: 20 },
  image: {
    width: "100%",
    height: 300,
    resizeMode: "contain",
    backgroundColor: "#1E1E1E",
  },
  detailsContainer: { padding: 20 },
  title: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 5,
  },
  category: {
    color: "#FF6347",
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 10,
  },
  price: {
    color: "#FFD700",
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  rating: { color: "white", fontSize: 16, marginLeft: 5 },
  ratingCount: { color: "#888", fontSize: 14, marginLeft: 5 },
  description: { color: "#DDD", fontSize: 14, lineHeight: 20, marginBottom: 20 },

  /* Buttons */
  buttonContainer: { flexDirection: "row", justifyContent: "space-between" },
  addToCartButton: {
    flexDirection: "row",
    backgroundColor: "#444",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    width: "48%",
  },
  buyNowButton: {
    backgroundColor: "#FF6347",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    width: "48%",
  },
  buttonText: { color: "white", fontSize: 16, fontWeight: "bold", marginLeft: 5 },
});

export default ProductDetailsScreen;
