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
    KeyboardAvoidingView
} from "react-native";
import normalize from 'react-native-normalize';
import validate from 'validate.js';
import { Col, Row } from 'react-native-easy-grid';
import moment from 'moment';


export default class Configuration extends Component {

    constructor(props) {
        super(props);
        this.state = {
            loader: '',
        };
        // this.onDayPress = this.onDayPress.bind(this);
    }

    
    toggleDrawer = ({ navigation }) => {
        this.props.navigation.toggleDrawer();
    };
    static navigationOptions = ({ navigation }) => {
        return {
            headerShown: false,
        };
    };
    
    render() {

        const { navigate } = this.props.navigation;
        return (
            <View style={{flex:1,justifyContent: 'center', alignItems: 'center',}}>
                <Text style={{fontSize: 20, fontFamily:'Inter-Black'}}>Coming Soon Farmacias</Text>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    Navebar: {
        ...Platform.select({
            ios: {
                height: 45,
                marginTop: "10%",
                borderBottomWidth: 1
            },
            android: {
                height: 40,
                //   borderWidth: 1,   
                borderBottomWidth: 1
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

    NavCol: {
        width: "10%"
    },
    Header: {
        justifyContent: "center",
        alignItems: "center",

    },
    HeaderText: {
        ...Platform.select({
            ios: {
                fontSize: 15,
                // padding: 10,
                fontWeight: "bold",
                color: "#102b46",
                // alignItems: 'center',
                height: 15,

            },
            android: {

                fontSize: 15,
                // padding: 10,
                fontWeight: "bold",
                color: "#102b46",
                // alignItems: 'center',
            }
        })
    },
    notes_Input: {
        ...Platform.select({
            ios: {
                height: 40,
                width: '100%',
                paddingLeft: 10,
                paddingTop: "3%"
            },
            android: {
                // marginTop: 10,
                height: 40,
                width: '100%',
                paddingLeft: 10,
            }
        })
    },
    style: {
                backgroundColor: '#efefef',
                marginTop: normalize(10),
                width: normalize(100),
                height: normalize(95),
                marginRight: normalize(20),
                marginLeft: normalize(20),
                borderRadius: normalize(20),
                borderWidth: 2.5,
                borderColor: '#e5e5e5',

            },
            labelStyle: {
                fontSize: 10,
                fontFamily: 'Inter-Black',
                marginTop: normalize(20),
            },
})