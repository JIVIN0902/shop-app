import React, { useCallback, useEffect, useReducer, useState } from "react";
import {
	Alert,
	Platform,
	ScrollView,
	StyleSheet,
	KeyboardAvoidingView,
	View,
	ActivityIndicator,
} from "react-native";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import { useDispatch, useSelector } from "react-redux";
import Colors from "../../../constants/Colors";
import { createProduct, updateProduct } from "../../../store/actions/products";
import CustomHeaderButton from "../../UI/HeaderButton";
import Input from "../../UI/Input";

const FORM_UPDATE = "UPDATE";

const formReducer = (state, action) => {
	if (action.type === FORM_UPDATE) {
		const updatedValues = {
			...state.inputValues,
			[action.input]: action.value,
		};
		const updatedValidities = {
			...state.inputValidities,
			[action.input]: action.isValid,
		};
		let formIsValid = true;
		for (const key in updatedValidities) {
			formIsValid = updatedValidities[key];
		}
		return {
			formIsValid,
			inputValidities: updatedValidities,
			inputValues: updatedValues,
		};
	}
	return state;
};

const EditProductsScreen = (props) => {
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState();
	const prodId = props.route.params?.productId;

	const editedProduct = useSelector((state) =>
		state.products.userProducts.find((prod) => prod.id === prodId)
	);

	const dispatch = useDispatch();

	const [formState, dispatchFormState] = useReducer(formReducer, {
		inputValues: {
			title: editedProduct ? editedProduct.title : "",
			imageUrl: editedProduct ? editedProduct.imageUrl : "",
			description: editedProduct ? editedProduct.description : "",
			price: "",
		},
		inputValidities: {
			title: editedProduct ? true : false,
			imageUrl: editedProduct ? true : false,
			description: editedProduct ? true : false,
			price: editedProduct ? true : false,
		},
		formIsValid: editedProduct ? true : false,
	});

	useEffect(() => {
		if (error) {
			Alert.alert("An error ocurred", error, [{ text: "OK" }]);
		}
	}, [error]);

	const submitHandler = useCallback(async () => {
		if (!formState.formIsValid) {
			Alert.alert("Wrong input", "Please check the errors in the form", [
				{ text: "OK" },
			]);
			return;
		}
		setError(false);
		setIsLoading(true);
		try {
			if (editedProduct) {
				await dispatch(
					updateProduct(
						prodId,
						formState.inputValues.title,
						formState.inputValues.description,
						formState.inputValues.imageUrl
					)
				);
			} else {
				await dispatch(
					createProduct(
						formState.inputValues.title,
						formState.inputValues.description,
						formState.inputValues.imageUrl,
						+formState.inputValues.price
					)
				);
			}
		} catch (err) {
			setError(err.message);
		}
		setIsLoading(false);
		props.navigation.goBack();
	}, [
		dispatch,
		prodId,
		formState.inputValues.title,
		formState.inputValues.description,
		formState.inputValues.imageUrl,
		formState.inputValues.price,
		formState.inputValues.titleValid,
	]);

	useEffect(() => {
		props.navigation.setOptions({
			headerRight: () => (
				<HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
					<Item
						title="Save"
						iconName={
							Platform.OS === "android" ? "md-checkmark" : "ios-checkmark"
						}
						onPress={submitHandler}
					/>
				</HeaderButtons>
			),
		});
	}, [submitHandler]);

	const inputChangeHandler = useCallback(
		(inputIdentifier, inputValue, inputValidity) => {
			dispatchFormState({
				type: FORM_UPDATE,
				value: inputValue,
				isValid: inputValidity,
				input: inputIdentifier,
			});
		},
		[dispatchFormState]
	);

	if (isLoading) {
		return (
			<View style={styles.centered}>
				<ActivityIndicator size="large" color={Colors.primary} />
			</View>
		);
	}

	return (
		<KeyboardAvoidingView
			// style={{ flex: 1 }}
			behavior="padding"
			keyboardVerticalOffset={100}
		>
			<ScrollView>
				<View style={styles.form}>
					<Input
						id="title"
						keyboardType="default"
						label="Title"
						errorText="Please Enter a valid input"
						autoCorrect
						returnKeyType="next"
						onInputChange={inputChangeHandler}
						initialValue={editedProduct ? editedProduct.title : ""}
						initiallyValid={!!editedProduct}
						required
					/>
					<Input
						id="imageUrl"
						label="Image Url"
						keyboardType="default"
						errorText="Please Enter a valid url"
						returnKeyType="next"
						onInputChange={inputChangeHandler}
						initialValue={editedProduct ? editedProduct.imageUrl : ""}
						initiallyValid={!!editedProduct}
						required
					/>
					{editedProduct ? null : (
						<Input
							id="price"
							keyboardType="decimal-pad"
							label="Price"
							onInputChange={inputChangeHandler}
							errorText="Please Enter a valid price"
							required
							min={0.1}
						/>
					)}
					<Input
						id="description"
						keyboardType="default"
						label="Description"
						autoCorrect
						errorText="Please Enter a valid description"
						multiline
						onInputChange={inputChangeHandler}
						numberOfLines={3}
						initialValue={editedProduct ? editedProduct.description : ""}
						initiallyValid={!!editedProduct}
						required
						minLength={5}
					/>
				</View>
			</ScrollView>
		</KeyboardAvoidingView>
	);
};

export const screenOptions = (navData) => {
	const routeParams = navData.route.params ? navData.route.params : {};
	return {
		headerTitle: routeParams.productId ? "Edit Product" : "Add Product",
	};
};

export default EditProductsScreen;

const styles = StyleSheet.create({
	form: {
		margin: 20,
	},
	centered: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
});
