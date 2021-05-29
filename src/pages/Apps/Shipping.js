import React, { Component } from 'react';
import { Dimensions, StyleSheet, Text, View, Image, Button, TextInput, TouchableOpacity, StatusBar,ScrollView, AsyncStorage } from 'react-native';
import { Col, Row, Grid } from "react-native-easy-grid";
import NavigationDrawerStructure from './navigationdrawerstructure.js';
import { t } from '../../../locals';
import Selection from './SelectionScreen.js';
import MapView from 'react-native-maps';

export default class Shipping extends Component {
    static navigationOptions = ({ navigation }) => {
		return {
			headerShown: false
		};
	};
    toggleDrawer = ({navigation}) => {
	    this.props.navigation.toggleDrawer();
	};
    render(){
        const { navigate } = this.props.navigation;
        return(
            <View style={styles.container}>
                <Row style={styles.Navebar}>
                    <Col>
                        <TouchableOpacity onPress ={() => navigate('Selection')} > 
                            <Image source={require('../../images/Back-Arrow.png')} style={styles.BackArrow}/>
                        </TouchableOpacity>
                    </Col>
                    <Col>
                        <TouchableOpacity style={{alignItems: 'flex-end'}}  onPress={this.toggleDrawer.bind(this)}> 
                            <Image source={require('../../images/Menu.png')} style={styles.Menu}/>
                        </TouchableOpacity> 
                    </Col>
                </Row>
                <Row style={{justifyContent: 'center', height: 50,}}>
                    <Text style={styles.Text}>Shipping</Text>
                </Row>
                <Col style={{justifyContent: 'center'}}> 
                    <MapView style={styles.mapStyle} />
                </Col>
                <Col style={{justifyContent: 'center',}}> 
                    <MapView style={styles.mapStyle} />
                </Col>
            </View>
        )
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        // alignItems: 'center',
        justifyContent: 'center',
        // height: 30,
        
    },
    Navebar: {
        ...Platform.select ({
            ios:{
                height: 1 , 
                paddingBottom: 50, 
                marginTop:30
            },
            android:{
                height: 40 , 
                marginTop: 30,
            }})

    },
    BackArrow: {
        width: 25,
        height: 25,
        justifyContent: 'center', 
        alignItems: 'center',
        marginLeft: 10,
        marginTop: 10,
    },
    Menu: {
        width: 25,
        height: 25,
        justifyContent: 'center', 
        alignItems: 'center',
        marginRight: 10,
        marginTop: 10,
        
    
    
    },
    Text: {
        // justifyContent: 'center', 
        // alignItems: 'center',
        color: '#e02428',
        fontWeight: 'bold',
        fontSize: 23,
        // height: 50,
    },
    mapStyle: {
        // width: Dimensions.get('window').width,
        // height: Dimensions.get('window').height,
        height: 200,
        width: 350,
    },
});