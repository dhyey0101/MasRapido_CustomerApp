import React, { Component, useState  } from 'react';
import { ActivityIndicator , RefreshControl , SafeAreaView , Dimensions , Modal , BackHandler, AsyncStorage, Picker, Alert, StyleSheet, Text, View, Image, TextInput, TouchableOpacity, StatusBar,Keyboard, ScrollView } from 'react-native';
import { Col, Row, Grid } from "react-native-easy-grid";
import { t } from '../../../locals';
import {Collapse,CollapseHeader, CollapseBody, AccordionList} from 'accordion-collapse-react-native';
import Profile from './Profile.js';
import CustomToast from './Toast.js';
import PropTypes from 'prop-types';
import validate from 'validate.js';
import normalize from 'react-native-normalize';
import { getUserDetailAction, getOrderDetailAction,updatePaymentAction } from '../Util/Action.js';
import { NavigationEvents } from 'react-navigation';

const { width, height } = Dimensions.get("screen");

export default class cardSelectionScreen extends Component {
    
    constructor(props){
        super(props);
        this.state = {
			// user_name : '',
			// emailAddress : '',
			// mobile : '',
			method_name : '',
			card_number : '',
			month : '',
			year : '',
			cvv : '',
            dataSource: [],
            modalVisible: false,
            modalShow: false,
            modalCancel: false,
        }
    }
    static navigationOptions = ({ navigation }) => {
		return {
			headerShown: false
		};
	};
    toggleDrawer = ({navigation}) => {
	    this.props.navigation.toggleDrawer();
	};
    
    async componentDidMount() {
        // this.getOrderDetail();
        this.getUserDetail();
    }

    onRefresh() {
        this.getUserDetail();
    }
    setModalVisible = (visible) => {
    
        this.setState({ modalVisible: visible });
    }
    setModalShow = (visible) => {

        this.setState({ modalShow: visible });
    }
    setModalCancel = (visible) => {

        this.setState({ modalCancel: visible });
    }

    async getUserDetail() {
        this.setState({ loader: true });
        const customer_id = await AsyncStorage.getItem("userid");
        let Token = await AsyncStorage.getItem("token");

        Token = "Bearer " + Token;
        const getUserDetailData = {
            user_id: customer_id,
        };
        getUserDetailAction(getUserDetailData, Token).then((responseJson) => {
            if (responseJson.isError == false) {
                console.log(responseJson)
                this.setState({
                    user_name: responseJson.result.first_name,
                    emailAddress: responseJson.result.email,
                    mobile: responseJson.result.mobile,
                    loader: false, 
                });
            } else {
                // alert(responseJson.message);
                this.setState({ loader: false });
            }
        });
    }
    
    async send(){
        const { navigate } = this.props.navigation;
        const { method_name, card_number, month, year, cvv } = this.state;

        var constraints = {
            // user_name: {
            //     presence: {
            //         allowEmpty: false,
            //         message: "^ name required"
            //     },
            //     format: {
            //         pattern: "[A-Za-z ]+",
            //         flags: "i",
            //         message: "^ only characters"
            //     }
            // },
            // mobile: {
            //     format: {
            //       pattern: "[0-9]{7,15}",
            //       flags: "i",
            //       message: "^ 7 to 15 digit mobile number."
            //     },
            // },
            // emailAddress: {
            //     presence: {
            //         allowEmpty: false,
            //         message: "^ Email required"
            //     },
            //     email: {
            //         message: "^ Enter a valid email address"
            //     }
            // },
            method_name: {
                presence: {
                    allowEmpty: true,
                    message: "^ Payment method name required"
                },
                format: {
                    pattern: "[A-Za-z ]+",
                    flags: "i",
                    message: "^ Allow only characters"
                }
            },
			card_number: {
                presence: {
                    allowEmpty: true,
                    message: "^ Card number required"
                },
                format: {
                  pattern: "[0-9]{16}",
                  flags: "i",
                  message: "^ 16 digit card number required."
                },
            },
            year: {
                presence: {
                    allowEmpty: true,
                    message: "^ Year is required"
                },
            },
            month: {
                presence: {
                    allowEmpty: true,
                    message: "^ Month is required"
                },
            },
            cvv: {
                presence: {
                    allowEmpty: true,
                    message: "^ cvv required"
                },
                format: {
                  pattern: "[0-9]{3}",
                  flags: "i",
                  message: "^ 3 digit cvv required."
                },
            }
        };
		
        Keyboard.dismiss();
		
        const result = validate({ method_name: this.state.method_name, card_number:this.state.card_number, month:this.state.month, year:this.state.year,  cvv:this.state.cvv}, constraints);
		
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
			
            var updatePaymentData = {
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
            var response = updatePaymentAction(updatePaymentData,Token).then(function (responseJson) {
                console.log(responseJson)
                if (responseJson.isError == false) {
					this.refs.defaultToastBottomWithDifferentColor.ShowToastFunction(responseJson.message);
					// storage.updatePaymentMethod('is_update_payment_method_save').then((data) => {
						// navigate('App');
						// this.setState({ loading: false });
					// }).catch((err) => {
						// console.log(err)
					// });
					
                } else {
                    this.setState({ loading: false });
                    this.refs.defaultToastBottomWithDifferentColor.ShowToastFunction(responseJson.message);
                }
            }.bind(this));
        }
    };

    _onBlurr = () => {
        BackHandler.removeEventListener('hardwareBackPress',
            this._handleBackButtonClick);
    }

    _onFocus = () => {
        BackHandler.addEventListener('hardwareBackPress',
            this._handleBackButtonClick);
    }

    // _handleBackButtonClick = () => this.props.navigation.navigate('Profile')

    render() {
        const { navigate } = this.props.navigation;
        const { dataSource, first_name, emailAddress, mobile, user_name , modalShow , loader } = this.state;
        const order_id = this.props.navigation.getParam("order_id");
        const customer_id = this.props.navigation.getParam("customer_id");

        if (!loader) {
        return (
            
            <View style={styles.container}>
                <NavigationEvents
                    onWillFocus={this._onFocus}
                    onWillBlur={this._onBlurr}
                />
                <StatusBar />
                <Row style={styles.Navebar}>
                    <Col style={{marginLeft: normalize(40), justifyContent: 'flex-end',alignItems: 'flex-start',}}>
                        <TouchableOpacity onPress ={() => navigate('Profile')} > 
                            <Image source={require('../../images/Back-Arrow.png')} style={styles.BackArrow}/>
                        </TouchableOpacity>
                    </Col>
                    <Col style={{marginRight: normalize(40),justifyContent: 'flex-end',alignItems: 'flex-end',}}>
                        <TouchableOpacity  onPress={this.toggleDrawer.bind(this)}> 
                            <Image source={require('../../images/Menu.png')} style={styles.Menu}/>
                        </TouchableOpacity> 
                    </Col>
                </Row>
                
                <Row style={styles.name_row}>
                    <Text style={{fontFamily: 'Inter-Black', fontSize: 25 ,color: '#C1272D',}}>{t('My payment methods')}</Text>
                </Row>

                <Collapse style={styles.payment_coll}>
                    <CollapseHeader>
                        <Row style={styles.payment_coll_row}>
                            <Col style={{width: normalize(40),paddingTop: normalize(7)}}>
                                <Image source={require('../../images/card.png')} style={{height: normalize(25), width: normalize(25)}}/>
                            </Col>
                            <Col>
                                <Text style={{fontFamily: 'Inter-Black', fontSize: 19 ,color: '#000000',}}>{t('Add a new card')}</Text>
                            </Col>
                            <Col style={{width: normalize(30),}}>
                                <Image source={require('../../images/plus.png')} style={{height: normalize(16), width: normalize(16)}}/>
                            </Col>
                        </Row>
                    </CollapseHeader>
                    <CollapseBody>
                        
                        <Row style={{height: normalize(30), marginLeft: normalize(10), marginRight: normalize(10),marginTop: normalize(15),}}>
                            <TouchableOpacity style={{width: normalize(310),borderBottomWidth: 1,borderColor: '#5B6365',paddingLeft: normalize(10),}}>
                                <TextInput
                                    placeholder={t('NAME OF HOLDER')}
                                    style={{fontFamily: 'Inter-Black', fontSize:17, color: '#9DA4AB'}} />
                            </TouchableOpacity>
                        </Row>

                        <Row style={{height: normalize(30), marginLeft: normalize(10), marginRight: normalize(10),marginTop: normalize(15),}}>
                            <TouchableOpacity style={{width: normalize(310),borderBottomWidth: 1,borderColor: '#5B6365',paddingLeft: normalize(10),}}>
                                <TextInput
                                    placeholder={t('CARD NUMBER')}
                                    style={{fontFamily: 'Inter-Black', fontSize:17, color: '#9DA4AB'}} />
                            </TouchableOpacity>
                        </Row>

                        <Row style={{height: normalize(40), marginLeft: normalize(10), marginRight: normalize(10),}}>
                            <Col style={{borderBottomWidth: 1,borderColor: '#5B6365',paddingLeft: normalize(10),marginTop: normalize(15), marginRight: normalize(40)}}>
                                <TextInput
                                    placeholder={t('MM/YY')}
                                    style={{fontFamily: 'Inter-Black', fontSize:17, color: '#9DA4AB'}} />
                            </Col>
                            <Col style={{borderBottomWidth: 1,borderColor: '#5B6365',paddingLeft: normalize(10),marginTop: normalize(15)}}>
                                <TextInput
                                    placeholder={t('CVV')}
                                    style={{fontFamily: 'Inter-Black', fontSize:17, color: '#9DA4AB'}} />
                            </Col>
                        </Row>

                        <TouchableOpacity style={{backgroundColor: '#2497BF',height: normalize(30), marginTop: normalize(30),marginBottom: normalize(20), borderRadius: normalize(20),marginRight: normalize(65), marginLeft: normalize(65),}} onPress ={this.send.bind(this)}>
                            <Row style={{justifyContent: 'center', alignItems: 'center',}}>
                                <Text style={{fontSize: 18, fontFamily:'Inter-Black',color: '#fff'}}>{t('Save')}</Text>
                            </Row>
                        </TouchableOpacity>

                    </CollapseBody>
                </Collapse>

                <CustomToast ref = "defaultToastBottomWithDifferentColor" backgroundColor='#000' position = "top"/>
            </View>
        );
    }   else {
        return (
            <ActivityIndicator
              style={styles.loading}
              size="large"
              color="#1988B9"
            />
            );
        }
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        
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
    Navebar: {
        ...Platform.select ({
            ios:{
                height: normalize(35),
                paddingTop: normalize(35),
            },
            android:{
                height: normalize(35),
            }})

    },
    BackArrow: {
        width: normalize(25),
        height: normalize(25),
    },
    Menu: {
        width: normalize(27),
        height: normalize(27),
    },
    DownArrow: {
        width: normalize(21),
        height: normalize(21),
    },
    text: {
        ...Platform.select({
            ios:{
                color: '#C1272D',
                fontSize: 32,
                fontFamily: 'Inter-Black'
       
            },
            android:{
                color: '#C1272D',
                fontSize: 32,
                fontFamily: 'Inter-Black'        
            }
        })
    },
    payment_coll: {
        ...Platform.select({
            ios:{
                marginLeft: normalize(20),
                marginRight: normalize(20),
                borderRadius: normalize(20),
                marginTop: normalize(15),
                borderWidth: 1,
                borderColor: '#F2F2F2',
       
            },
            android:{
                marginLeft: normalize(20),
                marginRight: normalize(20),
                borderRadius: normalize(20),
                marginTop: normalize(15),
                borderWidth: 1,
                borderColor: '#F2F2F2',         
            }
        })
    },
    payment_coll_row: {
        ...Platform.select({
            ios:{
                backgroundColor: '#F2F2F2',
                height: normalize(40),
                borderRadius: normalize(20),
                justifyContent: 'center',
                alignItems: 'center',
                paddingLeft: normalize(15)
       
            },
            android:{
                backgroundColor: '#F2F2F2',
                height: normalize(40),
                borderRadius: normalize(20),
                justifyContent: 'center',
                alignItems: 'center',
                paddingLeft: normalize(15)      
            }
        })
    },
    payment_body: {
        ...Platform.select({
            ios:{
                backgroundColor: 'yellow',
                height: normalize(40),
                marginLeft: normalize(20),
                marginRight: normalize(20),
                justifyContent: 'center',
                alignItems: 'center',
                paddingLeft: normalize(15) 
       
            },
            android:{
                backgroundColor: 'yellow',
                height: normalize(40),
                marginLeft: normalize(20),
                marginRight: normalize(20),
                borderRadius: normalize(20),
                justifyContent: 'center',
                alignItems: 'center',
                paddingLeft: normalize(15)         
            }
        })
    },
    Listlogo: { 
        ...Platform.select({
            ios:{
                width: 60,
                height: 60,        
            }, 
            android:{
                width: normalize(70),
                height: normalize(70),
            }})
    },
    name_row: { 
        ...Platform.select({
            ios:{
                height: normalize(35),
                marginLeft: normalize(40),
                marginTop: normalize(40)        
            }, 
            android:{
                height: normalize(35),
                marginLeft: normalize(40),
                marginTop: normalize(20)
            }})
    },
    TextInput: {
        ...Platform.select({
            ios:
            {
                justifyContent: 'center', 
                alignItems: 'center',
                // textAlign: 'center',
                paddingTop: 10,
                paddingLeft: 20,
                borderStyle:  'dashed',
                // borderRadius: 40,
                // borderWidth: 2,
                fontSize: 20,
                width: 288,
                height: 40 ,
                borderColor: 'grey',
                // backgroundColor:'#e9e7e6',
                marginBottom: 10,
                color: '#000',
            }, 
            android:
            {
                justifyContent: 'center', 
                // paddingLeft: 40,
                paddingTop: 10,
                alignItems: 'center',
                borderStyle:  'dashed',
                // borderRadius: 40,
                fontSize: 20,
                // borderWidth: 2,
                width: 288,
                height: 40 ,
                // borderColor: 'grey',
                // backgroundColor:'#e9e7e6',
                marginBottom: 10,
                color: '#000',
                marginLeft: 20,
                marginRight:20,
                    
            }
        }),        
    },
    TextValue: {
        ...Platform.select({
            ios:
            {
                justifyContent: 'center', 
                alignItems: 'center',
                // textAlign: 'center',
                paddingTop: 10,
                paddingLeft: 20,
                borderStyle:  'dashed',
                // borderRadius: 40,
                // borderWidth: 2,
                fontSize: 20,
                width: 288,
                height: 40 ,
                borderColor: 'grey',
                // backgroundColor:'#e9e7e6',
                marginBottom: 10,
                color: '#000',
                fontWeight:'bold'
            }, 
            android:
            {
                fontSize: 18,
                fontFamily: 'Inter-Black',
                color: '#1988B9',
                justifyContent: 'center',
                alignItems: 'flex-start',
                    
            }
        }),        
    },
    Accordion: {
        // backgroundColor:'#e9e7e6',
        marginLeft: 20,
        marginRight: 20,
        borderBottomWidth: 2,
        // marginTop: 10,
    },

    Login: {
       marginTop: 15,
       alignItems: 'center',
       justifyContent: 'center',
       width: 300,
       height: 60 ,
       borderRadius: 40,
       backgroundColor: '#e02127',
       color: '#fff',
       

    },
    ScenteredView: {
        // borderRadius: 10,
        shadowColor: "#232324",
        shadowOffset: { width: 0, height: 1, },
        elevation: 200,
        height: Dimensions.get('window').height,
        backgroundColor: "rgba(100,100,100, 0.8)",
  },
  SmodalView: {
    ...Platform.select({
      ios: {
        borderRadius: 20,
        top: '15%',
        marginLeft: 20,
        marginRight: 20,
        backgroundColor: "white",
        opacity: 1.25,
        paddingLeft: 5,
        paddingRight: 5,
        shadowColor: "#232324",

        shadowOffset: {
          width: 0,
          height: 2,
        },

        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5

      },
      android: {
        borderRadius: 20,
        top: '25%',
        marginLeft: 20,
        marginRight: 20,
        backgroundColor: "white",
        opacity: 1.25,
        paddingLeft: 5,
        paddingRight: 5,
        shadowColor: "#232324",

        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5
      }
    })

  },
  STextRow: {
    marginTop: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  notes: {
    marginTop: 30,
    marginLeft: 10,
    marginRight: 10,

  },
  SPlaceOrder_Row: {
    marginTop: 30,
    justifyContent: 'center',
    marginBottom: 30,
  },
  PlaceOrder_Row: {
    marginTop: 10,
    justifyContent: 'center',
  },
  PlaceOrder_Button: {
    marginTop: 15,
    alignItems: 'center',
    justifyContent: 'center',
    width: "80%",
    height: 60,
    borderRadius: 40,
    backgroundColor: '#e02127',
    color: '#fff',
  },
  PlaceOrder_Text: {
    color: '#fff',
    fontSize: 20,
    fontFamily: 'Inter-Black',
  },
  SLogo: {
    width: 50,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  Paragraph: {
    fontSize: 15,
    fontFamily: 'Inter-Black',
  },
  SpopupTextName: {
    fontFamily: 'Inter-Black',
    justifyContent: "center",
    fontSize: 20,
    textAlign: 'center',
    width: '80%',
  },
});