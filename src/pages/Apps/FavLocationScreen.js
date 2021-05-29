import React, { Component } from "react";
import {
    BackHandler,
    Platform,
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image
} from "react-native";
import normalize from 'react-native-normalize';
import { Col, Row } from "react-native-easy-grid";
import { t } from '../../../locals';



export default class FavLocationScreen extends Component {

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
            <View style={{flex:1}}>
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

                <Row style={{ justifyContent: 'center', alignItems: 'center', }}>
                    <Text style={{ fontSize: 20, fontFamily: 'Inter-Black' }}>{t("Coming Soon")}</Text>
                </Row>
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
    
    arrow_col: {
        ...Platform.select({
            ios:
            {
                justifyContent: 'center',
                paddingLeft: normalize(15),
            },
            android:
            {
                justifyContent: 'center',
                paddingLeft: normalize(30),
            }
        }),
    },
    menu_col: {
        ...Platform.select({
            ios:
            {
                justifyContent: 'center',
                paddingRight: normalize(15),
            },
            android:
            {
                justifyContent: 'center',
                paddingRight: normalize(30),
            }
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
})