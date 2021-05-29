import React, { Component, useState } from 'react';
import { KeyboardAvoidingView, BackHandler, ActivityIndicator, AsyncStorage, Picker, Alert, StyleSheet, Text, View, Image, TextInput, TouchableOpacity, StatusBar, Keyboard, ScrollView, Modal } from 'react-native';
import { Col, Row, Grid } from "react-native-easy-grid";
import { t } from '../../../locals';
import { Collapse, CollapseHeader, CollapseBody, AccordionList } from 'accordion-collapse-react-native';
import CustomToast from './Toast.js';
import PropTypes from 'prop-types';
import validate from 'validate.js';
import { Dropdown } from 'react-native-material-dropdown-v2';
import RNPickerSelect from 'react-native-picker-select';
import { getVehicleTypesListAction } from '../Util/Action.js';
import Demo1 from '../Apps/radio.js';
import { storage } from '../Util/storage.js';
import {
    getOrderCostAction,
    customerordersaveAction
} from '../Util/Action.js';
import { NavigationEvents } from 'react-navigation';
import RadioForm, {RadioButton, RadioButtonInput, RadioButtonLabel} from 'react-native-simple-radio-button';




export default class IndicationScreen extends Component {
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
            distance: '',
            search: '',
            notes: '',
            from_latitude: '',
            from_longitude: '',
            destination_latitude: '',
            destination_longitude: '',
            fromLocationText: '',
            destinationLocationText: '',
            dbVehicleType: '',
            vehicleTypeSelected: '',
            deliveryCost: '',
            sub_total: '',
            itbms: '',
            customerMobile: '',
            customerEmail: '',
            customerPaymentToken: '',
            userFirstName: '',
            userLastName: '',
            card_number: '',
            month: '01',
            year: '2020',
            cvv: '',
            modalVisible: false,
            paymentType: '',
            value: 0,
            radio_props : [
                {label: 'Cash', value: "Cash" },
                {label: 'Card', value: "Card" }
            ],

        };
        this.getUserDetails();
    }

    componentDidMount() {
        var params = this.props.navigation.getParam('data');
        this.setState({
            fromLocationText: params.from_location_address,
            destinationLocationText: params.to_location_address,
            distance: params.distance,

            destination_latitude: params.to_latitude,
            destination_longitude: params.to_longitude,
            from_latitude: params.from_latitude,
            from_longitude: params.from_longitude,
        });

        // get Vehicle type list from Database using API call when page is load
        this.setState({ loader: true });
        var response = getVehicleTypesListAction().then(
            function (responseJson) {
                console.log(responseJson)
                if (responseJson.isError == false) {
                    this.setState({ dbVehicleType: responseJson.result, loader: false });
                } else {
                    // console.log(responseJson.message);
                }
            }.bind(this)
        );

    }

    async getUserDetails() {
        let userMobile = await AsyncStorage.getItem("mobile");
        let userEmail = await AsyncStorage.getItem("email");
        let paymentToken = await AsyncStorage.getItem("payment_gateway_token");

        this.setState({
            customerMobile: userMobile,
            customerEmail: userEmail,
            customerPaymentToken: paymentToken
        });
    }

    async getVehicleTypesList() {
        this.setState({ loader: true });
        let Token = await AsyncStorage.getItem("token");

        Token = "Bearer " + Token;

        getVehicleTypesListAction(Token).then((responseJson) => {

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
        let Token = await AsyncStorage.getItem("token");

        Token = "Bearer " + Token;
        const OrderData = {
            vehicle_type: vehicleTypeSelected,
            kilometers: this.state.distance,
        };
        this.setState({
            vehicleTypeSelected: vehicleTypeSelected,
        })
        // this.setState({ loader: true });
        var response = getOrderCostAction(OrderData, Token).then(
            function (responseJson) {
                // console.log(responseJson);
                if (responseJson.isError == false) {
                    this.setState({ deliveryCost: responseJson.result.cost });
                    this.setState({ sub_total: responseJson.result.sub_total });
                    this.setState({ itbms: responseJson.result.itbms });
                } else {
                    console.log(responseJson.message);
                }
            }.bind(this)
        );
    }

    async place_order() {
        const { navigate } = this.props.navigation;
        const { dbVehicleType, notes, paymentType } = this.state;

        var constraints = {
            vehicleTypeSelected: {
                presence: {
                    allowEmpty: false,
                    message: "^Select Vehicle Type"
                },
            },
            paymentType: {
                presence: {
                    allowEmpty: false,
                    message: "^Select payment type"
                },
            }
        };

        const result = validate({ vehicleTypeSelected: this.state.vehicleTypeSelected, paymentType: this.state.paymentType }, constraints);

        if (result) {
            if (result.vehicleTypeSelected) {
                this.refs.defaultToastBottomWithDifferentColor.ShowToastFunction(result.vehicleTypeSelected);
                return false;
            }
            if (result.paymentType) {
                this.refs.defaultToastBottomWithDifferentColor.ShowToastFunction(result.paymentType);
                return false;
            }
        }
        if (paymentType == "Cash"){
            this.setState({ loader: true });
            let customer_id = await AsyncStorage.getItem('userid');

            var placeServiceData = {
                customer_id: customer_id,
                service_type: this.state.vehicleTypeSelected,
                fromLocationText: this.state.fromLocationText,
                destinationLocationText: this.state.destinationLocationText,
                from_latitude: this.state.from_latitude,
                from_longitude: this.state.from_longitude,
                destination_latitude: this.state.destination_latitude,
                destination_longitude: this.state.destination_longitude,
                notes: this.state.notes,
                cost: this.state.sub_total,
                total: this.state.deliveryCost,
                tax: this.state.itbms,
                paymentType: this.state.paymentType,
            }
            console.log(placeServiceData);
            let Token = await AsyncStorage.getItem('token');
            Token = 'Bearer ' + Token;

            this.setState({ loading: true });
            var response = customerordersaveAction(placeServiceData, Token).then(function (responseJson) {
                console.log(responseJson)
                if (responseJson.isError == false) {
                    navigate('OrderList');
                } else {
                    console.log(responseJson.message);
                    this.setState({ loading: false });
                    this.refs.defaultToastBottomWithDifferentColor.ShowToastFunction(responseJson.message);
                }
            }.bind(this));
        }else{
            if (this.state.customerPaymentToken == '' || this.state.customerPaymentToken == "null" || this.state.customerPaymentToken == null) {
                this.setState({ modalVisible: true });
            } else {
                this.setState({ loader: true });
                let customer_id = await AsyncStorage.getItem('userid');

                var placeServiceData = {
                    customer_id: customer_id,
                    service_type: this.state.vehicleTypeSelected,
                    fromLocationText: this.state.fromLocationText,
                    destinationLocationText: this.state.destinationLocationText,
                    from_latitude: this.state.from_latitude,
                    from_longitude: this.state.from_longitude,
                    destination_latitude: this.state.destination_latitude,
                    destination_longitude: this.state.destination_longitude,
                    notes: this.state.notes,
                    cost: this.state.sub_total,
                    total: this.state.deliveryCost,
                    tax: this.state.itbms,
                    paymentType: this.state.paymentType,
                }

                let Token = await AsyncStorage.getItem('token');
                Token = 'Bearer ' + Token;

                this.setState({ loading: true });
                var response = customerordersaveAction(placeServiceData, Token).then(function (responseJson) {
                    console.log(responseJson)
                    if (responseJson.isError == false) {
                        navigate('OrderList');
                    } else {
                        console.log(responseJson.message);
                        this.setState({ loading: false });
                        this.refs.defaultToastBottomWithDifferentColor.ShowToastFunction(responseJson.message);
                    }
                }.bind(this));
            }
        }
    }
        

    async makeOrderPayment() {
        const { navigate } = this.props.navigation;
        const { card_number, userFirstName, userLastName, month, year, cvv } = this.state;

        var constraints = {
            userFirstName: {
                presence: {
                    allowEmpty: false,
                    message: "^ First name required"
                },
                format: {
                    pattern: "[A-Za-z ]+",
                    flags: "i",
                    message: "^ only characters"
                }
            },
            userLastName: {
                presence: {
                    allowEmpty: false,
                    message: "^ Last name required"
                },
                format: {
                    pattern: "[A-Za-z ]+",
                    flags: "i",
                    message: "^ only characters"
                }
            },
            card_number: {
                format: {
                    pattern: "[0-9]{16}",
                    flags: "i",
                    message: "^ 16 digit card number required."
                },
            },
            year: {
                presence: {
                    allowEmpty: false,
                    message: "^ Year is required"
                },
            },
            month: {
                presence: {
                    allowEmpty: false,
                    message: "^ Month is required"
                },
            },
            cvv: {
                format: {
                    pattern: "[0-9]{3}",
                    flags: "i",
                    message: "^ 3 digit cvv required."
                },
            }
        };

        Keyboard.dismiss();

        const result = validate({ card_number: this.state.card_number, userFirstName: this.state.userFirstName, userLastName: this.state.userLastName, year: this.state.year, month: this.state.month, cvv: this.state.cvv }, constraints);

        if (result) {
            if (result.userFirstName) {
                this.refs.defaultToastBottomWithDifferentColor.ShowToastFunction(result.userFirstName);
                return false;
            }

            if (result.userLastName) {
                this.refs.defaultToastBottomWithDifferentColor.ShowToastFunction(result.userLastName);
                return false;
            }

            if (result.card_number) {
                this.refs.defaultToastBottomWithDifferentColor.ShowToastFunction(result.card_number);
                return false;
            }

            if (result.month) {
                this.refs.defaultToastBottomWithDifferentColor.ShowToastFunction(result.month);
                return false;
            }

            if (result.year) {
                this.refs.defaultToastBottomWithDifferentColor.ShowToastFunction(result.year);
                return false;
            }

            if (result.cvv) {
                this.refs.defaultToastBottomWithDifferentColor.ShowToastFunction(result.cvv);
                return false;
            }
        }

        if (!result) {
            this.setState({ modalVisible: false, loader: true});
            let customer_id = await AsyncStorage.getItem('userid');
            let Token = await AsyncStorage.getItem('token');
            Token = 'Bearer ' + Token;

            var urlConfig = "https://sandbox.paguelofacil.com/rest/processTx/AUTH_CAPTURE";
            var cclw = '3629CB6D2FBDAEF6EBE7FBBC9E5806F8C83E13B216B3A411F946B2658A892CD7075A9D76CE2CAEF46BE4E25EA11616AFFC2E4E08FB2FD8E89AB47C7DBC8242B2';
            var sub_total = this.state.sub_total;//El monto o valor total de la transacción a realizar. NO PONER
            var taxAmount = this.state.itbms;//El monto o valor total de la transacción a realizar. NO PONER
            var amount = parseFloat(sub_total) + parseFloat(taxAmount);
            var description = 'First transaction to store card details';//MaxLength:150 ;Es la descripción o el motivo de la transacción en proceso
            var credit_card = this.state.card_number;
            var carType = 'VISA';
            var credit_card_month = this.state.month;//Mes de expiración de la tarjeta, siempre 2 dígitos
            var credit_card_year = this.state.year;//Numeric Ej.:02 Año de expiración de la tarjeta.
            var credit_card_cvc = this.state.cvv;//Código de Seguridad de la tarjeta Numeric MaxLength:3

            var name = this.state.userFirstName;//String MaxLength:25 Nombre del tarjeta habiente
            var lastname = this.state.userLastName;//String MaxLength:25 Apellido del Tarjeta habiente
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
                    console.log(responseJson);
                    if (responseJson.success == true) {
                        // Save customer payment gateway token
                        storage.updatePaymentGatewayToken(responseJson.data.codOper).then((data) => {
                            // Save order in backend
                            var placeOrderData = {
                                customer_id: customer_id,
                                service_type: this.state.vehicleTypeSelected,
                                fromLocationText: this.state.fromLocationText,
                                destinationLocationText: this.state.destinationLocationText,
                                from_latitude: this.state.from_latitude,
                                from_longitude: this.state.from_longitude,
                                destination_latitude: this.state.destination_latitude,
                                destination_longitude: this.state.destination_longitude,
                                notes: this.state.notes,
                                cost: this.state.sub_total,
                                total: this.state.deliveryCost,
                                tax: this.state.itbms,
                                paymentType: this.state.paymentType,
                                paymentGatewatToken: responseJson.data.codOper
                            }

                            // Refund 0.1 dollar to customer
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
                                    console.log("Refund response")
                                    console.log(responseJson)
                                })
                                .catch((error) => {
                                    console.log(error);
                                })
                            // Refund 0.1 dollar to customer

                            this.setState({ loading: true });
                            var response = customerordersaveAction(placeOrderData, Token).then(function (responseJson) {
                                console.log(responseJson)
                                if (responseJson.isError == false) {
                                    this.setState({ modalVisible: false });
                                    navigate('OrderList');
                                } else {
                                    this.setState({ loading: false });
                                    this.refs.defaultToastBottomWithDifferentColor.ShowToastFunction(responseJson.message);
                                }
                            }.bind(this));
                        })
                            .catch((err) => {
                                console.log(err)
                            });
                    } else {
                        this.refs.defaultToastBottomWithDifferentColor.ShowToastFunction(responseJson.message);
                        console.log(responseJson.message)
                    }
                })
                .catch((error) => {
                    console.log(error);
                })

        }
    }
    setModalVisible = (visible) => {
        this.setState({ modalVisible: visible });
    }

    _onBlurr = () => {
        BackHandler.removeEventListener('hardwareBackPress',
            this._handleBackButtonClick);
    }

    _onFocus = () => {
        BackHandler.addEventListener('hardwareBackPress',
            this._handleBackButtonClick);
    }

    _handleBackButtonClick = () => this.props.navigation.navigate('OrderLocation')


    render() {
        let {
            loader,
            dbVehicleType,
            vehicleTypeSelected,
        } = this.state;
        const vehicleTypes = [];
        for (let userObject of this.state.dbVehicleType) {
            vehicleTypes.push({ label: userObject.type, value: userObject.id });
        }
        const { navigate } = this.props.navigation;
        const { search, modalVisible, month, year } = this.state;
        
        if (!loader) {
            return (

                <View style={styles.container}>
                    <NavigationEvents
                        onWillFocus={this._onFocus}
                        onWillBlur={this._onBlurr}
                    />
                    <StatusBar />
                    <Row style={styles.Navebar}>
                        <Col>
                            <TouchableOpacity onPress={() => navigate('Service')} >
                                <Image source={require('../../images/Back-Arrow.png')} style={styles.BackArrow} />
                            </TouchableOpacity>
                        </Col>
                        <Col>
                            <TouchableOpacity style={{ alignItems: 'flex-end' }} onPress={this.toggleDrawer.bind(this)}>
                                <Image source={require('../../images/Menu.png')} style={styles.Menu} />
                            </TouchableOpacity>
                        </Col>
                    </Row>
                    <Row style={styles.title}>
                        <Text style={styles.text}>
                            {t('Indication')}
                        </Text>
                    </Row>
                    <ScrollView>
                    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : null}>
                        <Row style={styles.vehicle_type_Row}>

                            <Col style={styles.Logo_Container}>
                                <Image source={require('../../images/Bike.png')} style={styles.Listlogo} />
                            </Col>
                            <Col style={styles.Dropdown_Container}>
                                <Dropdown

                                    placeholder={t('HELLO WHAT DO YOU NEED?')}
                                    placeholderTextColor={'#000'}
                                    bgColor={'grey'}
                                    tintColor={'#000000'}
                                    activityTintColor={'red'}
                                    handler={(selection, row) => this.setState({ text: data[selection][row] })}
                                    valueExtractor={({ value }) => value}
                                    onChangeText={(value) => { this.getCost(value) }}
                                    data={vehicleTypes}
                                >
                                </Dropdown>
                            </Col>
                        </Row>
                        <Row style={styles.Map_Row}>

                            <Col style={styles.Logo_Container}>
                                <Image source={require('../../images/Ruta.png')} style={styles.Listlogo} />
                            </Col>
                            <Col style={{ marginLeft: 40, }}>
                                <Row style={{ width: '85%' }}>
                                    <Text style={{ fontWeight: 'bold' }}>From - </Text>
                                    <Text>{this.state.fromLocationText} </Text>
                                </Row>
                                <Row style={{ width: '85%' }}>
                                    <Text style={{ fontWeight: 'bold' }}>To - </Text>
                                    <Text style={{ marginLeft: 17 }}>{this.state.destinationLocationText}</Text>
                                </Row>
                            </Col>
                        </Row>
                        <Row style={styles.notes_Row}>

                            <Col style={styles.Logo_Container}>
                                <Image source={require('../../images/Notas.png')} style={styles.Listlogo} />
                            </Col>
                            <Col style={styles.Dropdown_Container}>
                                <TextInput style={styles.notes_Input}
                                    placeholder={t('NOTES')}
                                    placeholderTextColor={'#000'}
                                    // fontWeight={'bold'}
                                    multiline={true}
                                    numberOfLines={4}
                                    onChangeText={(notes) => this.setState({ notes })}>
                                </TextInput>
                            </Col>
                        </Row>
                        <Row style={styles.CostDelivery_Row}>
                            <Col style={styles.CostDelivery_Container}>
                                <Text style={styles.CostDelivery_Text}>
                                    {t('Cost of delivery')}
                                </Text>
                                <Text style={styles.ITBMS_Text}>
                                    {t('Includes')}
                                </Text>
                            </Col>
                            <Col style={styles.CostAmount}>
                                <Text style={styles.CostAmount_Text}>{this.state.deliveryCost}</Text>
                            </Col>
                        </Row>
                        <Row style={{marginTop:"10%", marginLeft:"10%", marginRight:"10%"}}>
                            <RadioForm 
                                radio_props={this.state.radio_props}
                                initial={''}
                                formHorizontal={false}
                                labelHorizontal={true}
                                buttonColor={'#e02127'}
                                animation={true}
                                // buttonWrapStyle={{marginLeft: "10%"}}
                                onPress={(paymentType) => {this.setState({paymentType:paymentType})}}
                            />
                        </Row>         
                        <Row style={styles.PlaceOrder_Row}>
                            <TouchableOpacity style={styles.PlaceOrder_Button} onPress={this.place_order.bind(this)}>
                                <Text style={styles.PlaceOrder_Text}>{t('Place Order')}</Text>
                            </TouchableOpacity>
                        </Row>
                    </KeyboardAvoidingView>
                    </ScrollView>
                    <CustomToast ref="defaultToastBottomWithDifferentColor" backgroundColor='#000' position="top" />
                    <Modal
                        animationType="slide"
                        transparent={false}
                        visible={modalVisible}
                        onRequestClose={() => {
                            // navigate('LocationScreen')
                        }}
                    >
                        <View style={styles.modalContainer} >
                            <Row style={styles.Navebar2}>
                                <Col style={{ width: '10%' }}>
                                </Col>
                                <Col style={{ width: "80%" }}>
                                    <Text style={styles.modalText}>
                                        {t('Register a payment method')}
                                    </Text>
                                </Col>
                                <Col style={{ width: '10%' }}>
                                    <TouchableOpacity style={{ alignItems: 'flex-end' }} onPress={() => { this.setModalVisible(!modalVisible); }}>
                                        <Image source={require('../../images/Close.png')} style={styles.Menu} />
                                    </TouchableOpacity>
                                </Col>
                            </Row>

                            <Row style={styles.modalRow}>
                                <ScrollView showsVerticalScrollIndicator={false}>
                                    <Col>
                                        <Row style={styles.ModalCards}>
                                            <Image source={require('../../images/Visa-Card.png')} style={styles.modalVisacard} />
                                            <Image source={require('../../images/Master-Card.png')} style={styles.modalMastercard} />
                                        </Row>
                                        <Row style={styles.modalRow}>
                                            <Col style={{ marginLeft: 10, marginRight: 10 }}>

                                                <TextInput style={styles.modalTextInput}
                                                    placeholder={t('First Name')}
                                                    maxLength={25}
                                                    autoCorrect={false}
                                                    autoComplete={false}
                                                    onChangeText={(userFirstName) => this.setState({ userFirstName })}>
                                                </TextInput>

                                                <TextInput style={styles.modalTextInput}
                                                    placeholder={t('Last Name')}
                                                    maxLength={25}
                                                    autoCorrect={false}
                                                    autoComplete={false}
                                                    onChangeText={(userLastName) => this.setState({ userLastName })}>
                                                </TextInput>

                                                <TextInput style={styles.modalTextInput}
                                                    placeholder={t('Card Number')}
                                                    keyboardType="numeric"
                                                    maxLength={16}
                                                    minLength={16}
                                                    onChangeText={(card_number) => this.setState({ card_number })}>
                                                </TextInput>


                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col>
                                                <Row style={{ height: 20, marginTop: 10, marginLeft: 10 }}>
                                                    <Text style={styles.modalexpiration}>{t('Expiration')}</Text>
                                                </Row>
                                                <Row>
                                                    <Col style={styles.modalInput}>

                                                        <RNPickerSelect
                                                            onValueChange={(month) => this.setState({ month })}
                                                            value={this.state.month}
                                                            placeholderTextColor={'#000'}
                                                            placeholder={{
                                                                label: 'Jan',
                                                                value: '01',
                                                            }}
                                                            items={[
                                                                { label: 'Jan', value: '01' },
                                                                { label: 'Feb', value: '02' },
                                                                { label: 'Mar', value: '03' },
                                                                { label: 'Apr', value: '04' },
                                                                { label: 'May', value: '05' },
                                                                { label: 'Jun', value: '06' },
                                                                { label: 'Jul', value: '07' },
                                                                { label: 'Aug', value: '08' },
                                                                { label: 'Sep', value: '09' },
                                                                { label: 'Oct', value: '10' },
                                                                { label: 'Nov', value: '11' },
                                                                { label: 'Dec', value: '12' },

                                                            ]}
                                                        />
                                                    </Col>

                                                    <Col style={styles.modalInput} >
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
                                                    <Col style={styles.modalCVV}>
                                                        <TextInput placeholder={t('CVV')}
                                                            keyboardType="numeric"
                                                            maxLength={3}
                                                            onChangeText={(cvv) => this.setState({ cvv })}>
                                                        </TextInput>
                                                    </Col>
                                                </Row>
                                                <Row >
                                                    <TouchableOpacity>
                                                        <Demo1 />
                                                    </TouchableOpacity>

                                                    <Text style={styles.modalAccept}>
                                                        {t('card')}
                                                    </Text>
                                                </Row>

                                                <Row>
                                                    <TouchableOpacity>
                                                        <Demo1 />
                                                    </TouchableOpacity>

                                                    <Text style={styles.modalAccept}>
                                                        {t('agree')}
                                                    </Text>
                                                </Row>
                                                <Row>
                                                    <TouchableOpacity style={styles.modalSend} onPress={this.makeOrderPayment.bind(this)}>
                                                        <Text style={{ color: '#fff', fontSize: 20 }}>{t('SEND')}</Text>
                                                    </TouchableOpacity>

                                                </Row>
                                            </Col>
                                        </Row>

                                    </Col>
                                </ScrollView>
                            </Row>
                            <CustomToast ref="defaultToastBottomWithDifferentColor" backgroundColor='#000' position="top" />
                        </View>
                    </Modal>
                </View>
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
        // alignItems: 'center',
        justifyContent: 'center',

        // height: 30,

    },
    Navebar: {
        ...Platform.select({
            ios: {
                height: 1,
                paddingBottom: 50,
                marginTop: 30
            },
            android: {
                height: 40,
                // marginTop:40,

            }
        })

    },
    BackArrow: {
        width: 25,
        height: 25,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 10,
        marginTop: 10,
    },
    Menu: {
        width: 25,
        height: 25,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
        marginTop: 10,

    },
    title: {
        height: 40,
        marginLeft: 20,
        marginRight: 20,
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
        width: 40,
        marginTop: 20,
    },
    Dropdown_Container: {
        marginLeft: 40,
    },
    notes_Row: {
        // height: 90, 
        marginLeft: 10,
        marginRight: 10,
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
        width: 20,
        height: 20,
        marginRight: 10,
        marginTop: 15,
    },

    Listlogo: {
        ...Platform.select({
            ios: {
                width: 50,
                height: 50,
            },
            android: {
                width: 50,
                height: 50,
            }
        })
    },
    notes_Input: {
        marginTop: 10,
        height: 60,
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
        marginTop: 70,
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
                // width: '90%',
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
                // width: '100%',
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
        // width: '99%',

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
                paddingLeft: 10,
                marginBottom: 20,
                justifyContent: "center",
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
                paddingLeft: 10,
                textAlign: 'center',
                backgroundColor: '#eae8e8',
                height: 60,
                justifyContent: "center",

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
                paddingLeft: 10,
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
                height: 50,
                marginTop: 20,
                width: '100%'

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

});