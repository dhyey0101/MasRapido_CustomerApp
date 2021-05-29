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
                        Bienvenido a MasRapido. Esta página (junto con los documentos a los que se hace referencia en ella) le informa de los términos (las <Text style={{fontFamily: 'Inter-Black',}}>"Condiciones"</Text>) que se aplican cuando usted solicita cualquier servicio del menú (los <Text style={{fontFamily: 'Inter-Black',}}>"Productos"</Text>) de aplicaciones móviles y servicios relacionados (cada uno de los cuales se denomina una <Text style={{fontFamily: 'Inter-Black',}}>"Aplicación"</Text>)
                    </Text>
                    <Text style={styles.SubText}>
                        Por favor, lea estas Condiciones cuidadosamente antes de pedir cualquier Producto de nuestra Aplicación. Si tiene alguna pregunta relacionada con estas Condiciones, póngase en contacto con <Text style={{fontFamily: 'Inter-Black',}}>atencion@masrapido.pa</Text> antes de realizar un pedido. Si usted es un consumidor, tiene ciertos derechos cuando pide Productos usando nuestra Aplicación. Sus derechos no se ven afectados por estas Condiciones, que se aplican adicionalmente y no los sustituyen. Al configurar su cuenta de MasRapido, usted confirma que acepta estas Condiciones.
                    </Text>
                    <Text style={styles.Points}>
                        1. Información Sobre Nosotros
                    </Text>
                    <Text style={styles.SubText}>
                        MASRAPIDO.pa es operado por MAS VERDE S.A., una empresa constituida en Provincia de Panamá, con domicilio social en Corregimiento Bella Vista, urbanización calle 50, calle 50, Edif. PH El Ejecutivo, piso 3, Local 3. Los términos "nosotros" o "MasRapido" en estas Condiciones se refieren a Mas Verde S.A.
                    </Text>
                    <Text style={styles.Points}>
                        2. Finalidad
                    </Text>
                    <Text style={styles.SubText}>
                        Nuestro propósito es proporcionarle un servicio sencillo y cómodo, de encomiendas, mensajería, mudanza, asistente de grúa y Servicio técnico especializado. MasRapido comercializa con empresas debidamente registradas y outsorcing.
                    </Text>
                    <Text style={styles.Points}>
                        3. Su Cuenta
                    </Text>
                    <Text style={styles.SubText}>
                        Antes de poder realizar solicitud de alguno de nuestros Servicios debe abrir una cuenta en MasRapido utilizando nuestra Aplicación. Al abrir una cuenta, puede crear una contraseña u otro método de acceso seguro, y también puede que tenga que proporcionar los datos de su tarjeta de crédito. Debe mantener en secreto cualquier contraseña que cree, o cualquier otro método de inicio de sesión seguro, e impedir que otras personas accedan a su cuenta de correo electrónico o teléfono móvil. Si otra persona utiliza estos métodos para acceder a su cuenta, usted será responsable de pagar por cualquier Servicio solicitado y no nos haremos responsables de cualquier otra pérdida que sufra, a menos que la persona que utilice su contraseña la haya obtenido porque nosotros no la hayamos mantenido segura.
                    </Text>
                    <Text style={styles.SubText}>
                        Usted puede cerrar su cuenta en cualquier momento solicitándolo en la sección de su cuenta de nuestra App o poniéndose en contacto con nosotros utilizando los datos de contacto de MasRapido. Podemos suspender el acceso a su cuenta, o cerrarla permanentemente, si creemos que su cuenta ha sido utilizada por otra persona.
                    </Text> */}
                            {/* <Text style={styles.Points}>
                        4. Disponibilidad Del Servicio
                    </Text>
                    <Text style={styles.SubText}>
                        Cada Empresa Asociada tiene un área de entrega prescrita. Esta área de entrega puede cambiar en cualquier momento debido a factores como el clima o la demanda de nuestro servicio. Esto es así para asegurar que las Entregas lleguen a su puerta de la mejor manera posible. Cada uno de nuestros Empresas Asociadas al App tienen su propio horario de apertura y cierre, lo que significa que la disponibilidad de nuestro Servicio, dependerá de su área. Si usted trata de solicitar un servicio a una dirección de entrega fuera del área de entrega o de las horas de operación de un Establecimiento, o si la Aplicación no está disponible por cualquier razón, le notificaremos que el pedido no será posible antes de confirmarle el pedido.
                    </Text>
                    <Text style={styles.Points}>
                        5. Pedidos - Encomiendas
                    </Text>
                    <Text style={styles.SubText}>
                        Cuando usted hace un pedido a través de nuestra Aplicación, el mismo debe ser aceptado por nosotros o por el Establecimiento antes de ser confirmado. Le enviaremos una notificación si su pedido ha sido aceptado (el 
                        <Text style={{fontFamily: 'Inter-Black',}}>"Aviso de Confirmación"</Text>). El contrato para el suministro de cualquier Servicio que usted haya solicitado entra en vigor cuando enviamos el Aviso de Confirmación. Usted es responsable de pagar todos los Servicios solicitados usando su cuenta, así como los gastos de envío relacionados, y de cumplir con estas Condiciones, incluso si usted ha pedido el Servicio para otra persona. Debe tomar en cuenta que algunos Establecimientos operan con una política de valor mínimo de pedido. Esto se mostrará en nuestra Aplicación. 
                    </Text>
                    <Text style={styles.Points}>
                        6. Entrega - Encomiendas
                    </Text>
                    <Text style={styles.SubText}>
                        Cuando realice la solicitud de un Servicio, tendrá la opción de realizarlo como una Entrega a la mayor brevedad posible o como una Entrega programada. En el caso de una Entrega a la mayor brevedad posible, le informaremos del plazo de entrega estimado de su Producto antes de realizar el pedido, <Text style={{fontFamily: 'Inter-Black',}}>pero intentaremos entregarlo lo antes posible, puede generar cargos adicionales</Text>; por lo tanto, debe estar disponible para aceptar la entrega a partir del momento en que realice el pedido. Para una Entrega programada, le diremos la hora a la que se espera que se entregue el Producto; usted debe estar disponible para aceptar la entrega durante diez minutos antes y diez minutos después de esa hora.
                    </Text>
                    <Text style={styles.SubText}>
                        Desafortunadamente, a pesar de nuestros mejores esfuerzos y los Establecimientos, las cosas no siempre van según lo planeado y factores como el tráfico y las condiciones climáticas pueden impedirnos entregar su Servicio a tiempo. Si su pedido se retrasa más de 15 minutos y no le hubiéramos notificado dicho retraso dándole la opción de cancelar su pedido, nos pondremos en contacto con usted para acordar una solución satisfactoria, a menos que usted haya causado el retraso (por ejemplo, porque nos facilitó una dirección incorrecta o no acudió a recibirnos), en caso de que el Servicio sea notificado que ha llegado a destino y usted se retrasa más de 10 min para recibir, nuestros Repartidores tendrán el derecho de retirarse del lugar.
                    </Text>
                    <Text style={styles.SubText}>
                        Intentaremos realizar la Entrega en la dirección que usted nos proporcione cuando realice su pedido. Si necesita cambiar la dirección de entrega después de haber realizado su pedido, es posible que podamos cambiar a una dirección alternativa que esté registrada en su cuenta si nos avisa antes de que el Repartidor haya aceptado el pedido y la nueva dirección está dentro de la misma zona que la dirección a la que pidió originalmente su Producto. Si no podemos cambiar la dirección de entrega, usted tiene la opción de cancelar el pedido, pero si el producto ha sido entregado por el establecimiento a al Repartidor, se le cobrará el precio total del Producto, y si el Repartidor ha aceptado el pedido también se le cobrarán los gastos de entrega.
                    </Text>
                    <Text style={styles.SubText}>
                        Se le cobrará por el Producto y por la entrega en el caso de una entrega fallida si usted ha sido el causante por cualquier razón, entre las que se incluyen (sin limitación):
                    </Text>
                    <Text style={styles.SubText}>
                        ● Usted no acudió a recibirnos, no respondió el teléfono cuando el Repartidor se intentó contactar con usted a través del número de teléfono que usted nos había proporcionado y/o usted respondió el teléfono, pero luego no recogió el pedido dentro de un plazo razonable de tiempo de espera del Repartidor y el Repartidor no pudo encontrar un lugar seguro para dejar la encomienda.
                    </Text>
                    <Text style={styles.Points}>
                        7. Sus Derechos Si Hay Algún Problema Con Sus Productos
                    </Text>
                    <Text style={styles.SubText}>
                        Usted tiene derecho a recibir productos que cumplan con su descripción, que sean de calidad satisfactoria y que cumplan con cualquier requisito específico que usted nos indique (y que nosotros aceptemos) antes de realizar su pedido. Si usted cree que los Productos que le han sido entregados no cumplen con estos requisitos, por favor háganoslo saber. Podemos solicitar una fotografía que muestre el problema si es algo que se puede apreciar inspeccionando los Productos. MasRapido intentará solventar el inconveniente.
                    </Text>
                    <Text style={styles.Points}>
                        8. Cancelación - Encomiendas
                    </Text>
                    <Text style={styles.SubText}>
                        Usted puede cancelar un pedido sin cargo en cualquier momento antes de que nuestro Repartidor no haya atendido la solicitud de Servicio (un "Pedido Iniciado"). Si desea cancelar un pedido antes de que se convierta en un Pedido Iniciado, póngase en contacto con nosotros inmediatamente, a través de nuestra Aplicación y si el Establecimiento confirma que el pedido no era un Pedido Iniciado. Si cancela un pedido después de que se convierta en un Pedido Iniciado, se le cobrará el precio completo de los Productos, y si el Repartidor ha aceptado el pedido, también se le cobrarán los gastos de entrega.
                    </Text>
                    <Text style={styles.SubText}>
                        MasRapido y el Establecimiento pueden notificarle que un pedido ha sido cancelado en cualquier momento. No se le cobrarán los pedidos cancelados por nosotros o por el Establecimiento.
                    </Text>
                    <Text style={styles.Points}>
                        9. Precios, Pago Y Ofertas
                    </Text>
                    <Text style={styles.SubText}>
                        Los precios incluyen el ITBMS. Usted confirma que utiliza nuestro Servicio para uso personal, no comercial, salvo que nos solicite factura. MasRapido puede establecer precios dinámicos, lo que significa que los precios de los Productos y la entrega pueden cambiar mientras usted está navegando. Nos reservamos el derecho a aplicar un Cargo por Servicio, sujeto a cambios, por la prestación de nuestros Servicios. Le notificaremos cualquier Cargo por Servicio e impuestos antes de la compra en la página de pago de nuestra Aplicación. Ningún cambio afectará a los pedidos confirmados existentes, a menos que exista un error evidente en los precios. Los cambios en los precios tampoco afectarán a los pedidos en curso y que aparezcan en su cesta de la App, siempre que complete el pedido en las 2 horas siguientes a la creación de la cesta. Si no concluye el pedido antes de 2 horas, los artículos serán retirados de su cesta automáticamente y se aplicará el cambio de precio. Si hay un error obvio en el precio, le notificaremos tan pronto como podamos y usted tendrá la opción de confirmar el pedido al precio original o cancelarlo sin.  En caso de que la entrega la realice MasRapido o cualquier Establecimiento, nosotros o el Establecimiento también podemos cobrarle una tarifa de entrega. En este caso, se le notificará durante el proceso de pedido antes de que complete el mismo.
                    </Text>
                    <Text style={styles.SubText}>
                        El precio total de su pedido se indicará en la página de pago de nuestra Aplicación, incluidos los precios de los Productos, Entrega y el Cargo por Servicio e impuestos.
                    </Text>
                    <Text style={styles.SubText}>
                        El pago de todos los Servicios, Productos y Entregas se puede realizar en nuestra Aplicación mediante tarjeta de crédito, u otro método de pago puesto a disposición por MasRapido. Una vez confirmado su pedido, su tarjeta de crédito será autorizada y el importe total se marcará para su pago. El pago se realiza directamente a MasRapido actuando como agente en nombre del Usuario o Establecimiento.
                    </Text>
                    <Text style={styles.SubText}>
                        Estamos autorizados por los Establecimientos y/o Usuarios a aceptar el pago en su nombre, por lo que el pago del precio de cualquier Producto o gastos de entrega a nosotros le liberará de su obligación de pago del precio al Establecimiento.
                    </Text>
                    <Text style={styles.Points}>
                        10. Propinas
                    </Text>
                    <Text style={styles.SubText}>
                        Cuando realice un pedido, tendrá la opción de realizar un pago discrecional de una propina o gratificación a MasRapido o al Repartidor además del precio de su Servicio. Su repartidor recibirá el 100% de cualquier pago discrecional que usted elija hacer.
                    </Text>
                    <Text style={styles.Points}>
                        11. Servicios Técnicos
                    </Text>
                    <Text style={styles.SubText}>
                        MASRAPIDO dispone para usted la opción de Servicios Técnicos a través del App, puede solicitar la visita de un técnico idóneo de acuerdo a sus necesidades.Disponiendo actualmente de técnicos en: Aire acondicionado, cerrajería, electricidad, fumigación, limpieza, mecánica en general, plomería.
                    </Text>
                    <Text style={styles.Points}>
                        12. Como Generar una Cita
                    </Text>
                    <Text style={styles.SubText}>
                        Para poder cumplir con los estándares en nuestros clientes usted podrá solicitar su cita a través de la App y está se programará en (24) horas.
                        Una vez su cita haya sido programada y confirmada la empresa le notificará a través de un <Text style={{fontFamily: 'Inter-Black',}}>“Aviso de Confirmación”</Text> con los datos del técnico, la fecha y horario en que este le asistirá
                    </Text>
                    <Text style={styles.Points}>
                        13. Precios – Servicios Técnicos
                    </Text>
                    <Text style={styles.SubText}>
                        Los precios para la solicitud de citas en servicios técnicos varían de acuerdo a la especialidad. Los costos establecidos en la App de MasRapido al momento de solicitar una cita <Text style={{fontFamily: 'Inter-Black',}}>cubren únicamente la visita o diagnóstico del técnico</Text>, de acuerdo sea el caso. El coste de materiales, mano de obra por averías adicionales será cotizado en el momento por el técnico basándose en el <Text style={{fontFamily: 'Inter-Black',}}>“Tarifario de Referencia”</Text> disponible en la App MasRapido.
                        El tarifario de referencia estará disponible en el menú de la App MasRapido para disponibilidad de los usuarios con el fin de conocer una aproximación del coste total del servicio
                    </Text>
                    <Text style={styles.Points}>
                        14. Pagos – Servicios Técnicos
                    </Text>
                    <Text style={styles.SubText}>
                        Para poder solicitar una cita de servicio técnico deberá tener registrado un método de pago en su cuenta de MasRapido o tener la disponibilidad de realizar el pago a través de transferencias bancarias, Yappy, NEQUI. <Text style={{fontFamily: 'Inter-Black',}}>Es decir el método de pago en efectivo no está disponible para solicitud de citas de servicios técnicos.</Text>
                        Una vez usted haya realizado el pago se procederá a aceptar su solicitud y asignar el técnico idóneo para la visita, se confirmará a través de un <Text style={{fontFamily: 'Inter-Black',}}>“Aviso de Confirmación”</Text> con los datos del técnico, la fecha y horario en que este le asistirá.
                        Usted dispone de programar su cita al día y la hora que le sea conveniente, siempre y cuando sea con (24) veinticuatro horas de anticipación.
                    </Text>
                    <Text style={styles.Points}>
                        15. Cancelación – Servicios Técnicos
                    </Text>
                    <Text style={styles.SubText}>
                        Si usted ha solicitado y programado una cita y desea cancelarla antes de la visita del técnico deberá hacerlo al menos (12) doce horas antes de lo programado.
                        De acuerdo sea el caso se le ofrecerá reprogramar su cita o una acreditación para una próxima cita de servicio técnico. En el caso de no reprogramar la cita o no desea optar por una acreditación se le hará un reembolso del 80% del costo total cancelado en un periodo de (7) días hábiles a través del método de pago que usted haya utilizado; en el caso de tarjetas de créditos los trámites de reembolso se realizarán dentro del periodo mencionado pero la acreditación a la tarjeta de crédito se reflejará de acuerdo a la entidad bancaria correspondiente. Se cobrará un 20% del costo total que usted cancelo por gastos administrativos
                    </Text>
                    <Text style={styles.Points}>
                        16. Nuestra Responsabilidad Por La Perdida O Daño Que Usted Sufra
                    </Text>
                    <Text style={styles.SubText}>
                        Somos responsables ante usted por cualquier pérdida o daño que sufra y que sea un resultado previsible de nuestro incumplimiento de estas Condiciones o de no aplicar el cuidado razonable en relación con el uso de nuestro Servicio. No nos hacemos responsables de ninguna pérdida o daño que no sea previsible. La pérdida o daño es "previsible" si es obvio que va a suceder, o si usted nos dijo que podría suceder, por ejemplo, si nos informa, antes de realizar un pedido, sobre circunstancias particulares que podrían aumentar el riesgo de pérdida o daño derivado de nuestro incumplimiento de estas Condiciones.
                    </Text>
                    <Text style={styles.SubText}>
                        No excluimos ni limitamos nuestra responsabilidad hacia usted por pérdidas o daños cuando sea ilegal hacerlo. Esto incluye cualquier responsabilidad por muerte o lesiones personales causadas por nuestro incumplimiento, o el incumplimiento de nuestros empleados, agentes o subcontratistas, en el uso de cuidado razonable; por fraude; por incumplimiento de sus derechos en relación con los Productos; o por Productos defectuosos. Sujeto al párrafo anterior, no nos hacemos responsables de ninguna pérdida o daño que usted sufra como resultado de su propio incumplimiento de estas Condiciones, o como resultado de cualquier fallo de hardware o software, salvo en el caso de fallo de nuestra Aplicación.
                    </Text>
                    <Text style={styles.SubText}>
                        Nada en estos términos y condiciones debe entenderse como constitutivo de una relación de agencia entre MasRapido o como una autorización a MasRapido para suscribir compromisos en su nombre.
                    </Text>
                    <Text style={styles.Points}>
                        17. Protección De Datos
                    </Text>
                    <Text style={styles.SubText}>
                        Procesamos sus datos personales de acuerdo con nuestra Política de Privacidad, que se encuentra aquí.
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