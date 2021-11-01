import AsyncStorage from "@react-native-async-storage/async-storage";

export const AUTHENTICATE = "AUTHENTICATE";
export const SET_DID_TRY_AL = "SET_DID_TRY_AL";
export const LOGOUT = "LOGOUT";

let timer;

export const setDidTryAl = () => {
	return { type: SET_DID_TRY_AL };
};

export const authenticate = (userId, token, expiryTime) => {
	return async (dispatch) => {
		dispatch(setLogoutTimer(expiryTime));
		dispatch({ type: AUTHENTICATE, userId: userId, token: token });
	};
};

export const signup = (email, password) => {
	return async (dispatch) => {
		const response = await fetch(
			"https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyAL3Pzgzs-e1HZiwfQJAfJMkfi5VgKmsiA",
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					email,
					password,
					returnSecureToken: true,
				}),
			}
		);

		if (!response.ok) {
			const errorResData = await response.json();
			const errorId = errorResData.error.message;

			let message = "Something went wrong";
			if (errorId == "EMAIL_NOT_FOUND") {
				message = "This email was not found";
			}

			throw new Error(message);
		}
		const resData = await response.json();
		dispatch(
			authenticate(
				resData.localId,
				resData.idToken,
				parseInt(resData.expiresIn) * 1000
			)
		);
		// dispatch({ type: SIGNUP, token: resData.idToken, userId: resData.localId });
		const expirationDate = new Date(
			new Date().getTime() + parseInt(resData.expiresIn) * 1000
		);
		saveDataToStorage(resData.idToken, resData.localId, expirationDate);
	};
};

export const login = (email, password) => {
	return async (dispatch) => {
		const response = await fetch(
			"https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyAL3Pzgzs-e1HZiwfQJAfJMkfi5VgKmsiA",
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					email,
					password,
					returnSecureToken: true,
				}),
			}
		);

		if (!response.ok) {
			throw new Error("Something went wrong");
		}
		const resData = await response.json();
		dispatch(
			authenticate(
				resData.localId,
				resData.idToken,
				parseInt(resData.expiresIn) * 1000
			)
		);
		const expirationDate = new Date(
			new Date().getTime() + parseInt(resData.expiresIn) * 1000
		);
		saveDataToStorage(resData.idToken, resData.localId, expirationDate);
	};
};

export const logout = () => {
	clearLogoutTimer();
	AsyncStorage.removeItem("userData");
	return { type: LOGOUT };
};

const clearLogoutTimer = () => {
	if (timer) {
		clearTimeout(timer);
	}
};

const setLogoutTimer = (expirationTime) => {
	return async (dispatch) => {
		timer = setTimeout(() => {
			dispatch(logout());
		}, expirationTime);
	};
};

const saveDataToStorage = (token, userId, expirationDate) => {
	AsyncStorage.setItem(
		"userData",
		JSON.stringify({
			token: token,
			userId: userId,
			expiryDate: expirationDate.toISOString(),
		})
	);
};
