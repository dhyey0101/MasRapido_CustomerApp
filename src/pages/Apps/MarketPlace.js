import React, { Component } from "react";
import {
    Dimensions,
    BackHandler,
    Platform,
    View,
    Text,
    TouchableOpacity,
    Image,
    StyleSheet,
    ScrollView,
    AppState,
    AsyncStorage,
    Alert,
    Modal,

} from "react-native";
import { Col, Row } from "react-native-easy-grid";
import * as Location from "expo-location";
import * as Permissions from "expo-permissions";
import { getUserDetailAction, handymanAssignNotificationDetailAction, getCustomerFavoriteAddressListAction } from '../Util/Action.js';
import { t } from '../../../locals';
import { NavigationEvents } from 'react-navigation';
import Pusher from "pusher-js/react-native";
import normalize from 'react-native-normalize';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import MarketPlacetabView from './MarketPlace_tab';
import { DrawerContentScrollView } from "@react-navigation/drawer";

const { width, height } = Dimensions.get('window');
const SCREEN_WIDTH = width;
const SCREEN_HEIGHT = height;
const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.0;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
const GOOGLE_MAPS_APIKEY = (Platform.OS === 'ios') ? "AIzaSyDA8VzkYgIznevJNoGFt_HLxgM2cBRgQd8" : "AIzaSyD6VKrDOOeJgMKKwKpiYFhIA8Udd-7mdlU";

export default class MarketPlace extends Component {
    constructor(props) {
        super(props);
        this.state = {
            favoriteAddressList:'',
            destinationLocationText:'',
            destination_latitude:'',
            from_latitude:'',
            destination_longitude:'',
            from_longitude:'',
            loader: false,
            modalVisible: false,
            userData: [],
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
            dataSource: [],
            fromLocationText: '',
            mapRegion: {
                latitude: 0,
                longitude: 0,
                latitudeDelta: 0.0,
                longitudeDelta: 0.0,
            },
            enableCurruntLocation: true,
            curruntLocation: {
                latitude: '',
                longitude: '',
                latitudeDelta: '',
                longitudeDelta: '',
            },

        }

    }

    static navigationOptions = ({ navigation }) => {
        return {
            headerShown: false
        };
    };

    //   toggleDrawer = ({ navigation }) => {
    //     this.props.navigation.toggleDrawer();
    //   };
    //   static navigationOptions = ({ navigation }) => {
    //     return {
    //       headerShown: false,
    //     };
    //   };
    //   _onBlurr = () => {
    //     BackHandler.removeEventListener('hardwareBackPress',
    //       this._handleBackButtonClick);
    //   }

    //   _onFocus = () => {
    //     BackHandler.addEventListener('hardwareBackPress',
    //       this._handleBackButtonClick);
    //   }

    //   _handleBackButtonClick = () => this.props.navigation.navigate('Selection')



    async componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);

        let userID = await AsyncStorage.getItem("userid");
        let userName = await AsyncStorage.getItem("name");
        let userToken = await AsyncStorage.getItem("token");

        this.setState({
            userID: userID,
            userName: userName,
            userToken: userToken,
        });

        let location = await Location.getCurrentPositionAsync({});
        var lat = parseFloat(location.coords.latitude)
        var long = parseFloat(location.coords.longitude)

        var initialRegion = {
            latitude: Number(lat),
            longitude: Number(long),
            latitudeDelta: LATITUDE_DELTA,
            longitudeDelta: LONGITUDE_DELTA
        }
        this.setState({
            curruntLocation: {
                latitude: lat,
                longitude: long,
                latitudeDelta: 0.09,
                longitudeDelta: 0.02
            }
        })
        this.setState({ initialPosition: initialRegion })

        this.getUserDetail();
        this._pusherSubscription();
        this.newOrderPusherchannelTrigger();
        this.getCustomerFavoriteAddressList();

    }
    // componentWillUnmount() {
    //     // this.focusListener.remove();
    // }


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
        // console.log(dataForGetFavoriteLocation)
        getCustomerFavoriteAddressListAction(dataForGetFavoriteLocation, Token).then((responseJson) => {
            console.log("Hello")
            console.log(this.state.favoriteAddressList)
            console.log("Hello")
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
    //pusher functions start

    async UNSAFE_componentWillMount() {
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);

        // if (!this.state. ) {
        // this.props.navigation.navigate("Selection"); 
        // }
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
                // alert(responseJson.message);
                this.setState({ loader: false });
            }
        });
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

        this.channel = this.pusher.subscribe("private-servicenotification");
        // console.log(this.channel)
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
                // console.log(getOrderDetailData)
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

    setModalVisible = (visible) => {
        this.setState({ modalVisible: visible });
    };


    logout = async () => {
        await AsyncStorage.removeItem('userid');
        await AsyncStorage.removeItem('name');
        await AsyncStorage.removeItem('token');
        this.props.navigation.navigate('Auth');
    };

    toggleDrawer = ({ navigation }) => {
        this.props.navigation.toggleDrawer();
    };

    __onBlurr = () => {
        BackHandler.removeEventListener('hardwareBackPress',
            this._handleBackButtonClick);
    }

    _onFocus = () => {
        BackHandler.addEventListener('hardwareBackPress',
            this._handleBackButtonClick);
    }

    // _handleBackButtonClick = () => BackHandler.exitApp();

    _handleBackButtonClick = () => {
        {
            Alert.alert(
                t('Exit App'),
                t('Exiting the application'), [{
                    text: t('Cancel'),
                    onPress: () => console.log('Cancel Pressed'),
                    style: 'cancel'
                }, {
                    text: t('Ok'),
                    onPress: () => BackHandler.exitApp()
                },], {
                cancelable: false
            }
            )
            return true;
        }
    }
    handleBackButton = () => {
        Alert.alert(
            t('Exit App'),
            t('Exiting the application'), [{
                text: t('Cancel'),
                onPress: () => console.log('Cancel Pressed'),
                style: 'cancel'
            }, {
                text: t('Ok'),
                onPress: () => BackHandler.exitApp()
            },], {
            cancelable: false
        }
        )
        return true;
    }

    pointMarkerBySearchB(data, details) {
        var addr_text = (details != '') ? details.formatted_address : '';
        var from_latitude = (details != '') ? details.geometry.location.lat : '';
        var from_longitude = (details != '') ? details.geometry.location.lng : '';

        if (from_latitude && from_longitude) {
            var tourAllocation = [];
            this.setState({
                markers: [],
            });
            var locations = {};

            locations = { // The ID attached to the marker. It will be returned when onMarkerClicked is called
                coords: { latitude: from_latitude, longitude: from_longitude, latitudeDelta: 0.0922, longitudeDelta: 0.0421 }
            };
            tourAllocation.push(locations);

            this.setState({
                enableCurruntLocation: false,
                followsUserLocation: false,
                markers: tourAllocation,
                startPosition: locations.coords,
                curruntLocation: locations.coords,

            });
            // console.log(this.state.markers)
        }
        this.setState({ fromLocationText: addr_text });
    }

    render() {
        const { modalVisible, review, dataSource, userData, destinationLocationText } = this.state;

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
        const { navigate } = this.props.navigation;
        return (
            <View style={styles.container}>
                <NavigationEvents
                    onWillFocus={this._onFocus}
                    onWillBlur={this._onBlurr}
                />
                
                <Row style={styles.Navebar}>
                    {Platform.OS == 'ios' ? (
                        <Col style={styles.arrow_col}>
                        </Col>
                    ):(
                    <Col style={styles.arrow_col}>
                        <TouchableOpacity onPress={this.handleBackButton}>
                            <Image
                                source={require("../../images/Back-Arrow.png")}
                                style={styles.BackArrow}
                            />
                        </TouchableOpacity>
                    </Col>
                    )}
                    

                    <Col style={styles.profile_col}>
                        <Image style={{ height: normalize(50), width: normalize(50) }}
                            source={require('../../images/profile_wallet.png')}
                        />
                    </Col>

                    <Col style={styles.Name_col}>
                        <Row style={styles.Name_row}>
                            <Col style={styles.manu_name}>
                                <Text style={styles.Nametext1}>{t('Hello')}</Text>
                            </Col>
                            <Col style={{ justifyContent: 'flex-end' }}>
                                <Text style={styles.Nametext2} numberOfLines={1}>{userData.first_name}</Text>
                            </Col>
                        </Row>
                        <Row style={{ width: normalize(220) }}>
                            <Text style={{ fontSize: 15, fontFamily: 'Inter-Black', }}>Mi ubicación actual (Punta Paitilla)</Text>
                        </Row>
                    </Col>

                    <Col style={styles.Shoping_col}>
                        <TouchableOpacity>
                            <Image style={{ height: normalize(24), width: normalize(24) }}
                                source={require('../../images/Shoping-gray.png')}
                            />
                        </TouchableOpacity>
                    </Col>

                    <Col style={styles.menu_col}>
                        <TouchableOpacity
                            onPress={this.toggleDrawer.bind(this)}>
                            <Image
                                source={require("../../images/Menu.png")}
                                style={{ height: normalize(24), width: normalize(24) }}
                            />
                        </TouchableOpacity>
                    </Col>
                </Row>

                <Row style={{ height: normalize(50), marginTop: normalize(3), }}>
                    <Col>
                        <Row style={styles.LocationB}>
                            <Col style={{ width: normalize(40), justifyContent: 'center', alignItems: 'flex-end', }}>
                                <Image source={require('../../images/market_location.png')} style={styles.locationlogo} />
                            </Col>
                            <Col>
                                <GooglePlacesAutocomplete
                                    ref={ref => { this.BPointref = ref }}
                                    placeholder={this.state.destinationLocationText}
                                    placeholderTextColor={'#000'}
                                    query={{
                                        key: GOOGLE_MAPS_APIKEY,
                                        // language: 'en', // language of the results
                                        // components: 'country:in',
                                        types: 'establishment',
                                        radius: "1000 meters",
                                        // for panama    
                                        language: 'es', // language of the results
                                        components: 'country:pa',
                                    }}
                                    onPress={(data, details = null) => { this.pointMarkerBySearchB(data, details) }}
                                    onFail={error => console.error(error)}
                                    minLength={2}
                                    autoFocus={false}
                                    numberOfLines={2}
                                    listViewDisplayed="true"
                                    returnKeyType={'default'}
                                    fetchDetails={true}
                                    showsUserLocation={true}
                                    nearbyPlacesAPI={GOOGLE_MAPS_APIKEY}
                                    enablePoweredByContainer={false}
                                    setAddressText={this.state.destinationLocationText}


                                    styles={{
                                        ...Platform.select({
                                            ios: {
                                                container: {
                                                    backgroundColor: '#efefef',
                                                    // top: 50,
                                                    width: '100%',
                                                },
                                                textInputContainer: {
                                                    backgroundColor: '#efefef',
                                                    borderTopWidth: 0,
                                                    borderBottomWidth: 0,
                                                    // width: '90%',


                                                },
                                                textInput: {
                                                    marginLeft: 0,
                                                    marginRight: 0,
                                                    // height: 30,
                                                    color: '#5d5d5d',
                                                    fontSize: 16,
                                                    padding: 10,
                                                    backgroundColor: '#efefef',
                                                    fontFamily: "Inter-Black",

                                                },
                                                description: {
                                                    fontFamily: "Inter-Black",
                                                    color: "#404043"
                                                },
                                            },
                                            android: {
                                                container: {
                                                    backgroundColor: '#efefef',
                                                    // top: 50,
                                                    width: '100%',


                                                },
                                                textInputContainer: {
                                                    backgroundColor: '#efefef',
                                                    borderTopWidth: 0,
                                                    borderBottomWidth: 0,
                                                    // width: '90%',

                                                },
                                                textInput: {
                                                    marginLeft: 0,
                                                    marginRight: 0,
                                                    // height: 30,
                                                    fontSize: 16,
                                                    // padding: 10,
                                                    fontFamily: "Inter-Black",
                                                    backgroundColor: '#efefef'
                                                },
                                                listView: {
                                                    borderWidth: 1,
                                                    borderColor: "#ddd",
                                                    backgroundColor: "red",
                                                    marginHorizontal: 20,
                                                    marginTop: 10,
                                                },
                                                description: {
                                                    fontFamily: "Inter-Black",
                                                },
                                            }
                                        })
                                    }}
                                />
                            </Col>
                            <Col style={styles.ArrowCol}>
                                <Image source={require('../../images/Right_Arrow_New.png')} style={{ height: normalize(20), width: normalize(20), }} />
                            </Col>
                        </Row>
                    </Col>
                </Row>

                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalVisible}
                    onRequestClose={() => {
                        // navigate('LocationScreen')
                    }}
                >

                    <View style={styles.centeredView}>
                        <ScrollView>
                            <View style={styles.modalView}>

                                <Row style={{ justifyContent: 'center', alignItems: 'center', height: normalize(60), marginTop: normalize(20), }}>
                                    <Col style={{ alignItems: 'center', paddingLeft: 35 }}>
                                        <TouchableOpacity onPress={() => this.setModalVisible(!modalVisible)}>
                                            <Image style={{ height: normalize(50), width: normalize(50) }}
                                                source={require('../../images/SuccessMSG.png')}
                                            />
                                        </TouchableOpacity>
                                    </Col>
                                    <Col style={{ width: '10%' }}>
                                        <TouchableOpacity onPress={() => this.setModalVisible(!modalVisible)} >
                                            <Text style={styles.popupCrossTextIcon}>X</Text>
                                        </TouchableOpacity>
                                    </Col>
                                </Row>

                                <Row style={{ justifyContent: 'center', alignItems: 'center', }}>
                                    <Text style={{ color: '#1987B8', fontSize: normalize(23), fontFamily: 'Inter-Black', textAlign:'center' }}>{t('Successfully scheduled appointment')}</Text>
                                </Row>

                                <Row style={styles.ModalRow}>
                                    <Col style={{ width: normalize(90), justifyContent: 'flex-start', alignItems: 'center', }}>
                                        <Image
                                            style={styles.Profile}
                                            source={require("../../images/Profile-Pic2.png")}
                                        />
                                        <Row style={{ alignItems: 'center', justifyContent: 'center', height: normalize(20), }}>
                                            {React_Native_Rating_Bar}
                                        </Row>
                                    </Col>
                                    <Col style={{ paddingTop: normalize(5), }}>
                                        <Row>
                                            <Text style={{ fontFamily: 'Inter-Black', fontSize: 15 }}>@{dataSource.driver_name}</Text>
                                        </Row>
                                        <Row>
                                            <Text style={{ fontFamily: 'Inter-Black', fontSize: 15 }}>{t("He's your assigned technician")}</Text>
                                        </Row>
                                        <Row>
                                            <Col style={{ width: normalize(60) }}>
                                                <Text style={{ fontFamily: 'Inter-Black', fontSize: 15 }}>{t('Service')}:</Text>
                                            </Col>
                                            <Col>
                                                <Text style={{ fontFamily: 'Inter-Black', fontSize: 15 }}>{dataSource.service_category_name} ({dataSource.service_place})</Text>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Text style={{ fontFamily: 'Inter-Black', fontSize: 15 }}>{dataSource.service_capacity}</Text>
                                        </Row>
                                    </Col>
                                </Row>

                                <Row style={styles.ModalRow2}>
                                    <Col style={{ width: normalize(90), alignItems: 'center', marginTop: normalize(10) }}>
                                        <Image
                                            style={styles.DateIcon}
                                            source={require("../../images/Date-and-Time.png")}
                                        />
                                    </Col>
                                    <Col>
                                        <Row style={{ height: normalize(26), alignItems: 'center', }}>
                                            <Text style={{ fontFamily: 'Inter-Black', fontSize: 18, color: '#1987B8' }}>Cita N° {dataSource.order_no}</Text>
                                        </Row>
                                        <Row>
                                            <Col style={{ width: normalize(120), }}>
                                                <Row style={{ height: normalize(26), }}>
                                                    <Text style={{ fontFamily: 'Inter-Black', fontSize: 22, color: '#1987B8' }}>{t('DATE')}</Text>
                                                </Row>
                                                <Row>
                                                    <Text style={{ fontFamily: 'Inter-Black', fontSize: 18, }}>{dataSource.service_date}</Text>
                                                </Row>
                                            </Col>
                                            <Col>
                                                <Row style={{ paddingLeft: normalize(5), height: normalize(26), }}>
                                                    <Text style={{ fontFamily: 'Inter-Black', fontSize: 22, color: '#1987B8' }}>{t('HOUR')}</Text>
                                                </Row>
                                                <Row>
                                                    <Text style={{ fontFamily: 'Inter-Black', fontSize: 18, }}>{dataSource.service_time}</Text>
                                                </Row>
                                            </Col>
                                        </Row>
                                    </Col>
                                </Row>

                                <Row style={{ height: normalize(70), borderBottomColor: "#808080", borderBottomWidth: 1, marginLeft: normalize(20), marginRight: normalize(10), }}>
                                    <Col style={{ width: normalize(60), }}>
                                        <Image
                                            style={{ height: normalize(50), width: normalize(50) }}
                                            source={require("../../images/Settings.png")}
                                        />
                                    </Col>
                                    <Col style={{ width: normalize(160), }}>
                                        <Row style={{ justifyContent: 'flex-start', alignItems: 'center', }}>
                                            <Text style={{ fontFamily: 'Inter-Black', fontSize: normalize(17), }}>{t('Cost of the appointment')}</Text>
                                        </Row>
                                    </Col>
                                    <Col>
                                        <Row style={{ justifyContent: 'flex-start', alignItems: 'center', }}>
                                            <Text style={{ fontFamily: 'Inter-Black', fontSize: 25, color: '#1987B8' }}>{dataSource.total}</Text>
                                        </Row>
                                    </Col>
                                </Row>

                                <Row style={{ height: normalize(95), marginLeft: normalize(30), marginRight: normalize(25), marginTop: normalize(5) }}>
                                    <Text style={{ color: '#808080', fontSize: 13, fontFamily: 'Inter-Black', }}>{t("The total price shown includes only the visit and technician's diagnosis The materials and labor required will be budgeted by the technician at his scheduled appointment")}</Text>
                                </Row>

                                <Row style={{ height: normalize(22), justifyContent: 'center', alignItems: 'center', }}>
                                    <Text style={{ fontSize: 15, fontFamily: 'Inter-Black', }}>{t('Do you have any questions?')}</Text>
                                </Row>

                                <Row style={{ height: normalize(22), justifyContent: 'center', alignItems: 'center', }}>
                                    <Text style={{ fontSize: 15, fontFamily: 'Inter-Black', paddingRight: normalize(5) }}>{t('You can')}</Text><Text style={{ fontSize: 15, fontFamily: 'Inter-Black', color: '#1987B8', }}>{t('See terms and conditions')}</Text>
                                </Row>

                                <Row style={{ height: normalize(22), justifyContent: 'center', alignItems: 'center', }}>
                                    <Text style={{ fontSize: 15, fontFamily: 'Inter-Black', }}>{t('or Write to us via WhatsApp!')}</Text>
                                </Row>

                                <Row style={{ justifyContent: 'center', alignItems: 'center', height: normalize(100), marginTop: normalize(20), marginBottom: normalize(20), }}>
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
                            </View>
                        </ScrollView>
                    </View>

                </Modal>
                <Row>
                    <MarketPlacetabView />
                </Row>
            </View>
        )
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
                height: normalize(120),
                backgroundColor: '#efefef',
                paddingTop: "12%",
                borderBottomLeftRadius: normalize(25),
                borderBottomRightRadius: normalize(25),
            },
            android: {
                height: normalize(65),
                backgroundColor: '#efefef',
                borderBottomLeftRadius: normalize(25),
                borderBottomRightRadius: normalize(25),
            },
        }),
    },
    BackArrow: {
        ...Platform.select({
            ios: {
                width: normalize(22),
                height: normalize(22),
            },
            android: {
                width: normalize(22),
                height: normalize(22),
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

    arrow_col: {
        ...Platform.select({
            ios:
            {
                width: normalize(55),
                justifyContent: 'center',
                alignItems: 'center',
                // borderRightWidth: 1,
                // borderColor: '#808080',
                marginTop: 8,
                marginBottom: 8
            },
            android:
            {
                width: normalize(55),
                justifyContent: 'center',
                alignItems: 'center',
                borderRightWidth: 1,
                borderColor: '#808080',
                marginTop: 8,
                marginBottom: 8
            },
        })
    },
    profile_col: {
        ...Platform.select({
            ios:
            {
                width: normalize(65),
                justifyContent: 'center',
                alignItems: 'center',
            },
            android:
            {
                width: normalize(65),
                justifyContent: 'center',
                alignItems: 'center',
            },
        })
    },
    Header: {
        justifyContent: "center",
        alignItems: "center",

    },
    HeaderText: {
        ...Platform.select({
            ios: {
                fontSize: 20,
                color: "#d62326",
                height: "60%",
                marginBottom: "5%",
                fontFamily: "Inter-Black"

            },
            android: {

                fontSize: 20,
                color: "#d62326",
                fontFamily: "Inter-Black"
            }
        })
    },
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
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: normalize(50),
        marginBottom: normalize(40),
        marginLeft: normalize(20),
        marginRight: normalize(20),
        borderRadius: normalize(60),
        backgroundColor: '#efefef',
        padding: 10
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
                borderBottomColor: "#808080",
                borderBottomWidth: 1,
                marginLeft: normalize(10),
                marginRight: normalize(10),
                height: normalize(100),
                marginTop: normalize(5),
            },
            android: {
                borderBottomColor: "#808080",
                borderBottomWidth: 1,
                marginLeft: normalize(10),
                marginRight: normalize(10),
                height: normalize(95),
                marginTop: normalize(5),
            }
        })

    },
    ModalRow2: {
        ...Platform.select({
            ios: {
                marginLeft: normalize(10),
                marginRight: normalize(10),
                height: normalize(80),
                marginTop: normalize(5),
            },
            android: {
                marginLeft: normalize(10),
                marginRight: normalize(10),
                height: normalize(80),
            }
        })

    },
    Profile: {
        height: normalize(55),
        width: normalize(55),
    },
    ServiceIcon: {
        height: 80,
        width: 80,
        marginLeft: 5,
        marginTop: 5,
    },
    DateIcon: {
        height: normalize(55),
        width: normalize(55),
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
        width: normalize(15),
        height: normalize(15),
    },
    Close: {
        width: 15,
        height: 15,
        justifyContent: "center",
        alignItems: "center",
        marginLeft: 20,
        marginTop: 10,
    },
    Nametext2: {
        ...Platform.select({
            ios:
            {
                color: '#B12026',
                fontSize: 25,
                fontFamily: "Inter-Black",
            },
            android:
            {
                color: '#B12026',
                fontSize: 25,
                fontFamily: "Inter-Black",
            }
        })
    },
    Nametext1: {
        ...Platform.select({
            ios:
            {
                fontFamily: 'Inter-Black',
                fontSize: 25
            },
            android:
            {
                fontFamily: 'Inter-Black',
                fontSize: 25
            },
        })
    },
    Name_col: {
        ...Platform.select({
            ios:
            {
                width: normalize(175)
            },
            android:
            {
                width: normalize(175)
            },
        })
    },
    Name_row: {
        ...Platform.select({
            ios:
            {
                height: normalize(37)
            },
            android:
            {
                height: normalize(37),
            },
        })
    },
    manu_name: {
        ...Platform.select({
            ios:
            {
                width: normalize(60),
                justifyContent: 'flex-end'
            },
            android:
            {
                width: normalize(60),
                justifyContent: 'flex-end'
            },
        })
    },
    Shoping_col: {
        ...Platform.select({
            ios:
            {
                height: normalize(37),
                justifyContent: 'center',
                width: normalize(40),
            },
            android:
            {
                height: normalize(37),
                width: normalize(40),
                justifyContent: 'center',
                alignItems: 'flex-end',
            },
        })
    },
    menu_col: {
        ...Platform.select({
            ios:
            {
                height: normalize(37),
                width: normalize(40),
                justifyContent: 'center',
            },
            android:
            {
                height: normalize(37),
                width: normalize(40),
                justifyContent: 'center',
                alignItems: 'flex-end',
            },
        })
    },
    LocationB: {
        ...Platform.select({
            ios: {
                marginTop: normalize(5),
                borderRadius: normalize(40),
                backgroundColor: '#efefef',
                marginRight: normalize(20),
                marginLeft: normalize(20),
                borderWidth: 2.5,
                borderColor: '#e5e5e5'

            },
            android: {

                marginTop: normalize(10),
                borderRadius: normalize(40),
                backgroundColor: '#efefef',
                marginRight: normalize(20),
                marginLeft: normalize(20),
                borderWidth: 2.5,
                borderColor: '#e5e5e5'
            }
        })
    },
    voice: {
        width: normalize(45),
        justifyContent: 'center',
        alignItems: 'center',

    },
    locationlogo: {
        height: normalize(23),
        width: normalize(23),
        justifyContent: 'center',
    },

    popupCrossTextIcon: {
        // marginTop: 10,
        fontSize: 25,
        fontFamily: "Inter-Black",
        color: "#b3b3b3",
        // textAlign: 'center',
    },
    ArrowCol: {
        width: 25,
        alignItems: 'flex-end',
        marginRight: 10,
        justifyContent: 'center',
        alignItems: 'center',

    },
})