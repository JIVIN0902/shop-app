import React from "react";
import {
	Image,
	Platform,
	StyleSheet,
	Text,
	TouchableNativeFeedback,
	TouchableOpacity,
	View,
} from "react-native";

const ProductItem = (props) => {
	let TC = TouchableOpacity;
	if (Platform.OS === "android" && Platform.Version >= 21) {
		TC = TouchableNativeFeedback;
	}

	return (
		<View style={styles.product}>
			<View style={styles.touchable} useForeground>
				<TC onPress={props.onSelect}>
					<View>
						<View style={styles.imageContainer}>
							<Image style={styles.image} source={{ uri: props.image }} />
						</View>
						<View style={styles.details}>
							<Text style={props.title}>{props.title}</Text>
							<Text style={styles.price}>${props.price.toFixed(2)}</Text>
						</View>
						<View style={styles.actions}>{props.children}</View>
					</View>
				</TC>
			</View>
		</View>
	);
};

export default ProductItem;

const styles = StyleSheet.create({
	product: {
		shadowColor: "black",
		shadowOpacity: 0.26,
		shadowOffset: { width: 0, height: 2 },
		shadowRadius: 8,
		elevation: 5,
		borderRadius: 10,
		backgroundColor: "white",
		height: 300,
		margin: 20,
	},
	touchable: {
		overflow: "hidden",
		borderRadius: 10,
	},
	imageContainer: {
		height: "60%",
		width: "100%",
	},
	image: {
		height: "100%",
		width: "100%",
	},
	title: {
		fontSize: 18,
		fontFamily: "open-sans-bold",
		marginVertical: 2,
	},
	price: {
		fontSize: 14,
		fontFamily: "open-sans",
		color: "#888",
	},
	details: {
		alignItems: "center",
		height: "15%",
		padding: 10,
	},
	actions: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		height: "25%",
		paddingHorizontal: 20,
	},
});
