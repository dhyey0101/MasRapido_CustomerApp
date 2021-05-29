import React, { Component, useState } from "react";
import { GiftedChat, Bubble, Send, IMessage } from "react-native-gifted-chat";
const { width } = Dimensions.get("window");
import { Col, Row, Grid } from "react-native-easy-grid";
import {
  Slider,
  Dimensions,
  Platform,
  StyleSheet,
  TextInput,
  Text,
  View,
  Image,
  TouchableOpacity,
  StatusBar,
  Keyboard,
  ScrollView,
  KeyboardAvoidingView,
  AsyncStorage,
  BackHandler,
  ActivityIndicator,
  Alert,
} from "react-native";
import Pusher from "pusher-js/react-native";
import { saveChatImageAction, getUserProfilePictureAction, getChatHistoryAction, saveChatMessageAction } from '../Util/Action.js';
import { NavigationEvents } from "react-navigation";
import { Camera } from 'expo-camera';
import * as Permissions from "expo-permissions";
import * as ImagePicker from "expo-image-picker";
import { Audio, AVPlaybackStatus } from 'expo-av';
import * as Icons from "../../../components/Icons";
import * as FileSystem from "expo-file-system";
import { result } from "validate.js";
import { t } from '../../../locals';


export default class ChatWithDriver extends Component {
  constructor(props) {
    super(props);
    this.recording = null;
    this.sound = null;
    this.isSeeking = false;
    this.shouldPlayAtEndOfSeek = false;
    this.state = {
      hasCameraPermission: null,
      hasAudioPermission: null,
      loader: false,
      canRecord: false,
      isDoneRecording: false,

      haveRecordingPermissions: false,
      isLoading: false,
      isPlaybackAllowed: false,
      muted: false,
      soundPosition: null,
      soundDuration: null,
      recordingDuration: null,
      shouldPlay: false,
      isPlaying: false,
      isRecording: false,
      volume: 1.0,
      rate: 1.0,
      fontLoaded: false,
      messages: [
        // {
        //   _id: 0,
        //   // text: "New room created.",
        //   createdAt: new Date().getTime(),
        //   system: true,
        // }
        // // example of chat message
        // {
        //   _id: 1,
        //   text: "Hello!",
        //   createdAt: new Date().getTime(),
        //   user: {
        //     _id: 1,
        //     name: "Test User",
        //   },
        // },
      ],

      customerId: "",
      userID: "",
      triggerChannelState: 0,
      adminId: "",
      order_id: '',
      backpage: '',
      List: '',
      service_id: '',
      driver_id: '',
      image: '',
      userName: '',
      profile: '',
    };
    this.recordingSettings = Audio.RECORDING_OPTIONS_PRESET_LOW_QUALITY;
  }


  async getUserProfilePicture() {
    let Token = await AsyncStorage.getItem("token");
    Token = "Bearer " + Token;
    const userID = await AsyncStorage.getItem("userid");
    const getUserProfilePictureData = {
      user_id: userID
    };
    this.setState({
      loader: true,
    });
    getUserProfilePictureAction(getUserProfilePictureData, Token).then((responseJson) => {
      if (responseJson.isError == false) {
        this.setState({
          profile: responseJson.result.profile,
          loader: false,
        });
      } else {
        // this.refs.defaultToastBottomWithDifferentColor.ShowToastFunction(
        //   responseJson.message
        // );
        this.setState({
          loader: false,
        });
      }
    });
  }
  async componentDidMount() {
    this.getPermissionAsync();
    this.AudiogetPermissionsAsync();
    this._pusherSubscription();
    // this.getAdminIdAction();

    const order_id = this.props.navigation.getParam('order_id')
    const backpage = this.props.navigation.getParam('backpage')
    const driver_id = this.props.navigation.getParam('driver_id')
    this.setState({
      order_id: order_id,
      driver_id: driver_id,
      backpage: backpage,

    })
    this.getUserProfilePicture();
    this.getChatHistory();
    this.loadMessages((data) => {
      this.setState((previousState) => ({
        messages: GiftedChat.append(previousState.messages, data),
      }));
    });

  }

  async UNSAFE_componentWillMount() {
    let userID = await AsyncStorage.getItem("userid");
    let name = await AsyncStorage.getItem("name");
    this.setState({
      userID: userID,
      userName: name,
    });
  }

  static navigationOptions = ({ navigation }) => {
    return {
      headerShown: false,
    };
  };

  async getPermissionAsync() {
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

  AudiogetPermissionsAsync = async () => {
    // Audio Permission
    if (Platform.OS === "ios") {
      const { status } = await Permissions.askAsync(Permissions.AUDIO_RECORDING);

      if (status !== "granted") {
        alert("Sorry, we need audio permissions to make this work!");
      } else if (status === "granted") {
        // alert("granted");
      }
    }
    // Audio Permission
    const { status } = await Permissions.askAsync(Permissions.AUDIO_RECORDING);
    this.setState({ hasAudioPermission: status === "granted" });

  }

  updateScreenForSoundStatus = (status: AVPlaybackStatus) => {
    if (status.isLoaded) {
      this.setState({
        soundDuration: status.durationMillis ?? null,
        soundPosition: status.positionMillis,
        shouldPlay: status.shouldPlay,
        isPlaying: status.isPlaying,
        rate: status.rate,
        muted: status.isMuted,
        volume: status.volume,
        shouldCorrectPitch: status.shouldCorrectPitch,
        isPlaybackAllowed: true,
      });
    } else {
      this.setState({
        soundDuration: null,
        soundPosition: null,
        isPlaybackAllowed: false,
      });
      if (status.error) {
        console.log(`FATAL PLAYER ERROR: ${status.error}`);
      }
    }
  };

  updateScreenForRecordingStatus = (status: Audio.RecordingStatus) => {
    if (status.canRecord) {
      this.setState({
        isRecording: status.isRecording,
        recordingDuration: status.durationMillis,
      });
    } else if (status.isDoneRecording) {
      this.setState({
        isRecording: false,
        recordingDuration: status.durationMillis,
      });
      if (!this.state.isLoading) {
        this.stopRecordingAndEnablePlayback();
      }
    }
  };

  async stopPlaybackAndBeginRecording() {
    this.setState({
      isLoading: true,
    });
    if (this.sound !== null) {
      await this.sound.unloadAsync();
      this.sound.setOnPlaybackStatusUpdate(null);
      this.sound = null;
    }
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: true,
      interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
      playsInSilentModeIOS: true,
      shouldDuckAndroid: true,
      interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
      playThroughEarpieceAndroid: false,
      staysActiveInBackground: true,
    });
    if (this.recording !== null) {
      this.recording.setOnRecordingStatusUpdate(null);
      this.recording = null;
    }

    const recording = new Audio.Recording();
    await recording.prepareToRecordAsync(this.recordingSettings);
    recording.setOnRecordingStatusUpdate(this.updateScreenForRecordingStatus);

    this.recording = recording;
    await this.recording.startAsync(); // Will call this._updateScreenForRecordingStatus to update the screen.
    this.setState({
      isLoading: false,
    });
  }

  async stopRecordingAndEnablePlayback() {
    this.setState({
      isLoading: true,
    });
    if (!this.recording) {
      return;
    } else {
      const info = await FileSystem.getInfoAsync(this.recording.getURI() || "");
      var triggered = this.channel.trigger('client-adminchat', {

        // var triggered = this.channel.trigger('client-App\\Events\\adminchat', { 
        from: this.state.userID,
        to: this.state.driver_id,
        message: info.uri,
        messageType: "audio",
        generate_from: 'application',
        name: uname,

        // image: result.uri,
        createdAt: new Date().getTime(),

      });
      const userID = await AsyncStorage.getItem("userid");
      const { userName } = this.state;
      var uname = userName.replace('"', '');
      const message = {};
      message._id = Math.random().toString(36).substr(2, 5);
      // message.createdAt = new Date.now();
      message.user = {
        _id: parseInt(userID),
        name: uname,
        avatar: this.state.profile
      };
      message.audio = info.uri;
      message.messageType = "audio";
      this.setState(previousState => ({
        messages: GiftedChat.append(previousState.messages, message),
      }));
    }

    try {
      await this.recording.stopAndUnloadAsync();
    } catch (error) {
      // On Android, calling stop before any data has been collected results in
      // an E_AUDIO_NODATA error. This means no audio data has been written to
      // the output file is invalid.
      if (error.code === "E_AUDIO_NODATA") {
        console.log(
          `Stop was called too quickly, no data has yet been received (${error.message})`
        );
      } else {
        console.log("STOP ERROR: ", error.code, error.name, error.message);
      }
      this.setState({
        isLoading: false,
      });
      return;
    }
    const info = await FileSystem.getInfoAsync(this.recording.getURI() || "");
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
      playsInSilentModeIOS: true,
      shouldDuckAndroid: true,
      interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
      playThroughEarpieceAndroid: false,
      staysActiveInBackground: true,
    });
    const { sound, status } = await this.recording.createNewLoadedSoundAsync(
      {
        isLooping: true,
        isMuted: this.state.muted,
        volume: this.state.volume,
        rate: this.state.rate,
        shouldCorrectPitch: this.state.shouldCorrectPitch,
      },
      this.updateScreenForSoundStatus
    );
    this.sound = sound;
    this.setState({
      isLoading: false,
    });
  }

  onRecordPressed = () => {
    if (this.state.isRecording) {
      this.stopRecordingAndEnablePlayback();
    } else {
      this.stopPlaybackAndBeginRecording();
    }
  };

  onPlayPausePressed = () => {
    if (this.sound != null) {
      if (this.state.isPlaying) {
        this.sound.pauseAsync();
      } else {
        this.sound.playAsync();
      }
    }
  };

  onStopPressed = () => {
    if (this.sound != null) {
      this.sound.stopAsync();
    }
  };

  onMutePressed = () => {
    if (this.sound != null) {
      this.sound.setIsMutedAsync(!this.state.muted);
    }
  };

  onVolumeSliderValueChange = (value: number) => {
    if (this.sound != null) {
      this.sound.setVolumeAsync(value);
    }
  };

  trySetRate = async (rate: number, shouldCorrectPitch: boolean) => {
    if (this.sound != null) {
      try {
        await this.sound.setRateAsync(rate, shouldCorrectPitch);
      } catch (error) {
        // Rate changing could not be performed, possibly because the client's Android API is too old.
      }
    }
  };

  onRateSliderSlidingComplete = async (value: number) => {
    this.trySetRate(value * RATE_SCALE, this.state.shouldCorrectPitch);
  };

  onPitchCorrectionPressed = () => {
    this.trySetRate(this.state.rate, !this.state.shouldCorrectPitch);
  };

  onSeekSliderValueChange = (value: number) => {
    if (this.sound != null && !this.isSeeking) {
      this.isSeeking = true;
      this.shouldPlayAtEndOfSeek = this.state.shouldPlay;
      this.sound.pauseAsync();
    }
  };

  onSeekSliderSlidingComplete = async (value: number) => {
    if (this.sound != null) {
      this.isSeeking = false;
      const seekPosition = value * (this.state.soundDuration || 0);
      if (this.shouldPlayAtEndOfSeek) {
        this.sound.playFromPositionAsync(seekPosition);
      } else {
        this.sound.setPositionAsync(seekPosition);
      }
    }
  };

  getSeekSliderPosition() {
    if (
      this.sound != null &&
      this.state.soundPosition != null &&
      this.state.soundDuration != null
    ) {
      return this.state.soundPosition / this.state.soundDuration;
    }
    return 0;
  }

  getMMSSFromMillis(millis: number) {
    const totalSeconds = millis / 1000;
    const seconds = Math.floor(totalSeconds % 60);
    const minutes = Math.floor(totalSeconds / 60);

    const padWithZero = (number: number) => {
      const string = number.toString();
      if (number < 10) {
        return "0" + string;
      }
      return string;
    };
    return padWithZero(minutes) + ":" + padWithZero(seconds);
  }

  getPlaybackTimestamp() {
    if (
      this.sound != null &&
      this.state.soundPosition != null &&
      this.state.soundDuration != null
    ) {
      return `${this.getMMSSFromMillis(
        this.state.soundPosition
      )} / ${this.getMMSSFromMillis(this.state.soundDuration)}`;
    }
    return "";
  }

  getRecordingTimestamp() {
    if (this.state.recordingDuration != null) {
      return `${this.getMMSSFromMillis(this.state.recordingDuration)}`;
    }
    return `${this.getMMSSFromMillis(0)}`;
  }

  async launchCamera() {
    const userID = await AsyncStorage.getItem("userid");
    const { messages, userName } = this.state;
    var uname = userName.replace('"', '');
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: false,
      aspect: [4, 3],
      quality: 1,
      base64: true,
    });

    if (result.cancelled) {


      //user cancelled operation
      return;
    } else {

      var triggered = this.channel.trigger('client-adminchat', {

        // var triggered = this.channel.trigger('client-App\\Events\\adminchat', { 
        from: this.state.userID,
        to: this.state.driver_id,
        message: result.uri,
        messageType: "image",
        generate_from: 'application',
        name: uname,

        // image: result.uri,
        createdAt: new Date().getTime(),

      });
      const userID = await AsyncStorage.getItem("userid");
      const { userName } = this.state;
      var uname = userName.replace('"', '');
      const message = {};
      message._id = Math.random().toString(36).substr(2, 5);
      // message.createdAt = new Date.now();
      message.user = {
        _id: parseInt(userID),
        name: uname,
        avatar: this.state.profile
      };
      message.image = result.uri;
      message.messageType = "image";

      this.setState(previousState => ({
        messages: GiftedChat.append(previousState.messages, message),
      }));

    }
  }

  async getChatHistory() {
    this.setState({ loader: true });
    const driver_id = this.props.navigation.getParam('driver_id')
    const userID = await AsyncStorage.getItem("userid");
    let Token = await AsyncStorage.getItem("token");

    Token = "Bearer " + Token;
    const getChatHistoryData = {
      my_id: userID,
      anotheruser_id: driver_id,
    };
    getChatHistoryAction(getChatHistoryData, Token).then((responseJson) => {
      if (responseJson.isError == false) {

        this.setState((previousState) => ({
          messages: GiftedChat.append(
            previousState.messages,
            responseJson.result.reverse()
          ),
        }));
        this.setState({
          loader: false,
        });
      } else {
        this.refs.defaultToastBottomWithDifferentColor.ShowToastFunction(
          responseJson.message
        );
        this.setState({ loader: false });
      }
    });
  }

  renderBubble(props) {
    return (
      // Step 3: return the component
      <Bubble
        {...props}
        wrapperStyle={{
          right: {
            // Here is the color change
            backgroundColor: "#ee3c48",
            fontFamily: 'Inter-Black',
          },
        }}
        textStyle={{
          right: {
            color: "#fff",
            fontFamily: 'Inter-Black',
          },
        }}
      />
    );
  }

  async handleSend(newMessage = [0]) {
    const { messages, userName } = this.state
    var uname = userName.replace('"', '');
    var triggered = this.channel.trigger('client-adminchat', {

      // var triggered = this.channel.trigger('client-App\\Events\\adminchat', { 
      from: this.state.userID,
      to: this.state.driver_id,
      message: newMessage[0].text,
      messageType: "text",
      generate_from: 'application',
      name: uname,
      avatar: this.state.profile,

      createdAt: new Date().getTime(),

    });
    this.setState(previousState => ({

      messages: GiftedChat.append(previousState.messages, newMessage),

    }));

    // store chat history in database
    let Token = await AsyncStorage.getItem("token");
    Token = "Bearer " + Token;

    const storeChatInDB = {
      from: this.state.userID,
      to: this.state.driver_id,
      message: newMessage[0].text,

      createdAt: Date.parse(newMessage[0].createdAt),
    }
    saveChatMessageAction(storeChatInDB, Token).then((responseJson) => {
      if (responseJson.isError == false) {
        // this.setState({
        //   loader: false,
        // });
        // this.setState((previousState) => ({
        //   messages: GiftedChat.append(
        //     previousState.messages,
        //     responseJson.result.reverse()
        //   ),
        // }));
      } else {
        this.refs.defaultToastBottomWithDifferentColor.ShowToastFunction(
          responseJson.message
        );
        // this.setState({ loader: false });
      }
    });
  }

  async _pusherSubscription() {
    const { messages, driver_id } = this.state
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

    if (this.state.triggerChannelState != 1) {
      this.channel = this.pusher.subscribe("private-chat");
      this.setState({
        triggerChannelState: 1,
      });
      // alert(this.state.triggerChannelState)
    }

    this.channel.bind("pusher:subscription_succeeded", () => {
      this.channel.bind("client-adminchat", data => {
        console.log(data)
        if (this.state.userID == data.to && this.state.driver_id == data.from) {
          if (data.messageType == "text") {
            var message = {
              "_id": Math.random().toString(36).substr(2, 5),
              "createdAt": data.createdAt,
              "text": data.message,
              // 'image': data.image,
              "user": {
                "_id": parseInt(data.from),
                "name": data.name,
                "avatar": data.avatar,
              },
            };
          } else if (data.messageType == "image") {
            console.log('in image')
            var message = {
              "_id": Math.random().toString(36).substr(2, 5),
              "createdAt": data.createdAt,
              "image": data.message,
              // 'image': data.image,
              "user": {
                "_id": parseInt(data.from),
                "name": data.name,
                "avatar": data.avatar,
              },
            };
            // this.getChatHistory()
          }
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
      });
    };
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

  _onBlurr = () => {
    BackHandler.removeEventListener(
      "hardwareBackPress",
      this._handleBackButtonClick
    );
  };

  _onFocus = () => {
    BackHandler.addEventListener(
      "hardwareBackPress",
      this._handleBackButtonClick
    );
  };

  // _handleBackButtonClick = () => BackHandler.exitApp()
  _handleBackButtonClick = () => this.props.navigation.goBack()

  componentWillUnmount() {
    this.pusher.disconnect()
    // this.unsubscribe = this.pusher.unsubscribe("chat");
  }

  async launchImageGalary(imageCase) {
    const { messages, userName, image } = this.state
    var uname = userName.replace('"', '');
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      aspect: [4, 3],
      quality: 1,
      base64: true,
    });

    if (result.cancelled) {
      // alert("You Cancelled Selected Image");
      //user cancelled operation
      return;
    } else {
      var triggered = this.channel.trigger('client-adminchat', {

        // var triggered = this.channel.trigger('client-App\\Events\\adminchat', { 
        from: this.state.userID,
        to: this.state.driver_id,
        message: result.uri,
        messageType: 'image',
        generate_from: 'application',
        name: uname,
        createdAt: new Date().getTime(),
        user : {
          _id: parseInt(userID),
          name: uname,
          avatar: this.state.profile
        }
      });
      const userID = await AsyncStorage.getItem("userid");
      const { userName } = this.state;
      var uname = userName.replace('"', '');
      const message = {};
      message._id = Math.random().toString(36).substr(2, 5);
      // message.createdAt = new Date.now();
      message.user = {
        _id: parseInt(userID),
        name: uname,
        avatar: this.state.profile
      };
      message.image = result.uri;
      message.messageType = "image";

      this.setState(previousState => ({
        messages: GiftedChat.append(previousState.messages, message),
      }));

      // store chat history in database
      let Token = await AsyncStorage.getItem("token");
      Token = "Bearer " + Token;
      const formData = new FormData();
      formData.append("from", this.state.userID);
      formData.append("to", this.state.driver_id);
      formData.append("messageType", "image");
      formData.append("createdAt", new Date().getTime());
      formData.append("message", {
        uri: result.uri,
        name: "image.jpg",
        type: "image/jpg",
      });

      // const storeChatInDB = {
      //   from: this.state.userID,
      //   to: this.state.adminId,
      //   message: result.uri,
      //   messageType: 'image',
      //   createdAt: new Date().getTime(),
      // }
      saveChatImageAction(formData, Token).then((responseJson) => {
        console.log(responseJson
        )
        if (responseJson.isError == false) {
          // this.setState({
          //   loader: false,
          // });
          // this.setState((previousState) => ({
          //   messages: GiftedChat.append(
          //     previousState.messages,
          //     responseJson.result.reverse()
          //   ),
          // }));
        } else {
          this.refs.defaultToastBottomWithDifferentColor.ShowToastFunction(
            responseJson.message
          );
          // this.setState({ loader: false });
        }
      });

    }
  }

  render() {
    const order_id = this.props.navigation.getParam("order_id");
    const backpage = this.props.navigation.getParam('backpage')
    const { loader, messages, userID, userName, hasCameraPermission } = this.state;
    const { navigate } = this.props.navigation;
    var uname = userName.replace('"', '');
    if (!loader) {
      return (
        <View style={styles.container}>
          <NavigationEvents
            onWillFocus={this._onFocus}
            onWillBlur={this._onBlurr}
          />
          <Row style={styles.Navebar}>
            <Col style={{ width: "10%" }}>
              <TouchableOpacity onPress={() => navigate('MarketPlace')}>
                <Image
                  source={require("../../images/Back-Arrow.png")}
                  style={styles.BackArrow}
                />
              </TouchableOpacity>
            </Col>
          </Row>
          {/* <TouchableOpacity
            // underlayColor={BACKGROUND_COLOR}
            // style={styles.wrapper}
            onPress={this.onPlayPausePressed}
            disabled={!this.state.isPlaybackAllowed || this.state.isLoading}
          >
            <Image
              style={styles.BottomRowIcon}
              source={
                this.state.isPlaying
                  ? Icons.PAUSE_BUTTON.module
                  : Icons.PLAY_BUTTON.module
              }
            />
          </TouchableOpacity>
          <Slider
            style={{ height: '5%', width: '50%', marginBottom: 5 }}
            // trackImage={Icons.TRACK_1.module}
            // thumbImage={Icons.THUMB_1.module}
            value={this.getSeekSliderPosition()}
            onValueChange={this.onSeekSliderValueChange}
            onSlidingComplete={this.onSeekSliderSlidingComplete}
            disabled={!this.state.isPlaybackAllowed || this.state.isLoading}
          />
          <Text>
            {this.getPlaybackTimestamp()}
          </Text> */}
          <GiftedChat
            messages={messages}
            onSend={(newMessage) => this.handleSend(newMessage)}
            user={{ _id: parseInt(userID), name: uname, avatar: this.state.profile }}
            renderBubble={this.renderBubble}
            placeholder={t("Type your message here")}
            showUserAvatar
            // alwaysShowSend
            renderSend={this.renderSend}
            scrollToBottom

          />
          <Row style={{ height: '4%', paddingRight: '10%', paddingLeft: "10%", paddingBottom: "10%", backgroundColor: '#fff' }}>
            <Col >
              <TouchableOpacity style={styles.BottomIconCol} onPress={() => this.launchCamera("image")}  >
                <Image source={require("../../images/Camera.png")} style={styles.BottomRowIcon} />

              </TouchableOpacity>
            </Col>

            <Col style={styles.BottomMikeIconCol}>
              <Text style={{ fontSize: 10 }}>
                {this.getRecordingTimestamp()}
              </Text>
              <TouchableOpacity
                // underlayColor={BACKGROUND_COLOR}
                // style={styles.wrapper}
                onPress={this.onRecordPressed}
                disabled={this.state.isLoading}
              >
                <Image
                  source={require("../../images/Mike.png")}
                  style={styles.BottomRowIcon}
                />
              </TouchableOpacity>
            </Col>
            <Col style={styles.BottomMikeIconCol}>

              <TouchableOpacity onPress={() => this.launchImageGalary()} >
                <Image
                  source={require("../../images/gallery.png")}
                  style={styles.BottomRowIcon}
                />
              </TouchableOpacity>
            </Col>

          </Row>
        </View>
      );
    } else {
      return (
        <ActivityIndicator
          style={styles.loading}
          size="large"
          color="#d62326"
        />
      );
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#b3d6f1",
  },
  Navebar: {
    ...Platform.select({
      ios: {
        height: 1,
        paddingBottom: 40,
        marginTop: "10%",
      },
      android: {
        height: 40,
      },
    }),
  },
  BackArrow: {
    ...Platform.select({
      ios: {
        width: 25,
        height: 25,
        justifyContent: "center",
        alignItems: "center",
        marginLeft: 10,
      },
      android: {
        width: 25,
        height: 25,
        justifyContent: "center",
        alignItems: "center",
        marginLeft: 10,
        marginTop: 10,
      },
    }),
  },

  bottomComponentContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  sendingContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
    marginBottom: 5,
  },
  Camera: {
    justifyContent: "center",
    alignItems: "center",
  },
  BottomRowIcon: {
    width: 25,
    height: 25,
    justifyContent: "center",
    alignItems: "center",
    // marginTop: 5,
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

  //camera

  BottomIconCol: {
    // marginRight: "5%",
    height: 30,
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: "10%",

  },
  BottomMikeIconCol: {
    // marginRight: "5%",
    height: 30,
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: "10%",



  },
});

