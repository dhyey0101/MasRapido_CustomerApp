//This is an example code for NavigationDrawer//
import React, { Component } from 'react';
//import react in our code.
import { StyleSheet, View, Text, TouchableOpacity, Image } from 'react-native';
// import all basic components

class NavigationDrawerStructure extends Component {
	toggleDrawer = () => {
		this.props.navigationProps.toggleDrawer();
	};

	/** Image for open / close sidebar menu(toggle) */
	render() {
		return (
			<View style={{ flexDirection: 'row', color: '#781f19' }}>
				<TouchableOpacity onPress={this.toggleDrawer.bind(this)} style={{alignItems: 'flex-end'}} > 
                            <Image source={require('../../images/Menu.png')} style={styles.Menu}/>
                </TouchableOpacity>
			</View>
		);
	}
}
export default NavigationDrawerStructure

const styles = StyleSheet.create({

    Menu: {
        width: 25,
        height: 25,
        justifyContent: 'center', 
        alignItems: 'center',
        marginRight: 10,
        marginTop: 10,
    },
});