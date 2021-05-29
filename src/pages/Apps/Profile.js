import React, { Component, useState } from 'react';
import { ActivityIndicator, RefreshControl, SafeAreaView, Dimensions, Modal, BackHandler, AsyncStorage, Picker, Alert, StyleSheet, Text, View, Image, TextInput, TouchableOpacity, StatusBar, Keyboard, ScrollView } from 'react-native';
import { Col, Row, Grid } from "react-native-easy-grid";
import { t } from '../../../locals';
import { Collapse, CollapseHeader, CollapseBody, AccordionList } from 'accordion-collapse-react-native';
import Selection from './SelectionScreen.js';
// import CustomToast from './Toast.js';
import DropdownAlert from 'react-native-dropdownalert';
import PropTypes from 'prop-types';
import validate from 'validate.js';
import normalize from 'react-native-normalize';
import { getUserDetailAction, getOrderDetailAction, updatePaymentAction } from '../Util/Action.js';
import { NavigationEvents } from 'react-navigation';

const { width, height } = Dimensions.get("screen");

export default class Profile extends Component {

    constructor(props) {
        super(props);
        this.state = {
            user_name: '',
            emailAddress: '',
            mobile: '',
            // method_name : '',
            // card_number : '',
            // month : '',
            // year : '',
            // cvv : '',
            dataSource: [],
            modalVisible: false,
            modalShow: false,
            modalCancel: false,
        }
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
        // this.getOrderDetail();
        this.getUserDetail();
    }

    onRefresh() {
        this.getUserDetail();
    }
    setModalVisible = (visible) => {

        this.setState({ modalVisible: visible });
    }
    setModalShow = (visible) => {

        this.setState({ modalShow: visible });
    }
    setModalCancel = (visible) => {

        this.setState({ modalCancel: visible });
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
            console.log(responseJson)
            if (responseJson.isError == false) {
                this.setState({
                    user_name: responseJson.result.first_name,
                    emailAddress: responseJson.result.email,
                    mobile: responseJson.result.mobile,
                    loader: false,
                });
            } else {
                // alert(responseJson.message);
                this.setState({ loader: false });
            }
        });
    }

    async send() {
        const { navigate } = this.props.navigation;
        const { user_name, emailAddress, mobile, } = this.state;

        var constraints = {
            user_name: {
                presence: {
                    allowEmpty: false,
                    message: "^ " + t("name required")
                },
                format: {
                    pattern: "[A-Za-z ]+",
                    flags: "i",
                    message: "^ " + t("only characters")
                }
            },
            mobile: {
                format: {
                    pattern: "[0-9]{7,15}",
                    flags: "i",
                    message: "^ " + t("7 to 15 digit mobile number")
                },
            },
            emailAddress: {
                presence: {
                    allowEmpty: false,
                    message: "^ " + t("Email required")
                },
                email: {
                    message: "^ " + t("Enter a valid email address")
                }
            },
        };

        Keyboard.dismiss();

        const result = validate({ user_name: this.state.user_name, emailAddress: this.state.emailAddress, mobile: this.state.mobile, }, constraints);

        if (result) {
            if (result.user_name) {
                this.dropdown.alertWithType('error', 'Error', result.user_name);
                // this.refs.defaultToastBottomWithDifferentColor.ShowToastFunction(result.user_name);
                return false;
            }

            if (result.emailAddress) {
                this.dropdown.alertWithType('error', 'Error', result.emailAddress);
                // this.refs.defaultToastBottomWithDifferentColor.ShowToastFunction(result.emailAddress);
                return false;
            }

            if (result.mobile) {
                this.dropdown.alertWithType('error', 'Error', result.mobile);
                // this.refs.defaultToastBottomWithDifferentColor.ShowToastFunction(result.mobile);
                return false;
            }
        }


        if (!result) {
            let customer_id = await AsyncStorage.getItem('userid');

            var updatePaymentData = {
                customer_id: customer_id,
                name: this.state.user_name,
                email: this.state.emailAddress,
                mobile: this.state.mobile,

            }

            let Token = await AsyncStorage.getItem('token');
            Token = 'Bearer ' + Token;

            this.setState({ loader: true });
            var response = updatePaymentAction(updatePaymentData, Token).then(function (responseJson) {
                if (responseJson.isError == false) {
                    this.setState({ loader: false });
                    this.dropdown.alertWithType('success', 'success', responseJson.message);
                    // this.refs.defaultToastBottomWithDifferentColor.ShowToastFunction(responseJson.message);
                    // storage.updatePaymentMethod('is_update_payment_method_save').then((data) => {
                    // navigate('App');
                    // this.setState({ loading: false });
                    // }).catch((err) => {
                    // console.log(err)
                    // });

                }
                else {
                    this.dropdown.alertWithType('error', 'Error', responseJson.message);
                    // this.refs.defaultToastBottomWithDifferentColor.ShowToastFunction(responseJson.message);
                }
            }.bind(this));
        }
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

    render() {
        const { navigate } = this.props.navigation;
        const { dataSource, first_name, emailAddress, mobile, user_name, modalShow, loader } = this.state;
        const order_id = this.props.navigation.getParam("order_id");
        const customer_id = this.props.navigation.getParam("customer_id");

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

                    <Row style={styles.profile_row}>
                        <Col style={{ width: normalize(90), justifyContent: 'center', }}>
                            <Image source={require('../../images/profile_wallet.png')} style={styles.Listlogo} />
                            <Row style={{ alignItems: 'flex-end', justifyContent: 'flex-start', height: normalize(20) }}>
                                <Text style={{ fontFamily: 'Inter-Black', color: '#999999', fontSize: 12, }}>{t('Add photo')}</Text>
                            </Row>
                        </Col>
                        <Col style={{ justifyContent: 'center', marginBottom: normalize(20) }}>
                            <Text style={styles.text}>
                                {t('My Profile')}
                            </Text>
                        </Col>
                    </Row>

                    <View style={{ flex: 0.8, }}>
                        <Row style={styles.profile_name_row}>
                            <Col style={styles.profile_name_col}>
                                <TouchableOpacity style={{ width: normalize(305) }}>
                                    <TextInput style={styles.TextValue}
                                        placeholder={t('Name')}
                                        placeholderTextColor="#1988B9"
                                        maxLength={25}
                                        autoCorrect={false}
                                        autoComplete={false}
                                        value={user_name}
                                        // caretHidden={true} 
                                        autoFocus={true}
                                        onChangeText={(user_name) => this.setState({ user_name })}>
                                    </TextInput>
                                </TouchableOpacity>
                            </Col>
                            <Col style={{ width: normalize(35), justifyContent: 'center', alignItems: 'flex-start', }}>
                                <TouchableOpacity onPress={this.send.bind(this)}>
                                    <Image source={require('../../images/Edit.png')} style={styles.DownArrow} />
                                </TouchableOpacity>
                            </Col>
                        </Row>

                        <Row style={styles.profile_name_row2}>
                            <Col style={styles.profile_name_col2}>
                                <TouchableOpacity style={{ width: normalize(305) }}>
                                    <TextInput style={styles.TextValue}
                                        placeholder={t('Email')}
                                        placeholderTextColor="#1988B9"
                                        autoCorrect={false}
                                        autoComplete={false}
                                        value={emailAddress}
                                        onChangeText={(emailAddress) => this.setState({ emailAddress })}>
                                    </TextInput>
                                </TouchableOpacity>
                            </Col>

                            <Col style={{ width: normalize(35), justifyContent: 'center', alignItems: 'flex-start', }}>
                                <TouchableOpacity onPress={this.send.bind(this)}>
                                    <Image source={require('../../images/Edit.png')} style={styles.DownArrow} />
                                </TouchableOpacity>
                            </Col>
                        </Row>

                        <Row style={styles.profile_name_row2}>
                            <Col style={styles.profile_name_col2}>
                                <TouchableOpacity style={{ width: normalize(305) }}>
                                    <TextInput style={styles.TextValue}
                                        placeholder={t('Change phone number')}
                                        placeholderTextColor="#1988B9"
                                        maxLength={15}
                                        keyboardType="numeric"
                                        autoCorrect={false}
                                        autoComplete={false}
                                        value={mobile}
                                        onChangeText={(mobile) => this.setState({ mobile })}>
                                    </TextInput>
                                </TouchableOpacity>
                            </Col>
                            <Col style={{ width: normalize(35), justifyContent: 'center', alignItems: 'flex-start', }}>
                                <TouchableOpacity onPress={this.send.bind(this)}>
                                    <Image source={require('../../images/Edit.png')} style={styles.DownArrow} />
                                </TouchableOpacity>
                            </Col>
                        </Row>

                        {/*<TouchableOpacity style={styles.profile_name_row2} onPress ={() => navigate('cardSelectionScreen')}>
                                    <Row>
                                        <Col style={styles.profile_name_col2}>   
                                            <Text style={styles.TextValue}>{t('My payment methods')}</Text>
                                        </Col>
                                    </Row>
                                </TouchableOpacity>*/}

                    </View>
                    <View style={{ flex: 0.3 }}>
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
                            <Row style={{ marginTop: normalize(10) }}>
                                <Text style={{ fontFamily: 'Inter-Black', fontSize: 16 }}>{t('Support')}</Text>
                            </Row>
                        </Col>
                    </View>
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
        } else {
            return (
                <ActivityIndicator
                    style={styles.loading}
                    size="large"
                    color="#1988B9"
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
    loading: {
        position: "absolute",
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        alignItems: "center",
        justifyContent: "center",
    },
    Navebar: {
        ...Platform.select({
          ios: {
            height: 40,
            marginTop: "12%",
          },
          android: {
            height: 40,
            marginTop:10
          },
        }),
      },
    BackArrow: {
        width: normalize(25),
        height: normalize(25),
    },
    Menu: {
        width: normalize(27),
        height: normalize(27),
    },
    DownArrow: {
        width: normalize(21),
        height: normalize(21),
    },
    text: {
        ...Platform.select({
            ios: {
                color: '#C1272D',
                fontSize: 32,
                fontFamily: 'Inter-Black'

            },
            android: {
                color: '#C1272D',
                fontSize: 32,
                fontFamily: 'Inter-Black'
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
                width: normalize(70),
                height: normalize(70),
            }
        })
    },
    TextInput: {
        ...Platform.select({
            ios:
            {
                justifyContent: 'center',
                alignItems: 'center',
                // textAlign: 'center',
                paddingTop: 10,
                paddingLeft: 20,
                borderStyle: 'dashed',
                // borderRadius: 40,
                // borderWidth: 2,
                fontSize: 20,
                width: 288,
                height: 40,
                borderColor: 'grey',
                // backgroundColor:'#e9e7e6',
                marginBottom: 10,
                color: '#000',
            },
            android:
            {
                justifyContent: 'center',
                // paddingLeft: 40,
                paddingTop: 10,
                alignItems: 'center',
                borderStyle: 'dashed',
                // borderRadius: 40,
                fontSize: 20,
                // borderWidth: 2,
                width: 288,
                height: 40,
                // borderColor: 'grey',
                // backgroundColor:'#e9e7e6',
                marginBottom: 10,
                color: '#000',
                marginLeft: 20,
                marginRight: 20,

            }
        }),
    },
    TextValue: {
        ...Platform.select({
            ios:
            {
                fontSize: 18,
                fontFamily: 'Inter-Black',
                color: '#1988B9',
                justifyContent: 'center',
                alignItems: 'flex-start',
            },
            android:
            {
                fontSize: 18,
                fontFamily: 'Inter-Black',
                color: '#1988B9',
                justifyContent: 'center',
                alignItems: 'flex-start',

            }
        }),
    },
    Accordion: {
        // backgroundColor:'#e9e7e6',
        marginLeft: 20,
        marginRight: 20,
        borderBottomWidth: 2,
        // marginTop: 10,
    },

    Login: {
        marginTop: 15,
        alignItems: 'center',
        justifyContent: 'center',
        width: 300,
        height: 60,
        borderRadius: 40,
        backgroundColor: '#e02127',
        color: '#fff',


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
    profile_name_row: {
        ...Platform.select({
            ios: {
                backgroundColor: '#F2F2F2',
                height: normalize(40),
                marginRight: normalize(20),
                marginLeft: normalize(20),
                borderRadius: normalize(30),
                marginTop: normalize(15),
                marginBottom: normalize(15)
            },
            android: {
                backgroundColor: '#F2F2F2',
                height: normalize(40),
                marginRight: normalize(20),
                marginLeft: normalize(20),
                borderRadius: normalize(30),
                marginTop: normalize(15),
                marginBottom: normalize(15)
            }
        })
    },
    profile_row: {
        ...Platform.select({
            ios: {
                height: normalize(90),
                marginRight: normalize(30),
                marginLeft: normalize(30),
                marginTop: normalize(5)
            },
            android: {
                height: normalize(90),
                marginRight: normalize(30),
                marginLeft: normalize(30),
                marginTop: normalize(5)
            }
        })
    },
    profile_name_col: {
        ...Platform.select({
            ios: {
                justifyContent: 'center',
                alignItems: 'flex-start',
                marginLeft: normalize(30)
            },
            android: {
                justifyContent: 'center',
                alignItems: 'flex-start',
                marginLeft: normalize(30)
            }
        })
    },
    profile_name_row2: {
        ...Platform.select({
            ios: {
                backgroundColor: '#F2F2F2',
                height: normalize(40),
                marginRight: normalize(20),
                marginLeft: normalize(20),
                borderRadius: normalize(30),
                marginBottom: normalize(15)
            },
            android: {
                backgroundColor: '#F2F2F2',
                height: normalize(40),
                marginRight: normalize(20),
                marginLeft: normalize(20),
                borderRadius: normalize(30),
                marginBottom: normalize(15)
            }
        })
    },
    profile_name_col2: {
        ...Platform.select({
            ios: {
                justifyContent: 'center',
                alignItems: 'flex-start',
                marginLeft: normalize(30)
            },
            android: {
                justifyContent: 'center',
                alignItems: 'flex-start',
                marginLeft: normalize(30)
            }
        })
    },
});