import React, { Component, createRef } from "react";
import {
    View,
    KeyboardAvoidingView,
    TouchableOpacity,
    AsyncStorage,
    Image,
    StyleSheet,
    ActivityIndicator,
    Dimensions,
    Platform,
    BackHandler,
    Text,
    TextInput,
    Modal,
    ScrollView,
    Keyboard,
    SafeAreaView
} from "react-native";
import normalize from 'react-native-normalize';
import vehicleicon from './vehicleicon';
import CustomToast from './Toast.js';
import validate from 'validate.js';
import { Dropdown } from 'react-native-material-dropdown-v2';
import { Collapse, CollapseHeader, CollapseBody, AccordionList } from 'accordion-collapse-react-native';
import Popover from 'react-native-popover-view';
import { RadioButton } from 'react-native-paper';
import { t } from '../../../locals';
import MapViewDirections from "react-native-maps-directions";
import MapView, { ProviderPropType, Marker, PROVIDER_GOOGLE, AnimatedRegion } from "react-native-maps";
import { Col, Row } from "react-native-easy-grid";
import { getUserCardListAction, savePaymentAction, customerordersaveAction, getOrderCostAction, getVehicleTypesWithImageAction, getUserWalletBalanceAction } from '../Util/Action.js';
import SwipeButton from 'rn-swipe-button';
import RNPickerSelect from 'react-native-picker-select';
import { storage } from '../Util/storage.js';
import { NavigationEvents } from 'react-navigation';
import DropdownAlert from 'react-native-dropdownalert';
import Pusher from "pusher-js/react-native";


const { width, height } = Dimensions.get('window');
const ASPECT_RATIO = width / height;
const LATITUDE = 23.022236;
const LONGITUDE = 72.547763;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

const GOOGLE_MAPS_APIKEY = (Platform.OS === 'ios') ? "AIzaSyDA8VzkYgIznevJNoGFt_HLxgM2cBRgQd8" : "AIzaSyD6VKrDOOeJgMKKwKpiYFhIA8Udd-7mdlU";

export default class MessagingConfirmation extends React.PureComponent {
    static navigationOptions = ({ navigation }) => {
        return {
            headerShown: false
        };
    };

    constructor(props) {
        super(props);
        this.touchable = createRef();
        this.state = {
            collapsed: false,
            cashBox: 0,
            walletBox: 0,
            userInputCashAmount: '',
            vehiclevalue: '',
            showPopover: false,
            from_location_address: '',
            to_location_address: '',
            additional_location_address: '',
            from_latitude: 0,
            from_longitude: 0,
            to_latitude: 0,
            to_longitude: 0,
            additional_latitude: '',
            additional_longitude: '',
            loader: false,
            cardList: [],
            dataSource: [],
            originLat: '',
            originLong: '',
            destinationLat: '',
            destinationLong: '',
            markers: [],
            angle: 0,
            coordinate: new AnimatedRegion({
                latitude: null,
                longitude: null,
                latitudeDelta: LATITUDE_DELTA,
                longitudeDelta: LONGITUDE_DELTA,
            }),
            driverLocation: {
                latitude: null,
                longitude: null,
            },
            vehicleTypes: [],
            dbVehicleType: '',
            vehicleTypeSelected: 1,
            deliveryCost: [],
            sub_total: '',
            itbms: '',
            distance: '',
            modalPaymentType: false,
            notes_Input: '',
            pickupInstruction: '',
            user_name: '',
            card_number: '',
            month: '01',
            year: 2021,
            cvv: '',
            customerMobile: '',
            customerEmail: '',
            customerPaymentToken: '',
            selectedPaymentMethod: '',
            sliderValue: 0,
            setSliderValue: 0,
            paymentGatewatToken: '',
            IsPaymentMethodSave: 0,
            userToken: '',
            triggerChannelState: 0

        };
    }

    paymentType(modalPaymentType) {
        this.setModalPaymentType(!modalPaymentType);
    }

    setModalPaymentType = (visible) => {

        this.setState({ modalPaymentType: visible });
    }
    async componentDidMount() {
        const { navigation } = this.props;
        this.setState({ loader: true, });
        let userToken = await AsyncStorage.getItem("token");
        this.setState({
            userToken: userToken,
        });

        this._pusherSubscription();
        this.focusListener = navigation.addListener("didFocus", () => {
            var params = this.props.navigation.getParam('data');
            this.getCardList();
            this.getUserWalletBalance();
            this._pusherSubscription();
            this.getCost(this.state.vehicleTypeSelected);

            this.setState({
                from_location_address: params.from_location_address,
                to_location_address: params.to_location_address,
                additional_location_address: params.additional_location_address,
                distance: params.distance,
                to_latitude: Number(params.to_latitude),
                to_longitude: Number(params.to_longitude),
                from_latitude: Number(params.from_latitude),
                from_longitude: Number(params.from_longitude),
                additional_latitude: Number(params.additional_latitude),
                additional_longitude: Number(params.additional_longitude),
                FavLocationA: params.FavLocationA,
                FavLocationB: params.FavLocationB,
                FavLocationC: params.FavLocationC,
                pickupInstruction: params.text,
            });


        });
        this.getVehicleTypesWithImage();
        this.getUserWalletBalance();
        this.updatWalletBalance();
        this.getCardList();
        this.getCost(this.state.vehicleTypeSelected);



        var params = this.props.navigation.getParam('data');

        this.setState({
            from_location_address: params.from_location_address,
            to_location_address: params.to_location_address,
            additional_location_address: params.additional_location_address,
            distance: params.distance,
            to_latitude: params.to_latitude,
            to_longitude: params.to_longitude,
            from_latitude: params.from_latitude,
            from_longitude: params.from_longitude,
            additional_latitude: params.additional_latitude,
            additional_longitude: params.additional_longitude,
            FavLocationA: params.FavLocationA,
            FavLocationB: params.FavLocationB,
            FavLocationC: params.FavLocationC,
            pickupInstruction: params.text,
        });

        let userMobile = await AsyncStorage.getItem("mobile");
        let userEmail = await AsyncStorage.getItem("email");
        let paymentToken = await AsyncStorage.getItem("payment_gateway_token");
        let is_payment_method_save = await AsyncStorage.getItem("is_payment_method_save");

        this.setState({
            customerMobile: userMobile,
            customerEmail: userEmail,
            customerPaymentToken: paymentToken,
            IsPaymentMethodSave: is_payment_method_save
        });



        this.setState({ loader: false });

    }

    async componentWillUnmount() {
        this.focusListener.remove();
    }

    _pusherSubscription() {
        var Token = this.state.userToken;
        Token = "Bearer " + Token;
        // Pusher.logToConsole = true;

        this.pusher = new Pusher("d8eaa3d29440d93e40f2", {
            authEndpoint:
                "https://www.masrapidopty.com/app/api/broadcasting/auth",
            // "http://pushnifty.com/dasinfoau/client/masrapido/api/broadcasting/auth",
            // "http://192.168.1.131/api/broadcasting/auth",
            auth: {
                headers: {
                    Accept: "application/json",
                    Authorization: Token,
                },
            },
            cluster: "ap2",
            // activityTimeout: 6000,
        });

        this.channel = this.pusher.subscribe("private-recharge_approve");
        this.setState({
            triggerChannelState: 1,
        });


    }

    async updatWalletBalance() {
        const userID = await AsyncStorage.getItem("userid");
        let Token = await AsyncStorage.getItem("token");
        Token = "Bearer " + Token;

        this.channel.bind("App\\Events\\WalletRechargeApprove", (data) => {
            
            if (data.user_id == userID) {

                const walletBalance = {
                    user_id: userID,
                };

                getUserWalletBalanceAction(walletBalance, Token).then((responseJson) => {
                    if (responseJson.isError == false) {
                        this.setState({
                            dataSource: responseJson.result,
                        });
                        // console.log(this.state.dataSource)
                    } else {
                        this.refs.defaultToastBottomWithDifferentColor.ShowToastFunction(
                            responseJson.message
                        );
                        // this.dropdown.alertWithType('error', 'Error', responseJson.message);

                        // alert(responseJson.message);
                    }
                });
            }
        })
    }

    async getCardList() {
        this.setState({ loader: true, });
        const userID = await AsyncStorage.getItem("userid");
        let Token = await AsyncStorage.getItem("token");

        Token = "Bearer " + Token;

        const CardList = {
            user_id: userID,
        };

        getUserCardListAction(CardList, Token).then((responseJson) => {
            if (responseJson.isError == false) {
                this.setState({
                    cardList: responseJson.result,
                    loader: false,
                });
                // console.log(this.state.cardList)
            } else {
                this.refs.defaultToastBottomWithDifferentColor.ShowToastFunction(
                    responseJson.message
                );
                // this.dropdown.alertWithType('error', 'Error', responseJson.message);

                // alert(responseJson.message);
                this.setState({ loader: false });
            }
        });
    }

    toggleDrawer = ({ navigation }) => {
        this.props.navigation.toggleDrawer();
    };

    _onBlurr = () => {
        BackHandler.removeEventListener('hardwareBackPress',
            this._handleBackButtonClick);
    }

    _onFocus = () => {
        BackHandler.addEventListener('hardwareBackPress',
            this._handleBackButtonClick);
    }

    _handleBackButtonClick = () => this.props.navigation.navigate('location')

    async getVehicleTypesWithImage() {
        this.setState({ loader: true });
        let Token = await AsyncStorage.getItem("token");

        Token = "Bearer " + Token;

        getVehicleTypesWithImageAction(Token).then((responseJson) => {

            if (responseJson.isError == false) {
                this.setState({
                    vehicleTypes: responseJson.result,
                    loader: false,

                });

            } else {
                alert(responseJson.message);
                this.setState({ loader: false });

            }
        });
    }

    async getCost(vehicleTypeSelected) {
        // Get Order Cost
        this.setState({ showPopover: false })
        let Token = await AsyncStorage.getItem("token");

        Token = "Bearer " + Token;
        const OrderData = {
            vehicle_type: vehicleTypeSelected,
            kilometers: this.state.distance,
        };
        // console.log(this.state.vehicleTypeSelected)
        // console.log(this.state.distance)

        this.setState({
            vehicleTypeSelected: vehicleTypeSelected,
        })
        // console.log(this.state.vehicleTypeSelected)
        // this.setState({ loader: true });
        var response = getOrderCostAction(OrderData, Token).then(
            function (responseJson) {
                // console.log(responseJson);
                if (responseJson.isError == false) {
                    this.setState({ deliveryCost: responseJson.result });
                } else {
                    console.log(responseJson.message);
                }
            }.bind(this)
        );
    }

    async getUserWalletBalance() {
        this.setState({ loader: true, });
        const userID = await AsyncStorage.getItem("userid");
        let Token = await AsyncStorage.getItem("token");
        Token = "Bearer " + Token;

        const walletBalance = {
            user_id: userID,
        };

        getUserWalletBalanceAction(walletBalance, Token).then((responseJson) => {
            if (responseJson.isError == false) {
                this.setState({
                    dataSource: responseJson.result,
                    loader: false,
                });
                // console.log(this.state.dataSource)
            } else {
                this.refs.defaultToastBottomWithDifferentColor.ShowToastFunction(
                    responseJson.message
                );
                // this.dropdown.alertWithType('error', 'Error', responseJson.message);

                // alert(responseJson.message);
                this.setState({ loader: false });
            }
        });

        let userMobile = await AsyncStorage.getItem("mobile");
        let userEmail = await AsyncStorage.getItem("email");
        let paymentToken = await AsyncStorage.getItem("payment_gateway_token");
        let is_payment_method_save = await AsyncStorage.getItem("is_payment_method_save");

        this.setState({
            customerMobile: userMobile,
            customerEmail: userEmail,
            customerPaymentToken: paymentToken,
            IsPaymentMethodSave: is_payment_method_save
        });
    }
    showCashTextbox() {
        // this.updateFund();
        if (this.state.cashBox == 0) {
            this.setState({
                cashBox: 1,
                collapsed: false,
                paymentGatewatToken: '',
                walletBox: 0,

            });

        }
    }
    showWalletTextbox() {
        // this.updateFund();
        if (this.state.walletBox == 0) {
            this.setState({
                walletBox: 1,
                collapsed: false,
                paymentGatewatToken: '',
                cashBox: 0,
            });
        }
    }

    async Save() {
        const { navigate } = this.props.navigation;
        const { modalPaymentType, deliveryCost, userInputCashAmount, cashBox, walletBox, dataSource } = this.state;

        if (cashBox == 1) {
            this.setState({ selectedPaymentMethod: "cash" });
            var constraints = {
                userInputCashAmount: {

                    format: {
                        pattern: "[0-9]+",
                        flags: "i",
                        message: "^ " + t("Please enter a numeric value")
                    },
                },
            };
            Keyboard.dismiss();
            const result = validate({ userInputCashAmount: this.state.userInputCashAmount }, constraints);

            if (result) {

                if (result.userInputCashAmount) {
                    this.refs.defaultToastBottomWithDifferentColor.ShowToastFunction(result.userInputCashAmount);
                    this.setState({ 
                        selectedPaymentMethod: "",
                    });
                    // this.dropdown.alertWithType('error', 'Error', result.userInputCashAmount);
                    // alert("card number")
                    return false;
                }
            }

            if (parseFloat(userInputCashAmount) < parseFloat(deliveryCost.cost)) {
                this.refs.defaultToastBottomWithDifferentColor.ShowToastFunction(t("Cash amount graterthan order amount"));
                this.setState({ 
                    selectedPaymentMethod: "",
                });
                // this.dropdown.alertWithType('error', 'Error', "Cash amount graterthan order amount");
                return false;
            }

            if (!result) {
                this.setState({
                    modalPaymentType: false 
                });
            }

        } else if (walletBox == 1) {
            this.setState({ selectedPaymentMethod: "wallet" });
            if (!deliveryCost.cost) {
                this.refs.defaultToastBottomWithDifferentColor.ShowToastFunction(t("Please select vehicle type"));
                // this.dropdown.alertWithType('error', 'Error', "Please select vehicle type.");
                this.setState({ selectedPaymentMethod: "" });
                this.setState({ walletBox: 0 });
            } else {
                if (parseFloat(dataSource.balance) < parseFloat(deliveryCost.cost)) {
                    this.refs.defaultToastBottomWithDifferentColor.ShowToastFunction(t("The amount in the wallet is not enough"));
                    // this.dropdown.alertWithType('error', 'Error', "Wallet amount not sufficient");
                    this.setState({ selectedPaymentMethod: "" });
                    this.setState({ walletBox: 0 });
                } else {
                    this.setState({ modalPaymentType: false });
                }
            }

        } else {
            // this.setState({ selectedPaymentMethod: "card" });
            if (this.state.IsPaymentMethodSave == 1) {
                if (this.state.paymentGatewatToken == "") {
                    this.refs.defaultToastBottomWithDifferentColor.ShowToastFunction(t("Please select card"));
                    // this.dropdown.alertWithType('error', 'Error', "Please select card");
                    this.setState({ selectedPaymentMethod: "" });
                    return false;
                } else {
                    this.setState({
                        selectedPaymentMethod: "card",
                        modalPaymentType: false
                    });
                }
            } else {
                var constraints = {

                    user_name: {
                        presence: {
                            allowEmpty: false,
                            message: "^ " + t("Name required")
                            // message: "^ name required"
                        },
                        format: {
                            pattern: "[A-Za-z ]+",
                            flags: "i",
                            message: "^ " + t("only characters")
                            // message: "^ only characters"
                        }
                    },

                    card_number: {
                        presence: {
                            allowEmpty: true,
                            message: "^ " + t("Card number required")
                            // message: "^ Card number required"
                        },
                        format: {
                            pattern: "[0-9]{16}",
                            flags: "i",
                            message: "^ " + t("16-digit card number is required")
                        },
                    },
                    month: {
                        presence: {
                            allowEmpty: false,
                            message: "^ " + t("Month is required")
                            // message: "^ Month is required"
                        },
                    },
                    year: {
                        presence: {
                            allowEmpty: false,
                            message: "^ " + t("Year required")
                            // message: "^ Year is required"
                        },
                    },
                    cvv: {
                        presence: {
                            allowEmpty: true,
                            message: "^ " + t("CVV required")
                            // message: "^ cvv required"
                        },
                        format: {
                            pattern: "[0-9]{3}",
                            flags: "i",
                            // message: "^ 3 digit cvv required."
                            message: "^ " + t("3 digit cvv is required")
                        },
                    }
                };
                Keyboard.dismiss();
                const result = validate({ user_name: this.state.user_name, card_number: this.state.card_number, month: this.state.month, year: this.state.year, cvv: this.state.cvv }, constraints);

                if (result) {

                    if (this.state.user_name == '' && this.state.card_number == '' && this.state.month == '' && this.state.year == '' && this.state.cvv == '') {
                        this.refs.defaultToastBottomWithDifferentColor.ShowToastFunction(t("Select payment type"));
                        // this.dropdown.alertWithType('error', 'Error', "Select payment type");
                        // alert("user_name")
                        return false;
                    }
                    if (result.user_name) {
                        this.refs.defaultToastBottomWithDifferentColor.ShowToastFunction(result.user_name);
                        // this.dropdown.alertWithType('error', 'Error', (result.user_name));
                        // alert("user_name")
                        return false;
                    }
                    if (result.card_number) {
                        this.refs.defaultToastBottomWithDifferentColor.ShowToastFunction(result.card_number);
                        // this.dropdown.alertWithType('error', 'Error', (result.card_number));

                        // alert("card number")
                        return false;
                    }

                    if (result.month) {
                        this.refs.defaultToastBottomWithDifferentColor.ShowToastFunction(result.month);
                        // this.dropdown.alertWithType('error', 'Error', (result.month));

                        // alert("month")
                        return false;
                    }
                    if (result.year) {
                        this.refs.defaultToastBottomWithDifferentColor.ShowToastFunction(result.year);
                        // this.dropdown.alertWithType('error', 'Error', (result.year));
                        // alert("year")
                        return false;
                    }
                    if (result.cvv) {
                        this.refs.defaultToastBottomWithDifferentColor.ShowToastFunction(result.cvv);
                        // this.dropdown.alertWithType('error', 'Error', (result.cvv));
                        // alert("cvv")
                        return false;
                    }

                }
                if (!result) {
                    this.setState({ selectedPaymentMethod: "card" });
                    this.setState({ modalPaymentType: false, loader: true });
                    let customer_id = await AsyncStorage.getItem('userid');
                    let Token = await AsyncStorage.getItem('token');
                    Token = 'Bearer ' + Token;

                    var urlConfig = "https://sandbox.paguelofacil.com/rest/processTx/AUTH_CAPTURE";
                    // var urlConfig = "https://sandbox.paguelofacil.com/rest/processTx/RECURRENT";
                    var cclw = '3629CB6D2FBDAEF6EBE7FBBC9E5806F8C83E13B216B3A411F946B2658A892CD7075A9D76CE2CAEF46BE4E25EA11616AFFC2E4E08FB2FD8E89AB47C7DBC8242B2';
                    // var sub_total = this.state.sub_total;//El monto o valor total de la transacción a realizar. NO PONER
                    // var taxAmount = this.state.itbms;//El monto o valor total de la transacción a realizar. NO PONER
                    // var amount = parseFloat(sub_total) + parseFloat(taxAmount);
                    var description = 'First transaction to store card details';//MaxLength:150 ;Es la descripción o el motivo de la transacción en proceso
                    var credit_card = this.state.card_number;
                    var carType = 'VISA';
                    var credit_card_month = this.state.month;//Mes de expiración de la tarjeta, siempre 2 dígitos
                    var credit_card_year = this.state.year;//Numeric Ej.:02 Año de expiración de la tarjeta.
                    var credit_card_cvc = this.state.cvv;//Código de Seguridad de la tarjeta Numeric MaxLength:3

                    var name = this.state.user_name;//String MaxLength:25 Nombre del tarjeta habiente
                    var lastname = this.state.user_name;//String MaxLength:25 Apellido del Tarjeta habiente
                    var email = JSON.parse(this.state.customerEmail);//String MaxLength:100 Email del
                    var address = 'testing new address';//String MaxLength:100 Dirección del Tarjeta
                    var phone = this.state.customerMobile;//Numeric MaxLength:16 Teléfono del Tarjeta habiente

                    // First transaction to store customer card details
                    var transactionData = {
                        cclw: cclw,
                        amount: 0.1,
                        taxAmount: 0,
                        email: email,
                        phone: phone,
                        address: address,
                        concept: description,
                        description: description,
                        lang: 'EN', //EN 
                        cardInformation: {
                            cardNumber: credit_card,
                            expMonth: credit_card_month,
                            expYear: credit_card_year,
                            cvv: credit_card_cvc,
                            firstName: name,
                            lastName: lastname,
                            cardType: carType,
                        }
                    }
                    fetch(urlConfig, {
                        method: "POST",
                        headers: {
                            'Content-Type': 'application/json',
                            'authorization': 'brEyQRSzMm2UwQa5v0NsobRa3U8nH5xT|DIRtMzmjvSaffmnfTuRE2NQjy'
                        },
                        body: JSON.stringify(transactionData)
                    })
                        .then((response) => response.json())
                        .then((responseJson) => {
                            if (responseJson.success == true) {
                                // Save customer payment gateway token
                                var transactionID = responseJson.data.codOper;
                                var card_type = responseJson.data.cardType;
                                this.setState({ paymentGatewatToken: responseJson.data.codOper })
                                storage.updatePaymentGatewayToken(responseJson.data.codOper).then((data) => {
                                    var refundUrl = "https://sandbox.paguelofacil.com/rest/processTx/REVERSE_CAPTURE";
                                    var refundData = {
                                        cclw: cclw,
                                        amount: 0.1,
                                        description: "Refund",
                                        codOper: responseJson.data.codOper,
                                        lang: 'EN', //EN
                                    }

                                    fetch(refundUrl, {
                                        method: "POST",
                                        headers: {
                                            'Content-Type': 'application/json',
                                            'authorization': 'brEyQRSzMm2UwQa5v0NsobRa3U8nH5xT|DIRtMzmjvSaffmnfTuRE2NQjy'
                                        },
                                        body: JSON.stringify(refundData)
                                    })
                                        .then((response) => response.json())
                                        .then((responseJson) => {
                                            // console.log(responseJson)
                                            this.setState({ modalPaymentType: false })
                                        })
                                        .catch((error) => {
                                            console.log(error);
                                        })


                                    // Refund 0.1 dollar to customer

                                    var cardSaveData = {
                                        customer_id: customer_id,
                                        method_name: this.state.user_name,
                                        card_number: this.state.card_number,
                                        year: this.state.year,
                                        month: this.state.month,
                                        cvv: this.state.cvv,
                                        transaction_id: transactionID,
                                        card_type: card_type,
                                    }
                                    // console.log(cardSaveData)
                                    this.setState({ loader: true });
                                    var response = savePaymentAction(cardSaveData, Token).then(function (responseJson) {
                                        // console.log(responseJson)
                                        if (responseJson.isError == false) {
                                            this.setState({ loader: false });
                                            this.setState({ modalPaymentType: false });
                                            // navigate('OrderList');
                                        } else {
                                            this.setState({ loader: false });
                                            this.refs.defaultToastBottomWithDifferentColor.ShowToastFunction(responseJson.message);
                                            // this.dropdown.alertWithType('error', 'Error', (responseJson.message));

                                        }
                                    }.bind(this));
                                })
                                    .catch((err) => {
                                        console.log(err)
                                    });
                            } else {
                                this.setState({
                                    loader: false,
                                    selectedPaymentMethod: "",
                                    user_name: '',
                                    card_number: '',
                                    year: '',
                                    month: '',
                                    cvv: '',
                                    transactionID: '',
                                    card_type: '',

                                })
                                // this.refs.defaultToastBottomWithDifferentColor.ShowToastFunction(responseJson.message);
                                this.dropdown.alertWithType('error', 'Error', (responseJson.message));
                                // console.log(responseJson.message)
                            }
                        })
                        .catch((error) => {
                            console.log(error);
                        })
                }
            }
        }

    }

    async confirmOrder() {

        const { navigate } = this.props.navigation;
        const { deliveryCost, userInputCashAmount, IsPaymentMethodSave, paymentGatewatToken } = this.state;
        const amount = userInputCashAmount - deliveryCost.cost;

        var constraints = {
            vehicleTypeSelected: {
                presence: {
                    allowEmpty: false,
                    message: "^" + t("Select Vehicle Type")
                },
            },
            selectedPaymentMethod: {
                presence: {
                    allowEmpty: false,
                    message: "^" + t("Select payment type")
                },
            }
        };

        const result = validate({ vehicleTypeSelected: this.state.vehicleTypeSelected, selectedPaymentMethod: this.state.selectedPaymentMethod }, constraints);

        if (result) {
            if (result.vehicleTypeSelected) {
                // this.refs.defaultToastBottomWithDifferentColor.ShowToastFunction(result.vehicleTypeSelected);
                this.dropdown.alertWithType('error', 'Error', result.vehicleTypeSelected);
                return false;
            }
            if (result.selectedPaymentMethod) {
                // this.refs.defaultToastBottomWithDifferentColor.ShowToastFunction(result.selectedPaymentMethod);
                this.dropdown.alertWithType('error', 'Error', result.selectedPaymentMethod);

                return false;
            }
        }

        // if (!result) {
        this.setState({ loader: true });
        let customer_id = await AsyncStorage.getItem('userid');
        const confirmOrderData = {
            customer_id: customer_id,
            service_type: this.state.vehicleTypeSelected,
            fromLocationText: this.state.from_location_address,
            destinationLocationText: this.state.to_location_address,
            cpointLocationText: this.state.additional_location_address,
            from_latitude: this.state.from_latitude,
            from_longitude: this.state.from_longitude,
            destination_latitude: this.state.to_latitude,
            destination_longitude: this.state.to_longitude,
            cpoint_latitude: this.state.additional_latitude,
            cpoint_longitude: this.state.additional_longitude,
            FavLocationA: this.state.FavLocationA,
            FavLocationB: this.state.FavLocationB,
            FavLocationC: this.state.FavLocationC,
            notes: this.state.notes_Input,
            pickupInstruction: this.state.pickupInstruction,
            cost: deliveryCost.sub_total,
            change_amount: amount,
            user_given_cash: this.state.userInputCashAmount,
            total: deliveryCost.cost,
            tax: deliveryCost.itbms,
            paymentType: this.state.selectedPaymentMethod,
            paymentGatewatToken: paymentGatewatToken,
        }
        // console.log(confirmOrderData)
        let Token = await AsyncStorage.getItem('token');
        Token = 'Bearer ' + Token;
        this.setState({ loader: true });
        var response = customerordersaveAction(confirmOrderData, Token).then(function (responseJson) {
            // console.log(responseJson)
            if (responseJson.isError == false) {
                this.setState({ loader: false });
                // navigate('OrderStatus', {order_id: order_id});
                navigate('OrderList');
            } else {
                // console.log(responseJson.message);
                this.setState({ loader: false });
                // this.refs.defaultToastBottomWithDifferentColor.ShowToastFunction(responseJson.message);
                this.dropdown.alertWithType('error', 'Error', responseJson.message);
            }
        }.bind(this));
        // }
    }

    render() {
        const { navigate } = this.props.navigation;
        let angle = this.state.angle || 0;
        const { collapsed, loader, paymentGatewatToken, IsPaymentMethodSave, cardList, user_name, card_number, month, year, cvv, modalPaymentType, dataSource, cashBox, walletBox, userInputCashAmount, deliveryCost, notes_Input } = this.state;
        const origin = { latitude: parseFloat(this.state.from_latitude), longitude: parseFloat(this.state.from_longitude) };
        const destination = { latitude: parseFloat(this.state.to_latitude), longitude: parseFloat(this.state.to_longitude) };
        const additionalPosition = { latitude: parseFloat(this.state.additional_latitude), longitude: parseFloat(this.state.additional_longitude) };

        let amount = userInputCashAmount - deliveryCost.cost;

        const swipeButtonIcon = () => (
            // <Icon name="facebook" color="#3b5998" size={30} />
            <Image
                source={require("../../images/Scooter-New.png")}
                style={{ width: 40, height: 40 }}
            />
        );
        if (!loader) {
            return (
                <View style={styles.container}>
                    <NavigationEvents
                        onWillFocus={this._onFocus}
                        onWillBlur={this._onBlurr}
                    />
                    <KeyboardAvoidingView
                        style={{ flex: 1 }}
                        behavior={Platform.OS === "ios" ? "height" : "padding"}
                    >
                        <Row style={styles.Navebar} >
                            <Col style={styles.NaveBackArrowCol}>
                                {/* <TouchableOpacity onPress={() => navigate('OrderLocation')} > */}
                                <TouchableOpacity onPress={() => navigate('Delivery')} >
                                    <Image source={require('../../images/Back-Arrow.png')} style={styles.BackArrow} />
                                </TouchableOpacity>
                            </Col>
                            <Col style={styles.NaveTitleCol}>
                                <Text style={{ fontFamily: "Inter-Black", fontSize: 18 }}>{t('Message confirmation')}</Text>
                            </Col>
                            <Col style={styles.MenuCol}>
                                <TouchableOpacity onPress={this.toggleDrawer.bind(this)}>
                                    <Image source={require('../../images/Menu.png')} style={styles.Menu} />
                                </TouchableOpacity>
                            </Col>
                        </Row>
                        <MapView
                            style={styles.mapStyle}
                            provider={this.props.provider}
                            // waypoints={[additionalPosition]}
                            //   initialRegion={origin}
                            initialRegion={{
                                latitude: Number(this.state.from_latitude),
                                longitude: Number(this.state.from_longitude),
                                latitudeDelta: 0.0922,
                                longitudeDelta: 0.0421,
                            }}
                            pitchEnabled={true}
                            showsCompass={true}
                            showsBuildings={true}
                            ref={(map) => { this.mapView = map; }}
                            zoomEnabled={true}
                        >

                            {/* {angle == -1  ? (
            <Marker.Animated 
                key='A'
                ref={(marker)=> {
                  this.marker = marker;
                }}
                // tracksViewChanges={false}

                coordinate={this.state.coordinate} 
                style={{ transform: [{ rotate: `${angle}deg` }] }}
              >
                < Image source ={require("../../images/Radio-btn.png")} style={{ width : 35, height : 35 }}  />
            </Marker.Animated>
          ) : (
            <Marker.Animated 
                key='A'
                ref={(marker)=> {
                  this.marker = marker;
                }}
                // tracksViewChanges={false}

                coordinate={this.state.coordinate} 
                style={{ transform: [{ rotate: `${angle}deg` }] }}
              >
                < Image source ={require("../../images/scooter.png")} style={{ width : 50, height : 60 }}  />
            </Marker.Animated>
          )} */}


                            {/* this.state.markers.map((marker) => (
            <Marker.Animated 
              key='A'
              coordinate={marker.coords} 
              style={{ transform: [{ rotate: `${angle}deg` }] }}

              draggable
              onDragEnd={(e) => {this.onMarkerDragEnd(e.nativeEvent.coordinate, 'A')}}
                            >
              < Image source ={require("../../images/Temp-Bike2.png")} style={{ width : 50, height : 120 }}  />
            </Marker.Animated>
          )) */}

                            <Marker
                                // coordinate={origin}
                                coordinate={{
                                    latitude: Number(this.state.from_latitude),
                                    longitude: Number(this.state.from_longitude),
                                }}
                                tracksViewChanges={false}
                            >
                                <Image
                                    source={require("../../images/Location-A.png")}
                                    style={{ width: 50, height: 50 }}
                                />
                            </Marker>
                            <Marker
                                // coordinate={destination}
                                coordinate={{
                                    latitude: Number(this.state.to_latitude),
                                    longitude: Number(this.state.to_longitude),
                                }}
                                tracksViewChanges={false}

                            >
                                <Image
                                    source={require("../../images/Location-B.png")}
                                    style={{ width: 40, height: 40 }}
                                />
                            </Marker>

                            <Marker
                                // coordinate={destination}
                                coordinate={{
                                    latitude: Number(this.state.additional_latitude),
                                    longitude: Number(this.state.additional_longitude),
                                }}
                                tracksViewChanges={false}

                            >
                                <Image
                                    source={require("../../images/Location-C.png")}
                                    style={{ width: 40, height: 40 }}
                                />
                            </Marker>
                            {(origin.latitude) ?
                                (<MapViewDirections
                                    origin={(additionalPosition.latitude) ? additionalPosition : destination}
                                    resetOnChange={false}
                                    waypoints={[destination]}
                                    destination={origin}
                                    apikey={GOOGLE_MAPS_APIKEY}
                                    strokeColor="#ee3c48" //red color
                                    strokeWidth={5}
                                    optimizeWaypoints={true}
                                    // onStart={(params) => { }}
                                    onReady={(result) => {
                                        this.mapView.fitToCoordinates(result.coordinates, {
                                            edgePadding: {
                                                right: width / 20,
                                                bottom: height / 10,
                                                left: width / 20,
                                                top: height / 10,
                                            },
                                        });
                                    }}
                                    onError={(errorMessage) => {
                                        // console.log("GOT AN ERROR");
                                    }}
                                />) : <View></View>}

                        </MapView>
                        <Col style={styles.Accept}>


                            <Row style={{ marginLeft: '10%', marginTop: '5%', marginRight: '10%' }}>
                                <Col style={{ width: '20%' }}>
                                    <Text style={{ color: '#1989c0', fontFamily: "Inter-Black", fontSize: 12 }}>{t("Charges for Messenger:")}</Text>
                                </Col>
                                <Col style={{ alignItems: 'center' }}>
                                    <Text style={{ fontFamily: "Inter-Black", fontSize: 20 }}>{deliveryCost.currency_symbol} {deliveryCost.cost}</Text>
                                    <Text style={{ fontFamily: "Inter-Black", fontSize: 10, color: "#b3b3b3" }}>({this.state.distance} {t('estimated kms')})</Text>
                                </Col>
                                <Col style={{ width: '20%' }}></Col>
                            </Row>
                            <Row style={{ marginLeft: '20%', marginRight: '20%', marginTop: '3%' }}>
                                <Col >

                                    {/* <Col > */}
                                    <TouchableOpacity ref={this.touchable} onPress={() => this.setState({ showPopover: true })}>
                                        <Col style={{ backgroundColor: '#f2f2f2', borderRadius: 20, alignItems: 'center', justifyContent: 'center', width: 75, height: 50, }}>
                                            {this.state.vehicleTypeSelected == 1 ? (
                                                <View>
                                                    <Image source={require('../../images/Scooter-New.png')} style={styles.ScooterNew} />

                                                </View>
                                            ) : (
                                                    <View>

                                                    </View>
                                                )}
                                            {this.state.vehicleTypeSelected == 2 ? (
                                                <View>
                                                    <Image source={require('../../images/vehicleicon/Car.png')} style={styles.ScooterNew} />

                                                </View>
                                            ) : (
                                                    <View>

                                                    </View>
                                                )}
                                            {this.state.vehicleTypeSelected == 3 ? (
                                                <View>
                                                    <Image source={require('../../images/vehicleicon/Geep.png')} style={styles.ScooterNew} />

                                                </View>
                                            ) : (
                                                    <View>

                                                    </View>
                                                )}
                                            {this.state.vehicleTypeSelected == 4 ? (
                                                <View>
                                                    <Image source={require('../../images/vehicleicon/Truck.png')} style={styles.ScooterNew} />

                                                </View>
                                            ) : (
                                                    <View>

                                                    </View>
                                                )}

                                        </Col>
                                    </TouchableOpacity>
                                    <Popover
                                        from={this.touchable}
                                        placement='top'
                                        isVisible={this.state.showPopover}
                                        popoverStyle={{ borderRadius: 30, width: '40%', paddingBottom: 10, paddingTop: 10 }}
                                        onRequestClose={() => this.setState({ showPopover: false })}

                                    >
                                        <RadioButton.Group
                                            // onValueChange={newvehiclevalue => this.setState({ vehicleTypeSelected: newvehiclevalue })}
                                            onValueChange={newvehiclevalue => this.getCost(newvehiclevalue)}
                                            value={this.state.vehicleTypeSelected}

                                        >
                                            {/* {vehicleTypes.map(({ item }, i) => ( */}
                                            {this.state.vehicleTypes.map(((item) => (
                                                <TouchableOpacity key={item.id} onPress={() => this.getCost(item.id)} >
                                                    <View style={{ flexDirection: 'row', }}>
                                                        {/* <ScrollView> */}
                                                        <Row style={{ marginLeft: 25 }}>
                                                            <Image source={vehicleicon[item.type]} style={styles.ScooterNew} />
                                                            {/* <Text>{item.type}</Text>  */}
                                                        </Row>
                                                        <Row style={styles.radio}>
                                                            <RadioButton value={item.id} />
                                                            {/* </ScrollView> */}
                                                        </Row>
                                                    </View>
                                                </TouchableOpacity>
                                            )))}
                                        </RadioButton.Group>
                                    </Popover>
                                    <Col style={{ width: '70%', marginTop: 5 }}>
                                        <Text style={{ textAlign: 'center', fontFamily: "Inter-Black" }}>{t('Vehicle Type')}</Text>
                                    </Col>

                                </Col>
                                <Col >
                                    <TouchableOpacity onPress={() => {
                                        this.setModalPaymentType(true);
                                    }}>
                                        <Col style={{ backgroundColor: '#f2f2f2', borderRadius: 20, alignItems: 'center', justifyContent: 'center', width: 75, height: 50, marginLeft: '30%' }}>
                                            <Image source={require('../../images/Payment.png')} style={styles.ScooterNew} />
                                        </Col>
                                    </TouchableOpacity>
                                    <Col >
                                        <Text style={{ textAlign: 'center', fontFamily: "Inter-Black", marginLeft: '30%', marginTop: 5 }}>{t('Method of payment')}</Text>
                                    </Col>
                                    <Modal
                                        animationType="slide"
                                        transparent={true}
                                        visible={modalPaymentType}
                                        onRequestClose={() => {
                                            // navigate('LocationScreen')
                                        }}
                                    >

                                        <View style={styles.ModalCenteredView}>
                                            <View style={styles.SModalView}>
                                                <ScrollView showsVerticalScrollIndicator={false}>
                                                    <Row style={styles.CancelNavebar2}>
                                                        <Col style={{ width: "20%" }}></Col>
                                                        <Col style={{ alignItems: 'center', marginTop: 10, }}>
                                                            <Text style={styles.ModalTextRow}>{t('Select your payment method')}</Text>
                                                        </Col>
                                                        <TouchableOpacity onPress={() => { this.setModalPaymentType(!modalPaymentType); }} style={{ width: "20%", alignItems: 'flex-end', paddingRight: 20 }}>
                                                            <Col>
                                                                <Text style={styles.popupCrossTextIcon}>X</Text>
                                                                {/* <Image source={require('../../images/Close.png')} style={styles.Close} /> */}
                                                            </Col>
                                                        </TouchableOpacity>
                                                    </Row>
                                                    {IsPaymentMethodSave == 1 ? (
                                                        <View>
                                                            <Col style={styles.Accordion2}>
                                                                <Row style={styles.ModalNotes}>
                                                                    <Col style={{ justifyContent: 'center', width: "20%", }}>
                                                                        <Image source={require('../../images/card.png')} style={styles.CardIcon} />
                                                                    </Col>
                                                                    <Col>
                                                                        <Dropdown
                                                                            style={{ height: 35, backgroundColor: "#fff", borderRadius: 20, }}
                                                                            inputContainerStyle={{ borderBottomColor: 'transparent' }}
                                                                            placeholder={t('Select card')}
                                                                            placeholderTextColor={'#8f8f8f'}
                                                                            // tintColor={'#000000'}
                                                                            activityTintColor={'red'}
                                                                            valueExtractor={({ value }) => value}
                                                                            value={this.state.paymentGatewatToken}
                                                                            onChangeText={(value) => { this.setState({ paymentGatewatToken: value, walletBox: 0, cashBox: 0, selectedPaymentMethod: 'card', userInputCashAmount: '', amount: 0.00 }) }}
                                                                            handler={(selection, row) => this.setState({ text: data[selection][row] })}
                                                                            data={cardList}
                                                                        >
                                                                        </Dropdown>
                                                                    </Col>
                                                                    <Col style={{ alignItems: 'flex-end', justifyContent: 'center', width: "10%" }}>
                                                                        {/* <Image source={require('../../images/Blue-Arrow.png')} style={styles.DownArrow} /> */}
                                                                    </Col>
                                                                </Row>
                                                            </Col>
                                                        </View>
                                                    ) : (
                                                            <View>
                                                                <Collapse style={styles.Accordion1}
                                                                    isCollapsed={this.state.collapsed}
                                                                    onToggle={(isCollapsed) => this.setState({ collapsed: !this.state.collapsed, selectedPaymentMethod: '', walletBox: 0, cashBox: 0 })}
                                                                >
                                                                    {(collapsed == true) ? (
                                                                        <CollapseHeader >
                                                                            <Row style={styles.ModalNotes}>
                                                                                <Col style={{ justifyContent: 'center', width: "20%" }}>
                                                                                    <Image source={require('../../images/card.png')} style={styles.CardIcon} />
                                                                                </Col>
                                                                                <Col style={{ justifyContent: 'center', width: "60%", fontSize: 15 }}>
                                                                                    <Text style={{ fontFamily: "Inter-Black" }}>{t('Add Card')}</Text>
                                                                                </Col>
                                                                                <Col style={{ alignItems: 'flex-end', justifyContent: 'center' }}>
                                                                                    <Image source={require('../../images/Blue-Arrow-Down.png')} style={styles.DownArrow} />
                                                                                </Col>
                                                                            </Row>
                                                                        </CollapseHeader>
                                                                    ) : (
                                                                            <CollapseHeader >
                                                                                <Row style={styles.ModalNotes}>
                                                                                    <Col style={{ justifyContent: 'center', width: "20%" }}>
                                                                                        <Image source={require('../../images/card.png')} style={styles.CardIcon} />
                                                                                    </Col>
                                                                                    <Col style={{ justifyContent: 'center', width: "60%", fontSize: 15 }}>
                                                                                        <Text style={{ fontFamily: "Inter-Black" }}>{t('Add Card')}</Text>
                                                                                    </Col>
                                                                                    <Col style={{ alignItems: 'flex-end', justifyContent: 'center' }}>
                                                                                        <Image source={require('../../images/Blue-Arrow.png')} style={styles.DownArrow} />
                                                                                    </Col>
                                                                                </Row>
                                                                            </CollapseHeader>
                                                                        )}
                                                                    < CollapseBody >
                                                                        <Col style={{ marginLeft: 20, marginRight: 20, }}>
                                                                            <TextInput style={styles.TextValue}
                                                                                placeholder={t('NAME OF OWNER')}
                                                                                placeholderTextColor="#9ca5ad"
                                                                                maxLength={25}
                                                                                autoCorrect={false}
                                                                                autoComplete={false}
                                                                                value={user_name}
                                                                                onChangeText={(user_name) => this.setState({ user_name: user_name, walletBox: 0, cashBox: 0, userInputCashAmount: '', amount: 0.00 })}>
                                                                            </TextInput>
                                                                            <TextInput style={styles.TextValue}
                                                                                placeholder={t('CARD NUMBER')}
                                                                                placeholderTextColor="#9ca5ad"
                                                                                maxLength={16}
                                                                                keyboardType="numeric"
                                                                                autoCorrect={false}
                                                                                autoComplete={false}
                                                                                value={card_number}
                                                                                onChangeText={(card_number) => this.setState({ card_number })}>
                                                                            </TextInput>
                                                                            <Row >
                                                                                <Col style={styles.MonthandYear} >

                                                                                    <RNPickerSelect
                                                                                        onValueChange={(month) => this.setState({ month })}
                                                                                        value={month}
                                                                                        placeholderTextColor='#617076'
                                                                                        placeholder={{
                                                                                            label: t('Jan'),
                                                                                            value: '01',
                                                                                        }}
                                                                                        items={[
                                                                                            { label: t('Feb'), value: '02' },
                                                                                            { label: t('Mar'), value: '03' },
                                                                                            { label: t('Apr'), value: '04' },
                                                                                            { label: t('May'), value: '05' },
                                                                                            { label: t('Jun'), value: '06' },
                                                                                            { label: t('Jul'), value: '07' },
                                                                                            { label: t('Aug'), value: '08' },
                                                                                            { label: t('Sep'), value: '09' },
                                                                                            { label: t('Oct'), value: '10' },
                                                                                            { label: t('Nov'), value: '11' },
                                                                                            { label: t('Dec'), value: '12' },
                                                                                        ]}
                                                                                    />
                                                                                </Col>
                                                                                <Col style={styles.MonthandYear} >
                                                                                    <RNPickerSelect

                                                                                        placeholderTextColor={'#000'}
                                                                                        onValueChange={(year) => this.setState({ year })}
                                                                                        value={year}
                                                                                        placeholder={{
                                                                                            label: '2021',
                                                                                            value: '2021',
                                                                                        }}

                                                                                        items={[

                                                                                            { label: '2022', value: '2022' },
                                                                                            { label: '2023', value: '2023' },
                                                                                            { label: '2024', value: '2024' },
                                                                                            { label: '2025', value: '2025' },
                                                                                            { label: '2026', value: '2026' },
                                                                                            { label: '2027', value: '2027' },
                                                                                            { label: '2028', value: '2028' },
                                                                                            { label: '2029', value: '2029' },
                                                                                            { label: '2030', value: '2030' },

                                                                                        ]}
                                                                                    />


                                                                                </Col>
                                                                            </Row>
                                                                            <Col style={{ margin: 3 }}>
                                                                                <TextInput style={styles.TextValue}
                                                                                    placeholder={t('CVV')}
                                                                                    placeholderTextColor="#9ca5ad"
                                                                                    maxLength={3}
                                                                                    keyboardType="numeric"
                                                                                    autoCorrect={false}
                                                                                    autoComplete={false}
                                                                                    value={cvv}
                                                                                    onChangeText={(cvv) => this.setState({ cvv })}>
                                                                                </TextInput>
                                                                            </Col>

                                                                            {/* </Row> */}
                                                                        </Col>
                                                                    </CollapseBody>
                                                                </Collapse>
                                                            </View>
                                                        )}

                                                    {cashBox == 1 ? (
                                                        <View>
                                                            <Col style={styles.Accordion2}>
                                                                <Row style={styles.ModalNotes}>
                                                                    <Col style={{ width: "20%", }}>
                                                                        <Image source={require('../../images/money.png')} style={styles.walletIcon} />
                                                                    </Col>
                                                                    <Col style={{ width: "25%", justifyContent: 'center', fontSize: 15 }}>
                                                                        <Text style={{ fontFamily: "Inter-Black", fontSize: 15 }}>{t('Cash')}</Text>
                                                                    </Col>
                                                                    <Col style={{ alignItems: 'flex-end', justifyContent: 'center', marginRight: '3%' }}>
                                                                        {/* <TouchableOpacity
                                                                        style={styles.AddLocation}
                                                                        onPress={() =>
                                                                            this.showCashTextbox()
                                                                        }
                                                                    > */}
                                                                        {/* <Col style={{ alignItems: 'flex-end', justifyContent: 'center' }}> */}
                                                                        <Image source={require('../../images/Radio-btn.png')} style={styles.RadioButton} />
                                                                        {/* </Col> */}
                                                                        {/* </TouchableOpacity> */}

                                                                    </Col>

                                                                </Row>
                                                                <Row style={{ marginLeft: 15 }}>
                                                                    <Text style={{ fontSize: 10, fontFamily: "Inter-Black" }}>{t('Enter the amount with which you will pay')}</Text>
                                                                </Row>
                                                                <Row style={{ marginLeft: 10, marginRight: 10, }}>
                                                                    <Col style={{ borderRadius: 10, margin: 10, backgroundColor: "#efeff0", alignItems: 'center' }}>
                                                                        <Row>
                                                                            {deliveryCost == '' ? (
                                                                                <View>

                                                                                </View>
                                                                            ) : (
                                                                                    <Row style={styles.AmountInput}>
                                                                                        <TouchableOpacity onPress={() => this.refs.inputRef.focus()}>
                                                                                            <Col style={{ width: 30, paddingLeft: 10 }}>

                                                                                                <Text style={{ color: '#8f969b', fontFamily: "Inter-Black" }}>
                                                                                                    {deliveryCost.currency_symbol}
                                                                                                </Text>

                                                                                            </Col>
                                                                                        </TouchableOpacity>
                                                                                        <Col>
                                                                                            <TextInput style={{ color: '#8f969b', fontFamily: "Inter-Black" }}
                                                                                                maxLength={5}
                                                                                                ref='inputRef'
                                                                                                // minLength={2}
                                                                                                keyboardType="numeric"
                                                                                                value={userInputCashAmount}
                                                                                                onChangeText={(userInputCashAmount) => this.setState({ userInputCashAmount, collapsed: false })}>
                                                                                            </TextInput>
                                                                                        </Col>
                                                                                    </Row>
                                                                                )}

                                                                        </Row>

                                                                    </Col>
                                                                    <Col style={{ margin: 10, justifyContent: 'center', alignItems: 'center', }}>
                                                                        <Row>
                                                                            <Col style={{ justifyContent: 'center', alignItems: 'center' }}>
                                                                                <Text style={{ fontSize: 12, fontFamily: "Inter-Black" }}>{t('Change')}:</Text>
                                                                            </Col>
                                                                            {userInputCashAmount == '' ? (
                                                                                <View>
                                                                                    <Col style={{ justifyContent: 'center', alignItems: 'center' }}>
                                                                                        <Text style={{ fontSize: 12, fontFamily: "Inter-Black" }}>0.00</Text>
                                                                                    </Col>
                                                                                </View>
                                                                            ) : (
                                                                                    <View>
                                                                                        <Col style={{ justifyContent: 'center', alignItems: 'center' }}>
                                                                                            <Text style={{ fontSize: 12, fontFamily: "Inter-Black" }}>{deliveryCost.currency_symbol} {amount.toFixed(2)}</Text>
                                                                                        </Col>
                                                                                    </View>
                                                                                )}

                                                                        </Row>
                                                                    </Col>
                                                                </Row>
                                                            </Col>
                                                        </View>
                                                    ) : (
                                                            <View>
                                                                <Col style={styles.Accordion2}>
                                                                    <Row style={styles.ModalNotes}>
                                                                        <Col style={{ width: "20%", }}>
                                                                            <Image source={require('../../images/money.png')} style={styles.walletIcon} />
                                                                        </Col>
                                                                        <Col style={{ width: "25%", justifyContent: 'center' }}>
                                                                            <Text style={{ fontFamily: "Inter-Black", fontSize: 15 }}>{t('Cash')}</Text>
                                                                        </Col>
                                                                        <Col style={{ alignItems: 'flex-end', justifyContent: 'center', marginRight: '3%' }}>
                                                                            <TouchableOpacity
                                                                                style={styles.AddLocation}
                                                                                onPress={() =>
                                                                                    this.showCashTextbox()
                                                                                }
                                                                            >
                                                                                {/* <Col style={{ alignItems: 'flex-end', justifyContent: 'center' }}> */}
                                                                                <Image source={require('../../images/Radio-btn-.png')} style={styles.RadioButton} />
                                                                                {/* </Col> */}
                                                                            </TouchableOpacity>

                                                                        </Col>

                                                                    </Row>
                                                                </Col>

                                                            </View>
                                                        )}
                                                    {walletBox == 0 ? (
                                                        <View>
                                                            <Col style={styles.Accordion2}>
                                                                <Row style={styles.ModalNotes}>
                                                                    <Col style={{ justifyContent: 'center', width: "20%" }}>
                                                                        <Image source={require('../../images/Logo2.png')} style={styles.walletIcon} />
                                                                    </Col>
                                                                    <Col style={{ justifyContent: 'center', width: "25%" }}>
                                                                        <Text style={{ fontFamily: "Inter-Black", fontSize: 15 }}>{t('Payments')}</Text>
                                                                    </Col>
                                                                    <Col>
                                                                        <Row style={{ marginRight: 5, justifyContent: 'center', alignItems: 'center' }}>
                                                                            {/* <Col style={{ justifyContent: 'center',paddingRight: 5, paddingLeft:5,  width: "50%" }}> */}
                                                                            <Text style={{ fontSize: 12, color: "#b2b2b2", fontFamily: "Inter-Black" }}>{t('Balance')}:  {dataSource.currency_symbol} {dataSource.balance}</Text>
                                                                            {/* </Col> */}
                                                                            {/* <Col style={{ justifyContent: 'center' }}>
                                                                            <Text style={{ fontSize: 12, color: "#b2b2b2", fontFamily: "Inter-Black" }}>{dataSource.currency_symbol} {dataSource.balance}</Text>
                                                                        </Col> */}
                                                                        </Row>
                                                                    </Col>
                                                                    <Col style={{ alignItems: 'flex-end', justifyContent: 'center', marginRight: '3%', width: "10%" }}>
                                                                        <TouchableOpacity
                                                                            style={styles.AddLocation}
                                                                            onPress={() =>
                                                                                this.showWalletTextbox()
                                                                            }
                                                                        >
                                                                            {/* <Col style={{ alignItems: 'flex-end', justifyContent: 'center' }}> */}
                                                                            <Image source={require('../../images/Radio-btn-.png')} style={styles.RadioButton} />
                                                                            {/* </Col> */}
                                                                        </TouchableOpacity>

                                                                    </Col>
                                                                </Row>
                                                            </Col>
                                                        </View>
                                                    ) : (
                                                            <View>
                                                                <Col style={styles.Accordion2}>
                                                                    <Row style={styles.ModalNotes}>
                                                                        <Col style={{ justifyContent: 'center', width: "20%" }}>
                                                                            <Image source={require('../../images/Logo2.png')} style={styles.walletIcon} />
                                                                        </Col>
                                                                        <Col style={{ justifyContent: 'center', width: "25%" }}>
                                                                            <Text style={{ fontFamily: "Inter-Black", fontSize: 15 }}>{t('Payments')}</Text>
                                                                        </Col>
                                                                        <Col>
                                                                            <Row style={{ marginRight: 5, justifyContent: 'center', alignItems: 'center' }}>
                                                                                <Text style={{ fontSize: 12, color: "#b2b2b2", fontFamily: "Inter-Black" }}>{t('Balance')}:  {dataSource.currency_symbol} {dataSource.balance}</Text>
                                                                            </Row>
                                                                        </Col>
                                                                        <Col style={{ alignItems: 'flex-end', justifyContent: 'center', marginRight: '3%', width: "10%", }}>
                                                                            {/* <TouchableOpacity
                                                                            style={styles.AddLocation}
                                                                            onPress={() =>
                                                                                this.showWalletTextbox()
                                                                            }
                                                                        > */}
                                                                            {/* <Col style={{ alignItems: 'flex-end', justifyContent: 'center' }}> */}
                                                                            <Image source={require('../../images/Radio-btn.png')} style={styles.RadioButton} />
                                                                            {/* </Col> */}
                                                                            {/* </TouchableOpacity> */}

                                                                        </Col>
                                                                    </Row>
                                                                </Col>
                                                            </View>
                                                        )}


                                                    <Row style={{ marginTop: "5%", marginLeft: 20, marginRight: 20, }}>
                                                        <Text style={{ fontSize: 12, color: "#8d8d8d", fontFamily: "Inter-Black" }}>
                                                            Pagos digitales: el pago se cargará a su tarjeta ó se descontará de su cuenta una vez finalice el pedido</Text>
                                                    </Row>
                                                    <Row style={{ marginBottom: "10%", alignItems: 'center', justifyContent: 'center', marginTop: 20, }}>
                                                        <TouchableOpacity style={styles.Login} onPress={() =>
                                                            this.Save()
                                                        }>
                                                            <Text style={{ color: '#fff', fontSize: 20, textAlign: "center", fontFamily: "Inter-Black" }} >{t('Confirm')}</Text>
                                                        </TouchableOpacity>
                                                    </Row>
                                                </ScrollView>
                                                <CustomToast ref="defaultToastBottomWithDifferentColor" backgroundColor='#000' position="top" />
                                            </View>
                                        </View>
                                    </Modal>

                                </Col>
                            </Row>
                            <Row style={{
                                marginRight: '5%', marginLeft: '5%', backgroundColor: '#f2f2f2', borderRadius: 10, marginTop: '3%',
                            }}>
                                {/* <Col > */}
                                <TextInput style={styles.notes_Input}
                                    placeholder={t('Delivery Instructions')}
                                    placeholderTextColor={'#aaaaaa'}
                                    numberOfLines={2}
                                    // multiline
                                    value={notes_Input}
                                    onChangeText={(notes_Input) => this.setState({ notes_Input })}>
                                </TextInput>
                                {/* </Col> */}
                            </Row>
                            <Row style={{ backgroundColor: '#e77672', marginTop: '3%' }}>
                                <SafeAreaView style={{ flex: 1 }}>
                                    <View style={styles.Slider}>

                                        <SwipeButton
                                            disabled={false}
                                            //disable the button by doing true (Optional)
                                            swipeSuccessThreshold={70}
                                            height={45}
                                            //height of the button (Optional)
                                            // width={330}
                                            //width of the button (Optional)
                                            // title={<Text style={{ fontSize: 14, fontFamily: 'Inter-Black' }}>                  {t('Swipe to confirm your messenger')}  {`\u2023`}{`\u2023`}{`\u2023`}</Text>}
                                            title={<Text style={{ fontSize: 14, fontFamily: 'Inter-Black' }}>                           {t('Swipe to confirm your messenger')}  {`\u2023`}{`\u2023`}{`\u2023`}</Text>}
                                            // title="Desliza para confirmar tu mensajera >>>"
                                            //Text inside the button (Optional)
                                            // thumbIconImageSource={require('../../images/Logo2.png')}
                                            thumbIconComponent={swipeButtonIcon}
                                            //You can also set your own icon (Optional)
                                            onSwipeSuccess={() => {
                                                this.confirmOrder()
                                            }}
                                            // onSwipeSuccess={() => this.confirmOrder.bind(this)}
                                            //After the completion of swipe (Optional)
                                            railFillBackgroundColor="#c2272d" //(Optional)
                                            shouldResetAfterSuccess={true}
                                            resetAfterSuccessAnimDelay={1}
                                            resetAfterSuccessAnimDuration={1}
                                            railFillBorderColor="#fff" //(Optional)
                                            titleColor="#fff"
                                            titleFontSize={13}
                                            fontFamily="Inter-Black"
                                            thumbIconBackgroundColor="#fff" //(Optional)
                                            thumbIconBorderColor="#fff" //(Optional)
                                            railBackgroundColor="#c2272d" //(Optional)
                                            railBorderColor="#c2272d" //(Optional)
                                        />
                                    </View>
                                </SafeAreaView>
                            </Row>

                        </Col>

                        {/* <CustomToast ref="defaultToastBottomWithDifferentColor" backgroundColor='#000' position="top" /> */}
                        <DropdownAlert ref={ref => this.dropdown = ref} />
                    </KeyboardAvoidingView>
                </View >
            );

        }
        else {
            return (
                <ActivityIndicator
                    style={styles.loading}
                    size="large"
                    color="#d62326"
                />
            );
        }

    }
}
MessagingConfirmation.propTypes = {
    provider: ProviderPropType,
};
const styles = StyleSheet.create({

    container: {
        flex: 1,
    },
    loading: {
        position: "absolute",
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        alignItems: "center",
        justifyContent: "center",
    },
    mapStyle: {
        width: Dimensions.get("window").width,
        height: Dimensions.get("window").height,
    },
    Navebar: {
        ...Platform.select({
            ios: {
                // marginTop: "10%",
                paddingTop: "12%",
                paddingBottom: 10,
                // zIndex: 9999,
                // position: "absolute",
                // backgroundColor: "#fff",

                // height: 1 , 
                // paddingBottom: 50, 
                // marginTop: "12%",
                // zIndex: 9999,
                // position: 'absolute',

                height: 80,
                // borderRadius: 20,
                // borderBottomRightRadius: 20,
                // borderBottomLeftRadius: 20,
                backgroundColor: '#efefef'


            },
            android: {
                zIndex: 9999,
                position: "absolute",
                backgroundColor: '#efefef',
            },
        }),
    },
    NaveBackArrowCol: {
        ...Platform.select({
            ios: {
                borderRightWidth: 2, width: '15%', justifyContent: 'center', borderColor: '#CCCCCC'
            },
            android: {

                borderRightWidth: 2, width: '15%', justifyContent: 'center', marginTop: 10, marginBottom: 10, borderColor: '#CCCCCC'

            }
        })

    },
    NaveTitleCol: {
        ...Platform.select({
            ios: {
                justifyContent: 'center', marginLeft: 10
            },
            android: {

                justifyContent: 'center', marginLeft: 10

            }
        })

    },
    BackArrow: {
        width: 25,
        height: 25,
        justifyContent: "center",
        alignItems: "center",
        marginLeft: 10,
    },
    MenuCol: {
        ...Platform.select({
            ios: {
                width: "10%",
                justifyContent: 'center',
            },
            android: {
                justifyContent: 'center',
                width: "10%",
            }
        })
    },
    Menu: {
        width: 25,
        height: 25,
        marginRight: 10,
        alignItems: "flex-end",
    },
    ScooterNew: {
        width: 40,
        height: 40,
        // marginRight: 10,
        // marginTop: 10,
        alignItems: "flex-end",
    },

    Accept: {
        ...Platform.select({
            ios: {
                flex: 1,
                justifyContent: 'center',
                position: 'absolute',
                width: '100%',
                backgroundColor: '#fff',
                borderTopLeftRadius: 50,
                borderTopRightRadius: 50,
                bottom: 0,

            },
            android: {
                flex: 1,
                justifyContent: 'center',
                position: 'absolute',
                bottom: 0,
                backgroundColor: '#fff',
                borderTopLeftRadius: 50,
                borderTopRightRadius: 50,
                width: '100%'
            }
        })

    },
    Login: {
        justifyContent: 'center',
        paddingHorizontal: 25,
        height: 30,
        borderRadius: 10,
        backgroundColor: '#1888b8',
        color: '#fff',
    },

    TextArea: {
        ...Platform.select({
            ios: {
                position: 'absolute',
                width: '90%',
                marginTop: '105%',
                marginLeft: 20,
                backgroundColor: '#fff',
            },
            android: {

                position: 'absolute',
                width: '90%',
                // marginTop: '45%',
                borderRadius: 15,
                bottom: 0,
                marginLeft: 20,
                // marginRight: 20,
                backgroundColor: '#fff',
            }
        })
    },
    notes_Input: {
        ...Platform.select({
            ios: {
                paddingLeft: 10,
                paddingRight: 10,
                paddingVertical: 5,
                fontFamily: "Inter-Black",
                width: "100%",
            },
            android: {
                paddingLeft: 20,
                fontFamily: "Inter-Black",
                width: "100%",
            }
        })

    },
    // Modal
    ModalCenteredView: {
        ...Platform.select({
            ios: {
                // borderRadius: 0,
                shadowColor: "#232324",
                shadowOffset: { width: 0, height: 1, },
                elevation: 200,
                height: Dimensions.get('window').height,
                backgroundColor: "rgba(100,100,100, 0.8)",
            },
            android: {
                // borderRadius: 10,
                shadowColor: "#232324",
                shadowOffset: { width: 0, height: 1, },
                elevation: 200,
                // top: 200,
                // height:"20%",
                height: Dimensions.get('window').height,
                backgroundColor: "rgba(100,100,100, 0.8)",
            }
        })

    },


    SModalView: {
        ...Platform.select({
            ios: {
                borderRadius: 20,
                top: '10%',
                // bottom: '20%',
                marginLeft: 20,
                marginRight: 20,
                backgroundColor: "white",
                opacity: 1.25,
                paddingLeft: 5,
                paddingRight: 5,
                shadowColor: "#232324",

                shadowOffset: {
                    width: 0,
                    height: 2,
                },
                shadowOpacity: 0.25,
                // shadowRadius: 3.84,
                elevation: 5
            },
            android: {
                borderRadius: 40,
                top: '5%',
                // width: "80%",
                marginLeft: 20,
                marginRight: 20,
                backgroundColor: "white",
                justifyContent: 'center',
            }
        })

    },
    ModalTextRow: {
        color: '#1988ba',
        fontSize: 25,
        textAlign: 'center',
        fontFamily: "Inter-Black"
    },
    ModalNotes: {
        // marginTop: 30,
        // marginLeft: 10,
        // marginRight: 10,
        // borderWidth: 1,
        // borderRadius: 10,
        padding: 10
        // borderColor: '#ededed',
        // justifyContent: 'center',

    },
    SpopupTextName: {
        fontWeight: 'bold',
        justifyContent: "center",
        fontSize: 20,
        textAlign: 'center',
        width: '80%',
    },

    CancelNavebar2: {
        ...Platform.select({
            ios: {
                marginTop: 10,

            },
            android: {
                marginTop: 10,
            }
        })
    },
    Close: {
        width: 30,
        height: 30,
        marginLeft: 20,
        // marginTop: 10,
    },

    CardIcon: {
        width: 35,
        height: 35,
        // marginLeft: 10,
        // marginTop: 10,
    },

    walletIcon: {
        width: 35,
        height: 35,
        // marginLeft: 10,
        // marginTop: 10,
    },
    RadioButton: {
        width: 25,
        height: 25,
        // marginLeft: 20,
        // marginTop: 10,
    },

    Accordion1: {
        // backgroundColor:'#e9e7e6',
        marginLeft: 20,
        marginRight: 20,
        // borderBottomWidth: 2,
        // marginTop: 10,
        borderWidth: 1,
        marginTop: 15,
        borderRadius: 10,
        borderColor: '#ededed',
    },
    Accordion2: {
        // backgroundColor:'#e9e7e6',
        marginLeft: 20,
        marginRight: 20,
        // borderBottomWidth: 2,
        // marginTop: 10,
        borderWidth: 1,
        marginTop: 10,
        borderRadius: 10,
        borderColor: '#ededed',
    },
    DownArrow: {
        width: 20,
        height: 20,
        marginRight: 10,
        // marginTop: 15,
    },
    TextValue: {
        ...Platform.select({
            ios:
            {
                justifyContent: 'center',
                paddingLeft: 10,
                alignItems: 'center',
                borderRadius: 10,
                backgroundColor: '#f2f3f4',
                marginBottom: 10,
                color: '#bcbdc0',
                fontFamily: "Inter-Black",
                height: 30
            },
            android:
            {
                justifyContent: 'center',
                paddingLeft: 10,
                alignItems: 'center',
                borderRadius: 10,
                backgroundColor: '#f2f3f4',
                marginBottom: 10,
                color: '#bcbdc0',
                fontFamily: "Inter-Black"
            }
        }),
    },
    MonthandYear: {
        ...Platform.select({
            ios:
            {
                borderRadius: 10,
                height: 40,
                borderColor: 'grey',
                backgroundColor: '#f2f3f4',
                margin: 3,
                justifyContent: 'center',
                paddingLeft: 5
            },
            android:
            {
                borderRadius: 10,
                height: 40,
                borderColor: 'grey',
                backgroundColor: '#f2f3f4',
                margin: 3,
            }
        }),
    },
    Slider: {
        flex: 1,
        paddingHorizontal: 10,
        paddingVertical: 5,
        justifyContent: 'center',
        // backgroundColor: 'red',


    },

    popupCrossTextIcon: {
        // marginTop: 10,
        fontSize: 25,
        fontFamily: "Inter-Black",
        color: "#b3b3b3",
        // textAlign: 'center',
    },

    AmountInput: {
        ...Platform.select({
            ios: {
                padding: 5
            },
            android: {
                alignItems: 'center',
                justifyContent:"center"
            }
        })
    },

    radio: {
        ...Platform.select({
            ios: {
                // width: normalize(35),
                borderWidth: 1,
                borderRadius: normalize(40),
                height: normalize(35),
                borderColor: '#1A87BA',
                marginRight: 20
            }
        })
    },

});