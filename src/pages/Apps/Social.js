import React, { Component } from 'react';
import { Text, StyleSheet, View, TouchableOpacity, TextInput } from 'react-native';
import { Col, Row, Grid } from "react-native-easy-grid";
import VerifyOTP from '../Auth/VerifyOTP.js';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

class Social extends Component {

        constructor(props){
        super(props);
        this.state = {
          mobile : '',
          mobileError : '',
        }
    }; 
    async login(){
      const { mobile } = this.state;
      var constraints = {
            mobile: {
              presence: {
                allowEmpty: false,
                message: "is required"
              }
            },
      };
      Keyboard.dismiss();
      const result = validate({mobile:this.state.mobile}, constraints);
      if(result)
		  {
          if(result.mobile)
          {
            this.setState({ mobileError: result.mobile })
          }else{
            this.setState({ mobileError: '' })
          }
      }
    };
    // Cellullar=()=>
    // {
    //     this.props.navigation.navigate('Cellular');
    // }


    // alertItemName = (item) => {
    //     alert(item.Google)
    // }

    // alertItemName = (item) => {
    //     alert(item.Facebook)
    // }

    alertItemName = (VerifyOTP) => {
        alert(VerifyOTP.VerifyOTP)
    }

    
    render() {
        // const {navigate} = this.props.navigation;


        return (
            <View style={{justifyContent: 'center'}}>
                <Grid>

                    <Row>
                        <TouchableOpacity style={styles.Google} onPress ={() => navigate('Payment')}> 
                            <Text style={{color: '#fff', fontSize:15}}>LOGIN WITH GMAIL</Text>
                        </TouchableOpacity>
                        
                    
                    </Row>
                    <Row>
                        <TouchableOpacity style={styles.Facebook} onPress ={() => navigate('Payment')}> 
                            <Text style={{color: '#fff', fontSize:15}}>LOGIN WITH FACEBOOK</Text>
                        </TouchableOpacity>
                        
                    
                    </Row>
                    <Row>
                        <TextInput style={styles.Celluler}
                                    placeholder='Cellular'
                                    maxLength={10}
                                    minLength={10}
                                    keyboardType="numeric"
                                    onChangeText={(mobile)=>this.setState({mobile})}
                                    > 
                            {/* <Text style={{color: '#fff', fontSize:15}}></Text> */}
                        </TextInput>
                         <Text style={styles.error}>{this.state.mobileError}</Text>
                        
                    
                    </Row>



                    {/* <Row>
                        <View style={styles.Google}>
                            {
                            this.state.Googles.map((item, index) => (
                                    <TouchableOpacity
                                      
                                        style = {styles.container, styles.TouchableOpacity}
                                        onPress = {() => navigate('')}>
                                        <Text style = {styles.text}>
                                            {item.Google}
                                        </Text>
                                    </TouchableOpacity>
                            ))
                            }
                        </View>
                    </Row>
                    <Row>
                        <View style={styles.Facebook}>
                            {
                            this.state.Facebooks.map((item, index) => (
                                    <TouchableOpacity
                                        key = {item.id}
                                        style = {styles.container, styles.TouchableOpacity}
                                        onPress = {() => this.alertItemName(item)}>
                                        <Text style = {styles.text}>
                                            {item.Facebook}
                                        </Text>
                                    </TouchableOpacity>
                            ))
                            }
                        </View>
                    </Row>
                    <Row>
                        <View style={styles.Celluler}>
                            {
                            this.state.Cellulars.map((item, index) => (
                                    <TextInput
                                        key = {item.id}
                                        placeholder= 'Cellular'
                                        keyboardType="numeric"
                                        maxLength={10}
                                        style = { styles.text, styles.container, styles.TouchableOpacity}
                                        onPress = {() => navigate('Cellular')}>
                                        
                                    </TextInput>
                            )),
                            }
                        </View>
                    </Row> */}
                </Grid>
            </View>
        )
    }

}


const Stack = createStackNavigator();

function App() {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Login">
                <Stack.Screen Component={LoginScreen} />
                <stack.screen Component={VerifyOTPScreen} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}
export default Social
const styles = StyleSheet.create ({
   container: {
        flex: 1,
        flexDirection: 'column',
        // padding: 5,
        // marginTop: 20,
        backgroundColor: 'red',
        alignItems: 'center',
        justifyContent: 'center',
        // position: 'relative',
        borderRadius: 20,
        width: 300,
        


   },
   text: {
      color: '#fff',
      alignItems: 'center',
   },

   Google: {
    //    marginTop:10,
       alignItems: 'center',
       justifyContent: 'center',
       width: 300,
       height: 60 ,
       borderRadius: 40,
       backgroundColor: 'red',

   },

    Facebook: {
        
        marginTop:10,
        alignItems: 'center',
        justifyContent: 'center',
        width: 300,
        height: 60 ,
        borderRadius: 40,
        backgroundColor: 'blue',

    },

    Celluler: {
        marginTop:10,
        alignItems: 'center',
        justifyContent: 'center',
        width: 300,
        height: 60 ,
        borderWidth: 2,
        borderRadius: 40,
        backgroundColor: 'lightgrey',
        textAlign: 'center',
        color: '#000',
        // backgroundColor: Platform.OS === 'ios' ? 'red' : 'lightgrey',
        // borderStyle:  'dashed',
        // borderColor: 'lightgrey',
        ...Platform.select({ ios: { borderStyle:  'dashed', borderColor: 'grey' }, android: { borderStyle:  'dashed', borderColor: 'grey' } })

    },

    // Google: {

    // //     borderWidth: 1,
    // //     borderStyle: 'dashed',
    // //    marginTop: 15,
    // //    alignItems: 'center',
    // //    justifyContent: 'center',
    // //    width: 300,
    // //    height: 60 ,
    // //    borderRadius: 40,
    // //    backgroundColor: 'red',
    // //    color: '#fff',

    // },
})

