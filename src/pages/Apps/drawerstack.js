import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
// import { SafeAreaView } from 'react-navigation';
import { createAppContainer } from 'react-navigation';
import { TabNavigator, StackNavigator } from 'react-navigation';
import { createDrawerNavigator, DrawerItems } from 'react-navigation-drawer';
import { createStackNavigator } from 'react-navigation-stack';
import Selection from './SelectionScreen.js';
import { Dimensions } from 'react-native';
import CustomSideBar from './customSideBar';
import ServicePlace from './ServicePlace.js';
import LocationScreen from './LocationScreen.js';
import Profile from './Profile.js';
import ChatWithDriver from './ChatWithDriver';
import ChatWithAdmin from './ChatWithAdmin';
import MenuChatWithAdmin from './MenuChatWithAdmin';
import Shipping from './Shipping.js';
import Payments from './Payments.js';
import Notifications from './Notifications.js';
import FavLocationScreen from './FavLocationScreen.js';
import IndicationScreen from './IndicationScreen.js';
import OrderStatusScreen from './OrderStatus.js';
import ServiceStatusScreen from './ServiceStatus.js';
import OrderList from './OrderList.js';
import OrderTracking from './OrderTracking.js';
import ServiceTracking from './ServiceTracking.js';
import ServiceDetails from './ServiceDetails.js';
import TearmandConditions from './TearmandConditions.js';
// import PusherPage from "./PusherIntigration";
import SupportScreen from "./SupportScreen.js";
import Configuration from "./configuration.js";
import { StackActions } from '@react-navigation/native';
import Restaurantes from './Restaurantes.js';
import RestaurantesView from  './RestaurantesView.js';
import MessagingConfirmation from './MessagingConfirmation.js';
import cardSelectionScreen from './cardSelectionScreen.js';
import SupportChat from './SupportChat.js';



const { width, height } = Dimensions.get('screen');


/** PusherIntegration page route */
// const PusherIntegration_StackNavigator = createStackNavigator({
//   PusherPage: { screen: PusherPage },

// });

// const Selection_StackNavigator = createStackNavigator({
// 	First: { screen: Selection }
// });

const ServicePlace_StackNavigator = createStackNavigator({
	ServicePlace: { screen: ServicePlace },
	ServiceDetails: { screen: ServiceDetails, 
		navigationOptions:{
			gestureEnabled: false
		} 
	},

});

const MarketTabNavigator = createStackNavigator({
    First: { screen: Selection },
    Restaurantes: { screen: Restaurantes },
  	RestaurantesView: { screen: RestaurantesView },

},
{
  headerMode: 'Screen',
});

// const ServicePlaceStack = new StackNavigator({
// 	ServicePlace: { screen: ServicePlace },
// 	ServiceDetails: { screen: ServiceDetails },

// });

// const LocationStack = new StackNavigator({
// 	OrderLocation: { screen: LocationScreen },
// 	orderSpecification: { screen: IndicationScreen },
// })

const LocationScreen_StackNavigator = createStackNavigator({
	OrderLocation: { screen: LocationScreen },
	MessagingConfirmation: { screen: MessagingConfirmation, navigationOptions:{
        gesturesEnabled: false
      } },
	// IndicationScreen: { screen: IndicationScreen },
});

const Profile_StackNavigator = createStackNavigator({
	Third: { screen: Profile },
	cardSelectionScreen: { screen: cardSelectionScreen }
},
{
  headerMode: 'Screen',
});
const OrderList_StackNavigator = createStackNavigator({
	OrderList: { screen: OrderList },
	OrderStatus: { screen: OrderStatusScreen },
	ServiceStatus: { screen: ServiceStatusScreen },
	ChatWithDriver: {screen : ChatWithDriver},
	ChatWithAdmin: {screen : ChatWithAdmin},
	OrderTracking: { screen: OrderTracking },
	ServiceTracking: {screen : ServiceTracking},

});


const Support_StackNavigator = createStackNavigator({
	SupportChat: { screen: SupportChat },
});
const Config_StackNavigator = createStackNavigator({
	Configuration: { screen: Configuration },
});

const Payments_StackNavigator = createStackNavigator({
	Six: { screen: Payments }
});
const Notifications_StackNavigator = createStackNavigator({
	Seven: { screen: Notifications }
});
const FavLocationScreen_StackNavigator = createStackNavigator({
	FavLocationScreen: { screen: FavLocationScreen }
});

const TearmandConditions_StackNavigator = createStackNavigator({
	TearmandConditions: { screen: TearmandConditions }
});


const DrawerNavigator = createDrawerNavigator(
	{
	// PusherIntegration: { screen: PusherIntegration_StackNavigator },
	MarketPlace: { screen: MarketTabNavigator },
	ServicePlace: { screen: ServicePlace_StackNavigator },
	LocationScreen: { screen: LocationScreen_StackNavigator  },

	Profile : { screen: Profile_StackNavigator },
	Shipping : { screen: OrderList_StackNavigator },
	Payments : { screen: Payments_StackNavigator },
	Notifications : { screen: Notifications_StackNavigator },
	FavLocation : { screen: FavLocationScreen_StackNavigator },
	TearmandConditions : { screen: TearmandConditions_StackNavigator},
	SupportScreen : { screen: Support_StackNavigator },
	MenuChatWithAdmin : { screen: Support_StackNavigator },
	Configuration : { screen: Config_StackNavigator},
	},
	{
		contentComponent: CustomSideBar,
		drawerWidth: width,
		drawerPosition: "right",

	});
export default createAppContainer(DrawerNavigator);
