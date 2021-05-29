import React, { Component, useState  } from 'react';
import { 
    Toast, 
    TouchableHighlight, 
    KeyboardAvoidingView, 
    Modal, 
    Button, 
    Dimensions, 
    AsyncStorage, 
    Picker, 
    Alert, 
    StyleSheet, 
    Text, 
    View, 
    Image, 
    TextInput, 
    TouchableOpacity, 
    StatusBar,
    Keyboard, 
    ScrollView 
} from 'react-native';

import { Col, Row, Grid } from "react-native-easy-grid";
import { t } from '../../../locals';
import {Collapse,CollapseHeader, CollapseBody, AccordionList} from 'accordion-collapse-react-native';
import MapView , { Marker, Polyline , Callout, PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from "expo-location";
import * as Permissions from "expo-permissions";
import Geocoder from 'react-native-geocoding';
// import DialogInput from 'react-native-dialog-input';
import validate from 'validate.js';
import MapViewDirections from 'react-native-maps-directions';

import CustomToast from './Toast.js';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';

import { Dropdown } from 'react-native-material-dropdown';
import DropdownMenu from 'react-native-dropdown-menu';
import { SearchBar } from 'react-native-elements';
import { addCustomerFavouriteplaceAction, getCustomerFavoriteAddressListAction } from '../Util/Action.js';
const { width, height } = Dimensions.get('window');
const SCREEN_WIDTH = width;
const SCREEN_HEIGHT = height;
const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.0;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
const origin = {latitude: 23.074333, longitude: 72.525349};
const destination = {latitude: 23.076297, longitude: 72.525633};

const GOOGLE_MAPS_APIKEY = 'AIzaSyCrhCKosfVZZb17Tn7snqF3aNLUXgtyT0Y';

const homePlace = {
  description: 'Home',
  geometry: { location: { lat: 48.8152937, lng: 2.4597668 } },
};
const workPlace = {
  description: 'Work',
  geometry: { location: { lat: 48.8496818, lng: 2.2940881 } },
};
export default class LocationScreen extends Component {
    static navigationOptions = ({ navigation }) => {
		return {
			headerShown: false
		};
	};
	
	constructor(props){
        super(props);
        this.state = {
            initialPosition:{
                latitude : 0,
                longitude : 0,
                latitudeDelta: 0.0,
                longitudeDelta: 0.0,
            },
			mapRegion : {
                latitude: 0,
                longitude: 0,
                latitudeDelta: 0.0,
                longitudeDelta: 0.0,
            },
            startPosition: {
                latitude : 0,
                longitude : 0,
                latitudeDelta: 0.0,
                longitudeDelta: 0.0,
            },
			distance: '',
			fromLocationText : '',
			toLocationText : '',
			address : '',
            text: '',
			markers: [],
            destination: [], 
            search: '',
            modalVisible: false,
            Address:'',
            latitude : '',
            longitude : '',
            favoriteAddressList:'',
            testing:'',
            latitude1:'',
            longitude1:'' 
        };
        this.mapRef = null;
        this.onPoiClick = this.onPoiClick.bind(this);

    }
    async onPoiClick(e) {
        
        const poi = e.nativeEvent;
        const place_id = poi.placeId;
        const formatted_address = poi.formatted_address;
        var from_location_address = this.state.fromLocationText;
        var to_location_address = this.state.toLocationText;
        var from_latitude = this.state.startPosition.latitude;
		var from_longitude = this.state.startPosition.longitude;
        var to_latitude = this.state.initialPosition.latitude;
		var to_longitude = this.state.initialPosition.longitude;
        var tourAllocation = [];
        this.setState({
            markers:[],
        });
       
        var locations = {};
       
        locations = {
                id: Math.round(Math.random() * 9), // The ID attached to the marker. It will be returned when onMarkerClicked is called
                coords: poi.coordinate, // Latitude and Longitude of the marker // HTML element that will be displayed as the marker.  It can also be text or an SVG string.
                animation: {
                    name: 'pulse',
                    duration: '.5',
                    delay: 0,
                    interationCount: 'infinite'
                },
            };
        tourAllocation.push(locations);
        this.setState({
            markers:tourAllocation,
            startPosition: locations.coords,
             
            
        });

        
        fetch("https://maps.googleapis.com/maps/api/place/details/json?place_id="+place_id+"&key=AIzaSyCrhCKosfVZZb17Tn7snqF3aNLUXgtyT0Y", {
		// return fetch("https://api.msg91.com/api/v5/otp?authkey=8021AEb8FlH35f115208P123&template_id=5f153b4dd6fc0564ba422448&mobile=+507"+mobile+"&otp_length=4", {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
        })
		
		.then((response) => response.json())
		
        


		.then((responseJson) => {
			// return responseJson;
            const formatted_address = responseJson.result.formatted_address;
            this.setState({
                fromLocationText: formatted_address
            })
		})
        // .then(json => {
        //     from_location_address = json.results[0]['formatted_address'];
        //     console.log(from_location_address)
        // })
		.catch((error) => {
			console.log(error);
		})
		
       
    }
	
    showDialog = () => {
    this.setState({ dialogVisible: true });
    };
    
    handleCancel = () => {
        this.setState({ dialogVisible: false });
    };
    
    handleDelete = () => {
        this.setState({ dialogVisible: false });
    };
  
    toggleDrawer = ({navigation}) => {
	    this.props.navigation.toggleDrawer();
	};

    onMarkerDragEnd = (coord, key) => {
        const latLng  = coord;
		if(key == 'A')
		{
			this.setState({startPosition:coord});
		}else if(key == 'B'){
			this.setState({mapRegion:coord});
			this.setState({initialPosition:coord});
		}
        
    };
    watchID: ?number = null
    async componentDidMount(){
        let { status } = await Permissions.askAsync(Permissions.LOCATION);

        if (status !== "granted") {
        this.setState({
            errorMessage: "Permission to access location was denied",
        });
        } else if (status == "granted") {
            let location = await Location.getCurrentPositionAsync({});
            var lat = parseFloat(location.coords.latitude)
            var long = parseFloat(location.coords.longitude)

            var initialRegion = {
               latitude: Number(lat),
               longitude: Number(long),
               latitudeDelta: LATITUDE_DELTA,
               longitudeDelta: LONGITUDE_DELTA
            }
		   
           this.setState({
                mapRegion: { 
                   latitude: lat, 
                   longitude: long, 
                   latitudeDelta: 0.09, 
                   longitudeDelta: 0.02 
                }})
		   this.setState({initialPosition: initialRegion})
        }
     
        // navigator.geolocation.getCurrentPosition((position) => {
            
           
    //    },
    //    (error) => alert(JSON.stringify(error)),
    //     {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000}
    //    )

    //    this.watchID = navigator.geolocation.watchPosition((position) => {
    //         var lat = parseFloat(position.coords.latitude)
    //         var long = parseFloat(position.coords.longitude)
    //         var lastRegion = {
    //            latitude : lat,
    //            longitude: long,
    //            longitudeDelta: LONGITUDE_DELTA,
    //            latitudeDelta: LATITUDE_DELTA, 
    //         }
	// 		this.setState({
    //             mapRegion: { 
    //                 latitude: position.coords.latitude, 
    //                 longitude: position.coords.longitude, 
    //                 latitudeDelta: 0.0922, 
    //                 longitudeDelta: 0.0421 
    //             }})
    //         this.setState({initialPosition: lastRegion})
		   
    //    },
    // //    (error) => alert(JSON.stringify(error)),
    //     {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000}
    //    )

       // get favorate address list
       this.getCustomerFavoriteAddressList()  
    }

    async getCustomerFavoriteAddressList() {
        // customer id
        // token

        // this.setState({ loader: true });
        const userID = await AsyncStorage.getItem("userid");
        let Token = await AsyncStorage.getItem("token");

        Token = "Bearer " + Token;
        const dataForGetFavoriteLocation = {
        user_id: userID,
        };
        getCustomerFavoriteAddressListAction(dataForGetFavoriteLocation, Token).then((responseJson) => {
			if (responseJson.isError == false) {
				this.setState({
				favoriteAddressList: responseJson.result,
				loader: false,
				});
			} else {
				// alert(responseJson.message);
				this.setState({ loader: false });
			}
        });


    }


    componentWillUnmount() {
        navigator.geolocation.clearWatch(this.watchID)
    }

    updateSearch = (search) => {
        this.setState({ search });
    };

    async saveCustomerLocation(){
        const { method_name ,Address, address, latitude, longitude } = this.state;
        var constraints = {
            method_name: {
                presence: {
                    allowEmpty: false,
                    message: "^ Place name required"
                },
                format: {
                    pattern: "[A-Za-z ]+",
                    flags: "i",
                    message: "^ only characters"
                }
            },
            Address: {
                presence: {
                    allowEmpty: false,
                    message: "^ Address required"
                },
            }
        };
        Keyboard.dismiss();
		
        const result = validate({  method_name: this.state.method_name, Address: this.state.Address }, constraints);
		
        if(result)
        {
            if (result.method_name) {
                // Alert.alert("Name");
                this.refs.defaultToastBottomWithDifferentColor.ShowToastFunction(result.method_name);
				return false;
            }
            if (result.Address) {
                this.refs.defaultToastBottomWithDifferentColor.ShowToastFunction(result.Address);
				return false;
            }
			
        }

        if(!result) {
            let customer_id = await AsyncStorage.getItem('userid');
            var location = {
                    user_id: customer_id,
                    title: this.state.method_name,
                    address: this.state.Address,
                    latitude: this.state.latitude,
                    longitude: this.state.longitude,
            }
            let Token = await AsyncStorage.getItem('token');
			Token = 'Bearer ' + Token;  
            this.setState({ loading: true });
            var response = addCustomerFavouriteplaceAction(location,Token).then(function (responseJson) {
                if (responseJson.isError == false) {
					this.refs.defaultToastBottomWithDifferentColor.ShowToastFunction(responseJson.message);
					this.getCustomerFavoriteAddressList();
					
                } else {
                    this.setState({ loading: false });
                    this.refs.defaultToastBottomWithDifferentColor.ShowToastFunction(responseJson.message);
                }
            }.bind(this));
        }
    };
	
	async finalizaLocation(){
		const { navigate } = this.props.navigation;
		
		var to_latitude = this.state.initialPosition.latitude;
		var to_longitude = this.state.initialPosition.longitude;
		
		var from_latitude = this.state.startPosition.latitude;
		var from_longitude = this.state.startPosition.longitude;
		
		var distance = this.state.distance;
		
		var from_location_address = this.state.fromLocationText;
		
		var to_location_address = this.state.toLocationText;
		
		Geocoder.init(GOOGLE_MAPS_APIKEY);
		
		if(this.state.fromLocationText == '')
		{
			if(this.state.startPosition.latitude && this.state.startPosition.longitude){
				await Geocoder.from(this.state.startPosition.latitude, this.state.startPosition.longitude)
				.then(json => {
					from_location_address = json.results[0]['formatted_address'];
                    console.log(from_location_address)
				})
				.catch(error => console.warn(error));
			}
		}
		
		if(this.state.toLocationText == '')
		{
			if(this.state.initialPosition.latitude && this.state.initialPosition.longitude){
				await Geocoder.from(this.state.initialPosition.latitude, this.state.initialPosition.longitude)
				.then(json => {
					to_location_address = json.results[0]['formatted_address'];
				})
				.catch(error => console.warn(error));
			}
		}
		
		var constraints = {
            to_latitude: {
                presence: {
                    allowEmpty: false,
                    message: "^ Please select destination"
                }
            },
			to_longitude: {
                presence: {
                    allowEmpty: false,
                    message: "^ Please select destination"
                }
            },
			from_latitude: {
                presence: {
                    allowEmpty: false,
                    message: "^ Please select from location"
                }
            },
			from_longitude: {
                presence: {
                    allowEmpty: false,
                    message: "^ Please select from location"
                }
            },
            distance: {
                presence: {
                    allowEmpty: false,
                    message: "^ Please select start point"
                },
            },
            from_location_address: {
                presence: {
                    allowEmpty: false,
                    message: "^ Please select from location"
                },
            },
            to_location_address: {
                presence: {
                    allowEmpty: false,
                    message: "^ Please select destination"
                },
            }
        };
		
        const result = validate({  to_latitude: to_latitude, to_longitude: to_longitude, from_latitude: from_latitude, from_longitude: from_longitude, distance: distance,from_location_address: from_location_address, to_location_address: to_location_address}, constraints);
		
        if(result)
        {
            if (result.to_latitude) {
                this.refs.defaultToastBottomWithDifferentColor.ShowToastFunction(result.to_latitude);
				return false;
            }
			
            if (result.to_longitude) {
                this.refs.defaultToastBottomWithDifferentColor.ShowToastFunction(result.to_longitude);
				return false;
            }
			
			if (result.from_latitude) {
                this.refs.defaultToastBottomWithDifferentColor.ShowToastFunction(result.from_latitude);
				return false;
            }
			
			if (result.from_longitude) {
                this.refs.defaultToastBottomWithDifferentColor.ShowToastFunction(result.from_longitude);
				return false;
            }
			
			if (result.distance) {
                this.refs.defaultToastBottomWithDifferentColor.ShowToastFunction(result.distance);
				return false;
            }
			
			if (result.from_location_address) {
                this.refs.defaultToastBottomWithDifferentColor.ShowToastFunction(result.from_location_address);
				return false;
            }
			
			if (result.to_location_address) {
                this.refs.defaultToastBottomWithDifferentColor.ShowToastFunction(result.to_location_address);
				return false;
            }
        }
		
		if(!result) {
			var data = {
				to_latitude : this.state.initialPosition.latitude,
				to_longitude : this.state.initialPosition.longitude,
				from_latitude : this.state.startPosition.latitude,
				from_longitude : this.state.startPosition.longitude,
				distance : this.state.distance,
				from_location_address : from_location_address,
				to_location_address : to_location_address,
			}
			navigate('orderSpecification', {data});
        }
    };
	onMapClicked = (coordinate) => {
		var ll = parseFloat(coordinate.latitude);
		var lnn = parseFloat(coordinate.longitude);
		if(ll && lnn){
			var tourAllocation = [];
			this.setState({
				markers:[],
			});
		   var locations = {};
		   
		   locations = {
					id: Math.round(Math.random() * 9), // The ID attached to the marker. It will be returned when onMarkerClicked is called
					coords: {latitude : ll, longitude : lnn}, // Latitude and Longitude of the marker // HTML element that will be displayed as the marker.  It can also be text or an SVG string.
					animation: {
						name: 'pulse',
						duration: '.5',
						delay: 0,
						interationCount: 'infinite'
					},

				};

			tourAllocation.push(locations);

			this.setState({
			  markers:tourAllocation,
			  startPosition: locations.coords,
			  
			});
		}

	};
	
	onChangeCustomerLocationPointA(value){
		
		var LatLong = value.split('-');
		 
		var lat = parseFloat(LatLong[0]);
		var lon = parseFloat(LatLong[1]);
		if(lat && lon){
			var tourAllocation = [];
			this.setState({
				markers:[],
			});
		   var locations = {};
		   
		   locations = { // The ID attached to the marker. It will be returned when onMarkerClicked is called
					coords: {latitude : lat, longitude : lon, latitudeDelta: 0.0922, longitudeDelta: 0.0421}
				};

			tourAllocation.push(locations);

			this.setState({
			  markers:tourAllocation,
			  startPosition: locations.coords,
			  
			});
		}
		
		this.state.favoriteAddressList.map((item, index) => {
			if(value == item.value)
			{
				this.setState({ fromLocationText: item.label});
			}
		});
	}
	
	onChangeCustomerLocationPointB(value){
		var LatLong = value.split('-');
		 
		var lat = parseFloat(LatLong[0]);
		var lon = parseFloat(LatLong[1]);
		if(lat && lon){
		   var locations = {};
		   
		   locations = { // The ID attached to the marker. It will be returned when onMarkerClicked is called
					coords: {latitude : lat, longitude : lon, latitudeDelta: 0.0922, longitudeDelta: 0.0421}
				};

			this.setState({
			  initialPosition:locations.coords,
			  mapRegion: locations.coords,
			  
			});
		}
		
		this.state.favoriteAddressList.map((item, index) => {
			if(value == item.value)
			{
				this.setState({ toLocationText: item.label});
			}
		});
	}
	
	pointMarkerBySearch(data, details){
		var addr_text = (details != '')?details.formatted_address:'';
		var from_latitude = (details != '')?details.geometry.location.lat:'';
		var from_longitude = (details != '')?details.geometry.location.lng:'';
		
		if(from_latitude && from_longitude){
			var tourAllocation = [];
			this.setState({
				markers:[],
			});
		    var locations = {};
		   
		    locations = { // The ID attached to the marker. It will be returned when onMarkerClicked is called
					coords: {latitude : from_latitude, longitude : from_longitude, latitudeDelta: 0.0922, longitudeDelta: 0.0421}
				};

			tourAllocation.push(locations);

			this.setState({
			  markers:tourAllocation,
			  startPosition: locations.coords,
			  
			});
		}
		this.setState({ fromLocationText : addr_text });
	}

    setModalVisible = (visible) => {
   
    this.setState({ modalVisible: visible });
    }

    render() {
        const { navigate } = this.props.navigation;
        const { search } = this.state;
        let myCoordinate = this.state.mapRegion;
        const { modalVisible } = this.state;

        const favoriteAddressData = [];
        for (let userObject1 of this.state.favoriteAddressList) {
            favoriteAddressData.push({ label: userObject1.label, value: userObject1.value });
        }
        return (
                <View style={styles.container} >
                    <MapView style={styles.mapStyle}
                        provider={PROVIDER_GOOGLE} 
                        region={this.state.mapRegion}
                        initialRegion={this.state.initialPosition}
                        followUserLocation={true}
                        pitchEnabled={true}
                        showsCompass={true}
                        showsBuildings={true}
                        style={StyleSheet.absoluteFill}
                        ref={c => this.mapView = c}
                        zoomEnabled={true}
                        onPoiClick={this.onPoiClick}
						onPress={(e) => this.onMapClicked(e.nativeEvent.coordinate)}
                    >
                            {
                                this.state.markers.map((marker) => (
								
                                    <Marker 
											key='A'
                                            coordinate={marker.coords} 
                                            draggable
											onDragEnd={(e) => {this.onMarkerDragEnd(e.nativeEvent.coordinate, 'A')}}
                                    >
                                        < Image source ={require('../../../src/images/Location-A.png')} style={{ width : 48, height : 48 }}  />
                                    </Marker>
                                ))
                            }
                        <Marker
						    key='B'
                            coordinate={{  
                                latitude: this.state.initialPosition.latitude,
                                longitude: this.state.initialPosition.longitude,
                            }}
                            draggable 
                            onDragEnd={(e) => {this.onMarkerDragEnd(e.nativeEvent.coordinate, 'B')}}
                        >
                            < Image source ={require('../../../src/images/Location-B.png')} style={{ width : 48, height : 48 }}  />
                        </Marker>
						{(this.state.startPosition.latitude) ?
                        (<MapViewDirections
                            origin={this.state.mapRegion}
                            destination={this.state.startPosition}
                            apikey={GOOGLE_MAPS_APIKEY}
							timePrecision="now"
                            strokeWidth={5}
							onReady={(result) => {
								this.setState({ distance : result.distance });
								this.mapView.fitToCoordinates(result.coordinates, {
								  edgePadding: {
									right: width / 20,
									bottom: height / 20,
									left: width / 20,
									top: height / 20,
								  },
								});
						    }}
                            strokeColor="red"
                        />) : <View></View>}
                    </MapView>
                    <Row style={styles.Navebar} >
                        <Col>
                            <TouchableOpacity onPress ={() => navigate('Selection')} > 
                                <Image source={require('../../images/Back-Arrow.png')} style={styles.BackArrow}/>
                            </TouchableOpacity>
                        </Col>
                        
                        <Col >
                            <TouchableOpacity  style={{alignItems: 'flex-end'}} onPress={this.toggleDrawer.bind(this)}> 
                                <Image source={require('../../images/Menu.png')} style={styles.Menu}/>
                            </TouchableOpacity> 
                        </Col>                   
                    </Row>
                    <View style={{ position: 'absolute', width: '90%',marginLeft: 20}}>

                        <GooglePlacesAutocomplete
                            placeholder={t('Enter Location')}
                            query={{
                                key: GOOGLE_MAPS_APIKEY,
                                language: 'en', // language of the results
                            }}
                            onPress={(data, details = null) => {this.pointMarkerBySearch(data, details)}}
                            onFail={error => console.error(error)}
                            minLength={2}
                            autoFocus={false}
                            listViewDisplayed="auto"
                            returnKeyType={'default'}
                            fetchDetails={true}
                            showsUserLocation={true}
                            currentLocationLabel="Current location"
                            nearbyPlacesAPI="GooglePlacesSearch"
                            predefinedPlaces={[homePlace, workPlace]}
                            enablePoweredByContainer={false}
                            styles={{
                                ...Platform.select({
                                    ios:{
                                        container: {
                                            backgroundColor: '#ffffff',
                                            top:70,
                                            borderColor: '#c4c4c4',
                                            borderStyle:  'dashed',
                                            borderWidth: 1,
                                        },
                                        textInputContainer: {
                                            backgroundColor: 'rgba(0,0,0,0)',
                                            borderTopWidth: 0,
                                            borderBottomWidth: 1, width: '100%',
                                            
                                        },
                                        textInput: {
                                            marginLeft: 0,
                                            marginRight: 0,
                                            height: 30,
                                            color: '#5d5d5d',
                                            fontSize: 16,
                                            padding:10,
                                            // borderColor: '#c4c4c4',
                                            // borderRadius: 100,
                                            // borderStyle:  'dashed',
                                            // borderWidth: 2,
                                        },
                                    },
                                    android:{
                                        container: {
                                            backgroundColor: '#ffffff',
                                            top:50,
                                            borderColor: '#c4c4c4',
                                            borderStyle:  'dashed',
                                            borderWidth: 1,
                                        },
                                        textInputContainer: {
                                            backgroundColor: 'rgba(0,0,0,0)',
                                            borderTopWidth: 0,
                                            borderBottomWidth: 1, width: '100%',
                                            
                                        },
                                        textInput: {
                                            marginLeft: 0,
                                            marginRight: 0,
                                            height: 30,
                                            color: '#5d5d5d',
                                            fontSize: 16,
                                            padding:10,
                                            // borderColor: '#c4c4c4',
                                            // borderRadius: 100,
                                            // borderStyle:  'dashed',
                                            // borderWidth: 2,
                                        },
                                    }
                                })
								
                            }}
                        />
                    </View>
                    <View style={styles.Location}> 
                    
                        <Col style={{borderBottomWidth: 1, marginLeft: 20, marginRight: 20, borderColor: '#676b6f'}}> 
                            <Row>
                                
                                <Image source={require('../../images/Location-A.png')} style={styles.Listlogo}/>

                                
                                <Col style={{marginTop:-10, marginLeft: 10}}>

                                    <Dropdown
                                        // style={{flex: 0.5}}
                                        placeholder = {t('LOCATION OF THE ORDER')}
                                        placeholderTextColor= {'#000'}
                                        bgColor={'grey'}
                                        tintColor={'#000000'}
                                        activityTintColor={'red'}
										valueExtractor={({value})=> value}
										onChangeText={(value)=>{this.onChangeCustomerLocationPointA(value)}}
                                        // handler={(selection, row) => this.setState({text: data[selection][row]})}
                                        // onChangeText={({value})=> {this.setState({
                                            // testing:value,
                                        // });alert(value)}}    
                                        data={favoriteAddressData}
                                    >
                                    </Dropdown>
                                    {/* <Picker 
                                        mode="dropdown"
                                        bgColor={'grey'}
                                        placeholder={t('LOCATION OF THE ORDER')}
                                    
                                        placeholderTextColor= {'#000'}
                                        tintColor={'#000000'}
                                        activityTintColor={'red'}
                                        handler={(selection, row) => this.setState({text: data[selection][row]})}
                                        data={data}
                                        >
                                        <Picker.Item label="Ahmedabad" value="key0"  />
                                        <Picker.Item label="ATM Card" value="key1" />
                                        <Picker.Item label="Debit Card" value="key2" />
                                        <Picker.Item label="Credit Card" value="key3" />
                                    </Picker>
                                    <Col style={{marginTop: 50, marginLeft: '100%', position:'absolute'}} >
      <Image source={require('../../images/Down-Arrow.png')} style={styles.DownArrow}/>
      </Col> */}
                                        {/* <Text style={{position:'absolute', fontSize: 17, width: '90%', marginTop: 10, marginLeft: 10}}>LOCATION OF THE ORDER  <Text style={{fontSize: 12}}><Image source={require('../../images/Star.png')} style={styles.star}/>   Add to Favorites</Text></Text> */}
                                
                                </Col> 
                            </Row> 
                    
                        </Col>
                        <Col style={{borderBottomWidth: 1, marginLeft: 20, marginRight: 20, borderColor: '#676b6f'}}>
                            <Row>
                        
                                <Image source={require('../../images/Location-B.png')} style={styles.Listlogo}/>
                        
                            {/* </Row>
                            <Row> */}
                                <Col style={{marginTop:-10, marginLeft: 10}}>
                                        <Dropdown
                                            // style={{flex: 0.5}}
                                            placeholder = {t('CURRENT LOCATION')}
                                            placeholderTextColor= {'#000'}
                                            bgColor={'grey'}
                                            tintColor={'#000000'}
                                            activityTintColor={'red'}
											valueExtractor={({value})=> value}
											onChangeText={(value)=>{this.onChangeCustomerLocationPointB(value)}}
                                            handler={(selection, row) => this.setState({text: data[selection][row]})}
                                            data={favoriteAddressData}
                                            >
                                        </Dropdown>
                                        {/* <Text style={{position:'absolute', fontSize: 17, width: '70%', marginTop: 10, marginLeft: 10}}>CURRENT LOCATION  <Text style={{fontSize: 12}}><Image source={require('../../images/Star.png')} style={styles.star}/>   Add to Favorites</Text></Text> */}
                                </Col>
                            </Row>
                        </Col>
                        <Col style={{borderBottomWidth: 1, marginLeft: 20, marginRight: 20, borderColor: '#676b6f'}}>
                            {/* <TouchableOpacity onPress={this._twoOptionAlertHandler}>
                                
                                
                            
                               
                            </TouchableOpacity> */}

                            <Modal
                                animationType="slide"
                                transparent={false}
                                visible={modalVisible}
                                onRequestClose={() => {
                                    // navigate('LocationScreen')
                                }}
                                >
                                
                                <View style={styles.centeredView}>
                                    <View style={styles.modalView}>
                                    {/* <Text style={styles.modalText}>Hello World!</Text> */}

                                    <Row style={styles.Navebar2}>
                                        <Col>
                                            <TouchableOpacity onPress={() => {
                                                                this.setModalVisible(!modalVisible);
                                                                }} 
                                            > 
                                                <Image source={require('../../images/Back-Arrow.png')} style={styles.BackArrow}/>
                                            </TouchableOpacity>
                                        </Col>
                                        <Col>
                                            <Text style={styles.AddPlace}> {t('Add Place')} </Text>
                                        </Col>
                                        <Col>
                                            <TouchableOpacity   style={{alignItems: 'flex-end'}} 
                                                                onPress ={this.saveCustomerLocation.bind(this)}
                                            > 
                                                <Image source={require('../../images/send-button.png')} style={styles.Menu}/>
                                            </TouchableOpacity> 
                                        </Col>
                                    </Row>
                                    <Col>
                                        <Text style={styles.popupTextName}>{t('Name')}</Text>
                                        <TextInput  style={{borderBottomWidth:2}}
                                                    onChangeText={(method_name) => this.setState({ method_name })}>
                                        </TextInput>

                                        <Text style={styles.popupTextAddress}>{t('Address')}</Text>
                                        <GooglePlacesAutocomplete
                                            placeholder={t('Enter Location')}
                                            query={{
                                                key: GOOGLE_MAPS_APIKEY,
                                                language: 'en', // language of the results
                                            }}
                                            onPress={(data, details = null) => this.setState(
                                                {
                                                Address: data.description, // selected address
                                                coords: `${details.geometry.location.lat},${details.geometry.location.lng}`, // selected coordinates
                                                latitude: details.geometry.location.lat,
                                                longitude: details.geometry.location.lng
                                                }
                                            )
                                            }
                                            onFail={error => console.error(error)}
                                            minLength={2}
                                            autoFocus={false}
                                            numberOfLines={2}
                                            listViewDisplayed="auto"
                                            returnKeyType={'default'}
                                            fetchDetails={true}
                                            showsUserLocation={true}
                                            currentLocationLabel="Current location"
                                            nearbyPlacesAPI="GooglePlacesSearch"
                                            enablePoweredByContainer={false}
                                            // onChangeText={(Address) => this.setState({ Address })}
                                            
                                            
                                            styles={{
                                                textInputContainer: {
                                                    backgroundColor: 'rgba(0,0,0,0)',
                                                    borderTopWidth: 0,
                                                    borderBottomWidth: 0,
                                                    paddingBottom:20, width: '100%',
                                                    marginBottom: 20,
                                                    
                                                },
                                                textInput: {
                                                    marginLeft: 0,
                                                    marginRight: 0,
                                                    height: 50,
                                                    color: '#5d5d5d',
                                                    fontSize: 16,
                                                    borderColor: '#000',
                                                    // borderRadius: 100,
                                                    // borderStyle:  'dashed',
                                                    borderBottomWidth: 2,
                                                    
                                                    
                                                },
                                            predefinedPlacesDescription: {
                                                // image: '../../images/Location-B.png',
                                                color: '#1faadb',
                                                marginTop: 3,
                                            },
                                            }}
                                        />
                                    </Col>
                                    {/* <Col style={{height: 100, marginBottom: 100}}> 
                                        <MapView style={styles.mapStyleModal} />
                                    </Col> */}
                                    {/* <TouchableHighlight
                                        style={{ ...styles.openButton, backgroundColor: "#e02127" }}
                                        // 
                                        onPress ={this.send.bind(this)}
                                    >
                                        <Text style={styles.textStyle}>Submit</Text>
                                    </TouchableHighlight> */}
                                    <CustomToast ref = "defaultToastBottomWithDifferentColor" backgroundColor='#000' position = "top"/>
                                    </View>
                                    
                                </View>
                                
                            </Modal>

                            <TouchableOpacity
                                style={styles.openButton}
                                onPress={() => {
                                    this.setModalVisible(true);
                                }}
                            >
                                <Text style={styles.Add}> 
                                    <Image source={require('../../images/PluseIcon.png')} style={styles.Pluse}/>        {t('Add additional destination')}
                                </Text>
                                
                            </TouchableOpacity>      
                        </Col>
                        
                    </View>
                    
                    <Row style={styles.Accept}>
                        <TouchableOpacity style={styles.Login}> 
                            <Text style={{color: '#fff', fontSize:20}} onPress ={this.finalizaLocation.bind(this)} >{t('To accept')}</Text>
                        </TouchableOpacity>
                    </Row>
                    <CustomToast ref = "defaultToastBottomWithDifferentColor" backgroundColor='#000' position = "top"/>
                </View>
         
        );
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        
        // alignItems: 'center',
        // justifyContent: 'center',
        height: 10,
        // position: 'absolute',
        // marginLeft: 90,
      

        
        
    },
    pickerIcon: {
    color: "#000",
    position: "absolute",
    bottom: 15,
    right: 10,
    fontSize: 20
 },
    Navebar: {
        ...Platform.select ({
            ios:{
                // height: 1 , 
                // paddingBottom: 50, 
                marginTop:35,
                zIndex: 9999,
                position: 'absolute',
            },
            android:{
              
                // flex:1,
                // height: 50 , 
                // marginTop:15,
                // paddingBottom: 50, 
                zIndex: 9999,
                position: 'absolute',
                
            }})

    },
    Navebar2: {
        ...Platform.select ({
            ios:{
                height: 40 ,
                // paddingBottom: 50, 
                marginTop:30,
            },
            android:{
                height: 50 , 
                marginTop:10,
            }})

    },
    BackArrow: {
        ...Platform.select({
            ios:{
                width: 25,
                height: 25,
                justifyContent: 'center', 
                alignItems: 'center',
                marginLeft: 10,
                // marginTop: 10,
            },
            android:{
                width: 25,
                height: 25,
                justifyContent: 'center', 
                alignItems: 'center',
                marginLeft: 10,
                marginTop: 10,
            }
        })
    },
    Menu: {
        ...Platform.select({
            ios:{
                width: 25,
                height: 25,
                marginRight: 10,
                alignItems: 'flex-end',
            },
            android:{
                width: 25,
                height: 25,
                // justifyContent: 'center', 
                // alignItems: 'center',
                marginRight: 10,
                marginTop: 10,
                
                alignItems: 'flex-end',
            }
        })  
    },
    mapStyle: {
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
		// position:'absolute',
        // height: 200,
        // width: 350,
    },
    mapStyleModal: {
        
		// position:'absolute',
        height: 150,
        width: 350,
    },
    searchbar: {
        justifyContent: 'center', 
        alignItems: 'center',
    },
     Accordion: {
        // backgroundColor:'#e9e7e6',
        // marginLeft: 20,
        // marginRight: 20,
        // borderBottomWidth: 2,
        // marginTop: 10,
        // zIndex: 9999,
        // position: 'absolute',
        // flexDirection: 'column-reverse',
        // flex:1
       zIndex: 9999, position: 'absolute',marginTop: '120%',height: 70,marginLeft: 20, marginRight: 20, backgroundColor: '#fff',  width:'90%'
    },
    Dropdown: {
        marginTop: '140%',
        height: 90,
        marginLeft: 20, marginRight: 20,
        backgroundColor: '#fff', 
        // borderWidth:1, 
        width:'90%',
        zIndex: 9999,
        position: 'absolute',


      
        
    },
    DownArrow: {
        width: 20,
        height: 20,
        marginRight: 10,
        marginTop: 15,

        color: "#000",
    position: "absolute",
    bottom: 15,
    right: 10,
    fontSize: 20,
    backgroundColor: '#fff'
    },

        TextInput: {
        ...Platform.select({
        ios:{justifyContent: 'center', 
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
                color: '#000',}, 
        android:{
            justifyContent: 'center', 
                // paddingLeft: 40,
                paddingTop: 10,
                // alignItems: 'center',
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
   
                
        }}),      
          
    },
     Listlogo: { 
        ...Platform.select({
            ios:{
                marginTop: 10,
                width: 50,
                height: 50,        
            }, 
            android:{
                marginTop: 10,
                width: 50,
                height: 50,
            }})
    },
    star: {
        ...Platform.select({
            ios:{
                width:16,
                height: 16,
            },
            android:{
                width:12,
                height: 12,
            },
        })   
    },
    Pluse: {
        ...Platform.select({
            ios:{
                width:35,
                height: 35,
                marginTop: 10,
                marginBottom: 10,
            },
            android:{
                width:30,
                height: 30,
                marginTop: 10,
                marginBottom: 10,
            },
        })   
    },
    Add: {
        ...Platform.select({
            ios: {
                marginBottom: 20, height: 20, fontSize: 15,marginTop : 15
            },
            android: {
                marginBottom: 10, height: 40, fontSize: 15,
            },
        })
    },
    Accept: {
        ...Platform.select({
            ios:{
                flex: 1,
                justifyContent: 'center',
                position: 'absolute',
                width: '100%',
                bottom: 5
            },
            android:{
                flex: 1,
                justifyContent: 'center',
                position: 'absolute',
                bottom: 5,
                width: '100%'
            }
        })
       
    },
    Login: {
       marginTop: 20,
       alignItems: 'center',
       justifyContent: 'center',
       width: '90%',
    //    marginLeft: 20,
    //    marginRight:20,
       height: 55 ,
       borderRadius: 40,
       backgroundColor: '#e02127',
       color: '#fff',

    },
    Location: {
        ...Platform.select({
            ios: {
                position: 'absolute', 
                width: '90%', 
                marginTop: '105%', 
                marginLeft : 20, 
                backgroundColor: '#fff',
            },
            android: {
                
                position: 'absolute', 
                width: '90%', 
                // marginTop: '115%', 
                bottom: '10%',
                marginLeft : 20,
                // marginRight: 20, 
                backgroundColor: '#fff',
            }
        })
    },

    centeredView: {
        position: 'absolute',
		backgroundColor: '#FFFFFF',
		// height : '63%',
		borderRadius: 9,
		shadowColor: "#777",
        shadowOffset: {width: 0,height: 1,},
        shadowOpacity: 0.5,
        shadowRadius: 6.22,
        elevation: 5,
        width: Dimensions.get('window').width,
        // height: Dimensions.get('window').height,
    },
    modalView: {
        ...Platform.select({
            ios:{
                // margin: 20,
                backgroundColor: "white",
                // borderRadius: 20,
                paddingBottom: 35,
                paddingLeft: 5,
                paddingRight: 5,
                // alignItems: "center",
                // width: Dimensions.get('window').width,
                height: Dimensions.get('window').height,
                shadowColor: "#000",
                shadowOffset: {
                width: 0,
                height: 2
                },
                shadowOpacity: 0.25,
                shadowRadius: 3.84,
                elevation: 5
            },
            android:{
                // margin: 20,
                backgroundColor: "#fff",
                // borderRadius: 20,
                paddingBottom: 35,
                paddingLeft: 5,
                paddingRight: 5,
                // alignItems: "center",
                // width: Dimensions.get('window').width,
                height: Dimensions.get('window').height,
                shadowColor: "#000",
                shadowOffset: {
                width: 0,
                height: 2
                },
                shadowOpacity: 0.25,
                shadowRadius: 3.84,
                elevation: 5
            }
        })
        
    },
    openButton: {
        
        // borderRadius: 20,
        // elevation: 2
    },
    AddPlace: {
        ...Platform.select({
            ios:{
                alignItems:'center', 
                fontSize: 20, 
                fontWeight: 'bold', 
                marginLeft: 10, 
                // marginTop: 10
            },
            android:{
                alignItems:'center', 
                fontSize: 20, 
                fontWeight: 'bold', 
                marginLeft: 10, 
                marginTop: 10
            }
        })
    },
    textStyle: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center"
    },
    modalText: {
        marginBottom: 15,
        textAlign: "center"
    },
    popupTextName: {
        marginLeft: 10,
    },
    popupTextAddress: {
        marginLeft: 10,
        marginTop: 20,
    },
});