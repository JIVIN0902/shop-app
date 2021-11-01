import React from "react";
import {
	Platform,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
const CartItem = (props) => {
	return (
		<View style={styles.CartItem}>
			<View>
				<Text style={styles.quantity}>{props.quantity}</Text>
				<Text style={styles.title}>{props.title}</Text>
			</View>
			<View style={styles.itemData}>
				<Text style={styles.title}>${props.amount.toFixed(2)}</Text>
				{props.deletable && (
					<TouchableOpacity
						onPress={props.onRemove}
						style={styles.deleteButton}
					>
						<Ionicons
							name={Platform.OS === "android" ? "md-trash" : "ios-trash"}
							size={23}
							color={"red"}
						/>
					</TouchableOpacity>
				)}
			</View>
		</View>
	);
};

export default CartItem;

const styles = StyleSheet.create({
	CartItem: {
		padding: 10,
		backgroundColor: "white",
		flexDirection: "row",
		justifyContent: "space-between",
		marginHorizontal: 20,
	},
	itemData: {
		flexDirection: "row",
		alignItems: "center",
	},
	quantity: {
		fontFamily: "open-sans",
		color: "#888",
		fontSize: 16,
	},
	title: {
		fontFamily: "open-sans-bold",
		fontSize: 16,
	},
	deleteButton: {
		marginLeft: 20,
	},
});
