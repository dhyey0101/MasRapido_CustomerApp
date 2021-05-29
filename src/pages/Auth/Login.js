import React, { Component, useState } from 'react';
import { BackHandler, AsyncStorage, Alert, StyleSheet, Text, View, Image, Button, TextInput, KeyboardAvoidingView, TouchableOpacity, StatusBar, ScrollView, Keyboard, Animated, Modal, Platform, ActivityIndicator, } from 'react-native';
import { Col, Row, Grid } from "react-native-easy-grid";
import validate, { result } from 'validate.js';
import PropTypes from 'prop-types';
import CustomToast from './Toast.js';
import { sendOTPAction } from '../Util/Action.js';
import { t } from '../../../locals';
import * as Facebook from 'expo-facebook';
import * as Google from 'expo-google-app-auth';
import { customersociallogin } from '../Util/Action.js';
import { storage } from '../Util/storage.js';
import { Notifications } from 'expo';
import * as Location from 'expo-location';
// import PushNotification from 'react-native-push-notification'
import * as Permissions from 'expo-permissions';
import Demo1 from '../Apps/radio.js';
import { NavigationEvents } from 'react-navigation';



// const fetchFonts = () => {
// return Font.loadAsync({
// 'roboto-regular': require('../../../assets/fonts/Roboto-Regular.ttf')
// });
// };

export default class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mobile: '',
      mobileError: '',
      aValue: '',
      aBorderColor: 'red',
      aBorder: 0,
      country: '',
      permissionStatus: '',

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
  static navigationOptions = ({ navigation }) => {
    return {
      headerShown: false
    };
  };
  // /* This function will run first before rest code */
  async componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);


    const mobile = await AsyncStorage.getItem("mobile");

    if (mobile && Platform.OS == 'ios') {
      this.setState({
        mobile: mobile.replace(/['"]+/g, '')
      });
    } else {
      this.setState({
        mobile: mobile
      });
    }

    Location.requestPermissionsAsync().then((permission) => {
      let status = permission.status;
      this.setState({
        permissionStatus: status
      })
      if (permission.status !== 'granted') {
        alert(t('Please give location permission for OTP send process otherwise you will not get OTP for login'));
      } else {
        Location.getCurrentPositionAsync().then((pos) => {
          Location.reverseGeocodeAsync({
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
          }).then((res) => {
            // console.log(`Country => ${res[0].isoCountryCode}`);
            // e.g. IN, US
            this.setState({
              country: res[0].isoCountryCode
            })
          });
        });
      }
    });
    const { navigation } = this.props;

    this.focusListener = navigation.addListener("didFocus", () => {
      this.getPermissionForTakeCountryCode();
    });
  }

  componentWillMount() {
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);

  }

  getPermissionForTakeCountryCode() {
    Location.requestPermissionsAsync().then((permission) => {
      let status = permission.status;
      this.setState({
        permissionStatus: status
      })
      // alert(this.state.permissionStatus)
      if (permission.status !== 'granted') {
        alert(t('Please give location permission for OTP send process otherwise you will not get OTP for login'));
      } else {
        Location.getCurrentPositionAsync().then((pos) => {
          Location.reverseGeocodeAsync({
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
          }).then((res) => {
            // console.log(`Country => ${res[0].country}`);
            // console.log(JSON.stringify(res[0]));
            // e.g. Canada, United States
            this.setState({
              // country : res[0].country
              country: res[0].isoCountryCode
            })
            // alert(res[0].isoCountryCode)
          });
        });
      }
    });
  }
  // google signin process
  googleSignIn = async () => {

    // this.setState({ loader: true });
    // const [dataLoaded, setDataLoaded] = useState(false);
    const { navigate } = this.props.navigation;


    // get permission for location
    if (this.state.permissionStatus !== 'granted') {
      Location.requestPermissionsAsync().then((permission) => {
        let status = permission.status;
        this.setState({
          permissionStatus: status
        })
        // alert(this.state.permissionStatus)
        if (permission.status !== 'granted') {
          alert(t('Please give location permission for OTP send process otherwise you will not get OTP for login'));
        } else {
          Location.getCurrentPositionAsync().then((pos) => {
            Location.reverseGeocodeAsync({
              latitude: pos.coords.latitude,
              longitude: pos.coords.longitude,
            }).then((res) => {
              // console.log(`Country => ${res[0].country}`);
              // console.log(JSON.stringify(res[0]));
              // e.g. Canada, United States
              this.setState({
                // country : res[0].country
                country: res[0].isoCountryCode
              })
            });
          });
        }
      });
    }

    const { country } = this.state;


    // var response = sendOTPAction(country).then(function (responseJson) {
    // if (responseJson.type == "success") {
    if (this.state.permissionStatus === 'granted') {
      navigate('MobileNumber', { 'login_type': 'google', 'country': country });
      // navigate('VerifyOTP', { 'mobile': mobile, 'login_type': 'google', country: country });
      this.setState({ loader: false });
    }
    else {
      alert(t('Please give location permission for OTP send process otherwise you will not get OTP for login'));
      this.setState({ loader: false });
    }

    // } else {
    //   this.refs.defaultToastBottomWithDifferentColor.ShowToastFunction(responseJson.message);
    //   this.setState({ loader: false });
    // }
    // }.bind(this));
    // }
  }
  // Google login end


  // Facebook login
  facebookLogin = async () => {
    const { country } = this.state;

    // const [dataLoaded, setDataLoaded] = useState(false);
    const { navigate } = this.props.navigation;
    // get permission for location
    if (this.state.permissionStatus !== 'granted') {
      Location.requestPermissionsAsync().then((permission) => {
        let status = permission.status;
        this.setState({
          permissionStatus: status
        })
        // alert(this.state.permissionStatus)
        if (permission.status !== 'granted') {
          alert(t('Please give location permission for OTP send process otherwise you will not get OTP for login'));
        } else {
          Location.getCurrentPositionAsync().then((pos) => {
            Location.reverseGeocodeAsync({
              latitude: pos.coords.latitude,
              longitude: pos.coords.longitude,
            }).then((res) => {
              // console.log(`Country => ${res[0].country}`);
              // console.log(JSON.stringify(res[0]));
              // e.g. Canada, United States
              this.setState({
                // country : res[0].country
                country: res[0].isoCountryCode
              })
            });
          });
        }
      });
    }


    // var response = sendOTPAction(country).then(function (responseJson) {
    // if (responseJson.type == "success") {
    if (this.state.permissionStatus === 'granted') {
      navigate('MobileNumber', { 'login_type': 'facebook', country: country });
      // navigate('VerifyOTP', { 'mobile': mobile, 'login_type': 'facebook', country: country });
      this.setState({ loader: false });
    }
    else {
      alert(t('Please give location permission for OTP send process otherwise you will not get OTP for login'));
      this.setState({ loader: false });
    }
    // } else {
    //   this.refs.defaultToastBottomWithDifferentColor.ShowToastFunction(responseJson.message);
    //   this.setState({ loader: false });
    // }
    // }.bind(this));
    // }
  }
  // Facebook login end



  _onBlurr = () => {
    BackHandler.removeEventListener('hardwareBackPress',
      this._handleBackButtonClick);
  }

  _onFocus = () => {
    BackHandler.addEventListener('hardwareBackPress',
      this._handleBackButtonClick);
  }

  // _handleBackButtonClick = () => BackHandler.exitApp();

  _handleBackButtonClick = () => {
    {
      Alert.alert(
        t('Exit App'),
        t('Exiting the application'), [{
          text: t('Cancel'),
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel'
        }, {
          text: t('Ok'),
          onPress: () => BackHandler.exitApp()
        },], {
        cancelable: false
      }
      )
      return true;
    }
  }
  handleBackButton = () => {
    Alert.alert(
      t('Exit App'),
      t('Exiting the application'), [{
        text: t('Cancel'),
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel'
      }, {
        text: t('Ok'),
        onPress: () => BackHandler.exitApp()
      },], {
      cancelable: false
    }
    )
    return true;
  }

  render() {
    const { loader, mobile } = this.state;
    const { navigate } = this.props.navigation;
    const keyboardVerticalOffset = Platform.OS === 'ios' ? 50 : 0

    // const [dataLoaded, setDataLoaded] = useState(false);
    // const KeyboardAvoidingComponent = () => {
    if (!loader) {

      return (
        <View style={styles.container} >
          <StatusBar />
          <NavigationEvents
            onWillFocus={this._onFocus}
            onWillBlur={this._onBlurr}
          />
          <ScrollView showsVerticalScrollIndicator={false}>
            {/* <KeyboardAvoidingView behavior='position' keyboardVerticalOffset={keyboardVerticalOffset}> */}
            <Row style={styles.Navebar}>
            {Platform.OS == 'ios' ? (
                  <View></View>
                ) : (
              <Col style={styles.NavCol}>
                
                    <TouchableOpacity onPress={this.handleBackButton}>
                      <Image
                        source={require("../../images/Back-Arrow.png")}
                        style={styles.BackArrow}
                      />
                    </TouchableOpacity>
                    </Col>
                  )}

              

            </Row>
            <Row style={{ marginLeft: '15%' }}>
              <Text style={styles.headerText}>{t('Welcome!')}</Text>
            </Row>
            <Row style={styles.Center} >

              {/* <Backscreen /> */}
              <Image source={require('../../images/Logo.png')} style={styles.logo} />

            </Row>

            <Col  >
              {/* <Social /> */}


              <Row style={styles.Center}>
                <TouchableOpacity style={styles.Facebook} onPress={() => this.facebookLogin()}>
                  <Text style={{ color: '#fff', fontSize: 15, fontFamily: "Inter-Black", }}>{t('CONTINUE WITH FACEBOOK')}</Text>
                </TouchableOpacity>

              </Row>
              <Row style={styles.Center}>
                <TouchableOpacity style={styles.Google} onPress={() => this.googleSignIn()}>
                  <Text style={{ color: '#fff', fontSize: 15, fontFamily: "Inter-Black", }}>{t('CONTINUE WITH GMAIL')}</Text>
                </TouchableOpacity>

              </Row>
            </Col>
            <Row style={styles.Row}>
              <TouchableOpacity>
                <Demo1 />
              </TouchableOpacity>
              <TouchableOpacity onPress={this._twoOptionAlertHandler}>
                <Text style={styles.Text}>
                  {t('I agree and accept the')} <Text style={{ color: '#0494cf', fontFamily: "Inter-Black", }}>{t('Terms and Conditions')}</Text> {t('for the use of the app,')}
                </Text>
              </TouchableOpacity>

            </Row>

            <CustomToast ref="defaultToastBottomWithDifferentColor" backgroundColor='#000' position="top" />
            {/* </KeyboardAvoidingView> */}
          </ScrollView>

        </View>
      )
    } else {
      return <ActivityIndicator style={styles.loading} size='large' color='#781f19' />
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#fff',

  },

  Navebar: {
    ...Platform.select({
      ios: {
        height: 45,
        marginTop: "10%",
      },

    }),
  },
  NavCol: {
    width: "10%"
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
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 10,
        marginTop: 10,
      }
    })
  },
  headerText: {
    color: '#C1272D',
    fontSize: 25,
    fontFamily: "Inter-Black",
  },
  logocontainer: {

    alignItems: 'center',
    justifyContent: 'center',
  },

  logo: {
    // marginTop:20,
    width: 300,
    height: 250,
    // justifyContent: 'center',
    // alignItems: 'center',

  },
  text: {
    // marginTop: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,

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

  Center: {
    justifyContent: 'center',
    // alignItems: 'center',

  },

  Text: {
    marginTop: 10,
    marginLeft: 10,
    width: 276,
    alignItems: 'center',
    fontFamily: "Inter-Black",

    // fontFamily: 'roboto-regular',

  },


  Google: {
    marginTop: 10,
    alignItems: 'center',
    justifyContent: 'center',
    width: 300,
    height: 60,
    borderRadius: 40,
    backgroundColor: '#F70706',

  },
  Facebook: {

    // marginTop: 10,
    alignItems: 'center',
    justifyContent: 'center',
    width: 300,
    height: 60,
    borderRadius: 40,
    backgroundColor: '#39438F',

  },
  Celluler: {
    marginTop: 10,
    alignItems: 'center',
    justifyContent: 'center',
    width: 300,
    height: 60,
    borderWidth: 2,
    borderRadius: 40,
    backgroundColor: '#eae8e8',
    textAlign: 'center',
    color: '#000',
    // backgroundColor: Platform.OS === 'ios' ? 'red' : 'lightgrey',
    // borderStyle:  'dashed',
    // borderColor: 'lightgrey',
    ...Platform.select({ ios: { borderStyle: 'dashed', borderColor: 'grey' }, android: { borderStyle: 'dashed', borderColor: 'grey' } })

  },
  error: {
    ...Platform.select({
      ios: {
        left: 40,
        color: 'red',
        fontSize: 13,
        paddingTop: 10,
      },

      android: {
        left: 30,
        color: 'red',
        fontSize: 13,
      }
    })

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

