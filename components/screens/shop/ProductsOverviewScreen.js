import React, { useCallback, useState } from "react";
import {
	Button,
	FlatList,
	Platform,
	StyleSheet,
	Text,
	ActivityIndicator,
	View,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import ProductItem from "./ProductItem";
import * as cartActions from "../../../store/actions/cart";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import CustomHeaderButton from "../../UI/HeaderButton";
import CartScreen from "./CartScreen";
import { DrawerActions } from "react-navigation-drawer";
import Colors from "../../../constants/Colors";
import { useEffect } from "react";
import { fetchProducts } from "../../../store/actions/products";

const ProductsOverviewScreen = (props) => {
	const products = useSelector((state) => state.products.availableProducts);
	const dispatch = useDispatch();
	const [error, setError] = useState(null);
	const [loading, setLoading] = useState(false);
	const [refreshing, setRefreshing] = useState(false);

	const loadProducts = useCallback(async () => {
		setError(null);
		setRefreshing(true);
		try {
			await dispatch(fetchProducts());
			setLoading(false);
		} catch (err) {
			setError(err.message);
		}
		setRefreshing(false);
	}, [dispatch, setLoading, setError]);

	useEffect(() => {
		const unsubscribe = props.navigation.addListener("focus", loadProducts);

		return () => {
			unsubscribe();
		};
	}, [loadProducts]);

	useEffect(() => {
		setLoading(true);
		loadProducts().then(() => setLoading(false));
	}, [dispatch, loadProducts]);

	const selectItemHandler = (id, title) => {
		props.navigation.navigate("ProductDetail", {
			productId: id,
			productTitle: title,
		});
	};

	if (error) {
		<View style={styles.centered}>
			<Text>An error ocurred</Text>
			<Button title="Try Again" onPress={loadProducts} color={Colors.primary} />
		</View>;
	}

	if (loading) {
		return (
			<View style={styles.centered}>
				<ActivityIndicator size="large" color={Colors.primary} />
			</View>
		);
	}

	if (loading && products.length === 0) {
		return (
			<View style={styles.centered}>
				<Text>No products found. Maybe start adding some?</Text>
			</View>
		);
	}
	return (
		<FlatList
			onRefresh={loadProducts}
			refreshing={refreshing}
			data={products}
			keyExtractor={(item) => item.id}
			renderItem={(itemData) => (
				<ProductItem
					image={itemData.item.imageUrl}
					title={itemData.item.title}
					price={itemData.item.price}
					onViewDetail={() => {
						selectItemHandler(itemData.item.id, itemData.item.title);
					}}
					onAddToCart={() => {
						dispatch(cartActions.addToCart(itemData.item));
					}}
				>
					<Button
						color={Colors.primary}
						title="View Details"
						onPress={() => {
							selectItemHandler(itemData.item.id, itemData.item.title);
						}}
					/>
					<Button
						title="To Cart"
						onPress={() => {
							dispatch(cartActions.addToCart(itemData.item));
						}}
					/>
				</ProductItem>
			)}
		/>
	);
};

export const ScreenOptions = (navData) => {
	return {
		headerTitle: "All Products",
		headerLeft: () => (
			<HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
				<Item
					title="Menu"
					iconName={Platform.OS === "android" ? "md-menu" : "ios-menu"}
					onPress={() => {
						navData.navigation.toggleDrawer();
					}}
				/>
			</HeaderButtons>
		),
		headerRight: () => (
			<HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
				<Item
					title="Cart"
					iconName={Platform.OS === "android" ? "md-cart" : "ios-cart"}
					onPress={() => {
						navData.navigation.navigate("Cart");
					}}
				/>
			</HeaderButtons>
		),
	};
};

export default ProductsOverviewScreen;

const styles = StyleSheet.create({
	centered: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
});
