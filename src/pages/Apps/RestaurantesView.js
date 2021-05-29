import React, { Component, useState } from 'react';
import { Button, Dimensions, KeyboardAvoidingView, SafeAreaView, BackHandler, ActivityIndicator, Modal, AsyncStorage, Picker, Alert, StyleSheet, Text, View, Image, TextInput, TouchableOpacity, StatusBar, Keyboard, ScrollView, Platform } from 'react-native';
import { Col, Row, Grid } from "react-native-easy-grid";
import { t } from '../../../locals';
import CustomToast from './Toast.js';
import PropTypes from 'prop-types';
import validate from 'validate.js';
import { Dropdown } from 'react-native-material-dropdown-v2';
import { getServiceListAction, getUserDetailAction } from '../Util/Action.js';
import { storage } from '../Util/storage.js';
import {
    getUserCardListAction,
    getServiceCostAction,
    getUserWalletBalanceAction,
    getServiceTypesWithImageAction,
    saveServiceOrderAction,
    getCategoryWiseServiceListAction,
    getServiceCapacityAction,
    savePaymentAction
} from '../Util/Action.js';
import ServiceTypesIcon from './ServiceTypeIcon';
import ServiceSubCategoryIcon from './ServiceSubCategoryImage';
import SwipeButton from 'rn-swipe-button';
import { RadioButton } from 'react-native-paper';
import { Collapse, CollapseHeader, CollapseBody } from "accordion-collapse-react-native";
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import normalize from 'react-native-normalize';
import RNPickerSelect from 'react-native-picker-select';
import Demo1 from '../Apps/radio.js';
import { NavigationEvents } from 'react-navigation';
import moment from 'moment';
import DropdownAlert from 'react-native-dropdownalert';

import PDFReader from 'rn-pdf-reader-js';
import { color } from 'react-native-reanimated';
import { Time } from 'react-native-gifted-chat';
if (Platform.OS == 'ios') {
    var DateTimePicker = require('react-native-datepicker').default;

} else {
    var DateTimePickerModal = require('@react-native-community/datetimepicker').default;

}


const GOOGLE_MAPS_APIKEY = (Platform.OS === 'ios') ? "AIzaSyDA8VzkYgIznevJNoGFt_HLxgM2cBRgQd8" : "AIzaSyD6VKrDOOeJgMKKwKpiYFhIA8Udd-7mdlU";
const { width, height } = Dimensions.get('window');
var today = new Date();

export default class RestaurantesView extends React.PureComponent {
    static navigationOptions = ({ navigation }) => {
        return {
            headerShown: false
        };
    };
    toggleDrawer = ({ navigation }) => {
        this.props.navigation.toggleDrawer();
    };
    constructor(props) {
        super(props);
        this.state = {
            residentialEnable: 1,
            commercialEnable: 1,
            paymentInfo: 0,
            selectedServiceDate: 'Date',
            selectedServiceTime: 'Time',
            getCapacity: [],
            selectedcapacityid: '',
            walletBox: 0,
            isDatePickerVisible: false,
            setDatePickerVisibility: false,
            selectedHours: 0,
            selectedMinutes: 0,
            ServiceTypes: [],
            ServiceTypeSelected: '',
            ServiceTypeSelectedName: '',
            ServiceSubCategory: [],
            // date: moment(today).add(1, 'day').format('DD-MM-YYYY'),
            date: '',
            // time: Platform.OS == 'ios' ? new Date().toLocaleString() : moment(new Date().toLocaleString()).format('hh:mm'),
            time: '',
            day: moment(today).format('dddd'),
            user_name: '',
            // cashBox: '',
            // walletBox: '',
            dataSource: [],
            IsPaymentMethodSave: 0,
            modalPaymentType: false,
            service_time: '',
            service_date: '',
            isVisible_time: false,
            isVisible: false,
            collapsed: false,
            installation_collapsed: false,
            Maintenance_collapsed: false,
            installation: '',
            Maintenance: '',
            service: 'residential',
            service_category: '',
            userData: [],
            loader: false,
            distance: '',
            search: '',
            notes: '',
            from_latitude: '',
            from_longitude: '',
            destination_latitude: '',
            destination_longitude: '',
            fromLocationText: '',
            destinationLocationText: '',
            dbServiceList: '',
            ServiceListSelected: '',
            serviceCostWithCurrency: '',
            serviceCost: '',
            sub_total: '',
            itbms: '',
            modalVisible: false,
            timeModalVisible: false,
            modalList: false,
            selectedStartDate: null,
            selectedTime: null,
            customerMobile: '',
            customerEmail: '',
            customerPaymentToken: '',
            card_number: '',
            month: '',
            year: '',
            cvv: '',
            paymentType: '',
            selectedPaymentMethod: '',
            userInputCashAmount: '',
            paymentGatewatToken: '',
            cardList: [],
            value: 0,
            radio_props: [
                { label: 'Cash', value: "Cash" },
                { label: 'Card', value: "Card" }
            ],

        };

    }
    // on   Change(date, type) {
    //     //function to handle the date change 

    //     this.setState({
    //         selectedStartDate: date,

    //     });

    // }
    setLocation(text) { 
        this.BPointref && this.BPointref.setAddressText(text)
    }

    showWalletTextbox() {
        // this.updateFund();
        if (this.state.walletBox == 0) {

            this.setState({
                walletBox: 1,
                collapsed: false,
                paymentGatewatToken: '',
                selectedPaymentMethod: 'Wallet'

            });
        }
    }

    showDatePicker = (visible) => {
        this.setState({ setDatePickerVisibility: visible });
    }


    hideDatePicker = () => {
        this.setState({ setDatePickerVisibility: false });
    }

    handleConfirmDate(event, date) {
        this.setModalVisible(false);
        var formated_date = moment(date).format('DD-MM-YYYY');
        var day_name = moment(date).format('dddd');
        this.setState({
            selectedServiceDate: formated_date,
            day: day_name,
        })
    }

    handleConfirmTime(event, time) {
        this.setTimeModalVisible(false);
        var formated_time = moment(time).format('HH:mm');
        this.setState({ selectedServiceTime: formated_time })
    }


    paymentType(modalPaymentType) {
        this.setModalPaymentType(!modalPaymentType);
    }

    setModalPaymentType = (visible) => {

        this.setState({ modalPaymentType: visible });
    }

    async componentDidMount() {
        const { navigation } = this.props;
        this.setState({ loader: true });
        this.focusListener = navigation.addListener("didFocus", () => {
            var params = this.props.navigation.getParam('data');
            this.getUserDetail();
            this.getUserWalletBalance();
            this.setState({
                destinationLocationText: params.LocationText,
                destination_latitude: params.from_latitude,
                destination_longitude: params.from_longitude,
                // from_latitude : params.from_latitude,
                // from_longitude : params.from_longitude,
            });
            this.setLocation(params.LocationText)
        });
        this.getServiceTypesWithImage();
        this.getCardList();
        this.setState({ loader: false });
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

    async getServiceTypesWithImage() {
        this.setState({ loader: true });
        let Token = await AsyncStorage.getItem("token");

        Token = "Bearer " + Token;

        getServiceTypesWithImageAction(Token).then((responseJson) => {
            if (responseJson.isError == false) {
                this.setState({
                    ServiceTypes: responseJson.result,
                    loader: false,

                });
            } else {
                alert(responseJson.message);
                this.setState({ loader: false });

            }
        });
    }

    // Get the User Detail
    async getUserDetail() {
        this.setState({ loader: true });
        const customer_id = await AsyncStorage.getItem("userid");
        let Token = await AsyncStorage.getItem("token");


        Token = "Bearer " + Token;
        const getUserDetailData = {
            user_id: customer_id,
        };
        getUserDetailAction(getUserDetailData, Token).then((responseJson) => {
            if (responseJson.isError == false) {
                this.setState({
                    userData: responseJson.result,
                    loader: false,
                });
            } else {
                // alert(responseJson.message);
                this.setState({ loader: false });
            }
        });
    }

    async getServiceList() {

        this.setState({ loader: true });
        let Token = await AsyncStorage.getItem("token");

        Token = "Bearer " + Token;

        getServiceListAction(Token).then((responseJson) => {
            if (responseJson.isError == false) {

                this.setState({
                    dbServiceList: responseJson.result,
                    loader: false,
                });

            } else {
                alert(responseJson.message);
                this.setState({ loader: false });

            }
        });
    }

    async getCost(selectedService) {

        var constraints = {
            selectedsubcategorycapacity: {
                presence: {
                    allowEmpty: false,
                    message: "^Select category capacity"
                },
            },
        };
        const result = validate({ selectedsubcategorycapacity: this.state.selectedcapacityid }, constraints);

        if (result) {
            if (result.selectedsubcategorycapacity) {
                // this.refs.defaultToastBottomWithDifferentColor.ShowToastFunction(result.ServiceListSelected);
                this.dropdown.alertWithType('error', 'Error', result.selectedsubcategorycapacity);
                return false;
            }
        }


        // Get Order Cost
        let Token = await AsyncStorage.getItem("token");

        Token = "Bearer " + Token;
        var serviceData = {
            service_id: this.state.selectedsubcategory,
            capacity_id: this.state.selectedcapacityid,
        };

        this.setState({ loader: true });
        var response = getServiceCostAction(serviceData, Token).then(
            function (responseJson) {
                if (responseJson.isError == false) {
                    this.setState({
                        loader: false,
                        serviceCost: responseJson.result.cost,
                        sub_total: responseJson.result.sub_total,
                        itbms: responseJson.result.itbms,
                        currency_symbol: responseJson.result.currencySymbol,
                        selectedsubcategoryname: this.state.selectedsubcategoryname,
                        paymentInfo: 1,

                    })
                } else {
                    this.setState({ loader: false });
                    this.dropdown.alertWithType('error', 'Error', responseJson.message);
                }
            }.bind(this)
        );
    }



    async place_order() {
        const { navigate } = this.props.navigation;
        const { dbServiceList, notes, paymentType, userData } = this.state;
        if (Platform.Os == 'ios') {
            var constraints = {
                SelectedServiceType: {
                    presence: {
                        allowEmpty: false,
                        message: "^Select Service Type"
                    },
                },
                selectedsubcategory: {
                    presence: {
                        allowEmpty: false,
                        message: "^Select Service"
                    },
                },
                selectedsubcategorycapacity: {
                    presence: {
                        allowEmpty: false,
                        message: "^Select Service capacity"
                    },
                },
                date: {
                    presence: {
                        allowEmpty: false,
                        message: "^Select Date"
                    },
                },
                time: {
                    presence: {
                        allowEmpty: false,
                        message: "^Select time"
                    },
                },
                paymentType: {
                    presence: {
                        allowEmpty: false,
                        message: "^Select payment type"
                    },
                }
            };

            const result = validate({ SelectedServiceType: this.state.ServiceTypeSelected, selectedsubcategory: this.state.selectedsubcategory, selectedsubcategorycapacity: this.state.selectedcapacityid, date: this.state.date, time: this.state.time, paymentType: this.state.selectedPaymentMethod }, constraints);

            if (result) {
                if (result.SelectedServiceType) {
                    // this.refs.defaultToastBottomWithDifferentColor.ShowToastFunction(result.ServiceListSelected);
                    this.dropdown.alertWithType('error', 'Error', result.SelectedServiceType);
                    return false;
                }
                if (result.selectedsubcategory) {
                    // this.refs.defaultToastBottomWithDifferentColor.ShowToastFunction(result.ServiceListSelected);
                    this.dropdown.alertWithType('error', 'Error', result.selectedsubcategory);
                    return false;
                }
                if (result.selectedsubcategorycapacity) {
                    // this.refs.defaultToastBottomWithDifferentColor.ShowToastFunction(result.ServiceListSelected);
                    this.dropdown.alertWithType('error', 'Error', result.selectedsubcategorycapacity);
                    return false;
                }
                if (result.date) {
                    // this.refs.defaultToastBottomWithDifferentColor.ShowToastFunction(result.date);
                    this.dropdown.alertWithType('error', 'Error', result.date);
                    return false;
                }
                if (result.time) {
                    // this.refs.defaultToastBottomWithDifferentColor.ShowToastFunction(result.time);
                    this.dropdown.alertWithType('error', 'Error', result.time);
                    return false;
                }
                if (result.paymentType) {
                    // this.refs.defaultToastBottomWithDifferentColor.ShowToastFunction(result.paymentType);
                    this.dropdown.alertWithType('error', 'Error', result.paymentType);

                    return false;
                }
            }
        } else {
            var constraints = {
                SelectedServiceType: {
                    presence: {
                        allowEmpty: false,
                        message: "^Select Service Type"
                    },
                },
                selectedsubcategory: {
                    presence: {
                        allowEmpty: false,
                        message: "^Select Service"
                    },
                },
                selectedsubcategorycapacity: {
                    presence: {
                        allowEmpty: false,
                        message: "^Select Service capacity"
                    },
                },
                date: {
                    presence: {
                        allowEmpty: false,
                        message: "^Select Date"
                    },
                },
                time: {
                    presence: {
                        allowEmpty: false,
                        message: "^Select time"
                    },
                },
                paymentType: {
                    presence: {
                        allowEmpty: false,
                        message: "^Select payment type"
                    },
                }
            };

            const result = validate({ SelectedServiceType: this.state.ServiceTypeSelected, selectedsubcategory: this.state.selectedsubcategory, selectedsubcategorycapacity: this.state.selectedcapacityid, date: this.state.selectedServiceDate, time: this.state.selectedServiceTime, paymentType: this.state.selectedPaymentMethod }, constraints);

            if (result) {
                if (result.SelectedServiceType) {
                    // this.refs.defaultToastBottomWithDifferentColor.ShowToastFunction(result.ServiceListSelected);
                    this.dropdown.alertWithType('error', 'Error', result.SelectedServiceType);
                    return false;
                }
                if (result.selectedsubcategory) {
                    // this.refs.defaultToastBottomWithDifferentColor.ShowToastFunction(result.ServiceListSelected);
                    this.dropdown.alertWithType('error', 'Error', result.selectedsubcategory);
                    return false;
                }
                if (result.selectedsubcategorycapacity) {
                    // this.refs.defaultToastBottomWithDifferentColor.ShowToastFunction(result.ServiceListSelected);
                    this.dropdown.alertWithType('error', 'Error', result.selectedsubcategorycapacity);
                    return false;
                }
                if (result.date) {
                    // this.refs.defaultToastBottomWithDifferentColor.ShowToastFunction(result.date);
                    this.dropdown.alertWithType('error', 'Error', result.date);
                    return false;
                }
                if (result.time) {
                    // this.refs.defaultToastBottomWithDifferentColor.ShowToastFunction(result.time);
                    this.dropdown.alertWithType('error', 'Error', result.time);
                    return false;
                }
                if (result.paymentType) {
                    // this.refs.defaultToastBottomWithDifferentColor.ShowToastFunction(result.paymentType);
                    this.dropdown.alertWithType('error', 'Error', result.paymentType);

                    return false;
                }
            }
        }

        this.setState({ loader: true });
        let customer_id = await AsyncStorage.getItem('userid');

        var serviceOrderData = {
            customer_id: customer_id,
            service_place: this.state.service,
            service_type: this.state.ServiceTypeSelected,
            service_id: this.state.selectedsubcategory,
            service_capacity_id: this.state.selectedcapacityid,
            destinationLocationText: this.state.destinationLocationText,
            destination_latitude: this.state.destination_latitude,
            destination_longitude: this.state.destination_longitude,
            notes: this.state.notes,
            date: Platform.OS == 'ios' ? this.state.date : this.state.selectedServiceDate,
            time: Platform.OS == 'ios' ? this.state.time : this.state.selectedServiceTime,
            cost: this.state.sub_total,
            total: this.state.serviceCost,
            tax: this.state.itbms,
            paymentType: this.state.selectedPaymentMethod,
            paymentGatewayToken: this.state.paymentGatewatToken
        }
        console.log(serviceOrderData)
        let Token = await AsyncStorage.getItem('token');
        Token = 'Bearer ' + Token;

        var response = saveServiceOrderAction(serviceOrderData, Token).then(function (responseJson) {
            console.log(responseJson)
            if (responseJson.isError == false) {
                this.setState({ loader: false });
                navigate('OrderList');
            } else {
                this.setState({ loader: false });
                this.dropdown.alertWithType('error', 'Error', responseJson.message);
            }
        }.bind(this));


    }

    pointMarkerBySearchB(data, details) {
        var addr_text = (details != '') ? details.formatted_address : '';
        var from_latitude = (details != '') ? details.geometry.location.lat : '';
        var from_longitude = (details != '') ? details.geometry.location.lng : '';

        if (from_latitude && from_longitude) {
            var pointB = [];
            this.setState({
                destination: [],
            });
            var locations = {};

            locations = { // The ID attached to the marker. It will be returned when onMarkerClicked is called
                coords: { latitude: from_latitude, longitude: from_longitude, latitudeDelta: 0.0922, longitudeDelta: 0.0421 }
            };

            pointB.push(locations);

            this.setState({
                destination: pointB,
                destination_latitude: from_latitude,
                destination_longitude: from_longitude,
                initialPosition: locations.coords,

            });
        }
        this.setState({ destinationLocationText: addr_text });
    }

    setModalVisible = (visible) => {
        this.setState({ modalVisible: visible });
    }

    setTimeModalVisible = (visible) => {
        this.setState({ timeModalVisible: visible });
    }

    setModalList = (List) => {
        this.setState({ modalList: List });
    }

    _onBlurr = () => {
        BackHandler.removeEventListener('hardwareBackPress',
            this._handleBackButtonClick);
    }

    _onFocus = () => {
        BackHandler.addEventListener('hardwareBackPress',
            this._handleBackButtonClick);
    }

    // _handleBackButtonClick = () => this.props.navigation.navigate('ServicePlace')

    UpdateRatingB() {

        if (this.state.FavLocationB == 0) {
            this.setState({ FavLocationB: 1, });
        } else {
            this.setState({ FavLocationB: 0, });
        }
    }

    async SelectedService(item_id, item_type, item_label) {
        this.setState({ loader: true });
        this.setState({
            collapsed: false,
            ServiceTypeSelected: item_id,
            ServiceTypeSelectedImage: item_type,
            ServiceTypeSelectedName: item_label,

            getCapacity: [],
            lastcollapsid: '',
            selectedsubcategory: '',
            selectedsubcategoryname: '',
            selectedsubcategoryimage: '',
            service: 'residential',
            residentialEnable: 1,
            commercialEnable: 0

        })
        var SelectedService = {
            category: item_id,
            place: this.state.service,
        }
        let Token = await AsyncStorage.getItem('token');
        Token = 'Bearer ' + Token;

        var response = getCategoryWiseServiceListAction(SelectedService, Token).then(function (responseJson) {
            if (responseJson.isError == false) {
                this.setState({
                    residentialEnable: responseJson.result.residential,
                    commercialEnable: responseJson.result.commercial,
                    ServiceSubCategory: responseJson.result.result,
                    loader: false,
                });
            } else {
                this.setState({ loader: false });
                this.refs.defaultToastBottomWithDifferentColor.ShowToastFunction(responseJson.message);
            }
        }.bind(this));
    }

    async Capacity(item_id, item_label, item_type) {
        const { getCapacity } = this.state;
        this.setState({
            getCapacity: [],
            lastcollapsid: item_id,
            selectedsubcategory: item_id,
            selectedsubcategoryname: item_label,
            selectedsubcategoryimage: item_type,

        })
        var Capacity = {
            service_id: item_id,
            place: this.state.service,
        }
        console.log(Capacity)
        let Token = await AsyncStorage.getItem('token');
        Token = 'Bearer ' + Token;

        var response = getServiceCapacityAction(Capacity, Token).then(function (responseJson) {
            console.log(responseJson)
            if (responseJson.isError == false) {
                this.setState({
                    getCapacity: responseJson.result,
                })

            } else {
                this.refs.defaultToastBottomWithDifferentColor.ShowToastFunction(responseJson.message);
            }
        }.bind(this));

    }

    async SelectPlace(place) {
        this.setState({
            service: place,
        })

        var SelectedService = {
            category: this.state.ServiceTypeSelected,
            place: place,
        }
        let Token = await AsyncStorage.getItem('token');
        Token = 'Bearer ' + Token;
        this.setState({ loader: true });
        var response = getCategoryWiseServiceListAction(SelectedService, Token).then(function (responseJson) {
            if (responseJson.isError == false) {
                this.setState({
                    loader: false,
                    ServiceSubCategory: responseJson.result.result
                });
            } else {
                this.setState({ loader: false });
                this.refs.defaultToastBottomWithDifferentColor.ShowToastFunction(responseJson.message);
            }
        }.bind(this));

    }

    async Save() {

        const { navigate } = this.props.navigation;
        const { modalPaymentType, serviceCost, userInputCashAmount, cashBox, walletBox, dataSource } = this.state;


        if (walletBox == 1) {
            this.setState({ selectedPaymentMethod: "wallet" });
            if (!serviceCost) {
                this.refs.defaultToastBottomWithDifferentColor.ShowToastFunction("Please select service capacity type.");
                // this.dropdown.alertWithType('error', 'Error', "Please select vehicle type.");
                this.setState({ selectedPaymentMethod: "" });
                this.setState({ walletBox: 0 });
            } else {
                if (parseFloat(dataSource.balance) < parseFloat(serviceCost)) {
                    this.refs.defaultToastBottomWithDifferentColor.ShowToastFunction("Wallet amount not sufficient");
                    // this.dropdown.alertWithType('error', 'Error', "Wallet amount not sufficient");
                    this.setState({ selectedPaymentMethod: "" });
                    this.setState({ walletBox: 0 });
                } else {
                    this.setState({ modalPaymentType: false });
                }
            }

        } else {
            this.setState({ selectedPaymentMethod: "card" });
            if (this.state.IsPaymentMethodSave == 1) {
                if (this.state.paymentGatewatToken == "") {
                    this.refs.defaultToastBottomWithDifferentColor.ShowToastFunction("Please select card");
                    // this.dropdown.alertWithType('error', 'Error', "Please select card");
                    this.setState({ selectedPaymentMethod: "" });
                    return false;
                } else {
                    this.setState({
                        modalPaymentType: false
                    });
                }
            } else {
                var constraints = {

                    user_name: {
                        presence: {
                            allowEmpty: false,
                            message: "^ name required"
                        },
                        format: {
                            pattern: "[A-Za-z ]+",
                            flags: "i",
                            message: "^ only characters"
                        }
                    },

                    card_number: {
                        presence: {
                            allowEmpty: true,
                            message: "^ Card number required"
                        },
                        format: {
                            pattern: "[0-9]{16}",
                            flags: "i",
                            message: "^ 16 digit card number required."
                        },
                    },
                    month: {
                        presence: {
                            allowEmpty: false,
                            message: "^ Month is required"
                        },
                    },
                    year: {
                        presence: {
                            allowEmpty: false,
                            message: "^ Year is required"
                        },
                    },
                    cvv: {
                        presence: {
                            allowEmpty: true,
                            message: "^ cvv required"
                        },
                        format: {
                            pattern: "[0-9]{3}",
                            flags: "i",
                            message: "^ 3 digit cvv required."
                        },
                    }
                };
                Keyboard.dismiss();
                const result = validate({ user_name: this.state.user_name, card_number: this.state.card_number, month: this.state.month, year: this.state.year, cvv: this.state.cvv }, constraints);

                if (result) {

                    if (this.state.user_name == '' && this.state.card_number == '' && this.state.month == '' && this.state.year == '' && this.state.cvv == '') {
                        this.refs.defaultToastBottomWithDifferentColor.ShowToastFunction("Select payment type");
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
                                            this.setState({ modalPaymentType: false })
                                        })
                                        .catch((error) => {
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
                                    this.setState({ loader: true });
                                    var response = savePaymentAction(cardSaveData, Token).then(function (responseJson) {
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
                            }
                        })
                        .catch((error) => {
                        })
                }
            }
        }

    }



    render() {
        const swipeButtonIcon = () => (
            // <Icon name="facebook" color="#3b5998" size={30} />
            <Image
                source={require("../../images/Service.png")}
                style={{ width: normalize(35), height: normalize(35) }}
            />
        );
        const { residentialEnable, commercialEnable, cardList, selectedsubcategoryimage, ServiceTypeSelectedName, selectedsubcategoryname, paymentInfo, serviceCost, itbms, currency_symbol, sub_total, lastcollapsid, getCapacity, setDatePickerVisibility, selectedHours, selectedMinutes, ServiceTypeSelected, loader, dataSource, walletBox, cashBox, cvv, card_number, user_name, IsPaymentMethodSave, modalPaymentType, service_date, service_time, collapsed, installation_collapsed, Maintenance_collapsed, installation, Maintenance, service, modalVisible, timeModalVisible, modalList, service_category } = this.state;
        const { month, year } = this.state;
        const { selectedStartDate } = this.state;
        const { selectedTime } = this.state;
        const minDate = new Date(2018, 1, 1); // Min date
        const maxDate = new Date(2050, 6, 3); // Max date
        const startDate = selectedStartDate ? selectedStartDate.toString() : ''; //Start date
        const startTime = selectedTime ? selectedTime.toString() : ''; //Start date
        let {
            dbServiceList,
            ServiceListSelected,
        } = this.state;

        const serviceTypes = [];
        for (let userObject of this.state.dbServiceList) {
            serviceTypes.push({ label: userObject.type, value: userObject.id, className: userObject.category_name });
        }

        const { navigate } = this.props.navigation;
        const { search, userData } = this.state;
        let React_Native_Rating_Bar_B = [];

        React_Native_Rating_Bar_B.push(
            <TouchableOpacity style={{ alignItems: 'center' }}
                activeOpacity={1.7}
                key='b'
                onPress={this.UpdateRatingB.bind(this)}>
                <Image
                    style={styles.StarImage}
                    source={(
                        // i <= dataSource.handyman_rating
                        // i <= this.state.review
                        this.state.FavLocationB
                            ? (require('../../images/heart-red.png'))
                            : (require('../../images/heart-gray.png'))
                    )}
                />
            </TouchableOpacity>
        );

        if (!loader) {
            return (

                <View style={styles.container}>
                    <NavigationEvents
                        onWillFocus={this._onFocus}
                        onWillBlur={this._onBlurr}
                    />
                    <StatusBar />
                    <Row style={styles.Navebar}>

                        <Col style={styles.arrow_col}>

                            <TouchableOpacity onPress={() => navigate('Service')} >
                                <Image source={require('../../images/Back-Arrow.png')} style={styles.BackArrow} />
                            </TouchableOpacity>
                        </Col>

                        <Col style={styles.menu_col}>
                            <TouchableOpacity style={{ alignItems: 'flex-end' }} onPress={this.toggleDrawer.bind(this)}>
                                <Image source={require('../../images/Menu.png')} style={styles.Menu} />
                            </TouchableOpacity>
                        </Col>
                    </Row>

                    <ScrollView
                        keyboardShouldPersistTaps="handled"
                    >
                        <Row style={{ height: normalize(35), }}>
                            <Col style={{ width: normalize(75), justifyContent: 'center', paddingLeft: normalize(25) }}>
                                <Text style={{ fontSize: 22, fontFamily: 'Inter-Black' }}>{t('Hello')}</Text>
                            </Col>
                            <Col style={{ justifyContent: 'center', }}>
                                <Text style={{ fontSize: 22, fontFamily: 'Inter-Black', color: 'red', }} numberOfLines={1}>{userData.first_name}</Text>
                            </Col>
                        </Row>
                        <Row style={{ height: normalize(35), alignItems: 'flex-start', paddingLeft: normalize(23) }}>
                            <Text style={{ fontSize: 24, fontFamily: 'Inter-Black', }}>{t('Create your Service appointment')}</Text>
                        </Row>


                        <Col>
                            <Row style={styles.LocationB}>
                                <Col style={{ width: normalize(55), paddingLeft: normalize(13), paddingTop: normalize(5) }}>
                                    <Image source={require('../../images/Location-B.png')} style={styles.Listlogo} />
                                </Col>
                                <Col>
                                    <GooglePlacesAutocomplete
                                        ref={ref => { this.BPointref = ref }}
                                        placeholder={this.state.destinationLocationText}
                                        placeholderTextColor={'#000'}
                                        query={{
                                            key: GOOGLE_MAPS_APIKEY,
                                            // language: 'en', // language of the results
                                            // components: 'country:in',
                                            types: 'establishment',
                                            radius: "1000 meters",
                                            // for panama    
                                            language: 'es', // language of the results
                                            components: 'country:pa',
                                        }}
                                        onPress={(data, details = null) => { this.pointMarkerBySearchB(data, details) }}
                                        onFail={error => console.error(error)}
                                        minLength={2}
                                        autoFocus={false}
                                        numberOfLines={2}
                                        listViewDisplayed="true"
                                        returnKeyType={'default'}
                                        fetchDetails={true}
                                        showsUserLocation={true}
                                        nearbyPlacesAPI={GOOGLE_MAPS_APIKEY}
                                        enablePoweredByContainer={false}
                                        setAddressText={this.state.destinationLocationText}


                                        styles={{
                                            ...Platform.select({
                                                ios: {
                                                    container: {
                                                        backgroundColor: '#efefef',
                                                        // top: 50,
                                                        width: '100%',
                                                    },
                                                    textInputContainer: {
                                                        backgroundColor: '#efefef',
                                                        borderTopWidth: 0,
                                                        borderBottomWidth: 0,
                                                        // width: '90%',


                                                    },
                                                    textInput: {
                                                        marginLeft: 0,
                                                        marginRight: 0,
                                                        // height: 30,
                                                        color: '#5d5d5d',
                                                        fontSize: 16,
                                                        padding: 10,
                                                        backgroundColor: '#efefef',
                                                        fontFamily: "Inter-Black",

                                                    },
                                                    description: {
                                                        fontFamily: "Inter-Black",
                                                        color: "#404043"
                                                    },
                                                },
                                                android: {
                                                    container: {
                                                        backgroundColor: '#efefef',
                                                        // top: 50,
                                                        width: '100%',


                                                    },
                                                    textInputContainer: {
                                                        backgroundColor: '#efefef',
                                                        borderTopWidth: 0,
                                                        borderBottomWidth: 0,
                                                        // width: '90%',

                                                    },
                                                    textInput: {
                                                        marginLeft: 0,
                                                        marginRight: 0,
                                                        // height: 30,
                                                        fontSize: 16,
                                                        // padding: 10,
                                                        fontFamily: "Inter-Black",
                                                        backgroundColor: '#efefef'
                                                    },
                                                    description: {
                                                        fontFamily: "Inter-Black",
                                                    },
                                                }
                                            })
                                        }}
                                    />
                                </Col>
                                <Col style={styles.ArrowCol}>
                                    <Image source={require('../../images/Right_Arrow_New.png')} style={styles.StarImage} />
                                </Col>
                            </Row>
                        </Col>



                        <Collapse style={styles.service_colls}
                            isCollapsed={this.state.collapsed}
                            onToggle={(isCollapsed) => this.setState({ collapsed: isCollapsed })}>
                            <CollapseHeader>

                                <Row style={styles.service_row}>
                                    <Col style={styles.service_Img}>
                                        {ServiceTypeSelected ? (
                                            <Image style={{ height: normalize(32), width: normalize(32) }}
                                                source={ServiceTypesIcon[this.state.ServiceTypeSelectedImage]} />
                                        ) : (
                                                <Image style={{ height: normalize(32), width: normalize(32) }}
                                                    source={require('../../images/service_types/Settings.png')}
                                                />
                                            )}

                                    </Col>
                                    <Col>
                                        {ServiceTypeSelected ? (
                                            <Text style={styles.service_name}>{this.state.ServiceTypeSelectedName}</Text>
                                        ) : (
                                                <Text style={styles.service_name}>{t('Select the Specialty')}</Text>
                                            )}

                                    </Col>
                                    <Col style={styles.down_arrow}>
                                        <Image style={{ height: normalize(16), width: normalize(16) }}
                                            source={require('../../images/Down_Arrow.png')}
                                        />
                                    </Col>
                                </Row>
                            </CollapseHeader>

                            <CollapseBody style={{ marginLeft: normalize(20), paddingBottom: 10 }}>

                                {this.state.ServiceTypes.map(((item) => (
                                    <TouchableOpacity onPress={() => this.SelectedService(item.id, item.type, item.label)}>

                                        <View style={{ flexDirection: 'row', }}>
                                            {/* <ScrollView> */}
                                            <Row style={{ marginTop: 15 }}>
                                                <Image source={ServiceTypesIcon[item.type]} style={styles.body_Img} />
                                                <Text style={{ fontSize: 20, fontFamily: 'Inter-Black', marginLeft: 10 }}>{item.label}</Text>
                                                {/* <Text>{item.type}</Text>  */}
                                            </Row>
                                        </View>
                                    </TouchableOpacity>
                                )))}
                            </CollapseBody>

                        </Collapse>

                        <Collapse style={styles.detail_colls}>
                            <CollapseHeader>
                                <Row style={styles.detail_row}>

                                    <Col style={styles.service_Img}>
                                        {service == 'residential' ? (
                                            <Image style={{ height: normalize(32), width: normalize(32) }}
                                                source={require('../../images/Residential.png')}
                                            />
                                        ) : (
                                                <Image style={{ height: normalize(32), width: normalize(32) }}
                                                    source={require('../../images/Commercial.png')}
                                                />
                                            )}
                                    </Col>
                                    <Col style={styles.detail_col}>
                                        {selectedsubcategoryname ? (
                                            <Text style={styles.detail_name}>{selectedsubcategoryname}</Text>
                                        ) : (
                                                <Text style={styles.detail_name}>{t('Detail your service')}</Text>
                                            )}
                                    </Col>
                                    <Col style={styles.down_arrow}>
                                        <Image style={{ height: normalize(16), width: normalize(16) }}
                                            source={require('../../images/Down_Arrow.png')}
                                        />
                                    </Col>


                                </Row>
                            </CollapseHeader>
                            <CollapseBody>
                                <Row style={{ height: normalize(50), paddingLeft: normalize(15), marginTop: normalize(5), borderBottomWidth: 1, borderColor: '#e5e5e5' }}>
                                    {residentialEnable ? (
                                        <Col style={{ flexDirection: 'row', alignItems: 'center', width: normalize(170), justifyContent: 'flex-start', }}>
                                            <View style={styles.radio}>

                                                <RadioButton style={{ borderWidth: Platform.OS === 'ios' ? '#1A87BA' : '#1A87BA', uncheckedColor: Platform.OS === 'ios' ? '#1A87BA' : '#1A87BA' }}
                                                    value='residential'
                                                    color='#1A87BA'
                                                    uncheckedColor='#1A87BA'
                                                    status={service === 'residential' ? 'checked' : 'unchecked'}
                                                    onPress={() => this.SelectPlace('residential')}

                                                />


                                            </View>
                                            <Text style={{ fontSize: 15, fontFamily: 'Inter-Black', }}>
                                                {t('Residential')}</Text>
                                            <Col style={{ justifyContent: 'flex-start', paddingLeft: normalize(5), paddingTop: normalize(5), height: normalize(50) }}>
                                                <Image style={{ height: normalize(30), width: normalize(30) }}
                                                    source={require('../../images/Residential.png')}
                                                />
                                            </Col>
                                        </Col>
                                    ) : (
                                            <View></View>
                                        )}
                                    {commercialEnable ? (
                                        <Col style={{ flexDirection: 'row', alignItems: 'center', }}>
                                            <View style={styles.radio}>
                                                <RadioButton style={{ borderWidth: Platform.OS === 'ios' ? '#1A87BA' : '#1A87BA', uncheckedColor: Platform.OS === 'ios' ? '#1A87BA' : '#1A87BA' }}
                                                    value='commercial'
                                                    color='#1A87BA'
                                                    uncheckedColor='#1A87BA'
                                                    status={service === 'commercial' ? 'checked' : 'unchecked'}
                                                    // onPress={() => this.setState({ service: 'commercial' })}
                                                    onPress={() => this.SelectPlace('commercial')}
                                                />
                                            </View>

                                            <Text style={{ fontSize: 15, fontFamily: 'Inter-Black', }}>
                                                {t('Commercial')}</Text>
                                            <Col style={{ justifyContent: 'flex-start', paddingLeft: normalize(5), paddingTop: normalize(5), height: normalize(50) }}>
                                                <Image style={{ height: normalize(28), width: normalize(28) }}
                                                    source={require('../../images/Commercial.png')}
                                                />
                                            </Col>
                                        </Col>
                                    ) : (
                                            <View></View>
                                        )}
                                </Row>

                                {this.state.ServiceSubCategory.map(((item) => (
                                    <Collapse
                                        // isCollapsed={this.state[item.id + '_collapsed']}
                                        isCollapsed={lastcollapsid == item.id ? true : false}
                                        onToggle={() => this.Capacity(item.id, item.label, item.type)}
                                        style={{ marginTop: normalize(15), paddingLeft: normalize(26) }}>
                                        {(installation_collapsed == true) ? (
                                            <CollapseHeader>
                                                {/* <TouchableOpacity onPress={() => this.Capacity(item.id)}> */}
                                                <Row style={{ height: normalize(25), marginTop: normalize(5), alignItems: 'center', }}>
                                                    <Col style={{ justifyContent: 'flex-start', width: normalize(40) }}>
                                                        {/* <Image style={{ height: normalize(25), width: normalize(25) }}
                                                        source={require('../../images/installation.png')}
                                                    /> */}

                                                        <Image source={ServiceSubCategoryIcon[item.type]} style={styles.body_Img} />

                                                    </Col>
                                                    <Col style={{ width: normalize(180), }}>
                                                        <Text style={{ fontSize: 20, fontFamily: 'Inter-Black', marginLeft: 10 }}>{item.label}</Text>
                                                    </Col>
                                                    <Col style={styles.down_arrow}>
                                                        <Image style={{ height: normalize(16), width: normalize(16) }}
                                                            source={require('../../images/right_blue_arrow.png')}
                                                        />
                                                    </Col>
                                                </Row>
                                                {/* </TouchableOpacity> */}
                                            </CollapseHeader>) : (<CollapseHeader>
                                                {/* <TouchableOpacity onPress={() => this.Capacity(item.id)}> */}
                                                <Row style={{ height: normalize(25), marginTop: normalize(5), alignItems: 'center', }}>
                                                    <Col style={{ justifyContent: 'flex-start', width: normalize(40) }}>
                                                        {/* <Image style={{ height: normalize(25), width: normalize(25) }}
                                                        source={require('../../images/installation.png')}
                                                    /> */}
                                                        <Image source={ServiceSubCategoryIcon[item.type]} style={styles.body_Img} />
                                                    </Col>
                                                    <Col style={{ width: normalize(180), }}>
                                                        <Text style={{ fontSize: 20, fontFamily: 'Inter-Black', marginLeft: 10 }}>{item.label}</Text>
                                                    </Col>
                                                    <Col style={styles.down_arrow}>
                                                        <Image style={{ height: normalize(16), width: normalize(16) }}
                                                            source={require('../../images/Down_Arrow.png')}
                                                        />
                                                    </Col>
                                                </Row>
                                                {/* </TouchableOpacity> */}
                                            </CollapseHeader>)}

                                        <CollapseBody>
                                            {
                                                this.state.getCapacity.map(((capacity) => (

                                                    <Col style={{ marginTop: normalize(15), }}>
                                                        <Row style={{ height: normalize(30), justifyContent: 'center', alignItems: 'center', }}>
                                                            <Col style={{ flexDirection: 'row', width: normalize(50), }}>
                                                                <View style={styles.radio}>
                                                                    <RadioButton style={{ borderWidth: Platform.OS === 'ios' ? '#1A87BA' : '#1A87BA', uncheckedColor: Platform.OS === 'ios' ? '#1A87BA' : '#1A87BA' }}
                                                                        value="9.000 BTU"
                                                                        color='#1A87BA'
                                                                        uncheckedColor='#1A87BA'
                                                                        status={this.state.selectedcapacityid === capacity.id ? 'checked' : 'unchecked'}
                                                                        onPress={() => this.setState({ selectedcapacityid: capacity.id })}
                                                                    />
                                                                </View>
                                                            </Col>
                                                            <Col>
                                                                <Text style={{ fontSize: 15, fontFamily: 'Inter-Black', }}>{capacity.type}</Text>
                                                            </Col>
                                                        </Row>
                                                        {capacity.id == 19 ? (
                                                            <View style={{ marginTop: normalize(15) }}>
                                                                <Row>
                                                                    <Text style={{ fontFamily: 'Inter-Black', color: 'red', fontSize: 12 }}>{t("The general technical visit does not include required spare parts for repair, only general technical diagnosis")}</Text>
                                                                </Row>
                                                                <Row style={{ marginTop: normalize(15) }}>
                                                                    <Text style={{ fontFamily: 'Inter-Black', color: 'red', fontSize: 12 }}>{t("If you want to carry out the complete service in total to pay will be discounted the cost of the general technical visit")}</Text>
                                                                </Row>
                                                            </View>
                                                        ) : (
                                                                <View>

                                                                </View>
                                                            )}
                                                        {capacity.id == 20 ? (
                                                            <View style={{ marginTop: normalize(15) }}>
                                                                <Row>
                                                                    <Text style={{ fontFamily: 'Inter-Black', color: 'red', fontSize: 12 }}>{t("The general technical visit does not include required spare parts for repair, only general technical diagnosis")}</Text>
                                                                </Row>
                                                                <Row style={{ marginTop: normalize(15) }}>
                                                                    <Text style={{ fontFamily: 'Inter-Black', color: 'red', fontSize: 12 }}>{t("If you want to carry out the complete service in total to pay will be discounted the cost of the general technical visit")}</Text>
                                                                </Row>
                                                            </View>
                                                        ) : (
                                                                <View>

                                                                </View>
                                                            )}


                                                    </Col>
                                                )))}



                                            {/* <Row style={{ height: normalize(25), paddingLeft: normalize(8), marginTop: normalize(8) }}>
                                                <Col style={{ flexDirection: 'row', alignItems: 'center', width: normalize(130), justifyContent: 'flex-start', }}>
                                                    <View style={styles.radio}>
                                                        <RadioButton style={{ borderWidth: Platform.OS === 'ios' ? '#1A87BA' : '#1A87BA', uncheckedColor: Platform.OS === 'ios' ? '#1A87BA' : '#1A87BA' }}
                                                            value="12.000 BTU"
                                                            color='#1A87BA'
                                                            uncheckedColor='#1A87BA'
                                                            status={installation === '12.000 BTU' ? 'checked' : 'unchecked'}
                                                            onPress={() => this.setState({ installation: '12.000 BTU' })}
                                                        />
                                                    </View>
                                                    <Text style={{ fontSize: 15, fontFamily: 'Inter-Black', }}>12.000 BTU</Text>
                                                </Col>
                                                <Col style={{ flexDirection: 'row', alignItems: 'center', }}>
                                                    <RadioButton style={{ borderWidth: Platform.OS === 'ios' ? '#1A87BA' : '#1A87BA', uncheckedColor: Platform.OS === 'ios' ? '#1A87BA' : '#1A87BA' }}
                                                        value='24.000 BTU'
                                                        color='#1A87BA'
                                                        uncheckedColor='#1A87BA'
                                                        status={installation === '24.000 BTU' ? 'checked' : 'unchecked'}
                                                        onPress={() => this.setState({ installation: '24.000 BTU' })}
                                                    />
                                                    <Text style={{ fontSize: 15, fontFamily: 'Inter-Black', }}>24.000 BTU</Text>
                                                </Col>
                                            </Row> */}
                                        </CollapseBody>
                                    </Collapse>

                                )))}

                                {/* <Row style={{ height: normalize(40), paddingLeft: normalize(26), marginTop: normalize(10), justifyContent: 'center', alignItems: 'center' }}>
                                <Col style={{ width: normalize(40), }}>
                                    <Image style={{ height: normalize(25), width: normalize(25) }}
                                        source={require('../../images/Service.png')}
                                    />
                                </Col>
                                <Col style={{ width: normalize(192) }}>
                                    <Text style={{ fontSize: 20, fontFamily: 'Inter-Black', }}>{t('Maintenance')}</Text>
                                </Col>
                                <Col>
                                    <Image style={{ height: normalize(15), width: normalize(15) }}
                                        source={require('../../images/Down_Arrow.png')}
                                    />
                                </Col>
                            </Row> */}
                                {/* <Collapse
                                    isCollapsed={this.state.Maintenance_collapsed}
                                    onToggle={(isCollapsed) => this.setState({ Maintenance_collapsed: !this.state.Maintenance_collapsed })}
                                    style={{ marginTop: normalize(10), paddingLeft: normalize(26) }}>
                                    {(Maintenance_collapsed == true) ? (
                                        <CollapseHeader>
                                            <Row style={{ height: normalize(40), justifyContent: 'center', alignItems: 'center' }}>
                                                <Col style={{ width: normalize(40), }}>
                                                    <Image style={{ height: normalize(25), width: normalize(25) }}
                                                        source={require('../../images/Service.png')}
                                                    />
                                                </Col>
                                                <Col style={{ width: normalize(192) }}>
                                                    <Text style={{ fontSize: 20, fontFamily: 'Inter-Black', }}>{t('Maintenance')}</Text>
                                                </Col>
                                                <Col>
                                                    <Image style={{ height: normalize(15), width: normalize(15) }}
                                                        source={require('../../images/right_blue_arrow.png')}
                                                    />
                                                </Col>
                                            </Row>
                                        </CollapseHeader>) : (<CollapseHeader>
                                            <Row style={{ height: normalize(40), justifyContent: 'center', alignItems: 'center' }}>
                                                <Col style={{ width: normalize(40), }}>
                                                    <Image style={{ height: normalize(25), width: normalize(25) }}
                                                        source={require('../../images/Service.png')}
                                                    />
                                                </Col>
                                                <Col style={{ width: normalize(192) }}>
                                                    <Text style={{ fontSize: 20, fontFamily: 'Inter-Black', }}>{t('Maintenance')}</Text>
                                                </Col>
                                                <Col>
                                                    <Image style={{ height: normalize(15), width: normalize(15) }}
                                                        source={require('../../images/Down_Arrow.png')}
                                                    />
                                                </Col>
                                            </Row>
                                        </CollapseHeader>)}

                                    <CollapseBody>
                                        <Row style={{ height: normalize(25), paddingLeft: normalize(8), marginTop: normalize(15), }}>
                                            <Col style={{ flexDirection: 'row', alignItems: 'center', width: normalize(130), justifyContent: 'flex-start', }}>
                                                <RadioButton style={{ borderWidth: Platform.OS === 'ios' ? '#1A87BA' : '#1A87BA', uncheckedColor: Platform.OS === 'ios' ? '#1A87BA' : '#1A87BA' }}
                                                    value="9.000 BTU"
                                                    color='#1A87BA'
                                                    uncheckedColor='#1A87BA'
                                                    status={Maintenance === '9.000 BTU' ? 'checked' : 'unchecked'}
                                                    onPress={() => this.setState({ Maintenance: '9.000 BTU' })}
                                                />
                                                <Text style={{ fontSize: 15, fontFamily: 'Inter-Black', }}>9.000 BTU</Text>
                                            </Col>
                                            <Col style={{ flexDirection: 'row', alignItems: 'center', }}>
                                                <RadioButton style={{ borderWidth: Platform.OS === 'ios' ? '#1A87BA' : '#1A87BA', uncheckedColor: Platform.OS === 'ios' ? '#1A87BA' : '#1A87BA' }}
                                                    value='18.000 BTU'
                                                    color='#1A87BA'
                                                    uncheckedColor='#1A87BA'
                                                    status={Maintenance === '18.000 BTU' ? 'checked' : 'unchecked'}
                                                    onPress={() => this.setState({ Maintenance: '18.000 BTU' })}
                                                />
                                                <Text style={{ fontSize: 15, fontFamily: 'Inter-Black', }}>18.000 BTU</Text>
                                            </Col>
                                        </Row>
                                        <Row style={{ height: normalize(25), paddingLeft: normalize(8), marginTop: normalize(8) }}>
                                            <Col style={{ flexDirection: 'row', alignItems: 'center', width: normalize(130), justifyContent: 'flex-start', }}>
                                                <RadioButton style={{ borderWidth: Platform.OS === 'ios' ? '#1A87BA' : '#1A87BA', uncheckedColor: Platform.OS === 'ios' ? '#1A87BA' : '#1A87BA' }}
                                                    value="12.000 BTU"
                                                    color='#1A87BA'
                                                    uncheckedColor='#1A87BA'
                                                    status={Maintenance === '12.000 BTU' ? 'checked' : 'unchecked'}
                                                    onPress={() => this.setState({ Maintenance: '12.000 BTU' })}
                                                />
                                                <Text style={{ fontSize: 15, fontFamily: 'Inter-Black', }}>12.000 BTU</Text>
                                            </Col>
                                            <Col style={{ flexDirection: 'row', alignItems: 'center', }}>
                                                <RadioButton style={{ borderWidth: Platform.OS === 'ios' ? '#1A87BA' : '#1A87BA', uncheckedColor: Platform.OS === 'ios' ? '#1A87BA' : '#1A87BA' }}
                                                    value='24.000 BTU'
                                                    color='#1A87BA'
                                                    uncheckedColor='#1A87BA'
                                                    status={Maintenance === '24.000 BTU' ? 'checked' : 'unchecked'}
                                                    onPress={() => this.setState({ Maintenance: '24.000 BTU' })}
                                                />
                                                <Text style={{ fontSize: 15, fontFamily: 'Inter-Black', }}>24.000 BTU</Text>
                                            </Col>
                                        </Row>
                                    </CollapseBody>
                                </Collapse> */}
                                <TouchableOpacity onPress={() => this.getCost()}>
                                    <Row style={{ height: normalize(30), marginTop: normalize(35), justifyContent: 'center', marginBottom: normalize(30) }}>
                                        <Col style={{ backgroundColor: '#1987B8', width: normalize(130), borderRadius: normalize(12), justifyContent: 'center', alignItems: 'center', }}>
                                            <Text style={{ fontSize: 18, fontFamily: 'Inter-Black', color: '#FFFFFF', }}>{t('Confirm')}</Text>
                                        </Col>
                                    </Row>
                                </TouchableOpacity>
                            </CollapseBody>
                        </Collapse>

                        <Row style={styles.notes_Row}>

                            <Col style={styles.Logo_Container}>
                                <Image source={require('../../images/Notas.png')} style={styles.Listlogo} />
                            </Col>
                            <Col style={{ marginTop: normalize(10), marginLeft: normalize(20), marginRight: normalize(35) }}>
                                <Row style={{ height: normalize(25) }}>
                                    <Text style={{ fontFamily: 'Inter-Black', fontSize: 20 }}>{t('Additional notes')}</Text>
                                </Row>
                                <Col style={styles.Dropdown_Container}>
                                    <TextInput style={styles.notes_Input}
                                        placeholderTextColor={'#808080'}
                                        multiline={true}
                                        numberOfLines={4}
                                        onChangeText={(notes) => this.setState({ notes })}>
                                    </TextInput>
                                </Col>
                            </Col>
                        </Row>
                        {Platform.OS === 'ios' ? (

                            <Row style={{ height: normalize(45), marginTop: normalize(15), marginLeft: normalize(20), marginRight: normalize(20), }}>

                                    <TouchableOpacity style={{ backgroundColor: '#efefef', borderRadius: normalize(30), width: normalize(150), marginRight: normalize(33), justifyContent: 'center', alignItems: 'center', }}>
                                        <DateTimePicker
                                            date={this.state.date}
                                            mode="date"
                                            placeholder={t("Date")}
                                            format="DD-MM-YYYY"
                                            minDate={new Date()}
                                            // maxDate="2020-08-21"
                                            confirmBtnText="Confirm"
                                            cancelBtnText="Cancel"

                                            customStyles={{

                                                dateIcon: {
                                                    position: 'absolute',
                                                    left: 0,
                                                    top: 4,
                                                    width: 0,
                                                    height: 0,
                                                    // marginLeft: 0
                                                },
                                                placeholderText: {
                                                    fontSize: 20,
                                                    fontFamily: 'Inter-Black',
                                                    color: '#000'
                                                },
                                                dateText: {
                                                    fontSize: 20,
                                                    fontFamily: 'Inter-Black',
                                                    color: '#000'
                                                },
                                                dateInput: {
                                                    borderRadius: 20,
                                                    borderColor: '#efefef',
                                                }
                                                // ... You can check the source to find the other keys.
                                            }}
                                            onDateChange={(date) => { this.setState({ date: date }) }}
                                        />
                               </TouchableOpacity>

                                    <TouchableOpacity style={{ backgroundColor: '#efefef', borderRadius: normalize(30), width: normalize(150), justifyContent: 'center', alignItems: 'center', }}>

                                        <DateTimePicker
                                            date={this.state.time}
                                            mode="time"
                                            placeholder={t("Time")}
                                            placeholderTextColor={'#000'}
                                            // format="HH:MM a"
                                            // minDate="21-08-2020"
                                            // maxDate="21-08-2020"
                                            confirmBtnText="Confirm"
                                            cancelBtnText="Cancel"
                                            // componentId="DateSensor"
                                            customStyles={{
                                                dateIcon: {
                                                    position: 'absolute',
                                                    left: 0,
                                                    top: 4,
                                                    width: 0,
                                                    height: 0,
                                                    // marginLeft: 0
                                                },
                                                placeholderText: {
                                                    fontSize: 20,
                                                    fontFamily: 'Inter-Black',
                                                    color: '#000'
                                                },
                                                dateText: {
                                                    fontSize: 20,
                                                    fontFamily: 'Inter-Black',
                                                    color: '#000'
                                                },
                                                dateInput: {
                                                    borderRadius: 20,
                                                    borderColor: '#efefef',
                                                }
                                                // ... You can check the source to find the other keys.
                                            }}
                                            onDateChange={(time) => { this.setState({ time: time }) }}

                                        />


                                    </TouchableOpacity>
                            </Row>
                        ) : (
                                <Row style={{ height: normalize(45), marginTop: normalize(15), marginLeft: normalize(20), marginRight: normalize(20), }}>
                                    <Col style={{ backgroundColor: '#efefef', borderRadius: normalize(30), width: normalize(150), marginRight: normalize(43), justifyContent: 'center', alignItems: 'center', }}>
                                        <TouchableOpacity onPress={() => { this.setModalVisible(true) }}>
                                            <Text style={{ fontSize: 20, fontFamily: 'Inter-Black', }}>{this.state.selectedServiceDate}</Text>
                                        </TouchableOpacity>
                                        {modalVisible && (
                                            <DateTimePickerModal
                                                // testID="dateTimePicker"
                                                value={today}
                                                mode={'date'}
                                                minDate={moment(today).add(1, 'day').format('DD-MM-YYYY')}
                                                display="default"
                                                // format="DD/MM/YYYY"
                                                onChange={(event, date) => this.handleConfirmDate(event, date,)}
                                                onCancel={this.hideDatePicker}
                                                customStyles={{
                                                    dateIcon: {
                                                        position: 'absolute',
                                                        left: 0,
                                                        top: 4,
                                                        width: 0,
                                                        height: 0,
                                                        // marginLeft: 0
                                                    },
                                                    dateInput: {
                                                        borderRadius: 20,
                                                        borderColor: '#000',
                                                        borderStyle: 'dashed',
                                                        width: 0,
                                                    }
                                                    // ... You can check the source to find the other keys.
                                                }}
                                            />
                                        )}
                                        <Col style={{ position: 'absolute', paddingLeft: normalize(110), paddingTop: normalize(5) }}>
                                            <Image style={{ height: normalize(16), width: normalize(16) }}
                                                source={require('../../images/Down_Arrow.png')}
                                            />
                                        </Col>
                                    </Col>
                                    <Col style={{ backgroundColor: '#efefef', borderRadius: normalize(30), width: normalize(150), marginRight: normalize(43), justifyContent: 'center', alignItems: 'center', }}>
                                        <TouchableOpacity onPress={() => { this.setTimeModalVisible(true) }}>
                                            <Text style={{ fontSize: 20, fontFamily: 'Inter-Black', }}>{this.state.selectedServiceTime}</Text>
                                        </TouchableOpacity >
                                        {timeModalVisible && (
                                            <DateTimePickerModal
                                                value={today}
                                                mode={'time'}
                                                display="default"
                                                onChange={(event, time) => this.handleConfirmTime(event, time)}
                                                onCancel={this.hideDatePicker}
                                                customStyles={{
                                                    dateIcon: {
                                                        position: 'absolute',
                                                        left: 0,
                                                        top: 4,
                                                        width: 0,
                                                        height: 0,
                                                        // marginLeft: 0
                                                    },
                                                    dateInput: {
                                                        borderRadius: 20,
                                                        borderColor: '#000',
                                                        borderStyle: 'dashed',
                                                        width: 0,
                                                    }
                                                    // ... You can check the source to find the other keys.
                                                }}
                                            />
                                        )}
                                        <Col style={{ position: 'absolute', paddingLeft: normalize(110), paddingTop: normalize(5) }}>
                                            <Image style={{ height: normalize(16), width: normalize(16) }}
                                                source={require('../../images/Down_Arrow.png')}
                                            />
                                        </Col>
                                    </Col>
                                </Row>
                            )}
                        <Row style={{ height: normalize(20), marginLeft: normalize(40), marginTop: normalize(10), marginBottom: normalize(10) }}>
                            <Text style={{ color: 'red', fontSize: 11, fontFamily: 'Inter-Black', }}>{t('All appointments must be requested with an advance (24) hours')}</Text>
                        </Row>
                        {!this.state.selectedPaymentMethod == '' ? (
                            <View>
                                <TouchableOpacity onPress={() => { this.setModalPaymentType(true); }}>
                                    <Row style={styles.payment_row}>
                                        {this.state.selectedPaymentMethod == "card" ? (
                                            <Col style={styles.payment_Img}>
                                                <Image style={{ height: normalize(32), width: normalize(32) }}
                                                    source={require('../../images/card.png')}
                                                />
                                            </Col>
                                        ) : (
                                                <Col style={styles.payment_Img}>
                                                    <Image style={{ height: normalize(32), width: normalize(32) }}
                                                        source={require('../../images/Logo2.png')}
                                                    />
                                                </Col>
                                            )}

                                        <Col>
                                            <Text style={styles.payment_name}>{this.state.selectedPaymentMethod}</Text>
                                        </Col>
                                        <Col style={styles.down_arrow}>
                                            <Image style={{ height: normalize(16), width: normalize(16) }}
                                                source={require('../../images/Right_Arrow_New.png')}
                                            />
                                        </Col>
                                    </Row>
                                </TouchableOpacity>
                            </View>
                        ) : (
                                <View>
                                    <TouchableOpacity onPress={() => { this.setModalPaymentType(true); }}>
                                        <Row style={styles.payment_row}>
                                            <Col style={styles.payment_Img}>
                                                <Image style={{ height: normalize(32), width: normalize(32) }}
                                                    source={require('../../images/card.png')}
                                                />
                                            </Col>
                                            <Col>
                                                <Text style={styles.payment_name}>{t('Payment method')}</Text>
                                            </Col>
                                            <Col style={styles.down_arrow}>
                                                <Image style={{ height: normalize(16), width: normalize(16) }}
                                                    source={require('../../images/Right_Arrow_New.png')}
                                                />
                                            </Col>
                                        </Row>
                                    </TouchableOpacity>
                                </View>
                            )}

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

                                            <Col style={{ width: "20%", alignItems: 'flex-end', paddingRight: 20 }}>
                                                <TouchableOpacity onPress={() => { this.setModalPaymentType(!modalPaymentType); }} >
                                                    <Text style={styles.popupCrossTextIcon}>X</Text>
                                                    {/* <Image source={require('../../images/Close.png')} style={styles.Close} /> */}
                                                </TouchableOpacity>
                                            </Col>
                                        </Row>
                                        {IsPaymentMethodSave == 1 ? (
                                            <View>
                                                <Col style={styles.Accordion2}>
                                                    <Row style={styles.ModalNotes}>
                                                        <Col style={{ justifyContent: 'center', width: "10%", }}>
                                                            <Image source={require('../../images/card.png')} style={styles.CardIcon} />
                                                        </Col>
                                                        <Col>
                                                            <Dropdown
                                                                style={{ height: 30, backgroundColor: "#fff" }}
                                                                inputContainerStyle={{ borderBottomColor: 'transparent' }}
                                                                placeholder={t('Select card')}
                                                                underlineColor={'#fff'}
                                                                placeholderTextColor={'#8f8f8f'}

                                                                // tintColor={'#000000'}
                                                                valueExtractor={({ value }) => value}
                                                                value={this.state.paymentGatewatToken}
                                                                onChangeText={(value) => { this.setState({ paymentGatewatToken: value, walletBox: 0, cashBox: 0, selectedPaymentMethod: 'card', userInputCashAmount: '', amount: 0.00 }) }}
                                                                data={cardList}
                                                                underlineColor={'#fff'}
                                                            >
                                                            </Dropdown>
                                                        </Col>
                                                        <Col style={{ alignItems: 'flex-end', justifyContent: 'center', width: "10%" }}>
                                                            <Image source={require('../../images/Blue-Arrow.png')} style={styles.DownArrow} />
                                                        </Col>
                                                    </Row>
                                                </Col>
                                            </View>
                                        ) : (
                                                <View>
                                                    <Collapse style={styles.Accordion1}
                                                        isCollapsed={this.state.collapsed}
                                                        onToggle={(isCollapsed) => this.setState({ collapsed: !this.state.collapsed })}
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
                                                                    onChangeText={(user_name) => this.setState({ user_name: user_name, walletBox: 0, cashBox: 0, selectedPaymentMethod: 'card', userInputCashAmount: '', amount: 0.00 })}>
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
                                                                            placeholderTextColor={'#bcbdc0'}
                                                                            placeholder={{
                                                                                label: 'Enero',
                                                                                value: '01',
                                                                            }}
                                                                            items={[
                                                                                { label: 'Febrero', value: '02' },
                                                                                { label: 'Marzo', value: '03' },
                                                                                { label: 'Abril', value: '04' },
                                                                                { label: 'Mayo', value: '05' },
                                                                                { label: 'Jun', value: '06' },
                                                                                { label: 'Julio', value: '07' },
                                                                                { label: 'Agosto', value: '08' },
                                                                                { label: 'Septiembre', value: '09' },
                                                                                { label: 'Octubre', value: '10' },
                                                                                { label: 'Noviembre', value: '11' },
                                                                                { label: 'Diciembre', value: '12' },
                                                                            ]}
                                                                        />
                                                                    </Col>
                                                                    <Col style={styles.MonthandYear} >
                                                                        <RNPickerSelect

                                                                            placeholderTextColor={'#000'}
                                                                            onValueChange={(year) => this.setState({ year })}
                                                                            value={year}
                                                                            placeholder={{
                                                                                label: '2020',
                                                                                value: '2020',
                                                                            }}

                                                                            items={[

                                                                                { label: '2021', value: '2021' },
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
                                                El método de pago en efectivo no está disponible para solicitar citas técnicas.
                                            </Text>
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
                        {paymentInfo == 1 ? (
                            <Col style={{ borderWidth: 2, borderColor: '#efefef', marginTop: normalize(20), marginLeft: normalize(20), marginRight: normalize(20), borderRadius: normalize(30), marginBottom: normalize(5) }}>
                                <Row style={{ marginTop: normalize(15), marginLeft: normalize(20), }}>
                                    <Col style={{ width: normalize(230) }}>
                                        <Text style={{ color: '#808080', fontSize: 15, fontFamily: 'Inter-Black', }}>{t('Service')}</Text>
                                    </Col>
                                    <Col>
                                        <Text style={{ color: '#808080', fontSize: 15, fontFamily: 'Inter-Black', }}>{currency_symbol} {sub_total}</Text>
                                    </Col>
                                </Row>
                                <Row style={{ marginLeft: normalize(20), }}>
                                    <Col style={{ width: normalize(230) }}>
                                        <Text style={{ color: '#808080', fontSize: 15, fontFamily: 'Inter-Black', }}>{t('Taxes')}</Text>
                                    </Col>
                                    <Col>
                                        <Text style={{ color: '#808080', fontSize: 15, fontFamily: 'Inter-Black', }}>{currency_symbol} {itbms}</Text>
                                    </Col>
                                </Row>
                                <Row style={{ marginLeft: normalize(20), }}>
                                    <Col style={{ width: normalize(230) }}>
                                        <Text style={{ color: '#1987B8', fontSize: 18, fontFamily: 'Inter-Black', }}>{t('Total payable')}</Text>
                                    </Col>
                                    <Col>
                                        <Text style={{ color: '#1987B8', fontSize: 18, fontFamily: 'Inter-Black', }}>{currency_symbol} {serviceCost}</Text>
                                    </Col>
                                </Row>
                                <Row style={{ marginLeft: normalize(20), marginRight: normalize(25), marginTop: normalize(15), flexShrink: 1 }}>
                                    <Text style={{ fontSize: 10, fontFamily: 'Inter-Black', color: '#808080', }}>{t('The total price shown includes only the visit and technician diagnosis Additional materials and labor will be budgeted by the technician in his diagnosis')}</Text>
                                </Row>

                                <Row style={{ marginTop: normalize(15), marginBottom: normalize(5), marginLeft: normalize(20), marginRight: normalize(20) }}>
                                    <Col style={{ justifyContent: 'center', alignItems: 'center', }}>
                                        <Row>
                                            <Image style={{ height: normalize(35), width: normalize(35) }}
                                                source={require('../../images/Service_Date.png')}
                                            />
                                        </Row>
                                        <Row>
                                            <Text style={{ fontSize: 15, fontFamily: 'Inter-Black' }}>{this.state.day}</Text>
                                        </Row>
                                        {Platform.OS == 'ios' ? (
                                            <Row>
                                                <Text style={{ fontSize: 15, fontFamily: 'Inter-Black', }}>{this.state.date}</Text>
                                            </Row>
                                        ) : (
                                                <Row>
                                                    <Text style={{ fontSize: 15, fontFamily: 'Inter-Black', }}>{this.state.selectedServiceDate}</Text>
                                                </Row>
                                            )}

                                    </Col>

                                    <Col style={{ justifyContent: 'center', alignItems: 'center', }}>
                                        <Row>
                                            <Image style={{ height: normalize(35), width: normalize(35) }}
                                                source={require('../../images/Service_Time.png')}
                                            />
                                        </Row>
                                        <Row>
                                            <Text style={{ fontSize: 15, fontFamily: 'Inter-Black' }}>{t('Time')}</Text>
                                        </Row>
                                        {Platform.OS == 'ios' ? (
                                            <Row>
                                                <Text style={{ fontSize: 15, fontFamily: 'Inter-Black', }}>{this.state.time}</Text>
                                            </Row>
                                        ) : (
                                                <Row>
                                                    <Text style={{ fontSize: 15, fontFamily: 'Inter-Black', }}>{this.state.selectedServiceTime}</Text>
                                                </Row>
                                            )}

                                    </Col>

                                    <Col style={{ justifyContent: 'center', alignItems: 'center', }}>
                                        <Row>
                                            <Image style={{ height: normalize(35), width: normalize(35) }}
                                                source={require('../../images/Service_Item.png')}
                                            />
                                        </Row>
                                        <Row> 
                                            <Text style={{ fontSize: 15, fontFamily: 'Inter-Black',textAlign: 'center', }}>{ServiceTypeSelectedName}</Text>
                                        </Row>
                                        <Row>
                                            <Text style={{ fontSize: 15, fontFamily: 'Inter-Black',textAlign: 'center', }}>{selectedsubcategoryname}</Text>
                                        </Row>
                                    </Col>

                                </Row>
                            </Col>

                        ) : (
                                <View></View>
                            )}

                    </ScrollView>


                    <View style={styles.Slider}>

                        <SwipeButton
                            disabled={false}
                            //disable the button by doing true (Optional)
                            swipeSuccessThreshold={70}
                            height={55}
                            //height of the button (Optional)
                            //width={330}
                            //width of the button (Optional)
                            title={<Text style={{ fontSize: 14, fontFamily: 'Inter-Black' }}>                                 {t('Swipe to confirm your appointment')} {`\u2023`}{`\u2023`}{`\u2023`}</Text>}
                            // title="Desliza para confirmar tu mensajera >>>"
                            //Text inside the button (Optional)
                            // thumbIconImageSource={require('../../images/Logo2.png')}
                            thumbIconComponent={swipeButtonIcon}
                            //You can also set your own icon (Optional)
                            onSwipeSuccess={() => {
                                this.place_order()
                            }}
                            // onSwipeSuccess={() => this.confirmOrder.bind(this)}
                            //After the completion of swipe (Optional)
                            railFillBackgroundColor="#c2272d" //(Optional)
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

                    <DropdownAlert ref={ref => this.dropdown = ref} />

                </View >
            );
        } else {
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
const styles = StyleSheet.create({
    pdf: {
        ...Platform.select({
            ios: {
                width: "100%",
                height: "100%",
                backgroundColor: '#000'
            },
            android: {
                width: "100%",
                height: "100%",
                backgroundColor: '#000'
            }
        })

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

    container: {
        flex: 1,
        backgroundColor: '#ffffff',
    },
    Navebar: {
        ...Platform.select({
            ios: {
                marginTop: normalize(30),
                height: normalize(50),
            },
            android: {
                height: normalize(50),
            }
        })

    },
    BackArrow: {
        ...Platform.select({
            ios: {
                width: 25,
                height: 25,
                justifyContent: 'center',
                alignItems: 'center',
                marginLeft: 10,
                // marginTop: 10,
            },
            android: {
                width: 25,
                height: 25,
                // justifyContent: 'center',
                // alignItems: 'center',
                // marginLeft: 10,
                // marginTop: 10,
            }
        })
    },
    Menu: {
        ...Platform.select({
            ios: {
                width: 25,
                height: 25,
                justifyContent: 'center',
                alignItems: 'center',
                marginRight: 10,
            },
            android: {
                width: 25,
                height: 25,
                // justifyContent: 'center',
                // alignItems: 'center',
                // marginRight: 10,
                // marginTop: 10,
            }
        })

    },
    PDFCloseIcon: {
        ...Platform.select({
            ios: {
                width: 25,
                height: 25,
                justifyContent: 'center',
                alignItems: 'center',
                top: "10%"
                // marginRight: 10,
            },
            android: {
                width: 25,
                height: 25,
                justifyContent: 'center',
                alignItems: 'center',
                // marginRight: 10,
                // top: "10%",
            }
        })

    },
    title: {
        height: 40,
        marginLeft: 20,
        marginRight: 10,
    },
    text: {
        ...Platform.select({
            ios: {
                color: '#f00204',
                marginLeft: 20,
                height: 90,
                fontWeight: "bold",
                fontSize: 30,
                paddingBottom: 52,


            },
            android: {
                color: '#f00204',
                marginLeft: 20,
                height: 90,
                fontWeight: "bold",
                fontSize: 30,
            }
        })
    },
    vehicle_type_Row: {
        // height: 90,  
        borderBottomWidth: 1,
        marginLeft: 10,
        marginRight: 10,
    },
    Map_Row: {
        // height: 90,
        borderBottomWidth: 1,
        marginLeft: 10,
        marginRight: 10,
    },
    Logo_Container: {
        width: normalize(55),
        marginTop: normalize(20),
        alignItems: 'flex-end',
    },
    Dropdown_Container: {
        justifyContent: 'center',
    },
    notes_Row: {
        // height: 90, 
        marginLeft: normalize(20),
        marginRight: normalize(20),
        borderRadius: normalize(30),
        backgroundColor: '#efefef',
        marginTop: normalize(15),
        height: normalize(85),

    },
    Accordion: {
        // backgroundColor:'#e9e7e6',
        marginLeft: 20,
        marginRight: 20,
        borderBottomWidth: 2,
        // marginTop: 10,
    },
    TextInput: {
        ...Platform.select({
            ios: {
                justifyContent: 'center',
                alignItems: 'center',
                // textAlign: 'center',
                // paddingTop: 10,
                paddingLeft: 20,
                // paddingBottom: 20;
                borderStyle: 'dashed',
                // borderRadius: 40,
                // borderWidth: 2,
                fontSize: 15,
                width: 288,
                height: 60,
                borderColor: 'grey',
                // backgroundColor:'#e9e7e6',
                // marginBottom: 10,
                color: '#000',
            },
            android: {
                justifyContent: 'center',
                // paddingLeft: 40,
                // paddingTop: 10,
                alignItems: 'center',
                borderStyle: 'dashed',
                // borderRadius: 40,
                fontSize: 17,
                // borderWidth: 2,
                width: 288,
                height: 60,
                // borderColor: 'grey',
                // backgroundColor:'#e9e7e6',
                // marginBottom: 10,
                color: '#000',
                marginLeft: 20,
                marginRight: 20,


            }
        }),
    },
    DownArrow: {
        width: normalize(17),
        height: normalize(17),
        marginRight: 10
    },
    Listlogo: {
        height: normalize(35),
        width: normalize(35)
    },
    PDFLogo: {
        ...Platform.select({
            ios: {
                width: 35,
                height: 35,
                marginLeft: "5%",
            },
            android: {
                width: 35,
                height: 35,
                marginLeft: "5%",
                // top:"10%"
            }
        })
    },
    notes_Input: {
        height: normalize(60),
        fontFamily: 'Inter-Black',
        color: '#808080',
        marginTop: normalize(10),
        marginBottom: normalize(10),
    },
    PlaceOrder_Button: {
        marginTop: 15,
        alignItems: 'center',
        justifyContent: 'center',
        width: '90%',
        height: 60,
        borderRadius: 40,
        backgroundColor: '#e02127',
        color: '#fff',


    },

    CostDelivery_Row: {
        marginTop: 10,
        borderTopWidth: 1,
        marginLeft: 10,
        marginRight: 10,
    },
    CostDelivery_Container: {
        marginTop: 20,
    },
    CostDelivery_Text: {
        fontWeight: 'bold',
        marginLeft: 20,
        // marginRight: 20,
        fontSize: 18,
    },
    ITBMS_Text: {
        marginLeft: 20,
        marginRight: 20,
    },
    CostAmount: {
        marginTop: 20,
        marginRight: 10,
        alignItems: 'flex-end',
    },
    CostAmount_Text: {
        fontWeight: 'bold',
        fontSize: 30,
        color: '#2076b9',
    },
    PlaceOrder_Row: {
        marginTop: 30,
        justifyContent: 'center',
    },
    PlaceOrder_Text: {
        color: '#fff',
        fontSize: 20
    },
    modalView: {
        justifyContent: "center",
        marginTop: '50%',
        marginLeft: 10,
        marginRight: 10,
        backgroundColor: "white",
        borderRadius: 20,
        // paddingBottom: 35,
        paddingLeft: 5,
        paddingRight: 5,
        // alignItems: "center",
        // width: Dimensions.get('window').width,
        // height: Dimensions.get('window').height,
        shadowColor: "#232324",
        height: '50%',
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5
    },
    bottomActionBarRowImages: {
        height: 40,
        width: 40,
        // top: 10,
        position: 'absolute',
        marginLeft: 10,
        // backgroundColor: 'red'

    },
    // Modal Css
    modalContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    modalVisacard: {
        width: 85,
        height: 60,
    },
    modalMastercard: {
        width: 85,
        height: 60,
        // marginLeft: 25,

    },
    modalText: {

        // justifyContent: 'center', 
        alignItems: 'center',
        marginTop: 8,
        color: 'red',
        fontWeight: 'bold',
        fontSize: 23,
        // height: 50,
        width: '100%'
    },
    PDFTitle: {
        ...Platform.select({
            ios: {
                justifyContent: 'center',
                textAlign: 'center',
                top: "10%",
                // color: 'red',
                fontWeight: 'bold',
                fontSize: 20,
                // height: 50,
                // width: '100%'
            },
            android: {
                justifyContent: 'center',
                textAlign: 'center',
                // marginTop: 8,
                // color: 'red',
                fontWeight: 'bold',
                fontSize: 20,
                // height: 50,
                // width: '100%'
            }
        })


    },
    modalTextInput: {
        ...Platform.select({
            ios: {
                justifyContent: 'center',
                // alignItems: 'center',
                // textAlign: 'center',
                paddingLeft: 40,
                borderStyle: 'dashed',
                borderRadius: 40,
                borderWidth: 2,
                width: '90%',
                height: 60,
                borderColor: 'grey',
                backgroundColor: '#eae8e8',
                marginBottom: 10,
                color: '#000',
            },
            android: {
                justifyContent: 'center',
                paddingLeft: 40,
                alignItems: 'center',
                borderStyle: 'dashed',
                borderRadius: 40,
                borderWidth: 2,
                width: '100%',
                height: 60,
                borderColor: 'grey',
                backgroundColor: '#eae8e8',
                marginBottom: 10,
                color: '#000',

            }
        })

    },
    modalexpiration: {
        color: '#000',
    },

    modalRow: {
        // marginTop: 10,
        // height:50,
        // flex: 1,
        justifyContent: 'center',
        width: '99%',
        // alignItems: 'center',
        marginLeft: 5,
        marginRight: 10,
    },

    modalAccept: {

        marginTop: 15,
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 10,
        width: '90%',
        height: 50,
    },

    modalRegister: {

        height: 30,
        marginBottom: 20,
    },

    ModalCards: {
        height: 60,
        marginBottom: 10,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },

    modalSend: {
        marginRight: 10,
        marginLeft: 10,
        marginTop: 10,
        marginBottom: 20,
        alignItems: 'center',
        justifyContent: 'center',
        width: '96%',
        height: 60,
        borderRadius: 40,
        backgroundColor: 'red',
        color: '#fff',

    },

    modalDownArrow: {
        width: 10,
        height: 10,
    },
    modalInput: {

        ...Platform.select({
            ios: {
                borderStyle: 'dashed',
                borderColor: 'grey',
                borderRadius: 40,
                borderWidth: 1,
                marginTop: 10,
                // marginLeft: 10,
                marginRight: 10,
                textAlign: 'center',
                backgroundColor: '#eae8e8',
                // paddingLeft: 20,
                height: 60,

                marginBottom: 20,
            },

            android: {
                borderStyle: 'dashed',
                borderColor: 'grey',
                borderRadius: 40,
                borderWidth: 1,
                marginTop: 10,
                // paddingBottom: 50,
                marginLeft: 15,
                marginRight: 5,
                // paddingLeft: 20,
                textAlign: 'center',
                backgroundColor: '#eae8e8',
                height: 60,

            }
        })
    },
    modaldropdown: {
        // width: '80%',
        borderBottomWidth: 0,
    },
    modalCVV: {

        ...Platform.select({
            ios: {
                borderStyle: 'dashed',
                textAlign: 'center',
                borderWidth: 1,
                height: 50,
                borderRadius: 50,

                paddingTop: 15,
                marginTop: 15,

            },

            android: {

                borderStyle: 'dashed',
                marginLeft: 15,
                borderWidth: 1,
                paddingTop: 10,
                paddingLeft: 10,
                marginTop: 10,
                marginRight: 10,
                textAlign: 'center',
                borderRadius: 50,
                height: 56,
            }
        })
    },
    Navebar2: {
        ...Platform.select({
            ios: {
                // height: 1 , 
                // paddingBottom: 50, 
                marginTop: 30,

            },
            android: {

                // flex:1,
                height: 50,
                marginTop: 10,
                width: '100%'
                // paddingBottom: 50, 


            }
        })

    },
    Navebar3: {
        ...Platform.select({
            ios: {
                height: "6%",
                // paddingBottom: 50, 
                marginTop: "5%",
                width: '100%'

            },
            android: {

                // flex:1,
                height: "5%",
                // marginTop: "5%",
                width: '100%'
                // paddingBottom: 50, 


            }
        })

    },
    LocationB: {
        ...Platform.select({
            ios: {
                marginTop: normalize(5),
                borderRadius: 20,
                backgroundColor: '#efefef',
                marginRight: normalize(20),
                marginLeft: normalize(20),

            },
            android: {

                marginTop: normalize(10),
                borderRadius: normalize(20),
                backgroundColor: '#efefef',
                marginRight: normalize(20),
                marginLeft: normalize(20),
            }
        })
    },
    ArrowCol: {
        width: 25,
        alignItems: 'flex-end',
        marginRight: 10,

    },
    StarImage: {
        width: 17,
        height: 17,
        resizeMode: 'cover',
        marginTop: 12
    },
    service_colls: {
        borderWidth: 1,
        borderColor: '#e5e5e5',
        marginTop: normalize(15),
        marginLeft: normalize(20),
        marginRight: normalize(20),
        borderRadius: normalize(30),
    },
    service_row: {
        backgroundColor: '#e5e5e5',
        borderRadius: 30,
        alignItems: 'center',
        height: normalize(45),
    },
    service_name: {
        fontSize: 20,
        fontFamily: 'Inter-Black',
    },
    service_Img: {
        width: normalize(55),
        justifyContent: 'center',
        alignItems: 'center',
    },
    down_arrow: {
        width: normalize(40),
        justifyContent: 'center',
        alignItems: 'center',
    },
    body_row: {
        height: normalize(35),
        marginTop: normalize(10),
        marginBottom: normalize(5),
        justifyContent: 'center',
        alignItems: 'center',
    },
    body_last_row: {
        height: normalize(35),
        marginTop: normalize(10),
        marginBottom: normalize(20),
        justifyContent: 'center',
        alignItems: 'center',
    },
    body_col: {
        width: normalize(50),
    },
    body_Img: {
        height: normalize(30),
        width: normalize(30)
    },
    body_text: {
        fontFamily: 'Inter-Black',
        fontSize: 22,
    },
    detail_colls: {
        borderWidth: 1,
        borderColor: '#e5e5e5',
        marginTop: normalize(15),
        marginLeft: normalize(20),
        marginRight: normalize(20),
        borderRadius: normalize(30),
    },
    detail_row: {
        backgroundColor: '#eaf4f9',
        borderRadius: 30,
        alignItems: 'center',
        height: normalize(45),
    },
    detail_name: {
        fontSize: 19,
        fontFamily: 'Inter-Black',
    },
    detail_col: {
        // paddingLeft: normalize(60),
    },
    Slider: {
        paddingHorizontal: 10,
        justifyContent: 'center',
        backgroundColor: "#e77672"


    },
    payment_row: {
        backgroundColor: '#efefef',
        borderRadius: 30,
        alignItems: 'center',
        height: normalize(50),
        marginRight: normalize(20),
        marginLeft: normalize(20),
    },
    payment_name: {
        fontSize: 20,
        fontFamily: 'Inter-Black',
        color: '#808080',
    },
    payment_Img: {
        width: normalize(70),
        justifyContent: 'center',
        alignItems: 'center',
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
        // padding: 10
        // borderColor: '#ededed',
        // justifyContent: 'center',
        height: normalize(35),
        marginRight: normalize(5),
        marginLeft: normalize(5),

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
        width: normalize(27),
        height: normalize(27),
        // marginLeft: 10,
        // marginTop: 10,
    },

    walletIcon: {
        width: normalize(45),
        height: normalize(45),
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
    Login: {
        justifyContent: 'center',
        paddingHorizontal: 25,
        height: 30,
        borderRadius: 10,
        backgroundColor: '#1888b8',
        color: '#fff',

    },
    popupCrossTextIcon: {
        // marginTop: 10,
        fontSize: 25,
        fontFamily: "Inter-Black",
        color: "#b3b3b3",
        // textAlign: 'center',
    },
    arrow_col: {
        ...Platform.select({
            ios:
            {
                justifyContent: 'center',
                paddingLeft: normalize(15),
            },
            android:
            {
                justifyContent: 'center',
                paddingLeft: normalize(30),
            }
        }),
    },
    menu_col: {
        ...Platform.select({
            ios:
            {
                justifyContent: 'center',
                paddingRight: normalize(15),
            },
            android:
            {
                justifyContent: 'center',
                paddingRight: normalize(30),
            }
        }),
    },
    locationB_col: {
        ...Platform.select({
            ios:
            {
                marginLeft: normalize(20),
                marginRight: normalize(20),
                borderRadius: normalize(30),
                height: normalize(50),
                marginBottom: normalize(50)
            },
            android:
            {
                marginLeft: normalize(20),
                marginRight: normalize(20),
                borderRadius: normalize(30),
                height: normalize(50),
                marginBottom: normalize(10),
            }
        }),
    },
    time_col: {
        ...Platform.select({
            ios:
            {
                backgroundColor: '#efefef',
                borderRadius: normalize(30),
                width: normalize(150),
                marginRight: normalize(33),
                justifyContent: 'center',
                alignItems: 'center'
            },
            android:
            {
                backgroundColor: '#efefef',
                borderRadius: normalize(30),
                width: normalize(150),
                marginRight: normalize(43),
                justifyContent: 'center',
                alignItems: 'center'
            }
        }),
    },
    radio: {
        ...Platform.select({
            ios: {
                width: normalize(35),
                borderWidth: 1,
                borderRadius: normalize(35),
                height: normalize(35),
                borderColor: '#1A87BA',

            }
        })
    },
    Blogo: {
        width: 20,
        height: 20,
        marginTop: 10,
    },
});