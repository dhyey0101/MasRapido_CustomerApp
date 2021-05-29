/////////////////////////////////// calss base chat screen with pusher //////////////////////////////////////

import React, { Component, useState } from 'react';
// import { Text, View, StyleSheet, Dimensions, Platform } from 'react-native';
// import { Video } from 'expo-av';
// import { WebView } from 'react-native-webview';
import { GiftedChat, Bubble, Send, IMessage, BtnRound } from 'react-native-gifted-chat';



const { width } = Dimensions.get('window');
import { Camera } from 'expo-camera';
import * as Permissions from "expo-permissions";
import * as ImagePicker from "expo-image-picker";
import { Col, Row, Grid } from "react-native-easy-grid";
import {Slider, Dimensions, Platform, StyleSheet, TextInput, Text, View, Image, TouchableOpacity, StatusBar, Keyboard, ScrollView, KeyboardAvoidingView, AsyncStorage } from 'react-native';
import { IconButton } from 'react-native-paper';
import { createStackNavigator } from '@react-navigation/stack';
import { getAdminIdAction } from '../Util/Action.js';
import Pusher from "pusher-js/react-native";


export default class Chat extends Component {
  constructor(props) {
    super(props);
    this.state = {
      
      hasCameraPermission: '',
      loader: false,
      // dataSource: [],
      messages: [
        // example of chat message
        {
          _id: 1,
          text: 'Hello!',
          createdAt: new Date().getTime(),
          user: {
            _id: 1,
            name: 'Test User'
          }
        },
    
      ],
      customerId: '',
      userID: "",
      triggerChannelState: 0,
      adminId:'',
      
    };
  }
  componentDidMount() {
    this.loadMessages((data) => {
      this.setState(previousState => ({
        messages: GiftedChat.append(previousState.messages, data),
      }));
    });
    // this._pusherSubscription();
    this.getAdminIdAction();
  }
  async UNSAFE_componentWillMount() {
    let userID = await AsyncStorage.getItem("userid");
    this.setState({
    userID: userID,
    });
  }

  getPermissionAsync = async () => {
    // Camera roll Permission
    if (Platform.OS === "ios") {
        const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);

        if (status !== "granted") {
        alert("Sorry, we need camera roll permissions to make this work!");
        }
    }
    // Camera Permission
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({ hasCameraPermission: status === "granted" });
  }

  async launchCamera() {
    <Image source={require('../../images/Camera.png')} />
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: false,
      aspect: [4, 3],
      quality: 1,
      base64: true,
    });

    if (result.cancelled) {
      
      // console.log("cancelled");
      
      //user cancelled operation
      return;
    } else {
        this.setState({ image: result.uri, imageStatus : 0 });
    }
  }

  static navigationOptions = ({ navigation }) => {
    return {
      headerShown: false,
    };
  };
  renderBubble(props) {
    return (
      // Step 3: return the component
      <Bubble
        {...props}
        wrapperStyle={{
          right: {
            // Here is the color change
            backgroundColor: '#ee3c48'
          }
        }}
        textStyle={{
          right: {
            color: '#fff'
          }
        }}
      />
    );
  }
  handleSend(newMessage = [0]) {
    const messages = this.state

    var triggered = this.channel.trigger('client-adminchat', { 
    // var triggered = this.channel.trigger('client-App\\Events\\adminchat', { 
      from: this.state.userID,
      to: this.state.adminId,
      message: newMessage[0].text,
    });
    console.log(triggered)
    this.setState(previousState => ({
      messages: GiftedChat.append(previousState.messages, newMessage),
    }));
  }

  async _pusherSubscription() {
    const messages = this.state
    let Token = await AsyncStorage.getItem('token')
    Token = "Bearer " + Token;

    this.pusher = new Pusher("d8eaa3d29440d93e40f2", {
      authEndpoint:
        "https://www.masrapidopty.com/app/api/broadcasting/auth",
      auth: {
        headers: {
          Accept: "application/json",
          Authorization: Token,
        },
      },
      cluster: "ap2",
      activityTimeout: 6000,
    });

    if (this.state.triggerChannelState != 1 ) {
      this.channel = this.pusher.subscribe("chat");
      this.setState({
        triggerChannelState: 1,
      });
    }
    
    this.channel.bind("pusher:subscription_succeeded", () =>  {
      this.channel.bind("App\\Events\\adminchat",  data => {
        if(this.state.userID === data.data.to){
    
          var message =  {
            "_id": data.data.from,
            "createdAt": data.created_at,
            "text": data.data.message,
            "user":  {
              "_id": data.data.from,
              "name": data.data.name,
            },
          };
    
          this.setState(previousState => ({
            messages: GiftedChat.append(previousState.messages, message),
          }));
    
        }
      });
    }); 
  }

  loadMessages(callback) {
    const onReceive = (data) => {
      const message = data.val();
      callback({
        _id: data.from,

      })
    }
  }
  
  async getAdminIdAction() {
    let customer_id = await AsyncStorage.getItem("userid");
    let Token = await AsyncStorage.getItem("token");
    Token = "Bearer " + Token;
    const getAdminData = {
      user_id: customer_id,
      // order_id: data.order_id,
    };

    this.setState({
              adminId: 1,
              loader: false,
          });
    getAdminIdAction(getAdminData, Token).then((responseJson) => {

      // return false;
      if (responseJson.isError == false) {
        this.setState({
            adminId: responseJson.result,
            loader: false,
        });
      } else {
        alert(responseJson.message);
      }
    });
  }


  renderSend(props) {
    return (

      <Send {...props}>
        <View style={styles.sendingContainer}>
          <Image
            source={require("../../images/Send.png")}
            style={styles.BottomRowIcon}
          />
        </View>
      </Send>
    );
  }
  render() {
    const { messages, userID, hasCameraPermission } = this.state;
    const { navigate } = this.props.navigation;
    return (
      <View style={styles.container}>
        <Row style={styles.Navebar}>
                        <Col style={{ marginLeft: normalize(0), justifyContent: 'flex-end', alignItems: 'flex-start', }}>
                            <TouchableOpacity onPress={() => navigate('MarketPlace')}style={{width: normalize(110), paddingLeft: normalize(40)}} >
                                <Image source={require('../../images/Back-Arrow.png')} style={styles.BackArrow} />
                            </TouchableOpacity>
                        </Col>
                    </Row>
        <GiftedChat

          messages={messages}
          onSend={newMessage => this.handleSend(newMessage)}
          user={{ _id: userID, name: 'User Test' }}
          // launchCamera={this.launchCamera}
          renderBubble={this.renderBubble}
          // placeholder='Type your message here...'
          showUserAvatar
          // alwaysShowSend
          renderSend={this.renderSend}
          launchCamera={(props) => (
            <View style={{ flexDirection: 'row', alignItems: 'center', height: 60 }}>
              <BtnRound icon="camera" iconColor={Colors.primaryBlue} size={40} style={{ marginHorizontal: 5 }} onPress={() => this.choosePicture()} />
             
            </View>
          )}
          
        />
      </View>
    );
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#b3d6f1',
  },
  Navebar: {
        ...Platform.select({
            ios: {
                height: "5%",
                // paddingBottom: 50, 
                marginTop: 40
            },
            android: {
                height: normalize(35),
            }
        })
    },
  bottomComponentContainer: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  sendingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    marginBottom: 5,
  },
  Camera: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  BottomRowIcon: {
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 5,
  },
});
