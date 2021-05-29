import React, { Component } from 'react';
import { StyleSheet, Text, View, Image, Button, TextInput, TouchableOpacity, StatusBar, ScrollView } from 'react-native';
import { Col, Row, Grid } from "react-native-easy-grid";

class List extends Component {
    state = {
        names: [
            // <Image source={require('../../images/Profile.png')}
            {
                id: 0,
                name: 'Profile',    
            },
            {
                id: 1,
                name: 'Shipping',
            },
                        {
                id: 2,
                name: 'Payments',
            },
            {
                id: 3,
                name: 'Notifications',
            },
            {
                id: 4,
                name: 'Configuration',
            },
            {
                id: 5,
                name: 'Support',
            },
            {
                id: 6,
                name: 'Tearm & Conditions',
            },

        ]
    }
    alertItemName = (item) => {
        alert(item.name)
    }

    render() {
      return (
          
         <View style={styles.container}>
            {/* <Image source={require('../../images/Sidemenu-BG.png')} style={styles.backgroundImage}/> */}
            <StatusBar />
            
                <Row style={{height:20 , marginTop:20,}}>
                    <Col>
                        <TouchableOpacity style={{alignItems: 'flex-end'}}> 
                            <Image source={require('../../images/Close.png')} style={styles.Close}/>
                        </TouchableOpacity> 
                    </Col>
                </Row>
                <Row  style={styles.Center} >
                    <Image source={require('../../images/Logo.png')} style={styles.logo} />
                </Row>
                <Col>
                    <Row>
                        <Col>
                            <TouchableOpacity>
                            <Text style={styles.text}>
                                <Image source={require('../../images/Profile.png')} style={styles.Listlogo}/>   Profile
                            </Text>
                            </TouchableOpacity>
                            <TouchableOpacity>
                            <Text style={styles.text}>
                                <Image source={require('../../images/Envios.png')} style={styles.Listlogo}/>   Shipping
                            </Text>
                            </TouchableOpacity>
                            <TouchableOpacity>
                            <Text style={styles.text}>
                                <Image source={require('../../images/Pagos.png')} style={styles.Listlogo}/>   Payments
                            </Text>
                            </TouchableOpacity>
                            <TouchableOpacity>
                            <Text style={styles.text}>
                                <Image source={require('../../images/Notificaciones.png')} style={styles.Listlogo}/>   Notifications
                            </Text>
                            </TouchableOpacity>
                            <TouchableOpacity>
                            <Text style={styles.text}>
                                <Image source={require('../../images/configuration.png')} style={styles.Listlogo}/>   Configuration
                            </Text>
                            </TouchableOpacity>
                            <TouchableOpacity>
                            <Text style={styles.text}>
                                <Image source={require('../../images/Soporte.png')} style={styles.Listlogo}/>   Support
                            </Text>
                            </TouchableOpacity>
                            <TouchableOpacity>
                            <Text style={styles.text}>
                                <Image source={require('../../images/Tearm-condition1.jpg')} style={styles.Listlogo}/>   Tearm & Conditions
                            </Text>
                            </TouchableOpacity>
                        </Col>
                    </Row>
                    
                    {/* {
                    this.state.names.map((item, index) => (
                        <TouchableOpacity
                            key = {item.id}
                            style = {styles.container}
                            onPress = {() => this.alertItemName(item)}>
                            <Text style = {styles.text}>
                                {item.Image}
                                {item.name}
                            </Text>
                        </TouchableOpacity>
                    ))
                    } */}
                </Col>
                <Row style={{height: 40,}}>
                    <TouchableOpacity>
                    <Text style={styles.text}><Image source={require('../../images/Salir.png')} style={styles.Listlogo}/>   Leave
                    </Text>
                    </TouchableOpacity>
                </Row>
                
         </View>
      )
   }
}
export default List

const styles = StyleSheet.create ({
    container: {
        flex: 1,
    },

    backgroundImage:{
     width:320,
     height:480,
    },
    text: {
        color: '#4f603c',
        marginLeft: 20,
        marginBottom: 10,
        // height: 40,
    },

    Close: {
        width: 25,
        height: 25,
        justifyContent: 'center', 
        alignItems: 'center',
        marginRight: 30,
    },
    logo: {
        width: 300,
        height: 250,
        justifyContent: 'center',
        alignItems: 'center',  
    },
    Center: {
        justifyContent: 'center',
        alignItems: 'center',
        
    },
    Listlogo: {
        width: 15,
        height: 15,
    }
});