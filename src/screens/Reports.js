import React, { useState, useEffect, useContext } from 'react'
import { View, Modal, Text, KeyboardAvoidingView, Image, Picker, Linking,TouchableWithoutFeedback, Keyboard, RefreshControl, TouchableOpacity, ScrollView, StatusBar, Alert, StyleSheet, TouchableHighlight } from 'react-native'
import Icon from "react-native-vector-icons/MaterialCommunityIcons"
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import CONSTANTS from '../Global/Constants'
import TextInput1 from '../components/TextInput1'
import TextInput from '../components/TextInput'
import HashedSnackbar, { useSnackbar } from '../components/HashedSnackbar';
import { AppContext } from '../Global/Stores';
import Button from '../components/Button'
import Constants from 'expo-constants';
import { LinearGradient } from 'expo-linear-gradient'
import Services from '../actions/services';
import ImageAssets from '../Global/ImageAssests';
import HashedDropdown from '../components/HashedDropdown';
import Container from '../components/Container'; import * as Location from 'expo-location';
import {
    ToastAndroid,
    Platform,
    AlertIOS,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { color, set } from 'react-native-reanimated';
const Reports = (props) => {
    const [onlineplayers, setonlineplayers] = useState(0);
    const [step, setStep] = useState(1);
    const [mapLocations, showmapLocations] = useState(0);
    const [storeState, dispatch] = useContext(AppContext);
    const [modalVisible, setModalVisible] = useState(false)
    const [saveConfirmation, setsaveConfirmation] = useState(false)
    const [showUpload, setshowUpload] = useState(false)
    const [val, setVal] = useState(false);
    const [loading, setloading] = React.useState(false)
    const [disabledButton, setdisabledButton] = React.useState(false)
    const [screenName, setscreenName] = useState("Reports");
    const [userObject, setUserObject] = useState({});
    const { isActive, type, message, openSnackBar, closeSnackBar } = useSnackbar();
    const [state, setState] = useState({});
    const [VerifiedList, setVerifiedList] = useState(null);
    const [AllVerifiedList, setAllVerifiedList] = useState(null);
    const [totalVerifiedList, sertotalVerifiedList] = useState(null);
  
    const [refreshing, setRefreshing] = React.useState(false);
     
    const [pageCnt, setpageCnt] = React.useState(0)
    const [SeqNo, setSeqNo] = React.useState(0)
    
    const [location, setLocation] = useState(null);
    const [AllTables, setTables] = React.useState(null);
    const [tableHeaders, setTableHeaders] = React.useState(null);  
   
    const notifyMessage = (msg) => {
        if (Platform.OS === 'android') {
            ToastAndroid.show(msg, ToastAndroid.SHORT)
        } else {
            Alert.alert(msg);
        }
    }
    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        setTimeout(() => {
            showmapLocations(0);
            setStep(1);
            setRefreshing(false);
            onLoad(screenName)
        }, 1000);
    }, []);
    useEffect(() => {
        if (props["route"]["params"] != undefined &&
            props["route"]["params"]["screenName"] != null && props["route"]["params"]["screenName"] != undefined) {
            setscreenName(props["route"]["params"]["screenName"])
        }
        showmapLocations(0);
        setTables([]);
        GetCurrentLocation();
        onLoad();
    }, [])
    const GetCurrentLocation = async () => {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
            notifyMessage('Permission to access location was denied');
            return;
        }

        let location = await Location.getCurrentPositionAsync({});
        setLocation(location);
        //console.log("Location:"+location.coords.latitude)
    }
 
    const onLoad = async () => {
        setloading(true);
        setStep(1);
        loadMastersData('');
    }
 
    const reloadData = async () => {
        setloading(true) 
        setStep(1);
        loadMastersData('');
    }
    const dialCall = (_no) => {

        let phoneNumber = '';
    
        if (Platform.OS === 'android') {
            phoneNumber = `tel:${_no}`;
        } else {
            phoneNumber = `telprompt:${_no}`;
        }
    
        Linking.openURL(phoneNumber);
    };
    const showLocations = (item) => {
       //console.log(item)
       if(step==5)
        Linking.openURL("https://gc.inccards.in/map.html?id="+item.id);
       if(step==6)
        Linking.openURL("https://gc.inccards.in/map_voter.html?id="+item.id);
    };
    const loadMastersData = async (_obj) => { 
        if(step==5)
        {  
            setloading(true);
            setTables([]);
        }
        await AsyncStorage.getItem("userSession").then(async (value) => {
            let obj = JSON.parse(value);
            var _userObject = obj;
            if (_userObject != undefined) {
                setUserObject(_userObject)
                var service = new Services(); 
           var ele = '';
        if ((_userObject.ROLE === 17 || _userObject.ROLE === 19) && step == 2) {
            ele += " AND PCID ='" + _obj.PCID + "'";
        }
        if ((_userObject.ROLE === 17 || _userObject.ROLE === 19) && step == 3) {
            ele += " AND PCID ='" + _obj.PCID + "' AND Assemblyid ='" + _obj.ASSEMBLYID + "'";
        }
        if ((_userObject.ROLE === 17 || _userObject.ROLE === 19) && step == 4) {
            ele += " AND U.PCID ='" + _obj.PCID + "' AND U.Assemblyid ='" + _obj.ASSEMBLYID + "' AND  U.MANDALID='" + _obj.MANDALID + "'"; 
        }
        if ((_userObject.ROLE === 6) && step == 2) {
            ele += " AND U.PCID ='" + _obj.PCID + "' AND U.Assemblyid ='" + _obj.ASSEMBLYID + "' AND  U.MANDALID='" + _obj.MANDALID + "'"; 
        }
        if ((_userObject.ROLE === 5) && step == 2) {
            ele += "  AND Assemblyid ='" + _obj.ASSEMBLYID + "'";
        }
        if ((_userObject.ROLE === 5) && step == 3) {
            ele += " AND U.PCID ='" + _obj.PCID + "' AND U.Assemblyid ='" + _obj.ASSEMBLYID + "' AND  U.MANDALID='" + _obj.MANDALID + "'"; 
        }
        if (step == 5) {
            ele += _obj.id; 
        }

                const body = {
                    TypeId: step,
                    MobileNo: _userObject.MOBILE,
                    FilterText: ele,
                    UserId: _userObject.ID,
                }; 
            
                service.postData('/_getReports', body).then(data => {
                    var resonseData = JSON.parse(data)
                    setloading(false);
                    if (data == null || data == "") {
                        openSnackBar("Invalid request object");
                        return false;
                    }
                    else if (resonseData.status == "ERROR") {
                        notifyMessage(resonseData.response);
                        return false;
                    }
                    if (resonseData.errorCode == -100) {
                        notifyMessage(resonseData.message);
                    }
                    else if (resonseData.errorCode == 200) { 
                        if (step == 1 || step == 2 || step == 3 || step == 4 || step == 5) {  
                            setTables(resonseData.response);
                            setTableHeaders(Object.keys(resonseData.response.Table[0]));
                        } 
                        setStep(step + 1); 
                        if(step==4){
                            showmapLocations(1);
                        } 
                    }
                });
            }
        })
            .then(res => {
                //do something else
            });
    }
    const closemodal = () => {
        setModalVisible(false)
        setsaveConfirmation(false)
    }
    
     const go2Home = async () => {
        props.navigation.replace('DrawerStack', { screen: 'Home' })
     }
      
    const back = () => {
        props.navigation.replace('DrawerStack', { screen: 'Reports' })
    }
    const LoadMore = () => {
        let tempList = totalVerifiedList.slice(pageCnt, pageCnt + 50);
        setVerifiedList(VerifiedList.concat(tempList))
        let _temp = pageCnt;
        _temp = _temp + 50;
        setpageCnt(_temp);

    }
    
    return (


        <Container>
            {loading &&
                <View style={{ width: wp('50%'), alignSelf: "center", flexDirection: 'row', position: 'absolute', borderRadius: 20, paddingHorizontal: 20, bottom: 50, zIndex: 9999, backgroundColor: '#ccc', justifyContent: 'center', alignItems: 'center' }}>
                    <Image
                        source={ImageAssets.loading}
                        style={styles.loading_image}
                    />
                </View>
            }
            <>
                <View style={styles.StatusBar}>
                    <StatusBar translucent barStyle="dark-content" />
                </View>
                {/* <AuthHeader back="0" /> */}
                <View style={{ width: wp("100%"), height: hp('10%'), paddingHorizontal: wp("2%"), flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>

                    <TouchableOpacity onPress={back} style={{ flexDirection: "row", alignItems: "center", }}>
                        <Icon name='chevron-left' size={wp('6%')} color={'#000'}></Icon>
                        <Text style={{ fontSize: wp('5%'), color: "#000" }}>Back</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => { props.navigation.openDrawer() }}   >
                        <Icon onPress={() => { props.navigation.openDrawer() }} name="dots-horizontal" color={'#7F86B2'} size={wp('7%')}></Icon>

                    </TouchableOpacity>
                </View>
                <View style={styles.Container2}>

                    <HashedSnackbar visible={isActive} message={message} type={type} close={closeSnackBar} />

                    <View style={UserLabel.play_div}>
                        <View style={styles.top_div_lbl}>
                                 {/* <TouchableOpacity onPress={() => { reloadData() }} style={{ zIndex: 9, paddingHorizontal: 10, position: 'absolute', right: 0, top: hp('30%') }}>

                                    <Icon name="refresh" size={wp('6%')} color={"#4e73df"} />

                                </TouchableOpacity> */}
                            <Text style={{ fontFamily: "InterRegular", fontSize: wp('5%'), fontWeight: "bold" }}>{screenName}
                           
                            </Text>
                            {AllTables != null && AllTables !== undefined && AllTables.Table !== null && AllTables.Table !== undefined && AllTables.Table.length > 0 &&
                                <Text style={{ fontFamily: "InterBold", fontStyle: 'italic', fontSize: wp("3%"), color: "#4e73df", marginTop: hp("1%"), fontWeight: "bold" }}>Data showing {(AllTables.Table != null ? AllTables.Table.length : 0)} record[s]</Text>
                            }

                        </View>

                        {/* <View style={{ flexDirection: "row", marginBottom: 10, alignItems: "center", justifyContent: "center", width: ('90%'), paddingHorizontal: wp('2%') }}>
                            <TextInput1
                                theme={{ colors: { primary: 'transparent', text: '#323232' } }}
                                style={styles.input}
                                returnKeyType="next"
                                onChangeText={(text) => filterList(text)}
                                placeholder="Search Here"
                                activeUnderlineColor="#323232"
                                underlineColor="transparent"
                            />
                        </View> */}
                        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                            <>
                                <KeyboardAwareScrollView keyboardShouldPersistTaps='always' refreshControl={
                                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#000" />}>
                                    <View style={{ backgroundColor: "transparent", paddingBottom: hp('10%') }} animationEnabled={false}>
                                        <>

                                            {(AllTables !== undefined && AllTables !== null && AllTables.Table !== null && AllTables.Table !== undefined) && AllTables.Table.length > 0 && AllTables.Table.map((item, index) => (


                                                
                                                <View style={ index % 2 ==0 ? styles.div_bg : styles.div_bg_2}   key={index}>
                                                        {step <= 4 && <TouchableOpacity onPress={() => { loadMastersData(item) }} style={{ zIndex: 9, paddingHorizontal: 10, position: 'absolute', right: 0, top: 10 }}>

                                                            <Icon name="eye" size={wp('6%')} color={"#4e73df"} />

                                                        </TouchableOpacity>
}

                                                    <View style={{ width: wp('90%'), flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center' }}>
                                                        {tableHeaders !== undefined && tableHeaders !== null && tableHeaders.map((keyname, index1) => (
(keyname !=='LAST_UPDATED' && keyname !=='ID' && keyname !=='id' && keyname !=='STATEID' && keyname !=='PCID' && keyname !=='ASSEMBLYID' && keyname !=='MANDALID' && keyname !=='ACTION') &&

                                                        <View key={index1} style={{ flexDirection: "column", width: ('30%'), paddingHorizontal: 10 }}>
                                                            <Text style={{ fontSize: wp('3%'), color: "#000",fontWeight:'bold', fontFamily: "InterRegular" }}>{keyname}</Text>
                                                            {keyname=="INCHARGE_MOBILE" || keyname=="Mobile" ?
                                                            <View>
                                                            <TouchableOpacity onPress={() => { dialCall(item[keyname]) }} >
                                                             <Text style={[UserLabel.roletext, {  fontWeight:'bold' }]} ellipsizeMode='tail' numberOfLines={1}>
                                                              
                                                                <Icon style={{ zIndex: 9, paddingHorizontal: 5, position: 'absolute', right: 0  }} name="phone-dial-outline" size={wp('4%')} color={"#4e73df"} /> 

                                                                {item[keyname]}</Text>
                                                                </TouchableOpacity>
                                                                </View>
                                                             :
                                                             <Text style={[UserLabel.roletext, {  fontWeight:'bold' }]} ellipsizeMode='tail' numberOfLines={1}>{item[keyname]}</Text>
                                                            }
                                                           
                                                        </View>
                                                        ))
                                                        }
{mapLocations ==1 && 
<View style={{ flexDirection: "row", width: ('100%'), paddingHorizontal: 10,textAlign:'right',justifyContent:'flex-end' }}>
<TouchableOpacity onPress={() => { showLocations(item) }} style={{    paddingHorizontal: 5 }}>

                                                            <Icon name="map-marker" size={wp('6%')} color={"#4e73df"} />

                                                        </TouchableOpacity>
                                                  {step ==5 && 
                                                      <TouchableOpacity onPress={() => { loadMastersData(item) }} style={{  paddingHorizontal: 10 }}>
                                                 <Icon name="eye" size={wp('6%')} color={"#4e73df"} />
                                                  </TouchableOpacity>
                                                   }
        </View>
}
                                                    </View>
                                                </View>

                                                    )

                                            )
                                            }
                                            {totalVerifiedList != null && pageCnt < totalVerifiedList.length &&
                                                <View style={{ paddingHorizontal: wp("1.5%"), left: 0, justifyContent: "center", alignItems: "center" }}>
                                                    <LinearGradient
                                                        colors={['#c82333', '#c82333']}
                                                        useAngle={true}
                                                        style={styles.btn}
                                                        start={{ x: 0.7, y: 1 }}
                                                        end={{ x: 0, y: 1 }}
                                                    >
                                                        <TouchableOpacity onPress={() => { LoadMore() }}>
                                                            <Button
                                                                name="EnrolledMember"
                                                            >
                                                                Load More
                                                            </Button>
                                                        </TouchableOpacity>
                                                    </LinearGradient>

                                                </View>
                                            }

                                        </>
                                    </View>
                                </KeyboardAwareScrollView>
                            </>
                        </TouchableWithoutFeedback>

                    </View>
                </View >
            

            </>

        </Container >

    )

}
export default Reports

const styles = StyleSheet.create({
    btn: {
        width: ('70%'),
        borderRadius: 50,
        justifyContent: 'center',
        marginVertical: 10,
        alignContent: 'center', 
        alignItems: 'center',
        position: "relative",
        alignSelf: "center",
        paddingVertical: wp("2%"),
        flexDirection: 'row',
    },
    labelinput1: {
        fontSize: wp("3.5%"),
        color: '#161616',
        paddingLeft: wp('1%'),
        textTransform: 'uppercase',
        ...Platform.select({
            android: {
                fontSize: wp("3%"),
            }
        })
    },
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: 'rgba(0,0,0,0.6)'
    },
    modalView: {
        margin: 20,
        paddingTop: hp('6%'),
        width: wp('95%'),
        backgroundColor: "white",
        borderRadius: 20,
        padding: ('4%'),
        alignItems: "center",
        justifyContent: 'center',
    },
    loading_image: {
        width: 100,
        height: 50,
        zIndex: 9999,
    },
    div_bg: {
        width: wp('90%'),
        flexDirection: 'column',
        justifyContent: "flex-start",
        alignItems: 'center',
        marginTop: hp('1%'),
        paddingVertical: hp('1%'),
        borderRadius: 10,
        backgroundColor: "#fff",

    },
    div_bg_2: {
        width: wp('90%'),
        flexDirection: 'column',
        justifyContent: "flex-start",
        alignItems: 'center',
        marginTop: hp('1%'),
        paddingVertical: hp('1%'),
        borderRadius: 10,
        backgroundColor: "#e9ecef",

    },
    up_rank: {
        fontSize: wp('3%'),
        marginRight: 10,
        color: "#000",
        fontWeight: "bold"
    },
    top_div_lbl: {
        width: '80%',
        alignItems: "center",
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 0,
        },

    },
    top_div: {
        paddingHorizontal: hp("5%"),
        paddingVertical: hp("3%"),
        width: '80%',
        backgroundColor: "#fff",
        borderRadius: 10,
        alignItems: "center",
        shadowColor: '#000',
        marginBottom: 10,
        shadowOffset: {
            width: 0,
            height: 0,
        },
        shadowOpacity: 0.2,
        shadowRadius: 10,
        elevation: 5,
    },
    main_bg: {
        width: "100%",
        position: "absolute",
        top: 0,
        left: 0,
        flex: 1
    },
    Container2: {
        zIndex: 0,
        flex: 1,
        alignContent: 'center',
        alignSelf: 'center',
        width: wp('100%'),
    },
    input: {
        borderTopWidth: 0,
        borderLeftWidth: 0,
        borderRightWidth: 0,
        borderBottomWidth: 0,
        paddingHorizontal: wp('2%'),
        width: ('100%'),
        color: '#fff',
        backgroundColor: 'transparent',
        fontFamily: "InterRegular",
        fontSize: wp('3.5%'),
    },
    StatusBar: {
        height: Constants.statusBarHeight,
        backgroundColor: 'transparent'
    },
    button_submit: {
        width: wp('40%'),
        height: hp('7%'),
        marginHorizontal: wp('0.2%'),
        borderWidth: 3,
    },

})
const UserLabel = StyleSheet.create({
    Container2: {
        zIndex: 0,
        width: wp('100%'),
        paddingBottom: 100,
        paddingHorizontal: 10
    },
    rhtarrow: {
        width: 24,
        height: 24,
        position: 'absolute',
        right: 15,
        ...Platform.select({

            android: {
                width: 20,
                height: 20,
            },
        })
    },
    player_div: {
        flexDirection: 'row',
        paddingVertical: 10,
        alignItems: 'center',
        alignContent: 'center'
    },

    icon_add: {
        width: 40,
        height: 40,
        ...Platform.select({

            android: {
                width: 40,
                height: 40,
            },
        })
    },

    lblSeperator: {
        width: wp("92%"),
        height: hp("2%"),
        color: '#ccc'
    },
    labelinput: {
        fontSize: wp("3.5%"),
        color: '#161616',
        fontWeight: 'bold',
        paddingLeft: wp('1%'),
        textTransform: 'uppercase',
        ...Platform.select({
            android: {
                fontSize: wp("3%"),
            }
        })
    },

    txtInput: {
        height: hp("5%"),
        width: wp("80%"), marginTop: wp("-3%"),
        marginBottom: wp("5%")
    },
    imgCertificate: {
        height: hp("20%"),
        width: wp("80%"), marginTop: wp("-3%"),
        marginBottom: wp("5%")
    },
    dateInputButton: {
        height: hp("5%"),
        width: wp("10%"),
        top: hp('-1.2%'),
        right: wp("2%"),
        zIndex: 1,
        paddingVertical: hp('3%'),
        paddingHorizontal: wp('3%'), resizeMode: 'contain',
    },
    dateInput: {
        backgroundColor: '#ffffff',
        fontSize: wp('4%'),
        color: '#111111',
        fontWeight: 'bold',
        borderWidth: wp('0.3%'),
        borderBottomLeftRadius: wp('3%'),
        borderBottomRightRadius: wp('3%'),
        borderTopLeftRadius: wp('3%'),
        borderTopRightRadius: wp('3%'),
        borderColor: '#D1E2E8',
        marginBottom: wp('5%'),
        height: hp('7%'),
        width: wp('92%'),
        zIndex: 0,
    },
    lblIcon: {
        width: 40,
        position: 'absolute',
        height: 40,
        right: 10

    },
    lblIconUnpublish: {
        width: 30,
        position: 'absolute',
        height: 30,
        right: 30,
        zIndex: 9
    },
    lblIcon1: {
        width: 50,
        position: 'absolute',
        height: 50,
        left: 0

    },
    lblHeader: {
        fontSize: wp("4%"),
        fontWeight: "bold",
        marginLeft: 110,
        width: wp("90%"),
        color: '#161616'
    },
    lblHeader_sub: {
        fontSize: wp("3%"),
        fontWeight: "bold",
        paddingRight: wp('1%'),
        width: wp("90%"),
        alignItems: "flex-start",
        color: "#858585",
        marginLeft: 110,
    },
    lblView: {
        backgroundColor: '#fff',
        flexDirection: "column",
        alignItems: 'flex-start',
        flex: 1,
        marginTop: hp("2%"),
        paddingVertical: hp('3%'),
        paddingHorizontal: wp('3%'),
        borderRadius: 25,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 2,
    },
    lblView1: {
        fontSize: wp("4%"),
        height: hp("20%"),
        width: wp('100%'),
        flexDirection: "column",
        paddingHorizontal: wp('2%'),
        borderTopLeftRadius: 0,
        borderTopRightRadius: 0,
        borderBottomLeftRadius: 25,
        borderBottomRightRadius: 25,
        paddingTop: hp("2%"),
        ...Platform.select({

            android: {
                height: hp("25%"),
            },
        })
    },
    profile: {
        width: 100,
        height: 100,
        borderRadius: 100,
        resizeMode: 'cover',
        alignSelf: 'center',
        borderWidth: 5,
        borderColor: '#fff'
    },
    label_bot_div: {
        alignSelf: 'center',
        display: 'flex',
        alignContent: 'center',
        flexDirection: 'column'
    },

    play_div: {
        width: wp('100%'),
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingBottom: 100,
    },
    label_bot_div1: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        padding: 15,
        backgroundColor: '#fff',
        width: wp('92%'),
        borderRadius: 20,
        height: 'auto',
        marginVertical: 10,
    },
    rolebg: {
        width: 50,
        height: 50,
        backgroundColor: '#409fbf',
        textAlign: 'center',
        marginRight: 10,
        borderRadius: 40,
        alignContent: 'center',
        justifyContent: 'center',


    },
    roletext: {
        color: "#4e73df",
        fontSize: wp('3%'),
        textAlign: 'left',
        width: wp('100%'),
        marginVertical: hp('1%'),
        fontFamily: "InterBold",
        fontStyle:'italic'

    },
    roletext1: {
        color: '#00445D',
        fontSize: wp('5%'),
        textAlign: 'left',
        marginVertical: hp("1%"),
        width: wp('80%'),
        fontFamily: "InterBold"

    },
    lblUser: {
        flexDirection: 'row',
        color: "#000",
        fontSize: wp("6%"),
        textAlign: 'left',
        fontWeight: 'bold',
        marginLeft: wp('4%'),
        fontFamily: "InterRegular"
    },
    lbllabel1: {
        flexDirection: 'row',
        color: "#ffffff",
        fontSize: wp("4%"),
        marginTop: wp("10%"),
        marginLeft: wp("5%"),
        textAlign: 'left',
    },
    lbllabel: {
        flexDirection: 'row',
        color: "#000",
        fontSize: wp("3%"),
        marginTop: wp("2%"),
        textAlign: 'left',
        fontWeight: 'bold',
    },
    lblDept: {
        fontSize: wp("3%"),
        textAlign: 'left',
        color: '#777',
        width: wp('40%'),
        paddingTop: wp('1%'),
    },
    lblDept1: {
        fontSize: wp("4.5%"),
        fontWeight: 'bold',
        marginTop: wp("3%"),
        fontWeight: 'bold',
        color: '#fff',
        borderColor: '#ffffff',
        textAlign: 'left',
    },
    lblDept2: {
        fontSize: 12,
        fontWeight: 'bold',
        marginTop: wp("1%"),
        fontWeight: 'bold',
        color: '#c10000',
        borderColor: '#ffffff',
        textAlign: 'left',
    },
    border: {
        width: wp('0.5%'),
        height: hp('2%'),
        backgroundColor: '#000',
        marginTop: wp('2%'),
    },
    lbldoc: {
        flexDirection: 'row',
        color: "blue",
        fontSize: wp("3%"),
        marginLeft: wp("1%"),

    },
    lblDate: {
        flexDirection: 'column',
        color: "silver", fontSize: wp("3%"),
        alignContent: "flex-end",
        position: "absolute",
        alignItems: "flex-end",
        right: wp("8%"),
        marginTop: wp('2%'),
        fontWeight: 'bold'
    },
    lblUser_lbl: {
        fontSize: wp("5.5%"),
        fontWeight: 'bold',
        color: '#161616',
        textAlign: 'left',
        borderColor: '#ffffff',
    },
    lblUser_lbl_1: {
        fontSize: wp("3.5%"),
        fontWeight: 'bold',
        color: '#161616',
        textAlign: 'left',
        borderColor: '#ffffff',
    },
    lblNoOfPlayers: {
        fontSize: wp("3.5%"),
        fontWeight: 'bold',
        color: '#161616',
        textAlign: 'left',
        borderColor: '#ffffff',
    },
})


const ButtonView = StyleSheet.create({


    margin_20: {
        marginTop: hp('3%'),
        marginHorizontal: wp('5%'),

    },
    logout_icon: {
        position: "absolute",
        width: wp('10%'), height: hp('5%'), resizeMode: "contain",
        top: hp("0.5%"),
        right: wp("0%"),
        paddingVertical: wp('4%'),
        paddingHorizontal: hp('3%'),
        zIndex: 1
    },
    viewbox_icon: {
        position: "absolute",
        width: wp('10%'), height: hp('5%'),
        resizeMode: "cover",
        marginTop: hp("2.6%"),
        marginLeft: wp('-5%'),
        resizeMode: 'contain',
    },
    viewbox_icon_bottom: {
        position: "absolute",
        width: wp('10%'), height: hp('5%'),
        bottom: hp('-2%'),
        resizeMode: 'contain',
        alignContent: 'center',
        left: wp('15%'),
        right: wp('0%'),
    },
    viewbox_1: {
        backgroundColor: CONSTANTS.COLOR_WHITE,
        width: wp("43%"),
        marginTop: hp('3%'),
        marginLeft: wp('5%'),
        flexDirection: 'column',
        borderRadius: wp('5%'),
        shadowColor: '#000000',
        shadowOffset: { width: 1, height: 1 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
        elevation: 5,
        marginBottom: hp('1%'),
        alignSelf: 'flex-start',
        paddingBottom: hp('3%')
    },
    viewbox: {
        backgroundColor: CONSTANTS.COLOR_WHITE,
        width: wp("40%"),
        marginTop: hp('3%'),
        marginLeft: wp('9%'),
        flexDirection: 'column',
        borderRadius: wp('5%'),
        shadowColor: '#000',
        shadowOffset: { width: 1, height: 1 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
        elevation: 5,
        alignSelf: 'flex-start',
        paddingBottom: hp('3%')
    },
    lblView: {
        flex: 1,
        flexDirection: 'row',
    },
    lblUser: {
        color: "#111111",
        fontSize: wp("4%"),
        paddingLeft: wp("8%"),
        paddingTop: hp('2%'),
    },
    lblHeader: {
        fontWeight: 'bold',
        color: "#000000", fontSize: wp('4%'),
        paddingHorizontal: wp('3%'),
        paddingTop: hp('1%'),
    },
    lblDept: {
        flexDirection: 'row',
        color: "#999999",
        fontSize: wp("3%"),
        paddingLeft: wp("8%"),

    },
    lblInstructions: {
        flexDirection: 'row',
        color: "#999999",
        fontSize: wp("3%"),
        paddingHorizontal: wp('3%'),
        paddingVertical: hp('0.5%'),
    },


})
