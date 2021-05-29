import React, { Component } from 'react';
import { Dimensions, Modal, AppState, BackHandler, ActivityIndicator, StyleSheet, Text, View, Image, Button, TextInput, TouchableOpacity, StatusBar, ScrollView, AsyncStorage, Platform } from 'react-native';
import { Col, Row, Grid } from "react-native-easy-grid";
import { t } from '../../../locals';
import { NavigationEvents } from 'react-navigation';
import Pusher from "pusher-js/react-native";
import { handymanAssignNotificationDetailAction } from '../Util/Action.js';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LocationScreen from './LocationScreen.js';
import ServicePlace from './ServicePlace.js';
import SupportScreen from './SupportScreen.js';
import ClientsWallet from './ClientsWallet.js';




export default class Selection extends Component {
  
  static navigationOptions = ({ navigation }) => {
      return {
          headerTitle: () => (
              <View style={{ flex: 1, flexDirection: 'row' }}>
              	///android back button ///

              </View>
          ),
          headerRight: () => <NavigationDrawerStructure navigationProps={navigation} />,
          headerStyle: {
              backgroundColor: 'lightskyblue',
              height: 80,
              shadowRadius: 0,
              shadowColor: 'transparent',
              shadowOffset: {
                  height: 0,
              },
          },
          headerTintColor: 'red',
      };
  };

  async componentDidMount() {
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

  }
  componentWillUnmount() {
      this.focusListener.remove();
  }
  constructor(props) {
    super(props);
    this.state = {
      loader: false,

      review: 0,
      Max_Rating: 5,
      location: null,
      errorMessage: null,
      prevTime: Date.now(),
      userToken: "",
      date: '',
      time: '',
      userID: "",
      userName: "",
      appState: AppState.currentState,
      triggerChannelState: 0,
      modalVisible: false,
      loader: false,
      dataSource: [],

    }

  }
  static navigationOptions = ({ navigation }) => {
    return {
      headerShown: false
    };
  };

  // pusher functions start

  async UNSAFE_componentWillMount() {

      if (!this.state.modalVisible) {
      this.props.navigation.navigate("Selection"); 
      }
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
    console.log(this.channel)
    this.setState({
      triggerChannelState: 1,
    });

  }

  // code for show pop up when new order comes for this logged in driver or handy man
  newOrderPusherchannelTrigger() {

    const { userID, userToken } = this.state;
    // subcriber new channel for unsubscribe driver
    newOrderChannel = this.pusher.subscribe(" servicenotification ");

    this.channel.bind("App\\Events\\HandymanAssign", (data) => {

      if (data.customer_id == userID) {
        let Token = "Bearer " + userToken;
        const getOrderDetailData = {
          user_id: userID,
          order_id: data.order_id,
        };
        handymanAssignNotificationDetailAction(getOrderDetailData, Token).then((responseJson) => {
          //   console.log(responseJson)
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

  //pusher functions end


  logout = async () => {
    await AsyncStorage.removeItem('userid');
    await AsyncStorage.removeItem('name');
    await AsyncStorage.removeItem('token');
    this.props.navigation.navigate('Auth');
  };

  toggleDrawer = ({ navigation }) => {
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

  _handleBackButtonClick = () => BackHandler.exitApp();

  render() {

    // tabs view start
    const Stack = createStackNavigator();
    const Tab = createBottomTabNavigator();
    const Drawer = createDrawerNavigator();

    const NavigationDrawerStructure = (props) => {
      //Structure for the navigatin Drawer
      const toggleDrawer = () => {
        //Props to open/close the drawer
        props.navigationProps.toggleDrawer();
      };

      return (
        <View style={{ flexDirection: 'row' }}>
          <TouchableOpacity onPress={() => toggleDrawer()}>
            {/*Donute Button Image */}
            <Image source={require('../../images/Menu.png')} style={styles.Menu} />
          </TouchableOpacity>
        </View>
      );
    };

    const getHeaderTitle = (route) => {
      const routeName = getFocusedRouteNameFromRoute(route) ?? 'Feed';

      switch (routeName) {
        case 'Market':
          return 'Market';
        case 'Messangers':
          return 'Messangers';
        case 'Service':
          return 'Service';
      }
    };

    const Market = () => {

      return (
        <Stack.Navigator
          initialRouteName="Market"
          screenOptions={{
            headerStyle: {backgroundColor: '#42f44b'},
            headerTintColor: '#fff',
            headerTitleStyle: {fontWeight: 'bold'},
          }}
        >
          <Stack.Screen
            name="Market"
            component={LocationScreen}
            options={{ headerShown: false }}
          />


        </Stack.Navigator>
      );
    }
    const Messangers = ({navigation}) => {
      const { navigate } = this.props.navigation;
      return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Button
        title="Location Screen"
        onPress={() => navigate('LocationScreen')}
      />
    
        <Stack.Navigator
          initialRouteName="Messangers"
          screenOptions={{
            headerStyle: {backgroundColor: '#42f44b'},
            headerTintColor: '#fff',
            headerTitleStyle: {fontWeight: 'bold'},
          }}
        >
          <Stack.Screen
            name="Messangers"
            component={LocationScreen}
            options={{ headerShown: false }}
            options={({ route }) => ({
              headerTitle: getHeaderTitle(route),
              headerLeft: () => (
                <NavigationDrawerStructure
                  navigationProps={navigation}
                />
              ),
              headerStyle: {
                backgroundColor: '#f4511e', //Set Header color
              },
            })}
          />


        </Stack.Navigator>
        </View>
      );
    }

    const Service = () => {
      return (
        <Stack.Navigator
          initialRouteName="Service"
          screenOptions={{
            headerStyle: { backgroundColor: '#42f44b' },
            headerTintColor: '#fff',
            headerTitleStyle: { fontWeight: 'bold' },
          }}>
          <Stack.Screen
            name="Service"
            component={ServicePlace}
            options={{ headerShown: false }}
          />
        </Stack.Navigator>
      );
    }

    const Support = () => {
      return (
        <Stack.Navigator
          initialRouteName="Support"
          screenOptions={{
            headerStyle: { backgroundColor: '#42f44b' },
            headerTintColor: '#fff',
            headerTitleStyle: { fontWeight: 'bold' },
          }}>
          <Stack.Screen
            name="Support"
            component={SupportScreen}
            options={{ headerShown: false }}
          />

        </Stack.Navigator>
      );
    }
    const Payment = () => {
      return (
        <Stack.Navigator
          initialRouteName="Payment"
          screenOptions={{
            headerStyle: { backgroundColor: '#42f44b' },
            headerTintColor: '#fff',
            headerTitleStyle: { fontWeight: 'bold' },
          }}>
          <Stack.Screen
            name="Payment"
            component={ClientsWallet}
            options={{ headerShown: false }}
          />

        </Stack.Navigator>
      );
    }
    // tabs view end



    const { navigate } = this.props.navigation;
    // const { loader } = this.state;

    //pusher render start
    const { modalVisible, loader, dataSource, review } = this.state;
    // const { navigate } = this.props.navigation;
    let React_Native_Rating_Bar = [];
    for (var i = 1; i <= this.state.Max_Rating; i++) {
      React_Native_Rating_Bar.push(
        <Image
          style={styles.StarImage}
          key={i}
          source={
            i <= review
              ? (require('../../images/Star-Yellow.png'))
              : (require('../../images/Star-Grey.png'))
          }
        />
      );
    }
    if (!loader) {
      return (
        <View style={styles.container}>
          <NavigationEvents
            onWillFocus={this._onFocus}
            onWillBlur={this._onBlurr}
          />
          {/* pusher view start */}
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

                <Row style={{ height: "12%" }}>
                  <Col style={{ width: '80%' }}>
                    <Text style={styles.orderNumber}>{t('Assigned Support')}</Text>
                  </Col>
                  <Col>
                    <TouchableOpacity onPress={() => { this.setModalVisible(!modalVisible); }} >
                      <Image source={require('../../images/Close.png')} style={styles.Close} />
                    </TouchableOpacity>
                  </Col>
                </Row>

                <Row style={styles.ModalRow}>
                  <Col style={{ width: 90 }}>
                    <Image
                      style={styles.Profile}
                      source={require("../../images/Profile-Pic2.png")}

                    />
                    <Row style={{ alignItems: 'center', justifyContent: 'center' }}>
                      {React_Native_Rating_Bar}
                    </Row>
                  </Col>
                  <Col style={{ marginTop: 10, marginLeft: 10 }}>
                    <Row style={{ height: 28 }}>
                      <Text style={styles.mapRouteText}>
                        @{dataSource.driver_name}
                      </Text>
                    </Row>
                    <Row style={{ width: '100%', height: '25%' }}>
                      <Text style={{ fontSize: 15 }}>
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
                  <Col style={{ marginTop: 10, marginLeft: 10 }}>
                    <Row style={{ height: 28 }}>
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
                    <Row style={{ width: '100%', height: 50 }}>
                      <Col >
                        <Text style={{ fontSize: 15 }}>
                          {dataSource.service_date}
                        </Text>
                      </Col>
                      <Col>
                        <Text style={{ fontSize: 15 }}>
                          {dataSource.service_time}
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
                  <Col style={{ marginTop: 10, marginLeft: 10 }}>
                    <Row style={{ height: 28 }}>
                      <Text style={styles.popupTextName}>
                        {t('Cost of Diagnosis')}
                      </Text>
                    </Row>
                    <Row style={{ width: '100%', height: 50 }}>
                      <Text style={styles.ModalTotal}>
                        {dataSource.total}
                      </Text>
                    </Row>
                  </Col>
                </Row>
                <Row style={styles.ServiceTextRow}>
                  <Text style={{ marginLeft: 10, marginRight: 10 }}>
                    {t('Service Modal Text')}</Text>
                </Row>

              </View>

            </View>

          </Modal>

    {/* return (
      // <View  >

      // <StatusBar /> */}

      
      <NavigationContainer>
        
        <Tab.Navigator
          initialRouteName="Feed"
          tabBarOptions={{
            activeTintColor: '#bc464a',
          }}>
          <Tab.Screen
            name="Market"
            component={Market}
            options={{
              tabBarLabel: 'Market',
              tabBarIcon: ({ focused, color, }) => (
                <Image
                  source={
                    focused
                      ? require('../../images/Home-BG.png')
                      : require('../../images/Home.png')
                  }
                  style={{
                    width: 25,
                    height: 25,
                    // borderRadius: size,
                  }}
                />
              ),
            }}
          />
          <Tab.Screen
            name="Messangers"
            component={Messangers}
            options={{
              tabBarLabel: 'Messangers',
              tabBarIcon: ({ focused, color, }) => (
                <Image
                  source={
                    focused
                      ? require('../../images/Bike-BG.png')
                      : require('../../images/Bike-2.png')
                  }
                  style={{
                    width: 25,
                    height: 25,
                    // borderRadius: size,
                  }}
                />
              ),
            }}
          />
          <Tab.Screen
            name="Service"
            component={Service}
            options={{
              tabBarLabel: 'services',
              tabBarIcon: ({ focused }) => (
                <Image
                  source={
                    focused
                      ? require('../../images/Settings-BG.png')
                      : require('../../images/Settings.png')
                  }
                  style={{
                    width: 25,
                    height: 25,
                    // borderRadius: size,
                  }}
                />
              ),
            }}
          />
          <Tab.Screen
            name="Support"
            component={Support}
            options={{
              tabBarLabel: 'Support',
              tabBarIcon: ({ focused }) => (
                <Image
                  source={
                    focused
                      ? require('../../images/Headphone-BG.png')
                      : require('../../images/Headphone.png')
                  }
                  style={{
                    width: 25,
                    height: 25,
                    // borderRadius: size,
                  }}
                />
              ),
            }}
          />
          <Tab.Screen
            name="Payment"
            component={Payment}
            options={{
              tabBarLabel: 'Payment',
              tabBarIcon: ({ focused }) => (
                <Image
                  source={
                    focused
                      ? require('../../images/Logo-BG.png')
                      : require('../../images/Logo2.png')
                  }
                  style={{
                    width: 25,
                    height: 25,
                    // borderRadius: size,
                  }}
                />
              ),
            }}
          />
        </Tab.Navigator>
      </NavigationContainer>
      
      </View>
      // pusher view end
    );
  }
}
  // else {
  //   return (
  //     <ActivityIndicator
  //       style={styles.loading}
  //       size="large"
  //       color="#0f4471"
  //     />
  //   );
  // }

  // }
  //pusher render end

  // if (!loader) {
  // return (

  // );

  // } else {
  //     return (
  //         <ActivityIndicator
  //             style={styles.loading}
  //             size="large"
  //             color="#d62326"
  //         />
  //     );
  // }

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
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#B3D6F2',

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
    ...Platform.select({
      ios: {
        width: 25,
        height: 25,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
        marginTop: 35,
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

  Rlogo: {
    marginLeft: 10,
    width: 125,
    height: 125,
    justifyContent: 'center',
    alignItems: 'center',
    // marginTop: 20,    
  },

  SERVICES: {
    width: 150,
    height: 150,
    justifyContent: 'center',
    alignItems: 'center',
  },

  MESSENGER: {
    width: 150,
    height: 150,
    justifyContent: 'center',
    alignItems: 'center',
  },

  Row: {
    // marginTop: 60,
    // height:50,
    flex: 1,
    justifyContent: 'center',
    width: '80%',
    alignItems: 'center',
  },
  Text: {
    ...Platform.select({
      ios: {
        marginTop: 50,
        fontWeight: 'bold',
        fontSize: 18,
        alignItems: 'center',
        height: 30,
      },
      android: {
        marginTop: 40,
        fontWeight: 'bold',
        fontSize: 18,
        alignItems: 'center',
        height: 30,
      }
    })
  },


  ///pusher modal css start///

  centeredView: {
    // borderRadius: 10,
    shadowColor: "#232324",
    shadowOffset: { width: 0, height: 1, },
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
    ...Platform.select({
      ios: {
        borderBottomColor: "#67696b",
        borderBottomWidth: 1,
        marginLeft: 10,
        marginRight: 10,
        height: '23%',
      },
      android: {
        borderBottomColor: "#67696b",
        borderBottomWidth: 1,
        marginLeft: 10,
        marginRight: 10,
        height: '21%',
      }
    })

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
    top: "5%",
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
    width: 13,
    height: 13,
    marginRight: 2,
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

  ///pusher modal css end///
});
