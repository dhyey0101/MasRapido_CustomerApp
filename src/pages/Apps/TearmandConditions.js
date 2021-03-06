import React, { Component } from 'react';
import { BackHandler, AsyncStorage, Alert, StyleSheet, Text, View, Image, TextInput, TouchableOpacity, StatusBar, ScrollView, FlatList, RefreshControl, Dimensions, ActivityIndicator } from 'react-native';
import { Col, Row, Grid } from "react-native-easy-grid";
import { t } from '../../../locals';
import { NavigationEvents } from 'react-navigation';
import normalize from 'react-native-normalize';


export default class TearmandConditions extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loader: false,

        };
    }

    static navigationOptions = ({ navigation }) => {
        return {
            headerShown: false,
        };
    };
    toggleDrawer = ({ navigation }) => {
        this.props.navigation.toggleDrawer();
    };

    _onBlurr = () => {
        BackHandler.removeEventListener('hardwareBackPress',
            this._handleBackButtonClick);
    }

    _onFocus = () => {
        BackHandler.addEventListener('hardwareBackPress',
            this._handleBackButtonClick);
    }

    _handleBackButtonClick = () => this.props.navigation.navigate('MarketPlace')

    render() {
        const { navigate } = this.props.navigation;
        const { loader } = this.state;
        if (!loader) {
            return (
                <View style={styles.container}>
                    <NavigationEvents
                        onWillFocus={this._onFocus}
                        onWillBlur={this._onBlurr}
                    />
                    <StatusBar />
                    <Row style={styles.Navebar}>
                        <TouchableOpacity onPress={() => navigate('MarketPlace')} style={{ width: '50%' }}>
                            <Col style={{ paddingLeft: 40 }}>
                                <Image source={require('../../images/Back-Arrow.png')} style={styles.BackArrow} />
                            </Col>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={this.toggleDrawer.bind(this)} style={{ width: '50%' }}>
                            <Col style={{ alignItems: 'flex-end', paddingRight: 40, }}>
                                <Image source={require('../../images/Menu.png')} style={styles.Menu} />
                            </Col>
                        </TouchableOpacity>
                    </Row>

                    <Row style={{ alignItems: 'center', height: normalize(30), marginBottom: normalize(10), }}>
                        <Text style={styles.Shipping}>
                            {t("Terms & Conditions")}
                        </Text>
                    </Row>
                    {/* <Row style={styles.container}>
                    <Image source={require('../../images/Logo.png')} style={styles.Logo}/> 
                </Row> */}

                    <Row style={{ marginLeft: 10, marginRight: 10, }}>
                        <Image source={require('../../images/Logo.png')} style={styles.Logo} />
                        <ScrollView showsVerticalScrollIndicator={false}>

                            <Text style={styles.Heading}>
                                {t('FOREWORD')}
                            </Text>
                            <Text style={styles.SubText}>
                                {t('MasRapido is a company specialized in Delivery, whose main activity is the development and management of a technological platform through which use is made of a mobile application (APP) in which certain Companies and Technical Suppliers from different areas of Panama are allowed to offer its services through the same, and where appropriate, if the users of the APP and consumers of the Establishments so request through the APP, for the immediate delivery of the Products requested')}
                            </Text>
                            <Text style={styles.SubText}>
                                {t('We transport Merchandise, Declared Values, Suitcases, Small Equipment, Removals and Spare Parts, in turn, search for suitcases in terminals, signature and stamp of documents in public and private institutions, payments of public services, checks and courier services in general and crane services . To speed up your maintenance requirements for your house, apartment or establishment, we offer you the diagnosis service and quick assistance from technicians in air conditioning, locksmithing, electricity, fumigation, cleaning, general mechanics, plumbing')}
                            </Text>
                            <Col style={{ marginTop: 20 }}>
                                <Text style={styles.RedText}
                                >{t('All the basics, terms and')}
                                </Text>
                                <Text style={styles.RedText}
                                >{t('conditions described below')},
                        </Text>
                                <Text style={styles.RedText}
                                >{t('are explained in order to provide')}
                                </Text>
                                <Text style={styles.RedText}
                                >{t('the proper use and operation of')}
                                </Text>
                                <Text style={styles.RedText}
                                >{t('Faster, both for Clients and')}
                                </Text>
                                <Text style={styles.RedText}
                                >{t('for Deliverers and the Administration of')}
                                </Text>
                                <Text style={styles.RedText}
                                >MasRapido
                        </Text>
                            </Col>

                            {/* <Text style={styles.SubHeading}>
                    {t("MasRapido Terms and Conditions of Service")}
                    </Text>
                    
                    <Text style={styles.SubText}>
                        Bienvenido a MasRapido. Esta p??gina (junto con los documentos a los que se hace referencia en ella) le informa de los t??rminos (las <Text style={{fontFamily: 'Inter-Black',}}>"Condiciones"</Text>) que se aplican cuando usted solicita cualquier servicio del men?? (los <Text style={{fontFamily: 'Inter-Black',}}>"Productos"</Text>) de aplicaciones m??viles y servicios relacionados (cada uno de los cuales se denomina una <Text style={{fontFamily: 'Inter-Black',}}>"Aplicaci??n"</Text>)
                    </Text>
                    <Text style={styles.SubText}>
                        Por favor, lea estas Condiciones cuidadosamente antes de pedir cualquier Producto de nuestra Aplicaci??n. Si tiene alguna pregunta relacionada con estas Condiciones, p??ngase en contacto con <Text style={{fontFamily: 'Inter-Black',}}>atencion@masrapido.pa</Text> antes de realizar un pedido. Si usted es un consumidor, tiene ciertos derechos cuando pide Productos usando nuestra Aplicaci??n. Sus derechos no se ven afectados por estas Condiciones, que se aplican adicionalmente y no los sustituyen. Al configurar su cuenta de MasRapido, usted confirma que acepta estas Condiciones.
                    </Text>
                    <Text style={styles.Points}>
                        1. Informaci??n Sobre Nosotros
                    </Text>
                    <Text style={styles.SubText}>
                        MASRAPIDO.pa es operado por MAS VERDE S.A., una empresa constituida en Provincia de Panam??, con domicilio social en Corregimiento Bella Vista, urbanizaci??n calle 50, calle 50, Edif. PH El Ejecutivo, piso 3, Local 3. Los t??rminos "nosotros" o "MasRapido" en estas Condiciones se refieren a Mas Verde S.A.
                    </Text>
                    <Text style={styles.Points}>
                        2. Finalidad
                    </Text>
                    <Text style={styles.SubText}>
                        Nuestro prop??sito es proporcionarle un servicio sencillo y c??modo, de encomiendas, mensajer??a, mudanza, asistente de gr??a y Servicio t??cnico especializado. MasRapido comercializa con empresas debidamente registradas y outsorcing.
                    </Text>
                    <Text style={styles.Points}>
                        3. Su Cuenta
                    </Text>
                    <Text style={styles.SubText}>
                        Antes de poder realizar solicitud de alguno de nuestros Servicios debe abrir una cuenta en MasRapido utilizando nuestra Aplicaci??n. Al abrir una cuenta, puede crear una contrase??a u otro m??todo de acceso seguro, y tambi??n puede que tenga que proporcionar los datos de su tarjeta de cr??dito. Debe mantener en secreto cualquier contrase??a que cree, o cualquier otro m??todo de inicio de sesi??n seguro, e impedir que otras personas accedan a su cuenta de correo electr??nico o tel??fono m??vil. Si otra persona utiliza estos m??todos para acceder a su cuenta, usted ser?? responsable de pagar por cualquier Servicio solicitado y no nos haremos responsables de cualquier otra p??rdida que sufra, a menos que la persona que utilice su contrase??a la haya obtenido porque nosotros no la hayamos mantenido segura.
                    </Text>
                    <Text style={styles.SubText}>
                        Usted puede cerrar su cuenta en cualquier momento solicit??ndolo en la secci??n de su cuenta de nuestra App o poni??ndose en contacto con nosotros utilizando los datos de contacto de MasRapido. Podemos suspender el acceso a su cuenta, o cerrarla permanentemente, si creemos que su cuenta ha sido utilizada por otra persona.
                    </Text> */}
                            {/* <Text style={styles.Points}>
                        4. Disponibilidad Del Servicio
                    </Text>
                    <Text style={styles.SubText}>
                        Cada Empresa Asociada tiene un ??rea de entrega prescrita. Esta ??rea de entrega puede cambiar en cualquier momento debido a factores como el clima o la demanda de nuestro servicio. Esto es as?? para asegurar que las Entregas lleguen a su puerta de la mejor manera posible. Cada uno de nuestros Empresas Asociadas al App tienen su propio horario de apertura y cierre, lo que significa que la disponibilidad de nuestro Servicio, depender?? de su ??rea. Si usted trata de solicitar un servicio a una direcci??n de entrega fuera del ??rea de entrega o de las horas de operaci??n de un Establecimiento, o si la Aplicaci??n no est?? disponible por cualquier raz??n, le notificaremos que el pedido no ser?? posible antes de confirmarle el pedido.
                    </Text>
                    <Text style={styles.Points}>
                        5. Pedidos - Encomiendas
                    </Text>
                    <Text style={styles.SubText}>
                        Cuando usted hace un pedido a trav??s de nuestra Aplicaci??n, el mismo debe ser aceptado por nosotros o por el Establecimiento antes de ser confirmado. Le enviaremos una notificaci??n si su pedido ha sido aceptado (el 
                        <Text style={{fontFamily: 'Inter-Black',}}>"Aviso de Confirmaci??n"</Text>). El contrato para el suministro de cualquier Servicio que usted haya solicitado entra en vigor cuando enviamos el Aviso de Confirmaci??n. Usted es responsable de pagar todos los Servicios solicitados usando su cuenta, as?? como los gastos de env??o relacionados, y de cumplir con estas Condiciones, incluso si usted ha pedido el Servicio para otra persona. Debe tomar en cuenta que algunos Establecimientos operan con una pol??tica de valor m??nimo de pedido. Esto se mostrar?? en nuestra Aplicaci??n. 
                    </Text>
                    <Text style={styles.Points}>
                        6. Entrega - Encomiendas
                    </Text>
                    <Text style={styles.SubText}>
                        Cuando realice la solicitud de un Servicio, tendr?? la opci??n de realizarlo como una Entrega a la mayor brevedad posible o como una Entrega programada. En el caso de una Entrega a la mayor brevedad posible, le informaremos del plazo de entrega estimado de su Producto antes de realizar el pedido,??<Text style={{fontFamily: 'Inter-Black',}}>pero intentaremos entregarlo lo antes posible, puede generar cargos adicionales</Text>; por lo tanto, debe estar disponible para aceptar la entrega a partir del momento en que realice el pedido. Para una Entrega programada, le diremos la hora a la que se espera que se entregue el Producto; usted debe estar disponible para aceptar la entrega durante diez minutos antes y diez minutos despu??s de esa hora.
                    </Text>
                    <Text style={styles.SubText}>
                        Desafortunadamente, a pesar de nuestros mejores esfuerzos y los Establecimientos, las cosas no siempre van seg??n lo planeado y factores como el tr??fico y las condiciones clim??ticas pueden impedirnos entregar su Servicio a tiempo. Si su pedido se retrasa m??s de 15 minutos y no le hubi??ramos notificado dicho retraso d??ndole la opci??n de cancelar su pedido, nos pondremos en contacto con usted para acordar una soluci??n satisfactoria, a menos que usted haya causado el retraso (por ejemplo, porque nos facilit?? una direcci??n incorrecta o no acudi?? a recibirnos), en caso de que el Servicio sea notificado que ha llegado a destino y usted se retrasa m??s de 10 min para recibir, nuestros Repartidores tendr??n el derecho de retirarse del lugar.
                    </Text>
                    <Text style={styles.SubText}>
                        Intentaremos realizar la Entrega en la direcci??n que usted nos proporcione cuando realice su pedido. Si necesita cambiar la direcci??n de entrega despu??s de haber realizado su pedido, es posible que podamos cambiar a una direcci??n alternativa que est?? registrada en su cuenta si nos avisa antes de que el Repartidor haya aceptado el pedido y la nueva direcci??n est?? dentro de la misma zona que la direcci??n a la que pidi?? originalmente su Producto. Si no podemos cambiar la direcci??n de entrega, usted tiene la opci??n de cancelar el pedido, pero si el producto ha sido entregado por el establecimiento a al Repartidor, se le cobrar?? el precio total del Producto, y si el Repartidor ha aceptado el pedido tambi??n se le cobrar??n los gastos de entrega.
                    </Text>
                    <Text style={styles.SubText}>
                        Se le cobrar?? por el Producto y por la entrega en el caso de una entrega fallida si usted ha sido el causante por cualquier raz??n, entre las que se incluyen (sin limitaci??n):
                    </Text>
                    <Text style={styles.SubText}>
                        ??? Usted no acudi?? a recibirnos, no respondi?? el tel??fono cuando el Repartidor se intent?? contactar con usted a trav??s del n??mero de tel??fono que usted nos hab??a proporcionado y/o usted respondi?? el tel??fono, pero luego no recogi?? el pedido dentro de un plazo razonable de tiempo de espera del Repartidor y el Repartidor no pudo encontrar un lugar seguro para dejar la encomienda.
                    </Text>
                    <Text style={styles.Points}>
                        7. Sus Derechos Si Hay Alg??n Problema Con Sus Productos
                    </Text>
                    <Text style={styles.SubText}>
                        Usted tiene derecho a recibir productos que cumplan con su descripci??n, que sean de calidad satisfactoria y que cumplan con cualquier requisito espec??fico que usted nos indique (y que nosotros aceptemos) antes de realizar su pedido. Si usted cree que los Productos que le han sido entregados no cumplen con estos requisitos, por favor h??ganoslo saber. Podemos solicitar una fotograf??a que muestre el problema si es algo que se puede apreciar inspeccionando los Productos. MasRapido intentar?? solventar el inconveniente.
                    </Text>
                    <Text style={styles.Points}>
                        8. Cancelaci??n - Encomiendas
                    </Text>
                    <Text style={styles.SubText}>
                        Usted puede cancelar un pedido sin cargo en cualquier momento antes de que nuestro Repartidor no haya atendido la solicitud de Servicio (un "Pedido Iniciado"). Si desea cancelar un pedido antes de que se convierta en un Pedido Iniciado, p??ngase en contacto con nosotros inmediatamente, a trav??s de nuestra Aplicaci??n y si el Establecimiento confirma que el pedido no era un Pedido Iniciado. Si cancela un pedido despu??s de que se convierta en un Pedido Iniciado, se le cobrar?? el precio completo de los Productos, y si el Repartidor ha aceptado el pedido, tambi??n se le cobrar??n los gastos de entrega.
                    </Text>
                    <Text style={styles.SubText}>
                        MasRapido y el Establecimiento pueden notificarle que un pedido ha sido cancelado en cualquier momento. No se le cobrar??n los pedidos cancelados por nosotros o por el Establecimiento.
                    </Text>
                    <Text style={styles.Points}>
                        9. Precios, Pago Y Ofertas
                    </Text>
                    <Text style={styles.SubText}>
                        Los precios incluyen el ITBMS. Usted confirma que utiliza nuestro Servicio para uso personal, no comercial, salvo que nos solicite factura. MasRapido puede establecer precios din??micos, lo que significa que los precios de los Productos y la entrega pueden cambiar mientras usted est?? navegando. Nos reservamos el derecho a aplicar un Cargo por Servicio, sujeto a cambios, por la prestaci??n de nuestros Servicios. Le notificaremos cualquier Cargo por Servicio e impuestos antes de la compra en la p??gina de pago de nuestra Aplicaci??n. Ning??n cambio afectar?? a los pedidos confirmados existentes, a menos que exista un error evidente en los precios. Los cambios en los precios tampoco afectar??n a los pedidos en curso y que aparezcan en su cesta de la App, siempre que complete el pedido en las 2 horas siguientes a la creaci??n de la cesta. Si no concluye el pedido antes de 2 horas, los art??culos ser??n retirados de su cesta autom??ticamente y se aplicar?? el cambio de precio. Si hay un error obvio en el precio, le notificaremos tan pronto como podamos y usted tendr?? la opci??n de confirmar el pedido al precio original o cancelarlo sin. ??En caso de que la entrega la realice MasRapido o cualquier Establecimiento, nosotros o el Establecimiento tambi??n podemos cobrarle una tarifa de entrega. En este caso, se le notificar?? durante el proceso de pedido antes de que complete el mismo.
                    </Text>
                    <Text style={styles.SubText}>
                        El precio total de su pedido se indicar?? en la p??gina de pago de nuestra Aplicaci??n, incluidos los precios de los Productos, Entrega y el Cargo por Servicio e impuestos.
                    </Text>
                    <Text style={styles.SubText}>
                        El pago de todos los Servicios, Productos y Entregas se puede realizar en nuestra Aplicaci??n mediante tarjeta de cr??dito, u otro m??todo de pago puesto a disposici??n por MasRapido. Una vez confirmado su pedido, su tarjeta de cr??dito ser?? autorizada y el importe total se marcar?? para su pago. El pago se realiza directamente a MasRapido actuando como agente en nombre del Usuario o Establecimiento.
                    </Text>
                    <Text style={styles.SubText}>
                        Estamos autorizados por los Establecimientos y/o Usuarios a aceptar el pago en su nombre, por lo que el pago del precio de cualquier Producto o gastos de entrega a nosotros le liberar?? de su obligaci??n de pago del precio al Establecimiento.
                    </Text>
                    <Text style={styles.Points}>
                        10. Propinas
                    </Text>
                    <Text style={styles.SubText}>
                        Cuando realice un pedido, tendr?? la opci??n de realizar un pago discrecional de una propina o gratificaci??n a MasRapido o al Repartidor adem??s del precio de su Servicio. Su repartidor recibir?? el 100% de cualquier pago discrecional que usted elija hacer.
                    </Text>
                    <Text style={styles.Points}>
                        11. Servicios T??cnicos
                    </Text>
                    <Text style={styles.SubText}>
                        MASRAPIDO dispone para usted la opci??n de Servicios T??cnicos a trav??s del App, puede solicitar la visita de un t??cnico id??neo de acuerdo a sus necesidades.Disponiendo actualmente de t??cnicos en: Aire acondicionado, cerrajer??a, electricidad, fumigaci??n, limpieza, mec??nica en general, plomer??a.
                    </Text>
                    <Text style={styles.Points}>
                        12. Como Generar una Cita
                    </Text>
                    <Text style={styles.SubText}>
                        Para poder cumplir con los est??ndares en nuestros clientes usted podr?? solicitar su cita a trav??s de la App y est?? se programar?? en (24) horas.
                        Una vez su cita haya sido programada y confirmada la empresa le notificar?? a trav??s de un <Text style={{fontFamily: 'Inter-Black',}}>???Aviso de Confirmaci??n???</Text> con los datos del t??cnico, la fecha y horario en que este le asistir??
                    </Text>
                    <Text style={styles.Points}>
                        13. Precios ??? Servicios T??cnicos
                    </Text>
                    <Text style={styles.SubText}>
                        Los precios para la solicitud de citas en servicios t??cnicos var??an de acuerdo a la especialidad. Los costos establecidos en la App de MasRapido al momento de solicitar una cita <Text style={{fontFamily: 'Inter-Black',}}>cubren ??nicamente la visita o diagn??stico del t??cnico</Text>, de acuerdo sea el caso. El coste de materiales, mano de obra por aver??as adicionales ser?? cotizado en el momento por el t??cnico bas??ndose en el <Text style={{fontFamily: 'Inter-Black',}}>???Tarifario de Referencia???</Text> disponible en la App MasRapido.
                        El tarifario de referencia estar?? disponible en el men?? de la App MasRapido para disponibilidad de los usuarios con el fin de conocer una aproximaci??n del coste total del servicio
                    </Text>
                    <Text style={styles.Points}>
                        14. Pagos ??? Servicios T??cnicos
                    </Text>
                    <Text style={styles.SubText}>
                        Para poder solicitar una cita de servicio t??cnico deber?? tener registrado un m??todo de pago en su cuenta de MasRapido o tener la disponibilidad de realizar el pago a trav??s de transferencias bancarias, Yappy, NEQUI. <Text style={{fontFamily: 'Inter-Black',}}>Es decir el m??todo de pago en efectivo no est?? disponible para solicitud de citas de servicios t??cnicos.</Text>
                        Una vez usted haya realizado el pago se proceder?? a aceptar su solicitud y asignar el t??cnico id??neo para la visita, se confirmar?? a trav??s de un <Text style={{fontFamily: 'Inter-Black',}}>???Aviso de Confirmaci??n???</Text> con los datos del t??cnico, la fecha y horario en que este le asistir??.
                        Usted dispone de programar su cita al d??a y la hora que le sea conveniente, siempre y cuando sea con (24) veinticuatro horas de anticipaci??n.
                    </Text>
                    <Text style={styles.Points}>
                        15. Cancelaci??n ??? Servicios T??cnicos
                    </Text>
                    <Text style={styles.SubText}>
                        Si usted ha solicitado y programado una cita y desea cancelarla antes de la visita del t??cnico deber?? hacerlo al menos (12) doce horas antes de lo programado.
                        De acuerdo sea el caso se le ofrecer?? reprogramar su cita o una acreditaci??n para una pr??xima cita de servicio t??cnico. En el caso de no reprogramar la cita o no desea optar por una acreditaci??n se le har?? un reembolso del 80% del costo total cancelado en un periodo de (7) d??as h??biles a trav??s del m??todo de pago que usted haya utilizado; en el caso de tarjetas de cr??ditos los tr??mites de reembolso se realizar??n dentro del periodo mencionado pero la acreditaci??n a la tarjeta de cr??dito se reflejar?? de acuerdo a la entidad bancaria correspondiente. Se cobrar?? un 20% del costo total que usted cancelo por gastos administrativos
                    </Text>
                    <Text style={styles.Points}>
                        16. Nuestra Responsabilidad Por La Perdida O Da??o Que Usted Sufra
                    </Text>
                    <Text style={styles.SubText}>
                        Somos responsables ante usted por cualquier p??rdida o da??o que sufra y que sea un resultado previsible de nuestro incumplimiento de estas Condiciones o de no aplicar el cuidado razonable en relaci??n con el uso de nuestro Servicio. No nos hacemos responsables de ninguna p??rdida o da??o que no sea previsible. La p??rdida o da??o es "previsible" si es obvio que va a suceder, o si usted nos dijo que podr??a suceder, por ejemplo, si nos informa, antes de realizar un pedido, sobre circunstancias particulares que podr??an aumentar el riesgo de p??rdida o da??o derivado de nuestro incumplimiento de estas Condiciones.
                    </Text>
                    <Text style={styles.SubText}>
                        No excluimos ni limitamos nuestra responsabilidad hacia usted por p??rdidas o da??os cuando sea ilegal hacerlo. Esto incluye cualquier responsabilidad por muerte o lesiones personales causadas por nuestro incumplimiento, o el incumplimiento de nuestros empleados, agentes o subcontratistas, en el uso de cuidado razonable; por fraude; por incumplimiento de sus derechos en relaci??n con los Productos; o por Productos defectuosos. Sujeto al p??rrafo anterior, no nos hacemos responsables de ninguna p??rdida o da??o que usted sufra como resultado de su propio incumplimiento de estas Condiciones, o como resultado de cualquier fallo de hardware o software, salvo en el caso de fallo de nuestra Aplicaci??n.
                    </Text>
                    <Text style={styles.SubText}>
                        Nada en estos t??rminos y condiciones debe entenderse como constitutivo de una relaci??n de agencia entre MasRapido o como una autorizaci??n a MasRapido para suscribir compromisos en su nombre.
                    </Text>
                    <Text style={styles.Points}>
                        17. Protecci??n De Datos
                    </Text>
                    <Text style={styles.SubText}>
                        Procesamos sus datos personales de acuerdo con nuestra??Pol??tica de Privacidad, que se encuentra aqu??.
                    </Text> */}
                        </ScrollView>
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
// empty component
const EmptyComponent = ({ title }) => (
    <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>{title}</Text>
    </View>
);

const styles = StyleSheet.create({
    emptyContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        marginTop: "50%",
    },
    emptyText: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        fontSize: 18,
        color: "#000",
    },
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: "#fdfdfd",
        // height: 30,

    },
    mainContainer: {
        flex: 1,
        width: '100%',
        // justifyContsent: "center",
        //  backgroundColor: "#0f4471",
    },
    Navebar: {
        ...Platform.select({
            ios: {
                height: "5%",
                // paddingBottom: 50, 
                marginTop: 30
            },
            android: {
                height: normalize(35),
            }
        })
    },
    BackArrow: {
        width: 25,
        height: 25,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 10,
        marginTop: 10,
    },
    Menu: {
        width: 25,
        height: 25,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
        marginTop: 10,

    },
    Shipping: {
        ...Platform.select({
            ios: {
                fontSize: 20,
                padding: 10,
                fontFamily: 'Inter-Black',
                color: "#d62326",
                alignItems: 'center',
                height: 35,

            },
            android: {

                fontSize: 20,
                padding: 10,
                fontFamily: 'Inter-Black',
                color: "#d62326",
                alignItems: 'center',
            }
        })
    },
    Logo: {
        width: '100%',
        height: '49%',
        justifyContent: 'center',
        alignItems: 'center',
        // marginRight: 10,
        marginTop: '50%',
        opacity: 0.2,
        position: 'absolute',


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

    Heading: {
        fontFamily: 'Inter-Black',
        fontSize: 25,
        color: '#061f57',
    },

    SubText: {
        fontSize: 18,
        marginTop: 10,
        fontFamily: 'Inter-Black',
    },

    RedText: {
        fontSize: 18,
        color: '#c00000',
        fontFamily: 'Inter-Black',
        // alignItems:'center',
        textAlign: 'center'
    },

    SubHeading: {
        fontSize: 25,
        marginTop: 10,
        fontFamily: 'Inter-Black',
    },

    Points: {
        fontSize: 20,
        marginTop: 10,
        fontFamily: 'Inter-Black',
    }

});