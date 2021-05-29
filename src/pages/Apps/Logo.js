import React, { Component } from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';

export default class Logo extends Component() {
    render(){
        return(
            <View>
                <Image style={{width:40, height:70}}
                    source={require('./images/LOGO-MAS-RAPIDO.jpg')}
                />
                <Text>sdafadfs</Text>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex:1,

    },

})