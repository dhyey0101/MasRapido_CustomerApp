import React, { Component } from "react";
import {
  BackHandler,
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
} from "react-native";
import { Col, Row } from "react-native-easy-grid";
import { t } from '../../../locals';
import CustomToast from './Toast.js';
import normalize from 'react-native-normalize';
import { NavigationEvents } from 'react-navigation';
import DropdownAlert from 'react-native-dropdownalert';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LocationScreen from './LocationScreen.js';
import IndicationScreen from './IndicationScreen.js';
import ServicePlace from './ServicePlace.js';
import ToggleSwitch from 'toggle-switch-react-native';
import { getUserConfigurationAction, updateUserConfigurationAction } from '../Util/Action.js';


export default class Configuration extends Component {
  constructor(props) {
    super(props);
    this.state = {
      switchOn1: 0,
      switchOn2: 0,
      switchOn3: 0,
      switchOn4: 0,
      modalVisible: false,
      modalShow: false,
      modalCancel: false,
      configurationData: [],
    };
  }

  static navigationOptions = ({ navigation }) => {
    return {
      headerShown: false,
    };
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

  _handleBackButtonClick = () => this.props.navigation.navigate('MarketPlace')

  async componentDidMount() {
    this.getUserConfigurationDetails();
  }

  async getUserConfigurationDetails() {

    this.setState({ loader: true });
    const customer_id = await AsyncStorage.getItem("userid");
    let Token = await AsyncStorage.getItem("token");
    Token = "Bearer " + Token;

    var Data = {
      user_id: customer_id,
    };

    getUserConfigurationAction(Data, Token).then((responseJson) => {
      console.log(responseJson)
      if (responseJson.isError == false) {
        this.setState({
          switchOn1: responseJson.result.activate_location,
          switchOn2: responseJson.result.notify_order_arrival,
          switchOn3: responseJson.result.notify_message,
          switchOn4: responseJson.result.notify_cancellation,
          loader: false,
        });
        console.log(this.state.configurationData)
      } else {
        alert(responseJson.message);
        this.setState({ loader: false });
      }
    });
  }

  Switch = async (number) => {

    if (number == 1) {
      this.setState({
        switchOn1: !this.state.switchOn1,
      });
    }

    if (number == 2) {
      this.setState({
        switchOn2: !this.state.switchOn2,
      });
    }

    if (number == 3) {
      this.setState({
        switchOn3: !this.state.switchOn3,
      });
    }

    if (number == 4) {
      this.setState({
        switchOn4: !this.state.switchOn4,
      });
    }
    const customer_id = await AsyncStorage.getItem("userid");
    let Token = await AsyncStorage.getItem("token");

    Token = "Bearer " + Token;
    var configurationData = {
      user_id: customer_id,
      activate_location: this.state.switchOn1,
      notify_order_arrival: this.state.switchOn2,
      notify_message: this.state.switchOn3,
      notify_cancellation: this.state.switchOn4,
      notification_tone: ''
    };

    // this.setState({ loader: true });
    var response = updateUserConfigurationAction(configurationData, Token).then(
      function (responseJson) {

        if (responseJson.isError == false) {
          // this.setState({ loader: false });

        } else {
          this.setState({ loader: false });
        }
      }.bind(this)
    );

  }

  render() {
    const { navigate, } = this.props.navigation;
    const { modalShow, configurationData } = this.state;
    return (
      <View style={styles.container}>
        <NavigationEvents
          onWillFocus={this._onFocus}
          onWillBlur={this._onBlurr}
        />

        <Row style={styles.Navebar}>
          <TouchableOpacity onPress={() => navigate('MarketPlace')} style={{ width: '50%' }}>
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

        <Row style={styles.header}>
          <Col style={{ width: normalize(65), justifyContent: 'center', alignItems: 'flex-start', }}>
            <Image source={require('../../images/Setting.png')} style={{ height: normalize(45), width: normalize(45), }} />
          </Col>
          <Col style={{ justifyContent: 'center', alignItems: 'flex-start', }}>
            <Text style={{ fontSize: 35, color: '#C1272D', fontFamily: 'Inter-Black' }}>{t('Configuration')}</Text>
          </Col>
        </Row>

        <Row style={{ height: normalize(50), marginTop: normalize(30), marginLeft: normalize(20), marginRight: normalize(20), borderColor: '#E5E5E5', borderTopWidth: 1, borderBottomWidth: 1 }}>
          <Col style={{ justifyContent: 'center', alignItems: 'flex-start', }}>
            <Text style={{ fontFamily: 'Inter-Black', fontSize: 20, }}>{t('Always activate my location')}</Text>
          </Col>
          <Col style={{ width: normalize(80), alignItems: 'flex-end' }}>
            <ToggleSwitch
              trackOnStyle={{
                marginTop: 16,
                width: normalize(50),
                height: normalize(20),
                borderRadius: normalize(20),
                backgroundColor: "#E5E5E5",
                padding: 0
              }}
              trackOffStyle={{
                marginTop: 16,
                width: normalize(50),
                height: normalize(20),
                borderRadius: normalize(20),
                backgroundColor: "#E5E5E5",
                padding: 0
              }}
              thumbOnStyle={{
                width: normalize(30),
                height: normalize(30),
                borderRadius: normalize(20),
                backgroundColor: "#1988B9",
                padding: 0
              }}
              thumbOffStyle={{
                width: normalize(30),
                height: normalize(30),
                borderRadius: normalize(20),
                backgroundColor: "#E5E5E5",
                padding: 0
              }}
              isOn={this.state.switchOn1}
              // onPress={this.onPress1}
              onToggle={() => this.Switch(1)}
              duration={1000}
            />
          </Col>
        </Row>
        <Row style={{ height: normalize(40), justifyContent: 'flex-start', alignItems: 'center', marginLeft: normalize(20), marginRight: normalize(20) }}>
          <Text style={{ fontSize: 20, fontFamily: 'Inter-Black', color: '#1882B1' }}>{t('Notifications')}</Text>
        </Row>

        <Row style={{ height: normalize(40), marginTop: normalize(10), marginLeft: normalize(20), marginRight: normalize(20), }}>
          <Col style={{ justifyContent: 'center', alignItems: 'flex-start', }}>
            <Text style={{ fontFamily: 'Inter-Black', fontSize: 20, }}>{t('Notify arrival of orders')}</Text>
          </Col>
          <Col style={{ width: normalize(80), alignItems: 'flex-end' }}>
            <ToggleSwitch
              trackOnStyle={{
                marginTop: 16,
                width: normalize(50),
                height: normalize(20),
                borderRadius: normalize(20),
                backgroundColor: "#E5E5E5",
                padding: 0
              }}
              trackOffStyle={{
                marginTop: 16,
                width: normalize(50),
                height: normalize(20),
                borderRadius: normalize(20),
                backgroundColor: "#E5E5E5",
                padding: 0
              }}
              thumbOnStyle={{
                width: normalize(30),
                height: normalize(30),
                borderRadius: normalize(20),
                backgroundColor: "#1988B9",
                padding: 0
              }}
              thumbOffStyle={{
                width: normalize(30),
                height: normalize(30),
                borderRadius: normalize(20),
                backgroundColor: "#E5E5E5",
                padding: 0
              }}
              isOn={this.state.switchOn2}
              // onPress={this.onPress1}
              onToggle={() => this.Switch(2)}
              duration={1000}
            />
          </Col>
        </Row>

        <Row style={{ height: normalize(40), marginTop: normalize(10), marginLeft: normalize(20), marginRight: normalize(20), }}>
          <Col style={{ justifyContent: 'center', alignItems: 'flex-start', }}>
            <Text style={{ fontFamily: 'Inter-Black', fontSize: 20, }}>{t('Notify messages')}</Text>
          </Col>
          <Col style={{ width: normalize(80), alignItems: 'flex-end' }}>
            <ToggleSwitch
              trackOnStyle={{
                marginTop: 16,
                width: normalize(50),
                height: normalize(20),
                borderRadius: normalize(20),
                backgroundColor: "#E5E5E5",
                padding: 0
              }}
              trackOffStyle={{
                marginTop: 16,
                width: normalize(50),
                height: normalize(20),
                borderRadius: normalize(20),
                backgroundColor: "#E5E5E5",
                padding: 0
              }}
              thumbOnStyle={{
                width: normalize(30),
                height: normalize(30),
                borderRadius: normalize(20),
                backgroundColor: "#1988B9",
                padding: 0
              }}
              thumbOffStyle={{
                width: normalize(30),
                height: normalize(30),
                borderRadius: normalize(20),
                backgroundColor: "#E5E5E5",
                padding: 0
              }}
              isOn={this.state.switchOn3}
              // onPress={this.onPress1}
              onToggle={() => this.Switch(3)}
              duration={1000}
            />
          </Col>
        </Row>

        <Row style={{ height: normalize(50), marginTop: normalize(10), marginLeft: normalize(20), marginRight: normalize(20), borderColor: '#E5E5E5', borderBottomWidth: 1 }}>
          <Col style={{ justifyContent: 'center', alignItems: 'flex-start', }}>
            <Text style={{ fontFamily: 'Inter-Black', fontSize: 20, }}>{t('Notify cancellations')}</Text>
          </Col>
          <Col style={{ width: normalize(80), alignItems: 'flex-end' }}>
            <ToggleSwitch
              trackOnStyle={{
                marginTop: 16,
                width: normalize(50),
                height: normalize(20),
                borderRadius: normalize(20),
                backgroundColor: "#E5E5E5",
                padding: 0
              }}
              trackOffStyle={{
                marginTop: 16,
                width: normalize(50),
                height: normalize(20),
                borderRadius: normalize(20),
                backgroundColor: "#E5E5E5",
                padding: 0
              }}
              thumbOnStyle={{
                width: normalize(30),
                height: normalize(30),
                borderRadius: normalize(20),
                backgroundColor: "#1988B9",
                padding: 0
              }}
              thumbOffStyle={{
                width: normalize(30),
                height: normalize(30),
                borderRadius: normalize(20),
                backgroundColor: "#E5E5E5",
                padding: 0
              }}
              isOn={this.state.switchOn4}
              // onPress={this.onPress1}
              onToggle={() => this.Switch(4)}
              duration={1000}
            />
          </Col>
        </Row>

        <Col style={{ marginTop: normalize(5) }}>
          <Row style={{ height: normalize(25), justifyContent: 'flex-start', alignItems: 'center', marginLeft: normalize(20), marginRight: normalize(20) }}>
            <Text style={{ fontSize: 20, fontFamily: 'Inter-Black', }}>{t('Notification tone')}</Text>
          </Row>
          <Row style={{ height: normalize(20), justifyContent: 'flex-start', alignItems: 'center', marginLeft: normalize(20), marginRight: normalize(20) }}>
            <Text style={{ fontSize: 18, fontFamily: 'Inter-Black', color: '#808080', }}>{t('Default (Skyline)')}</Text>
          </Row>
        </Col>
        {/* </View> */}

        {/* <View style={{ flex: 0.2 }}> */}

        <Col style={{ justifyContent: 'center', alignItems: 'center', }}>
          <TouchableOpacity style={{ alignItems: 'center' }}
            onPress={() => {
              // this.setModalShow(true);
              // this.setModalVisible(true);
            }}>
            <Image
              style={{ height: normalize(90), width: normalize(90) }}
              source={require("../../images/Support_Service.png")}
            />
          </TouchableOpacity>
          <Row style={{ marginTop: normalize(10) }}>
            <Text style={{ fontFamily: 'Inter-Black', fontSize: 16 }}>{t('Support')}</Text>
          </Row>
        </Col>
        {/* </View> */}
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

        <DropdownAlert ref={ref => this.dropdown = ref} />
      </View>
    );
  }


  // onPress1 = () => {
  //   this.setState({ switchOn1: !this.state.switchOn1 });
  // };
  // onPress2 = () => {
  //   this.setState({ switchOn2: !this.state.switchOn2 });
  // };
  // onPress3 = () => {
  //   this.setState({ switchOn3: !this.state.switchOn3 });
  // };
  // onPress4 = () => {
  //   this.setState({ switchOn4: !this.state.switchOn4 });
  // };
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
        // paddingBottom: "15%",
        marginTop: 30,

      },
      android: {
        height: 30,
        marginTop:10
      },
    }),
  },
  header: {
    ...Platform.select({
      ios: {
        height: normalize(60),
        marginTop: normalize(15),
        marginRight: normalize(50),
        marginLeft: normalize(50),
      },
      android: {
        height: normalize(60),
        marginTop: normalize(15),
        marginRight: normalize(50),
        marginLeft: normalize(50),
      }
    })

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
  HeaderText: {
    ...Platform.select({
      ios: {
        fontSize: 20,
        // padding: 10,
        fontWeight: "bold",
        color: "#d62326",
        // alignItems: 'center',
        height: "60%",
        marginBottom: "5%"

      },
      android: {

        fontSize: 20,
        // padding: 10,
        fontWeight: "bold",
        color: "#d62326",
        // alignItems: 'center',
      }
    })
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
  SPlaceOrder_Row: {
    marginTop: 30,
    justifyContent: 'center',
    marginBottom: 30,
  },
  PlaceOrder_Row: {
    marginTop: 10,
    justifyContent: 'center',
  },
  PlaceOrder_Button: {
    marginTop: 15,
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
  SLogo: {
    width: 50,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
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
})