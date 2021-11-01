import React, { useState } from "react";
import {
	StyleSheet,
	Text,
	View,
	FlatList,
	Button,
	ActivityIndicator,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import Colors from "../../../constants/Colors";
import { removeFromCart } from "../../../store/actions/cart";
import { addOrder } from "../../../store/actions/orders";
import CartItem from "../../CartItem";

const CartScreen = (props) => {
	const cartTotalAmount = useSelector((state) => state.cart.totalAmount);
	const dispatch = useDispatch();
	const [loading, setLoading] = useState(false);
	const cartItems = useSelector((state) => {
		const transformedCartItems = [];
		for (const key in state.cart.items) {
			console.log(state.cart.items[key]);
			transformedCartItems.push({
				productId: key,
				productTitle: state.cart.items[key].productTitle,
				productPrice: state.cart.items[key].productPrice,
				quantity: state.cart.items[key].quantity,
				sum: state.cart.items[key].sum,
				productPushToken: state.cart.items[key].pushToken,
			});
		}
		return transformedCartItems.sort((a, b) =>
			a.productId > b.productId ? 1 : -1
		);
	});

	return (
		<View style={styles.screen}>
			<View style={styles.summary}>
				<Text style={styles.summaryText}>
					Total:{" "}
					<Text style={styles.amount}>${cartTotalAmount.toFixed(2)}</Text>
				</Text>
				{loading ? (
					<ActivityIndicator size="large" color={Colors.primary} />
				) : (
					<Button
						color={Colors.accent}
						title="Order Now!"
						disabled={cartItems.length === 0}
						onPress={async () => {
							setLoading(true);
							await dispatch(addOrder(cartItems, cartTotalAmount));
							setLoading(false);
						}}
					/>
				)}
			</View>
			<FlatList
				data={cartItems}
				keyExtractor={(itemData) => itemData.productId}
				renderItem={(itemData) => (
					<CartItem
						quantity={itemData.item.quantity}
						title={itemData.item.productTitle}
						amount={itemData.item.sum}
						deletable
						total={cartTotalAmount}
						onRemove={() => {
							dispatch(removeFromCart(itemData.item.productId));
						}}
					/>
				)}
			/>
		</View>
	);
};

export const screenOptions = {
	headerTitle: "Your Cart",
};

export default CartScreen;

const styles = StyleSheet.create({
	screen: {
		margin: 20,
	},
	summary: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		marginBottom: 20,
		padding: 10,
	},
	summaryText: {
		fontFamily: "open-sans-bold",
		fontSize: 18,
	},
	amount: {
		color: Colors.accent,
	},
});
