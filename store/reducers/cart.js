import CartItem from "../../models/cart-item";
import { ADD_TO_CART, REMOVE_FROM_CART } from "../actions/cart";
import { ADD_ORDER } from "../actions/orders";
import { DELETE_PRODUCT } from "../actions/products";

const initialState = {
	items: {},
	totalAmount: 0,
};

export default (state = initialState, action) => {
	switch (action.type) {
		case ADD_TO_CART:
			const addedProduct = action.product;
			const prodPrice = addedProduct.price;
			const prodTitle = addedProduct.title;
			const pushToken = addedProduct.pushToken;

			let updatedCartItem;

			if (state.items[addedProduct.id]) {
				updatedCartItem = new CartItem(
					state.items[addedProduct.id].quantity + 1,
					prodPrice,
					prodTitle,
					pushToken,
					state.items[addedProduct.id].sum + prodPrice
				);
			} else {
				updatedCartItem = new CartItem(
					1,
					prodPrice,
					prodTitle,
					pushToken,
					prodPrice
				);
				return {
					...state,
					items: { ...state.items, [addedProduct.id]: updatedCartItem },
					totalAmount: state.totalAmount + prodPrice,
				};
			}
			return {
				...state,
				items: { ...state.items, [addedProduct.id]: updatedCartItem },
				totalAmount: state.totalAmount + prodPrice,
			};

		case REMOVE_FROM_CART:
			const selectedCartItem = state.items[action.pId];
			const currentQty = selectedCartItem.quantity;
			let updatedCartItems;
			if (currentQty > 1) {
				// need to reduce it not erase
				const updatedCartItem = new CartItem(
					selectedCartItem.quantity - 1,
					selectedCartItem.productPrice,
					selectedCartItem.productTitle,
					selectedCartItem.pushToken,
					selectedCartItem.sum - selectedCartItem.productPrice
				);
				updatedCartItems = { ...state.items, [action.pid]: updatedCartItem };
			} else {
				updatedCartItems = { ...state.items };
				delete updatedCartItems[action.pId];
			}
			return {
				...state,
				items: updatedCartItems,
				totalAmount: state.totalAmount - selectedCartItem.productPrice,
			};
		case ADD_ORDER:
			return initialState;
		case DELETE_PRODUCT:
			if (!state.items[action.pId]) {
				return state;
			}
			const updatedItems = { ...state.items };
			const itemTotal = state.items[action.pId].sum;
			delete updatedItems[action.pId];
			return {
				...state,
				items: updatedItems,
				totalAmount: state.totalAmount - itemTotal,
			};
	}
	return state;
};
