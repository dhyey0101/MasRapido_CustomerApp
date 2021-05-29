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
import { NavigationEvents } from 'react-navigation';

const { width, height } = Dimensions.get("screen");

export default class SupportScreen extends Component {
    toggleDrawer = ({ navigation }) => {
        this.props.navigation.toggleDrawer();
    };
    static navigationOptions = ({ navigation }) => {
        return {
            headerShown: false,
        };
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
        return (
            <View style={styles.container}>
                <NavigationEvents
                    onWillFocus={this._onFocus}
                    onWillBlur={this._onBlurr}
                />
                <ScrollView>
                    <Row style={styles.Navebar}>
                        <TouchableOpacity style={{justifyContent: 'center', width: '20%' }} onPress={() => navigate("MarketPlace")}>
                            <Col style={styles.NavCol}>
                                <Image
                                    source={require("../../images/Back-Arrow.png")}
                                    style={styles.BackArrow}
                                />
                            </Col>
                        </TouchableOpacity>
                        <Col style={styles.Header}>
                            <Text style={styles.HeaderText}>{t('Support')}</Text>
                        </Col>
                        <TouchableOpacity
                            style={{ alignItems: "flex-end",justifyContent: 'center', width: '20%' }}
                            onPress={this.toggleDrawer.bind(this)}
                        >
                        <Col style={styles.NavCol}>

                            <Image
                                source={require("../../images/Menu.png")}
                                style={styles.Menu}
                            />
                        </Col>
                        </TouchableOpacity>
                    </Row>

                <Row style={{ justifyContent: 'center', alignItems: 'center' }}>
                    <TouchableOpacity onPress={() => navigate('SupportChat')}>
                        <Image
                            style={styles.ModalIcon}
                            source={require("../../images/Messages.png")}
                        />
                    </TouchableOpacity>
                </Row>
                </ScrollView>
            </View >
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
                height: 40,
                marginTop: 40,
            },
            android: {
                height: 40,
            },
        }),
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
    Header: {
        justifyContent: "center",
        alignItems: "center",

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
    NavCol: {
        // width: "10%",
    },
    ModalIcon: {
        height: 70,
        width: 70,
        // position: 'absolute',
        // marginLeft: 30,
    },
})