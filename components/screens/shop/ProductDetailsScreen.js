import React from "react";
import {
	Button,
	Image,
	ScrollView,
	StyleSheet,
	Text,
	View,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import Colors from "../../../constants/Colors";
import * as CartActions from "../../../store/actions/cart";

const ProductDetailsScreen = (props) => {
	const dispatch = useDispatch();
	const productId = props.route.params.productId;
	const selectedProduct = useSelector((state) =>
		state.products.availableProducts.find((prod) => prod.id === productId)
	);
	return (
		<ScrollView>
			<Image style={styles.image} source={{ uri: selectedProduct.imageUrl }} />
			<View style={styles.actions}>
				<Button
					color={Colors.primary}
					title="Add To Cart"
					onPress={() => {
						dispatch(CartActions.addToCart(selectedProduct));
					}}
				/>

				<Text style={styles.price}>${selectedProduct.price.toFixed(2)}</Text>
				<Text style={styles.description}>{selectedProduct.description}</Text>
			</View>
		</ScrollView>
	);
};

export const screenOptions = (navData) => {
	return {
		headerTitle: navData.route.params.productTitle,
	};
};

export default ProductDetailsScreen;

const styles = StyleSheet.create({
	image: {
		width: "100%",
		height: 300,
	},
	price: {
		fontSize: 20,
		color: "#888",
		textAlign: "center",
		marginVertical: 20,
		fontFamily: "open-sans-bold",
	},
	description: {
		fontSize: 14,
		fontFamily: "open-sans",
		textAlign: "center",
	},
	actions: {
		marginVertical: 10,
		alignItems: "center",
		marginHorizontal: 20,
	},
});
