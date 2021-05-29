import React, { Component } from 'react';
import { Linking, BackHandler, Platform, AsyncStorage, StyleSheet, Text, View, Image, TouchableOpacity, StatusBar, FlatList, RefreshControl, Dimensions, ActivityIndicator } from 'react-native';
import { Col, Row, Grid } from "react-native-easy-grid";
import { t } from '../../../locals';
import MapView, { ProviderPropType } from 'react-native-maps';
import { getcustomeractiveorderAction, getCustomerOrderByDateAction } from '../Util/Action.js';
import MapViewDirections from "react-native-maps-directions";
import { NavigationEvents } from 'react-navigation';
import normalize from 'react-native-normalize';
// if (Platform.OS == 'ios') {
//     var DateTimePicker = require('react-native-datepicker').default;

// } else {
//     var DateTimePickerModal = require('@react-native-community/datetimepicker').default;

// }

import DatePicker from "react-native-datepicker";

import moment from 'moment';
// const GOOGLE_MAPS_APIKEY = "AIzaSyCrhCKosfVZZb17Tn7snqF3aNLUXgtyT0Y";
const GOOGLE_MAPS_APIKEY = (Platform.OS === 'ios') ? "AIzaSyDA8VzkYgIznevJNoGFt_HLxgM2cBRgQd8" : "AIzaSyD6VKrDOOeJgMKKwKpiYFhIA8Udd-7mdlU";
const { width, height } = Dimensions.get("screen");
var today = new Date();


export default class OrderList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loader: false,
            selectedStartDate: null,
            modalVisible: false,
            setDatePickerVisibility: false,
            date: '',
            selectedServiceDate: 'Date',
            dataSource: [],

            // next previous date
            selectedDate: null,
            showSelectedDate: null,
            dateForAPICall: null,
        };
    }
    dialCall = (number) => {
        let phoneNumber = "";
        if (Platform.OS === "android") {
            phoneNumber = `tel:${number}`;
        } else {
            phoneNumber = `telprompt:${number}`;
        }
        Linking.openURL(phoneNumber);
    };
    static navigationOptions = ({ navigation }) => {
        return {
            headerShown: false,
        };
    };
    toggleDrawer = ({ navigation }) => {
        this.props.navigation.toggleDrawer();
    };
    async componentDidMount() {
        this.setDate();
        const { navigation } = this.props;
        this.focusListener = navigation.addListener("didFocus", () => {
            // this.getCustomerOrderByDate();
            this.setDate();
        });
        // this.getcustomeractiveorder();
    }
    async componentWillUnmount() {
        this.focusListener.remove();
    }
    async getcustomeractiveorder() {

        this.setState({ loader: true });
        const customer_id = await AsyncStorage.getItem("userid");
        let Token = await AsyncStorage.getItem("token");

        Token = "Bearer " + Token;
        const getOrderData = {
            customer_id: customer_id,
        };
        getcustomeractiveorderAction(getOrderData, Token).then((responseJson) => {
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
        this.setDate();
    }

    setDate = (newDate) => {
        const date = newDate || new Date();

        this.setState({
            selectedDate:
                date.getFullYear() + "-" + ("0" + (date.getMonth() + 1)).slice(-2) + "-" + ("0" + date.getDate()).slice(-2),

            showSelectedDate:
                ("0" + date.getDate()).slice(-2) + "-" + ("0" + (date.getMonth() + 1)).slice(-2) + "-" + date.getFullYear(),
        });
        // alert(this.state.showSelectedDate);
        let dateForAPICall =
            date.getFullYear() + "-" + ("0" + (date.getMonth() + 1)).slice(-2) + "-" + ("0" + date.getDate()).slice(-2);

        this.setState({
            dateForAPICall: dateForAPICall
        })
        this.filter(dateForAPICall);
    };

    getPreviousDate = () => {
        const { selectedDate } = this.state;

        const currentDayInMilli = new Date(selectedDate).getTime();
        const oneDay = 1000 * 60 * 60 * 24;
        const previousDayInMilli = currentDayInMilli - oneDay;
        const previousDate = new Date(previousDayInMilli);
        this.setDate(previousDate);
    };

    getNextDate = () => {
        const { selectedDate } = this.state;

        const currentDayInMilli = new Date(selectedDate).getTime();
        const oneDay = 1000 * 60 * 60 * 24;
        const nextDayInMilli = currentDayInMilli + oneDay;
        const nextDate = new Date(nextDayInMilli);

        this.setDate(nextDate);
    };


    setDateFromDatepicker = (datePickerDate) => {
        const date = datePickerDate.split('/');
        this.setState({
            selectedDate:
                date[2] + "-" + date[1] + "-" + date[0],

            showSelectedDate:
                date[0] + "/" + date[1] + "/" + date[2],
        });
        let dateForAPICall =
            date[2] + "-" + date[1] + "-" + date[0];

        this.setState({
            dateForAPICall: dateForAPICall
        })

        this.filter(dateForAPICall);
    };

    async filter(date) {
        this.setState({ loader: true });
        const customer_id = await AsyncStorage.getItem("userid");
        let Token = await AsyncStorage.getItem("token");

        Token = "Bearer " + Token;
        const getOrderData = {
            customer_id: customer_id,
            date: date
        };
        getCustomerOrderByDateAction(getOrderData, Token).then((responseJson) => {
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
        // console.log(item)
        const origin = {
            latitude: parseFloat(item.from_latitude),
            longitude: parseFloat(item.from_longitude),
        };
        const destination = {
            latitude: parseFloat(item.destination_latitude),
            longitude: parseFloat(item.destination_longitude),
        };
        const { navigate } = this.props.navigation;
        const { width, height } = Dimensions.get("window");
        const SCREEN_WIDTH = width - 50;
        const SCREEN_HEIGHT = 150;
        const ASPECT_RATIO = SCREEN_WIDTH / SCREEN_HEIGHT;
        const LATITUDE_DELTA = 0.005;
        const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
        return (
            <View style={styles.mainContainer}>

                {item.service_id > 0 ? (
                    <View>
                        <Row style={{ height: normalize(50), borderTopWidth: 1, borderColor: '#E5E5E5', alignItems: 'center', marginLeft: normalize(5), marginRight: normalize(5) }} onPress={() => navigate('ServiceStatus', { order_id: item.id })}>
                            <Col style={{ width: normalize(30), marginRight: normalize(10) }}>
                                {item.status == "Completed" ? (<Image source={require('../../images/SuccessMSG.png')} style={{ height: normalize(28), width: normalize(28) }} />) :
                                    (<Image source={require('../../images/orderNotificationRed.png')} style={{ height: normalize(28), width: normalize(28) }} />)}
                            </Col>
                            <Col style={{ justifyContent: 'center', alignItems: 'flex-start', width: normalize(110), }}>
                                {item.status == "Completed" ? (
                                    <Text style={{ fontSize: 20, fontFamily: 'Inter-Black', color: '#1988B9' }}>{item.status} - </Text>) : (
                                        <Text style={{ fontSize: 20, fontFamily: 'Inter-Black', color: '#C1272D' }}>{item.status} - </Text>)}
                            </Col>
                            <Col style={{ justifyContent: 'center', alignItems: 'flex-start', width: normalize(100), }}>
                                {item.status == "Completed" ? (<Text style={{ fontSize: 20, fontFamily: 'Inter-Black', color: '#1988B9' }}>{item.order_type}</Text>) :
                                    (<Text style={{ fontSize: 20, fontFamily: 'Inter-Black', color: '#C1272D' }}>{item.order_type}</Text>)}
                            </Col>
                            <Col style={styles.arrow}>
                                {item.status == "Completed" ? (<Text style={{ fontSize: 20, fontFamily: 'Inter-Black', color: '#1988B9' }}> # {item.order_no}</Text>) :
                                    (<Text style={{ fontSize: 20, fontFamily: 'Inter-Black', color: '#C1272D' }}> # {item.order_no}</Text>)}
                            </Col>
                            <Col style={{ width: normalize(20), justifyContent: 'center', alignItems: 'flex-start', }}>
                                <Image source={require('../../images/Right-gray.png')} style={{ height: normalize(25), width: normalize(25), }} />
                            </Col>
                        </Row>
                    </View>
                ) : (
                        <View>
                            <Row style={{ height: normalize(50), borderTopWidth: 1, borderColor: '#E5E5E5', alignItems: 'center', marginLeft: normalize(5), marginRight: normalize(5) }} onPress={() => navigate('OrderStatus', { order_id: item.id })}>
                                <Col style={{ width: normalize(30), marginRight: normalize(10) }}>
                                    {item.status == "Completed" ? (<Image source={require('../../images/SuccessMSG.png')} style={{ height: normalize(28), width: normalize(28) }} />) :
                                        (<Image source={require('../../images/orderNotificationRed.png')} style={{ height: normalize(28), width: normalize(28) }} />)}
                                </Col>
                                <Col style={{ justifyContent: 'center', alignItems: 'flex-start', width: normalize(110), }}>
                                    {item.status == "Completed" ? (<Text style={{ fontSize: 20, fontFamily: 'Inter-Black', color: '#1988B9' }}>{item.status} - </Text>) : (<Text style={{ fontSize: 20, fontFamily: 'Inter-Black', color: '#C1272D' }}>{item.status} - </Text>)}
                                </Col>
                                <Col style={{ justifyContent: 'center', alignItems: 'flex-start', width: normalize(100), }}>
                                    {item.status == "Completed" ? (<Text style={{ fontSize: 20, fontFamily: 'Inter-Black', color: '#1988B9' }}>{item.order_type}</Text>) : (<Text style={{ fontSize: 20, fontFamily: 'Inter-Black', color: '#C1272D' }}>{item.order_type}</Text>)}
                                </Col>
                                <Col style={styles.arrow}>
                                    {item.status == "Completed" ? (<Text style={{ fontSize: 20, fontFamily: 'Inter-Black', color: '#1988B9' }}> # {item.order_no}</Text>) : (<Text style={{ fontSize: 20, fontFamily: 'Inter-Black', color: '#C1272D' }}> # {item.order_no}</Text>)}
                                </Col>
                                <Col style={{ width: normalize(20), justifyContent: 'center', alignItems: 'flex-start', }}>
                                    <Image source={require('../../images/Right-gray.png')} style={{ height: normalize(25), width: normalize(25), }} />
                                </Col>
                            </Row>
                        </View>
                    )}
                {/* map view  */}
                {/* <Col> 
                    {item.service_id > 0  ? (
                    <View>
                        <MapView style={styles.mapStyle} 
                            provider={this.props.provider}
                            initialRegion={{
                                latitude: parseFloat(item.destination_latitude),
                                longitude: parseFloat(item.destination_longitude),
                                latitudeDelta: LATITUDE_DELTA,
                                longitudeDelta: LONGITUDE_DELTA,
                            }}
                            ref={(c) => (this.mapView = c)}
                            liteMode={true}
                            // zoomEnabled={true}
                            // showsTraffic={true}
                            onPress ={() => navigate('ServiceStatus', {order_id: item.id})}

                        >
                       
                            <MapView.Marker
                                
                                    coordinate={{
                                        latitude: parseFloat(item.destination_latitude),
                                        longitude: parseFloat(item.destination_longitude),
                                    }}
                                >
                                <Image
                                    source={require("../../images/Location-B.png")}
                                    style={{ width: 33, height: 33 }}
                                />
                            </MapView.Marker>
                        
                        
                        
                        
                        </MapView>
                    </View> 
                    ):(  
                    <View>
                        <MapView style={styles.mapStyle} 
                            provider={this.props.provider}
                            initialRegion={{
                                latitude: parseFloat(item.from_latitude),
                                longitude: parseFloat(item.from_longitude),
                                latitudeDelta: LATITUDE_DELTA,
                                longitudeDelta: LONGITUDE_DELTA,
                            }}
                            ref={(c) => (this.mapView = c)}
                            liteMode={true}
                            // zoomEnabled={true}
                            // showsTraffic={true}
                            onPress ={() => navigate('OrderStatus', {order_id: item.id})}

                        >
                        <MapView.Marker
                            coordinate={{
                                latitude: parseFloat(item.from_latitude),
                                longitude: parseFloat(item.from_longitude),
                            }}
                            >
                            <Image
                                source={require("../../images/Location-A.png")}
                                style={{ width: 40, height: 40 }}
                            />
                        </MapView.Marker>
                        <MapView.Marker
                            
                                coordinate={{
                                    latitude: parseFloat(item.destination_latitude),
                                    longitude: parseFloat(item.destination_longitude),
                                }}
                            >
                            <Image
                                source={require("../../images/Location-B.png")}
                                style={{ width: 33, height: 33 }}
                            />
                        </MapView.Marker>
                        
                        <MapViewDirections
                            origin={origin}
                            destination={destination}
                            apikey={GOOGLE_MAPS_APIKEY}
                            strokeColor="#ee3c48"
                            strokeWidth={6}
                            optimizeWaypoints={true}
                            onStart={(params) => {
                            }}
                            onReady={(result) => {
                                this.mapView.fitToCoordinates(result.coordinates, {
                                edgePadding: {
                                    right: width / 20,
                                    bottom: height / 20,
                                    left: width / 20,
                                    top: height / 20,
                                },
                                });
                            }}
                            onError={(errorMessage) => {
                                console.log("GOT AN ERROR");
                            }}
                        />
                        </MapView>
                    </View>
                    )
                }
                </Col> */}
            </View>
        );
    };
    render() {
        const { navigate } = this.props.navigation;
        const { loader, modalVisible, setDatePickerVisibility, } = this.state;
        const { selectedStartDate } = this.state;
        // const minDate = new Date(2018, 1, 1); // Min date
        // const maxDate = new Date(2050, 6, 3); // Max date
        const startDate = selectedStartDate ? selectedStartDate.toString() : ''; //Start date

        if (!loader) {
            return (
                <View style={styles.container}>
                    <NavigationEvents
                        onWillFocus={this._onFocus}
                        onWillBlur={this._onBlurr}
                    />
                    <StatusBar />
                    
                    <Row style={styles.Navebar}>
                        <TouchableOpacity onPress={() => navigate('MarketPlace')} style={{ width: '50%'}}>
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
                    <Row style={{ height: normalize(50), marginTop: normalize(20), marginLeft: normalize(50), justifyContent: 'center', alignItems: 'center', }}>
                        <Col style={{ width: normalize(70) }}>
                            <Image source={require('../../images/orderNotificationBlue.png')} style={{ height: normalize(52), width: normalize(52), }} />
                        </Col>
                        <Col>
                            <Text style={{ fontFamily: 'Inter-Black', fontSize: 32, color: '#C1272D' }}>{t('My Orders')}</Text>
                        </Col>
                    </Row>


                    <Row style={{ backgroundColor: '#F2F2F2', height: normalize(30), marginLeft: normalize(80), marginRight: normalize(70), marginBottom: normalize(35), borderRadius: normalize(20), marginTop: normalize(15), justifyContent: 'center', alignItems: 'center', }}>
                        <Col style={{ width: normalize(60), alignItems: 'flex-start', paddingLeft: normalize(5) }}>
                            <TouchableOpacity style={{ alignItems: 'center', }}
                                onPress={this.getPreviousDate}
                            >
                                <Image source={require('../../images/Left-gray.png')} style={{ height: normalize(22), width: normalize(22), }} />
                            </TouchableOpacity>
                        </Col>
                        <Col style={{ alignItems: 'center', width: normalize(80) }}>
                            <DatePicker
                                date={this.state.showSelectedDate}
                                mode="date"
                                placeholder={t("Date")}
                                format="DD/MM/YYYY"
                                // minDate={new Date()}
                                // maxDate="2020-08-21"
                                confirmBtnText="Confirm"
                                cancelBtnText="Cancel"

                                customStyles={{

                                    dateIcon: {
                                        position: 'absolute',
                                        left: 0,
                                        top: 4,
                                        width: 0,
                                        height: 0,
                                        // marginLeft: 0
                                    },
                                    placeholderText: {
                                        fontSize: 20,
                                        fontFamily: 'Inter-Black',
                                        color: '#999999',
                                    },
                                    dateText: {
                                        fontSize: 20,
                                        fontFamily: 'Inter-Black',
                                        color: '#999999',
                                    },
                                    dateInput: {
                                        borderColor: '#fff',
                                        borderWidth: 0,
                                    }
                                    // ... You can check the source to find the other keys.
                                }}
                                // onDateChange={(date) => { this.setState({ date: date }) }}
                                onDateChange={(showSelectedDate) => {
                                    this.setDateFromDatepicker(showSelectedDate)
                                }}
                            />
                        </Col>
                        <Col style={{ width: normalize(60), alignItems: 'flex-end', paddingRight: normalize(5) }}>
                            <TouchableOpacity
                                onPress={this.getNextDate}
                            >
                                <Image source={require('../../images/Right-gray.png')} style={{ height: normalize(20), width: normalize(20), }} />
                            </TouchableOpacity>
                        </Col>
                    </Row>


                    {/*<Row style={{ height: normalize(40), justifyContent: 'center', alignItems: 'center', marginRight: normalize(20), marginTop: normalize(10) }}>
                                            <Col style={{ marginLeft: normalize(190), width: normalize(70), marginRight: normalize(25) }}>
                                                <Text style={{ fontSize: 15, fontFamily: 'Inter-Black', color: '#808080' }}>{t('Filter by:')}</Text>
                                            </Col>
                                            <Col style={{ backgroundColor: '#F2F2F2', height: normalize(25), width: normalize(90), borderRadius: normalize(20), justifyContent: 'center', }}>
                                                <Row style={{ justifyContent: 'center', alignItems: 'center', }}>
                                                    <Col style={{ marginLeft: normalize(15), }}>
                                                        <Text style={{ fontSize: 13, fontFamily: 'Inter-Black', color: '#808080', }}>En curso</Text>
                                                    </Col>
                                                    <TouchableOpacity>
                                                        <Col style={{ width: normalize(23), justifyContent: 'center', alignItems: 'flex-start', paddingTop: normalize(7) }}>
                                                            <Image source={require('../../images/Down-gray.png')} style={{ height: normalize(14), width: normalize(14), }} />
                                                        </Col>
                                                    </TouchableOpacity>
                                                </Row>
                                            </Col>
                                        </Row>*/}

                    <FlatList style={styles.FlatList}
                        // maxToRenderPerBatch={4}
                        onEndReachedThreshold={200}
                        // windowSize={15}
                        data={this.state.dataSource}
                        renderItem={this.renderItem}
                        // initialNumToRender={4}
                        keyExtractor={(item) => item.id.toString()}
                        ListEmptyComponent={<EmptyComponent title={t("Data not available")} />}
                        refreshControl={
                            <RefreshControl
                                colors={["#d62326"]}
                                refreshing={this.state.loading}
                                onRefresh={this.onRefresh.bind(this)}
                            />
                        }
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
            )
        }
    }
}
OrderList.propTypes = {
    provider: ProviderPropType,
};
// empty component
const EmptyComponent = ({ title }) => (

    <View style={styles.emptyContainer}>

        <Text style={styles.emptyText}>{title}</Text>

    </View>

);

const styles = StyleSheet.create({
    emptyContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        marginTop: normalize(180),
        // marginTop: height - (height * 40) / 100,

    },
    emptyText: {
        // flex: 1,
        justifyContent: "center",
        fontSize: 23,
        fontFamily: 'Inter-Black',
        alignItems: 'center',
    },
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: "#fdfdfd",
        marginBottom: 50
    },
    mainContainer: {
        flex: 1,
        width: '100%',
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
    arrow: {
        ...Platform.select({
            ios: {
                justifyContent: 'center',
                alignItems: 'flex-start',
                width: normalize(83),
            },
            android: {
                justifyContent: 'center',
                alignItems: 'flex-start',
                width: normalize(95),
            }
        })
    },
    arrow_service: {
        ...Platform.select({
            ios: {
                justifyContent: 'center',
                alignItems: 'flex-start',
                width: normalize(115),
            },
            android: {
                justifyContent: 'center',
                alignItems: 'flex-start',
                width: normalize(125),
            }
        })
    },
    BackArrow: {
        
                width: 25,
                height: 25,
                justifyContent: 'center',
                alignItems: 'center',
    },
    Menu: {
                width: 25,
                height: 25,
                justifyContent: 'center',
                alignItems: 'center',
    },
    NaveBackArrowCol: {
        ...Platform.select({
            ios: {
                borderRightWidth: 2, width: '15%', justifyContent: 'center', borderColor: '#CCCCCC'
            },
            android: {

                borderRightWidth: 2, width: '15%', justifyContent: 'center', alignItems: 'center', marginTop: 8, marginBottom: 8, borderColor: '#CCCCCC'

            }
        })

    },
    ShippingCol: {
        ...Platform.select({
            ios: {
                alignItems: 'center',
                height: 32,

            }, android: {
                alignItems: 'center',
            }
        })
    },
    Shipping: {
        ...Platform.select({
            ios: {
                fontSize: 20,
                // padding: 10,
                fontFamily: "Inter-Black",
                color: "#d62326",
                alignItems: 'center',
            },
            android: {
                fontSize: 20,
                padding: 10,
                fontFamily: "Inter-Black",
                color: "#d62326",
                alignItems: 'center',
            }
        })


    },
    orderNumber: {
        fontSize: 20,
        padding: 10,
        fontFamily: "Inter-Black",
        color: "#d62326",
        flex: 1,

    },
    mapStyle: {
        width: Dimensions.get('window').width,
        height: 130,
    },
    Calendar: {
        width: 15,
        height: 15,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 10,
        marginTop: 7,
    },
    Date: {
        ...Platform.select({
            ios: {
                marginTop: 6,
                height: 20,
                marginLeft: 10,
                fontFamily: "Inter-Black"
            },
            android: {
                marginTop: 6,
                height: 20,
                marginLeft: 10,
                fontFamily: "Inter-Black",
            }
        })

    },
    SocialIcons: {
        width: 30,
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
        // marginLeft: 5,
        marginTop: 2,
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
        // fontWeight: "bold",
        fontFamily: "Inter-Black",
        color: "#000",
    },
    mapRouteImg: {
        height: 60,
        width: 60,
        margin: 10,
    },

    FlatList: {
        ...Platform.select({
            ios: {
                width: '98%',
                height: "88%",
            },
            android: {
                justifyContent:'center'
            }
        })
    }
});