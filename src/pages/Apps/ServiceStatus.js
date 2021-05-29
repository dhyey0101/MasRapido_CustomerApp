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
// import RadioGroup from 'react-native-radio-button-group';
import { Col, Row } from "react-native-easy-grid";
import { t } from '../../../locals';
import { customerOrderCancelAction, getServiceCostAction, getOrderDetailAction, saveCustomerReviewForOrderAction } from '../Util/Action.js';
import normalize from 'react-native-normalize';
// import CustomToast from './Toast.js';
import { NavigationEvents } from 'react-navigation';
import DropdownAlert from 'react-native-dropdownalert';


const { width, height } = Dimensions.get("screen");
const SCREEN_HEIGHT = height;
export default class ServiceStatusScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      review: 1,
      Max_Rating: 5,
      loader: false,
      fundEditTexBoxStatus: 1,
      dataSource: [],
      fund: 0,
      modalVisible: false,
      modalShow: false,
      modalCancel: false,
      modalCall: false,
      method_name: '',
      driver_id: '',
      deliveryCost: '',
      serviceCostWithCurrency: '',
      serviceCost: '',
      sub_total: '',
      itbms: '',


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


  // toogle funnd textbox
  // showFundTextbox() {
  //   if (this.state.fundEditTexBoxStatus == 1) {
  //     this.setState({ fundEditTexBoxStatus: 0 });
  //   } else {
  //     this.setState({ fundEditTexBoxStatus: 1 });
  //   }
  // }

  async componentDidMount() {
    this.getOrderDetail();
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
        this.setState({
          driver_id: responseJson.result.driver_id,
          order_id: responseJson.result.id,
          dataSource: responseJson.result,
          loader: false,
        });

        if (responseJson.result.status == "Completed" && responseJson.result.review_count == 0) {

          // alert("inside");
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

  async getCost(selectedService) {
    // Get Order Cost
    let Token = await AsyncStorage.getItem("token");

    Token = "Bearer " + Token;
    const serviceData = {
      service_id: selectedService,
    };
    this.setState({ ServiceListSelected: selectedService });

    // this.setState({ loader: true });
    var response = getServiceCostAction(serviceData, Token).then(
      function (responseJson) {
        if (responseJson.isError == false) {
          this.setState({ serviceCostWithCurrency: responseJson.result.costwithcurrency, loader: false });
          this.setState({ serviceCost: responseJson.result.cost });
          this.setState({ sub_total: responseJson.result.sub_total });
          this.setState({ itbms: responseJson.result.itbms });
        } else {
          // console.log(responseJson.message);
        }
      }.bind(this)
    );
  }

  async saveCustomerReviewForOrder() {
    const { result, method_name, review, driver_id, order_id } = this.state;
    if (!result) {
      let customer_id = await AsyncStorage.getItem('userid');
      this.setState({ modalVisible: false });
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

        if (responseJson.isError == false) {
          this.setState({
            modalVisible: false,
            loader: false
            // review: responseJson.result.handyman_rating,
          })
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
  //         // console.log(responseJson.message);
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
  setModalShow = (visible) => {

    this.setState({ modalShow: visible });
  }
  setModalCancel = (visible) => {

    this.setState({ modalCancel: visible });
  }
  chat(modalCall, navigate) {
    this.setModalCall(!modalCall);
    navigate('ChatWithDriver', { driver_id: this.state.driver_id, backpage: 'serviceview' });

  }
  setModalCall = (visible) => {

    this.setState({ modalCall: visible });
  }

  // this method calls when user refresh the page
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
    const { modalVisible, modalShow, modalCancel, modalCall } = this.state;
    const order_id = this.props.navigation.getParam("order_id");
    const driver_id = this.props.navigation.getParam("driver_id");
    const { navigate } = this.props.navigation;
    const { loader,
      //  fundEditTexBoxStatus,
      dataSource,
      //  fund 
    } = this.state;

    // star ratting
    let React_Native_Rating_Bar = [];
    let React_Native_Get_Rating_Bar = [];
    // Array to hold the filled or empty Stars
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
                        <TouchableOpacity onPress={() => navigate('OrderList')} style={{ width: '50%'}}>
                        <Col style={{paddingLeft: 40}}>
                            <Image source={require('../../images/Back-Arrow.png')} style={styles.BackArrow} />
                        </Col>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={this.toggleDrawer.bind(this)} style={{ width: '50%'}}>
                        <Col style={{ marginRight: normalize(0), alignItems: 'flex-end', paddingRight: 40,}}>
                            <Image source={require('../../images/Menu.png')} style={styles.Menu} />
                        </Col>
                        </TouchableOpacity>
                    </Row>
            <Row style={styles.trackingStatusImageRow}>
              <Col>
                {dataSource.status == "Cancelled" ? (
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
                  dataSource.status == "Cancelled" ? (
                    <View>
                      <Image
                        source={require("../../images/Service-Grey.png")}
                        style={styles.trackingStatusImage}
                      />
                      <Col style={styles.imageBoderGrey}></Col>
                    </View>
                  ) : (
                    <View>
                      <Image
                        source={require("../../images/Service.png")}
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
                        source={require("../../images/Correct-grey.png")}
                        style={styles.trackingStatusImage}
                      />
                      <Col style={styles.imageBoderGrey}></Col>
                    </View>
                  ) : (
                    <View>
                      <Image
                        source={require("../../images/Correct.png")}
                        style={styles.trackingStatusImage}
                      />
                      <Col style={styles.imageBoderRed}></Col>
                    </View>
                  )}

                <Text style={styles.imageBelowText}>{t("Service")}</Text>
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

            <Row style={{ height: normalize(65), marginTop: normalize(10) }}>
              <Col style={{ width: normalize(80), justifyContent: 'center', alignItems: 'center' }}>
                <Image
                  style={styles.mapRouteImg}
                  source={require("../../images/Service.png")}
                />
              </Col>
              <Col style={{ justifyContent: 'center', alignItems: 'flex-start', paddingTop: normalize(10), }}>
                <Row>
                  <Text style={styles.orderNumber}>
                    {t("Technical citation")} # {dataSource.order_no}
                  </Text>
                </Row>
                <Row>
                  <Text style={{ fontFamily: 'Inter-Black', fontSize: 15, color: '#1987B8' }}>@{dataSource.driver_name}</Text><Text style={{ fontFamily: 'Inter-Black', fontSize: 15, }}> {t("is your assigned technician")}</Text>
                </Row>
              </Col>
            </Row>

            {/* <Row style={styles.mapRow}>
              <Col style={{ width: 90 }}>
                <TouchableOpacity
                  onPress={() =>
                    navigate("ServiceTracking",
                      {
                        order_id: dataSource.id,
                        originLat: parseFloat(dataSource.destination_latitude),
                        originLong: parseFloat(dataSource.destination_longitude),
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
                </TouchableOpacity>
              </Col>
              <Col style={{ margin: 10 }}>
                <Row style={{ height: 28 }}>
                  <Text style={styles.mapRouteText}>
                    @{dataSource.driver_name}
                  </Text>
                </Row>
                <Row>
                  <Text style={{ fontSize: 18 }}>
                    {t("is your assigned specialist")}
                  </Text>
                </Row>
              </Col>
            </Row> */}



            {/* <Row style={styles.addressBRow}>
              <Col style={{ width: 90 }}>
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
            </Row> */}

            {/* <Row style={styles.addressARow}>
              <Col style={{ width: 90 }}>
                <Image
                  style={styles.mapRouteImg}
                  source={require("../../images/Service.png")}
                />
              </Col>
              <Col style={{ marginTop: 10, marginRight: "2%" }}>
                <Row>
                  <Text style={styles.addressText}>
                    Diagnosis
                    {dataSource.service_name}
                  </Text>
                </Row>
                <Row >
                  <Text>
                    {dataSource.diagnosis}
                  </Text>
                </Row>
              </Col>
            </Row> */}

            {/* <Row >
              {dataSource.fund > 0 ? (
                <View style={{ borderBottomColor: "#67696b", width: '95%', marginLeft: 10, marginRight: 10 }}>
                  <Row>
                    <Col style={{ marginTop: 10, marginLeft: 10 }}>
                      <Text style={styles.addressText}>{t("Shipping Cost")}</Text>
                    </Col>
                    <Col style={{ marginTop: 10, marginRight: 10, alignItems: "flex-end" }}>

                      <Text style={styles.addressText}>
                        {parseFloat(dataSource.total) - parseFloat(dataSource.fund)}
                      </Text>
                    </Col>
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
                  <Row >
                    <Col style={{ marginTop: 10, marginLeft: 10 }}>
                      <Text style={styles.addressText}>{t("Order Amount")}</Text>
                    </Col>

                    <Col style={{ marginTop: 10, marginRight: 10, alignItems: "flex-end" }}>
                      <Text style={styles.addressText}>
                        {dataSource.fund}
                      </Text>
                    </Col>
                  </Row>
                </View>
              ) : (
                  <View>

                  </View>
                )
              }
            </Row> */}

            <Row style={{ marginLeft: normalize(30), marginTop: normalize(15), marginBottom: normalize(10) }}>
              <Text style={{ fontFamily: 'Inter-Black', fontSize: 15 }}>{t("Technician Diagnostics:")}</Text>
            </Row>

            <Row style={{ marginLeft: normalize(20), marginRight: normalize(20), backgroundColor: '#efefef', height: normalize(160), borderRadius: normalize(20), paddingRight: normalize(20), paddingLeft: normalize(20), paddingTop: normalize(10) }}>
              <Text style={{ fontFamily: 'Inter-Black', fontSize: 15, color: '#808080' }}>{dataSource.service_category_name} {t("was installed in the room Required The customer was satisfied")}</Text>
            </Row>
            <Row style={{ marginLeft: normalize(20), marginRight: normalize(20), backgroundColor: '#efefef', height: normalize(40), marginTop: normalize(15), borderRadius: normalize(20), }}>
              <Col style={{ width: normalize(235), justifyContent: 'center', alignItems: 'flex-start', paddingLeft: normalize(15) }}>
                <Text style={{ fontSize: 20, fontFamily: 'Inter-Black' }}>{t("Cost of the appointment")}</Text>
              </Col>
              <Col style={{ justifyContent: 'center', alignItems: 'flex-start', }}>
                <Text style={{ fontSize: 25, fontFamily: 'Inter-Black', color: '#1987B8' }}>{dataSource.totalInteger}</Text>
              </Col>
            </Row>

            <Row style={{ marginTop: normalize(25), marginLeft: normalize(20), marginRight: normalize(20), }}>
              <Text style={{ fontSize: 13, color: 'red', fontFamily: 'Inter-Black', }}>{t("Important:")}<Text style={{ fontSize: 13, fontFamily: 'Inter-Black', color: 'black' }}> {t("If you accept the full service of the according to the diagnosis, the cost of the appointment should be deducted from the quote")}</Text></Text>
            </Row>

            <Row style={{ height: normalize(120), marginTop: normalize(30), marginBottom: normalize(30) }}>
              <Col style={{ justifyContent: 'center', alignItems: 'center', }}>
                <TouchableOpacity onPress={() => {
                  // this.dialCall(dataSource.customer_mobile);
                  this.setModalCall(true);
                }}>
                  <Image
                    style={{ height: normalize(90), width: normalize(90) }}
                    source={require("../../images/Call_Service.png")}
                  />
                </TouchableOpacity>
                <Row>
                  <Text style={{ fontFamily: 'Inter-Black', fontSize: 16 }}>{t('Technical')}</Text>
                </Row>
              </Col>
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
                          <TouchableOpacity onPress={() => { this.chat(modalCall, navigate) }}>
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
              <Col style={{ justifyContent: 'center', alignItems: 'center', }}>
                <TouchableOpacity style={{ alignItems: 'center' }}
                  onPress={() => {
                    this.setModalShow(true);
                    this.setModalVisible(true);
                  }}>
                  <Image
                    style={{ height: normalize(90), width: normalize(90) }}
                    source={require("../../images/Support_Service.png")}
                  />
                </TouchableOpacity>
                <Row>
                  <Text style={{ fontFamily: 'Inter-Black', fontSize: 16 }}>{t('Support')}</Text>
                </Row>
              </Col>
            </Row>

            <Modal
              animationType="slide"
              transparent={true}
              visible={modalShow}
              onRequestClose={() => {
                navigate('LocationScreen')
              }}
            >

              <View style={styles.ScenteredView}>
                <View style={styles.SmodalView}>
                  <ScrollView showsVerticalScrollIndicator={false}>
                    <Col style={{ alignItems: 'center' }}>
                      <Image source={require('../../images/Support.png')} style={styles.SLogo} />
                    </Col>
                    <Row style={styles.STextRow}>
                      <Text style={styles.SpopupTextName}>{t("Service is out of our operational area")}</Text>
                    </Row>
                    <Row style={styles.notes}>
                      <Text style={styles.Paragraph}>{t("For operational reason we serve in the Panama area we will be in the interior soon, thank you very much for your understanding")}</Text>
                    </Row>
                    <Row style={styles.SPlaceOrder_Row}>
                      <TouchableOpacity style={styles.PlaceOrder_Button} onPress={() => { this.setModalShow(!modalShow); }} >
                        <Text style={styles.PlaceOrder_Text}>{t('CANCEL')}</Text>
                      </TouchableOpacity>
                    </Row>
                  </ScrollView>
                </View>

              </View>

            </Modal>



            {/* <Row style={styles.bottomActionBarRow}>
              <Col style={styles.bottomActionBarRowFirstCol}>
                <TouchableOpacity style={{ alignItems: 'center' }}
                  onPress={() => {
                    this.setState({ loading: true });
                    if (dataSource.status == "Completed") {
                      this.setState({ loading: false });
                      alert("This order is already completed")
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
                      navigate('LocationScreen')
                    }}
                  >

                    <View style={styles.ScenteredView}>
                      <View style={styles.SmodalView}>
                        <ScrollView showsVerticalScrollIndicator={false}>
                          <Row style={styles.CancelNavebar2}>
                            <Col style={{ width: '10%' }}></Col>
                            <Col style={{ alignItems: 'center' }}>
                              <Image source={require('../../images/Cancle.png')} style={styles.SLogo} />
                            </Col>
                            <Col style={{ alignItems: 'flex-end', width: '10%', marginRight: 10 }}>
                              <TouchableOpacity onPress={() => { this.setModalCancel(!modalCancel); }} >
                                <Image source={require('../../images/Close.png')} style={styles.Close} />
                              </TouchableOpacity>
                            </Col>
                          </Row>
                          <Row style={styles.STextRow}>
                            <Text style={styles.CpopupTextName}>{t("Do you want to cancel the order?")}</Text>
                          </Row>
                          <Row >
                          <Col style={styles.notes}>
                            <Text style={styles.Paragraph}>{t("Cnote1")}</Text>
                          </Col>
                          <Col style={styles.notes}>
                            <Text style={styles.Paragraph}>{t("Cnote2")}</Text>
                          </Col>
                          </Row>
                          <Row style={styles.SPlaceOrder_Row}>
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
                </TouchableOpacity>
              </Col>

              <Col style={styles.bottomActionBarRowSecondCol}>
                <TouchableOpacity style={{ alignItems: 'center' }}
                  onPress={() => {
                    this.setModalShow(true);
                    this.setModalVisible(true);
                  }}
                >
                  <Image
                    style={styles.bottomActionBarRowImages}
                    source={require("../../images/Support.png")}
                  />

                   Support modal
                  <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalShow}
                    onRequestClose={() => {
                      navigate('LocationScreen')
                    }}
                  >

                    <View style={styles.ScenteredView}>
                      <View style={styles.SmodalView}>
                        <ScrollView showsVerticalScrollIndicator={false}>
                          <Col style={{ alignItems: 'center' }}>
                            <Image source={require('../../images/Support.png')} style={styles.SLogo} />
                          </Col>
                          <Row style={styles.STextRow}>
                            <Text style={styles.SpopupTextName}>{t("Service is out of our operational area")}</Text>
                          </Row>
                          <Row style={styles.notes}>
                            <Text style={styles.Paragraph}>{t("For operational reason we serve in the Panama area we will be in the interior soon, thank you very much for your understanding")}</Text>
                          </Row>
                          <Row style={styles.SPlaceOrder_Row}>
                            <TouchableOpacity style={styles.PlaceOrder_Button} onPress={() => { this.setModalShow(!modalShow); }} >
                              <Text style={styles.PlaceOrder_Text}>{t('CANCEL')}</Text>
                            </TouchableOpacity>
                          </Row>
                        </ScrollView>
                      </View>

                    </View>

                  </Modal> */}


                  {/* { rating modal } */}
                  <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalVisible}
                    onRequestClose={() => {
                      navigate('LocationScreen')
                    }}
                  >

                    <View style={styles.centeredView}>
                      <View style={styles.modalView}>
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
                        <Row style={styles.Title}>
                            <Col style={{width:'25%'}}></Col>
                          <Col style={{ alignItems: 'center' }}>
                            <Text style={styles.popupTextName}>{t('How about the service?')}</Text>
                          </Col>
                           <Col style={{width:'25%'}}></Col>
                        </Row>
                        <Row style={{ height: 30, justifyContent: 'center', alignItems: 'center', marginTop: 20 }}>
                          <Col></Col>

                          {React_Native_Rating_Bar}

                          <Col></Col> 

                        </Row>

                        <Row style={{ marginTop: 20, width: '100%' }}>
                           <Col style={{width:'10%'}}></Col>
                          <Col style={{ alignItems: 'center' }}>
                            <Text style={styles.popupTextName}>{t('Your opinion helps us get better')}</Text>
                          </Col>
                          <Col style={{width:'10%'}}></Col> 

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


                  {/* <Text style={styles.bottomActionBarRowText}>
                    {t("SUPPORT")}
                  </Text>
                </TouchableOpacity>
              </Col>
              <Col style={styles.bottomActionBarRowThirdCol}>
                <TouchableOpacity style={{ alignItems: 'center' }}
                  onPress={() => {
                    this.setModalCall(true);
                  }}
                >
                  <Image
                    style={styles.bottomActionBarRowImages}
                    source={require("../../images/Messages.png")}
                  />
                  <Text style={styles.bottomActionBarRowText}>{t("DRIVER")}</Text>
                </TouchableOpacity>
                <Modal
                  animationType="slide"
                  transparent={true}
                  visible={modalCall}
                  onRequestClose={() => {
                    navigate('LocationScreen')
                  }}
                >

                  <View style={styles.ModalCenteredView}>
                    <View style={styles.ModalView}>
                      <ScrollView showsVerticalScrollIndicator={false}>
                        <Col style={{ alignItems: 'center', marginTop: 20 }}>
                          <Image
                            style={styles.Profile}
                            source={require("../../images/Profile-Pic2.png")}

                          />
                          <Row>
                            {React_Native_Get_Rating_Bar}
                          </Row>
                        </Col>
                        <Col style={styles.ModalNotes}>
                          <Text style={styles.ModalDriverName}>
                            @{dataSource.driver_name}
                          </Text>
                          <Text style={styles.ModalParagraph}>
                            {t('He is your designated driver you can call him or start a chat')}
                          </Text>
                        </Col>
                        <Row style={{ marginTop: 15 }}>
                          <Col style={styles.ModalIconCol} >
                            <TouchableOpacity onPress={() => { this.dialCall(dataSource.driver_mobile); }}>
                              <Image
                                style={styles.ModalIcon}
                                source={require("../../images/Call.png")}

                              />
                            </TouchableOpacity>
                          </Col>
                          <Col style={styles.ModalIconCol}>
                            <TouchableOpacity onPress={() => { this.chat(modalCall, navigate) }}>
                              <Image
                                style={styles.ModalIcon}
                                source={require("../../images/Messages.png")}
                              />
                            </TouchableOpacity>
                          </Col>
                        </Row>
                        <Row style={styles.ModalPlaceOrder_Row}>
                          <TouchableOpacity style={styles.PlaceOrder_Button} onPress={() => { this.setModalCall(!modalCall); }} >
                            <Text style={styles.PlaceOrder_Text}>{t('CANCEL')}</Text>
                          </TouchableOpacity>
                        </Row>
                      </ScrollView>
                    </View>

                  </View>

                </Modal>
              </Col>
            </Row> */}
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
                height: "5%",
                // paddingBottom: 50, 
                marginTop: 40,
            },
            android: {
                marginTop:10,
                height: normalize(35),
            }
        }),
        
    },
  BackArrow: {
        
                width: 25,
                height: 25,
    },
    Menu: {
                width: 25,
                height: 25,
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
        marginLeft: 16,
        marginRight: 10,
      },
      android: {
        height: 60,
        width: 60,
        marginTop: 10,
        marginLeft: 16,
        marginRight: 10,
        // alignItems:'center',

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
    fontSize: 25,
    fontFamily: 'Inter-Black',
    color: "#e02127",
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
    width: '100%',
    textAlign: "center",
    fontSize: 15,
    fontFamily: 'Inter-Black',
    marginTop: 5,
    height: normalize(30),
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
    height: normalize(55),
    width: normalize(55),
  },
  Profile: {
    height: 50,
    width: 50,
    marginLeft: 18,
    marginTop: 10,
  },
  ServiceIcon: {
    height: 80,
    width: 80,
    marginLeft: 5,
    marginTop: 5,
  },
  DateIcon: {
    height: 50,
    width: 50,
    marginLeft: 18,
    marginTop: 18,
  },
  mapRow: {
    borderBottomColor: "#67696b",
    borderBottomWidth: 1,
    marginLeft: 10,
    marginRight: 10,
  },
  ModalRow: {
    borderBottomColor: "#67696b",
    borderBottomWidth: 1,
    marginLeft: 10,
    marginRight: 10,
    height: '45%',
  },

  ServiceModalRow: {
    marginLeft: 10,
    marginRight: 10,
    height: '50%',
  },
  mapRouteText: {
    color: "#1c62a1",
    fontSize: 20,
    fontWeight: 'bold',
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
    fontWeight: "bold",
    fontStyle: "italic",
    color: "#000",
  },
  Total: {
    fontSize: 18,
    fontWeight: "bold",
    fontStyle: "italic",
    color: "#2276b9",
  },
  ModalTotal: {
    fontSize: 25,
    fontWeight: "bold",
    fontStyle: "italic",
    color: "#2276b9",
  },
  bottomActionBarRow: {
    marginTop: 50,
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
    height: 50,
    width: 50,
    // position: 'absolute',
    // marginLeft: 30,
    marginTop: -25,
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
  ScenteredView: {
    // borderRadius: 10,
    shadowColor: "#232324",
    shadowOffset: { width: 0, height: 1, },
    elevation: 200,
    height: Dimensions.get('window').height,
    backgroundColor: "rgba(100,100,100, 0.8)",
  },
  SmodalView: {
    ...Platform.select({
      ios: {
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
        shadowRadius: 3.84,
        elevation: 5

      },
      android: {
        borderRadius: 20,
        top: '25%',
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
        shadowRadius: 3.84,
        elevation: 5
      }
    })

  },
  modalView: {

    // flexDirection: 'column',
    borderRadius: 20,
    justifyContent: "center",
    top: '25%',
    marginBottom: '15%',
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
  modalText: {
    marginBottom: 15,
    textAlign: "center"
  },
  RLogo: {
    width: 80,
    height: 80,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 5,
    marginTop: "5%",
  },
  SLogo: {
    width: 50,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  Close: {
    width: 30,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 20,
    marginTop: 10,
  },
  STextRow: {
    marginTop: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  notes: {
    marginTop: 30,
    marginLeft: 10,
    marginRight: 10,

  },
  Paragraph: {
    fontSize: 15,
    fontFamily: 'Inter-Black',
  },
  SpopupTextName: {
    fontFamily: 'Inter-Black',
    justifyContent: "center",
    fontSize: 20,
    textAlign: 'center',
    width: '80%',
  },
  CpopupTextName: {
    fontWeight: 'bold',
    justifyContent: "center",
    fontSize: 20,
    textAlign: 'center',
  },
  TextBoxTitle: {
    ...Platform.select({
      ios: {
        top: 10,
        alignItems: 'center',

      },
      android: {
        top: 10,
        alignItems: 'center',
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
  popupTextName: {
    fontWeight: 'bold',
    alignItems: "center",
    justifyContent: "center",
    // backgroundColor:'red'
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
        bottom: '11%',
        // marginTop:15,
        // paddingBottom: 50, 


      }
    })

  },
  Title: {
    ...Platform.select({
      ios: {
        top: 10,
        width: '100%',
        height: '10%',
      },
      android: {
        // top: 10,
        width: '100%',
        height: 20
      }
    })
  },
  // LogoRow: {
  //       ...Platform.select ({
  //           ios:{
  //               // height: 1 , 
  //               // paddingBottom: 50, 
  //               marginTop:30,
  //           },
  //           android:{
  //               // flex:1,
  //               height: 50 , 
  //               marginTop:15,
  //               backgroundColor: 'red'
  //               // paddingBottom: 50, 
  //           }})

  //   },
  SPlaceOrder_Row: {
    marginTop: 30,
    justifyContent: 'center',
    marginBottom: 30,
  },
  PlaceOrder_Row: {
    marginTop: 10,
    justifyContent: 'center',
    marginBottom: 10
  },
  PlaceOrder_Button: {
    // marginTop: 15,
    alignItems: 'center',
    justifyContent: 'center',
    width: "80%",
    height: 60,
    borderRadius: 40,
    backgroundColor: '#e02127',
    color: '#fff',
  },
  PlaceOrder_Text: {
    color: '#fff',
    fontSize: 20,
    fontFamily: 'Inter-Black',
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
    marginRight: 5,
    resizeMode: 'cover',
  },

  textStyleSmall: {
    textAlign: 'center',
    fontSize: 16,
    color: '#000',
    marginTop: 15,
  },

  // call modal 
  ModalCenteredView: {
    // borderRadius: 10,
    shadowColor: "#232324",
    shadowOffset: { width: 0, height: 1, },
    elevation: 200,
    height: Dimensions.get('window').height,
    backgroundColor: "rgba(100,100,100, 0.8)",
  },
  ModalView: {
    borderRadius: 20,
    top: '25%',
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
    shadowRadius: 3.84,
    elevation: 5
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
  Profile: {
    height: 50,
    width: 50,
    marginTop: 10,
  },
  ModalIconCol: {
    marginLeft: 10,
    width: '20%'
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

  CallMOdalIcon: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
