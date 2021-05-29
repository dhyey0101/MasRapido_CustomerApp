import React,{Component} from 'react';
import { StyleSheet, View,ActivityIndicator,StatusBar,AsyncStorage } from 'react-native';
import { createSwitchNavigator, createAppContainer } from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
import Login from './pages/Auth/Login.js';
import List from '../src/pages/Apps/List.js';
import MobileNumber from '../src/pages/Auth/MobileNumber.js';
import VerifyOTP from '../src/pages/Auth/VerifyOTP.js';
// import Payment from '../src/pages/Auth/PaymentScreen.js';
import Selection from '../src/pages/Apps/SelectionScreen.js';
import DrawerStack from './pages/Apps/drawerstack.js';
import DropdownAlert from "react-native-dropdownalert";
import NetInfo from "@react-native-community/netinfo";

NetInfoSubscribtion = null;

class AuthLoadingScreen extends Component {
  constructor() {
    super();
    this.state = {
      // for internet check
      connection_status: false,
    };
    this._bootstrapAsync();
  }


  async componentDidMount() {
    // internet not connected alert code
    this.NetInfoSubscribtion = NetInfo.addEventListener(
      this._handleConnectivityChange
    );

    if (!this.state.connection_status) {
      this.dropdown.alertWithType(
        "error",
        "OH!!",
        "Sorry you're not connected to the Internet"
      );
    }
  }

  componentWillUnmount() {
    this.NetInfoSubscribtion && this.NetInfoSubscribtion();
  }

  _handleConnectivityChange = async (state) => {
    this.setState({
      connection_status: state.isConnected,
    });

    if (this.state.connection_status) {
      const userToken = await AsyncStorage.getItem("token");
      this.props.navigation.navigate(userToken ? "App" : "Auth");
    }
  };

  // Fetch the token from storage then navigate to our appropriate place
  _bootstrapAsync = async () => {
	  
    const userToken = await AsyncStorage.getItem('token');
    // const is_payment_method_save = await AsyncStorage.getItem('is_payment_method_save');

    // This will switch to the App screen or Auth screen and this loading
    // screen will be unmounted and thrown away.
    // this.props.navigation.navigate(userToken ? ((is_payment_method_save == 1)? 'App':'Payment') : ('Auth'));
    // this.props.navigation.navigate(userToken ? 'App' : 'Auth');
    if (this.state.connection_status) {
      this.props.navigation.navigate(userToken ? "App" : "Auth");
    }
  };

 // Render any loading content that you like here
    
    render() {
      const { loader, mobile, connection_status } = this.state;
        // return (
        // <ActivityIndicator style={styles.loading} size='large' color='#781f19' />
        // );

        return (
          <View style={styles.container}>
            <ActivityIndicator
              style={styles.loading}
              size="large"
              color="#d62326"
            />
            {
              connection_status == false ? (<DropdownAlert ref={(ref) => (this.dropdown = ref)} />) : (<View></View>)
            }
            {/* <DropdownAlert ref={(ref) => (this.dropdown = ref)} /> */}
              
          </View>
        );
    }
}


const AppStack = createStackNavigator({ DrawerStack: { screen: DrawerStack }}, {headerMode: 'Screen'})
// const AppStack = createAppContainer({Selection: Selection})
const AuthStack = createStackNavigator({
                  Login: Login,
                  MobileNumber: MobileNumber, 
                  VerifyOTP: VerifyOTP,
                  // Payment: Payment,
                  // Selection: Selection,
                  });

export default createAppContainer(createSwitchNavigator(
    {
      AuthLoading: AuthLoadingScreen,
      // Payment: Payment,
      App: DrawerStack,
      Auth: AuthStack,
    },
    {
      initialRouteName: 'AuthLoading',
    }
));

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
	loading: {
		position: 'absolute',
		left: 0,
		right: 0,
		top: 0,
		bottom: 0,
		alignItems: 'center',
		justifyContent: 'center'
	},
});