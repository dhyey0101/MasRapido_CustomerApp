import React, { Component, useState  } from 'react';
import { AsyncStorage, Picker, Alert, StyleSheet, Text, View, Image, TextInput, TouchableOpacity, StatusBar,Keyboard, ScrollView } from 'react-native';
import { Dropdown } from 'react-native-material-dropdown-v2';
import { Col, Row, Grid } from "react-native-easy-grid";
import logo from '../../images/Logo.png';
import CustomToast from './Toast.js';
import PropTypes from 'prop-types';
import validate from 'validate.js';
import { savePaymentAction } from '../Util/Action.js';
import { storage } from '../Util/storage.js';
import RNPickerSelect from 'react-native-picker-select';
import Demo1 from '../Apps/radio.js';
import { t } from '../../../locals';



// import { createStackNavigator } from 'react-navigation';

// import Month from '../Apps/month.js';
// import BackArrow from '../../images/Back-Arrow.png';
// import Menu from '../../images/Menu.png';
// import Date from '../Apps/Dates.js';


export default class Payment extends Component {

    static navigationOptions = ({navigation}) => {
        return {
            headerShown: false
        };
    };
    _twoOptionAlertHandler=()=>{
    //function to make two option alert
        Alert.alert(
        //title
        'Tearm and conditions',
        //body
        'Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source. Lorem Ipsum comes from sections 1.10.32 and 1.10.33 of "de Finibus Bonorum et Malorum" (The Extremes of Good and Evil) by Cicero, written in 45 BC. This book is a treatise on the theory of ethics, very popular during the Renaissance. The first line of Lorem Ipsum, "Lorem ipsum dolor sit amet..", comes from a line in section 1.10.32.The standard chunk of Lorem Ipsum used since the 1500s is reproduced below for those interested. Sections 1.10.32 and 1.10.33 from "de Finibus Bonorum et Malorum" by Cicero are also reproduced in their exact original form, accompanied by English versions from the 1914 translation by H. Rackham.',
        [
            {text: 'Ok'},
            // {text: 'No', onPress: () => console.log('No Pressed'), style: 'cancel'},
        ],
        { cancelable: false }
        //clicking out side of alert will not cancel
        );
    }

    // state = {months: ''}
    // updateUser = (months) => {
    //     this.setState({ months: months })
    // }
    constructor(props){
    super(props);
    this.state={
		// selectedMonth: 'Jan',
		// selectedYear: '2020',
        name: '', 
        card_number : '',
        month: '01',
        year: '2020',
        cvv: '',
    };
    }
    async send(){
        const { navigate } = this.props.navigation;
        const { card_number, method_name, month, year, cvv } = this.state;

        var constraints = {
            method_name: {
                presence: {
                    allowEmpty: false,
                    message: "^ Full name required"
                },
                format: {
                    pattern: "[A-Za-z ]+",
                    flags: "i",
                    message: "^ only characters"
                }
            },
			card_number: {
                format: {
                  pattern: "[0-9]{16}",
                  flags: "i",
                  message: "^ 16 digit card number required."
                },
            },
            year: {
                presence: {
                    allowEmpty: false,
                    message: "^ Year is required"
                },
            },
            month: {
                presence: {
                    allowEmpty: false,
                    message: "^ Month is required"
                },
            },
            cvv: {
                format: {
                  pattern: "[0-9]{3}",
                  flags: "i",
                  message: "^ 3 digit cvv required."
                },
            }
        };
		
        Keyboard.dismiss();
		
        const result = validate({ card_number:this.state.card_number, method_name: this.state.method_name, year:this.state.year, month:this.state.month, cvv:this.state.cvv}, constraints);
		
        if(result)
        {
            if (result.method_name) {
                this.refs.defaultToastBottomWithDifferentColor.ShowToastFunction(result.method_name);
				return false;
            }
			
            if(result.card_number)
            {
                this.refs.defaultToastBottomWithDifferentColor.ShowToastFunction(result.card_number);
				return false;
            }
			
            if(result.month) {
                this.refs.defaultToastBottomWithDifferentColor.ShowToastFunction(result.month);
				return false;
            }
			
            if(result.year) {
                this.refs.defaultToastBottomWithDifferentColor.ShowToastFunction(result.year);
				return false;
            }
			
            if(result.cvv) {
                this.refs.defaultToastBottomWithDifferentColor.ShowToastFunction(result.cvv);
				return false;
            }
        }

      
        if(!result) {
            let customer_id = await AsyncStorage.getItem('userid');
			
            var paymentData = {
                customer_id: customer_id,
                method_name: this.state.method_name,
                card_number: this.state.card_number,
                year: this.state.year,
                month: this.state.month,
                cvv: this.state.cvv, 
            }
			
            let Token = await AsyncStorage.getItem('token');
			Token = 'Bearer ' + Token;
			
            this.setState({ loading: true });
            var response = savePaymentAction(paymentData, Token).then(function (responseJson) {
                console.log(responseJson)
                if (responseJson.isError == false) {
					
					storage.updatePaymentMethod('is_payment_method_save').then((data) => {
						navigate('App');
						this.setState({ loading: false });
					}).catch((err) => {
						console.log(err)
					});
					
                } else {
                    this.setState({ loading: false });
                    this.refs.defaultToastBottomWithDifferentColor.ShowToastFunction(responseJson.message);
                }
            }.bind(this));
        }
    };
    render () {
        const { loader } = this.state;
        const {navigate} = this.props.navigation;
        let { month, year } = this.state;
        if (!loader) {
        return ( 
            <View style={styles.container} >
                <StatusBar />
                <Row style={styles.Navebar}>
                    <Col>
                        {/* <TouchableOpacity onPress ={() => navigate('VerifyOTP')} > 
                            <Image source={require('../../images/Back-Arrow.png')} style={styles.BackArrow}/>
                        </TouchableOpacity> */}
                    </Col>
                    {/* <Col>
                        <TouchableOpacity style={{alignItems: 'flex-end'}}> 
                            <Image source={require('../../images/Menu.png')} style={styles.Menu}/>
                        </TouchableOpacity> 
                    </Col> */}
                </Row>
               
                <Row style={styles.Row}>
                <ScrollView showsVerticalScrollIndicator={false}>
                    <Col>
                        <Row style={styles.Register}>
                            <Text style={styles.Text}>
                                {t('Register a payment method')}
                            </Text>    
                        </Row>
                        <Row style={styles.Cards}> 
                            <Image source={require('../../images/Visa-Card.png')} style={styles.Visacard} />
                            <Image source={require('../../images/Master-Card.png')} style={styles.Mastercard} />
                        </Row>
                        <Row>
                            <Col style={{alignItems: 'center',
        justifyContent: 'center',}}>
                                
                                <TextInput style={styles.TextInput} 
                                    placeholder={t('Name')}
                                    maxLength={25} 
                                    autoCorrect={false} 
                                    autoComplete={false}
                                    onChangeText={(method_name) => this.setState({ method_name })}>
                                </TextInput>
                        
                                
                                <TextInput style={styles.TextInput} 
                                    placeholder={t('Card Number')}
                                    keyboardType="numeric" 
                                    maxLength={16}
                                    minLength={16}
                                    onChangeText={(card_number) => this.setState({ card_number })}>
                                </TextInput>

                                
                            </Col>
                        </Row>
                        <Row>
                            <Col >
                                <Row style={{marginLeft: 50} }>
                                    <Text style={styles.expiration}>{t('Expiration')}</Text>
                                </Row>
                                <Row style={{alignItems: 'center',
        justifyContent: 'center', marginLeft: 35, marginRight: 35}}>
                                    <Col  style={styles.dropdownStyle}>                        
                                        <RNPickerSelect
                                                onValueChange={(month) => this.setState({ month })}
                                                value={month}
                                                placeholder={{}}
                                                items={[
                                                    { label: 'Jan', value: '01' },
                                                    { label: 'Feb', value: '02' },
                                                    { label: 'Mar', value: '03' },
                                                    { label: 'Apr', value: '04' },
                                                    { label: 'May', value: '05' },
                                                    { label: 'Jun', value: '06' },
                                                    { label: 'Jul', value: '07' },
                                                    { label: 'Aug', value: '08' },
                                                    { label: 'Sep', value: '09' },
                                                    { label: 'Oct', value: '10' },
                                                    { label: 'Nov', value: '11' },
                                                    { label: 'Dec', value: '12' },

                                                ]}
                                        />   
                                    </Col>
                                    
                                    <Col style={styles.dropdownStyle} >
                                         <RNPickerSelect 
                                                
                                                onValueChange={(year) => this.setState({ year })}
                                                value={year}
                                                placeholder={{}}
                                                items={[
                                                    { label: '2020', value: '2020' },
                                                    { label: '2021', value: '2021' },
                                                    { label: '2022', value: '2022' },
                                                    { label: '2023', value: '2023' },
                                                    { label: '2024', value: '2024' },
                                                    { label: '2025', value: '2025' },
                                                    { label: '2026', value: '2026' },
                                                    { label: '2027', value: '2027' },
                                                    { label: '2028', value: '2028' },
                                                    { label: '2029', value: '2029' },
                                                    { label: '2030', value: '2030' },

                                                ]}
                                        />
                                    </Col>
                                    <Col style={styles.CVV}>
                                        <TextInput  placeholder={t('CVV')}
                                                    keyboardType="numeric" 
                                                    maxLength={3}  
                                                    onChangeText={(cvv) => this.setState({ cvv })}>
                                        </TextInput>
                                    </Col>
                                </Row>
                                <Row style={{alignItems: 'center',
        justifyContent: 'center',}}>
                                    <TouchableOpacity> 
                                        <Demo1/>
                                    </TouchableOpacity>
                                    
                                    <Text style={styles.Accept}>
                                        {t('card')}
                                    </Text>
                                </Row>
   
                                <Row style={{alignItems: 'center',
        justifyContent: 'center',}}>
                                    <TouchableOpacity> 
                                        <Demo1/>
                                    </TouchableOpacity>
                                    
                                    <TouchableOpacity onPress={this._twoOptionAlertHandler}>
                                        <Text style={styles.Accept}>
                                        {t('terms & conditions')}
                                        <Text style={{color: 'blue'}}>{t('See Terms and conditions')}</Text>
                                        </Text> 
                                    </TouchableOpacity>
                                </Row>
                                <Row style={{alignItems: 'center',
        justifyContent: 'center',}}>
                                    <TouchableOpacity style={styles.Send} onPress ={this.send.bind(this)}> 
                                        <Text style={{color: '#fff', fontSize:20}}>{t('SEND')}</Text>
                                    </TouchableOpacity>
                    
                                </Row>        
                            </Col>
                        </Row>

                    </Col>
                    <CustomToast ref = "defaultToastBottomWithDifferentColor" backgroundColor='#000' position = "top"/>
                </ScrollView>   
                </Row>
            </View>
    
        )
        } else{
            return <ActivityIndicator style={styles.loading} size='large' color='#d62326' />
        }
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
        // marginLeft: 50,
    
    },
    Mastercard: { 

        width: 85,
        height: 60,
        // marginLeft: 25,
       
    },
    Text: {
        // justifyContent: 'center', 
        // alignItems: 'center',
        color: '#e02428',
        fontWeight: 'bold',
        fontSize: 23,
        // height: 50,
    },
    TextInput: {
        ...Platform.select({
        ios:{justifyContent: 'center', 
                alignItems: 'center',
                // textAlign: 'center',
                paddingLeft: 40,
                borderStyle:  'dashed',
                borderRadius: 40,
                borderWidth: 2,
                width: 288,
                height: 60 ,
                borderColor: 'grey',
                backgroundColor:'#e9e7e6',
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
                backgroundColor:'#e9e7e6',
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
    // width: '80%',
    // alignItems: 'center',
    },

    Accept: {
        marginTop:15,
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 10,	
        width: 250,
        // height: 50,
    },

    Register: {
        alignItems: 'center',
        justifyContent: 'center',
        height: 30, 
        marginBottom: 20,
    },

    Cards: {
        alignItems: 'center',
        justifyContent: 'center',
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
       backgroundColor: '#e02428',
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
            // marginTop: 10,
            marginLeft: 10,
            width: '28%',
        },
                
        android: { 
                width: '29%',
                borderStyle:  'dashed',
                marginLeft: 5, 
                borderWidth:1, 
                paddingTop: 12, 
                marginTop: 5,
                paddingLeft: 10, 
                textAlign: 'center', 
                borderRadius: 50, 
                height: 56,
                } })
    },
//Picker CSS   
    dropdownStyle: {
        ...Platform.select({
            ios:{
                marginTop: 10,
                marginLeft: 5,
                marginBottom: 7,
                // width: '30%',
                paddingTop: 15,
                paddingLeft: 5,
                alignSelf: "stretch",
                borderWidth: 1,
                borderColor: '#000',
                borderRadius: 40 ,
                borderStyle:  'dashed',
                height: 50,
                backgroundColor: '#e9e7e6',

            }, 
            android:{
                //flex: 1,
                backgroundColor: '#e9e7e6',
                marginTop: 10,
                marginLeft: 5,
                marginBottom: 7,
                width: '36%',
                paddingTop: 5,
                paddingRight: 0,
                alignSelf: "stretch",
                // Set border width.
                borderWidth: 1,
                // Set border Hex Color Code Here.
                borderColor: '#000',
                // Set border Radius.
                borderRadius: 40 ,
                borderStyle:  'dashed',
                

            }})
   
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