import React, { useReducer, useEffect } from "react";
import {
	StyleSheet,
	Text,
	Button,
	View,
	ActivityIndicator,
	KeyboardAvoidingView,
	ScrollView,
	Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Colors from "../../../constants/Colors";

import Input from "../../UI/Input";
import { useDispatch } from "react-redux";
import { login, signup } from "../../../store/actions/auth";
import { useCallback } from "react";
import { useState } from "react";

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

const AuthScreen = (props) => {
	const dispatch = useDispatch();

	const [isSignup, setIsSignup] = useState(false);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState();

	const [formState, dispatchFormState] = useReducer(formReducer, {
		inputValues: {
			email: "",
			password: "",
		},
		inputValidities: {
			email: false,
			password: false,
		},
		formIsValid: false,
	});

	useEffect(() => {
		if (error) {
			Alert.alert("An Error ocurred", error, [{ text: "Okay" }]);
		}
	}, [error]);

	const authHandler = async () => {
		let action;
		if (isSignup) {
			action = signup(
				formState.inputValues.email,
				formState.inputValues.password
			);
		} else {
			action = login(
				formState.inputValues.email,
				formState.inputValues.password
			);
		}

		setError(null);
		setLoading(true);
		try {
			await dispatch(action);
			// props.navigation.navigate("Shop");
		} catch (error) {
			setError(error.message);
		}
		setLoading(false);
	};

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

	return (
		<KeyboardAvoidingView
			behavior="padding"
			keyboardVerticalOffset={50}
			style={styles.screen}
		>
			<LinearGradient colors={["#FFEDFF", "#ffe3ff"]} style={styles.gradient}>
				<ScrollView style={styles.authContainer}>
					<Input
						id="email"
						label="Email"
						keyboardType="email-address"
						required
						email
						autoCapitalize="none"
						errorText="Please Enter a valid email address"
						onInputChange={inputChangeHandler}
						initialValue=""
					/>

					<Input
						id="password"
						label="Password"
						keyboardType="default"
						secureTextEntry
						required
						minLength={5}
						autoCapitalize="none"
						errorText="Please Enter a valid password"
						onInputChange={inputChangeHandler}
						initialValue=""
					/>

					<View style={styles.buttonContainer}>
						{loading ? (
							<ActivityIndicator size="small" color={Colors.primary} />
						) : (
							<Button
								title={isSignup ? "Sign Up" : "Login"}
								color={Colors.primary}
								onPress={authHandler}
							/>
						)}
					</View>
					<View style={styles.buttonContainer}>
						<Button
							title={`Switch to ${isSignup ? "Login" : "Sign Up"}`}
							color={Colors.accent}
							onPress={() => {
								setIsSignup((prevState) => !prevState);
							}}
						/>
					</View>
				</ScrollView>
			</LinearGradient>
		</KeyboardAvoidingView>
	);
};

export default AuthScreen;

export const screenOptions = {
	headerTitle: "Authentication",
};

const styles = StyleSheet.create({
	screen: {
		flex: 1,
	},
	authContainer: {
		width: "80%",
		maxHeight: 400,
		marginTop: 120,
		maxWidth: 400,
	},
	gradient: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
	buttonContainer: {
		marginTop: 10,
	},
});
