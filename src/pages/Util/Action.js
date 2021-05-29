import { defaultRestClient } from './restclient';
import { LOGIN, CUSTOMERSOCIALLOGIN, 
CHECKMOBILENUMBER,
saveCustomerPaymentMethod,
updateCustomerProfile,
addLocation,
addCustomerFavouriteplace,
getCustomerFavoriteAddressList,
getVehicleTypesWithImage,
calculateOrderCost,
customerordersave,
getcustomeractiveorder,
getOrderDetail,
getcustomerbillinginfo,
saveCustomerReviewForOrder,
getServiceList,
getServiceCost,
saveServiceOrder,
getNotificationList,
handymanAssignNotificationDetail,
getAdminId,
customerOrderCancel,
getChatHistory,
getUserDetail,
saveChatMessage,
getUserProfilePicture,
getUserWalletBalance,
getUserWalletRechargeApprovePending,
getUserCardList,
getWalletHistory,
getOrderDetails,
RechargeWallet,
getServiceTypesWithImage,
getCategoryWiseServiceList,
getServiceCapacity,
getUserConfiguration,
updateUserConfiguration,
getCustomerOrderByDate,
checkMobileNumber
} from './API';

//login action
export const loginAction = (data) => {
    return defaultRestClient.postWithBody(LOGIN, data);
}

//Check user social login
export const customersociallogin = (data) => {
    return defaultRestClient.postWithBodyToken(CUSTOMERSOCIALLOGIN, data);
}

export const getUserDetailAction = (data, Token) => {
    return defaultRestClient.postWithBodyToken(getUserDetail, data, Token);
}

//send sms action
export const sendOTPAction = (mobile, country) => {
    return defaultRestClient.sendOTP(mobile, country);
}  
//resend sms action
export const resendOTPAction = (mobile, country) => {
    return defaultRestClient.resendOTP(mobile, country);
}  

//verify otp and register action
export const verifyOTPAction = (mobile, otp, country) => {
    return defaultRestClient.verifyOTP(mobile,otp, country);
}
// send payment info
export const savePaymentAction = (data, Token) => {
    return defaultRestClient.postWithBodyToken(saveCustomerPaymentMethod, data, Token);
}

export const updatePaymentAction = (data, Token) => {
    return defaultRestClient.postWithBodyToken(updateCustomerProfile, data,Token);
}

export const locationAction = (data, Token) => {
    return defaultRestClient.postWithBodyToken(addLocation, data,Token);
}

export const addCustomerFavouriteplaceAction = (data, Token) => {
    return defaultRestClient.postWithBodyToken(addCustomerFavouriteplace, data,Token);
}

// get customer favorite address location
export const getCustomerFavoriteAddressListAction = (data, Token) => {
    return defaultRestClient.postWithBodyToken(getCustomerFavoriteAddressList, data,Token);
}

// get vehicle type from database
// export const getVehicleTypesListAction = () => {
//     return defaultRestClient.postWithoutBody(getVehicleTypesList);
// }
export const getVehicleTypesWithImageAction = () => {
    return defaultRestClient.postWithoutBody(getVehicleTypesWithImage);
}

// get order cost
export const getOrderCostAction = (data, Token) => {
    return defaultRestClient.postWithBodyToken(calculateOrderCost, data,Token);
}

// save place order 
export const customerordersaveAction = (data, Token) => {
    return defaultRestClient.postWithBodyToken(customerordersave, data,Token);
}
// get customer order 
export const getcustomeractiveorderAction = (data, Token) => {
    return defaultRestClient.postWithBodyToken(getcustomeractiveorder, data,Token);
}

// get customer order details
export const getOrderDetailAction = (data, Token) => {
    return defaultRestClient.postWithBodyToken(getOrderDetail, data,Token);
}

export const getcustomerbillinginfoAction = (data, Token) => {
    return defaultRestClient.postWithBodyToken(getcustomerbillinginfo, data,Token);
}

export const saveCustomerReviewForOrderAction = (data, Token) => {
    return defaultRestClient.postWithBodyToken(saveCustomerReviewForOrder, data,Token);
}

export const getServiceListAction = (Token) => {
    return defaultRestClient.postWithBodyToken(getServiceList,null,Token);
}

// get order cost
export const getServiceCostAction = (data, Token) => {
    return defaultRestClient.postWithBodyToken(getServiceCost, data,Token);
}

export const saveServiceOrderAction = (data, Token) => {
    return defaultRestClient.postWithBodyToken(saveServiceOrder, data,Token);
}

export const getNotificationListAction = (data,Token) => {
    return defaultRestClient.postWithBodyToken(getNotificationList,data,Token);
}

export const handymanAssignNotificationDetailAction = (data,Token) => {
    return defaultRestClient.postWithBodyToken(handymanAssignNotificationDetail,data,Token);
}

export const getAdminIdAction = (data,Token) => {
    return defaultRestClient.postWithBodyToken(getAdminId,data,Token);
}

export const customerOrderCancelAction = (data,Token) => {
    return defaultRestClient.postWithBodyToken(customerOrderCancel,data,Token);
}

// get chat hgistory
export const getChatHistoryAction = (data,Token) => {
    return defaultRestClient.postWithBodyToken(getChatHistory,data,Token);
}

//Save Chat Message
export const saveChatMessageAction = (data, Token) => {
    return defaultRestClient.postWithBodyToken(saveChatMessage, data, Token);
}
//Get Profile
export const getUserProfilePictureAction = (data, Token) => {
    return defaultRestClient.postWithBodyToken(getUserProfilePicture, data, Token);
}

//get profile detail action
export const saveChatImageAction = (data , Token ) => {
    return defaultRestClient.postWithFormData(saveChatMessage, data, Token)
}

//get user wallet balance
export const getUserWalletBalanceAction = (data , Token ) => {
    return defaultRestClient.postWithBodyToken(getUserWalletBalance, data, Token)
}

//get user wallet recharge approve pending
export const getUserWalletRechargeApprovePendingAction = (data , Token ) => {
    return defaultRestClient.postWithBodyToken(getUserWalletRechargeApprovePending, data, Token)
}

export const getUserCardListAction = (data , Token ) => {
    return defaultRestClient.postWithBodyToken(getUserCardList, data, Token)
}
//get wallet history
export const getWalletHistoryAction = (data , Token ) => {
    return defaultRestClient.postWithBodyToken(getWalletHistory, data, Token)
}

//get Order Details
export const getOrderDetailsAction = (data , Token ) => {
    return defaultRestClient.postWithBodyToken(getOrderDetails, data, Token)
}

//post Reacharge Wallet
export const RechargeWalletAction = (data , Token ) => {
    return defaultRestClient.postWithFormData(RechargeWallet, data , Token)
}

export const getServiceTypesWithImageAction = () => {
    return defaultRestClient.postWithBodyToken(getServiceTypesWithImage)
}

export const getCategoryWiseServiceListAction = (data , Token) => {
    return defaultRestClient.postWithBodyToken(getCategoryWiseServiceList, data , Token)
}

export const getServiceCapacityAction = (data , Token) => {
    return defaultRestClient.postWithBodyToken(getServiceCapacity, data , Token)
}

export const getUserConfigurationAction = (data , Token) => {
    return defaultRestClient.postWithBodyToken(getUserConfiguration, data , Token)
}

export const updateUserConfigurationAction = (data , Token) => {
    return defaultRestClient.postWithBodyToken(updateUserConfiguration, data , Token)
}

export const getCustomerOrderByDateAction = (data , Token) => {
    return defaultRestClient.postWithBodyToken(getCustomerOrderByDate, data , Token)
}

//Check user exists or not for social login
export const checkMobileNumberAction = (data) => {
    return defaultRestClient.postWithBody(CHECKMOBILENUMBER, data);
}
