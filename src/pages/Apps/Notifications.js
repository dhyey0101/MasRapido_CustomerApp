import React, { Component } from "react";
import {
  BackHandler,
  ActivityIndicator,
  AsyncStorage,
  RefreshControl,
  Alert,
  StyleSheet,
  Text,
  View,
  Image,
  FlatList,
  TouchableOpacity,
  StatusBar,
  ScrollView,
  Platform,
  Dimensions,
} from "react-native";
import normalize from 'react-native-normalize';
import { Col, Row, Grid } from "react-native-easy-grid";
import { t } from '../../../locals';
import { getNotificationListAction } from '../Util/Action.js';
import CustomToast from './Toast.js';
import { NavigationEvents } from 'react-navigation';

const { width, height } = Dimensions.get("screen");

export default class Notifications extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loader: false,
      dataSource: [],
    };
  }
  static navigationOptions = ({ navigation }) => {
    return {
      headerShown: false,
    };
  };

  componentDidMount() {
    this.getNotificationList();
  }

  /** get login user detail */
  async getNotificationList() {
    this.setState({ loader: true });
    const userID = await AsyncStorage.getItem("userid");
    let Token = await AsyncStorage.getItem("token");

    Token = "Bearer " + Token;
    const paymentListData = {
      user_id: userID,
    };
    getNotificationListAction(paymentListData, Token).then((responseJson) => {
      if (responseJson.isError == false) {
        this.setState({
          dataSource: responseJson.result,
          loader: false,
        });
        console.log(this.state.dataSource)
      } else {
        this.refs.defaultToastBottomWithDifferentColor.ShowToastFunction(
          responseJson.message
        );
        // alert(responseJson.message);
        this.setState({ loader: false });
      }
    });
  }

  toggleDrawer = ({ navigation }) => {
    this.props.navigation.toggleDrawer();
  };

  onRefresh() {
    this.setState({ dataSource: [] });
    this.getNotificationList();
  }
  _onBlurr = () => {
    BackHandler.removeEventListener('hardwareBackPress',
      this._handleBackButtonClick);
  }

  _onFocus = () => {
    BackHandler.addEventListener('hardwareBackPress',
      this._handleBackButtonClick);
  }

  _handleBackButtonClick = () => this.props.navigation.navigate('MarketPlace')

  // render item for flatlist
  renderItem = ({ item }) => {
    return (
      <View style={styles.mainContainer}>

        <View
          style={{

            borderRadius: 48,
            // borderBottomColor: "#ccc",
            paddingTop: 5,
            marginBottom: 5,
            backgroundColor: '#f2f2f2'
            // backgroundColor:item.color_code,

          }}
        >
          <Row>
            <Col style={{ width: "20%", justify: 'center', justifyContent: 'center', flex: 1, marginLeft: 20 }}>
              {item.slug == "payment_deduct" ? (
                <Image
                  source={require("../../images/Dollar-black.png")}
                  style={styles.Icon}
                >
                </Image>
              ) : (
                  <Image
                    source={require("../../images/Eye-black.png")}
                    style={styles.Icon}
                  >
                  </Image>
                )}
              {item.slug == "order_cancel" ? (
                <Image
                  source={require("../../images/orderNotificationRed.png")}
                  style={styles.Icon}
                >
                </Image>
              ) : (
                  <View></View>
                )}

            </Col>

            <Col style={{ width: "88%" }}>
              <Row style={{ marginLeft: 30 }}>
                <Col>
                  <Row>
                    <Text style={[styles.shipingNo, { color: item.color_code }]}>
                      {item.subject}
                    </Text>
                  </Row>
                </Col>
              </Row>
              <Row style={{ marginLeft: 30 }}>
                <Col>
                  <View>
                    <Text style={styles.satusDate}>
                      {item.content}
                    </Text>
                  </View>
                </Col>
              </Row>
              <Row style={{ marginLeft: 30 }}>
                <Col>
                  <Row>
                    <Image
                      source={require("../../images/Calendar.png")}
                      style={styles.calenderIcon}
                    />
                    <Text style={styles.date}>{item.date}</Text>
                    <Image
                      source={require("../../images/Service_Time.png")}
                      style={styles.TimeIcon}
                    />
                    <Text style={styles.date}>{item.time}</Text>
                  </Row>
                </Col>
              </Row>
            </Col>

          </Row>
        </View>
      </View >
    );
  };

  render() {
    const { navigate } = this.props.navigation;
    const { loader } = this.state;

    if (!loader) {
      return (
        <View style={styles.container}>
          <NavigationEvents
            onWillFocus={this._onFocus}
            onWillBlur={this._onBlurr}
          />
          <StatusBar />
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


          <Row style={{ marginLeft: normalize(55), height: normalize(45), marginBottom: normalize(10) }}>
            <Col style={{ height: normalize(40), justifyContent: 'center', alignItems: 'flex-start', }}>

              <Text style={styles.text}>{t("Notifications")}</Text>
            </Col>
          </Row>
          <Row
            style={{
              height: height - (height * 23) / 100,
              borderBottomWidth: 2,
              borderBottomColor: "#ccc",
              marginLeft: 10,
              marginRight: 10,
            }}
          >
            <FlatList
              data={this.state.dataSource}
              renderItem={this.renderItem}
              keyExtractor={(item) => item.id.toString()}
              ListEmptyComponent={
                <EmptyComponent title="Data not available." />
              }
              refreshControl={
                <RefreshControl
                  colors={["#d62326"]}
                  refreshing={this.state.loading}
                  onRefresh={this.onRefresh.bind(this)}
                />
              }
            />
          </Row>
          <CustomToast
            ref="defaultToastBottomWithDifferentColor"
            backgroundColor="#000"
            position="top"
          />
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
  mainContainer: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: '#ffffff'
  },
  container: {
    flex: 1,
    backgroundColor: '#ffffff'

  },
  Navebar: {
    ...Platform.select({
      ios: {
        height: "8%",
        // paddingBottom: "15%",
        marginTop: 10,

      },
      android: {
        height: 30,
        marginTop:10
      },
    }),
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginTop: height - (height * 65) / 100,
  },
  emptyText: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    fontSize: 18,
    color: "#000",
  },
  Menu: {
    ...Platform.select({
      ios: {
        width: 25,
        height: 25,
        justifyContent: "center",
        alignItems: "center",
        marginRight: 10,
        marginTop: 20,
      },
      android: {
        width: 25,
        height: 25,
        justifyContent: "center",
        alignItems: "center",
        marginRight: 10,
      },
    }),
  },
  BackArrow: {
    ...Platform.select({
      ios: {
        width: 25,
        height: 25,
        justifyContent: "center",
        alignItems: "center",
        marginLeft: 10,
        marginTop: 20,
      },
      android: {
        width: 25,
        height: 25,
        justifyContent: "center",
        alignItems: "center",
        marginLeft: 10,
      }
    })

  },

  text: {
    ...Platform.select({
      ios: {
        fontSize: 30,
        fontFamily: 'Inter-Black',
      },
      android: {
        fontSize: 30,
        color: "#000",
        fontFamily: 'Inter-Black',
      },
    }),
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


  Login: {
    flex: 1,
    marginLeft: 30,
    marginRight: 30,
    marginTop: 10,
    marginBottom: 10,
    alignItems: "center",
    justifyContent: "center",
    width: width - 50,
    height: 55,
    borderRadius: 40,
    backgroundColor: "#d3d4d6",
  },
  shipmentText: {
    color: "#000",
    fontFamily: 'Inter-Black',
    fontSize: 25,
  },
  shipingNo: {
    color: "#000",
    fontFamily: 'Inter-Black',
    fontSize: 20,
    marginTop: 5,
  },
  satusDate: {
    fontSize: 16,
    marginBottom: 5,
    fontFamily: 'Inter-Black',
    marginTop: 5,
  },

  calenderIcon: {
    width: 18,
    height: 18,
    marginTop: 10,
    marginBottom: 10,
  },
  TimeIcon: {
    width: 18,
    height: 18,
    marginTop: 10,
    marginBottom: 10,
    marginLeft: 10,
    fontFamily: 'Inter-Black',
  },
  date: {
    fontFamily: 'Inter-Black',
    marginTop: 8,
    marginLeft: 10,
    color: "#000",
    fontSize: 15,
  },
  Icon: {
    width: 40,
    height: 40
  }
});
