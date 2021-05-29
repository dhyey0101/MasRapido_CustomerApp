import React, { Component, useState  } from 'react';
import { StyleSheet, Text, View, Image, TextInput, TouchableOpacity, StatusBar, ScrollView } from 'react-native';
import { Dropdown } from 'react-native-material-dropdown-v2';
import { Col, Row, Grid } from "react-native-easy-grid";
import logo from '../../images/Logo.png';
// import { createStackNavigator } from 'react-navigation';

// import Month from '../Apps/month.js';
// import BackArrow from '../../images/Back-Arrow.png';
// import Menu from '../../images/Menu.png';
// import Date from '../Apps/Dates.js';
import Demo1 from '../Apps/radio.js';


export default class Payment extends Component {
    static navigationOptions = ({navigation}) => {
        return {
            header: null
        };
    };
    
    // state = {months: ''}
    // updateUser = (months) => {
    //     this.setState({ months: months })
    // }
    constructor(props){
    super(props);
    this.state={
        Month:[{
            value: 'Jan',
        },
        {
            value: 'Feb',
        },
        {
            value: 'Mar',
        }],
        Year:[{
            value: '2020',
        },
        {
            value: '2021',
        },
        {
            value: '2022',
        }],
    }
    }
    
    render () {
       
        const {navigate} = this.props.navigation;
        return ( 
            <View style={styles.container} >
                <StatusBar />
                <Row style={styles.Navebar}>
                    <Col>
                        <TouchableOpacity onPress ={() => navigate('VerifyOTP')} > 
                            <Image source={require('../../images/Back-Arrow.png')} style={styles.BackArrow}/>
                        </TouchableOpacity>
                    </Col>
                    <Col>
                        <TouchableOpacity style={{alignItems: 'flex-end'}}> 
                            <Image source={require('../../images/Menu.png')} style={styles.Menu}/>
                        </TouchableOpacity> 
                    </Col>
                </Row>
               
                <Row style={styles.Row}>
                <ScrollView showsVerticalScrollIndicator={false}>
                    <Col>
                        <Row style={styles.Register}>
                            <Text style={styles.Text}>
                                Register a payment method
                            </Text>    
                        </Row>
                        <Row style={styles.Cards}> 
                            <Image source={require('../../images/Visa-Card.png')} style={styles.Visacard} />
                            <Image source={require('../../images/Master-Card.png')} style={styles.Mastercard} />
                        </Row>
                        <Row style={styles.Row}>
                            <Col>
                                
                                <TextInput style={styles.TextInput} 
                                    placeholder='Name' 
                                    maxLength={25} 
                                    autoCorrect={false} 
                                    autoComplete={false}>
                                    
                                </TextInput>
                        
                                
                                <TextInput style={styles.TextInput} 
                                    placeholder='Card Number' 
                                    keyboardType="numeric" 
                                    maxLength={16}>
                                    
                                </TextInput>

                                
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <Row style={{ height: 20, marginTop: 10}}>
                                    <Text style={styles.expiration}>Expiration</Text>
                                </Row>
                                <Row>
                                    <Col style={styles.Input}>
                
                                        <Dropdown data={this.state.Month}>
                                        </Dropdown>
                                    </Col>
                                    
                                    <Col style={styles.Input} >
                                        <Dropdown data={this.state.Year}>
                                            {/* <Picker.Item label = "2020" value = "2020" />
                                            <Picker.Item label = "2021" value = "2021" />
                                            <Picker.Item label = "2022" value = "2022" /> */}
                                        </Dropdown>
                                    </Col>
                                    <Col style={styles.CVV}>
                                        <TextInput  placeholder='CVV'  keyboardType="numeric" maxLength={3}>
                                        </TextInput>
                                    </Col>
                                </Row>
                                <Row >
                                    <TouchableOpacity> 
                                        <Demo1/>
                                    </TouchableOpacity>
                                    
                                    <Text style={styles.Accept}>
                                        Your card will be kept as a payment method for your fururos shipments
                                    </Text>
                                </Row>
   
                                <Row>
                                    <TouchableOpacity> 
                                        <Demo1/>
                                    </TouchableOpacity>
                                    
                                    <Text style={styles.Accept}>
                                        I agree with the terms and conditions. See Terms and conditions
                                    </Text>
                                </Row>
                                <Row>
                                    <TouchableOpacity style={styles.Send} onPress = {() => navigate('Login')}> 
                                        <Text style={{color: '#fff', fontSize:20}}>SEND</Text>
                                    </TouchableOpacity>
                    
                                </Row>        
                            </Col>
                        </Row>

                    </Col>
                </ScrollView>   
                </Row>
            </View>
                
                
               
                   

            
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
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
                marginTop:40,
                
            }})

    },

    BackArrow: {
        width: 25,
        height: 25,
        justifyContent: 'center', 
        alignItems: 'center',
        marginLeft: 30,

    },

    Menu: {
        width: 25,
        height: 25,
        justifyContent: 'center', 
        alignItems: 'center',
        marginRight: 30,

        


    },
    Visacard: {

        width: 85,
        height: 60,
        marginLeft: 50,
        
        
        
    },
    Mastercard: { 

        width: 85,
        height: 60,
        marginLeft: 25,
       
    },
    Text: {
        // justifyContent: 'center', 
        // alignItems: 'center',
        color: 'red',
        fontWeight: 'bold',
        fontSize: 23,
        // height: 50,
    },
    TextInput: {
        ...Platform.select({
        ios:{justifyContent: 'center', 
                // alignItems: 'center',
                // textAlign: 'center',
                paddingLeft: 40,
                borderStyle:  'dashed',
                borderRadius: 40,
                borderWidth: 2,
                width: 288,
                height: 60 ,
                borderColor: 'grey',
                backgroundColor:'lightgrey',
                marginBottom: 10,
                color: '#000',}, 
        android:{justifyContent: 'center', 
                paddingLeft: 40,
                alignItems: 'center',
                borderStyle:  'dashed',
                borderRadius: 40,
                borderWidth: 2,
                width: 288,
                height: 60 ,
                borderColor: 'grey',
                backgroundColor:'lightgrey',
                marginBottom: 10,
                color: '#000',
                
} })
        
    },
    expiration: {
        
        color: '#000',
        
    },

    Row: {
    // marginTop: 10,
    // height:50,
    flex: 1,
    justifyContent: 'center',
    width: '80%',
    alignItems: 'center',
    },

    Accept: {
        marginTop:15,
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 10,	
        width: 250,
        height: 50,
    },

    Register: {
        
        height: 30, 
        marginBottom: 20,
    },

    Cards: {
        height: 30, 
        marginBottom: 30,
    },

    Send: {
       marginTop: 10,
       marginBottom: 20,
       alignItems: 'center',
       justifyContent: 'center',
       width: 288,
       height: 60 ,
       borderRadius: 40,
       backgroundColor: 'red',
       color: '#fff',

    },

    DownArrow: {
        width: 10,
        height: 10,
    },
    Input:{
       
        ...Platform.select({ 
        ios: {
                borderStyle:  'dashed',
                borderColor: 'grey',
                borderRadius: 40,
                borderWidth: 1,
                marginTop:10,
                marginLeft: 3 ,
                textAlign: 'center',
                backgroundColor: 'lightgrey',
                paddingLeft: 20,
                height: 60,
                width: 92 ,
                marginBottom: 20,
                },
                
        android: { 
                borderStyle:  'dashed',
                borderColor: 'grey',
                borderRadius: 40,
                borderWidth: 1,
                marginTop:10,
                // paddingBottom: 50,
                marginLeft: 3 ,
                paddingLeft: 20,
                textAlign: 'center',
                backgroundColor: 'lightgrey',
                height: 60,
                
                width: 92 ,} })
    },
    dropdown: {
        // width: '80%',
        borderBottomWidth: 0,
    },
    CVV:{
       
        ...Platform.select({ 
        ios: {
            borderStyle:  'dashed',
            textAlign: 'center',
            borderWidth:1,
            height: 50,
            borderRadius: 50,
            paddingLeft: 10, 
            paddingTop: 15,
            marginTop: 15,
            marginLeft: 10,
        },
                
        android: { 
                borderStyle:  'dashed',
                marginLeft: 10, 
                borderWidth:1, 
                paddingTop: 10, 
                marginTop: 10,
                paddingLeft: 10, 
                textAlign: 'center', 
                borderRadius: 50, 
                height: 56,
                } })
    },
    

});