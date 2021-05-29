import React, { Component } from "react";
import {
  View,
  TouchableOpacity,
  AsyncStorage,
  Image,
  StyleSheet,
  ActivityIndicator,
  Dimensions,
  Platform,
  BackHandler,
  Text
} from "react-native";
import { t } from '../../../locals';

import { NavigationEvents } from 'react-navigation';
import Constants from "expo-constants";
import MapViewDirections from "react-native-maps-directions";
import MapView, { ProviderPropType, Marker, PROVIDER_GOOGLE, AnimatedRegion } from "react-native-maps";
import { Col, Row } from "react-native-easy-grid";
import { getOrderDetailAction } from '../Util/Action.js';
import Pusher from "pusher-js/react-native";

const { width, height } = Dimensions.get('window');
const ASPECT_RATIO = width / height;
const LATITUDE = 23.022236;
const LONGITUDE = 72.547763;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

const GOOGLE_MAPS_APIKEY = (Platform.OS === 'ios') ? "AIzaSyDA8VzkYgIznevJNoGFt_HLxgM2cBRgQd8" : "AIzaSyD6VKrDOOeJgMKKwKpiYFhIA8Udd-7mdlU";

export default class OrderTracking extends React.PureComponent {
  static navigationOptions = ({ navigation }) => {
    return {
      headerShown: false
    };
  };

  constructor(props) {
    super(props);
    this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
    this.state = {
      loader: false,
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
    };
  }

  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
    this._pusherSubscription();
    this.getOrderDetail();
  }

  __onBlurr = () => {
      BackHandler.removeEventListener('hardwareBackPress',
          this.handleBackButtonClick);
  }

  _onFocus = () => {
      BackHandler.addEventListener('hardwareBackPress',
          this.handleBackButtonClick);
  }

  handleBackButtonClick() {
    var driver_id = this.state.driver_id;
    console.log(driver_id);
    this.pusher.unsubscribe("private-driver_location_" + driver_id);
    this.props.navigation.goBack(null);
    return true;
  }

  appBackButtonClick() {
    // var driver_id = this.state.driver_id;
    // this.pusher.unsubscribe("private-driver_location_" + driver_id);
    // this.props.navigation.navigate('OrderStatus');
    // return true;
  }

  async _pusherSubscription() {
    let Token = await AsyncStorage.getItem("token");
    Token = "Bearer " + Token;
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
  }

  async componentWillUnMount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
    var driver_id = this.state.driver_id;
    // console.log(driver_id);
    this.pusher.unsubscribe("private-driver_location_" + driver_id);
  }

  async getOrderDetail() {
    this.setState({ loader: true });
    const order_id = this.props.navigation.getParam("order_id");
    let Token = await AsyncStorage.getItem("token");

    Token = "Bearer " + Token;
    const getOrderDetailData = {
      order_id: order_id,
    };

    var response = await getOrderDetailAction(getOrderDetailData, Token).then((responseJson) => {
      if (responseJson.isError == false) {
        this.setState({
          dataSource: responseJson.result,
          driver_id: responseJson.result.driver_id,
          loader: false,
          driverLocation: { latitude: parseFloat(responseJson.result.destination_latitude), longitude: parseFloat(responseJson.result.destination_longitude) }
        });
        // console.log(this.state.dataSource)
        this._orderTracking(responseJson.result.driver_id)
      } else {
        alert(responseJson.message);
        this.setState({ loader: false });
      }
    });
  }

  _orderTracking(driver_id) {
    const { coordinate } = this.state;
    // console.log("driver_id"+driver_id)
    this.channel = this.pusher.subscribe("private-driver_location_" + driver_id);

    this.channel.bind("pusher:subscription_succeeded", function () {
      // alert("pusher subscription started for channel driver location");
    });

    this.channel.bind("pusher:subscription_error", function (error) {
      // alert(
      // "Channel subscription error in servicenotification channel => " + error
      // );
    });

    this.channel.bind("client-OrderTracking", (data) => {
      // Animated
      const { latitude, longitude, angle } = data;
      const newCoordinate = {
        latitude: latitude,
        longitude: longitude,
      };
      // console.log(latitude);
      // this.setState({
      // coordinate:newCoordinate,
      // angle: angle,    
      // });

      // if (Platform.OS === 'android') {
      // if (this.marker) {
      // coordinate.timing(newCoordinate).start();
      // }
      // } else {
      // coordinate.timing(newCoordinate).start();
      // }
      // if(this.mapView)
      // {
      // this.mapView.animateToRegion({  latitude:latitude ,
      // longitude:longitude,
      // latitudeDelta: LATITUDE_DELTA,
      // longitudeDelta: LONGITUDE_DELTA
      // })
      // }
      // console.log(this.mapView);
      if (this.mapView) {
        const region = {
          latitude: latitude,
          longitude: longitude,
          latitudeDelta: this.mapView.__lastRegion.latitudeDelta,
          longitudeDelta: this.mapView.__lastRegion.longitudeDelta,
        };
        this.mapView.animateToRegion(region, 2000 * 2);
      }


      if (Platform.OS === 'android') {
        if (this.marker) {
          // this.marker._component.animateMarkerToCoordinate(newCoordinate, 500);
          coordinate.timing({ latitude, longitude, duration: 2000 }).start();
        }
      } else {
        coordinate.timing({ latitude, longitude, duration: 2000 }).start();
      }
      this.setState({
        angle: angle,
        driverLocation: newCoordinate
      });
    });
  }

  toggleDrawer = ({ navigation }) => {
    this.props.navigation.toggleDrawer();
  };


  render() {
    let angle = this.state.angle || 0;

    const { navigate } = this.props.navigation;
    const { dataSource, loader, driverLocation } = this.state;
    const origin = { latitude: parseFloat(dataSource.from_latitude), longitude: parseFloat(dataSource.from_longitude) };
    const destination = { latitude: parseFloat(dataSource.destination_latitude), longitude: parseFloat(dataSource.destination_longitude) };
    const additionalPosition = { latitude: parseFloat(dataSource.cpoint_lattitude), longitude: parseFloat(dataSource.cpoint_longitude) };
    // console.log(dataSource.destination_latitude)
    if (origin.latitude) {
      return (
        <View style={styles.container}>
          <NavigationEvents
                    onWillFocus={this._onFocus}
                    onWillBlur={this._onBlurr}
                />
          <View style={styles.MainView}>
            <Col>
              <Row style={styles.LocationA}>
                <Col style={{ width: 30 }}>
                  <Image source={require("../../images/Bike.png")} style={styles.BackArrow} />
                </Col>
                <Col>
                  <Text style={{ fontFamily: "Inter-Black", fontSize: 20, textAlign: "center" }}>{t('Track your assigned driver')}</Text>
                </Col>
              </Row>
            </Col>
          </View>
          <MapView
            style={styles.mapStyle}
            provider={this.props.provider}
            initialRegion={{
              latitude: parseFloat(dataSource.from_latitude),
              longitude: parseFloat(dataSource.from_longitude),
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
            pitchEnabled={true}
            showsCompass={true}
            showsBuildings={true}
            ref={(map) => { this.mapView = map; }}
            zoomEnabled={true}
          >
            {angle == -1 ? (
              <Marker.Animated
                key='A'
                ref={(marker) => {
                  this.marker = marker;
                }}
                // tracksViewChanges={false}

                coordinate={this.state.coordinate}
              // style={{ transform: [{ rotate: `${angle}deg` }] }}
              >
                < Image source={require("../../images/driver-location.png")} style={{ width: 35, height: 35 }} />
              </Marker.Animated>
            ) : (
                <Marker.Animated
                  key='A'
                  ref={(marker) => {
                    this.marker = marker;
                  }}
                  // tracksViewChanges={false}

                  coordinate={this.state.coordinate}
                // style={{ transform: [{ rotate: `${angle}deg` }] }}
                >
                  < Image source={require("../../images/driver-location.png")} style={{ width: 50, height: 60 }} />
                </Marker.Animated>
              )}

            {/*
          this.state.markers.map((marker) => (
            <Marker.Animated 
              key='A'
              coordinate={marker.coords} 
              style={{ transform: [{ rotate: `${angle}deg` }] }}

              draggable
              onDragEnd={(e) => {this.onMarkerDragEnd(e.nativeEvent.coordinate, 'A')}}
                            >
              < Image source ={require("../../images/Temp-Bike2.png")} style={{ width : 50, height : 120 }}  />
            </Marker.Animated>
          ))
        */}
            {/* {dataSource.cpoint_lattitude == null  ? ( */}
              <View>
                <Marker
                  coordinate={{
                    latitude: parseFloat(dataSource.destination_latitude),
                    longitude: parseFloat(dataSource.destination_longitude),
                  }}
                  tracksViewChanges={false}

                >
                  <Image
                    // source={require("../../images/Location-B.png")}
                    source={require("../../images/destination-flag.png")}
                    style={{ width: 40, height: 40 }}
                  />
                </Marker>
              </View>
            {/* ) : (
                <View>
                  <Marker
                    coordinate={{
                      latitude: parseFloat(dataSource.cpoint_lattitude),
                      longitude: parseFloat(dataSource.cpoint_longitude),
                    }}
                    tracksViewChanges={false}

                  >
                    <Image
                      source={require("../../images/destination-flag.png")}
                      style={{ width: 40, height: 40 }}
                    />
                  </Marker>
                </View>
              )} */}

{/* {(this.state.order_status != "Completed" ? */}
            {this.state.order_status != "Completed" ?

              (<MapViewDirections

                origin={this.state.driverLocation}
                resetOnChange={false}
                destination={destination}
                apikey={GOOGLE_MAPS_APIKEY}
                strokeColor="#b2b2b3" //gray color
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
              />
              ):(
                <View></View>
              )}

            {this.state.order_status == "Completed" ? (
              <View>
                <MapViewDirections
                  origin={origin}
                  resetOnChange={false}
                  // destination={additionalPosition ? additionalPosition : destination}
                  destination={destination}
                  apikey={GOOGLE_MAPS_APIKEY}
                  strokeColor="#ee3c48" //red color
                  strokeWidth={5}
                  // optimizeWaypoints={true}
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
                />
              </View>
            ) : (
                
                <View>
                  <MapViewDirections
                    origin={this.state.driverLocation}
                    // origin={origin}
                    resetOnChange={false}
                    // destination={additionalPosition ? additionalPosition : destination}
                    destination={destination}
                    apikey={GOOGLE_MAPS_APIKEY}
                    strokeColor="#ee3c48" //red color
                    strokeWidth={5}
                    // optimizeWaypoints={true}
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
                  />
                </View>
              )}
          </MapView>
          {/* <Row style={styles.Navebar}>
          <Col>
            <TouchableOpacity onPress={this.appBackButtonClick.bind(this)}>
              <Image
                source={require("../../images/Back-Arrow.png")}
                style={styles.BackArrow}
              />
            </TouchableOpacity>
          </Col>

          <Col>
            <TouchableOpacity
              style={{ alignItems: "flex-end" }}
              onPress={this.toggleDrawer.bind(this)}
            >
              <Image
                source={require("../../images/Menu.png")}
                style={styles.Menu}
              />
            </TouchableOpacity>
          </Col>
        </Row> */}

          <Row style={styles.Navebar} >
            <Col style={{ borderRightWidth: 2, width: '15%', marginTop: 10, marginBottom: 10, borderColor: '#e1e1e3' }}>
              {/* <TouchableOpacity onPress={() => navigate('OrderLocation')} > */}
              <TouchableOpacity onPress={() => navigate('OrderStatus')} >
                <Image source={require('../../images/Back-Arrow.png')} style={styles.BackArrow} />
              </TouchableOpacity>
            </Col>
            <Col style={{ justifyContent: 'center', marginLeft: 10 }}>
              <Text style={{ fontFamily: "Inter-Black", fontSize: 20 }}>{t('Viewing Route')}</Text>
            </Col>
            <Col style={{ width: "10%" }}>
              <TouchableOpacity onPress={this.toggleDrawer.bind(this)}>
                <Image source={require('../../images/Menu.png')} style={styles.Menu} />
              </TouchableOpacity>
            </Col>
          </Row>
        </View>
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
OrderTracking.propTypes = {
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
        paddingTop: "12%",
        position: "absolute",
        backgroundColor: '#efefef'

      },
      android: {
        zIndex: 9999,
        position: "absolute",
        backgroundColor: '#efefef'
      },
    }),
  },
  BackArrow: {
    width: 25,
    height: 25,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 10,
  },
  Menu: {
    width: 25,
    height: 25,
    marginRight: 10,
    marginTop: 10,
    alignItems: "flex-end",
  },

  MainView: {
    ...Platform.select({
      ios: {
        width: '90%', marginLeft: 20, zIndex: 999,
      },
      android: {
        position: 'absolute', width: '90%', marginLeft: 20
      }
    })
  },

  LocationA: {
    ...Platform.select({
      ios: {
        position: 'absolute',
        marginTop: '35%',
        padding: 5,
        borderRadius: 20,
        backgroundColor: '#fff',
      },
      android: {

        position: 'absolute',
        marginTop: '20%',
        borderRadius: 20,
        backgroundColor: '#fff',
        elevation: 20,
        padding: 5,

      }
    })
  },
});