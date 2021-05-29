import React, { Component } from 'react';
import { BackHandler, Alert, KeyboardAvoidingView, ActivityIndicator, StyleSheet, Text, View, Image, Button, TextInput, TouchableOpacity, StatusBar, ScrollView, Keyboard, Platform } from 'react-native';
import PinInput from "react-pin-input";
import CustomToast from './Toast.js';
import { verifyOTPAction, loginAction } from '../Util/Action';
import { LOGIN } from '../Util/API.js';
import * as Facebook from 'expo-facebook';
import * as Google from 'expo-google-app-auth';
import { Notifications } from 'expo';
import { NavigationEvents } from "react-navigation";
// import PushNotification from 'react-native-push-notification'
import * as Permissions from 'expo-permissions';
import { storage } from '../Util/storage.js';
import { t } from '../../../locals';
import { sendOTPAction, checkMobileNumberAction, resendOTPAction, customersociallogin } from '../Util/Action.js';
import validate from 'validate.js';
import Demo1 from '../Apps/radio.js';
import DropdownAlert from 'react-native-dropdownalert';
import { Col, Row, Grid } from "react-native-easy-grid";

export default class MobileNumber extends Component {
    static navigationOptions = ({ navigation }) => {
        return {
            headerShown: false
        };
    };
    constructor(props) {
        super(props);

        this.a = React.createRef();
        this.b = React.createRef();
        this.c = React.createRef();
        this.d = React.createRef();
        this.e = React.createRef();
        this.f = React.createRef();
        this.g = React.createRef();
        this.h = React.createRef();
        this.i = React.createRef();
        this.j = React.createRef();
        this.state = {
            aValue: '',
            bValue: '',
            cValue: '',
            dValue: '',
            eValue: '',
            fValue: '',
            gValue: '',
            hValue: '',
            iValue: '',
            jValue: '',
            mobile: '',
            mobileError: '',
            country: '',
            loader: false
        };
    }

    _twoOptionAlertHandler = () => {
        //function to make two option alert
        Alert.alert(
            //title
            'Tearm and conditions',
            //body
            'Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source. Lorem Ipsum comes from sections 1.10.32 and 1.10.33 of "de Finibus Bonorum et Malorum" (The Extremes of Good and Evil) by Cicero, written in 45 BC. This book is a treatise on the theory of ethics, very popular during the Renaissance. The first line of Lorem Ipsum, "Lorem ipsum dolor sit amet..", comes from a line in section 1.10.32.The standard chunk of Lorem Ipsum used since the 1500s is reproduced below for those interested. Sections 1.10.32 and 1.10.33 from "de Finibus Bonorum et Malorum" by Cicero are also reproduced in their exact original form, accompanied by English versions from the 1914 translation by H. Rackham.',
            [
                { text: 'Ok' },
                // {text: 'No', onPress: () => console.log('No Pressed'), style: 'cancel'},
            ],
            { cancelable: false }
            //clicking out side of alert will not cancel
        );
    }
    _onBlurr = () => {
        BackHandler.removeEventListener(
            "hardwareBackPress",
            this._handleBackButtonClick
        );
    };

    _onFocus = () => {
        BackHandler.addEventListener(
            "hardwareBackPress",
            this._handleBackButtonClick
        );
    };

    _handleBackButtonClick = () => this.props.navigation.navigate("Login");

    /* This function will run first before rest code */
    componentDidMount() {
        alert("component Did mount")
        const { navigation } = this.props;
        this.registerForPushNotifications();
        // /* Get mobile no to display on which sent OTP */
        const country = navigation.getParam('country')
        // console.log(country)
        const login_type = navigation.getParam('login_type')
        // console.log(login_type)
        // const concatNo = data.mobile;

        // this.setState({ mobileNo: concatNo })
        // /* Get mobile no to display on which sent OTP */

        /* Set focus on first OTP input when page load */
        // this.a.current.focus();
        /* Set focus on first OTP input when page load */
    }

    /* for get device token */
    registerForPushNotifications = async () => {
        
        const { status: existingStatus } = await Permissions.getAsync(
            Permissions.NOTIFICATIONS
        );
        let finalStatus = existingStatus;

        if (existingStatus !== 'granted') {
            const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
            finalStatus = status;
        }

        if (finalStatus !== 'granted') {
            return;
        }

        // Get the token that uniquely identifies this device
        let token = await Notifications.getExpoPushTokenAsync();
        this.setState({ token: token });
        
    }

    focusNext(currentRef, nextRef, value) {
        if (currentRef !== this.j && value) {
            nextRef.current.focus();
        }
        if (currentRef == this.a) {
            this.setState({ aValue: value })
        }
        if (currentRef == this.b) {
            this.setState({ bValue: value })
        }
        if (currentRef == this.c) {
            this.setState({ cValue: value })
        }
        if (currentRef == this.d) {
            this.setState({ dValue: value })
        }
        if (currentRef == this.e) {
            this.setState({ eValue: value })
        }
        if (currentRef == this.f) {
            this.setState({ fValue: value })
        }
        if (currentRef == this.g) {
            this.setState({ gValue: value })
        }
        if (currentRef == this.h) {
            this.setState({ hValue: value })
        }
        if (currentRef == this.i) {
            this.setState({ iValue: value })
        }
        if (currentRef == this.j) {
            this.setState({ jValue: value })
        }
    }
    focusPrevious(key, previousRef) {
        if (key === 'Backspace') {
            var value = '';
            if (previousRef == this.a) {
                this.setState({ aValue: value })
            }
            if (previousRef == this.b) {
                this.setState({ bValue: value })
            }
            if (previousRef == this.c) {
                this.setState({ cValue: value })
            }
            if (previousRef == this.d) {
                this.setState({ dValue: value })
            }
            if (previousRef == this.e) {
                this.setState({ eValue: value })
            }
            if (previousRef == this.f) {
                this.setState({ fValue: value })
            }
            if (previousRef == this.g) {
                this.setState({ gValue: value })
            }
            if (previousRef == this.h) {
                this.setState({ hValue: value })
            }
            if (previousRef == this.i) {
                this.setState({ iValue: value })
            }
            if (previousRef == this.j) {
                this.setState({ jValue: value })
            }

            previousRef.current.focus();
        }
    }

    onFocus(ref) {
        if (ref == this.b) {
            if (this.state.aValue == '') {

                this.a.current.focus();
            }
        }
        if (ref == this.c) {
            if (this.state.bValue == '') {

                this.b.current.focus();
            }
        }
        if (ref == this.d) {
            if (this.state.cValue == '') {

                this.c.current.focus();
            }
        }
        if (ref == this.e) {
            if (this.state.dValue == '') {

                this.d.current.focus();
            }
        }
        if (ref == this.f) {
            if (this.state.eValue == '') {

                this.e.current.focus();
            }
        }
        if (ref == this.g) {
            if (this.state.fValue == '') {

                this.f.current.focus();
            }
        }
        if (ref == this.h) {
            if (this.state.gValue == '') {

                this.g.current.focus();
            }
        }
        if (ref == this.i) {
            if (this.state.hValue == '') {

                this.h.current.focus();
            }
        }
        if (ref == this.j) {
            if (this.state.iValue == '') {

                this.i.current.focus();
            }
        }
    }
    // Google login start.
    // googleSignIn = async () => {

    //     this.setState({ loader: true });
    //     const { navigate } = this.props.navigation;
    //     try {

    //         const result = await Google.logInAsync({
    //             androidClientId:
    //                 //   "863143925364-phk92bgsan70m0rtm0tqmptboq6f3rin.apps.googleusercontent.com",
    //                 "351662705090-p4ac4p3i3acnv9j79ojantklfa7kk88k.apps.googleusercontent.com",
    //             iosClientId:
    //                 //   "863143925364-ps5qfmo5q65ap8qjh5j1jl7fno3k0t9m.apps.googleusercontent.com" ,
    //                 "351662705090-tq8t4trb76ch2uopa585rpvgvh0o99gd.apps.googleusercontent.com",
    //             androidStandaloneAppClientId: "351662705090-p4ac4p3i3acnv9j79ojantklfa7kk88k.apps.googleusercontent.com",
    //             iosStandaloneAppClientId: "351662705090-tq8t4trb76ch2uopa585rpvgvh0o99gd.apps.googleusercontent.com",
    //             scopes: ["profile", "email"]
    //         });

    //         if (result.type === "success") {
    //             console.log(result.user);
    //             var data = {
    //                 login_type: 'google',
    //                 login_credential: result.user.id,
    //                 email: result.user.email,
    //                 name: result.user.name,
    //                 mobile: this.state.mobile,
    //                 device_token: this.state.token,
    //             }
    //             var response = customersociallogin(data).then(function (responseJson) {
    //                 console.log(responseJson);
    //                 if (responseJson.isError === false) {
    //                     // save user data and passport token in async storage for future use in application and redirect to app and user login
    //                     storage.storeUserDetail(responseJson.result).then((data) => {
    //                         this.setState({ loader: false });
    //                         // navigate((responseJson.result.is_payment_method_save == 0 ) ? 'App' : 'App');
    //                         navigate('App');
    //                     })
    //                         .catch((err) => {
    //                             console.log(err)
    //                         });
    //                 } else {
    //                     // alert("failed");
    //                     console.log(responseJson.message);
    //                     // this.setState({ loader: false });
    //                 }
    //             }.bind(this));

    //         } else {
    //             console.log("cancelled")
    //             navigate('Login')
    //         }
    //     } catch (e) {
    //         console.log("error", e)
    //     }
    // }
    // //Google login end.
    // // Facebook  login start.
    // facebookLogin = async () => {
    //     const { navigate } = this.props.navigation;
    //     try {
    //         await Facebook.initializeAsync('688051215392905', 'Mas Rapido');
    //         const {
    //             type,
    //             token,
    //             expires,
    //             permissions,
    //             declinedPermissions,
    //         } = await Facebook.logInWithReadPermissionsAsync({
    //             permissions: ['public_profile', 'email'],
    //             // behaviors: 'webs'
    //         });

    //         if (type === 'success') {

    //             fetch(`https://graph.facebook.com/me?access_token=${token}&fields=id,name,email,picture.height(500)`)
    //                 .then(response => response.json())
    //                 .then(data => {

    //                     console.log(data);
    //                     // setLoggedinStatus(true);
    //                     // setUserData(data);
    //                     var FacebookData = {
    //                         login_type: 'facebook',
    //                         login_credential: data.id,
    //                         email: data.email,
    //                         name: data.name,
    //                         mobile: this.state.mobile,
    //                         device_token: this.state.token,

    //                     }
    //                     var response = customersociallogin(FacebookData).then(function (responseJson) {
    //                         if (responseJson.isError == false) {
    //                             storage.storeUserDetail(responseJson.result).then((data) => {
    //                                 this.setState({ loader: false });
    //                                 navigate((responseJson.result.is_payment_method_save == 0) ? 'App' : 'App');
    //                             })
    //                                 .catch((err) => {
    //                                     console.log(err)
    //                                 });
    //                         } else {
    //                             navigate('Login')
    //                         }
    //                     }.bind(this));
    //                 })
    //                 .catch(e => console.log(e))

    //         } else {
    //             console.log('Cancelled by user');
    //         }
    //     } catch ({ message }) {
    //         console.log(`Facebook Login Error: ${message}`);
    //         alert(`Facebook Login Error: ${message}`);
    //     }
    // }
    // Facebook login end.
    submit() {
        const { navigate } = this.props.navigation;
        const country = this.props.navigation.getParam('country')
        const login_type = this.props.navigation.getParam("login_type");

        const { aValue, bValue, cValue, dValue, eValue, fValue, gValue, hValue, iValue, jValue } = this.state;
        if (country == 'IN') {

            if (aValue == '') {
                // this.refs.defaultToastBottomWithDifferentColor.ShowToastFunction('10 digit required.');
                this.dropdown.alertWithType('error', 'Error', t('10 digit required'));

                return false;
            }


            if (bValue == '') {
                // this.refs.defaultToastBottomWithDifferentColor.ShowToastFunction('10 digit required.');
                this.dropdown.alertWithType('error', 'Error', t('10 digit required'));

                return false;
            }

            if (cValue == '') {
                // this.refs.defaultToastBottomWithDifferentColor.ShowToastFunction('10 digit required.');
                this.dropdown.alertWithType('error', 'Error', t('10 digit required'));

                return false;
            }

            if (dValue == '') {
                // this.refs.defaultToastBottomWithDifferentColor.ShowToastFunction('10 digit required.');
                this.dropdown.alertWithType('error', 'Error', t('10 digit required'));

                return false;
            }
            if (eValue == '') {
                // this.refs.defaultToastBottomWithDifferentColor.ShowToastFunction('10 digit required.');
                this.dropdown.alertWithType('error', 'Error', t('10 digit required'));

                return false;
            }
            if (fValue == '') {
                // this.refs.defaultToastBottomWithDifferentColor.ShowToastFunction('10 digit required.');
                this.dropdown.alertWithType('error', 'Error', t('10 digit required'));

                return false;
            }
            if (gValue == '') {
                // this.refs.defaultToastBottomWithDifferentColor.ShowToastFunction('10 digit required.');
                this.dropdown.alertWithType('error', 'Error', t('10 digit required'));

                return false;
            }
            if (hValue == '') {
                // this.refs.defaultToastBottomWithDifferentColor.ShowToastFunction('10 digit required.');
                this.dropdown.alertWithType('error', 'Error', t('10 digit required'));

                return false;
            }
            if (iValue == '') {
                // this.refs.defaultToastBottomWithDifferentColor.ShowToastFunction('10 digit required.');
                this.dropdown.alertWithType('error', 'Error', t('10 digit required'));

                return false;
            }
            if (jValue == '') {
                // this.refs.defaultToastBottomWithDifferentColor.ShowToastFunction('10 digit required.');
                this.dropdown.alertWithType('error', 'Error', t('10 digit required'));

                return false;
            }



        } else {
            if (aValue == '') {
                // this.refs.defaultToastBottomWithDifferentColor.ShowToastFunction('8 digit required.');
                this.dropdown.alertWithType('error', 'Error', t('8 digit required'));

                return false;
            }

            if (bValue == '') {
                // this.refs.defaultToastBottomWithDifferentColor.ShowToastFunction('8 digit required.');
                this.dropdown.alertWithType('error', 'Error', t('8 digit required'));

                return false;
            }

            if (cValue == '') {
                // this.refs.defaultToastBottomWithDifferentColor.ShowToastFunction('8 digit required.');
                this.dropdown.alertWithType('error', 'Error', t('8 digit required'));

                return false;
            }

            if (dValue == '') {
                // this.refs.defaultToastBottomWithDifferentColor.ShowToastFunction('8 digit required.');
                this.dropdown.alertWithType('error', 'Error', t('8 digit required'));

                return false;
            }
            if (eValue == '') {
                // this.refs.defaultToastBottomWithDifferentColor.ShowToastFunction('8 digit required.');
                this.dropdown.alertWithType('error', 'Error', t('8 digit required'));

                return false;
            }
            if (fValue == '') {
                // this.refs.defaultToastBottomWithDifferentColor.ShowToastFunction('8 digit required.');
                this.dropdown.alertWithType('error', 'Error', t('8 digit required'));

                return false;
            }
            if (gValue == '') {
                // this.refs.defaultToastBottomWithDifferentColor.ShowToastFunction('8 digit required.');
                this.dropdown.alertWithType('error', 'Error', t('8 digit required'));

                return false;
            }
            if (hValue == '') {
                // this.refs.defaultToastBottomWithDifferentColor.ShowToastFunction('8 digit required.');
                this.dropdown.alertWithType('error', 'Error', t('8 digit required'));

                return false;
            }
        }
        // testing OTP for Panama
        // if (country == 'IN') {

        //     if (aValue == '') {
        //         this.refs.defaultToastBottomWithDifferentColor.ShowToastFunction('8 digit required.');
        //     }

        //     if (bValue == '') {
        //         this.refs.defaultToastBottomWithDifferentColor.ShowToastFunction('8 digit required.');
        //     }

        //     if (cValue == '') {
        //         this.refs.defaultToastBottomWithDifferentColor.ShowToastFunction('8 digit required.');
        //     }

        //     if (dValue == '') {
        //         this.refs.defaultToastBottomWithDifferentColor.ShowToastFunction('8 digit required.');
        //     }
        //     if (eValue == '') {
        //         this.refs.defaultToastBottomWithDifferentColor.ShowToastFunction('8 digit required.');
        //     }
        //     if (fValue == '') {
        //         this.refs.defaultToastBottomWithDifferentColor.ShowToastFunction('8 digit required.');
        //     }
        //     if (gValue == '') {
        //         this.refs.defaultToastBottomWithDifferentColor.ShowToastFunction('8 digit required.');
        //     }
        //     if (hValue == '') {
        //         this.refs.defaultToastBottomWithDifferentColor.ShowToastFunction('8 digit required.');
        //     }
        // } else {
        //     if (aValue == '') {
        //         this.refs.defaultToastBottomWithDifferentColor.ShowToastFunction('8 digit required.');
        //     }

        //     if (bValue == '') {
        //         this.refs.defaultToastBottomWithDifferentColor.ShowToastFunction('8 digit required.');
        //     }

        //     if (cValue == '') {
        //         this.refs.defaultToastBottomWithDifferentColor.ShowToastFunction('8 digit required.');
        //     }

        //     if (dValue == '') {
        //         this.refs.defaultToastBottomWithDifferentColor.ShowToastFunction('8 digit required.');
        //     }
        //     if (eValue == '') {
        //         this.refs.defaultToastBottomWithDifferentColor.ShowToastFunction('8 digit required.');
        //     }
        //     if (fValue == '') {
        //         this.refs.defaultToastBottomWithDifferentColor.ShowToastFunction('8 digit required.');
        //     }
        //     if (gValue == '') {
        //         this.refs.defaultToastBottomWithDifferentColor.ShowToastFunction('8 digit required.');
        //     }
        //     if (hValue == '') {
        //         this.refs.defaultToastBottomWithDifferentColor.ShowToastFunction('8 digit required.');
        //     }
        //     if (iValue == '') {
        //         this.refs.defaultToastBottomWithDifferentColor.ShowToastFunction('8 digit required.');
        //     }
        //     if (jValue == '') {
        //         this.refs.defaultToastBottomWithDifferentColor.ShowToastFunction('8 digit required.');
        //     }
        // }
        Keyboard.dismiss();

        if (country == 'IN') {

            if (aValue != '' && bValue != '' && cValue != '' && dValue != '' && eValue != '' && fValue != '' && gValue != '' && hValue != '' && iValue != '' && jValue != '') {
                var enteredMobileNumber = aValue + bValue + cValue + dValue + eValue + fValue + gValue + hValue + iValue + jValue;
            }
        }
        else {
            if (aValue != '' && bValue != '' && cValue != '' && dValue != '' && eValue != '' && fValue != '' && gValue != '' && hValue != '') {
                var enteredMobileNumber = aValue + bValue + cValue + dValue + eValue + fValue + gValue + hValue;
            }
        }
        const mobileData = {
            mobile: enteredMobileNumber,
            app_name: 'Customer'
        };
        this.setState({loader:true});
        checkMobileNumberAction(mobileData).then((responseJson) => {
            if (responseJson.isError == false) {
                var response = sendOTPAction(enteredMobileNumber, country).then(
                    function (responseJson) {
                        // console.log(responseJson);
                        if (responseJson.type == "success") {

                            if (login_type == "facebook") {
                                navigate("VerifyOTP", {
                                    mobile: enteredMobileNumber,
                                    login_type: "facebook",
                                    country: country,
                                });
                                // navigate('VerifyOTP', { 'mobile': mobile, 'login_type': 'google', country: country });
                                this.setState({ loader: false });
                            } else if (login_type == "google") {
                                // this.googleSignIn();
                                navigate("VerifyOTP", {
                                    mobile: enteredMobileNumber,
                                    login_type: "google",
                                    country: country,
                                });
                                // navigate('VerifyOTP', { 'mobile': mobile, 'login_type': 'google', country: country });
                                this.setState({ loader: false });
                            } else {
                                // this.refs.defaultToastBottomWithDifferentColor.ShowToastFunction(
                                //   "Something went wrong..."
                                // );
                                this.setState({ loader: false });
                                this.dropdown.alertWithType('error', 'Error', t('something went wrong'));
                            }
                        } else {
                            this.setState({ loader: false });
                            // this.refs.defaultToastBottomWithDifferentColor.ShowToastFunction(
                            //   responseJson.message
                            // );
                            this.dropdown.alertWithType('error', 'Error', responseJson.message);
                            // alert(responseJson.message);
                        }
                    }.bind(this)
                );
            } else {
                this.setState({ loader: false });
                this.dropdown.alertWithType('error', 'Error', responseJson.message);
                // return false;
            }
        });



        //         // const mobile = this.props.navigation.getParam('mobile');
        //         const mobile = this.state;
        //         // const country = this.props.navigation.getParam("country");
        //         const login_type = this.props.navigation.getParam('login_type');
        //         // this.setState({ mobile: mobile });




        //         this.setState({ loader: true });
        //         // if(otp === "1234"){
        //         // if (responseJson.type == "success") {
        //         //     if(login_type == "facebook")
        //         //     {
        //         //         this.facebookLogin();
        //         //     }else if(login_type == "google"){
        //         //         this.googleSignIn();
        //         //     }else{
        //         //         this.refs.defaultToastBottomWithDifferentColor.ShowToastFunction("Something went wrong...");
        //         //     }

        //         // } else {
        //         //     this.setState({ loader: false });
        //         //     this.refs.defaultToastBottomWithDifferentColor.ShowToastFunction(responseJson.message);

        //         // }
        //         // }else{
        //         //     this.setState({ loader: false });
        //         //     this.refs.defaultToastBottomWithDifferentColor.ShowToastFunction("OTP not match");
        //         // }




        //         // var MobileNumber = {
        //         //     // login_type: 'facebook',
        //         //     // login_credential: data.id,
        //         //     // email: data.email,
        //         //     // name: data.name,
        //         //     mobile: enteredMobileNumber,
        //         //     // device_token: this.state.token,     
        //         // }
        //         // console.log(MobileNumber)

        //     }


        // } else {
        //     if (aValue != '' && bValue != '' && cValue != '' && dValue != '' && eValue != '' && fValue != '' && gValue != '' && hValue != '') {
        //         // const mobile = this.props.navigation.getParam('mobile');
        //         const mobile = this.state;
        //         // const country = this.props.navigation.getParam("country");
        //         const login_type = this.props.navigation.getParam('login_type');
        //         // this.setState({ mobile: mobile });




        //         this.setState({ loader: true });
        //         // if(otp === "1234"){
        //         // if (responseJson.type == "success") {
        //         //     if(login_type == "facebook")
        //         //     {
        //         //         this.facebookLogin();
        //         //     }else if(login_type == "google"){
        //         //         this.googleSignIn();
        //         //     }else{
        //         //         this.refs.defaultToastBottomWithDifferentColor.ShowToastFunction("Something went wrong...");
        //         //     }

        //         // } else {
        //         //     this.setState({ loader: false });
        //         //     this.refs.defaultToastBottomWithDifferentColor.ShowToastFunction(responseJson.message);

        //         // }
        //         // }else{
        //         //     this.setState({ loader: false });
        //         //     this.refs.defaultToastBottomWithDifferentColor.ShowToastFunction("OTP not match");
        //         // }




        //         // var MobileNumber = {
        //         //     // login_type: 'facebook',
        //         //     // login_credential: data.id,
        //         //     // email: data.email,
        //         //     // name: data.name,
        //         //     mobile: enteredMobileNumber,
        //         //     // device_token: this.state.token,     
        //         // }
        //         // console.log(MobileNumber)
        //         var response = sendOTPAction(enteredMobileNumber, country).then(function (responseJson) {
        //             console.log(responseJson)
        //             if (responseJson.type == "success") {
        //                 if (login_type == "facebook") {
        //                     // this.facebookLogin();
        //                     navigate('VerifyOTP', { 'mobile': enteredMobileNumber, 'login_type': 'facebook', country: country });
        //                     // navigate('VerifyOTP', { 'mobile': mobile, 'login_type': 'google', country: country });
        //                     this.setState({ loader: false });
        //                 } else if (login_type == "google") {
        //                     this.googleSignIn();
        //                     navigate('VerifyOTP', { 'mobile': enteredMobileNumber, 'login_type': 'google', country: country });
        //                     // navigate('VerifyOTP', { 'mobile': mobile, 'login_type': 'google', country: country });
        //                     this.setState({ loader: false });
        //                 } else {
        //                     this.refs.defaultToastBottomWithDifferentColor.ShowToastFunction("Something went wrong...");
        //                 }

        //             } else {
        //                 this.setState({ loader: false });
        //                 this.refs.defaultToastBottomWithDifferentColor.ShowToastFunction(responseJson.message);
        //                 alert(responseJson.message);
        //             }
        //         }.bind(this));
        //     }
    }
    // testing for panama
    // if (country == 'IN') {

    //     if (aValue != '' && bValue != '' && cValue != '' && dValue != '' && eValue != '' && fValue != '' && gValue != '' && hValue != '') {
    //         // const mobile = this.props.navigation.getParam('mobile');
    //         const mobile = this.state;
    //         // const country = this.props.navigation.getParam("country");
    //         const login_type = this.props.navigation.getParam('login_type');
    //         // this.setState({ mobile: mobile });

    //         var enteredMobileNumber = aValue + bValue + cValue + dValue + eValue + fValue + gValue + hValue;


    //         this.setState({ loader: true });
    //         // if(otp === "1234"){
    //         // if (responseJson.type == "success") {
    //         //     if(login_type == "facebook")
    //         //     {
    //         //         this.facebookLogin();
    //         //     }else if(login_type == "google"){
    //         //         this.googleSignIn();
    //         //     }else{
    //         //         this.refs.defaultToastBottomWithDifferentColor.ShowToastFunction("Something went wrong...");
    //         //     }

    //         // } else {
    //         //     this.setState({ loader: false });
    //         //     this.refs.defaultToastBottomWithDifferentColor.ShowToastFunction(responseJson.message);

    //         // }
    //         // }else{
    //         //     this.setState({ loader: false });
    //         //     this.refs.defaultToastBottomWithDifferentColor.ShowToastFunction("OTP not match");
    //         // }




    //         // var MobileNumber = {
    //         //     // login_type: 'facebook',
    //         //     // login_credential: data.id,
    //         //     // email: data.email,
    //         //     // name: data.name,
    //         //     mobile: enteredMobileNumber,
    //         //     // device_token: this.state.token,     
    //         // }
    //         // console.log(MobileNumber)
    //         var response = sendOTPAction(enteredMobileNumber, country).then(function (responseJson) {
    //             console.log(responseJson)
    //             if (responseJson.type == "success") {
    //                 if (login_type == "facebook") {
    //                     // this.facebookLogin();
    //                     navigate('VerifyOTP', { 'mobile': enteredMobileNumber, 'login_type': 'facebook', country: country });
    //                     // navigate('VerifyOTP', { 'mobile': mobile, 'login_type': 'google', country: country });
    //                     this.setState({ loader: false });
    //                 } else if (login_type == "google") {
    //                     this.googleSignIn();
    //                     navigate('VerifyOTP', { 'mobile': enteredMobileNumber, 'login_type': 'google', country: country });
    //                     // navigate('VerifyOTP', { 'mobile': mobile, 'login_type': 'google', country: country });
    //                     this.setState({ loader: false });
    //                 } else {
    //                     this.refs.defaultToastBottomWithDifferentColor.ShowToastFunction("Something went wrong...");
    //                 }

    //             } else {
    //                 this.setState({ loader: false });
    //                 this.refs.defaultToastBottomWithDifferentColor.ShowToastFunction(responseJson.message);
    //                 alert(responseJson.message);
    //             }
    //         }.bind(this));
    //     }
    // } else {
    //     if (aValue != '' && bValue != '' && cValue != '' && dValue != '' && eValue != '' && fValue != '' && gValue != '' && hValue != '' && iValue != '' && jValue != '') {
    //         // const mobile = this.props.navigation.getParam('mobile');
    //         const mobile = this.state;
    //         // const country = this.props.navigation.getParam("country");
    //         const login_type = this.props.navigation.getParam('login_type');
    //         // this.setState({ mobile: mobile });

    //         var enteredMobileNumber = aValue + bValue + cValue + dValue + eValue + fValue + gValue + hValue + iValue + jValue;


    //         this.setState({ loader: true });
    //         // if(otp === "1234"){
    //         // if (responseJson.type == "success") {
    //         //     if(login_type == "facebook")
    //         //     {
    //         //         this.facebookLogin();
    //         //     }else if(login_type == "google"){
    //         //         this.googleSignIn();
    //         //     }else{
    //         //         this.refs.defaultToastBottomWithDifferentColor.ShowToastFunction("Something went wrong...");
    //         //     }

    //         // } else {
    //         //     this.setState({ loader: false });
    //         //     this.refs.defaultToastBottomWithDifferentColor.ShowToastFunction(responseJson.message);

    //         // }
    //         // }else{
    //         //     this.setState({ loader: false });
    //         //     this.refs.defaultToastBottomWithDifferentColor.ShowToastFunction("OTP not match");
    //         // }




    //         // var MobileNumber = {
    //         //     // login_type: 'facebook',
    //         //     // login_credential: data.id,
    //         //     // email: data.email,
    //         //     // name: data.name,
    //         //     mobile: enteredMobileNumber,
    //         //     // device_token: this.state.token,     
    //         // }
    //         // console.log(MobileNumber)
    //         var response = sendOTPAction(enteredMobileNumber, country).then(function (responseJson) {
    //             console.log(responseJson)
    //             if (responseJson.type == "success") {
    //                 if (login_type == "facebook") {
    //                     // this.facebookLogin();
    //                     navigate('VerifyOTP', { 'mobile': enteredMobileNumber, 'login_type': 'facebook', country: country });
    //                     // navigate('VerifyOTP', { 'mobile': mobile, 'login_type': 'google', country: country });
    //                     this.setState({ loader: false });
    //                 } else if (login_type == "google") {
    //                     this.googleSignIn();
    //                     navigate('VerifyOTP', { 'mobile': enteredMobileNumber, 'login_type': 'google', country: country });
    //                     // navigate('VerifyOTP', { 'mobile': mobile, 'login_type': 'google', country: country });
    //                     this.setState({ loader: false });
    //                 } else {
    //                     this.refs.defaultToastBottomWithDifferentColor.ShowToastFunction("Something went wrong...");
    //                 }

    //             } else {
    //                 this.setState({ loader: false });
    //                 this.refs.defaultToastBottomWithDifferentColor.ShowToastFunction(responseJson.message);
    //                 alert(responseJson.message);
    //             }
    //         }.bind(this));
    //     }
    // }


    render() {
        const { navigate } = this.props.navigation;
        const { loader } = this.state;
        const keyboardVerticalOffset = Platform.OS === 'ios' ? 50 : 0
        const country = this.props.navigation.getParam("country");
        if (!loader) {
            return (

                <View style={styles.container}>
                    <NavigationEvents
                        onWillFocus={this._onFocus}
                        onWillBlur={this._onBlurr}
                    />
                    <StatusBar />

                    <Row style={{ ...Platform.select({ ios: { height: 50, marginTop: 30 }, android: { height: 50, marginTop: 20 } }) }}>
                        <Col>
                            <TouchableOpacity onPress={() => navigate('Login')} >
                                <Image source={require('../../images/Back-Arrow.png')} style={styles.BackArrow} />
                            </TouchableOpacity>
                        </Col>
                        {/* <Col>
                        <TouchableOpacity style={{alignItems: 'flex-end'}}> 
                            <Image source={require('../../images/Menu.png')} style={styles.Menu}/>
                        </TouchableOpacity> 
                    </Col> */}

                    </Row>
                    <ScrollView showsVerticalScrollIndicator={false}>
                        <KeyboardAvoidingView behavior='position' keyboardVerticalOffset={keyboardVerticalOffset}>
                            {/* <View style={styles.container}> */}
                            <Row >
                                <Col style={styles.Center} >
                                    {/* <Backscreen /> */}
                                    <Image source={require('../../images/Logo.png')} style={styles.logo} />

                                </Col>
                            </Row>
                            <Row>
                                <Col style={styles.Center}>
                                    <Text style={{ fontFamily: "Inter-Black", fontSize: 25 }}>
                                        {t('Enter your cell phone number')}
                                    </Text>
                                </Col>
                            </Row>
                            {/* </View> */}
                            {/* {country == 'IN'} */}
                            <Row style={styles.input}>
                                {/* <Row style={{width: "10%", backgroundColor:'red'}}> */}
                                <Image source={require('../../images/Cellphone.png')} style={styles.Cellphone} />
                                {/* </Row> */}
                                {country == 'IN' ? (

                                    <View>
                                        <Row style={{ marginLeft: 10, marginBottom: 10 }}>
                                            <TextInput
                                                keyboardType="numeric"
                                                selectTextOnFocus
                                                maxLength={1}
                                                style={styles.OTP}
                                                ref={this.a}
                                                onFocus={ref => this.onFocus(ref)}
                                                onChangeText={v => this.focusNext(this.a, this.b, v)}
                                                value={this.state.aValue}>
                                            </TextInput>
                                            <TextInput
                                                keyboardType="numeric"
                                                selectTextOnFocus
                                                maxLength={1}
                                                style={styles.OTP}
                                                ref={this.b}
                                                onFocus={ref => this.onFocus(this.b)}
                                                onKeyPress={e => this.focusPrevious(e.nativeEvent.key, this.a)}
                                                onChangeText={v => this.focusNext(this.b, this.c, v)}
                                                value={this.state.bValue}>
                                            </TextInput>
                                            <TextInput
                                                keyboardType="numeric"
                                                selectTextOnFocus
                                                maxLength={1}
                                                style={styles.OTP}
                                                ref={this.c}
                                                onFocus={ref => this.onFocus(this.c)}
                                                onKeyPress={e => this.focusPrevious(e.nativeEvent.key, this.b)}
                                                onChangeText={v => this.focusNext(this.c, this.d, v)}
                                                value={this.state.cValue}>
                                            </TextInput>
                                            <TextInput
                                                keyboardType="numeric"
                                                selectTextOnFocus
                                                maxLength={1}
                                                style={styles.OTP}
                                                ref={this.d}
                                                onFocus={ref => this.onFocus(this.d)}
                                                onKeyPress={e => this.focusPrevious(e.nativeEvent.key, this.c)}
                                                onChangeText={v => this.focusNext(this.d, this.e, v)}
                                                value={this.state.dValue}>
                                            </TextInput>
                                            <TextInput
                                                keyboardType="numeric"
                                                selectTextOnFocus
                                                maxLength={1}
                                                style={styles.OTP}
                                                ref={this.e}
                                                onFocus={ref => this.onFocus(this.e)}
                                                onKeyPress={e => this.focusPrevious(e.nativeEvent.key, this.d)}
                                                onChangeText={v => this.focusNext(this.e, this.f, v)}
                                                value={this.state.eValue}>
                                            </TextInput>
                                            <TextInput
                                                keyboardType="numeric"
                                                selectTextOnFocus
                                                maxLength={1}
                                                style={styles.OTP}
                                                ref={this.f}
                                                onFocus={ref => this.onFocus(this.f)}
                                                onKeyPress={e => this.focusPrevious(e.nativeEvent.key, this.e)}
                                                onChangeText={v => this.focusNext(this.f, this.g, v)}
                                                value={this.state.fValue}>
                                            </TextInput>
                                            <TextInput
                                                keyboardType="numeric"
                                                selectTextOnFocus
                                                maxLength={1}
                                                style={styles.OTP}
                                                ref={this.g}
                                                onFocus={ref => this.onFocus(this.g)}
                                                onKeyPress={e => this.focusPrevious(e.nativeEvent.key, this.f)}
                                                onChangeText={v => this.focusNext(this.g, this.h, v)}
                                                value={this.state.gValue}>
                                            </TextInput>
                                            <TextInput
                                                keyboardType="numeric"
                                                selectTextOnFocus
                                                maxLength={1}
                                                style={styles.OTP}
                                                ref={this.h}
                                                onFocus={ref => this.onFocus(this.h)}
                                                onKeyPress={e => this.focusPrevious(e.nativeEvent.key, this.g)}
                                                onChangeText={v => this.focusNext(this.h, this.i, v)}
                                                value={this.state.hValue}>
                                            </TextInput>
                                            <TextInput
                                                keyboardType="numeric"
                                                selectTextOnFocus
                                                maxLength={1}
                                                style={styles.OTP}
                                                ref={this.i}
                                                onFocus={ref => this.onFocus(this.i)}
                                                onKeyPress={e => this.focusPrevious(e.nativeEvent.key, this.h)}
                                                onChangeText={v => this.focusNext(this.i, this.j, v)}
                                                value={this.state.iValue}>
                                            </TextInput>
                                            <TextInput
                                                keyboardType="numeric"
                                                selectTextOnFocus
                                                maxLength={1}
                                                style={styles.OTP}
                                                ref={this.j}
                                                onFocus={ref => this.onFocus(this.j)}
                                                onKeyPress={e => this.focusPrevious(e.nativeEvent.key, this.i)}
                                                onChangeText={v => this.focusNext(this.j, this.j, v)}
                                                value={this.state.jValue}>
                                            </TextInput>
                                        </Row>
                                    </View>

                                ) : (
                                        <View>
                                            <Row style={{ marginLeft: 10, marginBottom: 10 }}>
                                                <TextInput
                                                    keyboardType="numeric"
                                                    selectTextOnFocus
                                                    maxLength={1}
                                                    style={styles.OTP}
                                                    ref={this.a}
                                                    onFocus={ref => this.onFocus(ref)}
                                                    onChangeText={v => this.focusNext(this.a, this.b, v)}
                                                    value={this.state.aValue}>
                                                </TextInput>
                                                <TextInput
                                                    keyboardType="numeric"
                                                    selectTextOnFocus
                                                    maxLength={1}
                                                    style={styles.OTP}
                                                    ref={this.b}
                                                    onFocus={ref => this.onFocus(this.b)}
                                                    onKeyPress={e => this.focusPrevious(e.nativeEvent.key, this.a)}
                                                    onChangeText={v => this.focusNext(this.b, this.c, v)}
                                                    value={this.state.bValue}>
                                                </TextInput>
                                                <TextInput
                                                    keyboardType="numeric"
                                                    selectTextOnFocus
                                                    maxLength={1}
                                                    style={styles.OTP}
                                                    ref={this.c}
                                                    onFocus={ref => this.onFocus(this.c)}
                                                    onKeyPress={e => this.focusPrevious(e.nativeEvent.key, this.b)}
                                                    onChangeText={v => this.focusNext(this.c, this.d, v)}
                                                    value={this.state.cValue}>
                                                </TextInput>
                                                <TextInput
                                                    keyboardType="numeric"
                                                    selectTextOnFocus
                                                    maxLength={1}
                                                    style={styles.OTP}
                                                    ref={this.d}
                                                    onFocus={ref => this.onFocus(this.d)}
                                                    onKeyPress={e => this.focusPrevious(e.nativeEvent.key, this.c)}
                                                    onChangeText={v => this.focusNext(this.d, this.e, v)}
                                                    value={this.state.dValue}>
                                                </TextInput>
                                                <TextInput
                                                    keyboardType="numeric"
                                                    selectTextOnFocus
                                                    maxLength={1}
                                                    style={styles.OTP}
                                                    ref={this.e}
                                                    onFocus={ref => this.onFocus(this.e)}
                                                    onKeyPress={e => this.focusPrevious(e.nativeEvent.key, this.d)}
                                                    onChangeText={v => this.focusNext(this.e, this.f, v)}
                                                    value={this.state.eValue}>
                                                </TextInput>
                                                <TextInput
                                                    keyboardType="numeric"
                                                    selectTextOnFocus
                                                    maxLength={1}
                                                    style={styles.OTP}
                                                    ref={this.f}
                                                    onFocus={ref => this.onFocus(this.f)}
                                                    onKeyPress={e => this.focusPrevious(e.nativeEvent.key, this.e)}
                                                    onChangeText={v => this.focusNext(this.f, this.g, v)}
                                                    value={this.state.fValue}>
                                                </TextInput>
                                                <TextInput
                                                    keyboardType="numeric"
                                                    selectTextOnFocus
                                                    maxLength={1}
                                                    style={styles.OTP}
                                                    ref={this.g}
                                                    onFocus={ref => this.onFocus(this.g)}
                                                    onKeyPress={e => this.focusPrevious(e.nativeEvent.key, this.f)}
                                                    onChangeText={v => this.focusNext(this.g, this.h, v)}
                                                    value={this.state.gValue}>
                                                </TextInput>
                                                <TextInput
                                                    keyboardType="numeric"
                                                    selectTextOnFocus
                                                    maxLength={1}
                                                    style={styles.OTP}
                                                    ref={this.h}
                                                    onFocus={ref => this.onFocus(this.h)}
                                                    onKeyPress={e => this.focusPrevious(e.nativeEvent.key, this.g)}
                                                    onChangeText={v => this.focusNext(this.h, this.h, v)}
                                                    value={this.state.hValue}>
                                                </TextInput>
                                            </Row>
                                        </View>
                                    )}
                                {/* testing for panama*/}
                                {/* {country == 'IN' ? (
                                    
                                        <View>
                                            <Row style={{ marginLeft: 10, marginBottom: 10 }}>
                                                <TextInput
                                                    keyboardType="numeric"
                                                    maxLength={1}
                                                    style={styles.OTP}
                                                    ref={this.a}
                                                    onChangeText={v => this.focusNext(this.a, this.b, v)}>
                                                </TextInput>
                                                <TextInput
                                                    keyboardType="numeric"
                                                    maxLength={1}
                                                    style={styles.OTP}
                                                    ref={this.b}
                                                    onKeyPress={e => this.focusPrevious(e.nativeEvent.key, this.a)}
                                                    onChangeText={v => this.focusNext(this.b, this.c, v)}>
                                                </TextInput>
                                                <TextInput
                                                    keyboardType="numeric"
                                                    maxLength={1}
                                                    style={styles.OTP}
                                                    ref={this.c}
                                                    onKeyPress={e => this.focusPrevious(e.nativeEvent.key, this.b)}
                                                    onChangeText={v => this.focusNext(this.c, this.d, v)}>
                                                </TextInput>
                                                <TextInput
                                                    keyboardType="numeric"
                                                    maxLength={1}
                                                    style={styles.OTP}
                                                    ref={this.d}
                                                    onKeyPress={e => this.focusPrevious(e.nativeEvent.key, this.c)}
                                                    onChangeText={v => this.focusNext(this.d, this.e, v)}>
                                                </TextInput>
                                                <TextInput
                                                    keyboardType="numeric"
                                                    maxLength={1}
                                                    style={styles.OTP}
                                                    ref={this.e}
                                                    onKeyPress={e => this.focusPrevious(e.nativeEvent.key, this.d)}
                                                    onChangeText={v => this.focusNext(this.e, this.f, v)}>
                                                </TextInput>
                                                <TextInput
                                                    keyboardType="numeric"
                                                    maxLength={1}
                                                    style={styles.OTP}
                                                    ref={this.f}
                                                    onKeyPress={e => this.focusPrevious(e.nativeEvent.key, this.e)}
                                                    onChangeText={v => this.focusNext(this.f, this.g, v)}>
                                                </TextInput>
                                                <TextInput
                                                    keyboardType="numeric"
                                                    maxLength={1}
                                                    style={styles.OTP}
                                                    ref={this.g}
                                                    onKeyPress={e => this.focusPrevious(e.nativeEvent.key, this.f)}
                                                    onChangeText={v => this.focusNext(this.g, this.h, v)}>
                                                </TextInput>
                                                <TextInput
                                                    keyboardType="numeric"
                                                    maxLength={1}
                                                    style={styles.OTP}
                                                    ref={this.h}
                                                    onKeyPress={e => this.focusPrevious(e.nativeEvent.key, this.g)}
                                                    onChangeText={v => this.focusNext(this.h, this.h, v)}>
                                                </TextInput>
                                            </Row>
                                        </View>
                                    ) : (
                                            <View>
                                                <Row style={{ marginLeft: 10, marginBottom: 10 }}>

                                                   
                                                    <TextInput
                                                        keyboardType="numeric"
                                                        maxLength={1}
                                                        style={styles.OTP}
                                                        ref={this.a}
                                                        onChangeText={v => this.focusNext(this.a, this.b, v)}>
                                                    </TextInput>
                                                    <TextInput
                                                        keyboardType="numeric"
                                                        maxLength={1}
                                                        style={styles.OTP}
                                                        ref={this.b}
                                                        onKeyPress={e => this.focusPrevious(e.nativeEvent.key, this.a)}
                                                        onChangeText={v => this.focusNext(this.b, this.c, v)}>
                                                    </TextInput>
                                                    <TextInput
                                                        keyboardType="numeric"
                                                        maxLength={1}
                                                        style={styles.OTP}
                                                        ref={this.c}
                                                        onKeyPress={e => this.focusPrevious(e.nativeEvent.key, this.b)}
                                                        onChangeText={v => this.focusNext(this.c, this.d, v)}>
                                                    </TextInput>
                                                    <TextInput
                                                        keyboardType="numeric"
                                                        maxLength={1}
                                                        style={styles.OTP}
                                                        ref={this.d}
                                                        onKeyPress={e => this.focusPrevious(e.nativeEvent.key, this.c)}
                                                        onChangeText={v => this.focusNext(this.d, this.e, v)}>
                                                    </TextInput>
                                                    <TextInput
                                                        keyboardType="numeric"
                                                        maxLength={1}
                                                        style={styles.OTP}
                                                        ref={this.e}
                                                        onKeyPress={e => this.focusPrevious(e.nativeEvent.key, this.d)}
                                                        onChangeText={v => this.focusNext(this.e, this.f, v)}>
                                                    </TextInput>
                                                    <TextInput
                                                        keyboardType="numeric"
                                                        maxLength={1}
                                                        style={styles.OTP}
                                                        ref={this.f}
                                                        onKeyPress={e => this.focusPrevious(e.nativeEvent.key, this.e)}
                                                        onChangeText={v => this.focusNext(this.f, this.g, v)}>
                                                    </TextInput>
                                                    <TextInput
                                                        keyboardType="numeric"
                                                        maxLength={1}
                                                        style={styles.OTP}
                                                        ref={this.g}
                                                        onKeyPress={e => this.focusPrevious(e.nativeEvent.key, this.f)}
                                                        onChangeText={v => this.focusNext(this.g, this.h, v)}>
                                                    </TextInput>
                                                    <TextInput
                                                        keyboardType="numeric"
                                                        maxLength={1}
                                                        style={styles.OTP}
                                                        ref={this.h}
                                                        onKeyPress={e => this.focusPrevious(e.nativeEvent.key, this.g)}
                                                        onChangeText={v => this.focusNext(this.h, this.i, v)}>
                                                    </TextInput>
                                                    <TextInput
                                                        keyboardType="numeric"
                                                        maxLength={1}
                                                        style={styles.OTP}
                                                        ref={this.i}
                                                        onKeyPress={e => this.focusPrevious(e.nativeEvent.key, this.h)}
                                                        onChangeText={v => this.focusNext(this.i, this.j, v)}>
                                                    </TextInput>
                                                    <TextInput
                                                        keyboardType="numeric"
                                                        maxLength={1}
                                                        style={styles.OTP}
                                                        ref={this.j}
                                                        onKeyPress={e => this.focusPrevious(e.nativeEvent.key, this.i)}
                                                        onChangeText={v => this.focusNext(this.j, this.j, v)}>
                                                    </TextInput>
                                                </Row>
                                            </View>
                                        )} */}

                                {/* ><Text></Text></TextInput> */}
                            </Row>

                            <Row style={{ justifyContent: 'center', width: "100%" }}>
                                <TouchableOpacity style={styles.Login} onPress={this.submit.bind(this)}>
                                    <Text style={{ fontFamily: "Inter-Black", color: '#fff', fontSize: 20 }}>{t('Confirm')}</Text>
                                </TouchableOpacity>
                            </Row>
                            <Row style={styles.Row}>
                                <TouchableOpacity>
                                    <Demo1 />
                                </TouchableOpacity>
                                <TouchableOpacity onPress={this._twoOptionAlertHandler}>
                                    <Text style={styles.Text}>
                                        {t('I agree and accept the')} <Text style={{ color: '#0494cf', fontFamily: "Inter-Black" }}>{t('Terms and Conditions')}</Text> {t('for the use of the app,')}
                                    </Text>
                                </TouchableOpacity>

                            </Row>
                            {/* <Row style={{marginTop:10, justifyContent:'center'}}>
                    <TouchableOpacity onPress ={this.resendOTP.bind(this)}> 
                        <Text style={{color: '#000', fontSize:15}}>{t('Resend OTP ?')}</Text>
                    </TouchableOpacity>
                </Row> */}

                            {/* <CustomToast ref="defaultToastBottomWithDifferentColor" backgroundColor='#000' position="top" /> */}
                        </KeyboardAvoidingView>

                    </ScrollView>
                    <DropdownAlert ref={ref => this.dropdown = ref} />

                </View>



            )
        } else {
            return <ActivityIndicator style={styles.loading} size='large' color='#781f19' />
        }

    }
}
// export default class App extends Component {
//     render() {
//         return (
//             <AppStackNavigator />
//         );
//     }
// }
// const AppStackNavigator = createStackNavigator ({
//     Cellular : CellularScreen,
//     Payment : PaymentScreen,
// });
const styles = StyleSheet.create({
    container: {
        flex: 1,
        // alignItems: 'center',
        // justifyContent: 'center',
        backgroundColor: '#fff',

    },
    logocontainer: {

        alignItems: 'center',
        justifyContent: 'center',
    },

    BackArrow: {
        width: 25,
        height: 25,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 10,
        marginTop: 10,
    },
    Cellphone: {
        width: 25,
        height: 34,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 10,
        // marginTop: 10,
    },

    Menu: {
        width: 25,
        height: 25,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
        marginTop: 10,
    },
    logo: {
        width: 250,
        height: 200,
        justifyContent: 'center',
        alignItems: 'center',


    },
    Center: {
        justifyContent: 'center',
        alignItems: 'center',
        // marginBottom: 20,
        // marginTop:0

    },
    input: {
        alignItems: 'center',
        justifyContent: 'center',
        // margin: 15,
        marginTop: 10,
        width: "80%",
        marginLeft: "10%",
        // marginRight:"10%",
        height: 60,
        borderRadius: 40,
        paddingLeft: 5,
        paddingRight: 20,
        // borderColor: '#7a42f4',
        borderWidth: 1,
        borderStyle: 'dashed',
        borderColor: '#E2E0DA',
        backgroundColor: '#F0EDEB',

    },

    Login: {
        marginTop: 15,
        alignItems: 'center',
        justifyContent: 'center',
        width: "60%",
        height: 40,
        borderRadius: 40,
        backgroundColor: '#1988B9',
        color: '#fff',

    },
    TextInput: {

        ...Platform.select({
            ios: {
                borderBottomWidth: 2,
                paddingLeft: 10,
                // marginLeft: ,
                width: 30,
            },
            android: {
                // paddingLeft: 10,
                borderBottomWidth: 2,
                borderColor: '#c4c3c1',
                textAlign: 'center',
                width: 15,
                // marginLeft: 20
            }
        })
    },
    OTP: {

        borderBottomWidth: 2,
        color: '#7f7f7f',
        fontSize: 20,
        // paddingLeft: 10,
        marginLeft: 5,
        width: 15,
        borderColor: '#B3B3B3',
        textAlign: 'center',
        fontFamily: "Inter-Black"
    },
    loader: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#fff"
    },

    loading: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'center'
    },
    Row: {
        ...Platform.select({
            ios: {
                // flex:1,
                marginTop: '30%',
                // bottom: 5,
                justifyContent: 'center',
                marginRight: "20%",
                marginLeft: "20%",
            },
            android: {
                // flex:1,
                marginTop: '50%',
                // bottom: 5,
                justifyContent: 'center',
                marginRight: "20%",
                marginLeft: "20%",
            }
        })


    },

    Text: {
        marginTop: 10,
        marginLeft: 10,
        width: 276,
        alignItems: 'center',
        fontFamily: "Inter-Black"
        // fontFamily: 'roboto-regular',

    },

});