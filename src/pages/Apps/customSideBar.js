import React, { Component } from 'react';
import { ActivityIndicator, Platform, View, StyleSheet, Image, Text, TouchableOpacity, AsyncStorage, ScrollView, Button, TextInput, StatusBar, ImageBackground, Dimensions } from 'react-native';
import { Col, Row, Grid } from "react-native-easy-grid";
import { t } from '../../../locals';
import normalize from 'react-native-normalize';
import { getUserWalletBalanceAction, getUserDetailAction } from '../Util/Action.js';
import Pusher from "pusher-js/react-native";



const { width, height } = Dimensions.get('window');
export default class CustomSidebarMenu extends Component {



    constructor(props) {
        super(props);
        this.state = {
            userData: [],
            WalletData: [],
            userToken: '',
            triggerChannelState: 0,
            loader: false
        }

    };
    async componentDidMount() {
        this.setState({ loader: true });
        this.getUserDetail();
        this.getUserWalletBalance();
        let userToken = await AsyncStorage.getItem("token");
        this.setState({
            userToken: userToken,
        });
        this._pusherSubscription();
        this.updatWalletBalance();
        this.setState({ loader: false });
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

        this.channel = this.pusher.subscribe("private-recharge_approve");
        this.setState({
            triggerChannelState: 1,
        });


    }

    async updatWalletBalance() {
        const userID = await AsyncStorage.getItem("userid");
        let Token = await AsyncStorage.getItem("token");
        Token = "Bearer " + Token;

        this.channel.bind("App\\Events\\WalletRechargeApprove", (data) => {
            console.log(data)
            if (data.user_id == userID) {

                const walletBalance = {
                    user_id: userID,
                };

                getUserWalletBalanceAction(walletBalance, Token).then((responseJson) => {
                    if (responseJson.isError == false) {
                        this.setState({
                            dataSource: responseJson.result,
                        });
                        // console.log(this.state.dataSource)
                    } else {
                        this.refs.defaultToastBottomWithDifferentColor.ShowToastFunction(
                            responseJson.message
                        );
                        // this.dropdown.alertWithType('error', 'Error', responseJson.message);

                        // alert(responseJson.message);
                    }
                });
            }
        })
    }

    async getUserWalletBalance() {
        this.setState({ loader: true, });
        const userID = await AsyncStorage.getItem("userid");
        let Token = await AsyncStorage.getItem("token");
        Token = "Bearer " + Token;

        const walletBalance = {
            user_id: userID,
        };

        getUserWalletBalanceAction(walletBalance, Token).then((responseJson) => {
            // console.log(responseJson);
            if (responseJson.isError == false) {
                this.setState({
                    WalletData: responseJson.result,
                    loader: false,
                });
            } else {
                this.refs.defaultToastBottomWithDifferentColor.ShowToastFunction(
                    responseJson.message
                );
                // alert(responseJson.message);
                this.setState({ loader: false });
            }
        });
    }

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
                // console.log(responseJson)
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


    logout = async () => {
        await AsyncStorage.removeItem('userid');
        await AsyncStorage.removeItem('name');
        await AsyncStorage.removeItem('mobile');
        await AsyncStorage.removeItem('token');
        await AsyncStorage.removeItem('email');
        await AsyncStorage.removeItem('is_payment_method_save');
        await AsyncStorage.removeItem('payment_gateway_token');
        this.props.navigation.navigate('Auth');

    };
    /** Open / close sidemenu */
    toggleDrawer = (navigation) => {

        this.props.navigation.closeDrawer();
    };

    /** Design part of page */
    render() {
        const { navigate } = this.props.navigation;
        const { userData, WalletData, loader} = this.state;
        if (!loader) {
            return (

                <View style={styles.container}>

                    <StatusBar />
                    {/* <ImageBackground source={require('../../images/Sidemenu-BG.png')} resizeMode='cover' style={styles.backgroundImage}> */}
                    <Row style={{ marginTop: 40, marginLeft: 20, height: 90, borderBottomWidth: 1, borderBottomColor: '#b2bdca' }}>
                        <Col style={styles.wallet_profile}>
                            <Image style={{ height: 70, width: 70 }}
                                source={require('../../images/profile_wallet.png')}
                            />
                        </Col>
                        <Col style={styles.Name}>
                            <Row >
                                <Text style={styles.Nametext}>{t('Hello')}</Text>
                                <Text style={styles.Nametext2} numberOfLines={1}>{userData.first_name}</Text>
                            </Row>
                            <Row style={styles.walletBalanceRow}>
                                <Col style={{ width: 70 }}>
                                    <Image style={{ height: normalize(45), width: normalize(50), }}
                                        source={require('../../images/Logo_2.png')}
                                    />
                                    <Text style={styles.logo_text}>{t('Payment')}</Text>
                                </Col>
                                <Col style={styles.balance_text_col}>
                                    <Text style={styles.balance_text}>{t('My current balance: ')}</Text>
                                </Col>
                                <Col style={styles.balance_col}>
                                    <Text style={styles.balance}>{WalletData.currency_symbol} {WalletData.balance}</Text>
                                </Col>
                            </Row>
                        </Col>


                    </Row>
                    <Col style={{ marginTop: 10 }}>
                        <TouchableOpacity onPress={() => { this.props.navigation.navigate('Profile'); }}>
                            <Row style={styles.profileListRow}>
                                <Col style={{ width: 35 }}>
                                    <Image source={require('../../images/Profile.png')} style={styles.Listlogo} />
                                </Col>
                                <Col>
                                    <Text style={styles.text}>
                                        {t('Profile')}
                                    </Text>
                                </Col>
                            </Row>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => { this.props.navigation.navigate('Shipping'); }}>
                            <Row style={styles.profileListRow}>
                                <Col style={{ width: 35 }}>
                                    <Image source={require('../../images/Order.png')} style={styles.Listlogo} />
                                </Col>
                                <Col>
                                    <Text style={styles.text}>
                                        {t('Shipping')}
                                    </Text>
                                </Col>
                            </Row>
                        </TouchableOpacity>
                        {/* <TouchableOpacity onPress={() => { this.props.navigation.navigate('Payments'); }}>
                        <Row style={{ marginLeft: 20, height: 40 }}>
                            <Col style={{ width: 35 }}>
                                <Image source={require('../../images/Dollar-New.png')} style={styles.Listlogo} />
                            </Col>
                            <Col>
                                <Text style={styles.text}>
                                    {t('Payments')}
                                </Text>
                            </Col>
                        </Row>
                    </TouchableOpacity> */}
                        <TouchableOpacity onPress={() => { this.props.navigation.navigate('Notifications'); }}>
                            <Row style={styles.profileListRow}>
                                <Col style={{ width: 35 }}>
                                    <Image source={require('../../images/Notificaciones.png')} style={styles.Listlogo} />
                                </Col>
                                <Col>
                                    <Text style={styles.text}>
                                        {t('Notifications')}
                                    </Text>
                                </Col>
                            </Row>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => { this.props.navigation.navigate('FavLocationScreen'); }}>
                            <Row style={styles.profileListRow}>
                                <Col style={{ width: 35 }}>
                                    <Image source={require('../../images/blue-heart.png')} style={styles.Listlogo} />
                                </Col>
                                <Col>
                                    <Text style={styles.text}>
                                        {t('My favourites')}
                                    </Text>
                                </Col>
                            </Row>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => { this.props.navigation.navigate('MenuChatWithAdmin'); }}>
                            <Row style={styles.profileListRow}>
                                <Col style={{ width: 35 }}>
                                    <Image source={require('../../images/Message.png')} style={styles.Listlogo} />
                                </Col>
                                <Col>
                                    <Text style={styles.text}>
                                        {t('Chat')}
                                    </Text>
                                </Col>
                            </Row>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => { this.props.navigation.navigate('Configuration'); }}>
                            <Row style={styles.profileListRow}>
                                <Col style={{ width: 35 }}>
                                    <Image source={require('../../images/Setting.png')} style={styles.Listlogo} />
                                </Col>
                                <Col>
                                    <Text style={styles.text}>
                                        {t('Configuration')}
                                    </Text>
                                </Col>
                            </Row>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => { this.props.navigation.navigate('SupportChat'); }}>
                            <Row style={styles.profileListRow}>
                                <Col style={{ width: 35 }}>
                                    <Image source={require('../../images/blue-support.png')} style={styles.Listlogo} />
                                </Col>
                                <Col>
                                    <Text style={styles.text}>
                                        {t('Support')}
                                    </Text>
                                </Col>
                            </Row>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => { this.props.navigation.navigate('TearmandConditions'); }} >
                            <Row style={styles.profileListRow}>
                                <Col style={{ width: 35 }}>
                                    <Image source={require('../../images/Tearm-condition.png')} style={styles.Listlogo} />
                                </Col>
                                <Col>
                                    <Text style={styles.text}>
                                        {t('Terms & Conditions')}
                                    </Text>
                                </Col>
                            </Row>
                        </TouchableOpacity>

                    </Col>

                    <TouchableOpacity onPress={() => this.logout()} style={{ marginTop: Platform.OS === 'ios' ? 50 : 10 }}>
                        <Row style={styles.profileListRow}>
                            <Col style={{ width: 35 }}>
                                <Image source={require('../../images/Salir.png')} style={styles.Listlogo} />
                            </Col>
                            <Col >
                                <Text style={styles.text}>
                                    {t('Leave')}
                                </Text>
                            </Col>
                        </Row>
                    </TouchableOpacity>
                    {/* </ImageBackground> */}
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

/** CSS */
const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: Dimensions.get('window').width * .75,
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

    text: {
        ...Platform.select({
            ios: {
                marginTop: 3,
                color: '#404041',
                marginLeft: 20,
                height: 40,
                fontSize: 18,
                fontFamily: 'Inter-Black'

            },
            android: {
                color: '#404041',
                marginLeft: 20,
                height: 40,
                fontSize: 18,
                fontFamily: 'Inter-Black'
            }
        })
    },

    Close: {
        width: 25,
        height: 25,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 20,
    },
    logo: {
        width: 300,
        height: 250,
        justifyContent: 'center',
        alignItems: 'center',
    },
    Center: {
        justifyContent: 'center',
        alignItems: 'center',

    },
    Listlogo: {
        ...Platform.select({
            ios: {
                width: 30,
                height: 30,


            },
            android: {
                width: 30,
                height: 30,

            }
        })
    },
    wallet_profile: {
        width: normalize(70),
    },
    Name: {
        marginLeft: 10,
        height: 75
    },
    Nametext: {
        color: '#50575E',
        fontSize: normalize(25),
        paddingLeft: normalize(10),
        fontFamily: "Inter-Black",
    },
    Nametext2: {
        ...Platform.select({
            ios:
            {
                color: '#B12026',
                fontSize: normalize(25),
                width: normalize(120),
                paddingLeft: normalize(8),
                fontFamily: "Inter-Black",
            },
            android:
            {
                color: '#B12026',
                fontSize: normalize(25),
                width: normalize(130),
                paddingLeft: normalize(8),
                fontFamily: "Inter-Black",
            }
        })
    },
    walletBalanceRow: {
        backgroundColor: '#f1f2f2',
        borderRadius: 40

    },

    logo_text: {
        ...Platform.select({
            ios: {
                color: '#50575E',
                fontSize: 9,
                position: 'absolute',
                marginTop: normalize(25),
                paddingLeft: normalize(40),
                fontFamily: 'Inter-Black',
            },
            android: {
                color: '#50575E',
                fontSize: 9,
                position: 'absolute',
                marginTop: normalize(27),
                paddingLeft: normalize(40),
                fontFamily: 'Inter-Black',
            },
        })
    },

    balance_text_col: {
        ...Platform.select({
            ios: {
                justifyContent: 'center',
                // alignItems: 'flex-end',
                width: normalize(60),

            },
            android: {
                justifyContent: 'center',
                // alignItems: 'flex-end',
                width: normalize(60),
            },
        })
    },
    balance_text: {
        ...Platform.select({
            ios: {
                fontSize: 9,
                color: '#50575E',
                fontFamily: 'Inter-Black',
            },
            android: {
                fontSize: 9,
                color: '#50575E',
                fontFamily: 'Inter-Black',
                textAlign: 'right',
            },
        })
    },
    balance_col: {
        ...Platform.select({
            ios: {
                justifyContent: 'center',
                paddingLeft: normalize(5),

            },
            android: {
                justifyContent: 'center',
                paddingLeft: normalize(5),
            },
        })
    },

    balance: {
        ...Platform.select({
            ios: {
                fontSize: 10,
                color: '#50575E',
                fontFamily: 'Inter-Black',
            },
            android: {
                fontSize: 10,
                color: '#50575E',
                fontFamily: 'Inter-Black',
            },
        })
    },
    profileListRow: {
        marginLeft: 20,
        height: 40,
        marginTop: 10,
    },

});