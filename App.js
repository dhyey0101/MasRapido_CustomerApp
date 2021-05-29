import React, { Component } from 'react';
import { StyleSheet, View , ActivityIndicator} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import Login from './src/pages/Auth/Login.js';
// import Login from '/src/Route.js';
import List from './src/pages/Apps/List.js';
// import Social from './src/pages/Apps/Social.js';
// import Demo1 from './src/pages/Apps/radio.js';
import VerifyOTP from './src/pages/Auth/VerifyOTP.js';
import AppNavigator from './src/Routes.js';
import Payment from './src/pages/Auth/PaymentScreen.js';
import Selection from './src/pages/Apps/SelectionScreen.js';

import AppLoading from 'expo-app-loading';
import { useFonts } from 'expo-font';
import { t } from './locals';
// import i18n from 'i18n-js';

// import Backscreen from './Backscreens.js';



// export default class App extends Component { 

//     /**
// 	 * design part of this page
// 	 */
//   render(){
// 		return (
// 			// <View style = {styles.container}>
// 				<AppNavigator style = {styles.container}/>                 
// 			// </View>
// 		);
//   }

// }

export default props => {

	let [fontsLoaded] = useFonts({
		'Inter-Black': require('./assets/fonts/Coolvetica-Regular.ttf'),
	});

	if (!fontsLoaded) {
		return (
			<ActivityIndicator
				style={styles.loading}
				size="large"
				color="#d62326"
			/>
		);
	} else {
		return (
			<AppNavigator style={styles.container} />
		);
	}
};

const styles = StyleSheet.create({

	container: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		height: 50,
		width: '100%',
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
})















// const App=createStackNavigator(
//   {
//     Login:{screen:Login},
//     Cellular:{screen:Cellular},
//   }
// );
// export default createAppContainer(App);
// export default class App extends Component {
//   render() {
//     return (
//       <AppNavigator />
//     );
//   }
// }

// // const App = () => {
// //   return (

// //     // <Login />
// //     // <Cellular />
// //     // <Payment />
// //     // <Selection />
// //     <List />  

// //   )
// // }

// // export default App