import AsyncStorage from "@react-native-async-storage/async-storage";
import React from "react";
import { useEffect } from "react";
import { StyleSheet, View, ActivityIndicator } from "react-native";

import { useDispatch } from "react-redux";
import Colors from "../../constants/Colors";
import { authenticate, setDidTryAl } from "../../store/actions/auth";

const StartupScreen = (props) => {
	const dispatch = useDispatch();
	useEffect(() => {
		const tryLogin = async () => {
			const userData = await AsyncStorage.getItem("userData");

			if (!userData) {
				// props.navigation.navigate("Auth");
				dispatch(setDidTryAl());
				return;
			}

			const transformedData = JSON.parse(userData);
			const { token, userId, expiryDate } = transformedData;

			const expirationDate = new Date(expiryDate);

			if (expirationDate <= new Date() || !token || !userId) {
				// props.navigation.navigate("Auth");
				dispatch(setDidTryAl());
				return;
			}

			const expirationTime = expirationDate.getTime() - new Date().getTime();

			// props.navigation.navigate("Shop");
			dispatch(authenticate(userId, token));
		};

		tryLogin();
	}, [dispatch]);
	return (
		<View style={styles.screen}>
			<ActivityIndicator size="large" color={Colors.primary} />
		</View>
	);
};

export default StartupScreen;

const styles = StyleSheet.create({
	screen: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
});
