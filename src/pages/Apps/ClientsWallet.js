import React, { Component, useState, useEffect } from 'react';
import { Alert, Platform, Modal, ImageButton, Text, View, StyleSheet, Image, TouchableOpacity, BackHandler, AsyncStorage, TextInput, ScrollView, Linking, StatusBar, FlatList, Dimensions, RefreshControl, ActivityIndicator } from 'react-native';
import { Row, Col } from 'react-native-easy-grid';
import { Dropdown } from 'react-native-material-dropdown-v2';
import { Collapse, CollapseHeader, CollapseBody } from "accordion-collapse-react-native";
import { Thumbnail, List, ListItem, Separator } from 'native-base';
//import Modal from 'react-native-modal';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from "expo-document-picker";
import { RadioButton } from 'react-native-paper';
import { getUserWalletRechargeApprovePendingAction, getUserWalletBalanceAction, getCustomerFavoriteAddressListAction, getUserDetailAction, RechargeWalletAction, getWalletHistoryAction, getOrderDetailsAction } from '../Util/Action.js';
import normalize from 'react-native-normalize';
import { t } from '../../../locals';
import { NavigationEvents } from 'react-navigation';
import StickyHeaderFooterScrollView from 'react-native-sticky-header-footer-scroll-view';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
// import CustomToast from './Toast.js';
import validate from 'validate.js';
import * as Location from "expo-location";
import * as Permissions from "expo-permissions";
import { Camera } from 'expo-camera';
import Geocoder from 'react-native-geocoding';
import { initializeAsync } from 'expo-facebook';
import moment from 'moment';
import DropdownAlert from 'react-native-dropdownalert';
import Pusher from "pusher-js/react-native";


//import AwesomeAlert from 'react-native-awesome-alerts';

const GOOGLE_MAPS_APIKEY = (Platform.OS === 'ios') ? "AIzaSyDA8VzkYgIznevJNoGFt_HLxgM2cBRgQd8" : "AIzaSyD6VKrDOOeJgMKKwKpiYFhIA8Udd-7mdlU";
const { width, height } = Dimensions.get("screen");
const LATITUDE_DELTA = 0.0;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
const ASPECT_RATIO = width / height;

export default class ClienWallet extends Component {

  static navigationOptions = ({ navigation }) => {
    return {
      headerShown: false
    };
  };

  constructor(props) {
    super(props);
    this.state = {
      hasCameraPermission: null,
      collapsed: false,
      second_collapsed: false,
      //isModalVisible: false,
      userid: '',
      modalmessage: false,
      modalVisible: false,
      showAlert: false,
      favoriteAddressList: '',
      WalletData: [],
      WalletStatusData: [],
      dataSource: [],
      userData: [],
      orderData: [],
      loader: false,
      Payment: '',
      Amount: '',
      attachphoto: '',
      attachphotoStatus: '0',
      photosType: 'image',
      photosName: '',
      toLocationText: '',
      CurrentLocation: '',
      myCurrentAddressText: '',
      initialPosition: {
        latitude: 0,
        longitude: 0,
        latitudeDelta: 0.0,
        longitudeDelta: 0.0,
      },
      initialPositiontext: '',
      from_location_address: '',
      userToken:'',
      triggerChannelState: 0,
    }
  }


  messageType(modalmessage) {
    this.setModalmessageType(!modalmessage);
  }

  setModalmessageType = (visible) => {

    this.setState({ modalmessage: visible });
  }

  async WalletRechargeData() {

    const { Payment, Amount, attachphoto } = this.state;
    var constraints = {
      Payment: {
        presence: {
          allowEmpty: false,
          message: "^ " + t("Select the account used"),
        },
      },
      Amount: {
        presence: {
          allowEmpty: false,
          message: "^ " + t("Enter the amount"),
        },

      },
      attachphoto: {
        presence: {
          allowEmpty: false,
          message: "^ " + t("Attach your proof"),
        },
      },
    };

    const result = validate({
      Payment: this.state.Payment,
      Amount: this.state.Amount,
      attachphoto: this.state.attachphoto,
    }, constraints);


    if (result) {
      if (result.Payment) {
        this.dropdown.alertWithType('error', 'Error', result.Payment);
        // this.refs.defaultToastBottomWithDifferentColor.ShowToastFunction(result.Payment);
        return false;
      }
      if (result.Amount) {
        this.dropdown.alertWithType('error', 'Error', result.Amount);
        // this.refs.defaultToastBottomWithDifferentColor.ShowToastFunction(result.Amount);
        return false;
      }
      if (result.attachphoto) {
        this.dropdown.alertWithType('error', 'Error', result.attachphoto);
        // this.refs.defaultToastBottomWithDifferentColor.ShowToastFunction(result.attachphoto);
        return false;
      }
    }

    this.setState({ loader: true });
    /*from Data*/
    const userID = await AsyncStorage.getItem("userid");
    let Token = await AsyncStorage.getItem("token");
    Token = "Bearer " + Token;

    const formData = new FormData();
    formData.append('user_id', userID);
    formData.append('photos_name', this.state.photosName);
    formData.append('photos_type', this.state.photosType);
    formData.append('bank_name', this.state.Payment);
    formData.append('amount', this.state.Amount);
    // formData.append('voucher', this.state.attachphoto);
    formData.append("voucher", {
      uri: this.state.attachphoto,
      name: "image.jpg",
      type: "image/jpg",
    });
    console.log(formData);
    const responseJson = await RechargeWalletAction(formData, Token);

    if (responseJson.isError == false) {
      // this.setState({ loader: false });
      this.getUserWalletRechargeApprovePending();
      this.dropdown.alertWithType('success', 'Success', responseJson.message);
    } else {
      this.setState({ loader: false });
    }
    this.clearText()
  }

  async clearText() {
    this.setState({
      photosName: '',
      photosType: '',
      attachphoto: '',
      Payment: '',
      Amount: '',
    })

  }

  // onRefresh() {
  //   alert('hello');
  //   this.clearText();
  // }

  async componentDidMount() {
    let userToken = await AsyncStorage.getItem("token");
    this.setState({
      userToken: userToken,
    });

    // const { navigate } = this.props.navigation;
    this._pusherSubscription();
    // BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
    const { currentLocation } = this.state;
    var from_location_address = this.state.fromLocationText;
    this.getPermissionAsync();

    this.getUserWalletBalance();
    this.getWalletHistory();
    this.getUserDetail();
    this.getUserWalletRechargeApprovePending();
    this.updatWalletBalance();
    // this.getOrderDetails();

    let { status } = await Permissions.askAsync(Permissions.LOCATION);

    if (status !== "granted") {
      this.setState({
        errorMessage: "Permission to access location was denied",
      });
    } else if (status == "granted") {
      let location = await Location.getCurrentPositionAsync({});
      var lat = parseFloat(location.coords.latitude)
      var long = parseFloat(location.coords.longitude)

      var initialRegion = {
        latitude: Number(lat),
        longitude: Number(long),
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA
      }

      Geocoder.init(GOOGLE_MAPS_APIKEY);

      await Geocoder.from(initialRegion.latitude, initialRegion.longitude)
        .then(json => {
          var myCurrentAddressText = json.results[0]['formatted_address'];
          this.setState({
            myCurrentAddressText: myCurrentAddressText

          })
          this.getCustomerFavoriteAddressList();
        })
        .catch(error => console.warn(error));

      this.setState({ initialPosition: initialRegion })

    }

    this.focusListener = navigation.addListener("didFocus", () => {
      this.getUserWalletBalance();
    })

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
    this.channel.bind("App\\Events\\WalletRechargeApprove", (data) => {
      
      if (data.user_id == userID) {
        this.getUserWalletBalance();
        this.getUserWalletRechargeApprovePending();
      }
    })
  }

  async getPermissionAsync() {
    // Camera roll Permission
    if (Platform.OS === "ios") {
      const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);

      if (status !== "granted") {
        alert("Sorry, we need camera roll permissions to make this work!");
      }
    }
    // Camera Permission
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({ hasCameraPermission: status === "granted" });
  }

  pointMarkerBySearchC(data, details) {
    var addr_text = (details != '') ? details.formatted_address : '';
    var additional_latitude = (details != '') ? details.geometry.location.lat : '';
    var additional_longitude = (details != '') ? details.geometry.location.lng : '';

    if (additional_latitude && additional_longitude) {

      var locations = {};

      locations = { // The ID attached to the marker. It will be returned when onMarkerClicked is called
        coords: { latitude: additional_latitude, longitude: additional_longitude, latitudeDelta: 0.0922, longitudeDelta: 0.0421 }
      };

      pointC.push(locations);

      this.setState({
        initialPosition: locations.coords,

      });
    }
    this.setState({ initialPositiontext: addr_text });
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
        this.setState({ loader: false });
      }
    });
  }

  // get Customer Favorite Address List

  async getCustomerFavoriteAddressList() {
    // customer id
    // token

    this.setState({ loader: true });
    const userID = await AsyncStorage.getItem("userid");
    let Token = await AsyncStorage.getItem("token");

    Token = "Bearer " + Token;
    var from_location_address = this.state.fromLocationText;
    var dataForGetFavoriteLocation = {
      user_id: userID,
      latitude: this.state.initialPosition.latitude,
      longitude: this.state.initialPosition.longitude,
      formated_address: this.state.myCurrentAddressText,

    };
    getCustomerFavoriteAddressListAction(dataForGetFavoriteLocation, Token).then((responseJson) => {
      if (responseJson.isError == false) {
        this.setState({
          favoriteAddressList: responseJson.result,
          loader: false,
        });
      } else {
        alert(responseJson.message);
        this.setState({ loader: false });
      }
    });


  }

  getPermissionAsync = async () => {
    // Camera roll Permission
    if (Platform.OS === "ios") {
      const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);

      if (status !== "granted") {
        alert("Sorry, we need camera roll permissions to make this work!");
      }
    }
    // Camera Permission
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({ hasCameraPermission: status === "granted" });
  }

  /** Click Photo from Camera and then attach*/

  async attachphoto() {

    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: false,
      aspect: [4, 3],
      quality: 1,
      base64: true,
    });
    this.setState({
      attachphoto: result.uri,
      // photosName: result.name,
      photosName: result.uri.split('/').pop(),
      attachphotoStatus: 1,
    });

  }

  /** photo choose from gallary and attach */

  // async attachfilephoto() {

  //   let result = await DocumentPicker.pickMultiple({
  //     type: [DocumentPicker.types.allFiles],
  //   });

  //   this.setState({
  //     attachphoto: result.uri,
  //     photosName: result.uri.split('/').pop(),
  //     attachphotoStatus: 1,
  //   });


  // };


  async attachfilephoto() {
    try {
      let result = await DocumentPicker.getDocumentAsync({});

      if (result.type == "cancel") {
        alert(t("File not selected"));
      } else {

        this.setState({
          attachphoto: result.uri,
          // photosName: result.uri.split('/').pop(),
          attachphotoStatus: 1,
          // driverIdentityCardDocumentType: "file",
          photosName: result.name,
        });

      }
    } catch (err) {
      // alert(err);
      this.dropdown.alertWithType('error', 'Error', err);
    }
  }

  // User Wallet Balance Action

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
          WalletData: responseJson.result,
          loader: false,
        });
      } else {
        this.refs.defaultToastBottomWithDifferentColor.ShowToastFunction(
          responseJson.message
        );
        // alert(responseJson.message);
        this.setState({ loader: false });
      }
    });
  }

  // getUser Wallet Recharge Approve Pending Action

  async getUserWalletRechargeApprovePending() {
    this.setState({ loader: true, });
    const userID = await AsyncStorage.getItem("userid");
    let Token = await AsyncStorage.getItem("token");
    Token = "Bearer " + Token;

    const WalletApprovePending = {
      user_id: userID,
    };

    getUserWalletRechargeApprovePendingAction(WalletApprovePending, Token).then((responseJson) => {
      if (responseJson.isError == false) {
        this.setState({
          WalletStatusData: responseJson.result,
          loader: false,
        });
      } else {
        this.refs.defaultToastBottomWithDifferentColor.ShowToastFunction(
          responseJson.message
        );
        // alert(responseJson.message);
        this.setState({ loader: false });
      }
    });
  }

  // User Wallet History Action

  async getWalletHistory() {
    this.setState({ loader: true, });
    const userID = await AsyncStorage.getItem("userid");
    let Token = await AsyncStorage.getItem("token");
    Token = "Bearer " + Token;

    const WalletHistory = {
      user_id: userID,
    };

    getWalletHistoryAction(WalletHistory, Token).then((responseJson) => {
      if (responseJson.isError == false) {
        this.setState({
          dataSource: responseJson.result,
          loader: false,
        });
      } else {
        this.refs.defaultToastBottomWithDifferentColor.ShowToastFunction(
          responseJson.message
        );
        // alert(responseJson.message);
        this.setState({ loader: false });
      }
    });
  }

  // User Wallet Order Details Action
  // setModalVisible = (modalVisible) => {
  //    	this.setState(!modalVisible);
  //  	}

  Visible(modalVisible) {
    this.setState({ modalVisible: false });
  }

  async setModalVisible(order_id) {
    var order_id = order_id;


    this.setState({ loader: false, });
    const userID = await AsyncStorage.getItem("userid");
    let Token = await AsyncStorage.getItem("token");
    Token = "Bearer " + Token;

    const OrderDetails = {
      order_id: order_id,
    };
    getOrderDetailsAction(OrderDetails, Token).then((responseJson) => {

      if (responseJson.isError == false) {
        this.setState({
          orderData: responseJson.result,
          loader: false,
        });
      } else {
        this.refs.defaultToastBottomWithDifferentColor.ShowToastFunction(
          responseJson.message
        );
        // alert(responseJson.message);
        this.setState({ loader: false });
      }
    });
    this.setState({ modalVisible: true });
  }

  onRefresh() {
    this.setState({ loader: true, dataSource: [] });
    this.getUserWalletBalance();
    this.getWalletHistory();
  }

  toggleDrawer = () => {
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

  _handleBackButtonClick = () => this.props.navigation.navigate('MarketPlace')


  renderItem = ({ item }) => {
    const { modalmessage, modalVisible, orderData, WalletData } = this.state;
    return (
      <View>
        {(item.type == 'recharge') ? (
          <View>
            <Row style={styles.bodyRow}>
              <Col style={styles.bodyCol}>
                <List>
                  <Text style={{ color: '#A6A6A6', fontSize: 11, fontFamily: 'Inter-Black', }}>{item.type} # {item.id} - {item.bank_name}</Text>
                </List>
                <List>
                  <Text style={{ color: '#A6A6A6', fontSize: 11, fontFamily: 'Inter-Black', }}>Date: {moment(item.date).format('DD-MM-YYYY')} time: {moment(item.date).format('HH:mm')}</Text>
                </List>
              </Col>
              <Col style={{ alignItems: 'center', width: normalize(90), paddingTop: normalize(8) }}>
                <List>
                  <Text style={{ color: '#96cb7f', fontSize: 11, fontFamily: 'Inter-Black', }}> {item.currency} {item.amount}</Text>
                </List>
              </Col>
            </Row>
          </View>) : (<View>
            <Row style={styles.bodyRow}>
              <Col style={styles.bodyCol}>
                <List>
                  <Text style={{ color: '#A6A6A6', fontSize: 11, fontFamily: 'Inter-Black', }}>{item.type} # {item.id}</Text>
                </List>

                <List>
                  <Text style={{ color: '#A6A6A6', fontSize: 11, fontFamily: 'Inter-Black', }}>Date: {moment(item.date).format('DD-MM-YYYY')} time: {moment(item.date).format('HH:mm')}</Text>
                  <TouchableOpacity style={{ position: 'absolute', paddingLeft: '65%', }} onPress={() => { this.setModalVisible(item.order_id); }}>
                    <Text style={{ color: '#013782', fontSize: 11, fontFamily: 'Inter-Black', }}>{t('SEE DETALLE')}</Text>
                  </TouchableOpacity>
                  <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalVisible}>
                    <View style={styles.ModalCenteredView}>
                      <View style={styles.orderModalView}>
                        <Row style={{ height: normalize(50) }}>
                          <Col style={{ justifyContent: 'center', alignItems: 'center', paddingLeft: normalize(25) }}>
                            <Text style={{ color: '#1A87BA', fontSize: 20, fontFamily: 'Inter-Black' }}>{orderData.order_type} # {orderData.order_no}</Text>
                          </Col>
                          <Col style={{ width: normalize(55) }}>
                            <TouchableOpacity onPress={() => { this.Visible(!modalVisible); }}>
                              <Text style={{ color: '#9F9F9F', fontSize: 28, fontFamily: 'Inter-Black' }}>X</Text>
                            </TouchableOpacity>
                          </Col>
                        </Row>
                        <ScrollView>
                          <Row style={styles.Couriertitle}>
                            <Text style={styles.Couriertitle_text}>{t('Courier Detail')}</Text>
                          </Row>
                          <Row style={{ alignItems: 'flex-end', paddingLeft: normalize(30) }}>
                            <Text style={{ color: '#1A87BA', fontSize: 9, fontFamily: 'Inter-Black' }}>McDonald's/Costa Verde-Tu ubicacion(Av.11 de Octubre)</Text>
                          </Row>
                          <Row style={{ backgroundColor: '', alignItems: 'flex-end', paddingLeft: normalize(30), }}>
                            <Text style={{ color: '#A6A6A6', fontSize: 9, fontFamily: 'Inter-Black' }}>{t('Driver:')} {orderData.driver_name}/ {orderData.driver_mobile}</Text>
                          </Row>
                          <Row style={{ alignItems: 'flex-end', paddingLeft: normalize(10), paddingBottom: normalize(8), marginBottom: normalize(8), borderBottomWidth: 1, borderBottomColor: '#e6e6e6', marginLeft: 20, marginRight: 20 }}>
                            <Text style={{ color: '#A6A6A6', fontSize: 9, fontFamily: 'Inter-Black' }}>{t('Status:')} </Text>
                            <Text style={{ color: '#1A87BA', fontSize: 9, fontFamily: 'Inter-Black' }}>{orderData.driver_comment} </Text>
                          </Row>

                          <Row style={{ backgroundColor: '', alignItems: 'flex-end', paddingLeft: normalize(30), }}>
                            <Text style={{ fontSize: 23, fontFamily: 'Inter-Black' }}>{t('Payment Detail')}</Text>
                          </Row>

                          <Row style={{ marginLeft: 20, marginRight: 20 }}>
                            <Col>
                              <Row style={{ paddingLeft: normalize(10), }}>
                                <Text style={{ color: '#A6A6A6', fontSize: 9, fontFamily: 'Inter-Black' }}>Combo: 4 Hamburguesas con Queso</Text>
                              </Row>
                              <Row style={{ paddingLeft: normalize(10), }}>
                                <Text style={{ color: '#A6A6A6', fontSize: 9, fontFamily: 'Inter-Black' }}>+ 20 McNuggets + 2 McPaps Medianas</Text>
                              </Row>
                              <Row style={{ paddingLeft: normalize(10), }}>
                                <Text style={{ color: '#A6A6A6', fontSize: 9, fontFamily: 'Inter-Black' }}>gastos de envio GRATIS</Text>
                              </Row>
                            </Col>
                            <Col style={{ alignItems: 'flex-end', paddingRight: 10 }}>
                              <Text style={{ color: '#A6A6A6', fontSize: 17, fontFamily: 'Inter-Black', }}>$ 11.99</Text>
                            </Col>
                          </Row>

                          <Row style={{ borderBottomWidth: 1, borderBottomColor: '#e6e6e6', marginTop: 10, marginLeft: 20, marginRight: 20, paddingBottom: normalize(8), marginBottom: normalize(8) }}>
                            <Col>
                              <Row style={{ paddingLeft: normalize(10), }}>
                                <Text style={{ color: '#A6A6A6', fontSize: 9, fontFamily: 'Inter-Black' }}>Propina para mensajero - Gracis!</Text>
                              </Row>
                            </Col>
                            <Col style={{ alignItems: 'flex-end', paddingRight: 10 }}>
                              <Text style={{ color: '#A6A6A6', fontSize: 17, fontFamily: 'Inter-Black' }}>$ 1.50</Text>
                            </Col>
                          </Row>

                          <Row style={{ marginLeft: 20, marginRight: 20, marginBottom: 15 }}>
                            <Col>
                              <Row style={{ paddingLeft: normalize(10), }}>
                                <Text style={{ color: '#A6A6A6', fontSize: 9, fontFamily: 'Inter-Black' }}>{t('Total Paid:')}</Text>
                              </Row>
                              <Row style={{ paddingLeft: normalize(10), }}>
                                <Text style={{ color: '#A6A6A6', fontSize: 9, fontFamily: 'Inter-Black' }}>{t('Payment Method:')}</Text><Text style={{ color: '#1A87BA', fontSize: 9, fontFamily: 'Inter-Black' }}> {orderData.payment_method}</Text>
                              </Row>
                            </Col>
                            <Col style={{ alignItems: 'flex-end', paddingRight: 10 }}>
                              <Text style={{ color: '#1A87BA', fontSize: 17, fontFamily: 'Inter-Black' }}>{orderData.currency_symbol} {orderData.total}</Text>
                            </Col>
                          </Row>
                        </ScrollView>
                      </View>
                    </View>
                  </Modal>
                </List>
              </Col>

              <Col style={{ alignItems: 'center', width: normalize(90), paddingTop: normalize(8) }}>
                <List>
                  <Text style={{ color: '#FF0000', fontSize: 11, fontFamily: 'Inter-Black', }}>- {item.currency} {item.amount}</Text>
                </List>
              </Col>
            </Row>
          </View>)}
      </View>

    );
  };

  render() {
    const { navigate } = this.props.navigation;
    const { hasCameraPermission, collapsed, second_collapsed, Amount, Payment, WalletStatusData, loader, modalmessage, dataSource, WalletData, userData, orderData, initialPosition, from_location_address } = this.state;
    const homePlace = { description: 'Home', geometry: { location: { lat: 48.8152937, lng: 2.4597668 } } };
    const workPlace = { description: 'Work', geometry: { location: { lat: 48.8496818, lng: 2.2940881 } } };
    const favoriteAddressData = [];
    for (let userObject1 of this.state.favoriteAddressList) {
      favoriteAddressData.push({ label: userObject1.label, value: userObject1.value });
    }
    if (!loader) {
      return (
        <View style={styles.container}>
          <NavigationEvents
            onWillFocus={this._onFocus}
            onWillBlur={this._onBlurr}
          />
          <StatusBar />
          <Row style={styles.wallet_menu}>
            <Col style={styles.backarrow}>
              <TouchableOpacity style={{ padding: 10 }} onPress={() => navigate('MarketPlace')}>
                <Image style={{ height: normalize(20), width: normalize(20) }}
                  source={require('../../images/back-arrow-gray.png')}
                />
              </TouchableOpacity>
            </Col>
            <Col style={styles.wallet_profile}>
              <Image style={{ height: normalize(70), width: normalize(70) }}
                source={require('../../images/profile_wallet.png')}
              />
            </Col>
            <Col>
              <Row style={styles.Name}>
                <Text style={styles.Nametext}>{t('Hello')}</Text>
                <Text style={styles.Nametext2} numberOfLines={1}>{userData.first_name}</Text>
              </Row>
              {/* <Row>
                <Dropdown
                  dropdownOffset={{ top: 0, left: 14 }}
                  placeholder={t('My current loction')}
                  style={styles.loction}
                  itemTextStyle={'Inter-Black'}
                  placeholderTextColor={'#000'}
                  tintColor={'#000000'}
                  activityTintColor={'red'}
                  data={favoriteAddressData}
                  baseColor={'#848485'}
                  selectedItemColor={'#000'}
                  paddingLeft={5}
                  itemTextStyle={{ fontFamily: 'Inter-Black', }}
                  placeholderTextColor='red'
                >
                </Dropdown>
                <Col style={{ position: 'absolute', marginLeft: normalize(160), paddingTop: normalize(6) }}>
                  <Image style={{ height: normalize(22), width: normalize(22) }}
                    source={require('../../images/Down-gray.png')}
                  />
                </Col>
              </Row> */}
            </Col>
            <Col style={styles.shoping}>
              <TouchableOpacity>
                <Image style={{ height: normalize(25), width: normalize(25) }}
                  source={require('../../images/Shoping-gray.png')}
                />
              </TouchableOpacity>
            </Col>
            <Col style={styles.menu}>
              <TouchableOpacity style={{ paddingLeft: 5 }} onPress={this.toggleDrawer.bind(this)}>
                <Image style={{ height: normalize(25), width: normalize(25) }}
                  source={require('../../images/menu-gray.png')}
                />
              </TouchableOpacity>
            </Col>
          </Row>

          <ScrollView refreshControl={
            <RefreshControl colors={["#d62326"]} refreshing={this.state.loading} onRefresh={this.onRefresh.bind(this)} />
          }>
            <Row style={styles.balance_row}>
              <Col style={styles.logo}>
                <Image style={{ height: normalize(100), width: normalize(120), }}
                  source={require('../../images/Logo_2.png')}
                />
                <Text style={styles.logo_text}>{t('Payment')}</Text>
              </Col>
              <Col style={styles.balance_text_col}>
                <Text style={styles.balance_text}>{t('My current balance: ')}</Text>
              </Col>
              <Col style={styles.balance_col}>
                <Text style={styles.balance}>{WalletData.currency_symbol} {WalletData.balance}</Text>
              </Col>
            </Row>

            <Collapse
              isCollapsed={this.state.collapsed}
              onToggle={(isCollapsed) => this.setState({ collapsed: !this.state.collapsed })}
              style={styles.payment_colls}>
              {(collapsed == true) ? (
                <CollapseHeader onPress>
                  <Row style={styles.payment_row}>
                    <Col>
                      <Text style={styles.payment_name}>{t('Payment history')}</Text>
                    </Col>
                    <Col style={styles.down_arrow}>
                      <Image style={{ height: normalize(22), width: normalize(22) }}
                        source={require('../../images/up-gray.png')}
                      />
                    </Col>
                  </Row>
                </CollapseHeader>) : (<CollapseHeader>
                  <Row style={styles.payment_row}>
                    <Col>
                      <Text style={styles.payment_name}>{t('Payment history')}</Text>
                    </Col>
                    <Col style={styles.down_arrow}>
                      <Image style={{ height: normalize(22), width: normalize(22) }}
                        source={require('../../images/Down-gray.png')}
                      />
                    </Col>
                  </Row>
                </CollapseHeader>)}

              <CollapseBody>
                <FlatList
                  data={dataSource}
                  renderItem={this.renderItem}
                  keyExtractor={(item) => item.id.toString()}
                  ListEmptyComponent={
                    <EmptyComponent title={t('you have no history of hitting')} />}
                  refreshControl={
                    <RefreshControl
                      colors={["#d62326"]}
                      refreshing={this.state.loading}
                      onRefresh={this.onRefresh.bind(this)}
                    />
                  }
                />
                <Row style={{ marginTop: normalize(10), height: normalize(30), marginBottom: normalize(45) }}>
                  <Col style={styles.bodyCol}>
                    <List>
                      <Text style={{ color: '#A6A6A6', fontSize: 11, fontFamily: 'Inter-Black', }}>{t('Balance update')}</Text>
                    </List>
                    <List>
                      <Text style={{ color: '#A6A6A6', fontSize: 11, fontFamily: 'Inter-Black', }}>Date: {moment().format('DD-MM-YYYY')} time: {moment().format('HH:mm')} </Text>
                    </List>
                  </Col>
                  <Col style={{ alignItems: 'center', width: normalize(90), paddingTop: normalize(8), }}>
                    <List>
                      <Text style={{ color: '#50575E', fontSize: 11, fontFamily: 'Inter-Black', }}>  {WalletData.currency_symbol} {WalletData.balance}</Text>
                    </List>
                  </Col>
                </Row>
                <FlatList
                  data={orderData}
                  renderItem={this.renderItem}
                  keyExtractor={(item) => item.order_id.toString()}
                />

              </CollapseBody>
            </Collapse>

            <Collapse
              isCollapsed={this.state.second_collapsed}
              onToggle={(isCollapsed) => this.setState({ second_collapsed: !this.state.second_collapsed })}
              style={styles.account_colls}>

              {(second_collapsed == true) ? (
                <CollapseHeader>
                  <Row style={styles.account_row}>
                    <Col>
                      <Text style={styles.account_name}>{t('Top up your account')}</Text>
                    </Col>
                    <Col style={styles.down_arrow}>
                      <Image style={{ height: normalize(22), width: normalize(22) }}
                        source={require('../../images/up-gray.png')}
                      />
                    </Col>
                  </Row>
                </CollapseHeader>) : (<CollapseHeader>
                  <Row style={styles.account_row}>
                    <Col>
                      <Text style={styles.account_name}>{t('Top up your account')}</Text>
                    </Col>
                    <Col style={styles.down_arrow}>
                      <Image style={{ height: normalize(22), width: normalize(22) }}
                        source={require('../../images/Down-gray.png')}
                      />
                    </Col>
                  </Row>
                </CollapseHeader>)}

              <CollapseBody>
                <List style={{ marginTop: normalize(10) }}>
                  <Text style={{ color: '#1A87BA', marginLeft: normalize(15), fontSize: 15, fontFamily: 'Inter-Black', }}>{t('Select the account used:')}</Text>
                </List>
                <Row style={{ height: normalize(125), }}>
                  <Col>
                    <Row style={{ backgroundColor: '', justifyContent: 'center', alignItems: 'flex-start', width: normalize(120), height: normalize(78) }}>
                      <Image style={{ height: normalize(77), width: normalize(95) }}
                        source={require('../../images/yappy.png')}
                      />
                    </Row>
                    <Row style={{ backgroundColor: '', justifyContent: 'center', height: normalize(18), marginBottom: normalize(10) }}><Text style={{ fontSize: 13, fontFamily: 'Inter-Black', }}>+507 6675 2662</Text></Row>
                    <Row style={styles.radio_select}>
                      <View style={styles.radio}>
                        <RadioButton style={{ borderWidth: Platform.OS === 'ios' ? '#1A87BA' : '#1A87BA', uncheckedColor: Platform.OS === 'ios' ? '#1A87BA' : '#1A87BA' }}
                          value="yappy"
                          color='#1A87BA'
                          uncheckedColor='#1A87BA'
                          status={Payment === 'yappy' ? 'checked' : 'unchecked'}
                          onPress={() => { this.setState({ Payment: 'yappy', modalmessage: true }) }}

                        />
                      </View>
                    </Row>
                    <Modal
                      animationType="slide"
                      transparent={true}
                      visible={modalmessage}>
                      <View style={styles.ModalCenteredView}>
                        <View style={styles.notifyModalView}>
                          <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: normalize(10) }}>
                            <Image style={{ height: normalize(65), width: normalize(65) }}
                              source={require('../../images/Notice.png')}
                            />
                          </View>
                          <View style={styles.notifyModal_row}>
                            <Text style={styles.notifyModal_row_text}>{t('Dear user, we remind you that when notifying your recharge the same it will go through a validation process to be reflected in your account')}</Text>
                          </View>
                          <View style={styles.notifyModal_last_row}>
                            <Text style={styles.notifyModal_row_text}>{t('It may take around 15-20 minutes')}</Text>
                          </View>
                          <View style={styles.notifyModal_button_view}>
                            <TouchableOpacity onPress={() => { this.setModalmessageType(!modalmessage); }}>
                              <Row style={styles.notifyModal_button_row}>
                                <Text style={styles.notifyModal_button_text}>{t('To accept')}</Text>
                              </Row>
                            </TouchableOpacity>
                          </View>
                        </View>
                      </View>
                    </Modal>
                  </Col>
                  <Col>
                    <Row style={{ backgroundColor: '', justifyContent: 'center', alignItems: 'center', width: normalize(110), marginTop: normalize(16), }}>
                      <Image style={{ height: normalize(95), width: normalize(125) }}
                        source={require('../../images/banco.png')}
                      />
                    </Row>
                    <Row style={{ backgroundColor: '', justifyContent: 'center', height: normalize(22) }}>
                      <Text style={{ fontFamily: 'Inter-Black', }}>0497983523597</Text>
                    </Row>
                    <Row style={{ backgroundColor: '', justifyContent: 'center', height: normalize(16) }}>
                      <Text style={{ fontSize: 10, fontFamily: 'Inter-Black', }}>Murad Joseph Harari</Text>
                    </Row>
                    <Row style={{ backgroundColor: '', justifyContent: 'center', height: normalize(16), marginBottom: normalize(10) }}>
                      <Text style={{ fontSize: 10, fontFamily: 'Inter-Black', }}>(Cuenta de Ahorros)</Text>
                    </Row>
                    <Row style={styles.radio_select}>
                      <View style={styles.radio}>
                        <RadioButton style={{ borderWidth: Platform.OS === 'ios' ? '#1A87BA' : '#1A87BA', uncheckedColor: Platform.OS === 'ios' ? '#1A87BA' : '#1A87BA' }}
                          value="banco"
                          color='#1A87BA'
                          uncheckedColor='#1A87BA'
                          status={Payment === 'banco' ? 'checked' : 'unchecked'}
                          onPress={() => { this.setState({ Payment: 'banco', modalmessage: true }) }}
                        />
                      </View>
                    </Row>
                  </Col>
                  <Col>
                    <Row style={{ backgroundColor: '', justifyContent: 'center', alignItems: 'flex-start', width: normalize(120), height: normalize(78) }}>
                      <Image style={{ height: normalize(77), width: normalize(95) }}
                        source={require('../../images/nequi.png')}
                      />
                    </Row>
                    <Row style={{ backgroundColor: '', justifyContent: 'center', height: normalize(18), marginBottom: normalize(10) }}><Text style={{ fontSize: 13, fontFamily: 'Inter-Black', }}>+507 6675 2662</Text></Row>
                    <Row style={styles.radio_select}>
                      <View style={styles.radio}>
                        <RadioButton style={{ borderWidth: Platform.OS === 'ios' ? '#1A87BA' : '#1A87BA', uncheckedColor: Platform.OS === 'ios' ? '#1A87BA' : '#1A87BA' }}
                          value="nequi"
                          color='#1A87BA'
                          uncheckedColor='#1A87BA'
                          status={Payment === 'nequi' ? 'checked' : 'unchecked'}
                          onPress={() => { this.setState({ Payment: 'nequi', modalmessage: true }) }}
                        />
                      </View>
                    </Row>
                  </Col>
                </Row>
                <Row style={{ height: normalize(25), justifyContent: 'center', alignItems: 'flex-start', marginTop: normalize(3), }}>
                  <Text style={{ fontSize: 14, color: '#1A87BA', fontFamily: 'Inter-Black', }}>{t('Enter the amount:')}</Text>
                </Row>
                {(this.state.Amount != 0) ? (
                  <Row style={{ backgroundColor: '#f2f2f2', justifyContent: 'center', alignItems: 'center', borderRadius: normalize(25), marginRight: normalize(100), marginLeft: normalize(100), height: normalize(40), marginTop: normalize(3), }}>
                    <Col style={{ width: normalize(48), paddingLeft: normalize(30), }}>
                      <Text style={{ fontSize: 16, color: '#808080', fontFamily: 'Inter-Black', }}>
                        {WalletData.currency_symbol}
                      </Text>
                    </Col>
                    <Col style={{ width: normalize(100), }}>
                      <TextInput
                        style={{ fontSize: 16, color: '#808080', fontFamily: 'Inter-Black', alignItems: 'center', justifyContent: 'center', marginLeft: normalize(20) }}
                        keyboardType="numeric"
                        onChangeText={(Amount) => this.setState({ Amount })}
                        placeholder={t('Amount')}
                      >
                      </TextInput>
                    </Col>
                  </Row>
                ) : (
                    <Row style={{ backgroundColor: '#f2f2f2', textalign: 'center', justifyContent: 'center', alignItems: 'center', borderRadius: normalize(25), marginRight: normalize(100), marginLeft: normalize(100), height: normalize(40), marginTop: normalize(3), }}>
                      <Col style={{ width: normalize(48), paddingLeft: normalize(30), }}>
                        <Text style={{ fontSize: 16, color: '#808080', fontFamily: 'Inter-Black', }}>
                        </Text>
                      </Col>
                      <Col style={{ width: normalize(100), }}>
                        <TextInput
                          style={{ fontSize: 16, color: '#808080', fontFamily: 'Inter-Black', }}
                          keyboardType="numeric"
                          onChangeText={(Amount) => this.setState({ Amount })}
                          placeholder={t('Amount')}
                          placeholderTextColor="#808080"
                        >
                        </TextInput>
                      </Col>
                    </Row>
                  )
                }
                <Row style={{ justifyContent: 'center', alignItems: 'flex-start', marginTop: normalize(12), height: normalize(25) }}>
                  <Text style={{ fontSize: 18, color: '#1A87BA', fontFamily: 'Inter-Black', }}>{t('Attach your proof:')}</Text>
                </Row>
                <Row style={{ height: normalize(50), marginTop: normalize(5), backgroundColor: '', }}>
                  <Col style={{ backgroundColor: '', width: normalize(90), justifyContent: 'center', alignItems: 'flex-end', backgroundColor: '', }}>
                    <Row style={{ backgroundColor: '#f2f2f2', borderRadius: normalize(13), width: normalize(36), height: normalize(36), justifyContent: 'center', alignItems: 'center', }}>
                      <TouchableOpacity onPress={() => this.attachfilephoto()}>
                        <Image style={{ height: 25, width: 25 }}
                          source={require('../../images/attach.png')}
                        />
                      </TouchableOpacity>
                    </Row>
                  </Col>
                  <Col style={{ backgroundColor: '', width: normalize(45), justifyContent: 'center', alignItems: 'center', }}>
                    <Text style={{ fontFamily: 'Inter-Black', fontSize: 21, }}>ó</Text>
                  </Col>
                  <Col style={{ backgroundColor: '', justifyContent: 'center', alignItems: 'flex-start', }}>
                    <Row style={{ backgroundColor: '#f2f2f2', borderRadius: normalize(13), width: normalize(36), height: normalize(36), justifyContent: 'center', alignItems: 'center', }}>
                      <TouchableOpacity onPress={() => this.attachphoto()}>
                        <Image style={{ height: 21, width: 21 }}
                          source={require('../../images/Wallet_Camera.png')}
                        />
                      </TouchableOpacity>
                    </Row>
                  </Col>
                  <Col style={{ backgroundColor: '', justifyContent: 'center', alignItems: 'flex-start', width: normalize(155) }}>
                    <Row style={{ backgroundColor: '#f2f2f2', borderRadius: normalize(5), width: normalize(105), height: normalize(25), justifyContent: 'center', alignItems: 'center', }}>
                      <TextInput
                        placeholder={t('Attached file')}
                        editable={false}
                        placeholderTextColor="#808080"
                        onChangeText={(attachphoto) => this.setState({ attachphoto })}
                        style={{ fontSize: 10, color: '#808080', fontFamily: 'Inter-Black', textAlign: 'center' }}>{this.state.photosName}</TextInput>
                    </Row>
                  </Col>
                </Row>
                <TouchableOpacity onPress={this.WalletRechargeData.bind(this)}>
                  <Row style={{ backgroundColor: '#1987B8', marginTop: normalize(15), borderRadius: normalize(15), height: normalize(32), marginRight: normalize(90), marginLeft: normalize(90), justifyContent: 'center', alignItems: 'center', marginBottom: normalize(50), }}>
                    <Text style={{ color: 'white', fontSize: 16, fontFamily: 'Inter-Black', }}>{t('Notify your recharge')}</Text>
                  </Row>
                </TouchableOpacity>
              </CollapseBody>
            </Collapse>
            {(WalletStatusData != 0) ? (
              // <View>
                <Col style={{ height: normalize(150), marginTop: normalize(70), justifyContent: 'center' }}>
                  <Row style={{ justifyContent: 'center', alignItems: 'center', height: normalize(60) }}>
                    <Image style={{ height: normalize(50), width: normalize(50) }}
                      source={require('../../images/SuccessMSG.png')}
                    />
                  </Row>
                  <Row style={{ height: normalize(55), justifyContent: 'center', alignItems: 'center', }}>
                    <Text style={{ fontFamily: 'Inter-Black', fontSize: 18 }}>{t('Your recharge has been successfully notified!')}</Text>
                  </Row>
                  <Row style={{ height: normalize(22), justifyContent: 'center', }}>
                    <Text style={{ fontFamily: 'Inter-Black', fontSize: 16, color: '#1987B8', }}>{t('The recharge time for your account')}</Text>
                  </Row>
                  <Row style={{ height: normalize(22), justifyContent: 'center', }}>
                    <Text style={{ fontFamily: 'Inter-Black', fontSize: 16, color: '#1987B8', }}>{t('it is approximately 15 minutes')}</Text>
                  </Row>
                </Col>
              // </View>
              ) : (<View>

              </View>)}
            <Col style={{ height: normalize(137), marginTop: normalize(90), }}>
              <Row style={{ height: normalize(20), justifyContent: 'center', alignItems: 'flex-start', }}>
                <Text style={{ color: '#1987B8', fontSize: 12, fontFamily: 'Inter-Black', }}>{t('Do you have any doubt?')}</Text>
              </Row>
              <Row style={{ height: normalize(20), justifyContent: 'center', alignItems: 'flex-start', }}>
                <Text style={{ color: '#1987B8', fontSize: 12, fontFamily: 'Inter-Black', }}>{t('Write us via WhatsApp!')}</Text>
              </Row>
              <Row style={{ justifyContent: 'center', alignItems: 'center', }}>
                <Row style={{ height: normalize(90), width: normalize(90), backgroundColor: '#B7D9F2', borderRadius: 50, }}>
                  <Col style={{ justifyContent: 'center', alignItems: 'center', }}>
                    <TouchableOpacity>
                      <Image style={{ height: normalize(55), width: normalize(55) }}
                        source={require('../../images/whatsapp.png')}
                      />
                    </TouchableOpacity>
                  </Col>
                </Row>
              </Row>
            </Col>
          </ScrollView>
          <DropdownAlert ref={ref => this.dropdown = ref} />
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

// empty component
const EmptyComponent = ({ title }) => (
  <View style={styles.emptyContainer}>
    <Text style={styles.emptyText}>{title}</Text>
  </View>
);
const styles = StyleSheet.create({

  confirmButtonTextStyle: {
    fontSize: 15,
    fontFamily: 'Inter-Black',
    color: '#FFFFFF',
  },
  confirmButtonStyle: {
    backgroundColor: '#1987B8',
    borderRadius: normalize(15),
    width: normalize(120),
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentContainerStyle: {
    backgroundColor: '#FFFFFF',
    borderRadius: normalize(25),
  },
  messageStyle: {
    fontFamily: 'Inter-Black',
    fontSize: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyText: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    fontSize: 15,
    fontFamily: 'Inter-Black',
    color: "#808080",
    marginTop: normalize(20),
    marginBottom: normalize(20),
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
    backgroundColor: '#ffffff'
  },
  wallet_menu: {
    ...Platform.select({
      ios: {
        height: normalize(120),
        paddingTop: "12%",
        // marginTop: normalize(15),
      },
      android: {
        height: normalize(75),
      }
    })
  },
  backarrow: {
    width: normalize(45),
    justifyContent: 'center',
    alignItems: 'center',

  },
  wallet_profile: {
    justifyContent: 'center',
    alignItems: 'center',
    width: normalize(70),
  },
  Name: {
    alignItems: 'center',
  },
  Nametext: {
    color: '#50575E',
    fontSize: normalize(25),
    paddingLeft: normalize(10),
    fontFamily: "Inter-Black",
  },
  Nametext2: {
    ...Platform.select({
      ios:
      {
        color: '#B12026',
        fontSize: normalize(25),
        width: normalize(120),
        paddingLeft: normalize(8),
        fontFamily: "Inter-Black",
      },
      android:
      {
        color: '#B12026',
        fontSize: normalize(25),
        width: normalize(130),
        paddingLeft: normalize(8),
        fontFamily: "Inter-Black",
      }
    })
  },
  loction: {
    backgroundColor: '#FFFFFF',
    height: normalize(30),
    paddingLeft: normalize(5),
    width: normalize(175),
    fontFamily: 'Inter-Black',
  },
  shoping: {
    width: normalize(40),
    height: normalize(40),
    paddingTop: normalize(10),
  },
  menu: {
    width: normalize(40),
    height: normalize(40),
    paddingTop: normalize(10),
  },
  balance_row: {
    ...Platform.select({
      ios: {
        backgroundColor: '#B7D9F2',
        height: normalize(50),
        marginTop: normalize(25),
        borderRadius: normalize(20),
        marginLeft: normalize(35),
        marginRight: normalize(30),
      },
      android: {
        backgroundColor: '#B7D9F2',
        height: normalize(50),
        marginTop: normalize(25),
        borderRadius: normalize(20),
        marginLeft: normalize(35),
        marginRight: normalize(30),
      },
    })
  },
  logo: {
    ...Platform.select({
      ios: {
        justifyContent: 'center',
        width: normalize(150),
        paddingTop: normalize(10),
      },
      android: {
        justifyContent: 'center',
        width: normalize(135),
        paddingTop: normalize(10),
      },
    })
  },
  logo_text: {
    ...Platform.select({
      ios: {
        color: '#404041',
        fontSize: 11,
        position: 'absolute',
        paddingTop: normalize(47),
        paddingLeft: normalize(90),
        fontFamily: 'Inter-Black',
      },
      android: {
        color: '#404041',
        fontSize: 11,
        position: 'absolute',
        paddingTop: normalize(47),
        paddingLeft: normalize(90),
        fontFamily: 'Inter-Black',
      },
    })
  },
  balance_text_col: {
    ...Platform.select({
      ios: {
        justifyContent: 'center',
        alignItems: 'flex-start',
        width: normalize(85),
      },
      android: {
        justifyContent: 'center',
        alignItems: 'flex-start',
        width: normalize(110),
      },
    })
  },
  balance_text: {
    ...Platform.select({
      ios: {
        fontSize: 12,
        color: '#404041',
        fontFamily: 'Inter-Black',
      },
      android: {
        fontSize: 12,
        color: '#404041',
        fontFamily: 'Inter-Black',
      },
    })
  },
  balance_col: {
    ...Platform.select({
      ios: {
        justifyContent: 'center',
        paddingLeft: normalize(5),
      },
      android: {
        justifyContent: 'center',
        paddingLeft: normalize(5),
      },
    })
  },
  balance: {
    ...Platform.select({
      ios: {
        fontSize: 17,
        color: '#404041',
        fontFamily: 'Inter-Black',
      },
      android: {
        fontSize: 17,
        color: '#404041',
        fontFamily: 'Inter-Black',
      },
    })
  },
  payment_colls: {
    borderWidth: 1,
    borderColor: '#f2f2f2',
    marginTop: normalize(20),
    marginLeft: normalize(15),
    marginRight: normalize(20),
    borderRadius: normalize(30),
  },
  payment_row: {
    backgroundColor: '#f2f2f2',
    borderRadius: 30,
    paddingLeft: normalize(35),
    alignItems: 'center',
    height: normalize(40),
  },
  payment_name: {
    color: '#50575E',
    fontSize: 15,
    fontFamily: 'Inter-Black',
  },
  down_arrow: {
    width: normalize(60),
    justifyContent: 'center',
    alignItems: 'center',
  },
  account_colls: {
    borderWidth: 1,
    borderColor: '#f2f2f2',
    marginTop: normalize(8),
    marginLeft: normalize(15),
    marginRight: normalize(20),
    borderRadius: normalize(30),
  },
  account_row: {
    backgroundColor: '#f2f2f2',
    borderRadius: 30,
    paddingLeft: normalize(35),
    alignItems: 'center',
    height: normalize(40),
  },
  account_name: {
    color: '#50575E',
    fontSize: 15,
    fontFamily: 'Inter-Black',
  },
  bodyRow: {
    marginTop: normalize(10),
    height: normalize(30),
  },
  bodyRowLast: {
    marginTop: normalize(10),
    height: normalize(30),
    // marginBottom: normalize(60),
  },
  bodyCol: {
    paddingLeft: normalize(15),
  },
  // Modal
  ModalCenteredView: {
    ...Platform.select({
      ios: {
        // borderRadius: 10,
        //shadowColor: "#232324",
        shadowOffset: { width: 0, height: 1, },
        elevation: 300,
        // top: 200,
        // height:"20%",
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
      },
    })
  },
  orderView: {
    ...Platform.select({
      ios: {
        height: normalize(57),
      },
      android: {
        height: normalize(57),
      }
    })
  },
  orderModalView: {
    ...Platform.select({
      ios: {
        borderRadius: 20,
        top: "5%",
        // bottom: '20%',
        marginLeft: 20,
        marginRight: 20,
        // backgroundColor: "white",
        opacity: 1.25,
        backgroundColor: '#FFFFFF',
        marginTop: normalize(170),
        marginRight: normalize(30),
        marginLeft: normalize(30),
        borderRadius: normalize(40),
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
        opacity: 1.25,
        backgroundColor: '#FFFFFF',
        top: "10%",
        marginRight: normalize(30),
        marginLeft: normalize(30),
        borderRadius: normalize(40),
        shadowColor: "#232324",

        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        elevation: 5
      }
    })
  },
  notifyModalView: {
    ...Platform.select({
      ios: {
        opacity: 1.25,
        backgroundColor: '#FFFFFF',
        marginTop: normalize(170),
        marginRight: normalize(50),
        marginLeft: normalize(50),
        borderRadius: normalize(40),
        shadowColor: "#232324",
        // marginLeft: 20,
        // marginRight: 20,
        // backgroundColor: "white",
        // opacity: 1.25,
        // paddingLeft: 5,
        // paddingRight: 5,
        // shadowColor: "#232324",

        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        // shadowRadius: 3.84,
        elevation: 5
      },
      android: {
        opacity: 1.25,
        backgroundColor: '#FFFFFF',
        marginTop: normalize(170),
        marginRight: normalize(50),
        marginLeft: normalize(50),
        borderRadius: normalize(40),
        shadowColor: "#232324",

        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        elevation: 5
      }
    })
  },
  notifyModal_row: {
    ...Platform.select({
      ios: {
        height: normalize(110),
        marginTop: normalize(25),
        paddingLeft: normalize(18),
        paddingRight: normalize(18),
        flexShrink: 1,
      },
      android: {
        height: normalize(120),
        marginTop: normalize(10),
        paddingLeft: normalize(18),
        paddingRight: normalize(18),
        flexShrink: 1
      }
    })
  },
  notifyModal_last_row: {
    ...Platform.select({
      ios: {
        height: normalize(25),
        marginTop: normalize(5),
        paddingLeft: normalize(18),
        paddingRight: normalize(18),
        flexShrink: 1,
      },
      android: {
        height: normalize(25),
        marginTop: normalize(5),
        marginBottom: normalize(5),
        paddingLeft: normalize(18),
        paddingRight: normalize(18),
        flexShrink: 1
      }
    })
  },
  notifyModal_row_text: {
    ...Platform.select({
      ios: {
        fontSize: 17,
        fontFamily: 'Inter-Black',
        flexShrink: 1,
      },
      android: {
        fontSize: 17,
        fontFamily: 'Inter-Black',
        flexShrink: 1,
      }
    })
  },
  notifyModal_button_view: {
    ...Platform.select({
      ios: {
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: normalize(25),
        marginBottom: normalize(25),
      },
      android: {
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: normalize(25),
        marginBottom: normalize(25),
      }
    })
  },
  notifyModal_button_row: {
    ...Platform.select({
      ios: {
        backgroundColor: '#1987B8',
        height: normalize(40),
        width: normalize(140),
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: normalize(50)
      },
      android: {
        backgroundColor: '#1987B8',
        height: normalize(40),
        width: normalize(140),
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: normalize(50)
      }
    })
  },
  notifyModal_button_text: {
    ...Platform.select({
      ios: {
        fontFamily: 'Inter-Black',
        fontSize: 20,
        color: '#FFFFFF',
      },
      android: {
        fontFamily: 'Inter-Black',
        fontSize: 20,
        color: '#FFFFFF',
      }
    })
  },
  Couriertitle: {
    ...Platform.select({
      ios: {
        paddingLeft: normalize(30),
        alignItems: 'center',
        marginTop: normalize(8),
        height: normalize(30)
      },
      android: {
        paddingLeft: normalize(30),
        alignItems: 'center',
        marginTop: normalize(8)
      }
    })
  },
  Couriertitle_text: {
    ...Platform.select({
      ios: {
        fontSize: 23,
        fontFamily: 'Inter-Black'
      },
      android: {
        fontSize: 23,
        fontFamily: 'Inter-Black',
      }
    })
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
  radio_select: {
    ...Platform.select({
      ios: {
        justifyContent: 'center',
        alignItems: 'center',
        height: normalize(25),
      },
      android:
      {
        justifyContent: 'center',
        alignItems: 'center',
        height: normalize(25),
      }
    })
  },
})