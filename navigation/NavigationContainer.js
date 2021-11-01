import { NavigationContainer } from "@react-navigation/native";
import React, { useRef } from "react";
import { useEffect } from "react";
import { NavigationActions } from "react-navigation";
import { useSelector } from "react-redux";
import StartupScreen from "../components/screens/StartupScreen";
import { AuthNavigator, ShopNavigator } from "./ShopNavigator";

const AppNavigator = (props) => {
	const isAuth = useSelector((state) => !!state.auth.token);
	const didTryAutoLogin = useSelector((state) => state.auth.didTryAutoLogin);

	return (
		<NavigationContainer>
			{!isAuth && <ShopNavigator />}
			{isAuth && didTryAutoLogin && <AuthNavigator />}
			{isAuth && !didTryAutoLogin && <StartupScreen />}
		</NavigationContainer>
	);
};

export default AppNavigator;
