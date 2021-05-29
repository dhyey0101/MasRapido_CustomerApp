import React, { Component, useState } from 'react';
import {
    BackHandler,
    Dimensions,
    ActivityIndicator,
    AsyncStorage,
    StyleSheet,
    Text,
    View,
    Image,
    TouchableOpacity,
    ImageBackground,
    Platform
} from 'react-native';
import normalize from 'react-native-normalize';
import Geocoder from 'react-native-geocoding';
import { NavigationEvents } from 'react-navigation';
import { Col, Row, Grid } from "react-native-easy-grid";
import { t } from '../../../locals';
// import { Collapse, CollapseHeader, CollapseBody, AccordionList } from 'accordion-collapse-react-native';
import MapView, { ProviderPropType, AnimatedRegion, Marker, Polyline, Callout, PROVIDER_GOOGLE } from 'react-native-maps';
// import geolocation from 'react-native-geolocation-service';
import * as Location from "expo-location";
//import * as Permissions from "expo-permissions";// import DialogInput from 'react-native-dialog-input';
// import validate from 'validate.js';
// import MapViewDirections from 'react-native-maps-directions';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
// import { Dropdown } from 'react-native-material-dropdown-v2';
// import DropdownMenu from 'react-native-dropdown-menu';
import DropdownAlert from 'react-native-dropdownalert';
// import { SearchBar } from 'react-native-elements';
import { addCustomerFavouriteplaceAction, getCustomerFavoriteAddressListAction } from '../Util/Action.js';

const { width, height } = Dimensions.get('window');
// const SCREEN_WIDTH = width;
// const SCREEN_HEIGHT = height;
const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.0;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

const GOOGLE_MAPS_APIKEY = (Platform.OS === 'ios') ? "AIzaSyDA8VzkYgIznevJNoGFt_HLxgM2cBRgQd8" : "AIzaSyD6VKrDOOeJgMKKwKpiYFhIA8Udd-7mdlU";

// const homePlace = {
//   description: 'Home',
//   geometry: { location: { lat: 48.8152937, lng: 2.4597668 } },
// };
// const workPlace = {
//   description: 'Work',
//   geometry: { location: { lat: 48.8496818, lng: 2.2940881 } },
// };
export default class ServicePlace extends Component {
    static navigationOptions = ({ navigation }) => {
        return {
            headerShown: false
        };
    };

    constructor(props) {
        super(props);
        this.state = {
            initialPosition: {
                latitude: 0,
                longitude: 0,
                latitudeDelta: 0.0,
                longitudeDelta: 0.0,
            },
            mapRegion: {
                latitude: 0,
                longitude: 0,
                latitudeDelta: 0.0,
                longitudeDelta: 0.0,
            },
            curruntLocation: {
                latitude: '',
                longitude: '',
                latitudeDelta: '',
                longitudeDelta: '',
            },
            startPosition: {
                latitude: 0,
                longitude: 0,
                latitudeDelta: 0.0,
                longitudeDelta: 0.0,
            },
            FavLocationB: 0,
            distance: '',
            LocationText: '',
            location_address: '',
            toLocationText: '',
            address: '',
            text: '',
            markers: [],
            destination: [],
            search: '',
            modalVisible: false,
            Address: '',
            latitude: '',
            longitude: '',
            enableCurruntLocation: true,
            favoriteAddressList: '',
            testing: '',
            latitude1: '',
            longitude1: '',
            fromLocationText: '',
            from_location_address: '',
        };
        this.mapRef = null;
        this.onPoiClick = this.onPoiClick.bind(this);

    }
    async onPoiClick(e) {

        const poi = e.nativeEvent;
        const place_id = poi.placeId;
        const formatted_address = poi.formatted_address;
        var location_address = this.state.LocationText;
        // var from_latitude = this.state.startPosition.latitude;
        // var from_longitude = this.state.startPosition.longitude;
        var from_latitude = this.state.initialPosition.latitude;
        var from_longitude = this.state.initialPosition.longitude;
        var tourAllocation = [];
        this.setState({
            markers: [],
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
        // alert(locations);
        tourAllocation.push(locations);
        this.setState({
            enableCurruntLocation: false,
            followsUserLocation: false,
            markers: tourAllocation,
            initialPosition: locations.coords,
            curruntLocation: locations.coords,
            mapRegion: locations.coords,

        });


        fetch("https://maps.googleapis.com/maps/api/place/details/json?place_id=" + place_id + "&key=AIzaSyD6VKrDOOeJgMKKwKpiYFhIA8Udd-7mdlU", {
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
                    LocationText: formatted_address
                })
                this.BPointref && this.BPointref.setAddressText(formatted_address)
            })
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

    toggleDrawer = ({ navigation }) => {
        this.props.navigation.toggleDrawer();
    };


    watchID: ?number = null
    async componentDidMount() {
        var { fromLocationText, from_location_address } = this.state;
        const { navigation } = this.props;

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
            from_latitude: 0,
            from_longitude: 0,
            LocationText: '',
        }); 

        Geocoder.init(GOOGLE_MAPS_APIKEY);
        if (lat && long) {
            await Geocoder.from(lat, long)
                .then(json => {
                    // const formatted_address = responseJson.result.formatted_address;

                    from_location_address = json.results[0]['formatted_address'];
                    this.setState({ fromLocationText: from_location_address });

                })

                .catch(error => console.warn(error));
        }

        this.setState({
            mapRegion: {
                latitude: lat,
                longitude: long,
                latitudeDelta: 0.09,
                longitudeDelta: 0.02,
            }
        })
        this.setState({
            curruntLocation: {
                latitude: lat,
                longitude: long,
                latitudeDelta: 0.09,
                longitudeDelta: 0.02
            }
        })
        console.log(this.state.fromLocationText);
        this.setState({ initialPosition: initialRegion })

        this.focusListener = navigation.addListener("didFocus", async() => {
            // this.setState({ loader:true });
            let location = await Location.getCurrentPositionAsync({});
            var lat = parseFloat(location.coords.latitude)
            var long = parseFloat(location.coords.longitude)

            Geocoder.init(GOOGLE_MAPS_APIKEY);
            if (lat && long) {
                await Geocoder.from(lat, long)
                .then(json => {
                    // const formatted_address = responseJson.result.formatted_address;

                    from_location_address = json.results[0]['formatted_address'];
                    this.setState({ fromLocationText: from_location_address });

                })

                .catch(error => console.warn(error));
            }
            this.BPointref && this.BPointref.setAddressText(this.state.fromLocationText)
            this.setState({
                from_latitude: 0,
                from_longitude: 0,
                LocationText: '',
            });

            this.setState({
                mapRegion: {
                    latitude: lat,
                    longitude: long,
                    latitudeDelta: 0.09,
                    longitudeDelta: 0.02,
                }
            })
            this.setState({
                curruntLocation: {
                    latitude: lat,
                    longitude: long,
                    latitudeDelta: 0.09,
                    longitudeDelta: 0.02
                }
            })
            this.setState({ initialPosition: initialRegion })
            this.setState({ loader:false });
        });
        
        
    
        //    this.watchID = navigator.Location.watchPosition((position) => {
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
        //    (error) => alert(JSON.stringify(error)),
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
            alert(responseJson.message);
            this.setState({ loader: false });
        }
    });


}


componentWillUnmount() {
    this.focusListener.remove();
    navigator.geolocation.clearWatch(this.watchID)
}

async reset() {
    this.setState({ loader: true, });
    this.setState({
        from_latitude: '',
        from_longitude: '',
    })
    this.setState({ loader: false, });
    // console.log(this.state.text)
}

updateSearch = (search) => {
    this.setState({ search });
};


pointMarkerBySearchB(data, details) {
    var addr_text = (details != '') ? details.formatted_address : '';
    var from_latitude = (details != '') ? details.geometry.location.lat : '';
    var from_longitude = (details != '') ? details.geometry.location.lng : '';

    if (from_latitude && from_longitude) {
        var pointB = [];
        this.setState({
            destination: [],
        });
        var locations = {};

        locations = { // The ID attached to the marker. It will be returned when onMarkerClicked is called
            coords: { latitude: from_latitude, longitude: from_longitude, latitudeDelta: 0.0922, longitudeDelta: 0.0421 }
        };

        pointB.push(locations);

        this.setState({
            destination: pointB,
            initialPosition: locations.coords,
            mapRegion: locations.coords,

        });
    }
    this.setState({ LocationText: addr_text });
}

// async saveCustomerLocation(){
//     const { method_name ,Address, address, latitude, longitude } = this.state;
//     var constraints = {
//         method_name: {
//             presence: {
//                 allowEmpty: false,
//                 message: "^ Place name required"
//             },
//             format: {
//                 pattern: "[A-Za-z ]+",
//                 flags: "i",
//                 message: "^ only characters"
//             }
//         },
//         Address: {
//             presence: {
//                 allowEmpty: false,
//                 message: "^ Address required"
//             },
//         }
//     };
//     Keyboard.dismiss();

//     const result = validate({  method_name: this.state.method_name, Address: this.state.Address }, constraints);

//     if(result)
//     {
//         if (result.method_name) {
//             // Alert.alert("Name");
//             this.refs.defaultToastBottomWithDifferentColor.ShowToastFunction(result.method_name);
// 			return false;
//         }
//         if (result.Address) {
//             this.refs.defaultToastBottomWithDifferentColor.ShowToastFunction(result.Address);
// 			return false;
//         }

//     }

//     if(!result) {
//         let customer_id = await AsyncStorage.getItem('userid');
//         var location = {
//                 user_id: customer_id,
//                 title: this.state.method_name,
//                 address: this.state.Address,
//                 latitude: this.state.latitude,
//                 longitude: this.state.longitude,
//         }
//         let Token = await AsyncStorage.getItem('token');
// 		Token = 'Bearer ' + Token;  
//         this.setState({ loading: true });
//         var response = addCustomerFavouriteplaceAction(location,Token).then(function (responseJson) {
//             if (responseJson.isError == false) {
// 				this.refs.defaultToastBottomWithDifferentColor.ShowToastFunction(responseJson.message);
// 				this.getCustomerFavoriteAddressList();

//             } else {
//                 this.setState({ loading: false });
//                 this.refs.defaultToastBottomWithDifferentColor.ShowToastFunction(responseJson.message);
//             }
//         }.bind(this));
//     }
// };

async finalizaLocation() {
    const { navigate } = this.props.navigation;

    var from_latitude = this.state.initialPosition.latitude;
    var from_longitude = this.state.initialPosition.longitude;
    var location_address = this.state.LocationText;

    Geocoder.init(GOOGLE_MAPS_APIKEY);

    if (this.state.LocationText == '') {
        if (this.state.initialPosition.latitude && this.state.initialPosition.longitude) {
            await Geocoder.from(this.state.initialPosition.latitude, this.state.initialPosition.longitude)
                .then(json => {
                    location_address = json.results[0]['formatted_address'];
                })
                .catch(error => console.warn(error));
        }
    }


    // var constraints = {
    //     from_latitude: {
    //         presence: {
    //             allowEmpty: false,
    //             message: "^ Please select destination"
    //         }
    //     },
    // 	from_longitude: {
    //         presence: {
    //             allowEmpty: false,
    //             message: "^ Please select destination"
    //         }
    //     },

    //     location_address: {
    //         presence: {
    //             allowEmpty: false,
    //             message: "^ Please select destination"
    //         },
    //     }
    // };

    // const result = validate({  from_latitude: this.state.initialPosition.latitude, from_longitude: this.state.initialPosition.longitude,  location_address: this.state.LocationText}, constraints);

    // if(result)
    // {
    //     if (result.from_latitude) {
    //         // this.refs.defaultToastBottomWithDifferentColor.ShowToastFunction(result.to_latitude);
    // 		this.dropdown.alertWithType('error', 'Error', result.from_latitude);
    //         return false;
    //     }

    //     if (result.from_longitude) {
    //         // this.refs.defaultToastBottomWithDifferentColor.ShowToastFunction(result.to_longitude);
    // 		this.dropdown.alertWithType('error', 'Error', result.from_longitude);
    //         return false;
    //     }



    // 	if (result.location_address) {
    //         // this.refs.defaultToastBottomWithDifferentColor.ShowToastFunction(result.location_address);
    //         this.dropdown.alertWithType('error', 'Error', result.location_address);
    //         return false;
    //     }
    // }
    // if(!result) {
    var data = {
        from_latitude: this.state.initialPosition.latitude,
        from_longitude: this.state.initialPosition.longitude,

        LocationText: location_address,
    }
    // console.log(data)
    navigate('ServiceDetails', { data });
    // }
};


async onMapClicked(coordinate) {
    // var location_address = this.state.LocationText;
    var ll = parseFloat(coordinate.latitude);
    var lnn = parseFloat(coordinate.longitude);
    if (ll && lnn) {
        if (!this.state.startPosition.latitude) {
            var tourAllocation = [];
            this.setState({
                markers: [],
            });
            var locations = [];

            locations = {
                id: Math.round(Math.random() * 9), // The ID attached to the marker. It will be returned when onMarkerClicked is called
                coords: { latitude: ll, longitude: lnn, latitudeDelta: 0.0922, longitudeDelta: 0.0421 }, // Latitude and Longitude of the marker // HTML element that will be displayed as the marker.  It can also be text or an SVG string.

            };
            tourAllocation.push(locations);
            this.setState({
                enableCurruntLocation: false,
                followsUserLocation: false,
                markers: tourAllocation,
                initialPosition: locations.coords,
                curruntLocation: locations.coords,
                mapRegion: locations.coords,
            });
            Geocoder.init(GOOGLE_MAPS_APIKEY);


            if (ll && lnn) {
                await Geocoder.from(ll, lnn)
                    .then(json => {
                        // const formatted_address = responseJson.result.formatted_address;

                        var location_address = json.results[0]['formatted_address'];
                        this.setState({ LocationText: location_address });

                    })
                    .catch(error => console.warn(error));
            }


            // mapRef.current.animateToRegion({
            //     ll,
            //     lnn,
            //     latitudeDelta: 0.1,
            //     longitudeDelta: 0.1
            //   })
            this.BPointref && this.BPointref.setAddressText(this.state.LocationText)

        }
    }

};

// onChangeCustomerLocationPointB(value){
// 	var LatLong = value.split('-');

// 	var lat = parseFloat(LatLong[0]);
// 	var lon = parseFloat(LatLong[1]);
// 	if(lat && lon){
//         var locations = {};
//         var tourAllocation = [];
// 	    locations = { // The ID attached to the marker. It will be returned when onMarkerClicked is called
// 				coords: {latitude : lat, longitude : lon, latitudeDelta: 0.0922, longitudeDelta: 0.0421}
// 			};
//         tourAllocation.push(locations);
// 		this.setState({
//             markers:tourAllocation, 
// 		    initialPosition:locations.coords,
// 		    mapRegion: locations.coords,

// 		});
// 	}

// 	this.state.favoriteAddressList.map((item, index) => {
// 		if(value == item.value)
// 		{
// 			this.setState({ LocationText: item.label});
// 		}
// 	});
// }

// pointMarkerBySearch(data, details){
// 	var addr_text = (details != '')?details.formatted_address:'';
// 	var from_latitude = (details != '')?details.geometry.location.lat:'';
// 	var from_longitude = (details != '')?details.geometry.location.lng:'';

// 	if(from_latitude && from_longitude){
// 		var tourAllocation = []; 
// 		this.setState({
// 			markers:[],
// 		});
// 	    var locations = {};

// 	    locations = { // The ID attached to the marker. It will be returned when onMarkerClicked is called
// 				coords: {latitude : from_latitude, longitude : from_longitude, latitudeDelta: 0.0922, longitudeDelta: 0.0421}
// 			};

// 		tourAllocation.push(locations);

// 		this.setState({
//             enableCurruntLocation: false,
//             followsUserLocation : false,
//             markers:tourAllocation,
//             initialPosition:locations.coords,
// 		    curruntLocation:locations.coords,
// 		});
// 	}
// 	this.setState({ LocationText : addr_text });
// }

setModalVisible = (visible) => {

    this.setState({ modalVisible: visible });
}


_onBlurr = () => {
    BackHandler.removeEventListener('hardwareBackPress',
        this._handleBackButtonClick);
}

_onFocus = () => {
    BackHandler.addEventListener('hardwareBackPress',
        this._handleBackButtonClick);
}

_handleBackButtonClick = () => this.props.navigation.navigate('MarketPlace');

UpdateRatingB() {

    if (this.state.FavLocationB == 0) {
        this.setState({ FavLocationB: 1, });
    } else {
        this.setState({ FavLocationB: 0, });
    }
    // console.log(this.state.review)
    //Keeping the Rating Selected in state
}

render() {
    const { navigate } = this.props.navigation;
    const { search, loader } = this.state;
    let myCoordinate = this.state.mapRegion;
    const { modalVisible, LocationText } = this.state;

    let React_Native_Rating_Bar_B = [];
    let React_Native_Get_Rating_Bar_B = [];

    React_Native_Rating_Bar_B.push(
        <TouchableOpacity style={{ alignItems: 'center' }}
            activeOpacity={1.7}
            key='b'
            onPress={this.UpdateRatingB.bind(this)}>
            <Image
                style={styles.StarImage}
                source={(
                    // i <= dataSource.handyman_rating
                    // i <= this.state.review
                    this.state.FavLocationB
                        ? (require('../../images/heart-red.png'))
                        : (require('../../images/heart-gray.png'))
                )}
            />
        </TouchableOpacity>
    );

    const favoriteAddressData = [];
    for (let userObject1 of this.state.favoriteAddressList) {
        favoriteAddressData.push({ label: userObject1.label, value: userObject1.value });
    }
    if (!loader) {
        if (this.state.curruntLocation.latitude) {
            return (
                <View style={styles.container} >
                    <NavigationEvents
                        onWillFocus={this._onFocus}
                        onWillBlur={this._onBlurr}
                    />
                    <MapView style={styles.mapStyle}
                        provider={this.props.provider}
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
                        onPress={(e) => this.onMapClicked(e.nativeEvent.coordinate)}>
                        <Marker
                            key='B'
                            coordinate={{
                                latitude: this.state.initialPosition.latitude,
                                longitude: this.state.initialPosition.longitude,
                            }}>
                            <Image source={require('../../../src/images/Location-B.png')} style={{ width: 48, height: 48 }} />
                        </Marker>
                    </MapView>
                    <Row style={styles.Navebar} >
                        <Col style={styles.NaveBackArrowCol}>
                            <TouchableOpacity onPress={() => navigate('MarketPlace')}>
                                <Image source={require('../../images/Back-Arrow.png')} style={styles.BackArrow} />
                            </TouchableOpacity>
                        </Col>
                        <Col style={styles.NaveTitleCol}>
                            <Text style={{ fontFamily: "Inter-Black", fontSize: 18 }}>{t('Where will the service be?')}</Text>
                        </Col>
                        <Col style={styles.MenuCol}>
                            <TouchableOpacity onPress={this.toggleDrawer.bind(this)}>
                                <Image source={require('../../images/Menu.png')} style={styles.Menu} />
                            </TouchableOpacity>
                        </Col>
                    </Row>

                    <View style={{ position: 'absolute', width: '90%', }}>
                        <Col style={{ marginLeft: normalize(30), marginRight: normalize(30) }}>
                            <Row style={styles.LocationB}>
                                <Col style={{ width: 30, paddingLeft: 4 }}>
                                    <Image source={require('../../images/Location-B.png')} style={styles.Listlogo} />
                                </Col>
                                <Col>

                                    <GooglePlacesAutocomplete
                                        ref={ref => { this.BPointref = ref }}
                                        // placeholder={t('Where will the service be?')}
                                        placeholder={this.state.fromLocationText}
                                        placeholderTextColor={"#000"}
                                        query={{
                                            key: GOOGLE_MAPS_APIKEY,
                                            // language: 'en', // language of the results
                                            // components: 'country:in',

                                            // for panama    
                                            language: 'es', // language of the results
                                            components: 'country:pa',
                                        }}
                                        onPress={(data, details = null) => { this.pointMarkerBySearchB(data, details) }}
                                        onFail={error => console.error(error)}
                                        minLength={2}
                                        autoFocus={false}
                                        numberOfLines={2}
                                        listViewDisplayed="auto"
                                        returnKeyType={'default'}
                                        fetchDetails={true}
                                        showsUserLocation={true}
                                        nearbyPlacesAPI={GOOGLE_MAPS_APIKEY}
                                        enablePoweredByContainer={false}
                                        setAddressText={this.state.LocationText}
                                        // onChangeText={(LocationText) => this.setState({ LocationText })}

                                        styles={{
                                            ...Platform.select({
                                                ios: {
                                                    container: {
                                                        backgroundColor: 'transparent',
                                                        // top: 50,
                                                        width: '90%',
                                                    },
                                                    textInputContainer: {
                                                        backgroundColor: 'rgba(0,0,0,0)',
                                                        borderTopWidth: 0,
                                                        borderBottomWidth: 0,
                                                        // width: '90%',


                                                    },
                                                    textInput: {
                                                        marginLeft: 0,
                                                        marginRight: 0,
                                                        // height: 30,
                                                        color: '#5d5d5d',
                                                        fontSize: 16,
                                                        padding: 10,
                                                        fontFamily: "Inter-Black",

                                                    },
                                                    description: {
                                                        fontFamily: "Inter-Black",
                                                        color: "#404043"
                                                    },
                                                },
                                                android: {
                                                    container: {
                                                        backgroundColor: '#ffffff',
                                                        // top: 50,
                                                        // width: '90%',


                                                    },
                                                    textInputContainer: {
                                                        backgroundColor: 'rgba(0,0,0,0)',
                                                        borderTopWidth: 0,
                                                        borderBottomWidth: 0,
                                                        // width: '90%',

                                                    },
                                                    textInput: {
                                                        marginLeft: 0,
                                                        marginRight: 0,
                                                        // height: 30,
                                                        color: '#5d5d5d',
                                                        fontSize: 16,
                                                        // padding: 10,
                                                        fontFamily: "Inter-Black",
                                                        numberOfLines: 5


                                                    },
                                                    description: {
                                                        fontFamily: "Inter-Black",
                                                        color: "#404043"
                                                    },
                                                }
                                            })

                                        }}
                                    />

                                </Col>
                                <Col style={styles.ArrowCol}>
                                    <Image source={require('../../images/Right_Arrow_New.png')} style={styles.StarImage} />
                                </Col>
                            </Row>
                        </Col>
                    </View>

                    <Row style={styles.Accept}>
                        <TouchableOpacity style={styles.Login} onPress={this.finalizaLocation.bind(this)} onLongPress={this.finalizaLocation.bind(this)}>
                            <Text style={{ color: '#fff', fontSize: 20, width: "90%", textAlign: "center", fontFamily: 'Inter-Black' }} >{t('Confirm location')}</Text>
                        </TouchableOpacity>
                    </Row>
                    <DropdownAlert ref={ref => this.dropdown = ref} />
                </View>
            );
        } else {
            return (
                // <ActivityIndicator
                //     style={styles.loading}
                //     size="large"
                //     color="#d62326"
                // />


                <View style={styles.container} >
                    <NavigationEvents
                        onWillFocus={this._onFocus}
                        onWillBlur={this._onBlurr}
                    />
                    <Row style={styles.Navebar} >
                        <Col style={styles.NaveBackArrowCol}>
                            <TouchableOpacity onPress={() => navigate('Selection')} >
                                <Image source={require('../../images/Back-Arrow.png')} style={styles.BackArrow} />
                            </TouchableOpacity>
                        </Col>
                        <Col style={styles.NaveTitleCol}>
                            <Text style={{ fontFamily: "Inter-Black", fontSize: 18 }}>{t('Where will the service be?')}</Text>
                        </Col>
                        <Col style={styles.MenuCol}>
                            <TouchableOpacity onPress={this.toggleDrawer.bind(this)}>
                                <Image source={require('../../images/Menu.png')} style={styles.Menu} />
                            </TouchableOpacity>
                        </Col>
                    </Row>

                    <ImageBackground
                        source={require('../../images/map.gif')}
                        style={{ flex: 1 }} >

                    </ImageBackground>



                </View>
            );
        }
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
ServicePlace.propTypes = {
    provider: ProviderPropType,
};
const styles = StyleSheet.create({
    loading: {
        position: "absolute",
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        alignItems: "center",
        justifyContent: "center",
    },
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
    // Navebar: {
    //     ...Platform.select ({
    //         ios:{ 
    //             marginTop:"12%",
    //             zIndex: 9999,
    //             // position: 'absolute',
    //             borderBottomRightRadius: normalize(20),
    //         },
    //         android:{

    //             // flex:1,
    //             // height: 50 , 
    //             // marginTop:15,
    //             // paddingBottom: 50, 
    //             zIndex: 9999,
    //             // position: 'absolute',
    //             height: normalize(70),
    //             backgroundColor: '#efefef',
    //             borderBottomRightRadius: normalize(20),

    //         }})

    // },
    Navebar2: {
        ...Platform.select({
            ios: {
                // height: 1 , 
                // paddingBottom: 50, 
                marginTop: 30,

            },
            android: {

                // flex:1,
                height: 50,
                marginTop: 10,
                // paddingBottom: 50, 


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
                // justifyContent: 'center', 
                // alignItems: 'center',
                // marginLeft: 10,
                // marginTop: 10,
            }
        })
    },
    Menu: {
        ...Platform.select({
            ios: {
                width: 25,
                height: 25,
                // justifyContent: 'center', 
                // alignItems: 'center',
                // marginRight: 10,                
            },
            android: {
                width: 25,
                height: 25,
                // justifyContent: 'center', 
                // alignItems: 'center',
                // marginRight: 10,
                // marginTop: 10,

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
        zIndex: 9999, position: 'absolute', marginTop: '120%', height: 70, marginLeft: 20, marginRight: 20, backgroundColor: '#fff', width: '90%'
    },
    Dropdown: {
        marginTop: '140%',
        height: 90,
        marginLeft: 20, marginRight: 20,
        backgroundColor: '#fff',
        // borderWidth:1, 
        width: '90%',
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
            ios: {
                justifyContent: 'center',
                alignItems: 'center',
                // textAlign: 'center',
                paddingTop: 10,
                paddingLeft: 20,
                borderStyle: 'dashed',
                // borderRadius: 40,
                // borderWidth: 2,
                fontSize: 20,
                width: 288,
                height: 40,
                borderColor: 'grey',
                // backgroundColor:'#e9e7e6',
                marginBottom: 10,
                color: '#000',
            },
            android: {
                justifyContent: 'center',
                // paddingLeft: 40,
                paddingTop: 10,
                // alignItems: 'center',
                borderStyle: 'dashed',
                // borderRadius: 40,
                fontSize: 20,
                // borderWidth: 2,
                width: 288,
                height: 40,
                // borderColor: 'grey',
                // backgroundColor:'#e9e7e6',
                marginBottom: 10,
                color: '#000',
                marginLeft: 20,
                marginRight: 20,


            }
        }),

    },
    Listlogo: {
        ...Platform.select({
            ios: {
                marginTop: 10,
                width: 50,
                height: 50,
            },
            android: {
                marginTop: 10,
                width: 50,
                height: 50,
            }
        })
    },
    star: {
        ...Platform.select({
            ios: {
                width: 16,
                height: 16,
            },
            android: {
                width: 12,
                height: 12,
            },
        })
    },
    Pluse: {
        ...Platform.select({
            ios: {
                width: 35,
                height: 35,
                marginTop: 10,
                marginBottom: 10,
            },
            android: {
                width: 30,
                height: 30,
                marginTop: 10,
                marginBottom: 10,
            },
        })
    },
    Add: {
        ...Platform.select({
            ios: {
                marginBottom: 20, height: 20, fontSize: 15, marginTop: 15
            },
            android: {
                marginBottom: 10, height: 40, fontSize: 15,
            },
        })
    },
    Accept: {
        ...Platform.select({
            ios: {
                // flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                position: 'absolute',
                width: '100%',
                bottom: 10
            },
            android: {
                justifyContent: 'center',
                alignItems: 'center',
                position: 'absolute',
                bottom: 10,
                width: '100%'
            }
        })

    },
    Login: {
        // marginTop: 20,
        alignItems: 'center',
        justifyContent: 'center',
        // width: normalize(280),
        // marginLeft: 20,
        // marginRight:20,
        height: 55,
        borderRadius: 40,
        backgroundColor: '#c2272d',
        color: '#fff',
        width: "80%"

    },
    Location: {
        ...Platform.select({
            ios: {
                position: 'absolute',
                width: '90%',
                marginTop: '130%',
                marginLeft: 20,
                backgroundColor: '#fff',
            },
            android: {

                position: 'absolute',
                width: '90%',
                height: '12%',
                // marginTop: '115%', 
                bottom: '10%',
                marginLeft: 20,
                // marginRight: 20, 
                backgroundColor: '#fff',
            }
        })
    },

    centeredView: {
        position: 'absolute',
        backgroundColor: '#FFFFFF',
        //height : '63%',
        borderRadius: 9,
        shadowColor: "#777",
        shadowOffset: { width: 0, height: 1, },
        shadowOpacity: 0.5,
        shadowRadius: 6.22,
        elevation: 5,
        width: Dimensions.get('window').width,
        // height: Dimensions.get('window').height,
    },
    modalView: {
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
    openButton: {

        // borderRadius: 20,
        // elevation: 2
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
    FavCol: {
        width: 25,
        alignItems: 'flex-end',
    },
    ArrowCol: {
        width: 25,
        alignItems: 'flex-end',
        marginRight: 10,

    },
    Listlogo: {
        width: 25,
        height: 25,
        marginTop: 10
    },
    StarImage: {
        width: 17,
        height: 17,
        resizeMode: 'cover',
        marginTop: 12
    },
    LocationB: {
        ...Platform.select({
            ios: {
                position: 'absolute',
                marginTop: normalize(90),
                borderRadius: 20,
                backgroundColor: '#fff',
                elevation: 20,
                width: normalize(325),

            },
            android: {

                position: 'absolute',
                marginTop: normalize(70),
                borderRadius: 20,
                backgroundColor: '#fff',
                elevation: 20,
                // height: normalize(45),
                width: normalize(325),
            }
        })
    },
    Navebar: {
        ...Platform.select({
            ios: {
                // height: 1 , 
                paddingBottom: 10,
                // marginTop: "12%",
                paddingTop: "12%",

                // zIndex: 9999,
                // position: 'absolute',

                height: 80,
                backgroundColor: '#efefef'
            },
            android: {

                // flex:1,
                height: normalize(55),
                // borderRadius: 20,
                borderBottomRightRadius: 25,
                borderBottomLeftRadius: 25,
                // marginTop:15,
                // paddingBottom: 50, 
                // zIndex: 9999,
                // position: 'absolute',
                backgroundColor: '#efefef',

            }
        })

    },
    NaveBackArrowCol: {
        ...Platform.select({
            ios: {
                borderRightWidth: 2, width: '15%', justifyContent: 'center', borderColor: '#CCCCCC'
            },
            android: {

                borderRightWidth: 2, width: '15%', justifyContent: 'center', alignItems: 'center', marginTop: 8, marginBottom: 8, borderColor: '#CCCCCC'

            }
        })

    },
    NaveTitleCol: {
        ...Platform.select({
            ios: {
                justifyContent: 'center', marginLeft: 10
            },
            android: {

                justifyContent: 'center', marginLeft: 10

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
                // marginTop: 10,
            },
            android: {
                width: 25,
                height: 25,
                justifyContent: 'center',
                alignItems: 'center',
                // marginLeft: 10,
                // marginTop: 2,
            }
        })
    },
    MenuCol: {
        ...Platform.select({
            ios: {
                width: "10%",
                // marginTop: 10
                justifyContent: 'center',
            },
            android: {
                justifyContent: 'center',
                alignItems: 'center',
                width: "15%",
            }
        })

    },

    Menu: {
        ...Platform.select({
            ios: {
                width: 25,
                height: 25,
                // marginRight: 10,
                alignItems: 'flex-end',
            },
            android: {
                width: 25,
                height: 25,
                marginRight: 10,
                alignItems: 'flex-end',
            }
        })
    },
});