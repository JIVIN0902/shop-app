import React from "react";
import {
	Alert,
	Button,
	FlatList,
	Platform,
	StyleSheet,
	Text,
	View,
} from "react-native";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import { useDispatch, useSelector } from "react-redux";
import Colors from "../../../constants/Colors";
import { deleteProduct } from "../../../store/actions/products";
import CustomHeaderButton from "../../UI/HeaderButton";

import ProductItem from "../shop/ProductItem";

const UserProductsScreen = (props) => {
	const userProducts = useSelector((state) => state.products.userProducts);
	const dispatch = useDispatch();

	const deleteHandler = (id) => {
		Alert.alert("Are you sure?", "Do you really want to delete this item?", [
			{ text: "NO", style: "default" },
			{
				text: "Yes",
				style: "destructive",
				onPress: () => {
					dispatch(deleteProduct(id));
				},
			},
		]);
	};

	const editProductHandler = (id) => {
		props.navigation.navigate("EditProduct", { productId: id });
	};
	return (
		<FlatList
			data={userProducts}
			keyExtractor={(item) => item.id}
			renderItem={(itemData) => (
				<ProductItem
					image={itemData.item.imageUrl}
					title={itemData.item.title}
					price={itemData.item.price}
					onSelect={() => {
						editProductHandler(itemData.item.id);
					}}
				>
					<Button
						color={Colors.primary}
						title="Edit"
						onPress={() => {
							editProductHandler(itemData.item.id);
						}}
					/>
					<Button
						title="Delete"
						onPress={() => deleteHandler(itemData.item.id)}
					/>
				</ProductItem>
			)}
		/>
	);
};

export const screenOptions = (navData) => {
	return {
		headerTitle: "Your Products",
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
					title="Menu"
					iconName={Platform.OS === "android" ? "md-create" : "ios-create"}
					onPress={() => {
						navData.navigation.navigate("EditProduct");
					}}
				/>
			</HeaderButtons>
		),
	};
};

export default UserProductsScreen;

const styles = StyleSheet.create({});
