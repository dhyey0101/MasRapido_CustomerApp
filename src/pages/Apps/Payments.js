import React, { Component } from 'react';
import { ActivityIndicator, Platform, BackHandler, FlatList, RefreshControl, Dimensions, StyleSheet, Text, View, Image, Button, TextInput, TouchableOpacity, StatusBar, ScrollView, AsyncStorage } from 'react-native';
import { Col, Row, Grid } from "react-native-easy-grid";
import NavigationDrawerStructure from './navigationdrawerstructure.js';
import { t } from '../../../locals';
import Selection from './SelectionScreen.js';
import { getcustomerbillinginfoAction } from '../Util/Action.js';
import { DataTable } from 'react-native-paper';
import { NavigationEvents } from 'react-navigation';
import normalize from 'react-native-normalize';
const { width, height } = Dimensions.get("screen");

export default class Payments extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loader: false,
            dataSource: [],
        };
    }

    static navigationOptions = ({ navigation }) => {
        return {
            headerShown: false
        };
    };
    toggleDrawer = ({ navigation }) => {
        this.props.navigation.toggleDrawer();
    };
    async componentDidMount() {
        this.getcustomerbillinginfo();
    }

    async getcustomerbillinginfo() {

        this.setState({ loader: true });
        const customer_id = await AsyncStorage.getItem("userid");
        let Token = await AsyncStorage.getItem("token");

        Token = "Bearer " + Token;
        const getOrderData = {
            customer_id: customer_id,
        };

        getcustomerbillinginfoAction(getOrderData, Token).then((responseJson) => {
            if (responseJson.isError == false) {
                this.setState({
                    dataSource: responseJson.result,
                    loader: false,

                });
            } else {
                this.setState({ loader: false });
                alert(responseJson.message);
            }
        });
    }
    // this method calls when user refresh the page
    onRefresh() {
        this.setState({ loader: true, dataSource: [] });
        this.getcustomerbillinginfo();
    }
    _onBlurr = () => {
        BackHandler.removeEventListener('hardwareBackPress',
            this._handleBackButtonClick);
    }

    _onFocus = () => {
        BackHandler.addEventListener('hardwareBackPress',
            this._handleBackButtonClick);
    }

    _handleBackButtonClick = () => this.props.navigation.navigate('Selection')

    // render item for flatlist
    renderItem = ({ item }) => {
        const { navigate } = this.props.navigation;
        const { width, height } = Dimensions.get("window");
        const SCREEN_WIDTH = width - 50;
        const SCREEN_HEIGHT = 150;
        const ASPECT_RATIO = SCREEN_WIDTH / SCREEN_HEIGHT;
        return (
            <View style={styles.mainContainer}>
                {/* <TouchableOpacity > */}
                <Row style={{ borderBottomWidth: 2, marginRight: 10, marginLeft: 10 }}>

                    <Col style={{ width: "30%" }}>
                        <Row>
                            <Text style={styles.Date}>{item.date}</Text>
                        </Row>
                    </Col>
                    <Col style={{ width: "20%" }}>
                        <Row >

                            <Text style={styles.Order}>{item.order_no}</Text>

                        </Row>
                    </Col>
                    <Col style={{ width: "30%" }}>
                        <Row>
                            <Text style={styles.Date}>{item.currency} {item.total} </Text>
                        </Row>
                    </Col>
                    <Col style={{ width: '40%' }}>
                        <Row>
                            <Text style={{
                                borderWidth: 1,
                                borderRadius: 10,
                                width: "50%",
                                textAlign: 'center',
                                borderStyle: 'dashed',
                                marginTop: 10,
                                // marginBottom: 10,
                                height: "55%",
                                fontSize: 15,
                                // textAlign:'center',
                                fontWeight: 'bold',
                                color: item.paymentStatus === 'Paid' ? 'green' : '#f00204'
                            }}
                            >{item.paymentStatus}</Text>
                        </Row>
                    </Col>

                </Row>
                {/* </TouchableOpacity> */}

            </View>
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
                <Row style={styles.Navebar}>
                        <Col style={{ marginLeft: normalize(0), justifyContent: 'flex-end', alignItems: 'flex-start', }}>
                            <TouchableOpacity onPress={() => navigate('MarketPlace')}style={{width: normalize(110), paddingLeft: normalize(40)}} >
                                <Image source={require('../../images/Back-Arrow.png')} style={styles.BackArrow} />
                            </TouchableOpacity>
                        </Col>
                        <Col style={{ marginRight: normalize(0), justifyContent: 'flex-end', alignItems: 'flex-end', }}>
                            <TouchableOpacity onPress={this.toggleDrawer.bind(this)} style={{width: normalize(110), paddingLeft: normalize(40)}}>
                                <Image source={require('../../images/Menu.png')} style={styles.Menu} />
                            </TouchableOpacity>
                        </Col>
                    </Row>
                <Row style={{
                    height: '12%',
                    marginLeft: 10,
                    marginTop: 10,
                    marginRight: 10,
                    borderBottomWidth: 2,
                }}
                >
                    {/* <Text style={styles.text}> */}
                    <Col style={{ width: '15%' }}>
                        <Image source={require('../../images/Pagos.png')} style={styles.Listlogo} />
                    </Col>
                    <Col style={{ marginTop: '2%' }}>
                        <Text style={styles.text}>
                            {t('Payments')}
                        </Text>
                    </Col>
                    {/* </Text> */}
                </Row>
                <Row style={{ marginLeft: 10, marginRight: 10, height: 40, borderBottomWidth: 2, justifyContent: 'center' }}>
                    <Col style={{ width: "29%" }}>
                        <Text style={styles.tableText}>{t('Date')}</Text>
                    </Col>
                    <Col style={{ width: "20%" }}>
                        <Text style={styles.tableText}>{t('Order')}</Text>
                    </Col>
                    <Col>
                        <Text style={styles.tableText}>{t('Amount')}</Text>
                    </Col>
                    <Col style={{ alignItems: 'center' }}>
                        <Text style={styles.tableText}>Status</Text>
                    </Col>

                </Row>
                <FlatList style={styles.FlatList}
                    data={this.state.dataSource}
                    renderItem={this.renderItem}
                    // keyExtractor={(item) => item.id.toString()}
                    ListEmptyComponent={<EmptyComponent title="Data not available." />}
                    refreshControl={
                        <RefreshControl
                            colors={["#d62326"]}
                            refreshing={this.state.loading}
                            onRefresh={this.onRefresh.bind(this)}
                        />
                    }
                />

            </View>

        )
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
    loading: {
		position: "absolute",
		left: 0,
		right: 0,
		top: 0,
		bottom: 0,
		alignItems: "center",
		justifyContent: "center",
    },
    emptyContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        marginTop: height - (height * 70) / 100,
    },
    container: {
        justifyContent: 'center',
    },
    Navebar: {
        ...Platform.select({
            ios: {
                height: "5%",
                // paddingBottom: 50, 
                marginTop: 40
            },
            android: {
                height: normalize(35),
            }
        })
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
    text: {
        ...Platform.select({
            ios: {
                color: '#f00204',
                marginLeft: 20,
                fontWeight: "bold",
                fontSize: 30,
                justifyContent: 'center',
            },
            android: {
                color: '#f00204',
                marginLeft: 20,
                // height: 90,
                fontWeight: "bold",
                fontSize: 30,
                justifyContent: 'center',
            }
        })
    },
    Listlogo: {
        ...Platform.select({
            ios: {

                width: 60,
                height: 60,
            },
            android: {
                width: 60,
                height: 60,
            }
        })
    },
    tableText: {
        fontWeight: 'bold',
        fontSize: 20,
        marginTop: 5,



    },
    Date: {
        marginTop: 10,
        marginBottom: 10,
        height: 20,
        fontSize: 15,
        fontWeight: 'bold',

    },
    Status: {
        marginTop: 10,
        marginBottom: 10,
        height: 20,
        fontSize: 15,
        fontWeight: 'bold',


    },
    Order: {
        marginTop: 10,
        marginBottom: 10,
        height: 20,
        fontSize: 15,
        color: '#023562',
        fontWeight: 'bold',
    },
    FlatList: {
        ...Platform.select({
            ios: {
                width: '98%',
                height: "68%"
            },
            android: {
                width: '98%',
                height: "75%"
            }
        })
    }
});
