import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import { Provider } from "react-redux";
import { combineReducers, createStore, applyMiddleware } from "redux";
import productsReducer from "./store/reducers/products";
import AppLoading from "expo-app-loading";
import * as Font from "expo-font";
import ReduxThunk from "redux-thunk";
import authReducer from "./store/reducers/auth";
import * as Notifications from "expo-notifications";
// import { composeWithDevTools } from "redux-devtools-extension";
import cartReducer from "./store/reducers/cart";
import ordersReducer from "./store/reducers/orders";
import auth from "./store/reducers/auth";
import AppNavigator from "./navigation/NavigationContainer";

const rootReducer = combineReducers({
	products: productsReducer,
	cart: cartReducer,
	orders: ordersReducer,
	auth: authReducer,
});

const fetchFonts = () => {
	return Font.loadAsync({
		"open-sans": require("./assets/fonts/OpenSans-Regular.ttf"),
		"open-sans-bold": require("./assets/fonts/OpenSans-Bold.ttf"),
	});
};

Notifications.setNotificationHandler({
	handleNotification: async () => {
		return { shouldShowAlert: true };
	},
});

const store = createStore(rootReducer, applyMiddleware(ReduxThunk));

export default function App() {
	const [fontLoaded, setFontLoaded] = useState(false);

	if (!fontLoaded) {
		return (
			<AppLoading
				startAsync={fetchFonts}
				onFinish={() => setFontLoaded(true)}
				onError={(error) => console.log(error)}
			/>
		);
	}

	return (
		<Provider store={store}>
			<AppNavigator />
		</Provider>
	);
}
