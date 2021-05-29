import React, { Component } from 'react';
import { ActivityIndicator, StyleSheet, Text, View, Image, Button, TextInput, TouchableOpacity, StatusBar,ScrollView, Keyboard } from 'react-native';
import PinInput from "react-pin-input";
import CustomToast from './Toast.js';
import { verifyOTPAction, loginAction } from '../Util/Action';
import { LOGIN } from '../Util/API.js';
import * as Facebook from 'expo-facebook';
import * as Google from 'expo-google-app-auth';
import { Notifications } from 'expo';
// import PushNotification from 'react-native-push-notification'
import * as Permissions from 'expo-permissions';
import { storage } from '../Util/storage.js';
import { t } from '../../../locals';
import { resendOTPAction, customersociallogin } from '../Util/Action.js';
import validate from 'validate.js';




// import { createStackNavigator } from 'react-navigation';
// import Payment from '../Apps/PaymentScreen.js';
import { Col, Row, Grid } from "react-native-easy-grid";
// import logo from '../../images/Logo.png';
// import BackArrow from '../../images/Back-Arrow.png';
// import Menu from '../../images/Menu.png';

// function CellularScreen({ navigation }) {
   
    
    
// }

export default class VerifyOTP extends Component {
    static navigationOptions = ({navigation}) => {
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
        this.state = {
            aValue: '',
            bValue: '',
            cValue: '',
            dValue: '',
            loader: false
        };
    }

     /* This function will run first before rest code */
    componentDidMount() {

        const { navigation } = this.props;
		this.registerForPushNotifications();
        // /* Get mobile no to display on which sent OTP */
        // const data = navigation.getParam('data')
        // const concatNo = data.mobile;

        // this.setState({ mobileNo: concatNo })
        // /* Get mobile no to display on which sent OTP */

        /* Set focus on first OTP input when page load */
        this.a.current.focus();
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
        if (currentRef !== this.d && value) {
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
    }

    focusPrevious(key, previousRef) {
        if (key === 'Backspace') {
            previousRef.current.focus();
        }
    }

    onFocus(ref){
        console.log(ref == this.b)
        if(ref == this.b) {
            if(this.state.aValue == ''){
                
                this.a.current.focus();
            }
        }
        if(ref == this.c) {
            if(this.state.bValue == ''){
                
                this.b.current.focus();
            }
        }
        if(ref == this.d) {
            if(this.state.cValue == ''){
                
                this.c.current.focus();
            }
        }
        
    }
// Google login start.
    googleSignIn = async () => {
	  
        this.setState({ loader: true });
        const { navigate } = this.props.navigation;
        try {
          
          const result = await Google.logInAsync({
            androidClientId:
            //   "863143925364-phk92bgsan70m0rtm0tqmptboq6f3rin.apps.googleusercontent.com",
                "351662705090-p4ac4p3i3acnv9j79ojantklfa7kk88k.apps.googleusercontent.com",
            iosClientId: 
            //   "863143925364-ps5qfmo5q65ap8qjh5j1jl7fno3k0t9m.apps.googleusercontent.com" ,
                "351662705090-tq8t4trb76ch2uopa585rpvgvh0o99gd.apps.googleusercontent.com" ,
			androidStandaloneAppClientId: "351662705090-p4ac4p3i3acnv9j79ojantklfa7kk88k.apps.googleusercontent.com",
			iosStandaloneAppClientId: "351662705090-tq8t4trb76ch2uopa585rpvgvh0o99gd.apps.googleusercontent.com",
            scopes: ["profile", "email"]
          });
          
          if (result.type === "success") {
            console.log(result.user);
            var data = {
              login_type: 'google',
              login_credential: result.user.id,
              email: result.user.email,
              name: result.user.name,
              mobile: this.state.mobile,
              device_token: this.state.token,     
            }
            var response = customersociallogin(data).then(function (responseJson) {
             console.log(responseJson);
                if (responseJson.isError === false) {
                    // save user data and passport token in async storage for future use in application and redirect to app and user login
                    storage.storeUserDetail(responseJson.result).then((data) => {
                    this.setState({ loader: false });	
                    // navigate((responseJson.result.is_payment_method_save == 0 ) ? 'App' : 'App');
                    navigate('App');
                    })
                    .catch((err) => {
                      console.log(err)
                    });
                } else {
                    // alert("failed");
                    console.log(responseJson.message);
                    // this.setState({ loader: false });
                }
          }.bind(this));
    
          } else {
            console.log("cancelled")
            navigate('Login')
          }
        } catch (e) {
          console.log("error", e)
        }
    }
//Google login end.
// Facebook  login start.
    facebookLogin = async () => {
        const { navigate } = this.props.navigation;
          try {
            await Facebook.initializeAsync('688051215392905', 'Mas Rapido');
            const {
              type,
              token,
              expires,
              permissions,
              declinedPermissions,
            } = await Facebook.logInWithReadPermissionsAsync({
              permissions: ['public_profile', 'email'],
              // behaviors: 'webs'
            });
        
            if (type === 'success') {
              
              fetch(`https://graph.facebook.com/me?access_token=${token}&fields=id,name,email,picture.height(500)`)
                .then(response => response.json())
                .then(data => {
					
                  console.log(data);
                  // setLoggedinStatus(true);
                  // setUserData(data);
                var FacebookData = {
                  login_type: 'facebook',
                  login_credential: data.id,
                  email: data.email,
                  name: data.name,
                  mobile: this.state.mobile,
                  device_token: this.state.token,     
                }
                var response = customersociallogin(FacebookData).then(function (responseJson) {
                  if (responseJson.isError == false) {
						storage.storeUserDetail(responseJson.result).then((data) => {
						this.setState({ loader: false });
						navigate((responseJson.result.is_payment_method_save == 0 ) ? 'App' : 'App');
                    })
                    .catch((err) => {
                      console.log(err)
                    });
                  } else {
                    navigate('Login')
                  }
                }.bind(this));
                })
                .catch(e => console.log(e))
      
            } else {
              console.log('Cancelled by user');
            }
          } catch ({ message }) {
            console.log(`Facebook Login Error: ${message}`);
            alert(`Facebook Login Error: ${message}`);
          }
        }
// Facebook login end.
    submit() {
        
        const { mobile } = this.state;
        const { navigate } = this.props.navigation;
        const { aValue, bValue, cValue, dValue } = this.state;
        
        if (aValue == '') {
            this.refs.defaultToastBottomWithDifferentColor.ShowToastFunction('4 digit required.');
        }

        if (bValue == '') {
            this.refs.defaultToastBottomWithDifferentColor.ShowToastFunction('4 digit required.');
        }

        if (cValue == '') {
            this.refs.defaultToastBottomWithDifferentColor.ShowToastFunction('4 digit required.');
        }

        if (dValue == '') {
            this.refs.defaultToastBottomWithDifferentColor.ShowToastFunction('4 digit required.');
        }

        Keyboard.dismiss();


        if (aValue != '' && bValue != '' && cValue != '' && dValue != '') {
            const mobile = this.props.navigation.getParam('mobile');
            const country = this.props.navigation.getParam("country");
            const login_type = this.props.navigation.getParam('login_type');
			this.setState({ mobile: mobile });
			
            var enteredOTP = aValue + bValue + cValue + dValue;
            var otp = enteredOTP;
            
            this.setState({ loader: true });
            // var response = verifyOTPAction(mobile, otp, country).then(function (responseJson) {
                if(otp === "1234"){
                    // if (responseJson.type == "success") {
                        if(login_type == "facebook")
                        {
                            this.facebookLogin();
                        }else if(login_type == "google"){
                            this.googleSignIn();
                        }else{
                            this.refs.defaultToastBottomWithDifferentColor.ShowToastFunction("Something went wrong...");
                        }
                
                    // } else {
                    //     this.setState({ loader: false });
                    //     this.refs.defaultToastBottomWithDifferentColor.ShowToastFunction(responseJson.message);
                        
                    // }
                }else{
                    this.setState({ loader: false });
                    this.refs.defaultToastBottomWithDifferentColor.ShowToastFunction("OTP not match");
                }
            // }.bind(this));
        }
    };
    resendOTP = async () =>  {
        const mobile = this.props.navigation.getParam('mobile');
        const country = this.props.navigation.getParam("country");
        // const result = validate({mobile:this.state.mobile}, constraints);
        var response = resendOTPAction(mobile, country).then(function (responseJson) {
            console.log(responseJson)
            if (responseJson.type == "success") {
                this.setState({ loader: false });
                // navigate('App');
            } else {
                alert(responseJson.message);
                this.setState({ loader: false });
            }
        }.bind(this));
    }

    render () {
        const {navigate} = this.props.navigation;
        const { loader } = this.state;

        if (!loader) {
        return ( 
            
            <View  style={styles.container}>
                <StatusBar />

                <Row style={{height:50, marginTop: 20}}>
                    <Col>
                        <TouchableOpacity onPress ={() => navigate('Login')} > 
                            <Image source={require('../../images/Back-Arrow.png')} style={styles.BackArrow}/>
                        </TouchableOpacity>
                    </Col>
                    {/* <Col>
                        <TouchableOpacity style={{alignItems: 'flex-end'}}> 
                            <Image source={require('../../images/Menu.png')} style={styles.Menu}/>
                        </TouchableOpacity> 
                    </Col> */}
                
                </Row>
                <ScrollView showsVerticalScrollIndicator={false}>

                <View style={styles.container}>
                    <Row>
                        <Col  style={styles.Center} >
                            {/* <Backscreen /> */}
                                <Image source={require('../../images/Logo.png')} style={styles.logo} />
                                <Text style={{fontWeight: "bold" }}>
                                    {t('Check your Phone')}
                                </Text>

                                <Text >
                                    {t('Copy your SMS code here')}
                                </Text>
                        </Col>
                    </Row>
                </View>
                <Row style={styles.input}>
                        <TextInput 
                            keyboardType="numeric"
                            selectTextOnFocus
                            maxLength={1}
                            style = {styles.TextInput}
                            ref={this.a}
                            onFocus={ref => this.onFocus(ref)}
                            onChangeText={v => this.focusNext(this.a, this.b, v)}>
                        </TextInput>
                        <TextInput
                            keyboardType="numeric"
                            selectTextOnFocus
                            maxLength={1}
                            style={styles.OTP}
                            ref={this.b}
                            onFocus={ref => this.onFocus(this.b)}
                            onKeyPress={e => this.focusPrevious(e.nativeEvent.key, this.a)}
                            onChangeText={v => this.focusNext(this.b, this.c, v)}>
                        </TextInput>
                        <TextInput
                            keyboardType="numeric"
                            selectTextOnFocus
                            maxLength={1}
                            style={styles.OTP}
                            ref={this.c}
                            onFocus={ref => this.onFocus(this.c)}
                            onKeyPress={e => this.focusPrevious(e.nativeEvent.key, this.b)}
                            onChangeText={v => this.focusNext(this.c, this.d, v)}>
                        </TextInput>    
                        <TextInput
                            keyboardType="numeric"
                            selectTextOnFocus
                            maxLength={1}
                            style={styles.OTP}
                            ref={this.d}
                            onFocus={ref => this.onFocus(this.d)}
                            onKeyPress={e => this.focusPrevious(e.nativeEvent.key, this.c)}
                            onChangeText={v => this.focusNext(this.d, this.d, v)}>
                        </TextInput>        

                            
                        {/* ><Text></Text></TextInput> */}
                </Row>
                
                <Row>
                    <TouchableOpacity style={styles.Login} onPress ={this.submit.bind(this)}> 
                        <Text style={{color: '#fff', fontSize:20}}>{t('LOGIN')}</Text>
                    </TouchableOpacity>
                </Row>
                <Row style={{marginTop:10, justifyContent:'center'}}>
                    <TouchableOpacity onPress ={this.resendOTP.bind(this)}> 
                        <Text style={{color: '#000', fontSize:15}}>{t('Resend OTP ?')}</Text>
                    </TouchableOpacity>
                </Row>
                
                <CustomToast ref = "defaultToastBottomWithDifferentColor" backgroundColor='#000' position = "top"/>
            </ScrollView>
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
        alignItems: 'center',
        justifyContent: 'center',
        
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

    Menu: {
        width: 25,
        height: 25,
        justifyContent: 'center', 
        alignItems: 'center',
        marginRight: 10,
        marginTop: 10,
    },
    logo: {
        width: 300,
        height: 250,
        justifyContent: 'center',
        alignItems: 'center',
        
        
    },
    Center: {
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
        
    },
    input: {
        alignItems: 'center',
        justifyContent: 'center',
        // margin: 15,
        width: 300,
        height: 60 ,
        borderRadius: 40,
        // borderColor: '#7a42f4',
        borderWidth: 1,
        borderStyle:  'dashed',
        borderColor: 'grey',
        backgroundColor: '#eae8e8',

    },

    Login: {
       marginTop: 15,
       alignItems: 'center',
       justifyContent: 'center',
       width: 300,
       height: 60 ,
       borderRadius: 40,
       backgroundColor: '#e02127',
       color: '#fff',

    },
    TextInput:{
       
        ...Platform.select({ 
        ios: {
                borderBottomWidth: 2,
                paddingLeft: 10,
                // marginLeft: ,
                width: 30,},
        android: { 
                paddingLeft: 10,
                borderBottomWidth: 2,} })
    },
    OTP: {
        borderBottomWidth: 2,
        paddingLeft: 10,
        marginLeft: 10,
        width: 30,

    },
    loader:{
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

});