// import React, { Component } from 'react';
// import {Slider, Dimensions,Platform, StyleSheet, TextInput, Text, View , Image, TouchableOpacity, StatusBar, Keyboard, ScrollView, KeyboardAvoidingView } from 'react-native';
// import { Col, Row, Grid } from "react-native-easy-grid";
// import { t } from '../../../locals';
// import { Camera } from 'expo-camera';
// import * as Permissions from "expo-permissions";
// import * as ImagePicker from "expo-image-picker";
// import * as Font from "expo-font";
// import * as FileSystem from "expo-file-system";
// import { result } from 'validate.js';
// import { Audio,AVPlaybackStatus } from 'expo-av';
// import { GiftedChat } from 'react-native-gifted-chat'
// import * as Icons from "../../../components/Icons";


// const { width: winWidth, height: winHeight } = Dimensions.get('window');
// // import { CameraKitCameraScreen } from 'react-native-camera-kit';

// const BACKGROUND_COLOR = "#FFF8ED";
// const LIVE_COLOR = "#FF0000";
// const DISABLED_OPACITY = 0.5;
// const RATE_SCALE = 3.0;

// type Props = {};

// type State = {
//     hasCameraPermission: boolean,
//     hasAudioPermission: boolean,
//     haveRecordingPermissions: boolean;
//     isLoading: boolean;
//     isPlaybackAllowed: boolean;
//     muted: boolean;
//     soundPosition: number | null;
//     soundDuration: number | null;
//     recordingDuration: number | null;
//     shouldPlay: boolean;
//     isPlaying: boolean;
//     isRecording: boolean;
//     fontLoaded: boolean;
//     shouldCorrectPitch: boolean;
//     volume: number;
//     rate: number;

//     isPermitted: false,
//     image: null,
//     imageStatus : 0,
//     messages:'',
//     setMessages: '',
//     canRecord: false,
//     isDoneRecording : false,
// };


// export default class Chat extends React.Component<Props, State> {

//     private recording: Audio.Recording | null;
//     private sound: Audio.Sound | null;
//     private isSeeking: boolean;
//     private shouldPlayAtEndOfSeek: boolean;
//     private readonly recordingSettings: Audio.RecordingOptions;
//     constructor(props) {
//         super(props);
//         this.recording = null;
//         this.sound = null;
//         this.isSeeking = false;
//         this.shouldPlayAtEndOfSeek = false;
//         this.state = { 
//             hasCameraPermission: null,
//             hasAudioPermission: null,
//             isPermitted: false,
//             image: result.uri, 
//             imageStatus : 0,
//             messages:'',
//             setMessages: '',
//             canRecord: false,
//             isDoneRecording : false,

//             haveRecordingPermissions: false,
//             isLoading: false,
//             isPlaybackAllowed: false,
//             muted: false,
//             soundPosition: null,
//             soundDuration: null,
//             recordingDuration: null,
//             shouldPlay: false,
//             isPlaying: false,
//             isRecording: false,
//             fontLoaded: false,
//             shouldCorrectPitch: true,
//             volume: 1.0,
//             rate: 1.0,
//         }
//         this.recordingSettings = Audio.RECORDING_OPTIONS_PRESET_LOW_QUALITY;
//     }

//     async componantDidMount () {
//         this.getPermissionAsync();
//         this.AudiogetPermissionsAsync();
//     }
//     getPermissionAsync = async () => {
//         // Camera roll Permission
//         if (Platform.OS === "ios") {
//             const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);

//             if (status !== "granted") {
//             alert("Sorry, we need camera roll permissions to make this work!");
//             }
//         }
//         // Camera Permission
//         const { status } = await Permissions.askAsync(Permissions.CAMERA);
//         this.setState({ hasCameraPermission: status === "granted" });
//     }

//     AudiogetPermissionsAsync = async () => {
//         // Audio Permission
//         if (Platform.OS === "ios") {
//             const { status } = await Permissions.askAsync(Permissions.AUDIO_RECORDING);

//             if (status !== "granted") {
//                 alert("Sorry, we need audio permissions to make this work!");
//             } else if (status === "granted") {
//                 alert("granted");
//             }
//         }
//         // Audio Permission
//         const { status } = await Permissions.askAsync(Permissions.AUDIO_RECORDING);
//         this.setState({ hasAudioPermission: status === "granted" });

//     }

//     updateScreenForSoundStatus = (status: AVPlaybackStatus) => {
//         if (status.isLoaded) {
//           this.setState({
//             soundDuration: status.durationMillis ?? null,
//             soundPosition: status.positionMillis,
//             shouldPlay: status.shouldPlay,
//             isPlaying: status.isPlaying,
//             rate: status.rate,
//             muted: status.isMuted,
//             volume: status.volume,
//             shouldCorrectPitch: status.shouldCorrectPitch,
//             isPlaybackAllowed: true,
//           });
//         } else {
//           this.setState({
//             soundDuration: null,
//             soundPosition: null,
//             isPlaybackAllowed: false,
//           });
//           if (status.error) {
//             console.log(`FATAL PLAYER ERROR: ${status.error}`);
//           }
//         }
//     };

//     updateScreenForRecordingStatus = (status: Audio.RecordingStatus) => {
//         if (status.canRecord) {
//           this.setState({
//             isRecording: status.isRecording,
//             recordingDuration: status.durationMillis,
//           });
//         } else if (status.isDoneRecording) {
//           this.setState({
//             isRecording: false,
//             recordingDuration: status.durationMillis,
//           });
//           if (!this.state.isLoading) {
//             this.stopRecordingAndEnablePlayback();
//           }
//         }
//     };

//     async stopPlaybackAndBeginRecording() {
//         this.setState({
//           isLoading: true,
//         });
//         if (this.sound !== null) {
//           await this.sound.unloadAsync();
//           this.sound.setOnPlaybackStatusUpdate(null);
//           this.sound = null;
//         }
//         await Audio.setAudioModeAsync({
//           allowsRecordingIOS: true,
//           interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
//           playsInSilentModeIOS: true,
//           shouldDuckAndroid: true,
//           interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
//           playThroughEarpieceAndroid: false,
//           staysActiveInBackground: true,
//         });
//         if (this.recording !== null) {
//           this.recording.setOnRecordingStatusUpdate(null);
//           this.recording = null;
//         }

//         const recording = new Audio.Recording();
//         await recording.prepareToRecordAsync(this.recordingSettings);
//         recording.setOnRecordingStatusUpdate(this.updateScreenForRecordingStatus);

//         this.recording = recording;
//         await this.recording.startAsync(); // Will call this._updateScreenForRecordingStatus to update the screen.
//         this.setState({
//           isLoading: false,
//         });
//     }

//     async stopRecordingAndEnablePlayback() {
//         this.setState({
//           isLoading: true,
//         });
//         if (!this.recording) {
//           return;
//         }
//         try {
//           await this.recording.stopAndUnloadAsync();
//         } catch (error) {
//           // On Android, calling stop before any data has been collected results in
//           // an E_AUDIO_NODATA error. This means no audio data has been written to
//           // the output file is invalid.
//           if (error.code === "E_AUDIO_NODATA") {
//             console.log(
//               `Stop was called too quickly, no data has yet been received (${error.message})`
//             );
//           } else {
//             console.log("STOP ERROR: ", error.code, error.name, error.message);
//           }
//           this.setState({
//             isLoading: false,
//           });
//           return;
//         }
//         const info = await FileSystem.getInfoAsync(this.recording.getURI() || "");
//         console.log(`FILE INFO: ${JSON.stringify(info)}`);
//         await Audio.setAudioModeAsync({
//           allowsRecordingIOS: false,
//           interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
//           playsInSilentModeIOS: true,
//           shouldDuckAndroid: true,
//           interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
//           playThroughEarpieceAndroid: false,
//           staysActiveInBackground: true,
//         });
//         const { sound, status } = await this.recording.createNewLoadedSoundAsync(
//           {
//             isLooping: true,
//             isMuted: this.state.muted,
//             volume: this.state.volume,
//             rate: this.state.rate,
//             shouldCorrectPitch: this.state.shouldCorrectPitch,
//           },
//           this.updateScreenForSoundStatus
//         );
//         this.sound = sound;
//         this.setState({
//           isLoading: false,
//         });
//     }

//     onRecordPressed = () => {
//         if (this.state.isRecording) {
//           this.stopRecordingAndEnablePlayback();
//         } else {
//           this.stopPlaybackAndBeginRecording();
//         }
//     };

//     onPlayPausePressed = () => {
//         if (this.sound != null) {
//           if (this.state.isPlaying) {
//             this.sound.pauseAsync();
//           } else {
//             this.sound.playAsync();
//           }
//         }
//     };

//     onStopPressed = () => {
//         if (this.sound != null) {
//           this.sound.stopAsync();
//         }
//     };

//     onMutePressed = () => {
//         if (this.sound != null) {
//           this.sound.setIsMutedAsync(!this.state.muted);
//         }
//     };

//     onVolumeSliderValueChange = (value: number) => {
//         if (this.sound != null) {
//           this.sound.setVolumeAsync(value);
//         }
//     };

//     trySetRate = async (rate: number, shouldCorrectPitch: boolean) => {
//         if (this.sound != null) {
//           try {
//             await this.sound.setRateAsync(rate, shouldCorrectPitch);
//           } catch (error) {
//             // Rate changing could not be performed, possibly because the client's Android API is too old.
//           }
//         }
//     };

//     onRateSliderSlidingComplete = async (value: number) => {
//         this.trySetRate(value * RATE_SCALE, this.state.shouldCorrectPitch);
//     };

//     onPitchCorrectionPressed = () => {
//         this.trySetRate(this.state.rate, !this.state.shouldCorrectPitch);
//     };

//     onSeekSliderValueChange = (value: number) => {
//         if (this.sound != null && !this.isSeeking) {
//           this.isSeeking = true;
//           this.shouldPlayAtEndOfSeek = this.state.shouldPlay;
//           this.sound.pauseAsync();
//         }
//     };

//     onSeekSliderSlidingComplete = async (value: number) => {
//         if (this.sound != null) {
//           this.isSeeking = false;
//           const seekPosition = value * (this.state.soundDuration || 0);
//           if (this.shouldPlayAtEndOfSeek) {
//             this.sound.playFromPositionAsync(seekPosition);
//           } else {
//             this.sound.setPositionAsync(seekPosition);
//           }
//         }
//     };

//     getSeekSliderPosition() {
//         if (
//           this.sound != null &&
//           this.state.soundPosition != null &&
//           this.state.soundDuration != null
//         ) {
//           return this.state.soundPosition / this.state.soundDuration;
//         }
//         return 0;
//     }

//     getMMSSFromMillis(millis: number) {
//         const totalSeconds = millis / 1000;
//         const seconds = Math.floor(totalSeconds % 60);
//         const minutes = Math.floor(totalSeconds / 60);

//         const padWithZero = (number: number) => {
//           const string = number.toString();
//           if (number < 10) {
//             return "0" + string;
//           }
//           return string;
//         };
//         return padWithZero(minutes) + ":" + padWithZero(seconds);
//     }

//     getPlaybackTimestamp() {
//         if (
//           this.sound != null &&
//           this.state.soundPosition != null &&
//           this.state.soundDuration != null
//         ) {
//           return `${this.getMMSSFromMillis(
//             this.state.soundPosition
//           )} / ${this.getMMSSFromMillis(this.state.soundDuration)}`;
//         }
//         return "";
//     }

//     getRecordingTimestamp() {
//         if (this.state.recordingDuration != null) {
//           return `${this.getMMSSFromMillis(this.state.recordingDuration)}`;
//         }
//         return `${this.getMMSSFromMillis(0)}`;
//     }

//     async launchCamera(imageCase) {
//         let result = await ImagePicker.launchCameraAsync({
//           mediaTypes: ImagePicker.MediaTypeOptions.All,
//           allowsEditing: false,
//           aspect: [4, 3],
//           quality: 1,
//           base64: true,
//         });

//         if (result.cancelled) {

//           // console.log("cancelled");

//           //user cancelled operation
//           return;
//         } else {
//             this.setState({ image: result.uri, imageStatus : 0 });
//         }
//     }

//     static navigationOptions = ({ navigation }) => {
//         return {
//           headerShown: false,
//         };
//     };
//     toggleDrawer = ({ navigation }) => {
//         this.props.navigation.toggleDrawer();
//     };
//     render() {
//         // const recording = new Audio.Recording();
//         // try {
//         //     await recording.prepareToRecordAsync(Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY);
//         //     await recording.startAsync();
//         //     // You are now recording!
//         //   } catch (error) {
//         //     // An error occurred!
//         //   }
//         const  {hasCameraPermission,hasAudioPermission,isPermitted}  = this.state;
//         const  navigate  = this.props.navigation;
//         return (

//             <View style={styles.container}>
//                 <Row style={styles.Navebar}>
//                     <Col>
//                         <TouchableOpacity onPress ={() => {this.props.navigation.navigate('OrderStatus')}} > 
//                             <Image source={require('../../images/Back-Arrow.png')} style={styles.BackArrow}/>
//                         </TouchableOpacity>
//                     </Col>
//                     <Col>
//                         <TouchableOpacity style={{alignItems: 'flex-end'}}  onPress={this.toggleDrawer.bind(this)}> 
//                             <Image source={require('../../images/Menu.png')} style={styles.Menu}/>
//                         </TouchableOpacity> 
//                     </Col>
//                 </Row>
//                 <Row style={{marginBottom: '2%',justifyContent:'flex-end', alignItems:'flex-end', marginRight:'5%'}} >

//                     <Image source={{ uri: this.state.image }} style={styles.images} />

//                     <TouchableOpacity
//                         // underlayColor={BACKGROUND_COLOR}
//                         // style={styles.wrapper}
//                         onPress={this.onPlayPausePressed}
//                         disabled={!this.state.isPlaybackAllowed || this.state.isLoading}
//                     >
//                         <Image
//                         style={styles.BottomRowIcon}
//                         source={
//                             this.state.isPlaying
//                             ? Icons.PAUSE_BUTTON.module
//                             : Icons.PLAY_BUTTON.module
//                         }
//                         />
//                     </TouchableOpacity>
//                     <Slider
//                         style={{ height:'5%',width: '50%',marginBottom:5 }}
//                         // trackImage={Icons.TRACK_1.module}
//                         // thumbImage={Icons.THUMB_1.module}
//                         value={this.getSeekSliderPosition()}
//                         onValueChange={this.onSeekSliderValueChange}
//                         onSlidingComplete={this.onSeekSliderSlidingComplete}
//                         disabled={!this.state.isPlaybackAllowed || this.state.isLoading}
//                         />
//                         <Text
//                         // style={{}}
//                         >
//                             {this.getPlaybackTimestamp()}
//                         </Text>
//                 </Row>
//                 {/* <Row style={{height:'3%',alignItems:'flex-end',justifyContent: 'flex-end', marginRight:'3%', marginBottom:10}} >

//                         </Row> */}
//                 <Row style={styles.BottomRow}>
//                     <Row>
//                         <Col style={styles.BottomIconCol}>

//                             <TouchableOpacity onPress ={() => this.launchCamera("image")}  >
//                             <Image source={require("../../images/Camera.png")} style={styles.BottomRowIcon}/>   
//                             {/* <Camera 
//                                 style={styles.preview}
//                                 ref={camera => this.camera = camera}
//                             /> */}
//                             </TouchableOpacity>
//                         </Col>
//                         <Col style={styles.TextInputCol}>
//                             <TextInput  style={styles.TextInput}
//                                         multiline = {true}
//                                         numberOfLines = {4}
//                                         >
//                             </TextInput>
//                         </Col>
//                         <Col style={styles.BottomIconCol}>
//                             <TouchableOpacity >
//                                 <Image
//                                     source={require("../../images/Send.png")}
//                                     style={styles.BottomRowIcon}
//                                 />
//                             </TouchableOpacity>
//                         </Col>
//                         <Col style={styles.BottomIconCol}>
//                             <Text>
//                                 {this.getRecordingTimestamp()}
//                             </Text>
//                             <TouchableOpacity
//                                 // underlayColor={BACKGROUND_COLOR}
//                                 // style={styles.wrapper}
//                                 onPress={this.onRecordPressed}
//                                 disabled={this.state.isLoading}
//                             >
//                             {/* <TouchableOpacity onPress ={() => this.AudiogetPermissionsAsync()} > */}
//                                 <Image
//                                     source={require("../../images/Mike.png")}
//                                     style={styles.BottomRowIcon}
//                                 />
//                             </TouchableOpacity>

//                         </Col>

//                     </Row>
//                 </Row>
//             </View>
//         )
//     }
// }
// // const { width: winWidth, height: winHeight } = Dimensions.get('window');

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         // alignItems: 'center',
//         justifyContent: 'center',
//         backgroundColor:'#b3d6f1',
//         // height: 30,

//     },
//     Navebar: {
//         ...Platform.select ({
//             ios:{
//                 flex:1,
//                 height: 1 , 
//                 paddingBottom: 50, 
//                 marginTop:20
//             },
//             android:{
//                 flex:1,
//                 height: 40 , 
//             }})

//     },
//     BackArrow: {
//         width: 25,
//         height: 25,
//         justifyContent: 'center', 
//         alignItems: 'center',
//         marginLeft: 10,
//         marginTop: 10,
//     },
//     Menu: {
//         width: 25,
//         height: 25,
//         justifyContent: 'center', 
//         alignItems: 'center',
//         marginRight: 10,
//         marginTop: 10,
//     },
//     BottomRow: {
//         backgroundColor: '#fff',
//         flexDirection: 'column-reverse',
//         height: '10%',
//         paddingRight: '5%',
//         paddingLeft: '5%',
//     },
//     BottomRowIcon: {
//         width: 30,
//         height: 30,
//         justifyContent: 'center', 
//         alignItems: 'center',
//         marginTop: 5,
//     },
//     BottomIconCol: {
//         justifyContent: 'center', 
//         alignItems: 'center',
//     },
//     TextInputCol: {
//         justifyContent: 'center', 
//         alignItems: 'center',
//         width: '60%',

//     },
//     TextInput : {
//         // height: 36, 
//         marginTop: 5, 
//         marginBottom:5,
//         borderStyle:'dashed',
//         borderRadius: 20,
//         backgroundColor: '#eae8e8', 
//         borderColor: '#dedfde', 
//         borderWidth: 2, 
//         width: '100%',
//         paddingTop:5,
//         paddingBottom:5,
//         paddingLeft: 10
//     },

//     images: {
//         width: 150,
//         height: 120,
//         // borderColor: "#ccc",
//         // borderWidth: 1,
//         marginHorizontal: 3,
//         marginBottom: 20,
//         marginLeft: 10,
//     },

// })

////////////////////////////////////////////// simple chat ////////////////////////////////////////////////////////////////////////////

// import React, { useState } from 'react';
// // import { Text, View, StyleSheet, Dimensions, Platform } from 'react-native';
// // import { Video } from 'expo-av';
// // import { WebView } from 'react-native-webview';
// import { GiftedChat, Bubble, Send, IMessage } from 'react-native-gifted-chat';
// const { width } = Dimensions.get('window');
// import { Camera } from 'expo-camera';
// import * as Permissions from "expo-permissions";
// import * as ImagePicker from "expo-image-picker";
// import { Col, Row, Grid } from "react-native-easy-grid";
// import {Slider, Dimensions,Platform, StyleSheet, TextInput, Text, View , Image, TouchableOpacity, StatusBar, Keyboard, ScrollView, KeyboardAvoidingView, AsyncStorage } from 'react-native';
// import { IconButton } from 'react-native-paper';
// import { createStackNavigator } from '@react-navigation/stack';
// import { getAdminIdAction } from '../Util/Action.js';
// import Pusher from "pusher-js/react-native";
// const Stack = createStackNavigator();
// // TODO: add firebase?



// function Chat() {
//   global.channel = '';
//   global.pusher = '';
//   const [messages, setMessages] = useState([
//     /**
//      * Mock message data
//      */
//     // example of system message
//     {
//       _id: 0,
//       text: 'New room created.',
//       createdAt: new Date().getTime(),
//       system: true
//     },
//     // example of chat message
//     {
//       _id: 1,
//       text: 'Hello!',
//       createdAt: new Date().getTime(),
//       user: {
//         _id: 2,
//         name: 'Test User'
//       }
//     }
//   ]);

//   const [dataSource, setdataSource] = useState([]);
//   const [loader, setloader] = useState(false);
//   const [customerId, setcustomerId] = useState('');

//   function renderBubble(props) {
//     return (
//       // Step 3: return the component
//       <Bubble
//         {...props}
//         wrapperStyle={{
//           right: {
//             // Here is the color change
//             backgroundColor: '#ee3c48'
//           }
//         }}
//         textStyle={{
//           right: {
//             color: '#fff'
//           }
//         }}
//       />
//     );
//   }
//   function handleSend(newMessage = []) {
//     // getAdminIdAction();
//     // _pusherSubscription()

//     // var triggered = global.channel.trigger("client-adminchat", {
//     //   customer_id: customerId,
//     //   message: newMessage.text,
//     // });

//     console.log(newMessage)
//     setMessages(GiftedChat.append(messages, newMessage));
//   }

//   // async function getAdminIdAction() {
//   //   setloader(true)
//   //   const customer_id = await AsyncStorage.getItem("userid");
//   //   let Token = await AsyncStorage.getItem("token");

//   //   Token = "Bearer " + Token;
//   //   const getAdminData = {
//   //       customer_id: customer_id,
//   //   };    

//   //   getAdminIdAction(getAdminData, Token).then((responseJson) => {
//   //     console.log(responseJson)
//   //     return false;
//   //   if (responseJson.isError == false) {
//   //       // this.setState({
//   //       //     dataSource: responseJson.result,
//   //       //     loader: false,
//   //       // });
//   //       setdataSource(responseJson.result)
//   //       setloader(false)
//   //       console.log(dataSource)
//   //   } else {
//   //       // this.setState({ loader: false });
//   //       setloader(false)
//   //       alert(responseJson.message);
//   //   }
//   //   });
//   //   setloader(false)
//   //   // this.setState({ loader: false });
//   // }

//   async function _pusherSubscription() {
//     let Token = await AsyncStorage.getItem("token");
//     let customer_id = await AsyncStorage.getItem("userid");
//     setcustomerId(customer_id);
//     Token = "Bearer " + Token;
//     // Pusher.logToConsole = true;

//     global.pusher = new Pusher("d8eaa3d29440d93e40f2", {
//     authEndpoint:
//         "https://www.masrapidopty.com/app/api/broadcasting/auth",
//     auth: {
//         headers: {
//         Accept: "application/json",
//         Authorization: Token,
//         },
//     },
//     cluster: "ap2",
//     activityTimeout: 6000,
//     });
//     global.channel = global.pusher.subscribe("private-chat");
//     console.log(global.channel)


// }

//   function renderSend(props) {
//     return (

//       <Send {...props}>
//         <View style={styles.sendingContainer}>
//           <Image
//               source={require("../../images/Send.png")}
//               style={styles.BottomRowIcon}
//           />
//         </View>
//       </Send>
//     );
//   }

//   return (
//     <View style={styles.container}>
//       <GiftedChat 
//         messages = { messages }
//         onSend={newMessage => handleSend(newMessage)}
//         user={{ _id: customerId, name: 'User Test' }}
//         renderBubble={renderBubble}
//         placeholder='Type your message here...'
//         showUserAvatar
//         alwaysShowSend
//         renderSend={renderSend}
//       />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#b3d6f1',
//   },
//   video: {
//     width: width / 1.5,
//     height: 150,
//     margin: 13,
//     borderRadius: 13,
//   },
//   bottomComponentContainer: {
//     justifyContent: 'center',
//     alignItems: 'center'
//   },
//   sendingContainer: {
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginRight: 10,
//     marginBottom:5,
//   },
//   Camera: {
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   BottomRowIcon: {
//     width: 30,
//     height: 30,
//     justifyContent: 'center', 
//     alignItems: 'center',
//     marginTop: 5,
//   },
// });

// export default Chat;

/////////////////////////////////// calss base chat screen with pusher //////////////////////////////////////

import React, { Component, useState } from 'react';
// import { Text, View, StyleSheet, Dimensions, Platform } from 'react-native';
// import { Video } from 'expo-av';
// import { WebView } from 'react-native-webview';
import { GiftedChat, Bubble, Send, IMessage } from 'react-native-gifted-chat';
const { width } = Dimensions.get('window');
import { Camera } from 'expo-camera';
import * as Permissions from "expo-permissions";
import * as ImagePicker from "expo-image-picker";
import { Col, Row, Grid } from "react-native-easy-grid";
import { Slider, Dimensions, Platform, StyleSheet, TextInput, Text, View, Image, TouchableOpacity, StatusBar, Keyboard, ScrollView, KeyboardAvoidingView, AsyncStorage } from 'react-native';
import { IconButton } from 'react-native-paper';
import { createStackNavigator } from '@react-navigation/stack';
import { getAdminIdAction } from '../Util/Action.js';
import Pusher from "pusher-js/react-native";
// const Stack = createStackNavigator();
// TODO: add firebase?


export default class Chat extends Component {
  constructor(props) {
    super(props);
    this.state = {
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
    // {
    //   _id: 0,
    //   text: 'New room created.',
    //   createdAt: new Date().getTime(),
    //   system: true;
    // },
    // // example of chat message
    // {
    //   _id: 1,
    //   text: 'Hello!',
    //   createdAt: new Date().getTime(),
    //   user: {
    //     _id: 2,
    //     name: 'Test User'
    //   }
    // }
  }
  componentDidMount() {
    this.loadMessages((data) => {
      this.setState(previousState => ({
        messages: GiftedChat.append(previousState.messages, data),
      }));
    });
    // this._pusherSubscription();
    // this.getAdminIdAction();
  }

  async UNSAFE_componentWillMount() {
    let userID = await AsyncStorage.getItem("userid");
    // let userName = await AsyncStorage.getItem("name");
    // let userToken = await AsyncStorage.getItem("token");
    this.setState({
    userID: userID,
    // userName: userName,
    // userToken: userToken,
    });
    // this._pusherSubscription();
    // this.getMessageFromAdmin();
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
    // // var triggered = global.channel.trigger("client-adminchat", {
    // //   customer_id: customerId,
    // //   message: newMessage.text,
    // // });
    // var joined = this.state.messages.concat(newMessage);
    // this.setState({ messages: joined })

    // console.log("New mesage", newMessage)
    // console.log("Messaage array", messages)

    // // this.setState({
    // //   messages: newMessage
    // // })
    // GiftedChat.append(messages, newMessage)

    var triggered = this.channel.trigger('client-adminchat', { 
      user_id: this.state.userID,
      message: newMessage[0].text,
    });
    
    this.setState(previousState => ({
      messages: GiftedChat.append(previousState.messages, newMessage),
    }));
    console.log(this.state.messages);
    // this.setMessages(GiftedChat.append(messages, newMessage));
  }

  async _pusherSubscription() {
    const messages = this.state
    let Token = await AsyncStorage.getItem('token')

    Token = "Bearer " + Token;
    // Pusher.logToConsole = true;

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

    this.channel = this.pusher.subscribe("chat");
    this.setState({
      triggerChannelState: 1,
    });

    // this.channel.bind("pusher:subscription_succeeded", function () {
    //   alert("Hello")
    // });
    
    this.channel.bind("App\\Events\\adminchat",  (data) => {

      console.log(data)



      this.setState(previousState => ({
        messages: GiftedChat.append(previousState.messages, data),
      }));

      // Object {
      //   "_id": 2,
      //   "createdAt": 1600413472720,
      //   "text": "123!",
      //   "user": Object {
      //     "_id": 2,
      //     "name": "Test User",
      //   },
      // },
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
    const getAdminData = {
      user_id: customer_id,
      // order_id: data.order_id,
    };

    this.setState({
              adminId: 1,
              loader: false,
          });
    // getAdminIdAction(getAdminData, Token).then((responseJson) => {

    //   console.log(responseJson)
    //   // return false;
    //   if (responseJson.isError == false) {
    //     this.setState({
    //         adminId: responseJson.result,
    //         loader: false,
    //     });
    //     console.log(adminId)
    //   } else {
    //     // this.setState({ loader: false });
    //     alert(responseJson.message);
    //   }
    // });
  }


  // getMessageFromAdmin() {
  //   this.channel.bind("App\\Events\\adminchat", (data) => {
  //     console.log(data)
  //   });
  // }

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
    const { messages, userID } = this.state;
    const { navigate } = this.props.navigation;
    return (
      <View style={styles.container}>
        <Row style={styles.Navebar}>
          <Col style={{ width: '10%' }}>
            <TouchableOpacity
              onPress={() => navigate('OrderList')} >
              <Image source={require('../../images/Back-Arrow.png')} style={styles.BackArrow} />
            </TouchableOpacity>
          </Col>
        </Row>
        <GiftedChat
          messages={messages}
          onSend={newMessage => this.handleSend(newMessage)}
          user={{ _id: userID, name: 'User Test' }}
          renderBubble={this.renderBubble}
          placeholder='Type your message here...'
          showUserAvatar
          // alwaysShowSend
          renderSend={this.renderSend}
          
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
        height: 1,
        paddingBottom: 50,
        marginTop: 30
      },
      android: {
        height: 40,
      }
    })
  },
  BackArrow: {
    ...Platform.select({
      ios: {
        width: 25,
        height: 25,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 10,
      },
      android: {
        width: 25,
        height: 25,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 10,
        marginTop: 10,
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




// function Chat() {
//   global.channel = '';
//   global.pusher = '';
//   const [messages, setMessages] = useState([
//     /**
//      * Mock message data
//      */
//     // example of system message
//     {
//       _id: 0,
//       text: 'New room created.',
//       createdAt: new Date().getTime(),
//       system: true
//     },
//     // example of chat message
//     {
//       _id: 1,
//       text: 'Hello!',
//       createdAt: new Date().getTime(),
//       user: {
//         _id: 2,
//         name: 'Test User'
//       }
//     }
//   ]);

//   const [dataSource, setdataSource] = useState([]);
//   const [loader, setloader] = useState(false);
//   const [customerId, setcustomerId] = useState('');

//   function renderBubble(props) {
//     return (
//       // Step 3: return the component
//       <Bubble
//         {...props}
//         wrapperStyle={{
//           right: {
//             // Here is the color change
//             backgroundColor: '#ee3c48'
//           }
//         }}
//         textStyle={{
//           right: {
//             color: '#fff'
//           }
//         }}
//       />
//     );
//   }
//   function handleSend(newMessage = []) {
//     // getAdminIdAction();
//     // _pusherSubscription()

//     // var triggered = global.channel.trigger("client-adminchat", {
//     //   customer_id: customerId,
//     //   message: newMessage.text,
//     // });

//     console.log(newMessage)
//     setMessages(GiftedChat.append(messages, newMessage));
//   }

//   // async function getAdminIdAction() {
//   //   setloader(true)
//   //   const customer_id = await AsyncStorage.getItem("userid");
//   //   let Token = await AsyncStorage.getItem("token");

//   //   Token = "Bearer " + Token;
//   //   const getAdminData = {
//   //       customer_id: customer_id,
//   //   };    

//   //   getAdminIdAction(getAdminData, Token).then((responseJson) => {
//   //     console.log(responseJson)
//   //     return false;
//   //   if (responseJson.isError == false) {
//   //       // this.setState({
//   //       //     dataSource: responseJson.result,
//   //       //     loader: false,
//   //       // });
//   //       setdataSource(responseJson.result)
//   //       setloader(false)
//   //       console.log(dataSource)
//   //   } else {
//   //       // this.setState({ loader: false });
//   //       setloader(false)
//   //       alert(responseJson.message);
//   //   }
//   //   });
//   //   setloader(false)
//   //   // this.setState({ loader: false });
//   // }

//   async function _pusherSubscription() {
//     let Token = await AsyncStorage.getItem("token");
//     let customer_id = await AsyncStorage.getItem("userid");
//     setcustomerId(customer_id);
//     Token = "Bearer " + Token;
//     // Pusher.logToConsole = true;

//     global.pusher = new Pusher("d8eaa3d29440d93e40f2", {
//     authEndpoint:
//         "https://www.masrapidopty.com/app/api/broadcasting/auth",
//     auth: {
//         headers: {
//         Accept: "application/json",
//         Authorization: Token,
//         },
//     },
//     cluster: "ap2",
//     activityTimeout: 6000,
//     });
//     global.channel = global.pusher.subscribe("private-chat");
//     console.log(global.channel)


// }

//   function renderSend(props) {
//     return (

//       <Send {...props}>
//         <View style={styles.sendingContainer}>
//           <Image
//               source={require("../../images/Send.png")}
//               style={styles.BottomRowIcon}
//           />
//         </View>
//       </Send>
//     );
//   }

//   return (
//     <View style={styles.container}>
//       <GiftedChat 
//         messages = { messages }
//         onSend={newMessage => handleSend(newMessage)}
//         user={{ _id: customerId, name: 'User Test' }}
//         renderBubble={renderBubble}
//         placeholder='Type your message here...'
//         showUserAvatar
//         alwaysShowSend
//         renderSend={renderSend}
//       />
//     </View>
//   );
// }

