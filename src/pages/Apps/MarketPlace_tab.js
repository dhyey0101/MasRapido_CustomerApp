import React, { Component } from 'react';
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
} from 'react-native';
import { Col, Row } from 'react-native-easy-grid';
import { NavigationEvents } from 'react-navigation';
import { extend } from 'validate.js';
import normalize from 'react-native-normalize';
import { createSwitchNavigator, createAppContainer } from 'react-navigation';
import { createMaterialTopTabNavigator } from 'react-navigation-tabs';
import { createStackNavigator } from 'react-navigation-stack';
import Restaurantes from './Restaurantes.js';
import Supermercados from './Supermercados.js';
import Farmacias from './Farmacias.js';
import Almacenes from './Almacenes.js';
import Ferreterías from './Ferreterías.js';
import { t } from '../../../locals';

/** Tab navigation page of bookings tab */
const TabNavigator = createMaterialTopTabNavigator(
    {
        Restaurantes: {
            screen: Restaurantes,
            navigationOptions: {
                tabBarLabel: 'Restaurantes',
                tabBarOptions: {
                    // activeTintColor: 'white',
                    showIcon: true,
                    showLabel: true,
                    upperCaseLabel: false,
                    activeTintColor: 'red',
                    inactiveTintColor: '#000',
                    style: {
                        backgroundColor: '#fff',
                    },
                    tabStyle: {
                        backgroundColor: '#efefef',
                        borderRadius: normalize(15),
                        borderWidth: 1,
                        // width: normalize(70),
                        // height: normalize(50),
                        borderColor: '#e5e5e5',
                        margin: normalize(5),
                        // marginLeft: normalize(20),
                    },
                    labelStyle: {
                        fontSize: normalize(10),
                        fontFamily: 'Inter-Black',
                        width: normalize(70),
                        // paddingTop: normalize(10),
                        bottom: -10,
                        marginTop: normalize(10)
                    },
                    indicatorStyle: {
                        backgroundColor: '#fff',
                    },
                },
                tabBarStyle: {
                    backgroundColor: 'red',
                    indicatorStyle: {
                        color: '#de1d3e'
                    },
                },
                tabBarIcon: (focused, tintColor) => (
                    <View style={{ justifyContent: 'center', alignItems: 'center', }}>
                        <Image
                            style={{ height: normalize(45), width: normalize(45), }}
                            source={require('../../images/Restaurants.png')} />
                    </View>
                )

            }
        },
        Supermercados: {
            screen: Supermercados,
            tabStyle: {
                marginRight: normalize(20),
                width: normalize(90),
                height: normalize(85),
            },
            navigationOptions: {
                tabBarLabel: 'Supermercados',
                tabBarOptions: {
                    // activeTintColor: 'white',
                    showIcon: true,
                    showLabel: true,
                    upperCaseLabel: false,
                    activeTintColor: 'red',
                    inactiveTintColor: '#000',
                    style: {
                        backgroundColor: '#fff',
                    },
                    tabStyle: {
                        backgroundColor: '#efefef',
                        borderRadius: normalize(15),
                        borderWidth: 1,
                        // width: normalize(70),
                        // height: normalize(50),
                        borderColor: '#e5e5e5',
                        margin: normalize(5),
                        // marginLeft: normalize(20),
                    },
                    labelStyle: {
                        fontSize: normalize(10),
                        fontFamily: 'Inter-Black',
                        width: normalize(70),
                        // paddingTop: normalize(10),
                        bottom: -10,
                        marginTop: normalize(10)
                    },
                    indicatorStyle: {
                        backgroundColor: '#fff',
                    },
                },
                tabBarStyle: {
                    backgroundColor: 'red',
                    indicatorStyle: {
                        color: '#de1d3e'
                    },
                },
                tabBarIcon: (focused, tintColor) => (
                    <View style={{ justifyContent: 'center', alignItems: 'center', }}>
                        <Image
                            style={{ height: normalize(45), width: normalize(45), }}
                            source={require('../../images/Supermercados.png')} />
                    </View>
                )

            }
        },
        Farmacias: {
            screen: Farmacias,
            navigationOptions: {
                tabBarLabel: 'Farmacias',
                tabBarOptions: {
                    // activeTintColor: 'white',
                    showIcon: true,
                    showLabel: true,
                    upperCaseLabel: false,
                    activeTintColor: 'red',
                    inactiveTintColor: '#000',
                    style: {
                        backgroundColor: '#fff',
                    },
                    tabStyle: {
                        backgroundColor: '#efefef',
                        borderRadius: normalize(15),
                        borderWidth: 1,
                        // width: normalize(70),
                        // height: normalize(50),
                        borderColor: '#e5e5e5',
                        margin: normalize(5),
                        // marginLeft: normalize(20),
                    },
                    labelStyle: {
                        fontSize: normalize(10),
                        fontFamily: 'Inter-Black',
                        width: normalize(70),
                        // paddingTop: normalize(10),
                        bottom: -10,
                        marginTop: normalize(10)
                    },
                    indicatorStyle: {
                        backgroundColor: '#fff',
                    },
                },
                tabBarStyle: {
                    backgroundColor: 'red',
                    indicatorStyle: {
                        color: '#de1d3e'
                    },
                },
                tabBarIcon: (focused, tintColor) => (
                    <View style={{ justifyContent: 'center', alignItems: 'center', }}>
                        <Image
                            style={{ height: normalize(45), width: normalize(45), }}
                            source={require('../../images/Farmacias.png')} />
                    </View>
                )

            }
        },
        Almacenes: {
            screen: Almacenes,
            navigationOptions: {
                tabBarLabel: 'Almacenes',
                tabBarOptions: {
                    // activeTintColor: 'white',
                    showIcon: true,
                    showLabel: true,
                    upperCaseLabel: false,
                    activeTintColor: 'red',
                    inactiveTintColor: '#000',
                    style: {
                        backgroundColor: '#fff',
                    },
                    tabStyle: {
                        backgroundColor: '#efefef',
                        borderRadius: normalize(15),
                        borderWidth: 1,
                        // width: normalize(70),
                        // height: normalize(50),
                        borderColor: '#e5e5e5',
                        margin: normalize(5),
                        // marginLeft: normalize(20),
                    },
                    labelStyle: {
                        fontSize: normalize(10),
                        fontFamily: 'Inter-Black',
                        width: normalize(70),
                        // paddingTop: normalize(10),
                        bottom: -10,
                        marginTop: normalize(10)
                    },
                    indicatorStyle: {
                        backgroundColor: '#fff',
                    },
                },
                tabBarStyle: {
                    backgroundColor: 'red',
                    indicatorStyle: {
                        color: '#de1d3e'
                    },
                },
                tabBarIcon: (focused, tintColor) => (
                    <View style={{ justifyContent: 'center', alignItems: 'center', }}>
                        <Image
                            style={{ height: normalize(45), width: normalize(45), }}
                            source={require('../../images/Almacenes.png')} />
                    </View>
                )

            }
        },
        Ferreterías: {
            screen: Ferreterías,
            navigationOptions: {
                tabBarLabel: 'Ferreterías',
                tabBarOptions: {
                    // activeTintColor: 'white',
                    showIcon: true,
                    showLabel: true,
                    upperCaseLabel: false,
                    activeTintColor: 'red',
                    inactiveTintColor: '#000',
                    style: {
                        backgroundColor: '#fff',
                    },
                    tabStyle: {
                        backgroundColor: '#efefef',
                        borderRadius: normalize(15),
                        borderWidth: 1,
                        // width: normalize(70),
                        // height: normalize(50),
                        borderColor: '#e5e5e5',
                        margin: normalize(5),
                        // marginLeft: normalize(20),
                    },
                    labelStyle: {
                        fontSize: normalize(10),
                        fontFamily: 'Inter-Black',
                        width: normalize(70),
                        // paddingTop: normalize(10),
                        bottom: -10,
                        marginTop: normalize(10)
                    },
                    indicatorStyle: {
                        backgroundColor: '#fff',
                    },
                },
                tabBarStyle: {
                    backgroundColor: 'red',
                    indicatorStyle: {
                        color: '#de1d3e'
                    },
                },
                tabBarIcon: (focused, tintColor) => (
                    <View style={{ justifyContent: 'center', alignItems: 'center', }}>
                        <Image
                            style={{ height: normalize(45), width: normalize(45), }}
                            source={require('../../images/Ferreterías.png')} />
                    </View>
                )

            }
        },

    }, {
    tabBarPosition: 'top',
    swipeEnabled: true,
    animationEnabled: false,
    style: {
        backgroundColor: '#fff',
        marginTop: normalize(5),
    }

}
)

    
/** Tab navigation route of booking */
const TabStack = createStackNavigator({
    TabNavigator: { screen: TabNavigator },
});

export default createAppContainer(TabNavigator);

