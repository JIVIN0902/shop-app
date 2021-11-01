import React, { useEffect } from "react";
import { FlatList, Platform, StyleSheet, Text, View } from "react-native";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import { useDispatch, useSelector } from "react-redux";
import { fetchOrders } from "../../../store/actions/orders";
import CustomHeaderButton from "../../UI/HeaderButton";
import OrderItem from "./OrderItem";

const OrdersScreen = () => {
	const orders = useSelector((state) => state.orders.orders);
	const dispatch = useDispatch();

	useEffect(() => {
		dispatch(fetchOrders());
	}, [dispatch]);
	return (
		<FlatList
			data={orders}
			keyExtractor={(item) => item.id}
			renderItem={(itemData) => (
				<OrderItem
					items={itemData.item.items}
					amount={itemData.item.amount}
					date={itemData.item.readableDate}
					total={itemData.item.totalAmount}
				/>
			)}
		/>
	);
};

export const screenOptions = (navData) => {
	return {
		headerTitle: "Your Orders",
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
	};
};

export default OrdersScreen;

const styles = StyleSheet.create({});
