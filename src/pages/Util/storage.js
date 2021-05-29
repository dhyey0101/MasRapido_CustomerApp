import { AsyncStorage } from "react-native";

export const storage = {
    storeUserDetail: async (userData) => {
        await AsyncStorage.setItem('userid', JSON.stringify(userData.id));
        await AsyncStorage.setItem('name', JSON.stringify(userData.first_name));
        await AsyncStorage.setItem('mobile', userData.mobile);
        await AsyncStorage.setItem('token', userData.token);
        await AsyncStorage.setItem('email', JSON.stringify(userData.email));
        await AsyncStorage.setItem('is_payment_method_save', JSON.stringify(userData.is_payment_method_save));
        await AsyncStorage.setItem('payment_gateway_token', JSON.stringify(userData.payment_gateway_token));
    },
	updatePaymentMethod: async (key) => {
        await AsyncStorage.setItem(key, '1');
    },
	updatePaymentGatewayToken: async (token) => {
        await AsyncStorage.setItem('payment_gateway_token', token);
		await AsyncStorage.setItem('is_payment_method_save', '1');
    },
    getUserDetail: async () => {
        let Token = await AsyncStorage.getItem('token');
    }
}