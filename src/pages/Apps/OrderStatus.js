import React, { Component } from "react";
import {
  Toast,
  Platform,
  View,
  Text,
  Modal,
  TouchableOpacity,
  AsyncStorage,
  Image,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  TextInput,
  ScrollView,
  Dimensions,
  Linking,
  BackHandler

} from "react-native";
import { Col, Row } from "react-native-easy-grid";
import { t } from '../../../locals';
import { customerOrderCancelAction, getOrderCostAction, getOrderDetailAction, saveCustomerReviewForOrderAction } from '../Util/Action.js';
import { NavigationEvents } from 'react-navigation';
// import CustomToast from './Toast.js';
import normalize from 'react-native-normalize';
import Pusher from "pusher-js/react-native";
import DropdownAlert from 'react-native-dropdownalert';


const { width, height } = Dimensions.get("screen");

export default class OrderStatusScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      review: 1,
      Max_Rating: 5,
      loader: false,
      fundEditTexBoxStatus: 1,
      dataSource: [],
      paymentData: [],
      payment_method: '',
      fund: 0,
      modalVisible: false,
      modalCancel: false,
      modalSupport: false,
      modalCall: false,
      method_name: '',
      driver_id: '',
      admin_id: '',
      triggerChannelState: 0,
      userToken: "",


    };

  }
  UpdateRating(key) {
    this.setState({ review: key, });
    //Keeping the Rating Selected in state
  }

  static navigationOptions = ({ navigation }) => {
    return {
      headerShown: false,
    };
  };
  toggleDrawer = ({ navigation }) => {
    this.props.navigation.toggleDrawer();
  };
  SupportChat(modalSupport, navigate) {
    this.setModalSupport(!modalSupport);
    navigate('ChatWithAdmin', { order_id: this.state.order_id, admin_id: this.state.admin_id, backpage: 'orderview' });
  }
  DriverChat(modalCall, navigate) {
    this.setModalCall(!modalCall);
    navigate('ChatWithDriver', { order_id: this.state.order_id, driver_id: this.state.driver_id, backpage: 'orderview' });
  }
  // toogle funnd textbox
  // showFundTextbox() {
  //   if (this.state.fundEditTexBoxStatus == 1) {
  //     this.setState({ fundEditTexBoxStatus: 0 });
  //   } else {
  //     this.setState({ fundEditTexBoxStatus: 1 });
  //   }
  // }

  async componentDidMount() {
    let userToken = await AsyncStorage.getItem("token");
    this.setState({
      userToken: userToken,
    });
    this.getOrderDetail();
    this._pusherSubscription();
    this.fundupdate();

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

    this.channel = this.pusher.subscribe("private-fund_update");
    // console.log(this.channel)
    this.setState({
      triggerChannelState: 1,
    });


  }


  // fund update by pusher //

  fundupdate() {
    const { order_id, userToken } = this.state;

    this.channel.bind("App\\Events\\FundUpdate", (data) => {
      if (data.order_id == order_id) {
        this.getOrderDetail();
      }
    })

  }


  //   /** get login user detail */
  async getOrderDetail() {
    this.setState({ loader: true });
    const order_id = this.props.navigation.getParam("order_id");
    const customer_id = await AsyncStorage.getItem("userid");

    let Token = await AsyncStorage.getItem("token");

    Token = "Bearer " + Token;
    const getOrderDetailData = {
      customer_id: customer_id,
      order_id: order_id,

    };
    getOrderDetailAction(getOrderDetailData, Token).then((responseJson) => {
      if (responseJson.isError == false) {
        // console.log(responseJson)
        this.setState({
          admin_id: responseJson.result.admin_id,
          driver_id: responseJson.result.driver_id,
          order_id: responseJson.result.id,
          dataSource: responseJson.result,
          payment_method: responseJson.result.payment.payment_method,
          paymentData: responseJson.result.payment,
          loader: false,
        });
        this.fundupdate(responseJson.result.id)
        if (responseJson.result.status == "Completed" && responseJson.result.review_count == 0) {
          this.setState({
            modalVisible: true
          });
        }
      } else {
        alert(responseJson.message);
        this.setState({ loader: false });
      }
    });
  }

  async saveCustomerReviewForOrder() {
    const { result, method_name, review, driver_id, order_id } = this.state;
    if (!result) {
      let customer_id = await AsyncStorage.getItem('userid');

      var Ratting = {
        customer_id: customer_id,
        driver_id: driver_id,
        order_id: order_id,
        review: this.state.review,
        comment: this.state.method_name,
      }
      let Token = await AsyncStorage.getItem('token');
      Token = 'Bearer ' + Token;
      this.setState({ loader: true });
      var response = saveCustomerReviewForOrderAction(Ratting, Token).then(function (responseJson) {
        //  console.log(responseJson);
        if (responseJson.isError == false) {
          this.setState({

            modalVisible: false,
            loader: false,
          });
          // this.refs.defaultToastBottomWithDifferentColor.ShowToastFunction(responseJson.message);
          this.dropdown.alertWithType('success', t('success'), responseJson.message);

        } else {
          this.setState({ loader: false });
          // this.refs.defaultToastBottomWithDifferentColor.ShowToastFunction(responseJson.message);
          this.dropdown.alertWithType('error', 'Error', responseJson.message);
          // console.log(responseJson.message);
        }
      }.bind(this));
    }
  }

  // async cancelOrder() {
  //   const { result, method_name, review, driver_id, order_id, modalCancel } = this.state;
  //   if (!result) {
  //     let customer_id = await AsyncStorage.getItem('userid');
  //     let Token = await AsyncStorage.getItem('token');
  //     Token = 'Bearer ' + Token;
  //     var cancel = {
  //       customer_id: customer_id,
  //       order_id: order_id,
  //     }
  //     this.setModalCancel(!modalCancel);
  //     this.setState({ loader: true });
  //     var response = customerOrderCancelAction(cancel, Token).then(function (responseJson) {

  //       if (responseJson.isError == false) {
  //         this.setState({ loader: false });
  //         this.refs.defaultToastBottomWithDifferentColor.ShowToastFunction(responseJson.message);

  //       } else {
  //         this.setState({ loader: false });
  //         this.refs.defaultToastBottomWithDifferentColor.ShowToastFunction(responseJson.message);

  //       }
  //     }.bind(this));
  //   }
  // }

  /** To call directly from app */
  dialCall = (number) => {
    let phoneNumber = "";
    if (Platform.OS === "android") {
      phoneNumber = `tel:${number}`;
    } else {
      phoneNumber = `telprompt:${number}`;
    }
    Linking.openURL(phoneNumber);
  };


  setModalVisible = (visible) => {

    this.setState({ modalVisible: visible });
  }
  setModalCancel = (visible) => {

    this.setState({ modalCancel: visible });
  }
  setModalSupport = (visible) => {

    this.setState({ modalSupport: visible });
  }
  setModalCall = (visible) => {

    this.setState({ modalCall: visible });
  }
  onRefresh() {
    this.setState({ loader: true, dataSource: [] });
    this.getOrderDetail();
  }

  _onBlurr = () => {
    BackHandler.removeEventListener('hardwareBackPress',
      this._handleBackButtonClick);
  }

  _onFocus = () => {
    BackHandler.addEventListener('hardwareBackPress',
      this._handleBackButtonClick);
  }

  _handleBackButtonClick = () => this.props.navigation.navigate('OrderList')

  render() {
    const { modalVisible, modalCancel, modalSupport, modalCall } = this.state;
    const order_id = this.props.navigation.getParam("order_id");
    const driver_id = this.props.navigation.getParam("driver_id");
    const admin_id = this.props.navigation.getParam("admin_id");
    const { navigate } = this.props.navigation;
    const { loader, dataSource, payment_method, paymentData } = this.state;
    let total = dataSource.total - dataSource.fund;

    // star ratting
    let React_Native_Rating_Bar = [];
    let React_Native_Get_Rating_Bar = [];
    //Array to hold the filled or empty Stars
    for (var i = 1; i <= 5; i++) {
      React_Native_Rating_Bar.push(
        <TouchableOpacity style={{ alignItems: 'center' }}
          activeOpacity={1.7}
          key={i}
          onPress={this.UpdateRating.bind(this, i)}>
          <Image
            style={styles.StarImage}
            source={(
              // i <= dataSource.handyman_rating
              i <= this.state.review
                ? (require('../../images/Star-Yellow.png'))
                : (require('../../images/Star-Grey.png'))
            )}
          />
        </TouchableOpacity>
      );
    }

    // Get star rating
    for (var i = 1; i <= 5; i++) {
      React_Native_Get_Rating_Bar.push(
        // <TouchableOpacity style={{alignItems:'center'}}
        //   activeOpacity={1.7}
        //   key={i}
        //   onPress={this.UpdateRating.bind(this, i)}>
        <Image
          style={styles.StarImage}
          source={(
            i <= dataSource.driver_rating
              // i <= this.state.review
              ? (require('../../images/Star-Yellow.png'))
              : (require('../../images/Star-Grey.png'))
          )}
        />
        // </TouchableOpacity>
      );
    }

    if (!loader) {
      return (
        <View style={styles.container}>
          <NavigationEvents
            onWillFocus={this._onFocus}
            onWillBlur={this._onBlurr}
          />
          <ScrollView refreshControl={
            <RefreshControl colors={["#d62326"]} refreshing={this.state.loader} onRefresh={this.onRefresh.bind(this)} />
          }>
            <Row style={styles.Navebar}>
              <TouchableOpacity onPress={() => navigate('OrderList')} style={{ width: '50%' }}>
                <Col style={{ paddingLeft: 40 }}>
                  <Image source={require('../../images/Back-Arrow.png')} style={styles.BackArrow} />
                </Col>
              </TouchableOpacity>
              <TouchableOpacity onPress={this.toggleDrawer.bind(this)} style={{ width: '50%' }}>
                <Col style={{ alignItems: 'flex-end', paddingRight: 40, }}>
                  <Image source={require('../../images/Menu.png')} style={styles.Menu} />
                </Col>
              </TouchableOpacity>
            </Row>
            <Row style={styles.trackingStatusImageRow}>
              <Col>
                {dataSource.status == "Cancelled" ? (
                  <View>
                    <Image
                      source={require("../../images/Location-A-White.png")}
                      style={styles.trackingStatusImage}
                    />
                    <Col style={styles.imageBoderGrey}></Col>
                  </View>
                ) : (
                    <View>
                      <Image
                        source={require("../../images/Location-A.png")}
                        style={styles.trackingStatusImage}
                      />
                      <Col style={styles.imageBoderRed}></Col>
                    </View>
                  )}
                <Text style={styles.imageBelowText}>{t("Origin")}</Text>
              </Col>
              <Col>
                {dataSource.status == "New" ||
                  dataSource.status == "Cancelled" ? (
                    <View>
                      <Image
                        source={require("../../images/Bike-White.png")}
                        style={styles.trackingStatusImage}
                      />
                      <Col style={styles.imageBoderGrey}></Col>
                    </View>
                  ) : (
                    <View>
                      <Image
                        source={require("../../images/Bike.png")}
                        style={styles.trackingStatusImage}
                      />
                      <Col style={styles.imageBoderRed}></Col>
                    </View>
                  )}

                <Text style={styles.imageBelowText}>{t("Orders")}</Text>
              </Col>
              <Col>
                {/* <Image
                  source={require("../../images/Location-B-White.png")}
                  style={styles.trackingStatusImage}
                />
                <Col style={styles.imageBoderRed}></Col> */}

                {dataSource.status == "New" ||
                  dataSource.status == "Ordered" ||
                  dataSource.status == "Cancelled" ? (
                    <View>
                      <Image
                        source={require("../../images/Location-B-White.png")}
                        style={styles.trackingStatusImage}
                      />
                      <Col style={styles.imageBoderGrey}></Col>
                    </View>
                  ) : (
                    <View>
                      <Image
                        source={require("../../images/Location-B.png")}
                        style={styles.trackingStatusImage}
                      />
                      <Col style={styles.imageBoderRed}></Col>
                    </View>
                  )}

                <Text style={styles.imageBelowText}>{t("Destination")}</Text>
              </Col>
              <Col>

                {dataSource.status == "New" ||
                  dataSource.status == "Ordered" ||
                  dataSource.status == "Cancelled" ||
                  dataSource.status == "Destination" ? (
                    <View>
                      <Image
                        source={require("../../images/Flag-White.png")}
                        style={styles.trackingStatusImage}
                      />
                      <Col style={styles.imageBoderGrey}></Col>
                    </View>
                  ) : (
                    <View>
                      <Image
                        source={require("../../images/Flag.png")}
                        style={styles.trackingStatusImage}
                      />
                      <Col style={styles.imageBoderRed}></Col>
                    </View>
                  )}
                <Text style={styles.imageBelowText}>{t("Delivery")}</Text>
              </Col>
            </Row>



            <Row style={styles.mapRow}>



              <Col style={{ width: 90 }}>
                <Image source={require('../../images/Scooter-New.png')} style={styles.ScooterNew} />
                {/* <TouchableOpacity
                  onPress={() =>
                    navigate("OrderTracking",
                      {
                        order_id: dataSource.id,
                        originLat: parseFloat(dataSource.from_latitude),
                        originLong: parseFloat(dataSource.from_longitude),
                        destinationLat: parseFloat(
                          dataSource.destination_latitude
                        ),
                        destinationLong: parseFloat(
                          dataSource.destination_longitude
                        ),
                      }
                    )
                  }
                >
                  <Image
                    style={styles.mapRouteImg}
                    source={require("../../images/Ruta.png")}
                  />
                </TouchableOpacity> */}
              </Col>
              <Col style={{ marginTop: 10 }}>
                <Row>
                  <Text style={styles.orderNumber}>
                    {t("Shipping No")}. {dataSource.order_no}
                  </Text>

                </Row>
                <Row>
                  {/* <Col> */}
                  <Text style={styles.mapRouteText}>
                    @{dataSource.driver_name}
                  </Text>
                  <Text style={styles.DriverAssignText}>
                    {t("Is your designated driver")}
                  </Text>
                  {/* </Col> */}
                </Row>
              </Col>
            </Row>

            <Row style={styles.addressARow}>
              <Col style={{ width: 90, alignItems: 'center' }}>
                <Image
                  style={styles.mapRouteImg}
                  source={require("../../images/Location-A.png")}
                />
              </Col>
              <Col style={{ marginTop: 10, marginRight: "2%" }}>
                <Text style={styles.addressText}>
                  {dataSource.from_address_text}
                </Text>
              </Col>
            </Row>

            <Row style={styles.addressBRow}>
              <Col style={{ width: 90, alignItems: 'center' }}>
                <Image
                  style={styles.mapRouteImg}
                  source={require("../../images/Location-B.png")}
                />
              </Col>
              <Col style={{ marginTop: 10, marginRight: "2%" }}>
                <Text style={styles.addressText}>
                  {dataSource.destination_address_text}
                </Text>
              </Col>
            </Row>
            {dataSource.cpoint_address_text == null ? (
              <View>

              </View>
            ) : (
                <View>
                  <Row style={styles.addressBRow}>
                    <Col style={{ width: 90, alignItems: 'center' }}>
                      <Image
                        style={styles.mapRouteImg}
                        source={require("../../images/Location-C.png")}
                      />
                    </Col>
                    <Col style={{ marginTop: 10, marginRight: "2%" }}>
                      <Text style={styles.addressText}>
                        {dataSource.cpoint_address_text}
                      </Text>
                    </Col>
                  </Row>
                </View>
              )}


            <Row >
              {dataSource.fund > 0 ? (
                <View style={{ borderBottomColor: "#67696b", width: '95%', marginLeft: 10, marginRight: 10 }}>
                  <Row style={{ marginLeft: 10, marginRight: 10 }}>
                    <Col style={{ marginTop: 10 }}>
                      <Text style={styles.addressText}>{t("Shipping Cost")}</Text>
                    </Col>
                    <Col style={{ marginTop: 10, width: "8%" }}>
                      <Text style={styles.addressText}>B/.</Text>
                    </Col>
                    {/* <Col style={{marginTop: 10,marginRight: 5}}> */}

                    <Text style={styles.shippingCost}>
                      {total.toFixed(2)}
                    </Text>
                    {/* </Col> */}
                  </Row>
                </View>
              ) : (
                  <View>

                  </View>
                )
              }
            </Row>

            <Row >
              {dataSource.fund > 0 ? (
                <View style={{ borderBottomColor: "#67696b", width: '95%', marginLeft: 10, marginRight: 10 }}>
                  <Row style={{ marginLeft: 10, marginRight: 10 }}>
                    <Col>
                      <Text style={styles.addressText}>{t("Order Amount")}</Text>
                    </Col>
                    <Col style={{ width: "8%", }}>
                      <Text style={styles.addressText}>B/.</Text>
                    </Col>
                    {/* <Col style={{ marginRight: 5}}> */}
                    <Text style={styles.addressText}>
                      {dataSource.fund}
                    </Text>
                    {/* </Col> */}
                  </Row>
                </View>
              ) : (
                  <View>

                  </View>
                )
              }
            </Row>
            <Col style={{ borderTopWidth: 1, marginLeft: 10, marginRight: 10, paddingTop: 5, marginTop: 5 }} >

              <Row style={{ marginLeft: 10, marginRight: 10 }}>
                <Col>
                  <Text style={styles.AmountTitle}>{t("Cost of delivery")}</Text>
                </Col>
                <Text style={styles.AmountTitle}>
                  {dataSource.cost}
                </Text>
                {/* </Col> */}
              </Row>
              <Row style={{ marginLeft: 10, marginRight: 10 }}>
                <Col>
                  <Text style={styles.AmountTitle}>{t("Taxes")}</Text>
                </Col>
                {/* <Col style={{ width: "8%", }}>
                  <Text style={styles.AmountTitle}>B/.</Text>
                </Col> */}
                {/* <Col style={{ marginRight: 5, marginTop: 10, alignItems:'flex-end', backgroundColor:'red'}}> */}
                <Text style={styles.AmountTitle}>
                  {dataSource.currency_symbol} {dataSource.tax}
                </Text>
                {/* </Col> */}
              </Row>
              <Row style={{ margin: 10 }}>
                <Col>
                  <Text style={styles.Total}>{t("Total to pay")}</Text>
                </Col>
                {/* <Col style={{ width: "8%", }}>
                  <Text style={styles.Total}>B/.</Text>
                </Col> */}
                {/* <Col style={{ marginRight: 5, marginTop: 10, alignItems:'flex-end', backgroundColor:'red'}}> */}
                <Text style={styles.Total}>
                  {dataSource.currency_symbol} {dataSource.total}
                </Text>
                {/* </Col> */}
              </Row>
              {payment_method == "cash" ? (
                <View>
                  <Row style={{ margin: 10 }}>
                    <Row>
                      <Text style={styles.CashAmountText}>{t("Cash payment")}: </Text>
                      <Text style={styles.CashAmountText}>{dataSource.currency_symbol} {paymentData.user_given_cash}</Text>
                    </Row>
                    <Row>
                      <Text style={styles.CashAmountText}>{t("Change")}: </Text>
                      <Text style={styles.CashAmountText}>{dataSource.currency_symbol} {paymentData.change_amount}</Text>
                    </Row>
                  </Row>
                </View>
              ) : (
                  <View>

                  </View>
                )
              }
            </Col>

            <Row style={styles.bottomActionBarRow}>
              <Col>
                <TouchableOpacity style={{ alignItems: 'center' }}
                  onPress={() =>
                    navigate("OrderTracking",
                      {
                        order_id: dataSource.id,
                        originLat: parseFloat(dataSource.from_latitude),
                        originLong: parseFloat(dataSource.from_longitude),
                        destinationLat: parseFloat(
                          dataSource.destination_latitude
                        ),
                        destinationLong: parseFloat(
                          dataSource.destination_longitude
                        ),
                      }
                    )
                  }
                >
                  <Image
                    style={styles.bottomActionBarRowImages}
                    source={require("../../images/New-map.png")}
                  />
                  <Text style={styles.bottomActionBarRowText}>{t('See Route')}</Text>
                </TouchableOpacity>
                {/* <TouchableOpacity style={{ alignItems: 'center' }}
                  onPress={() => {
                    this.setState({ loading: true });
                    if (dataSource.status == "Completed") {
                      this.setState({ loading: false });
                      this.refs.defaultToastBottomWithDifferentColor.ShowToastFunction("This order is already completed");
                    }
                    else if (dataSource.status == "Cancelled") {
                      this.setState({ loading: false });
                      this.refs.defaultToastBottomWithDifferentColor.ShowToastFunction("This order is already cancelled");
                    } else {
                      this.setModalCancel(true);
                    }
                  }}
                >
                  <Image
                    style={styles.bottomActionBarRowImages}
                    source={require("../../images/Cancle.png")}
                  />


                  <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalCancel}
                    onRequestClose={() => {
                    }}
                  >

                    <View style={styles.ModalCenteredView}>
                      <View style={styles.CModalView}>
                        <ScrollView showsVerticalScrollIndicator={false}>
                          <Row style={styles.CancelNavebar2}>
                            <Col style={{ width: '10%' }}></Col>
                            <Col style={{ alignItems: 'center' }}>
                              <Image source={require('../../images/Cancle.png')} style={styles.ModalLogo} />
                            </Col>
                            <Col style={{ alignItems: 'flex-end', width: '10%', marginRight: 10 }}>
                              <TouchableOpacity onPress={() => { this.setModalCancel(!modalCancel); }} >
                                <Image source={require('../../images/Close.png')} style={styles.Close} />
                              </TouchableOpacity>
                            </Col>
                          </Row>
                          <Row style={styles.ModalTextRow}>
                            <Text style={styles.ModalPopupTextName}>{t("Do you want to cancel the order?")}</Text>
                          </Row>

                          <Col style={styles.ModalNotes}>
                            <Text style={styles.ModalParagraph}>{t("Cnote1")}</Text>
                          </Col>
                          <Col style={styles.ModalNotes}>
                            <Text style={styles.ModalParagraph}>{t("Cnote2")}</Text>
                          </Col>
                          <Row style={styles.ModalPlaceOrder_Row}>
                            <TouchableOpacity style={styles.PlaceOrder_Button} onPress={() => { this.cancelOrder(this); }} >
                              <Text style={styles.PlaceOrder_Text}>{t('CANCEL')}</Text>
                            </TouchableOpacity>
                          </Row>
                        </ScrollView>
                      </View>

                    </View>

                  </Modal>
                  <Text style={styles.bottomActionBarRowText}>
                    {t("CANCEL")}
                  </Text>
                </TouchableOpacity> */}
              </Col>

              <Col>
                <TouchableOpacity style={{ alignItems: 'center' }}
                  onPress={() => {
                    // this.dialCall(dataSource.customer_mobile);
                    this.setModalCall(true);
                  }}
                >
                  <Image
                    style={styles.bottomActionBarRowImages}
                    source={require("../../images/New-Call.png")}
                  />

                  <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalCall}
                    onRequestClose={() => {
                      // navigate('LocationScreen')
                    }}
                  >

                    <View style={styles.ModalCenteredView}>
                      <View style={styles.ModalView}>
                        <ScrollView showsVerticalScrollIndicator={false}>
                          <Row style={{ marginRight: "5%", marginLeft: "10%" }}>
                            <Col>
                              <Text style={styles.popupText}>{t("You can contact your driver whenever you like!")}</Text>
                            </Col>
                            <Col style={{ width: 15 }}>
                              <TouchableOpacity onPress={() => { this.setModalCall(!modalCall); }}>
                                <Text style={styles.popupCrossTextIcon}>X</Text>
                              </TouchableOpacity>
                            </Col>
                          </Row>

                          <Row style={{ marginTop: 15, marginBottom: 15 }}>

                            <Col style={styles.CallMOdalIcon}>
                              <TouchableOpacity onPress={() => { this.DriverChat(modalCall, navigate) }}>
                                <Image
                                  style={styles.ModalIcon}
                                  source={require("../../images/New-Messages.png")}
                                />
                                <Text style={styles.bottomActionBarRowText}>{t('Open Chat')}</Text>
                              </TouchableOpacity>
                            </Col>
                            <Col style={styles.CallMOdalIcon} >
                              <TouchableOpacity onPress={() => { this.dialCall(dataSource.driver_mobile); }}>
                                <Image
                                  style={styles.ModalIcon}
                                  source={require("../../images/New-Call.png")}
                                />
                                <Text style={styles.bottomActionBarRowText}>{t('To call')}</Text>
                              </TouchableOpacity>
                            </Col>
                          </Row>
                          {/* <Row style={styles.ModalPlaceOrder_Row}>
                            <TouchableOpacity style={styles.PlaceOrder_Button} onPress={() => { this.setModalCall(!modalCall); }} >
                              <Text style={styles.PlaceOrder_Text}>{t('CANCEL')}</Text>
                            </TouchableOpacity>
                          </Row> */}
                        </ScrollView>
                      </View>

                    </View>

                  </Modal>

                  <Text style={styles.bottomActionBarRowText}>{t("Driver")}</Text>
                </TouchableOpacity>
              </Col>

              <Col>
                <TouchableOpacity style={{ alignItems: 'center' }}
                  onPress={() => {
                    this.setModalSupport(true);
                  }}
                >
                  <Image
                    style={styles.bottomActionBarRowImages}
                    source={require("../../images/New-support.png")}
                  />
                  {/* support modal */}

                  <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalSupport}
                    onRequestClose={() => {
                      // navigate('LocationScreen')
                    }}
                  >

                    <View style={styles.ModalCenteredView}>
                      <View style={styles.SModalView}>
                        <ScrollView showsVerticalScrollIndicator={false}>
                          <Col style={{ alignItems: 'center' }}>
                            <Image source={require('../../images/Support.png')} style={styles.ModalLogo} />
                          </Col>
                          <Row style={styles.ModalTextRow}>
                            <Text style={styles.SpopupTextName}>{t("Welcome to Support")}</Text>
                          </Row>
                          <Col style={{ alignItems: 'center' }}>
                            <Image
                              style={styles.Profile}
                              source={require("../../images/Profile-Pic2.png")}
                            // source={require("dataSource.profile")}

                            />
                            <Row>
                              {/* {React_Native_Rating_Bar} */}
                              {React_Native_Get_Rating_Bar}
                            </Row>
                          </Col>
                          <Row style={styles.ModalNotes}>
                            <Text style={styles.ModalParagraph}>
                              <Text style={{ fontFamily: "Inter-Black", }}>@{dataSource.driver_name}</Text> {t("For operational reason we serve in the Panama area we will be in the interior soon, thank you very much for your understanding")}
                            </Text>
                          </Row>
                          <Row style={{ marginTop: 10 }}>
                            <Col style={styles.MOdalIconCol} >
                              <TouchableOpacity onPress={() => { this.dialCall(dataSource.driver_mobile); }}>
                                <Image
                                  style={styles.ModalIcon}
                                  source={require("../../images/New-Call.png")}
                                />
                              </TouchableOpacity>
                            </Col>
                            <Col style={styles.MOdalIconCol}>
                              <TouchableOpacity onPress={() => { this.SupportChat(modalSupport, navigate) }}>
                                <Image
                                  style={styles.ModalIcon}
                                  source={require("../../images/New-Messages.png")}
                                />
                              </TouchableOpacity>
                            </Col>
                          </Row>
                          <Row style={styles.ModalPlaceOrder_Row}>
                            <TouchableOpacity style={styles.PlaceOrder_Button} onPress={() => { this.setModalSupport(!modalSupport); }} >
                              <Text style={styles.PlaceOrder_Text}>{t('CANCEL')}</Text>
                            </TouchableOpacity>
                          </Row>
                        </ScrollView>
                      </View>

                    </View>

                  </Modal>

                  {/* rating modal */}
                  <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalVisible}
                    onRequestClose={() => {
                      // navigate('LocationScreen')
                    }}
                  >

                    <View style={styles.centeredView}>
                      <View style={styles.modalView}>
                        {/* <Text style={styles.modalText}>Hello World!</Text> */}
                        <Row style={styles.Navebar2}>
                          <Col>
                            <Image source={require('../../images/R-Logo.png')} style={styles.RLogo} />
                          </Col>
                          <Col style={{ alignItems: 'center' }}>
                            <Image source={require('../../images/Profile-Pic2.png')} style={styles.RLogo} />
                          </Col>
                          <Col style={{ alignItems: 'flex-end', marginRight: 10, marginTop: 40 }}>
                            <TouchableOpacity onPress={() => { this.setModalVisible(!modalVisible); }} >
                              <Image source={require('../../images/Close.png')} style={styles.Close} />
                            </TouchableOpacity>
                          </Col>
                        </Row>
                        <ScrollView showsVerticalScrollIndicator={false}>
                          {/* <Row style={styles.Title}> */}
                          <Row >

                            <Col style={{ alignItems: 'center' }}>
                              <Text style={styles.popupTextName}>{t('How about the service?')}</Text>
                            </Col>

                          </Row>
                          <Row style={{ justifyContent: 'center', alignItems: 'center', marginTop: 10 }}>
                            {React_Native_Rating_Bar}
                          </Row>

                          <Row style={{ marginTop: 10, width: '100%' }}>
                            {/* <Col style={{width:'10%'}}></Col> */}
                            <Col style={{ alignItems: 'center' }}>
                              <Text style={styles.popupTextName}>{t('Your opinion helps us get better')}</Text>
                            </Col>
                            {/* <Col style={{width:'10%'}}></Col> */}

                          </Row>
                          <TextInput style={styles.TextBox}
                            multiline={true}
                            numberOfLines={4}
                            onChangeText={(method_name) => this.setState({ method_name })}>
                          </TextInput>

                          <Row style={styles.PlaceOrder_Row}>
                            <TouchableOpacity style={styles.PlaceOrder_Button} onPress={this.saveCustomerReviewForOrder.bind(this)} >
                              <Text style={styles.PlaceOrder_Text}>{t('TO ACCEPT')}</Text>
                            </TouchableOpacity>
                          </Row>
                        </ScrollView>
                      </View>

                    </View>

                  </Modal>

                  <Text style={styles.bottomActionBarRowText}>
                    {t("Support")}
                  </Text>
                </TouchableOpacity>
              </Col>
            </Row>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  Navebar: {
    ...Platform.select({
      ios: {
        height: 40,
        marginTop: "12%",
      },
      android: {
        height: 40,
      },
    }),
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
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
        marginTop: 10,
      }
    })

  },
  trackingStatusImageRow: {
    // flexDirection: "row",
    marginLeft: 20,
    marginRight: 20,
  },
  trackingStatusImage: {
    ...Platform.select({
      ios: {
        height: 60,
        width: 60,
        marginTop: 10,
        marginLeft: 10,
        marginRight: 10,
      },
      android: {
        height: 60,
        width: 60,
        marginTop: 10,
        // marginLeft: "19%",
        marginLeft: 10,

      },
    }),
  },
  imageBoderRed: {
    ...Platform.select({
      ios: {
        borderBottomColor: "red",
        borderBottomWidth: 5,
        marginTop: 15,
      },
      android: {
        borderBottomColor: "red",
        borderBottomWidth: 5,
        marginTop: 15,
      },
    }),
  },
  orderNumber: {
    fontSize: 23,
    color: "#e02127",
    fontFamily: "Inter-Black"
  },
  imageBoderGrey: {
    ...Platform.select({
      ios: {
        borderBottomColor: "#bbb",
        borderBottomWidth: 5,
        marginTop: 15,
      },
      android: {
        borderBottomColor: "#bbb",
        borderBottomWidth: 5,
        marginTop: 15,
      },
    }),
  },
  imageBelowText: {
    // width: '100%',
    textAlign: "center",
    color: "#000",
    // fontWeight: "bold",
    fontSize: 15,
    // marginLeft: 3,
    // marginRight: 5,
    // marginTop: 5,
    // height: 30,
    fontFamily: "Inter-Black"
  },
  extraCostRow: {
    height: 20,
    width: width - 50,
    marginBottom: 40,
  },
  extraCostText: {
    fontSize: 15,
    color: "#000",
    width: 140,
    height: 50,
    marginLeft: 15,
    marginTop: 5,
  },
  TextInput: {
    ...Platform.select({
      ios: {
        justifyContent: "center",
        borderStyle: "dashed",
        borderRadius: 40,
        borderTopLeftRadius: 40,
        borderTopRightRadius: 40,
        borderWidth: 2,
        borderColor: "grey",
        backgroundColor: "lightgrey",
        color: "#000",
        height: 55,
        paddingLeft: 20,
        paddingRight: 50,
        width: 120,
      },
      android: {
        justifyContent: "center",
        borderStyle: "dashed",
        borderRadius: 40,
        borderTopLeftRadius: 40,
        borderTopRightRadius: 40,
        borderWidth: 2,
        borderColor: "grey",
        backgroundColor: "lightgrey",
        color: "#000",
        height: 55,
        paddingLeft: 20,
        paddingRight: 50,
        width: 120,
      },
    }),
  },
  editFundView: {
    backgroundColor: "#ccc",
    padding: 9,
    marginLeft: -40,
    width: 60,
    borderTopLeftRadius: 40,
    borderBottomLeftRadius: 40,
    borderWidth: 1,
    borderRightWidth: 2,
    borderColor: "#0f4471",
    height: 55,
  },
  fundShowIcon: {
    backgroundColor: "#ccc",
    padding: 9,
    height: 55,
    borderTopRightRadius: 40,
    borderBottomRightRadius: 40,
    borderWidth: 1,
    borderRightWidth: 5,
    borderColor: "#0f4471",
    width: 60,
  },
  fundShowIconRotate: {
    backgroundColor: "#ccc",
    padding: 9,
    marginLeft: width - 80,
    width: 60,
    borderTopRightRadius: 40,
    borderBottomRightRadius: 40,
    borderWidth: 1,
    borderColor: "#0f4471",
    transform: [{ rotate: "180deg" }],
  },
  mapRouteImg: {
    height: 50,
    width: 50,
    margin: 10,
  },
  ScooterNew: {
    height: 60,
    width: 60,
    margin: 10,
  },

  mapRow: {
    borderBottomColor: "#67696b",
    // borderBottomWidth: 1,
    marginLeft: 10,
    marginRight: 10,
  },
  mapRouteText: {
    color: "#1f76b9",
    fontSize: 15,
    fontFamily: "Inter-Black"
  },
  DriverAssignText: {
    fontSize: 15,
    fontFamily: "Inter-Black",
    marginLeft: 5
  },
  addressARow: {
    marginLeft: 10,
    marginRight: 10,
  },
  addressBRow: {
    marginLeft: 10,
    marginRight: 10,
  },
  addressText: {
    fontSize: 18,
    fontFamily: "Inter-Black",
    color: "#000",
  },
  shippingCost: {
    marginTop: 10,
    fontSize: 18,
    fontWeight: "bold",
    fontStyle: "italic",
    color: "#000",
  },

  AmountTitle: {
    // marginTop: 10,
    fontSize: 18,
    fontFamily: "Inter-Black",
    // color: "#2276b9",
  },

  Total: {
    marginTop: 10,
    fontSize: 18,
    fontFamily: "Inter-Black",
    color: "#2276b9",
  },
  popupText: {
    marginTop: 10,
    fontSize: 18,
    fontFamily: "Inter-Black",
    color: "#2276b9",
    textAlign: 'center',
  },
  popupCrossTextIcon: {
    // marginTop: 10,
    fontSize: 25,
    fontWeight: "bold",
    // fontStyle: "italic",
    color: "#b3b3b3",
    // textAlign: 'center',
  },
  bottomActionBarRow: {
    marginTop: 10,
    marginBottom: 20,
  },
  bottomActionBarRowFirstCol: {
    backgroundColor: "#e02127",
    height: 60,
    marginLeft: 10,
    borderTopLeftRadius: 40,
    borderBottomLeftRadius: 40,
  },
  bottomActionBarRowImages: {
    height: 60,
    width: 60,
    // position: 'absolute',
    // marginLeft: 30,
    // marginTop: -25,
  },
  bottomActionBarRowText: {
    marginTop: 2,
    fontSize: 16,
    textAlign: "center",
    fontFamily: "Inter-Black",
  },
  bottomActionBarRowSecondCol: {
    backgroundColor: "#e02127",
    height: 60,
    borderLeftColor: "#0f4471",
    borderLeftWidth: 2,
  },
  bottomActionBarRowThirdCol: {
    backgroundColor: "#e02127",
    height: 60,
    borderLeftColor: "#0f4471",
    borderLeftWidth: 2,
    marginRight: 10,
    borderTopRightRadius: 40,
    borderBottomRightRadius: 40,
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

  centeredView: {
    shadowColor: "#232324",
    shadowOffset: { width: 0, height: 1, },
    shadowOpacity: 0.5,
    shadowRadius: 1.22,
    elevation: 500,
    height: Dimensions.get('window').height,
    backgroundColor: "rgba(100,100,100, 0.8)",
  },
  modalView: {
    // flexDirection: 'column',
    borderRadius: 20,
    justifyContent: "center",
    top: '25%',
    // marginBottom: '15%',
    marginLeft: 20,
    marginRight: 20,
    backgroundColor: "white",
    paddingLeft: 5,
    paddingRight: 5,
    // alignItems: "center",
    // width: Dimensions.get('window').width,
    // height: Dimensions.get('window').height/2,
    shadowColor: "#232324",
    // height: '60%',
    shadowOffset: {
      width: 0,
      // height: 20,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5
  },

  RLogo: {
    width: 80,
    height: 80,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 5,
    marginTop: "5%",
  },
  Close: {
    width: 30,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 20,
    marginTop: 10,
  },
  popupTextName: {
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "Inter-Black",
  },
  starLogo: {
    width: 35,
    height: 35,
    justifyContent: "center",
    alignItems: "center",

  },
  Navebar2: {
    ...Platform.select({
      ios: {
        height: '15%',
        bottom: '15%',
      },
      android: {

        // flex:1,
        height: '18%',
        bottom: '15%',
        // marginTop:15,
        // paddingBottom: 50, 

      }
    })

  },
  CancelNavebar2: {
    ...Platform.select({
      ios: {
        height: '15%',
        bottom: '15%',

      },
      android: {

        // flex:1,
        height: '15%',
        // bottom:'15%',
        // marginTop:15,
        // paddingBottom: 50, 

      }
    })

  },
  Title: {
    ...Platform.select({
      ios: {
        // top: 5,
        // width: '100%',
        // height: '10%',
      },
      android: {
        // top: 10,
        width: '100%',
        height: 20
      }
    })
  },
  TextBox: {
    ...Platform.select({
      ios: {
        paddingLeft: 10,
        paddingRight: 10,
        borderStyle: "dashed",
        borderRadius: 1,
        borderWidth: 2,
        height: '30%',
        borderColor: "grey",
        backgroundColor: "#eae8e8",
        marginLeft: 10,
        marginRight: 10,
        marginTop: 10
      },
      android: {
        paddingLeft: 10,
        paddingRight: 10,
        borderStyle: "dashed",
        borderRadius: 1,
        borderWidth: 2,
        height: '30%',
        borderColor: "grey",
        backgroundColor: "#eae8e8",
        marginLeft: 10,
        marginRight: 10,
        marginTop: 10
      }
    })
  },
  PlaceOrder_Row: {
    marginTop: 10,
    justifyContent: 'center',
  },
  PlaceOrder_Button: {
    // marginTop: 15,
    alignItems: 'center',
    justifyContent: 'center',
    width: "80%",
    height: 60,
    // marginBottom: 10,
    borderRadius: 40,
    backgroundColor: '#e02127',
    color: '#fff',


  },
  PlaceOrder_Text: {
    color: '#fff',
    fontFamily: "Inter-Black",
    fontSize: 20,
  },


  // star ratting
  childView: {
    justifyContent: 'center',
    flexDirection: 'row',
    marginTop: 30,
  },
  button: {
    justifyContent: 'center',
    flexDirection: 'row',
    marginTop: 30,
    padding: 15,
    backgroundColor: '#8ad24e',
  },
  StarImage: {
    width: 40,
    height: 40,
    resizeMode: 'cover',
    marginRight: 5
  },



  // Cancel order modal

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
        height: Dimensions.get('window').height,
        backgroundColor: "rgba(100,100,100, 0.8)",
      }
    })

  },
  ModalView: {
    ...Platform.select({
      ios: {
        borderRadius: 20,
        top: '25%',
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
        borderRadius: 20,
        top: '20%',
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
      }
    })

  },
  CModalView: {
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
        borderRadius: 20,
        top: '20%',
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
        borderRadius: 20,
        top: '15%',
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
      }
    })

  },
  ModalLogo: {
    width: 50,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  ModalTextRow: {
    marginTop: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  ModalNotes: {
    marginTop: 30,
    marginLeft: 10,
    marginRight: 10,

  },
  ModalParagraph: {
    fontSize: 15,
    fontFamily: "Inter-Black",

  },
  ModalPlaceOrder_Row: {
    marginTop: 30,
    justifyContent: 'center',
    marginBottom: 30,
  },
  ModalPopupTextName: {
    fontWeight: 'bold',
    justifyContent: "center",
    fontSize: 20,
    textAlign: 'center',
  },
  SpopupTextName: {
    fontFamily: "Inter-Black",
    justifyContent: "center",
    fontSize: 20,
    textAlign: 'center',
    width: '80%',
  },
  Profile: {
    height: 50,
    width: 50,
    marginTop: 10,
  },
  MOdalIconCol: {

    marginLeft: 10,
    width: '20%'
  },
  CallMOdalIcon: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  ModalIcon: {
    height: 70,
    width: 70,
    // position: 'absolute',
    // marginLeft: 30,
  },
  ModalDriverName: {
    color: "#1c62a1",
    fontSize: 20,
    fontWeight: 'bold',
  },

  CashAmountText: {
    fontFamily: "Inter-Black",
    color: "#999999",
  }
});
