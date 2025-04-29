import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { MaterialIcons } from "@expo/vector-icons";

const HomeScreen = () => {
  const navigation = useNavigation();
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [loading, setLoading] = useState(true);
  const [cartItems, setCartItems] = useState(3); // Example cart count

  const categories = [
    { name: "all", icon: "apps" },
    { name: "electronics", icon: "devices" },
    { name: "jewelery", icon: "diamond" },
    { name: "men's clothing", icon: "man" },
    { name: "women's clothing", icon: "woman" },
  ];

  useEffect(() => {
    fetch("https://fakestoreapi.com/products")
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
        setLoading(false);
      });
  }, []);

  const filterProducts = () => {
    if (selectedCategory === "all") return products;
    return products.filter((product) => product.category === selectedCategory);
  };

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#FF6347" />
        <Text style={styles.loaderText}>Loading Products...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header with App Title & Cart */}
      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>🛍️ E-Commerce</Text>
        <TouchableOpacity style={styles.cartButton} onPress={() => navigation.navigate("Cart")}>
          <MaterialIcons name="shopping-cart" size={28} color="white" />
          {cartItems > 0 && (
            <View style={styles.cartBadge}>
              <Text style={styles.cartBadgeText}>{cartItems}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* Category Selection */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryContainer}>
        {categories.map((category) => (
          <TouchableOpacity
            key={category.name}
            style={[
              styles.categoryButton,
              selectedCategory === category.name && styles.selectedCategory,
            ]}
            onPress={() => setSelectedCategory(category.name)}
          >
            <MaterialIcons name={category.icon} size={20} color="white" />
            <Text style={styles.categoryText}>{category.name}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Product Grid */}
      <FlatList
        data={filterProducts()}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 80 }}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.productCard}
            onPress={() => navigation.navigate("ProductDetails", { product: item })}
          >
            <Image source={{ uri: item.image }} style={styles.image} />
            <Text style={styles.productTitle}>
              {item.title.length > 20 ? item.title.slice(0, 20) + "..." : item.title}
            </Text>
            <Text style={styles.price}>${item.price.toFixed(2)}</Text>
          </TouchableOpacity>
        )}
      />

      {/* Floating Cart Button */}
      <TouchableOpacity style={styles.floatingCartButton} onPress={() => navigation.navigate("Cart")}>
        <MaterialIcons name="shopping-cart" size={28} color="white" />
        {cartItems > 0 && (
          <View style={styles.cartBadge}>
            <Text style={styles.cartBadgeText}>{cartItems}</Text>
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#121212", padding: 10 },
  
  /* Header */
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
  },
  headerText: { fontSize: 26, fontWeight: "bold", color: "#FF6347" },
  cartButton: { position: "relative", padding: 5 },
  cartBadge: {
    position: "absolute",
    top: -5,
    right: -5,
    backgroundColor: "red",
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  cartBadgeText: { color: "white", fontSize: 12, fontWeight: "bold" },

  /* Categories */
  categoryContainer: { flexDirection: "row", marginBottom: 10, paddingHorizontal: 5 },
  categoryButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    backgroundColor: "#444",
    marginHorizontal: 5,
    borderRadius: 10,
    shadowColor: "#fff",
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
  },
  selectedCategory: { backgroundColor: "#FF6347" },
  categoryText: { color: "white", fontSize: 14, marginLeft: 5 },

  /* Products */
  productCard: {
    flex: 1,
    backgroundColor: "#1E1E1E",
    margin: 5,
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
    shadowColor: "#fff",
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
  },
  image: { width: 120, height: 120, resizeMode: "contain" },
  productTitle: { color: "white", fontSize: 14, textAlign: "center", marginTop: 5 },
  price: { color: "#FF6347", fontSize: 18, fontWeight: "bold", marginTop: 5 },

  /* Loader */
  loaderContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  loaderText: { color: "white", fontSize: 16, marginTop: 10 },

  /* Floating Cart Button */
  floatingCartButton: {
    position: "absolute",
    bottom: 20,
    right: 20,
    backgroundColor: "#FF6347",
    padding: 15,
    borderRadius: 30,
    elevation: 5,
  },
});

export default HomeScreen;
