import React, { Component } from "react";
import {
    BackHandler,
    Toast,
    Platform,
    View,
    Text,
    Modal,
    TouchableOpacity,
    AsyncStorage,
    Image,
    StyleSheet,
    ActivityIndicator,
    RefreshControl,
    TextInput,
    ScrollView,
    Dimensions,
    Linking,
    KeyboardAvoidingView
} from "react-native";
import normalize from 'react-native-normalize';
import { NavigationEvents, withNavigation } from 'react-navigation';
import validate from 'validate.js';
import { Col, Row } from 'react-native-easy-grid';
import moment from 'moment';
import { t } from '../../../locals';

class Restaurantes extends Component {

    constructor(props) {
        super(props);
        this.state = {
            loader: '',
            marketmodal: false,
        };
        // this.onDayPress = this.onDayPress.bind(this);
    }

    static navigationOptions = ({ navigation }) => {
        return {
            headerShown: false,
        };
    };

    marketType(marketmodal) {
        this.setModalmarketType(!marketmodal);
    }

    setModalmarketType = (visible) => {

        this.setState({ marketmodal: visible });
    }

    toggleDrawer = ({ navigation }) => {
        this.props.navigation.toggleDrawer();
    };

    UpdateRatingA() {

        if (this.state.FavLocationA == 0) {
            this.setState({ FavLocationA: 1, });
        } else {
            this.setState({ FavLocationA: 0, });
        }
        // console.log(this.state.review)
        //Keeping the Rating Selected in state
    }
    
    _onBlurr = () => {
        BackHandler.removeEventListener('hardwareBackPress',
            this._handleBackButtonClick);
    }

    _onFocus = () => {
        BackHandler.addEventListener('hardwareBackPress',
            this._handleBackButtonClick);
    }

    _handleBackButtonClick = () => this.props.navigation.navigate('Selection');
    
    render() {

        const { navigate } = this.props.navigation;
        const { marketmodal } = this.state;
        let React_Native_Rating_Bar_A = [];

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
        return (
            <View style={{flex:1,backgroundColor: '#fff',}}>
                <NavigationEvents
                            onWillFocus={this._onFocus}
                            onWillBlur={this._onBlurr}
                        />
                <Row style={{backgroundColor: '#EBF4FA',justifyContent: 'center',alignItems:'center',height: normalize(35),borderRadius: normalize(30), marginLeft: normalize(50), marginRight: normalize(50), marginTop: normalize(15),marginBottom: normalize(10)}}> 
                    <Col style={{width: normalize(55),justifyContent: 'center',alignItems:'center',}}>
                        <Image source={require('../../images/Search.png')} style={{width: normalize(25),height: normalize(25)}} />
                    </Col>
                    <Col>
                        <Text style={{fontFamily: 'Inter-Black', color: '#B3B8BF', fontSize: 12}}>{t("What's causing you today?")}</Text>
                    </Col>
                </Row>

            <ScrollView>

                <Row style={{height: normalize(95),padding: normalize(7),borderTopWidth: 1.5,borderBottomWidth: 1.5,borderColor: '#E3E4E7',marginLeft: normalize(10),marginRight: normalize(10)}}>
                    <Col style={{borderWidth: 1.5,width: normalize(78),height: normalize(78), borderRadius: normalize(10),borderColor: '#e5e5e5' ,justifyContent: 'center', alignItems: 'center'}}>
                        <Image source={require('../../images/McDonald’s.png')} style={{width: normalize(75),height: normalize(75)}} />
                    </Col>
                    <Col style={{marginLeft: normalize(7),marginBottom: normalize(8)}}>
                        <Row style={{height: normalize(20)}}>
                            <Text style={{fontFamily: 'Inter-Black',fontSize: 15}}>McDonald’s / Costa Verde</Text>
                        </Row>
                        <Row>
                            <Text style={{fontFamily: 'Inter-Black',fontSize: 12, color: '#84C262'}}>Abierto</Text><Text style={{fontFamily: 'Inter-Black',fontSize: 12, color: '#899096'}}> A 2.5 kms de ti</Text>
                        </Row>
                        <Row style={{alignItems: 'center',}}>
                            <Text style={{fontFamily: 'Inter-Black',fontSize: 13, color: '#899096'}}>30 - 40 min </Text><Image source={require('../../images/Rating.png')} style={{width: normalize(13),height: normalize(13)}} /><Text style={{fontFamily: 'Inter-Black',fontSize: 13, color: '#899096'}}> 4.9</Text><Text style={{fontFamily: 'Inter-Black',fontSize: 9, lineHeight: 20,color: '#B3B8C0'}}>(25)</Text>
                        </Row>
                        <Row>
                            <Text style={{fontFamily: 'Inter-Black',fontSize: 11, color: '#C9CDD3'}}>Costo del envio:</Text><Text style={{fontFamily: 'Inter-Black',fontSize: 11, color: '#899096'}}> GRATIS / Pick Up</Text>
                        </Row>
                        <Row>
                            <TouchableOpacity onPress={() => {this.setModalmarketType(true);}}>
                                <Text style={{fontFamily: 'Inter-Black',fontSize: 11, color: '#1988B9'}}>{t('Change branch')}</Text>
                            </TouchableOpacity>
                        </Row>
                    </Col>
                    <Col style={{width: normalize(65),paddingRight: normalize(5)}}>
                        <Row style={{justifyContent: 'flex-end'}}>
                            {React_Native_Rating_Bar_A}
                        </Row>
                        <Row style={{alignItems: 'flex-end', marginBottom: normalize(12)}}>
                            <TouchableOpacity onPress={() => navigate('RestaurantesView')}> 
                                <Row style={{height: normalize(23), width: normalize(60), borderRadius: normalize(5),backgroundColor: '#C9CDD3',justifyContent: 'center', alignItems: 'center',}}>
                                    <Text style={{fontSize: 13 , fontFamily: 'Inter-Black', color: '#737B7F'}}>{t('See')}</Text>
                                </Row>
                            </TouchableOpacity>
                        </Row>
                    </Col>
                </Row>
                <Modal
                      animationType="slide"
                      transparent={true}
                      visible={marketmodal}>
                        <View style={styles.ModalCenteredView}>
                            <View style={styles.notifyModalView}>
                                <Row style={{height: normalize(40),marginLeft: normalize(20), marginTop: normalize(10)}}>
                                    <Col style={{width: normalize(45),justifyContent: 'center',paddingTop: normalize(3  )}}>
                                        <TouchableOpacity onPress={() => { this.setModalmarketType(!marketmodal); }}>
                                            <Image
                                                source={require("../../images/Back-Arrow.png")}
                                                style={{height: normalize(23), width: normalize(23)}}
                                            />
                                        </TouchableOpacity>
                                    </Col>
                                    <Col style={{justifyContent: 'center',}}>
                                        <Text style={{fontFamily: 'Inter-Black', fontSize: 23,color: '#C1272D'}}>{t('Branches Available')}</Text>
                                    </Col>
                                </Row>

                                <TouchableOpacity onPress={() => { this.setModalmarketType(!marketmodal); }}>
                                    <Row style={{height: normalize(50),marginLeft: normalize(35), marginTop: normalize(20)}}>
                                        <Col>
                                            <Row style={{height: normalize(22)}}>
                                                <Text style={{fontSize: 18, fontFamily: 'Inter-Black',}}>McDonald’s / Costa Verde</Text>
                                            </Row>
                                            <Row>
                                                <Text style={{fontSize: 14  , fontFamily: 'Inter-Black',color: '#8FC262'}}>Abierto</Text><Text style={{fontSize: 14, fontFamily: 'Inter-Black',color: '#899098'}}> - A 2.5 kms de ti</Text>
                                            </Row>
                                            <Row>
                                                <Text style={{fontSize: 12, fontFamily: 'Inter-Black',}}>Costo del envio: </Text><Text style={{fontSize: 12, fontFamily: 'Inter-Black',color: '#899098'}}>GRATIS / Pick Up</Text>
                                            </Row>
                                        </Col>
                                    </Row>
                                </TouchableOpacity>

                                <TouchableOpacity onPress={() => { this.setModalmarketType(!marketmodal); }}>
                                    <Row style={{height: normalize(50),marginLeft: normalize(35), marginTop: normalize(20)}}>
                                        <Col>
                                            <Row style={{height: normalize(22)}}>
                                                <Text style={{fontSize: 18, fontFamily: 'Inter-Black',}}>McDonald’s / Chorrera Centro</Text>
                                            </Row>
                                            <Row>
                                                <Text style={{fontSize: 14  , fontFamily: 'Inter-Black',color: '#8FC262'}}>Abierto</Text><Text style={{fontSize: 14, fontFamily: 'Inter-Black',color: '#899098'}}> - A 3.6 kms de ti</Text>
                                            </Row>
                                            <Row>
                                                <Text style={{fontSize: 12, fontFamily: 'Inter-Black',}}>Costo del envio: </Text><Text style={{fontSize: 12, fontFamily: 'Inter-Black',color: '#899098'}}>GRATIS / Pick Up</Text>
                                            </Row>
                                        </Col>
                                    </Row>
                                </TouchableOpacity>

                                <TouchableOpacity onPress={() => { this.setModalmarketType(!marketmodal); }}>
                                    <Row style={{height: normalize(50),marginLeft: normalize(35), marginTop: normalize(20)}}>
                                        <Col>
                                            <Row style={{height: normalize(22)}}>
                                                <Text style={{fontSize: 18, fontFamily: 'Inter-Black',}}>McDonald’s / Las Anclas</Text>
                                            </Row>
                                            <Row>
                                                <Text style={{fontSize: 14  , fontFamily: 'Inter-Black',color: '#8FC262'}}>Abierto</Text><Text style={{fontSize: 14, fontFamily: 'Inter-Black',color: '#899098'}}> - A 5.6 kms de ti</Text>
                                            </Row>
                                            <Row>
                                                <Text style={{fontSize: 12, fontFamily: 'Inter-Black',}}>Costo del envio: </Text><Text style={{fontSize: 12, fontFamily: 'Inter-Black',color: '#899098'}}>$3.50 / Pick Up</Text>
                                            </Row>
                                        </Col>
                                    </Row>
                                </TouchableOpacity>

                                <TouchableOpacity onPress={() => { this.setModalmarketType(!marketmodal); }}>
                                    <Row style={{height: normalize(50),marginLeft: normalize(35), marginTop: normalize(20)}}>
                                        <Col>
                                            <Row style={{height: normalize(22)}}>
                                                <Text style={{fontSize: 18, fontFamily: 'Inter-Black',}}>McDonald’s / Paseo Arraijan</Text>
                                            </Row>
                                            <Row>
                                                <Text style={{fontSize: 14  , fontFamily: 'Inter-Black',color: '#8FC262'}}>Abierto</Text><Text style={{fontSize: 14, fontFamily: 'Inter-Black',color: '#899098'}}> - A 15 kms de ti</Text>
                                            </Row>
                                            <Row>
                                                <Text style={{fontSize: 12, fontFamily: 'Inter-Black',}}>Costo del envio: </Text><Text style={{fontSize: 12, fontFamily: 'Inter-Black',color: '#899098'}}>$10.50 / Pick Up</Text>
                                            </Row>
                                        </Col>
                                    </Row>
                                </TouchableOpacity>

                                <TouchableOpacity onPress={() => { this.setModalmarketType(!marketmodal); }}>
                                    <Row style={{height: normalize(50),marginLeft: normalize(35), marginTop: normalize(20)}}>
                                        <Col>
                                            <Row style={{height: normalize(22)}}>
                                                <Text style={{fontSize: 18, fontFamily: 'Inter-Black',}}>McDonald’s / Vacamonte</Text>
                                            </Row>
                                            <Row>
                                                <Text style={{fontSize: 14  , fontFamily: 'Inter-Black',color: '#8FC262'}}>Abierto</Text><Text style={{fontSize: 14, fontFamily: 'Inter-Black',color: '#899098'}}> - A 18.5 kms de ti</Text>
                                            </Row>
                                            <Row>
                                                <Text style={{fontSize: 12, fontFamily: 'Inter-Black',}}>Costo del envio: </Text><Text style={{fontSize: 12, fontFamily: 'Inter-Black',color: '#899098'}}>Solo / Pick Up</Text>
                                            </Row>
                                        </Col>
                                    </Row>
                                </TouchableOpacity>

                                <TouchableOpacity onPress={() => { this.setModalmarketType(!marketmodal); }}>
                                    <Row style={{height: normalize(50),marginLeft: normalize(35), marginTop: normalize(20) , marginBottom: normalize(30)}}>
                                        <Col>
                                            <Row style={{height: normalize(22)}}>
                                                <Text style={{fontSize: 18, fontFamily: 'Inter-Black',}}>McDonald’s / Ferrocarril</Text>
                                            </Row>
                                            <Row>
                                                <Text style={{fontSize: 14  , fontFamily: 'Inter-Black',color: '#8FC262'}}>Abierto</Text><Text style={{fontSize: 14, fontFamily: 'Inter-Black',color: '#899098'}}> - A 26 kms de ti</Text>
                                            </Row>
                                            <Row>
                                                <Text style={{fontSize: 12, fontFamily: 'Inter-Black',}}>Costo del envio: </Text><Text style={{fontSize: 12, fontFamily: 'Inter-Black',color: '#899098'}}>Solo / Pick Up</Text>
                                            </Row>
                                        </Col>
                                    </Row>
                                </TouchableOpacity>

                        </View>
                      </View>
                    </Modal>

                <Row style={{height: normalize(95),padding: normalize(7),borderBottomWidth: 1.5,borderColor: '#E3E4E7',marginLeft: normalize(10),marginRight: normalize(10)}}>
                    <Col style={{borderWidth: 1.5,width: normalize(78),height: normalize(78), borderRadius: normalize(10),borderColor: '#e5e5e5' ,justifyContent: 'center', alignItems: 'center'}}>
                        <Image source={require('../../images/DonLee.png')} style={{width: normalize(70),height: normalize(70)}} />
                    </Col>
                    <Col style={{marginLeft: normalize(7),marginBottom: normalize(8)}}>
                        <Row style={{height: normalize(20)}}>
                            <Text style={{fontFamily: 'Inter-Black',fontSize: 15}}>Don Lee / La Chorrera</Text>
                        </Row>
                        <Row>
                            <Text style={{fontFamily: 'Inter-Black',fontSize: 12, color: '#EEA140'}}>Cierra Pronto </Text><Text style={{fontFamily: 'Inter-Black',fontSize: 12, color: '#899096'}}> A 1.6 kms de ti</Text>
                        </Row>
                        <Row style={{alignItems: 'center',}}>
                            <Text style={{fontFamily: 'Inter-Black',fontSize: 13, color: '#899096'}}>45 - 55 min </Text><Image source={require('../../images/Rating.png')} style={{width: normalize(13),height: normalize(13)}} /><Text style={{fontFamily: 'Inter-Black',fontSize: 13, color: '#899096'}}> 4.2</Text><Text style={{fontFamily: 'Inter-Black',fontSize: 9, lineHeight: 20,color: '#B3B8C0'}}>(12)</Text>
                        </Row>
                        <Row>
                            <Text style={{fontFamily: 'Inter-Black',fontSize: 11, color: '#C9CDD3'}}>Costo del envio:</Text><Text style={{fontFamily: 'Inter-Black',fontSize: 11, color: '#899096'}}>  $ 3.00 / Pick Up</Text>
                        </Row>
                        <Row>
                            <TouchableOpacity>
                                <Text style={{fontFamily: 'Inter-Black',fontSize: 11, color: '#1988B9'}}>{t('Change branch')}</Text>
                            </TouchableOpacity>
                        </Row>
                    </Col>
                    <Col style={{width: normalize(65),paddingRight: normalize(5)}}>
                        <Row style={{justifyContent: 'flex-end'}}>
                            {React_Native_Rating_Bar_A}
                        </Row>
                        <Row style={{alignItems: 'flex-end', marginBottom: normalize(12)}}>
                            <TouchableOpacity>
                                <Row style={{height: normalize(23), width: normalize(60), borderRadius: normalize(5),backgroundColor: '#C9CDD3',justifyContent: 'center', alignItems: 'center',}}>
                                    <Text style={{fontSize: 13 , fontFamily: 'Inter-Black', color: '#737B7F'}}>{t('See')}</Text>
                                </Row>
                            </TouchableOpacity>
                        </Row>
                    </Col>
                </Row>

                <Row style={{height: normalize(95),padding: normalize(7),borderBottomWidth: 1.5,borderColor: '#E3E4E7',marginLeft: normalize(10),marginRight: normalize(10)}}>
                    <Col style={{borderWidth: 1.5,width: normalize(78),height: normalize(78), borderRadius: normalize(10),borderColor: '#e5e5e5' ,justifyContent: 'center', alignItems: 'center'}}>
                        <Image source={require('../../images/Fosters.png')} style={{width: normalize(70),height: normalize(70)}} />
                    </Col>
                    <Col style={{marginLeft: normalize(7),marginBottom: normalize(8)}}>
                        <Row style={{height: normalize(20)}}>
                            <Text style={{fontFamily: 'Inter-Black',fontSize: 15}}>Fosters / Costa Verde</Text>
                        </Row>
                        <Row>
                            <Text style={{fontFamily: 'Inter-Black',fontSize: 12, color: '#EA2E2E'}}>Hoy Cerrado </Text><Text style={{fontFamily: 'Inter-Black',fontSize: 12, color: '#899096'}}> A 2.5 kms de ti</Text>
                        </Row>
                        <Row style={{alignItems: 'center',}}>
                            <Text style={{fontFamily: 'Inter-Black',fontSize: 13, color: '#899096'}}>30 - 40 min </Text><Image source={require('../../images/Rating.png')} style={{width: normalize(13),height: normalize(13)}} /><Text style={{fontFamily: 'Inter-Black',fontSize: 13, color: '#899096'}}> 4.9</Text><Text style={{fontFamily: 'Inter-Black',fontSize: 9, lineHeight: 20,color: '#B3B8C0'}}>(25)</Text>
                        </Row>
                        <Row>
                            <Text style={{fontFamily: 'Inter-Black',fontSize: 11, color: '#C9CDD3'}}>Costo del envio:</Text><Text style={{fontFamily: 'Inter-Black',fontSize: 11, color: '#899096'}}>  $ 3.50 / Pick Up</Text>
                        </Row>
                        <Row>
                            <TouchableOpacity>
                                <Text style={{fontFamily: 'Inter-Black',fontSize: 11, color: '#1988B9'}}>{t('Change branch')}</Text>
                            </TouchableOpacity>
                        </Row>
                    </Col>
                    <Col style={{width: normalize(65),paddingRight: normalize(5)}}>
                        <Row style={{justifyContent: 'flex-end'}}>
                            {React_Native_Rating_Bar_A}
                        </Row>
                        <Row style={{alignItems: 'flex-end', marginBottom: normalize(12)}}>
                            <TouchableOpacity>
                                <Row style={{height: normalize(23), width: normalize(60), borderRadius: normalize(5),backgroundColor: '#C9CDD3',justifyContent: 'center', alignItems: 'center',}}>
                                    <Text style={{fontSize: 13 , fontFamily: 'Inter-Black', color: '#737B7F'}}>{t('See')}</Text>
                                </Row>
                            </TouchableOpacity>
                        </Row>
                    </Col>
                </Row>

                <Row style={{height: normalize(95),padding: normalize(7),borderBottomWidth: 1.5,borderColor: '#E3E4E7',marginLeft: normalize(10),marginRight: normalize(10)}}>
                    <Col style={{borderWidth: 1.5,width: normalize(78),height: normalize(78), borderRadius: normalize(10),borderColor: '#e5e5e5' ,justifyContent: 'center', alignItems: 'center'}}>
                        <Image source={require('../../images/LittleCaesars.png')} style={{width: normalize(70),height: normalize(70)}} />
                    </Col>
                    <Col style={{marginLeft: normalize(7),marginBottom: normalize(8)}}>
                        <Row style={{height: normalize(20)}}>
                            <Text style={{fontFamily: 'Inter-Black',fontSize: 15}}>Little Caesars / Plaza Centro</Text>
                        </Row>
                        <Row>
                            <Text style={{fontFamily: 'Inter-Black',fontSize: 12, color: '#84C262'}}>Abierto</Text><Text style={{fontFamily: 'Inter-Black',fontSize: 12, color: '#899096'}}> A 2.5 kms de ti</Text>
                        </Row>
                        <Row style={{alignItems: 'center',}}>
                            <Text style={{fontFamily: 'Inter-Black',fontSize: 13, color: '#899096'}}>30 - 40 min </Text><Image source={require('../../images/Rating.png')} style={{width: normalize(13),height: normalize(13)}} /><Text style={{fontFamily: 'Inter-Black',fontSize: 13, color: '#899096'}}> 4.9</Text><Text style={{fontFamily: 'Inter-Black',fontSize: 9, lineHeight: 20,color: '#B3B8C0'}}>(25)</Text>
                        </Row>
                        <Row>
                            <Text style={{fontFamily: 'Inter-Black',fontSize: 11, color: '#C9CDD3'}}>Costo del envio:</Text><Text style={{fontFamily: 'Inter-Black',fontSize: 11, color: '#899096'}}> $ 2.00</Text>
                        </Row>
                        <Row>
                            <TouchableOpacity>
                                <Text style={{fontFamily: 'Inter-Black',fontSize: 11, color: '#1988B9'}}>{t('Change branch')}</Text>
                            </TouchableOpacity>
                        </Row>
                    </Col>
                    <Col style={{width: normalize(65),paddingRight: normalize(5)}}>
                        <Row style={{justifyContent: 'flex-end'}}>
                            {React_Native_Rating_Bar_A}
                        </Row>
                        <Row style={{alignItems: 'flex-end', marginBottom: normalize(12)}}>
                            <TouchableOpacity>
                                <Row style={{height: normalize(23), width: normalize(60), borderRadius: normalize(5),backgroundColor: '#C9CDD3',justifyContent: 'center', alignItems: 'center',}}>
                                    <Text style={{fontSize: 13 , fontFamily: 'Inter-Black', color: '#737B7F'}}>{t('See')}</Text>
                                </Row>
                            </TouchableOpacity>
                        </Row>
                    </Col>
                </Row>

                <Row style={{height: normalize(95),padding: normalize(7),borderBottomWidth: 1.5,borderColor: '#E3E4E7',marginLeft: normalize(10),marginRight: normalize(10), marginBottom: normalize(30),}}>
                    <Col style={{borderWidth: 1.5,width: normalize(78),height: normalize(78), borderRadius: normalize(10),borderColor: '#e5e5e5' ,justifyContent: 'center', alignItems: 'center'}}>
                        <Image source={require('../../images/Kfc.png')} style={{width: normalize(70),height: normalize(70)}} />
                    </Col>
                    <Col style={{marginLeft: normalize(7),marginBottom: normalize(8)}}>
                        <Row style={{height: normalize(20)}}>
                            <Text style={{fontFamily: 'Inter-Black',fontSize: 15}}>KFC / Costa Verde</Text>
                        </Row>
                        <Row>
                            <Text style={{fontFamily: 'Inter-Black',fontSize: 12, color: '#84C262'}}>Abierto</Text><Text style={{fontFamily: 'Inter-Black',fontSize: 12, color: '#899096'}}> A 2.5 kms de ti</Text>
                        </Row>
                        <Row style={{alignItems:'center'}}>
                            <Text style={{fontFamily: 'Inter-Black',fontSize: 13, color: '#899096'}}>30 - 40 min </Text><Image source={require('../../images/Rating.png')} style={{width: normalize(13),height: normalize(13)}} /><Text style={{fontFamily: 'Inter-Black',fontSize: 13, color: '#899096'}}> 4.9</Text><Text style={{fontFamily: 'Inter-Black',fontSize: 9, lineHeight: 20,color: '#B3B8C0'}}>(25)</Text>
                        </Row>
                        <Row>
                            <Text style={{fontFamily: 'Inter-Black',fontSize: 11, color: '#C9CDD3'}}>Costo del envio:</Text><Text style={{fontFamily: 'Inter-Black',fontSize: 11, color: '#899096'}}> GRATIS / Pick Up</Text>
                        </Row>
                        <Row>
                            <TouchableOpacity>
                                <Text style={{fontFamily: 'Inter-Black',fontSize: 11, color: '#1988B9'}}>{t('Change branch')}</Text>
                            </TouchableOpacity>
                        </Row>
                    </Col>
                    <Col style={{width: normalize(65),paddingRight: normalize(5)}}>
                        <Row style={{justifyContent: 'flex-end'}}>
                            {React_Native_Rating_Bar_A}
                        </Row>
                        <Row style={{alignItems: 'flex-end', marginBottom: normalize(12)}}>
                            <TouchableOpacity>
                                <Row style={{height: normalize(23), width: normalize(60), borderRadius: normalize(5),backgroundColor: '#C9CDD3',justifyContent: 'center', alignItems: 'center',}}>
                                    <Text style={{fontSize: 13 , fontFamily: 'Inter-Black', color: '#737B7F'}}>{t('See')}</Text>
                                </Row>
                            </TouchableOpacity>
                        </Row>
                    </Col>
                </Row>

            </ScrollView>
            </View>
        )
    }
}

export default withNavigation(Restaurantes);

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    StarImage: {
        width: 20,
        height: 20,
        resizeMode: 'cover',
        marginTop: 12
    },
    FavCol: {
    },
    Navebar: {
        ...Platform.select({
            ios: {
                height: 45,
                marginTop: "10%",
                borderBottomWidth: 1
            },
            android: {
                height: 40,
                //   borderWidth: 1,   
                borderBottomWidth: 1
            },
        }),
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
                marginTop: 10,
            }
        })
    },
    Menu: {
        ...Platform.select({
            ios: {
                width: 25,
                height: 25,
                justifyContent: 'center',
                alignItems: 'center',
                marginRight: 10,
            },
            android: {
                width: 25,
                height: 25,
                justifyContent: 'center',
                alignItems: 'center',
                marginRight: 10,
                marginTop: 10,
            }
        })

    },

    NavCol: {
        width: "10%"
    },
    Header: {
        justifyContent: "center",
        alignItems: "center",

    },
    HeaderText: {
        ...Platform.select({
            ios: {
                fontSize: 15,
                // padding: 10,
                fontWeight: "bold",
                color: "#102b46",
                // alignItems: 'center',
                height: 15,

            },
            android: {

                fontSize: 15,
                // padding: 10,
                fontWeight: "bold",
                color: "#102b46",
                // alignItems: 'center',
            }
        })
    },
    notes_Input: {
        ...Platform.select({
            ios: {
                height: 40,
                width: '100%',
                paddingLeft: 10,
                paddingTop: "3%"
            },
            android: {
                // marginTop: 10,
                height: 40,
                width: '100%',
                paddingLeft: 10,
            }
        })
    },
    ModalCenteredView: {
    ...Platform.select({
      ios: {
        // borderRadius: 10,
        //shadowColor: "#232324",
        shadowOffset: { width: 0, height: 1, },
        elevation: 300,
        // top: 200,
        // height:"20%",
        height: Dimensions.get('window').height,
        backgroundColor: "rgba(100,100,100, 0.8)",
      },
      android: {
        // borderRadius: 10,
        //shadowColor: "#232324",
        shadowOffset: { width: 0, height: 1, },
        elevation: 300,
        // top: 200,
        // height:"20%",
        height: Dimensions.get('window').height,
        backgroundColor: "rgba(100,100,100, 0.8)",
      },
    })
  },
  orderModalView: {
    ...Platform.select({
      ios: {
        borderRadius: 20,
        top: normalize(170),
        // bottom: '20%',
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
        // shadowRadius: 3.84,
        elevation: 5
      },
      android: {
        opacity: 1.25,
        backgroundColor: '#FFFFFF',
        marginTop: normalize(170),
        marginRight: normalize(30),
        marginLeft: normalize(30),
        borderRadius: normalize(40),
        shadowColor: "#232324",

        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        elevation: 5
      }
    })
  },
  notifyModalView: {
    ...Platform.select({
      ios: {
        opacity: 1.25,
        backgroundColor: '#FFFFFF',
        marginTop: normalize(60),
        marginRight: normalize(35),
        marginLeft: normalize(35),
        borderRadius: normalize(50),
        shadowColor: "#232324",
        // marginLeft: 20,
        // marginRight: 20,
        // backgroundColor: "white",
        // opacity: 1.25,
        // paddingLeft: 5,
        // paddingRight: 5,
        // shadowColor: "#232324",

        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        // shadowRadius: 3.84,
        elevation: 5
      },
      android: {
        opacity: 1.25,
        backgroundColor: '#FFFFFF',
        marginTop: normalize(60),
        marginRight: normalize(35),
        marginLeft: normalize(35),
        borderRadius: normalize(50),
        shadowColor: "#232324",

        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        elevation: 5
      }
    })
  },
  notifyModal_row: {
    ...Platform.select({
      ios: {
        height: normalize(110),
        marginTop: normalize(25),
        paddingLeft: normalize(18),
        paddingRight: normalize(18),
        flexShrink: 1,
      },
      android: {
        height: normalize(120),
        marginTop: normalize(10),
        paddingLeft: normalize(18),
        paddingRight: normalize(18),
        flexShrink: 1
      }
    })
  },
  notifyModal_last_row: {
    ...Platform.select({
      ios: {
        height: normalize(25),
        marginTop: normalize(5),
        paddingLeft: normalize(18),
        paddingRight: normalize(18),
        flexShrink: 1
      },
      android: {
        height: normalize(25),
        marginTop: normalize(5),
        marginBottom: normalize(5),
        paddingLeft: normalize(18),
        paddingRight: normalize(18),
        flexShrink: 1
      }
    })
  },
  notifyModal_row_text: {
    ...Platform.select({
      ios: {
        fontSize: 17,
        fontFamily: 'Inter-Black',
      },
      android: {
        fontSize: 17,
        fontFamily: 'Inter-Black',
      }
    })
  },
  notifyModal_button_view: {
    ...Platform.select({
      ios: {
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: normalize(25),
        marginBottom: normalize(25),
      },
      android: {
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: normalize(25),
        marginBottom: normalize(25),
      }
    })
  },
  notifyModal_button_row: {
    ...Platform.select({
      ios: {
        backgroundColor: '#1987B8',
        height: normalize(40),
        width: normalize(140),
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: normalize(50)
      },
      android: {
        backgroundColor: '#1987B8',
        height: normalize(40),
        width: normalize(140),
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: normalize(50)
      }
    })
  },
  notifyModal_button_text: {
    ...Platform.select({
      ios: {
        fontFamily: 'Inter-Black',
        fontSize: 20,
        color: '#FFFFFF',
      },
      android: {
        fontFamily: 'Inter-Black',
        fontSize: 20,
        color: '#FFFFFF',
      }
    })
  },
})