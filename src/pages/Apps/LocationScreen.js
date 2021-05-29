import React, { Component, useState } from 'react';
import {
    BackHandler,
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
    ScrollView,
    ActivityIndicator,
    ImageBackground,
    Platform,
    SafeAreaView
} from 'react-native';
import { NavigationEvents, withNavigation } from 'react-navigation';
import DropdownAlert from 'react-native-dropdownalert';

import { Col, Row, Grid } from "react-native-easy-grid";
import { t } from '../../../locals';
import MapView, { Marker, Polyline, Callout, PROVIDER_GOOGLE, ProviderPropType, AnimatedRegion } from 'react-native-maps';
import * as Location from "expo-location";
import * as Permissions from "expo-permissions";
import Geocoder from 'react-native-geocoding';
import validate from 'validate.js';
import MapViewDirections from 'react-native-maps-directions';
import CustomToast from './Toast.js';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { addCustomerFavouriteplaceAction, getCustomerFavoriteAddressListAction } from '../Util/Action.js';
import normalize from 'react-native-normalize';

const { width, height } = Dimensions.get('window');
const SCREEN_WIDTH = width;
const SCREEN_HEIGHT = height;
const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

const GOOGLE_MAPS_APIKEY = (Platform.OS === 'ios') ? "AIzaSyDA8VzkYgIznevJNoGFt_HLxgM2cBRgQd8" : "AIzaSyD6VKrDOOeJgMKKwKpiYFhIA8Udd-7mdlU";
const Country = ['pa', 'us']

class LocationScreen extends Component {

    static navigationOptions = ({ navigation }) => {
        return {
            headerShown: false
        };
    };

    constructor(props) {
        super(props);
        this.state = {
            review: 0,
            FavLocationA: 0,
            FavLocationB: 0,
            FavLocationC: 0,

            BPointHide: true,

            mapRegion: {
                latitude: 0,
                longitude: 0,
                latitudeDelta: 0.0,
                longitudeDelta: 0.0,
            },
            curruntLocation: {
                latitude: '',
                longitude: '',
                latitudeDelta: 0,
                longitudeDelta: 0,
            },
            startPosition: {
                latitude: 0,
                longitude: 0,
                latitudeDelta: 0.0,
                longitudeDelta: 0.0,
            },
            additionalPosition: {
                latitude: 0,
                longitude: 0,
                latitudeDelta: 0.0,
                longitudeDelta: 0.0,
            },
            distance: '',
            fromLocationText: '',
            toLocationText: '',
            additionalLocationText: '',
            address: '',
            text: '',
            markers: [],
            destination: [],
            showpointC: [],
            addlocationC: 0,
            search: '',
            modalVisible: false,
            Address: '',
            latitude: '',
            longitude: '',
            // favoriteAddressList: '',
            testing: '',
            latitude1: '',
            longitude1: '',
            loader: false,
            enableCurruntLocation: true,
            followsUserLocation: true,

            from_location_address: '',
            to_location_address: '',
            additional_location_address: '',
            to_latitude: 0,
            to_longitude: 0,
            from_latitude: 0,
            from_longitude: 0,
            additional_latitude: 0,
            additional_longitude: 0,


        };
        this.mapRef = null;
        this.onPoiClick = this.onPoiClick.bind(this);

    }
    showAddLocationCTextbox() {
        // this.updateFund();
        if (this.state.addlocationC == 0) {
            this.setState({ addlocationC: 1 });
        } else {
            this.setState({ addlocationC: 0 });
        }
    }
    async onPoiClick(e) {

        const poi = e.nativeEvent;
        const place_id = poi.placeId;
        var additional_location_address = this.state.additionalLocationText;


        if (!this.state.startPosition.latitude) {

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
            tourAllocation.push(locations);
            this.setState({
                enableCurruntLocation: false,
                followsUserLocation: false,
                markers: tourAllocation,
                startPosition: locations.coords,
                curruntLocation: locations.coords,
            });
            // fetch("https://maps.googleapis.com/maps/api/place/details/json?place_id=" + place_id + "&key=AIzaSyCrhCKosfVZZb17Tn7snqF3aNLUXgtyT0Y", {
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
                        fromLocationText: formatted_address
                    })
                    this.APointref && this.APointref.setAddressText(formatted_address)

                })
                .catch((error) => {
                    console.log(error);
                })


        }
        else if (this.state.startPosition.latitude != 0 && this.state.addlocationC == 0) {
            var tourAllocation = [];
            this.setState({
                destination: [],
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
                destination: tourAllocation,
                mapRegion: locations.coords,
            });
            // fetch("https://maps.googleapis.com/maps/api/place/details/json?place_id=" + place_id + "&key=AIzaSyCrhCKosfVZZb17Tn7snqF3aNLUXgtyT0Y", {
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
                        toLocationText: formatted_address
                    })
                    this.BPointref && this.BPointref.setAddressText(formatted_address)

                })
                .catch((error) => {
                    console.log(error);
                })
        }
        else if (this.state.startPosition.latitude != 0 && this.state.mapRegion.latitude != 0 && this.state.addlocationC == 1) {
            var tourAllocation = [];
            this.setState({
                showpointC: [],
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
                showpointC: tourAllocation,
                additionalPosition: locations.coords,
            });
            // fetch("https://maps.googleapis.com/maps/api/place/details/json?place_id=" + place_id + "&key=AIzaSyCrhCKosfVZZb17Tn7snqF3aNLUXgtyT0Y", {
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
                        additionalLocationText: formatted_address
                    })
                    this.CPointref && this.CPointref.setAddressText(formatted_address)

                })
                .catch((error) => {
                    console.log(error);
                })
            this.CPointref && this.CPointref.setAddressText(additional_location_address)
        }
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

    onMarkerDragEnd = (coord, key) => {
        const latLng = coord;
        if (key == 'A') {
            this.setState({ startPosition: coord });
        } else if (key == 'B') {
            this.setState({ mapRegion: coord });
            // this.setState({ initialPosition: coord });
        } else {
            this.setState({ additionalPosition: coord });
        }

    };
    // watchID: ?number = null
    async componentDidMount() {
        // BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
        const { navigation } = this.props;
        // this.setState({ loader: true, });
               
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
            from_location_address: '',
            to_location_address: '',
            additional_location_address: '',
            distance: '',
            to_latitude: 0,
            to_longitude: 0,
            from_latitude: 0,
            from_longitude: 0,
            additional_latitude: 0,
            additional_longitude: 0,
            FavLocationA: 0,
            FavLocationB: 0,
            FavLocationC: 0,

        });

        this.setState({
            curruntLocation: {
                latitude: lat,
                longitude: long,
                latitudeDelta: 0.09,
                longitudeDelta: 0.02
            }
        })
        this.setState({ initialPosition: initialRegion })
        
        this.focusListener = navigation.addListener("didFocus", () => {
            
            var emptyData = {
                latitude: 0,
                longitude: 0,
                latitudeDelta: 0.0,
                longitudeDelta: 0.0,
            }

            this.setState({
                from_location_address: '',
                to_location_address: '',
                additional_location_address: '',
                distance: '',
                to_latitude: 0,
                to_longitude: 0,
                from_latitude: 0,
                from_longitude: 0,
                additional_latitude: 0,
                additional_longitude: 0,
                FavLocationA: 0,
                FavLocationB: 0,
                FavLocationC: 0,
                markers: [],
                fromLocationText:'',
                destination : [],
                toLocationText : '',
                additionalPosition : emptyData,
                addlocationC: 0,
                additionalLocationText : '',
                mapRegion : emptyData,
                startPosition : emptyData,
                enableCurruntLocation : true,
                followUserLocation : true
            });
            this.APointref && this.APointref.setAddressText('')

            this.BPointref && this.BPointref.setAddressText('')

            this.CPointref && this.CPointref.setAddressText('')

            this.setState({
                curruntLocation: {
                    latitude: lat,
                    longitude: long,
                    latitudeDelta: 0.09,
                    longitudeDelta: 0.02
                }
            })
        });
        // this.setState({ loader: false, });
    }

    async componentWillUnmount() {
        // this.focusListener.remove();
        // BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);

        // this.focusListener.remove();
        navigator.geolocation.clearWatch(this.watchID)
    }

    updateSearch = (search) => {
        this.setState({ search });
    };

    // async saveCustomerLocation() {
    //     const { method_name, Address, address, latitude, longitude } = this.state;
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

    //     const result = validate({ method_name: this.state.method_name, Address: this.state.Address }, constraints);

    //     if (result) {
    //         if (result.method_name) {
    //             // Alert.alert("Name");
    //             this.refs.defaultToastBottomWithDifferentColor.ShowToastFunction(result.method_name);
    //             return false;
    //         }
    //         if (result.Address) {
    //             this.refs.defaultToastBottomWithDifferentColor.ShowToastFunction(result.Address);
    //             return false;
    //         }

    //     }

    //     if (!result) {
    //         let customer_id = await AsyncStorage.getItem('userid');
    //         var location = {
    //             user_id: customer_id,
    //             title: this.state.method_name,
    //             address: this.state.Address,
    //             latitude: this.state.latitude,
    //             longitude: this.state.longitude,
    //         }
    //         let Token = await AsyncStorage.getItem('token');
    //         Token = 'Bearer ' + Token;
    //         this.setState({ loading: true });
    //         var response = addCustomerFavouriteplaceAction(location, Token).then(function (responseJson) {

    //             if (responseJson.isError == false) {
    //                 this.refs.defaultToastBottomWithDifferentColor.ShowToastFunction(responseJson.message);
    //                 // this.getCustomerFavoriteAddressList();
    //                 this.setState({ modalVisible: false });
    //             } else {
    //                 this.setState({ loading: false });
    //                 this.refs.defaultToastBottomWithDifferentColor.ShowToastFunction(responseJson.message);
    //             }
    //         }.bind(this));
    //     }
    // };

    async finalizaLocation() {
        const { navigate } = this.props.navigation;

        var from_latitude = this.state.startPosition.latitude;
        var from_longitude = this.state.startPosition.longitude;

        var to_latitude = this.state.mapRegion.latitude;
        var to_longitude = this.state.mapRegion.longitude;

        var additional_latitude = this.state.additionalPosition.latitude;
        var additional_longitude = this.state.additionalPosition.longitude;

        var distance = this.state.distance;

        var from_location_address = this.state.fromLocationText;

        var to_location_address = this.state.toLocationText;

        var additional_location_address = this.state.additionalLocationText;



        if (this.state.fromLocationText == '') {
            if (this.state.startPosition.latitude && this.state.startPosition.longitude) {
                await Geocoder.from(this.state.startPosition.latitude, this.state.startPosition.longitude)
                    .then(json => {
                        from_location_address = json.results[0]['formatted_address'];
                        // console.log(from_location_address)
                    })
                    .catch(error => console.warn(error));
            }
        }

        if (this.state.toLocationText == '') {
            if (this.state.mapRegion.latitude && this.state.mapRegion.longitude) {
                await Geocoder.from(this.state.mapRegion.latitude, this.state.mapRegion.longitude)
                    .then(json => {
                        to_location_address = json.results[0]['formatted_address'];
                    })
                    .catch(error => console.warn(error));
            }
        }

        if (this.state.additionalLocationText == '') {
            if (this.state.additionalPosition.latitude && this.state.additionalPosition.longitude) {
                await Geocoder.from(this.state.additionalPosition.latitude, this.state.additionalPosition.longitude)
                    .then(json => {
                        additional_location_address = json.results[0]['formatted_address'];
                    })
                    .catch(error => console.warn(error));
            }
        }

        var constraints = {
            to_latitude: {
                presence: {
                    allowEmpty: false,
                    message:  "^ "+t("Please select destination")
                }
            },
            to_longitude: {
                presence: {
                    allowEmpty: false,
                    message: "^ "+t("Please select destination")
                }
            },
            from_latitude: {
                presence: {
                    allowEmpty: false,
                    message: "^ "+t("Please select from location")
                }
            },
            from_longitude: {
                presence: {
                    allowEmpty: false,
                    message: "^ "+t("Please select from location")
                }
            },
            additional_latitude: {
                presence: {
                    allowEmpty: false,
                    message: "^ "+t("Please select from location")
                }
            },
            additional_longitude: {
                presence: {
                    allowEmpty: false,
                    message: "^ "+t("Please select from location")
                }
            },

            distance: {
                presence: {
                    allowEmpty: false,
                    message: "^ "+t("Please select start point")
                },
            },
            from_location_address: {
                presence: {
                    allowEmpty: false,
                    message: "^ "+t("Please select from location")
                },
            },
            to_location_address: {
                presence: {
                    allowEmpty: false,
                    message: "^ "+t("Please select destination")
                },
            },
        };

        const result = validate({ to_latitude: to_latitude, to_longitude: to_longitude, from_latitude: from_latitude, from_longitude: from_longitude, additional_latitude: additional_latitude, additional_longitude: additional_longitude, from_location_address: from_location_address, to_location_address: to_location_address, distance: distance }, constraints);

        if (result) {
            if (result.to_latitude) {
                // this.refs.defaultToastBottomWithDifferentColor.ShowToastFunction(result.to_latitude);
                this.dropdown.alertWithType('error', 'Error', result.to_latitude);
                return false;
            }

            if (result.to_longitude) {
                // this.refs.defaultToastBottomWithDifferentColor.ShowToastFunction(result.to_longitude);
                this.dropdown.alertWithType('error', 'Error', result.to_longitude);
                return false;
            }

            if (result.from_latitude) {
                // this.refs.defaultToastBottomWithDifferentColor.ShowToastFunction(result.from_latitude);
                this.dropdown.alertWithType('error', 'Error', result.from_latitude);
                return false;
            }

            if (result.from_longitude) {
                // this.refs.defaultToastBottomWithDifferentColor.ShowToastFunction(result.from_longitude);
                this.dropdown.alertWithType('error', 'Error', result.from_longitude);

                return false;
            }

            if (result.distance) {
                // this.refs.defaultToastBottomWithDifferentColor.ShowToastFunction(result.distance);
                this.dropdown.alertWithType('error', 'Error', result.distance);
                return false;
            }

            if (result.from_location_address) {
                // this.refs.defaultToastBottomWithDifferentColor.ShowToastFunction(result.from_location_address);
                this.dropdown.alertWithType('error', 'Error', result.from_location_address);
                return false;
            }

            if (result.to_location_address) {
                // this.refs.defaultToastBottomWithDifferentColor.ShowToastFunction(result.to_location_address);
                this.dropdown.alertWithType('error', 'Error', result.to_location_address);
                return false;
            }

            if (result.additional_location_address) {
                // this.refs.defaultToastBottomWithDifferentColor.ShowToastFunction(result.additional_location_address);
                this.dropdown.alertWithType('error', 'Error', result.additional_location_address);
                return false;
            }

        }

        if (!result) {
            // console.log(distance)
            var data = {
                to_latitude: this.state.mapRegion.latitude,
                to_longitude: this.state.mapRegion.longitude,
                from_latitude: this.state.startPosition.latitude,
                from_longitude: this.state.startPosition.longitude,
                additional_latitude: this.state.additionalPosition.latitude,
                additional_longitude: this.state.additionalPosition.longitude,
                distance: this.state.distance,
                from_location_address: from_location_address,
                to_location_address: to_location_address,
                additional_location_address: additional_location_address,
                FavLocationA: this.state.FavLocationA,
                FavLocationB: this.state.FavLocationB,
                FavLocationC: this.state.FavLocationC,
                text: this.state.text,
            }
            // console.log(data)
            navigate('MessagingConfirmation', { data });
        }
    };
    async onMapClicked(coordinate) {
        var { from_location_address, additional_location_address, to_location_address } = this.state;

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
                    coords: { latitude: ll, longitude: lnn }, // Latitude and Longitude of the marker // HTML element that will be displayed as the marker.  It can also be text or an SVG string.
                    animation: {
                        name: 'pulse',
                        duration: '.5',
                        delay: 0,
                        interationCount: 'infinite'
                    },

                };
                tourAllocation.push(locations);
                this.setState({
                    enableCurruntLocation: false,
                    followsUserLocation: false,
                    markers: tourAllocation,
                    startPosition: locations.coords,
                    curruntLocation: locations.coords,

                });
                Geocoder.init(GOOGLE_MAPS_APIKEY);


                if (ll && lnn) {
                    await Geocoder.from(ll, lnn)
                        .then(json => {
                            // const formatted_address = responseJson.result.formatted_address;

                            from_location_address = json.results[0]['formatted_address'];
                            this.setState({ fromLocationText: from_location_address });

                        })
                        // console.log(this.state.fromLocationText)
                        .catch(error => console.warn(error));
                }


                // mapRef.current.animateToRegion({
                //     ll,
                //     lnn,
                //     latitudeDelta: 0.1,
                //     longitudeDelta: 0.1
                //   })
                this.APointref && this.APointref.setAddressText(this.state.fromLocationText)

            }
            else if (this.state.startPosition.latitude != 0 && this.state.addlocationC == 0) {
                var tourAllocation = [];
                this.setState({
                    destination: [],
                });
                var locations = [];

                locations = {
                    coords: { latitude: ll, longitude: lnn },

                };
                tourAllocation.push(locations);
                this.setState({
                    destination: tourAllocation,
                    mapRegion: locations.coords,
                });
                Geocoder.init(GOOGLE_MAPS_APIKEY);


                if (ll && lnn) {
                    await Geocoder.from(ll, lnn)
                        .then(json => {
                            to_location_address = json.results[0]['formatted_address'];
                            this.setState({ toLocationText: to_location_address });
                        })
                        .catch(error => console.warn(error));
                }
                
                this.BPointref && this.BPointref.setAddressText(this.state.toLocationText)
            }
            else if (this.state.startPosition.latitude != 0 && this.state.mapRegion.latitude != 0 && this.state.addlocationC == 1) {
                locations = {
                    coords: { latitude: ll, longitude: lnn },

                };
                this.setState({
                    additionalPosition: locations.coords,
                });
                Geocoder.init(GOOGLE_MAPS_APIKEY);


                if (ll && lnn) {
                    await Geocoder.from(ll, lnn)
                        .then(json => {
                            additional_location_address = json.results[0]['formatted_address'];
                            this.setState({ additionalLocationText: additional_location_address });
                        })
                        .catch(error => console.warn(error));
                }


               
                this.CPointref && this.CPointref.setAddressText(this.state.additionalLocationText)
                // console.log(this.state.additionalLocationText)
            }
        }

    };

    pointMarkerBySearchA(data, details) {
        var addr_text = (details != '') ? details.formatted_address : '';
        var from_latitude = (details != '') ? details.geometry.location.lat : '';
        var from_longitude = (details != '') ? details.geometry.location.lng : '';

        if (from_latitude && from_longitude) {
            var tourAllocation = [];
            this.setState({
                markers: [],
            });
            var locations = {};

            locations = { // The ID attached to the marker. It will be returned when onMarkerClicked is called
                coords: { latitude: from_latitude, longitude: from_longitude, latitudeDelta: 0.0922, longitudeDelta: 0.0421 }
            };
            tourAllocation.push(locations);

            this.setState({
                enableCurruntLocation: false,
                followsUserLocation: false,
                markers: tourAllocation,
                startPosition: locations.coords,
                curruntLocation: locations.coords,

            });
            // console.log(this.state.markers)
        }
        this.setState({ fromLocationText: addr_text });
    }
    pointMarkerBySearchB(data, details) {
        var addr_text = (details != '') ? details.formatted_address : '';
        var to_latitude = (details != '') ? details.geometry.location.lat : '';
        var to_longitude = (details != '') ? details.geometry.location.lng : '';

        if (to_latitude && to_longitude) {
            var pointB = [];
            this.setState({
                destination: [],
            });
            var locations = {};

            locations = { // The ID attached to the marker. It will be returned when onMarkerClicked is called
                coords: { latitude: to_latitude, longitude: to_longitude, latitudeDelta: 0.0922, longitudeDelta: 0.0421 }
            };

            pointB.push(locations);

            this.setState({
                destination: pointB,
                mapRegion: locations.coords,

            });
            // console.log(this.state.destination)
        }
        this.setState({ toLocationText: addr_text });
    }
    pointMarkerBySearchC(data, details) {
        var addr_text = (details != '') ? details.formatted_address : '';
        var additional_latitude = (details != '') ? details.geometry.location.lat : '';
        var additional_longitude = (details != '') ? details.geometry.location.lng : '';

        if (additional_latitude && additional_longitude) {
            var pointC = [];
            this.setState({
                showpointC: [],
            });
            var locations = {};

            locations = { // The ID attached to the marker. It will be returned when onMarkerClicked is called
                coords: { latitude: additional_latitude, longitude: additional_longitude, latitudeDelta: 0.0922, longitudeDelta: 0.0421 }
            };

            pointC.push(locations);

            this.setState({
                showpointC: pointC,
                additionalPosition: locations.coords,

            });

            // console.log(this.state.showpointC)
        }
        this.setState({ additionalLocationText: addr_text });
    }

    setModalVisible = (visible) => {
        this.setState({ modalVisible: visible });
    }
    ////////// android back button //////////

    _onBlurr = () => {
        BackHandler.removeEventListener('hardwareBackPress',
            this._handleBackButtonClick);
    }

    _onFocus = () => {
        BackHandler.addEventListener('hardwareBackPress',
            this._handleBackButtonClick);
    }

    _handleBackButtonClick = () => this.props.navigation.navigate('MarketPlace');

    UpdateRatingA() {

        if (this.state.FavLocationA == 0) {
            this.setState({ FavLocationA: 1, });
        } else {
            this.setState({ FavLocationA: 0, });
        }
        // console.log(this.state.review)
        //Keeping the Rating Selected in state
    }

    UpdateRatingB() {

        if (this.state.FavLocationB == 0) {
            this.setState({ FavLocationB: 1, });
        } else {
            this.setState({ FavLocationB: 0, });
        }
        // console.log(this.state.review)
        //Keeping the Rating Selected in state
    }

    UpdateRatingC() {

        if (this.state.FavLocationC == 0) {
            this.setState({ FavLocationC: 1, });
        } else {
            this.setState({ FavLocationC: 0, });
        }
        // console.log(this.state.review)
        //Keeping the Rating Selected in state
    }



    render() {

        const favoriteAddressData = [];
        // for (let userObject1 of this.state.favoriteAddressList) {
        //     favoriteAddressData.push({ label: userObject1.label, value: userObject1.value });
        // }

        const { navigate } = this.props.navigation;
        const { search, loader, BPointHide } = this.state;
        const { addlocationC, markers, destination, from_location_address, mapRegion, fromLocationText, toLocationText } = this.state;
        const keyboardVerticalOffset = Platform.OS === 'ios' ? 0 : 25

        let React_Native_Rating_Bar_A = [];
        let React_Native_Get_Rating_Bar_A = [];

        let React_Native_Rating_Bar_B = [];
        let React_Native_Get_Rating_Bar_B = [];

        let React_Native_Rating_Bar_C = [];
        let React_Native_Get_Rating_Bar_C = [];

        // console.log(destination);
        // console.log(addlocationC);
        // for (var i = 1; i <= 1; i++) {
        React_Native_Rating_Bar_A.push(
            <TouchableOpacity style={{ alignItems: 'center' }}
                activeOpacity={1.7}
                key='a'
                onPress={this.UpdateRatingA.bind(this)}>
                <Image
                    style={styles.StarImage}
                    source={(
                        this.state.FavLocationA
                            ? (require('../../images/heart-red.png'))
                            : (require('../../images/heart-gray.png'))
                    )}
                />
            </TouchableOpacity>
        );
        // }

        // for (var i = 1; i <= 1; i++) {
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
        // }

        // for (var i = 1; i <= 1; i++) {
        React_Native_Rating_Bar_C.push(
            <TouchableOpacity style={{ alignItems: 'center' }}
                activeOpacity={1.7}
                key='c'
                onPress={this.UpdateRatingC.bind(this)}>
                <Image
                    style={styles.StarImage}
                    source={(
                        // i <= dataSource.handyman_rating
                        // i <= this.state.review
                        this.state.FavLocationC
                            ? (require('../../images/heart-red.png'))
                            : (require('../../images/heart-gray.png'))
                    )}
                />
            </TouchableOpacity>
        );
        if (!loader) {
            if (this.state.curruntLocation.latitude) {
                return (

                    <View style={styles.container} >
                        {/* android back button start */}
                        <NavigationEvents
                            onWillFocus={this._onFocus}
                            onWillBlur={this._onBlurr}
                        />
                        <KeyboardAvoidingView
                            style={{ flex: 1 }}
                            behavior={Platform.OS === "ios" ? "height" : "padding"}
                        >
                            <Row style={styles.Navebar} >
                                <Col style={styles.NaveBackArrowCol}>

                                    <TouchableOpacity onPress={() => navigate('MarketPlace')}>
                                        <Image source={require('../../images/Back-Arrow.png')} style={styles.BackArrow} />
                                    </TouchableOpacity>

                                    {/* <TouchableOpacity onPress={this.handleBackButton}>
                                        <Image source={require('../../images/Back-Arrow.png')} style={styles.BackArrow} />
                                    </TouchableOpacity> */}
                                </Col>
                                <Col style={styles.NaveTitleCol}>
                                    <Text style={{ fontFamily: "Inter-Black", fontSize: 18 }}>{t('How can we help you?')}</Text>
                                </Col>
                                <Col style={styles.MenuCol}>
                                    <TouchableOpacity onPress={this.toggleDrawer.bind(this)}>
                                        <Image source={require('../../images/Menu.png')} style={styles.Menu} />
                                    </TouchableOpacity>
                                </Col>
                            </Row>

                            <MapView style={styles.mapStyle}
                                // provider={PROVIDER_GOOGLE}
                                provider={this.props.provider}
                                region={this.state.curruntLocation}
                                showsUserLocation={this.state.enableCurruntLocation}
                                // showsUserLocation={true}
                                followUserLocation={this.state.followsUserLocation}
                                // onUserLocationChange={event => console.log(event.nativeEvent)}
                                pitchEnabled={true}
                                showsBuildings={true}
                                ref={c => this.mapRef = c}
                                zoomEnabled={true}
                                // loadingEnabled={true}
                                onPoiClick={this.onPoiClick}
                                onPress={(e) => this.onMapClicked(e.nativeEvent.coordinate)}

                            >
                                {
                                    this.state.markers.map((marker) => (
                                        <Marker
                                            key='A'
                                            coordinate={marker.coords}
                                        // draggable
                                        // onDragEnd={(e) => { this.onMarkerDragEnd(e.nativeEvent.coordinate, 'A') }}
                                        >
                                            < Image source={require('../../../src/images/Location-A.png')} style={{ width: 48, height: 48 }} />
                                        </Marker>
                                    ))
                                }
                                {!this.state.mapRegion.latitude ? (
                                    <View>

                                    </View>
                                ) : (
                                        // <View>
                                        <Marker
                                            key='B'
                                            coordinate={{
                                                latitude: this.state.mapRegion.latitude,
                                                longitude: this.state.mapRegion.longitude,
                                            }}
                                        // draggable
                                        // onDragEnd={(e) => { this.onMarkerDragEnd(e.nativeEvent.coordinate, 'B') }}
                                        >
                                            < Image source={require('../../../src/images/Location-B.png')} style={{ width: 48, height: 48 }} />
                                        </Marker>
                                        // </View>
                                    )}

                                {!this.state.additionalPosition.latitude ? (
                                    <View>

                                    </View>
                                ) : (
                                        // <View>
                                        <Marker
                                            key='C'
                                            coordinate={{
                                                latitude: this.state.additionalPosition.latitude,
                                                longitude: this.state.additionalPosition.longitude,
                                            }}
                                        // draggable
                                        // onDragEnd={(e) => { this.onMarkerDragEnd(e.nativeEvent.coordinate, 'C') }}
                                        >
                                            < Image source={require('../../../src/images/Location-C.png')} style={{ width: 48, height: 48 }} />
                                        </Marker>
                                        // </View>
                                    )}


                                {(this.state.startPosition.latitude && this.state.mapRegion.latitude) ?
                                    (<MapViewDirections
                                        origin={(this.state.additionalPosition.latitude) ? this.state.additionalPosition : this.state.mapRegion}
                                        waypoints={[this.state.mapRegion]}
                                        destination={this.state.startPosition}
                                        apikey={GOOGLE_MAPS_APIKEY}
                                        timePrecision="now"
                                        strokeWidth={5}
                                        ref={c => this.mapRef = c}
                                        onReady={(result) => {
                                            this.setState({ distance: result.distance });
                                            this.mapRef.fitToCoordinates(result.coordinates, {
                                                edgePadding: {
                                                    right: width / 20,
                                                    bottom: height / 10,
                                                    left: width / 20,
                                                    top: height / 10,
                                                },
                                            });
                                        }}
                                        strokeColor="red"
                                    />) : <View></View>}

                            </MapView>
                            <View style={{ position: 'absolute', width: '90%', marginTop: "20%", marginLeft: 20, }}>
                                <Col>
                                    <Row style={styles.LocationA}>
                                        <Col style={{ width: 25, paddingLeft: 4 }}>
                                            <Image source={require('../../images/Location-A.png')} style={styles.Listlogo} />
                                        </Col>
                                        <Col>
                                            <GooglePlacesAutocomplete
                                                ref={ref => { this.APointref = ref }}
                                                placeholder={t('Where we go?')}
                                                query={{
                                                    key: GOOGLE_MAPS_APIKEY,
                                                    // language: 'en', // language of the results
                                                    // components: 'country:in',
                                                    types: 'establishment',
                                                    // location: this.setState.curruntLocation,
                                                    radius: "1000 meters",
                                                    // for panama    
                                                    language: 'es', // language of the results
                                                    components: 'country:pa',

                                                    //multiple country......
                                                    // components: Country,


                                                }}
                                                GooglePlacesSearchQuery={{
                                                    // available options for GooglePlacesSearch API : https://developers.google.com/places/web-service/search
                                                    rankby: 'distance',
                                                    // types: 'food'
                                                }}
                                                debounce={200}
                                                filterReverseGeocodingByTypes={['locality', 'administrative_area_level_3']}

                                                onPress={(data, details = null) => { this.pointMarkerBySearchA(data, details) }}

                                                onFail={error => console.error(error)}
                                                minLength={2}
                                                autoFocus={false}
                                                listViewDisplayed="auto"
                                                returnKeyType={'default'}
                                                fetchDetails={true}
                                                nearbyPlacesAPI='GOOGLE_MAPS_APIKEY'
                                                enablePoweredByContainer={false}
                                                // setAddressText={this.state.fromLocationText}
                                                styles={{
                                                    ...Platform.select({
                                                        ios: {
                                                            container: {
                                                                backgroundColor: 'transparent',
                                                                // top: 50,
                                                                width: '100%',
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
                                                                backgroundColor: 'transparent',
                                                                // top: 50,
                                                                width: '100%',
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
                                        {this.state.fromLocationText != '' ? (
                                            <View style={styles.FavCol}>
                                                <Col>
                                                    {React_Native_Rating_Bar_A}
                                                </Col>
                                            </View>
                                        ) : (
                                                <View></View>
                                            )}

                                        <Col style={styles.ArrowCol}>
                                            <Image source={require('../../images/Right_Arrow_New.png')} style={styles.StarImage} />
                                        </Col>
                                    </Row>
                                </Col>
                                {markers == '' ? (
                                    <View>
                                    </View>
                                ) : (
                                        // <View style={{ position: 'absolute', width: '90%', marginLeft: 20, }}>
                                        <Col>
                                            <Row style={styles.LocationB}>
                                                <Col style={{ width: 25, paddingLeft: 4 }}>
                                                    <Image source={require('../../images/Location-B.png')} style={styles.Blogo} />
                                                </Col>
                                                <Col>

                                                    <GooglePlacesAutocomplete
                                                        ref={ref => { this.BPointref = ref }}
                                                        placeholder={t('Where do we deliver it?')}
                                                        query={{
                                                            key: GOOGLE_MAPS_APIKEY,
                                                            // language: 'en', // language of the results
                                                            // components: 'country:in',
                                                            types: 'establishment',
                                                            radius: "1000 meters",
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
                                                        // setAddressText={this.state.toLocationText}

                                                        styles={{
                                                            ...Platform.select({
                                                                ios: {
                                                                    container: {
                                                                        backgroundColor: 'transparent',
                                                                        // top: 50,
                                                                        width: '100%',
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
                                                                        width: '100%',


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
                                                {this.state.toLocationText != '' ? (
                                                    <Col style={styles.FavCol}>
                                                        {React_Native_Rating_Bar_B}
                                                    </Col>
                                                ) : (
                                                        <View></View>
                                                    )}


                                                <Col style={styles.ArrowCol}>
                                                    <Image source={require('../../images/Right_Arrow_New.png')} style={styles.StarImage} />
                                                </Col>

                                            </Row>
                                        </Col>
                                        // </View>
                                    )}

                                {destination != '' && addlocationC == 0 ? (
                                    <View style={styles.AddLocationCol}>
                                        <Col >
                                            <TouchableOpacity
                                                style={styles.AddLocation}
                                                onPress={() =>
                                                    this.showAddLocationCTextbox()
                                                }
                                            >
                                                <Row style={styles.Add}>
                                                    <Col style={{ width: 20, justifyContent: 'center', }}>

                                                        <Image source={require('../../images/PluseIcon-grey.png')} style={styles.Pluse} />

                                                    </Col>
                                                    <Col style={{ justifyContent: 'center', }}>
                                                        <Text style={styles.Add}>
                                                            {t('Add additional destination')}
                                                        </Text>
                                                    </Col>
                                                </Row>
                                            </TouchableOpacity>
                                        </Col>

                                    </View>
                                ) : (
                                        <View>
                                        </View>
                                    )}

                                {addlocationC == 0 ? (
                                    <View></View>
                                ) : (
                                        // <View style={{ position: 'absolute', width: '90%', marginLeft: 20 }}>
                                        <Col>
                                            <Row style={styles.LocationC}>
                                                <Col style={{ width: 25, paddingLeft: 4 }}>
                                                    <Image source={require('../../images/Location-C.png')} style={styles.Listlogo} />
                                                </Col>
                                                <Col>

                                                    <GooglePlacesAutocomplete
                                                        ref={ref => { this.CPointref = ref }}
                                                        placeholder={t('Enter Location')}
                                                        query={{
                                                            key: GOOGLE_MAPS_APIKEY,
                                                            // language: 'en', // language of the results
                                                            // components: 'country:in',
                                                            types: 'establishment',
                                                            radius: "1000 meters",
                                                            // for panama    
                                                            language: 'es', // language of the results
                                                            components: 'country:pa',
                                                        }}
                                                        onPress={(data, details = null) => { this.pointMarkerBySearchC(data, details) }}
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
                                                        // onChangeText={(Address) => this.setState({ Address })}


                                                        styles={{
                                                            ...Platform.select({
                                                                ios: {
                                                                    container: {
                                                                        backgroundColor: 'transparent',
                                                                        // top: 50,
                                                                        width: '100%',
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
                                                                        width: '100%',


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
                                                {this.state.additionalLocationText != '' ? (
                                                    <Col style={styles.FavCol}>
                                                        {React_Native_Rating_Bar_C}
                                                    </Col>
                                                ) : (
                                                        <View></View>
                                                    )}


                                                <Col style={styles.ArrowCol}>
                                                    <Image source={require('../../images/Right_Arrow_New.png')} style={styles.StarImage} />
                                                </Col>

                                            </Row>
                                        </Col>
                                        // </View>
                                    )}

                            </View>

                            {/* <View style={{ position: 'absolute', width: '90%', marginLeft: 20, }}>
                                <Col>
                                    <Row style={styles.LocationA}>
                                        <Col style={{ width: 30, paddingLeft: 4 }}>
                                            <Image source={require('../../images/Location-A.png')} style={styles.Listlogo} />
                                        </Col>
                                        <Col>
                                            <GooglePlacesAutocomplete
                                                ref={ref => { this.APointref = ref }}
                                                placeholder={t('Where we go?')}
                                                query={{
                                                    key: GOOGLE_MAPS_APIKEY,
                                                    language: 'en', // language of the results
                                                    components: 'country:in',

                                                    // for panama    
                                                    // language: 'es', // language of the results
                                                    // components: 'country:pa',


                                                }}
                                                GooglePlacesSearchQuery={{
                                                    // available options for GooglePlacesSearch API : https://developers.google.com/places/web-service/search
                                                    rankby: 'distance',
                                                    // types: 'food'
                                                  }}
                                                filterReverseGeocodingByTypes={['ahmedabad']}
                                                
                                                onPress={(data, details = null) => { this.pointMarkerBySearchA(data, details) }}

                                                onFail={error => console.error(error)}
                                                minLength={2}
                                                autoFocus={false}
                                                listViewDisplayed="auto"
                                                returnKeyType={'default'}
                                                fetchDetails={true}
                                                nearbyPlacesAPI={GOOGLE_MAPS_APIKEY}
                                                enablePoweredByContainer={false}
                                                // setAddressText={this.state.fromLocationText}
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
                                                        }
                                                    })

                                                }}
                                            />
                                        </Col>
                                        {this.state.fromLocationText != '' ? (
                                            <View style={styles.FavCol}>
                                                <Col>
                                                    {React_Native_Rating_Bar_A}
                                                </Col>
                                            </View>
                                        ) : (
                                                <View></View>
                                            )}

                                        <Col style={styles.ArrowCol}>
                                            <Image source={require('../../images/Right_Arrow_New.png')} style={styles.StarImage} />
                                        </Col>
                                    </Row>
                                </Col>
                            </View> */}


                            {/* {markers == '' ? (
                                <View>
                                </View>
                            ) : (
                                    <View style={{ position: 'absolute', width: '90%', marginLeft: 20, }}>
                                        <Col>
                                            <Row style={styles.LocationB}>
                                                <Col style={{ width: 30, paddingLeft: 4 }}>
                                                    <Image source={require('../../images/Location-B.png')} style={styles.Listlogo} />
                                                </Col>
                                                <Col >

                                                    <GooglePlacesAutocomplete
                                                        ref={ref => { this.BPointref = ref }}
                                                        placeholder={t('Where do we deliver it?')}
                                                        query={{
                                                            key: GOOGLE_MAPS_APIKEY,
                                                            language: 'en', // language of the results
                                                            components: 'country:in',

                                                            // for panama    
                                                            // language: 'es', // language of the results
                                                            // components: 'country:pa',
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
                                                        // setAddressText={this.state.toLocationText}

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
                                                                        width: '90%',


                                                                    },
                                                                    textInputContainer: {
                                                                        backgroundColor: 'rgba(0,0,0,0)',
                                                                        borderTopWidth: 0,
                                                                        borderBottomWidth: 0,
                                                                        width: '90%',

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
                                                                }
                                                            })

                                                        }}
                                                    />

                                                </Col>
                                                {this.state.toLocationText != '' ? (
                                                    <Col style={styles.FavCol}>
                                                        {React_Native_Rating_Bar_B}
                                                    </Col>
                                                ) : (
                                                        <View></View>
                                                    )}


                                                <Col style={styles.ArrowCol}>
                                                    <Image source={require('../../images/Right_Arrow_New.png')} style={styles.StarImage} />
                                                </Col>

                                            </Row>
                                        </Col>
                                    </View>
                                )} */}

                            {/* {destination != '' && addlocationC == 0 ? (
                                <View style={styles.AddLocationCol}>
                                    <Col >


                                        <TouchableOpacity
                                            style={styles.AddLocation}
                                            onPress={() =>
                                                this.showAddLocationCTextbox()
                                            }
                                        >
                                            <Row style={styles.Add}>
                                                <Col style={{ width: 20, justifyContent: 'center', }}>

                                                    <Image source={require('../../images/PluseIcon-grey.png')} style={styles.Pluse} />

                                                </Col>
                                                <Col style={{ justifyContent: 'center', }}>
                                                    <Text style={styles.Add}>
                                                        {t('Add additional destination')}
                                                    </Text>
                                                </Col>
                                            </Row>
                                        </TouchableOpacity>
                                    </Col>

                                </View>
                            ) : (
                                    <View>
                                    </View>
                                )} */}


                            {/* {addlocationC == 0 ? (
                                <View></View>
                            ) : (
                                    <View style={{ position: 'absolute', width: '90%', marginLeft: 20 }}>
                                        <Col>
                                            <Row style={styles.LocationC}>
                                                <Col style={{ width: 30, paddingLeft: 4 }}>
                                                    <Image source={require('../../images/Location-C.png')} style={styles.Listlogo} />
                                                </Col>
                                                <Col>

                                                    <GooglePlacesAutocomplete
                                                        ref={ref => { this.CPointref = ref }}
                                                        placeholder={t('Enter Location')}
                                                        query={{
                                                            key: GOOGLE_MAPS_APIKEY,
                                                            language: 'en', // language of the results
                                                            components: 'country:in',

                                                            // for panama    
                                                            // language: 'es', // language of the results
                                                            // components: 'country:pa',
                                                        }}
                                                        onPress={(data, details = null) => { this.pointMarkerBySearchC(data, details) }}
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
                                                        // onChangeText={(Address) => this.setState({ Address })}


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
                                                                        width: '90%',


                                                                    },
                                                                    textInputContainer: {
                                                                        backgroundColor: 'rgba(0,0,0,0)',
                                                                        borderTopWidth: 0,
                                                                        borderBottomWidth: 0,
                                                                        width: '90%',

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
                                                                }
                                                            })


                                                        }}
                                                    />

                                                </Col>
                                                {this.state.additionalLocationText != '' ? (
                                                    <Col style={styles.FavCol}>
                                                        {React_Native_Rating_Bar_C}
                                                    </Col>
                                                ) : (
                                                        <View></View>
                                                    )}


                                                <Col style={styles.ArrowCol}>
                                                    <Image source={require('../../images/Right_Arrow_New.png')} style={styles.StarImage} />
                                                </Col>

                                            </Row>
                                        </Col>
                                    </View>
                                )} */}


                            {destination == '' ? (
                                <View></View>
                            ) : (
                                    // <View style={styles.TextArea}>

                                    <TextInput style={styles.TextArea}
                                        placeholder={t('Pickup Instructions')}
                                        placeholderTextColor={'#aaaaaa'}
                                        // fontWeight={'bold'}
                                        // multiline={true}
                                        numberOfLines={4}
                                        onChangeText={(text) => this.setState({ text })}>
                                    </TextInput>
                                    // </View>
                                )
                            }

                            {destination == '' ? (
                                <View>

                                </View>
                            ) : (
                                    <View style={styles.Accept}>
                                        <Row>
                                            <TouchableOpacity style={styles.Login} onPress={this.finalizaLocation.bind(this)} onLongPress={this.finalizaLocation.bind(this)}>
                                                <Text style={{ color: '#fff', fontSize: 20, width: "90%", textAlign: "center", fontFamily: "Inter-Black" }}  >{t('To accept')}</Text>
                                            </TouchableOpacity>
                                        </Row>
                                    </View>
                                )
                            }

                            {/* <CustomToast ref="defaultToastBottomWithDifferentColor" backgroundColor='#000' position="top" /> */}
                            <DropdownAlert ref={ref => this.dropdown = ref} />
                            {/* </ScrollView> */}
                        </KeyboardAvoidingView>
                    </View>

                );
            } else {
                return (
                    <View style={styles.container} >

                        {/* android back button start */}
                        <NavigationEvents
                            onWillFocus={this._onFocus}
                            onWillBlur={this._onBlurr}
                        />
                        {/* android back button end */}
                        <Row style={styles.Navebar} >
                            <Col style={styles.NaveBackArrowCol}>
                                <TouchableOpacity onPress={() => navigate('Selection')} >
                                    <Image source={require('../../images/Back-Arrow.png')} style={styles.BackArrow} />
                                </TouchableOpacity>
                            </Col>
                            <Col style={styles.NaveTitleCol}>
                                <Text style={{ fontFamily: "Inter-Black", fontSize: 18 }}>{t('How can we help you?')}</Text>
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
LocationScreen.propTypes = {
    provider: ProviderPropType,
};
export default withNavigation(LocationScreen);

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
                height: 50,
                borderRadius: 20,
                backgroundColor: '#efefef'
                // marginTop:15,
                // paddingBottom: 50, 
                // zIndex: 9999,
                // position: 'absolute',
                // backgroundColor:'red'

            }
        })

    },
    NaveBackArrowCol: {
        ...Platform.select({
            ios: {
                borderRightWidth: 2, width: '15%', justifyContent: 'center', borderColor: '#CCCCCC'
            },
            android: {

                borderRightWidth: 2, width: '15%', justifyContent: 'center', marginTop: 10, marginBottom: 10, borderColor: '#CCCCCC'

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


    Navebar2: {
        ...Platform.select({
            ios: {
                height: "20%",
                // paddingBottom: 50, 
                marginTop: "12%",
            },
            android: {
                height: 50,
                marginTop: 10,
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
                marginLeft: 10,
                marginTop: 2,
            }
        })
    },
    MenuCol: {
        ...Platform.select({
            ios: {
                width: "10%",
                justifyContent: 'center',
            },
            android: {
                justifyContent: 'center',
                width: "10%",
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
        width: 25,
        height: 25,
        marginTop: 10,
    },
    Blogo: {
        width: 20,
        height: 20,
        marginTop: 10,
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
                width: 12,
                height: 12,
            },
            android: {
                width: 12,
                height: 12,
            },
        })
    },
    Add: {
        ...Platform.select({
            ios: {
                fontSize: 11, fontFamily: "Inter-Black", color: '#949494',
            },
            android: {
                fontSize: 9, color: '#949494', fontFamily: "Inter-Black",
            },
        })
    },
    Accept: {
        ...Platform.select({
            ios: {
                flex: 1,
                justifyContent: 'center',
                position: 'absolute',
                // width: '100%',
                bottom: 5
                // marginTop: "143%"
            },
            android: {
                flex: 1,
                justifyContent: 'center',
                position: 'absolute',
                bottom: 5,
                // marginTop: "172%"

                // width: '100%'
            }
        })

    },
    Login: {
        marginTop: 20,
        alignItems: 'center',
        justifyContent: 'center',
        width: '90%',
        marginLeft: 20,
        marginRight: 20,
        height: 55,
        borderRadius: 40,
        backgroundColor: '#e02127',
        color: '#fff',

    },

    LocationA: {
        ...Platform.select({
            ios: {
                // position: 'absolute',
                // width: '90%',
                marginTop: '10%',
                // marginLeft: 20,
                borderRadius: 20,
                backgroundColor: '#fff',
                elevation: 20,

            },
            android: {

                // position: 'absolute',
                // marginTop: '20%',
                borderRadius: 20,
                backgroundColor: '#fff',
                elevation: 20,
            }
        })
    },
    LocationB: {
        ...Platform.select({
            ios: {
                // position: 'absolute',
                // width: '90%',
                marginTop: 10,
                // marginLeft: 20,
                borderRadius: 20,
                backgroundColor: '#fff',
                elevation: 20,

            },
            android: {
                marginTop: 10,
                // position: 'absolute',
                // marginTop: '35%',
                borderRadius: 20,
                backgroundColor: '#fff',
                elevation: 20,

            }
        })
    },
    LocationC: {
        ...Platform.select({
            ios: {
                // width: '90%',
                marginTop: 10,
                // marginLeft: 20,
                borderRadius: 20,
                backgroundColor: '#fff',
                elevation: 20,

            },
            android: {
                marginTop: 10,
                // position: 'absolute',
                // marginTop: '50%',
                borderRadius: 20,
                backgroundColor: '#fff',
                elevation: 20,

            }
        })
    },

    AddLocationCol: {
        ...Platform.select({
            ios: {
                marginTop: 10,
                width: '62%',
                alignItems: 'flex-end',
            },
            android: {
                marginTop: 10,
                justifyContent: 'center',
                width: '57%',
                alignItems: 'flex-end',
                marginLeft: "8%"

            }
        })

    },
    AddLocation: {
        ...Platform.select({
            ios: {
                position: 'absolute',
                backgroundColor: '#fff',
                width: '60%',
                height: 25,
                paddingLeft: 5,
                paddingRight: 5,
                elevation: 20,
                borderRadius: 15,

            },
            android: {
                position: 'absolute',
                borderRadius: 15,
                // bottom: '10%',
                // marginRight: 20, 
                backgroundColor: '#fff',
                // height:'10%',
                // borderWidth:1, 
                width: '60%',

                height: 25,
                paddingLeft: 5,
                paddingRight: 5,
                elevation: 20,

            }
        })
    },
    TextArea: {
        ...Platform.select({
            ios: {
                position: 'absolute',
                width: '90%',
                // marginTop: '130%',
                marginLeft: 20,
                backgroundColor: '#fff',
                borderRadius: 22,
                elevation: 15,
                height: 70,
                paddingLeft: 20,
                bottom: 70,
                fontFamily: "Inter-Black",



            },
            android: {

                position: 'absolute',
                // width: '90%',
                // // marginTop: '145%',
                borderRadius: 22,
                bottom: 70,
                // marginLeft: 20,
                // // alignItems:'center',
                // // marginRight: 20, 
                backgroundColor: '#fff',
                // elevation: 15,
                // paddingLeft: 10,

                marginHorizontal: 20,
                paddingBottom: 15,
                height: 55,
                paddingLeft: 20,
                fontFamily: "Inter-Black",
                width: "90%",


            }
        })
    },

    notes_Input: {
        ...Platform.select({
            ios: {
                paddingLeft: 10,
                fontFamily: "Inter-Black",
                height: "20%"
                // backgroundColor: 'blue',
            },
            android: {
                paddingLeft: 10,
                fontFamily: "Inter-Black",
            }
        })


    },
    centeredView: {
        position: 'absolute',
        backgroundColor: '#FFFFFF',
        // height : '63%',
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
        ...Platform.select({
            ios: {
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
            android: {
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

    AddPlace: {
        ...Platform.select({
            ios: {
                alignItems: 'center',
                fontSize: 20,
                fontWeight: 'bold',
                marginLeft: 10,
                // marginTop: 10
            },
            android: {
                alignItems: 'center',
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

    StarImage: {
        width: 20,
        height: 20,
        resizeMode: 'cover',
        marginTop: 12
    },

    FavCol: {
        width: 25,
        alignItems: 'flex-end',
        // marginTop: 5,
        // marginRight: 30,

    },
    ArrowCol: {
        width: 25,
        alignItems: 'flex-end',
        marginRight: 10,

    },

});