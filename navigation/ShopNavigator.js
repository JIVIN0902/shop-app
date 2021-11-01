import { Platform, SafeAreaView, View, Button } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import {
	createDrawerNavigator,
	DrawerItemList,
} from "@react-navigation/drawer";
import Colors from "../constants/Colors";
import ProductDetailsScreen, {
	screenOptions as ProductDetailsScreenOptions,
} from "../components/screens/shop/ProductDetailsScreen";
import ProductsOverviewScreen, {
	ScreenOptions as ProductsOverviewScreenOptions,
} from "../components/screens/shop/ProductsOverviewScreen";
import CartScreen, {
	screenOptions as CartScreenOptions,
} from "../components/screens/shop/CartScreen";
import OrdersScreen, {
	screenOptions as OrdersScreenOptions,
} from "../components/screens/shop/OrdersScreen";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import UserProductsScreen, {
	screenOptions as UserProductsScreenOptions,
} from "../components/screens/user/UserProductsScreen";
import EditProductsScreen, {
	screenOptions as EditProductsScreenOptions,
} from "../components/screens/user/EditProductsScreen";
import { useDispatch } from "react-redux";
import AuthScreen, {
	screenOptions as AuthScreenOptions,
} from "../components/screens/user/AuthScreen";
import { logout } from "../store/actions/auth";

const defaultNavOptions = {
	headerStyle: {
		backgroundColor: Platform.OS === "android" ? Colors.primary : "",
	},
	headerTitleStyle: {
		fontFamily: "open-sans-bold",
	},
	headerBackTitleStyle: {
		fontFamily: "open-sans",
	},
	headerTintColor: Platform.OS === "android" ? "white" : Colors.primary,
};

const ProductsStackNavigator = createStackNavigator();

export const ProductsNavigator = () => {
	return (
		<ProductsStackNavigator.Navigator screenOptions={defaultNavOptions}>
			<ProductsStackNavigator.Screen
				name="ProductsOverview"
				component={ProductsOverviewScreen}
				options={ProductsOverviewScreenOptions}
			/>
			<ProductsStackNavigator.Screen
				name="ProductDetail"
				component={ProductDetailsScreen}
				options={ProductDetailsScreenOptions}
			/>
			<ProductsStackNavigator.Screen
				name="Cart"
				component={CartScreen}
				options={CartScreenOptions}
			/>
		</ProductsStackNavigator.Navigator>
	);
};

const OrdersStackNavigator = createStackNavigator();

export const OrdersNavigator = () => {
	return (
		<OrdersStackNavigator.Navigator screenOptions={defaultNavOptions}>
			<OrdersStackNavigator.Screen
				name="Orders"
				component={OrdersScreen}
				options={OrdersScreenOptions}
			/>
		</OrdersStackNavigator.Navigator>
	);
};

const AdminStackNavigator = createStackNavigator();

export const AdminNavigator = () => {
	return (
		<AdminStackNavigator.Navigator screenOptions={defaultNavOptions}>
			<AdminStackNavigator.Screen
				name="UserProducts"
				component={UserProductsScreen}
				options={UserProductsScreenOptions}
			/>
			<AdminStackNavigator.Screen
				name="EditProduct"
				component={EditProductsScreen}
				options={EditProductsScreenOptions}
			/>
		</AdminStackNavigator.Navigator>
	);
};

const ShopDrawerNavigator = createDrawerNavigator();

export const ShopNavigator = () => {
	const dispatch = useDispatch();
	return (
		<ShopDrawerNavigator.Navigator
			drawerContentOptions={{
				activeTintColor: Colors.primary,
				itemsContainerStyle: {
					marginTop: 20,
				},
			}}
			drawerContent={(props) => {
				return (
					<View style={{ flex: 1, padding: 20 }}>
						<SafeAreaView forceInset={{ top: "always", horizontal: "never" }}>
							<DrawerItemList {...props} />
							<Button
								title="Logout"
								color={Colors.primary}
								onPress={() => {
									dispatch(logout());
								}}
							/>
						</SafeAreaView>
					</View>
				);
			}}
		>
			<ShopDrawerNavigator.Screen
				name="Products"
				component={ProductsNavigator}
				options={{
					drawerIcon: (props) => (
						<Ionicons
							color={props.color}
							size={23}
							name={Platform.OS === "android" ? "md-cart" : "ios-cart"}
						/>
					),
				}}
			/>
			<ShopDrawerNavigator.Screen
				name="Orders"
				component={OrdersNavigator}
				options={{
					drawerIcon: (drawerConfig) => (
						<Ionicons
							size={23}
							color={drawerConfig.tintColor}
							name={Platform.OS === "android" ? "md-list" : "ios-list"}
						/>
					),
				}}
			/>
			<ShopDrawerNavigator.Screen
				name="Admin"
				component={AdminNavigator}
				options={{
					drawerIcon: (props) => (
						<Ionicons
							size={23}
							color={props.color}
							name={Platform.OS === "android" ? "md-cart" : "ios-cart"}
						/>
					),
				}}
			/>
		</ShopDrawerNavigator.Navigator>
	);
};

const AuthStackNavigator = createStackNavigator();

export const AuthNavigator = () => {
	return (
		<AdminStackNavigator.Navigator options={defaultNavOptions}>
			<AuthStackNavigator.Screen
				name="Auth"
				component={AuthScreen}
				options={AuthScreenOptions}
			/>
		</AdminStackNavigator.Navigator>
	);
};
