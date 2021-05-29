import React, { Component } from "react";
import {
  AsyncStorage,
  AppState,
  View,
  ActivityIndicator,
  StyleSheet,
  Dimensions,
  Modal,
  Image,
  TouchableOpacity,
  Text,
  ScrollView,
  
} from "react-native";
import Constants from "expo-constants";
import * as Location from "expo-location";
import * as Permissions from "expo-permissions";
import Pusher from "pusher-js/react-native";
import { t } from '../../../locals';
import { Col, Row } from "react-native-easy-grid";

import { handymanAssignNotificationDetailAction } from '../Util/Action.js';

export default class PusherIntegration extends Component {
    constructor(props) {
        super(props);
        
        this.state = {
        review: 0,
        Max_Rating: 5,
        location: null,
        errorMessage: null,
        prevTime: Date.now(),
        userToken: "",
        date:'',
        time:'',
        userID: "",
        userName: "",
        appState: AppState.currentState,
        triggerChannelState: 0,
        modalVisible: false,
        loader: false,
        dataSource: [],
        };
        this.Star = 'https://raw.githubusercontent.com/AboutReact/sampleresource/master/star_filled.png';
        //Empty Star. You can also give the path from local
        this.Star_With_Border = 'https://raw.githubusercontent.com/AboutReact/sampleresource/master/star_corner.png';
    }
    static navigationOptions = ({ navigation }) => {
        return {
            headerShown: false,
        };
    };
    
    async UNSAFE_componentWillMount() {
        let userID = await AsyncStorage.getItem("userid");
        let userName = await AsyncStorage.getItem("name");
        let userToken = await AsyncStorage.getItem("token");
        this.setState({
        userID: userID,
        userName: userName,
        userToken: userToken,
        });
        this._pusherSubscription();
        this.newOrderPusherchannelTrigger();
        // if (!this.state.modalVisible) {
        this.props.navigation.navigate("Selection");
        // }
    }

    componentDidMount = async () => {
        // AppState.addEventListener("change", this._handleAppStateChange);
        // this._getLocationAsync();

        // Location.watchPositionAsync(LOCATION_SETTINGS, (location) => {
        // this._getLocationAsync();

        // this.setState((state, props) => {
        //     const now = Date.now();
        //     return {
        //     ...state,
        //     location,
        //     prevTime: now,
        //     timeDiff: now - state.prevTime,
        //     };
        // });
        // });
    };
    componentWillUnmount() {

        // AppState.removeEventListener("change", this._handleAppStateChange);
       
        // this.pusher.unsubscribe("private-location");
        //   this.setState({
        //     triggerChannelState: 0,
        //   });

        //   var triggered = this.myChannel.trigger("client-UnsubscribeLocation", {
        //     driver_id: this.state.userID,
        //     name: this.state.userName,
        //   });
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
		activityTimeout: 6000,
        });

        this.channel = this.pusher.subscribe("private-servicenotification");
        this.setState({
			triggerChannelState: 1,
        });

    }

    // code for show pop up when new order comes for this logged in driver or handy man
    newOrderPusherchannelTrigger() {

        const { userID, userToken } = this.state;
        // subcriber new channel for unsubscribe driver
        // newOrderChannel = this.pusher.subscribe(" servicenotification ");

        this.channel.bind("App\\Events\\HandymanAssign", (data) => {

            if (data.customer_id == userID) {
                let Token = "Bearer " + userToken;
                const getOrderDetailData = {
                user_id: userID,
                order_id: data.order_id,
                };
                handymanAssignNotificationDetailAction(getOrderDetailData, Token).then((responseJson) => {
                  // console.log(responseJson)
                if (responseJson.isError == false) {
                    this.setState({
                    dataSource: responseJson.result,
                    review: responseJson.result.handyman_rating,
                    loader: false,
                    modalVisible: true,
                    
                    });
                } else {
                    alert(responseJson.message);
                    this.setState({ loader: false });
                }
                });
            }
        });
    }
    // set modal view
    setModalVisible = (visible) => {
        this.setState({ modalVisible: visible });
    };
    render() {
        const { modalVisible, loader, dataSource } = this.state;
        const { navigate } = this.props.navigation;
        let React_Native_Rating_Bar = [];
        for (var i = 1; i <= this.state.Max_Rating; i++) {
        React_Native_Rating_Bar.push(
            <Image
                style={styles.StarImage}
                key={i}
                source={
                i <= this.state.review
                    ? { uri: this.Star }
                    : { uri: this.Star_With_Border }
                }
            />
        );
        }
        if (!loader) {
            return (
                <View>
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
                        
                        <Row style={{height: "10%"}}>
                            <Col style={{width: '80%'}}>
                                <Text style={styles.orderNumber}>{t('Assigned Support')}</Text>
                            </Col>
                            <Col>
                              <TouchableOpacity onPress={() => { this.setModalVisible(!modalVisible); }} > 
                                <Image source={require('../../images/Close.png')} style={styles.Close}/>
                              </TouchableOpacity>
                            </Col>
                        </Row>

                        <Row style={styles.ModalRow}>
                          <Col style={{ width: 90 }}>
                            <Image
                              style={styles.Profile}
                              source={require("../../images/Profile-Pic2.png")}
                              
                            />
                            <Row> 
                              {React_Native_Rating_Bar}
                            </Row>
                          </Col>
                          <Col style={{marginTop: 10, marginLeft: 10}}>
                            <Row style={{height:28}}>
                              <Text style={styles.mapRouteText}>
                                @{dataSource.driver_name}
                              </Text>
                            </Row>
                            <Row style={{width:'100%',height: '25%'}}>
                              <Text style={{fontSize:15}}>
                                {t("is your assigned specialist")}
                              </Text>
                            </Row>
                          </Col>
                      </Row>
                      <Row style={styles.ModalRow}>
                          <Col style={{ width: 90 }}>
                            <Image
                              style={styles.DateIcon}
                              source={require("../../images/Date-and-Time.png")}
                            />
                            
                          </Col>
                          <Col style={{marginTop: 10, marginLeft: 10}}>
                            <Row style={{height:28}}>
                              <Col>
                                <Text style={styles.popupTextName}>
                                  {t('DATE')}
                                </Text>
                              </Col>
                              <Col>
                                <Text style={styles.popupTextName}>
                                  {t('HOUR')}
                                </Text>
                              </Col>
                            </Row>
                            <Row style={{width:'100%', height: 50}}>
                              <Col >
                                <Text style={{fontSize:15}}>
                                  {dataSource.date}
                                </Text>
                              </Col>
                              <Col>
                                <Text style={{fontSize:15}}>
                                  {dataSource.time}
                                </Text>
                              </Col>
                            </Row>
                          </Col>
                      </Row>

                      <Row style={styles.ServiceModalRow}>
                          <Col style={{ width: 90 }}>
                            <Image
                              style={styles.ServiceIcon}
                              source={require("../../images/SERVICIOS.png")}
                            />
                            
                          </Col>
                          <Col style={{marginTop: 10, marginLeft: 10}}>
                            <Row style={{height:28}}>
                              <Text style={styles.popupTextName}>
                                {t('Cost of Diagnosis')}
                              </Text>
                            </Row>
                            <Row style={{width:'100%', height: 50}}>
                              <Text style={styles.ModalTotal}>
                                {dataSource.total}
                              </Text>
                            </Row>
                          </Col>
                      </Row>
                      <Row style={styles.ServiceTextRow}>
                        <Text style={{marginLeft: 10, marginRight:10}}>
                        {t('Service Modal Text')}</Text>
                      </Row>
                      
                      </View>
                      
                    </View>
                                
                  </Modal>
                </View>
            );
        } else {
            return (
                <ActivityIndicator
                style={styles.loading}
                size="large"
                color="#0f4471"
                />
            );
        }
        
    }
}
const styles = StyleSheet.create({
    centeredView: {
        // borderRadius: 10,
      shadowColor: "#232324",
      shadowOffset: {width: 0,height: 1,},
      elevation: 200,
      // width: Dimensions.get('window').width,
      height: Dimensions.get('window').height,
      backgroundColor: "rgba(100,100,100, 0.8)",
    },
    modalView: {
      // flexDirection: 'column',
      justifyContent: "center",
      top: '20%',
      // marginBottom: '15%',
      marginLeft: 10,
      marginRight: 10,
      backgroundColor: "white",        
      paddingLeft: 5,
      paddingRight: 5,
      shadowColor: "#232324",
      shadowOffset: {
      width: 0,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5
    },
    orderNumber: {
        fontSize: 23,
        padding: 10,
        fontWeight: "bold",
        color: "#e02127",
        marginLeft: 10,
    },
    ModalRow: {
        borderBottomColor: "#67696b",
        borderBottomWidth: 1,
        marginLeft: 10,
        marginRight: 10,
        height: '25%',
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
    DateIcon:{
        height: 50,
        width: 50,
        marginLeft: 18,
        marginTop: 18,
    },
    mapRouteText: {
        color: "#1c62a1",
        fontSize: 20,
    },
    popupTextName: {
        // flex: 1,
        fontWeight: 'bold',
        // marginLeft: 40,
        // marginRight: 40,
        alignItems: "center",
        // justifyContent: "center",
        fontSize: 20,
        // height: 20,
    },
    ServiceModalRow: {
        marginLeft: 10,
        marginRight: 10,
        // height: '10%',
    },
    ServiceTextRow: {
      top:"5%",
        marginLeft: 10,
        marginRight: 10,
        // height: '10%',
    },
    ModalTotal: {
        fontSize: 25,
        fontWeight: "bold",
        fontStyle: "italic",
        color: "#2276b9",
    },
    StarImage: {
      width: 18,
      height: 18,
      resizeMode: 'cover',
    },
    Close: {
      width: 30,
      height: 30,
      justifyContent: "center",
      alignItems: "center",
      marginLeft: 20,
      marginTop: 10,
    },
})