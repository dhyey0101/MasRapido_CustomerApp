import React, { useState, useEffect } from 'react';
import { Text, View, Image } from 'react-native';
import { createAppContainer } from 'react-navigation';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import { createStackNavigator } from 'react-navigation-stack';
import LocationScreen from './LocationScreen.js';
import ServicePlace from './ServicePlace.js';
import IndicationScreen from './IndicationScreen.js';
import SupportScreen from './SupportScreen.js';
import OrderIndication from './MessagingConfirmation.js';
import MarketPlace from './MarketPlace.js';
import ClientsWallet from './ClientsWallet.js';
import Restaurantes from './Restaurantes.js';
import RestaurantesView from  './RestaurantesView.js';
import * as Localization from 'expo-localization';
import i18n from 'i18n-js';
import { t } from '../../../locals';

// const choice = Localization.locale
// const lang = i18n.locale = choice.substr(0, 2);

const lang = i18n.locale = Localization.locale.substr(0, 2);

const Delivery_StackNavigator = createStackNavigator({
	location: { screen: LocationScreen },
  indication: { screen: OrderIndication },
}, {
  navigationOptions: ({ navigation }) => ({
    tabBarVisible: navigation.state.index < 1,
  })
});

const MarketPlace_StackNavigator = createStackNavigator({
	MarketPlaceHome: { screen: MarketPlace },
  Restaurantes: { screen: Restaurantes },
  RestaurantesView: { screen: RestaurantesView },
}, {
  navigationOptions: ({ navigation }) => ({
    tabBarVisible: navigation.state.index < 1,
  })
});

const Service_StackNavigator = createStackNavigator({
	Service: { screen: ServicePlace },
  IndicationScreen: { screen: IndicationScreen },
}, {
  navigationOptions: ({ navigation }) => ({
    tabBarVisible: navigation.state.index < 1,
  })
});

const Support_StackNavigator = createStackNavigator({
	Support: { screen: SupportScreen },
}, {
  navigationOptions: ({ navigation }) => ({
    tabBarVisible: navigation.state.index < 1,
  })
});

const Wallet_StackNavigator = createStackNavigator({
	Wallet: { screen: ClientsWallet },
}, {
  navigationOptions: ({ navigation }) => ({
    tabBarVisible: navigation.state.index < 1,
  })
});


const TabNavigator = createBottomTabNavigator({

  MarketPlace : {
    screen:MarketPlace_StackNavigator,
    navigationOptions:{
      // tabBarLabel: <Text style={{fontFamily: 'Inter-Black', textAlign:'center'}}>{t("Market")}</Text>,
      tabBarLabel: <Text style={{fontFamily: 'Inter-Black', textAlign:'center'}}>{lang == 'es' ? "Mercado" : "Market" } </Text>,
      tabBarOptions: {
        activeTintColor: '#bc464a',
        
      },
      tabBarIcon: ({ focused, color, }) => (
        <Image
          source={
            focused
            ? require('../../images/Home-BG.png')
            : require('../../images/Home.png')
          }
          style={{
            width: 25,
            height: 25,
            // borderRadius: size,
          }}
        />
      ), 
    }
  },
  Delivery : {
    screen:Delivery_StackNavigator,
    navigationOptions:{
      // tabBarLabel:<Text style={{fontFamily: 'Inter-Black', textAlign:'center'}}>{t('Messanger')} </Text>,
      tabBarLabel:<Text style={{fontFamily: 'Inter-Black', textAlign:'center'}}>{lang == 'es' ? "Mensajera" : "Messanger" }</Text>,
      tabBarOptions: {
        activeTintColor: '#bc464a',
      },
      tabBarIcon: ({ focused, color, }) => (
        <Image
          source={
            focused
            ? require('../../images/Bike-BG.png')
            : require('../../images/Bike-2.png')
          }
          style={{
            width: 25,
            height: 25,
            // borderRadius: size,
          }}
        />
      ), 
    }
  },
  Service : {
    screen:Service_StackNavigator,
    navigationOptions:{
      tabBarLabel:<Text style={{fontFamily: 'Inter-Black', textAlign:'center'}}>{lang == 'es' ? "Servicios" : "Service" }</Text>,
      tabBarOptions: {
        activeTintColor: '#bc464a',
      },
      tabBarIcon: ({ focused, color, }) => (
        <Image
          source={
            focused
            ? require('../../images/Settings-BG.png')
            : require('../../images/Settings.png')
          }
          style={{
            width: 25,
            height: 25,
            // borderRadius: size,
          }}
        />
      ), 
    }
  },
  Support : {
    screen:Support_StackNavigator,
    navigationOptions:{
      tabBarLabel:<Text style={{fontFamily: 'Inter-Black', textAlign:'center'}}>{lang == 'es' ? "Soporte" : "Support" }</Text>,
      tabBarOptions: {
        activeTintColor: '#bc464a',
      },
      tabBarIcon: ({ focused, color, }) => (
        <Image
          source={
            focused
            ? require('../../images/Headphone-BG.png')
            : require('../../images/Headphone.png')
          }
          style={{
            width: 25,
            height: 25,
            // borderRadius: size,
          }}
        />
      ), 
    }
  },
  Payment : {
    screen:Wallet_StackNavigator,
    navigationOptions:{
      tabBarLabel:<Text style={{fontFamily: 'Inter-Black', textAlign:'center'}}> {lang == 'es' ? "Pagos" : "Payment" }</Text>,
      tabBarOptions: {
        activeTintColor: '#bc464a',
      },
      
      tabBarIcon: ({ focused, color, }) => (
        <Image
          source={
            focused
            ? require('../../images/Logo-BG.png')
            : require('../../images/Logo2.png')
          }
          style={{
            width: 25,
            height: 25,
            // borderRadius: size,
          }}
        />
      ), 
    }
  },
},
);

export default createAppContainer(TabNavigator);