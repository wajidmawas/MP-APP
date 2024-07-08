import React, { useState, useEffect, useContext } from 'react'
import { View, Text, Image, KeyboardAvoidingView,Keyboard, TouchableOpacity, TouchableWithoutFeedback, StatusBar,Alert, StyleSheet,RefreshControl, TouchableHighlight } from 'react-native'
import Icon from "react-native-vector-icons/MaterialCommunityIcons"
import AuthHeader from '../components/AuthHeader';
import Container from '../components/Container';
import Background from '../components/Background'
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import ImageAssets from '../Global/ImageAssests';
import TextInput from '../components/TextInput'
import * as ImagePicker from 'expo-image-picker';
import CONSTANTS from '../Global/Constants' 
import HashedText from '../components/HashedText';
import Loader from '../components/Loader';
import HashedSnackbar, { useSnackbar } from '../components/HashedSnackbar';
import { theme } from '../core/theme'
import Button from '../components/Button'
import { AppContext } from '../Global/Stores';
import { LinearGradient } from 'expo-linear-gradient';
import Constants from 'expo-constants';
import {
    ToastAndroid,
    Platform,
    AlertIOS,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Services from '../actions/services'; 
import NetInfo from '@react-native-community/netinfo';

const AssignedPetitions = (props) => {
    const [onlineplayers, setonlineplayers] = useState(0);
    const [viewHide, setviewHide] = useState(0);
    const [storeState, dispatch] = useContext(AppContext);
    const [val, setVal] = useState(false);
    const [screenName, setscreenName] = useState("Members");
    const [userObject, setUserObject] = useState({}); 
    const { isActive, type, message, openSnackBar, closeSnackBar } = useSnackbar();
    const [state, setState] = useState({});
    const [defaultCoordinates, setDefaultCoordinates] = useState({ DefaultLat: 0, DefaultLon: 0 });
    const [ustorage, setClientStorage] = useState({ UsedStorage: '0', ClientStorage: '200MB' });
    const [userSession, setuserSession] = useState(null);
    const [Alluserwise, setAlluserwise] = useState(null); 
    const [username, setusername] = useState(null);
    const [userwise, setuserwise] = useState(null); 
    const [refreshing, setRefreshing] = React.useState(false);
    const notifyMessage = (msg) => {
        if (Platform.OS === 'android') {
            ToastAndroid.show(msg, ToastAndroid.SHORT)
        } else {
            Alert.alert(msg);
        }
    }
 
    useEffect(() => { 
        onLoad();
        setRefreshing(true);  
        getuserlist();
        //console.log("Home page Ended:");
    }, [])
    
    
    const onLoad = async () => { 
        await AsyncStorage.getItem("userSession").then(async (value) => {
            let obj = JSON.parse(value);
            var _userObject = obj;
            if (_userObject != undefined) {  
                setUserObject(_userObject)   
            }
        })
            .then(res => {
                //do something else
            });

    }
    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        setTimeout(() => { 
            getuserlist()
        }, 1000);
      }, []);
      const filterList= async(_text)=>{ 
        let _fList=userwise.filter(a=>a.name!=null && a.name.toUpperCase().includes(_text.toUpperCase()));
        console.log(_text);
        if(_text=="" || _text==null || _text==undefined)
        _fList=Alluserwise;
        setuserwise(_fList);
              }
    getuserlist = async () =>{
        await AsyncStorage.getItem("userSession").then(async (value) => {
            let obj = JSON.parse(value);
            var _userObject = obj;
        var service = new Services(); 
                const body = {
                  TypeId: 8,
                  UserId: _userObject.ID,
                  FilterId: _userObject.stateid,
                  FilterText: 'TOTAL'
              };  
                service.postData('/_getMasters', body).then(data => {
                    setVal(false) 
                    setRefreshing(false);
                    if (data == null || data == "") {
                        openSnackBar("Invalid request object");
                        return false;
                    }
                    
                    var resonseData = JSON.parse(data) 
                    if (resonseData.errorCode == -100) {
                        notifyMessage(resonseData.message);
                    }
                    else if (resonseData.errorCode == 200) { 
                        setuserwise(resonseData.response["Table"]); 
                        setAlluserwise(resonseData.response["Table"]); 
                    }
                }); 
            })
    }
    const gotoViewlist = (id) => {  
        props.navigation.replace('DrawerStack', {
            screen: 'ViewList',
            params: { screenName: "TOTAL",userid:id }
        })
    }
    const back = () => {
       props.navigation.replace('DrawerStack', { screen: 'Home' })
      }
    return (


        <Container>
          <>
 
           
                <View style={styles.StatusBar}>
                    <StatusBar translucent barStyle="dark-content" />
                </View>
                {/* <AuthHeader back="0" /> */}
                <View style={{width:wp("100%"),height:hp('10%'),paddingHorizontal:wp("2%"),flexDirection:"row", alignItems:"center",justifyContent:"space-between"}}>
               <TouchableOpacity onPress={back}  style={{flexDirection:"row", alignItems:"center",}}>
                        <Icon name='chevron-left' size={wp('6%')} color={'#fff'}></Icon>
                        <Text style={{fontSize:wp('5%'),color:"#fff"}}>Back</Text>
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => {  props.navigation.openDrawer() }}   >
          <Icon onPress={() => { props.navigation.openDrawer() }} name="dots-horizontal" color={'#7F86B2'} size={wp('7%')}></Icon>
            
        </TouchableOpacity>
               </View>
                <View style={styles.Container2}>
                <View >
                        <View style={styles.top_div_lbl}>
                            <Text style={{ fontSize: wp('8%'), color: '#fff', fontFamily: 'InterBold',paddingLeft:10 }}>{(userwise != null ? (userwise.reduce((a,v) =>  a = a + v.total , 0 )): 0)}</Text>
                            
                        </View>
                    </View>
                    <HashedSnackbar visible={isActive} message={message} type={type} close={closeSnackBar} />  
                        <View style={UserLabel.play_div}> 
                        
                                <View style={{flexDirection:"row",alignItems:"center",justifyContent:"center",width:('90%'),marginBottom:hp('1%'),paddingHorizontal:wp('2%')}}>
                                <TextInput  
         theme={{ colors: { primary: 'transparent',text: '#323232'  } }}
                        style={styles.input}
                          returnKeyType="next" 
                          placeholder="Search Here" 
                          onChangeText={(text) => filterList(text)}
                          activeUnderlineColor="transparent"
                          underlineColor="transparent" 
                        />
                                </View>
                                <View style={{flexDirection:"row",alignItems:"center",width:wp('90%'),marginVertical:hp('1%'),paddingHorizontal:wp('2%')}}> 
                                <View style={{flexDirection:"row",alignItems:"center"}}>
                                        <Text style={[styles.up_rank,{color:"#007bff"}]}>T : Total</Text>
                                        <Text style={[styles.up_rank,{color:"#29A500"}]}>N : New</Text>
                                        <Text style={[styles.up_rank,{color:"#e0a800"}]}>A : Assigned</Text>
                                        <Text style={[styles.up_rank,{color:"#c82333"}]}>R : Rejected</Text>
                                        <Text style={[styles.up_rank,{color:"green"}]}>C : Completed</Text>
                                        </View> 
                                    </View>
                                    <View style={{flexDirection:"row",alignItems:"center",width:wp('90%'),marginVertical:hp('1%'),paddingHorizontal:wp('2%')}}> 
                                          <View style={{flexDirection:"row",alignItems:"center"}}>
                                        <Text style={[styles.up_rank,{color:"#007bff"}]}>O : On-Hold</Text>
                                        <Text style={[styles.up_rank,{color:"#29A500"}]}>I : InProgress</Text> 
                                        <Text style={[styles.up_rank,{color:"#4f77f0"}]}>AC : Acknowledged</Text> 
                                        </View>
                                        </View>
                                    <KeyboardAwareScrollView keyboardShouldPersistTaps='always' refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#000" />} > 
                                <View style={{backgroundColor:"#fff",paddingBottom:hp('8%')}}>
                        {userwise != null && userwise.map((item, index) => (
                          
                          <TouchableOpacity  
                          onPress={() => { gotoViewlist(item.id) }} key={index}>  
                           
                                <View style={styles.div_bg} key={index}> 
                                 <View  key={index} style={{width:wp('95%'),paddingHorizontal:wp('4%'),paddingVertical:hp("2%"),flexDirection:'row',justifyContent:"space-between",alignItems:'center'}}>
                                <View style={{flexDirection:"column",width:wp('100%'),alignItems:"flex-start",paddingHorizontal:wp("1%"),}}> 
                                <View style={{flexDirection:"row", alignItems:"center",justifyContent:"space-between",width:("80%")}}> 
                                <Text style={UserLabel.roletext} ellipsizeMode='tail' numberOfLines={1}>{item.name}</Text> 
                                <Text style={UserLabel.roletext_spa} ellipsizeMode='tail' numberOfLines={1}>{ '(' + item.SPA + ')'}</Text> 
                                
                                </View>
                                <View style={{flexDirection:"row",paddingTop:hp('1%'), alignItems:"center",justifyContent:"space-between",width:("80%")}}>
                                <Text style={[UserLabel.roletext,{color:"#007bff"}]} ellipsizeMode='tail' numberOfLines={1}>T : {item.total}</Text> 
                                <Text style={UserLabel.roletext_verified} ellipsizeMode='tail' numberOfLines={1}>N : {item.New}</Text> 
                                <Text style={[UserLabel.roletext,{color:"#e0a800"}]} ellipsizeMode='tail' numberOfLines={1}>A : {item.Assigned}</Text>
                                <Text style={[UserLabel.roletext,{color:"#c82333"}]} ellipsizeMode='tail' numberOfLines={1}>R : {item.Rejected}</Text>
                                <Text style={[UserLabel.roletext,{color:"green"}]} ellipsizeMode='tail' numberOfLines={1}>C : {item.Completed}</Text>
                                </View>
                                <View style={{flexDirection:"row",paddingTop:hp('1%'), alignItems:"center",justifyContent:"space-between",width:("80%")}}>
                                <Text style={[UserLabel.roletext,{color:"#007bff"}]} ellipsizeMode='tail' numberOfLines={1}>O : {item["On-Hold"]}</Text> 
                                <Text style={UserLabel.roletext_verified} ellipsizeMode='tail' numberOfLines={1}>I : {item.InProgress}</Text>  
                                <Text style={[UserLabel.roletext,{color:"#4f77f0"}]} ellipsizeMode='tail' numberOfLines={1}>AC : {item.Acknowledged}</Text>  
                                  <Text style={UserLabel.roletext_verified} ellipsizeMode='tail' numberOfLines={1}></Text>  
                                  <Text style={UserLabel.roletext_verified} ellipsizeMode='tail' numberOfLines={1}></Text>  
                                </View>

                                </View> 
                                </View>
                                </View>
                                     
                          </TouchableOpacity>
                          
                        ))
                    }
                             
                             </View> 
                             </KeyboardAwareScrollView>  
                        </View>   
                       
                </View> 

                </>
                <View style={styles.login_bg}>
                <Image style={{ width: '100%', resizeMode: 'cover', height: ('100%') }} source={require('../assets/main_bg.png')} />
            </View> 

   </Container>

    )

}
export default AssignedPetitions

const styles = StyleSheet.create({
    top_div_lbl: {
        width: '100%',
        alignItems: "center",
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    login_bg: {
        width: wp('100%'),
        position: 'absolute',
        top: 0,
        backgroundColor: "#000",
        height: hp('100%'),
        zIndex: -1,
        left: 0
    },
    input: { 
        borderTopWidth: 0,
        borderLeftWidth: 0,
        borderRightWidth: 0,
        borderBottomWidth:0,
        paddingHorizontal: wp('2%'),  
        width: ('100%'), 
        color:'#fff',  
        backgroundColor: 'transparent',
        fontFamily:"InterRegular",
        fontSize: wp('3.5%'),  
      },
    container: {
        width: '100%',
        flex:1,
        height:"100%",
        alignItems: 'center', 
        backgroundColor:"#fff"
      },
    up_rank:{
        fontSize:wp('3%'),
        marginRight:15,
        color:"#000", 
        fontWeight:"bold"
    },
    div_bg:{
        width:wp('90%'), 
        flexDirection:'column',
        justifyContent:"flex-start",
        alignItems:'center', 
        marginTop:hp('2%'),
        padding:wp("1%"),
        borderRadius:10,  
        backgroundColor:"#f7f7f7"

    },
    top_div:{
        paddingHorizontal:hp("5%"),
        paddingVertical:hp("3%"),
        width:'80%',
        backgroundColor:"#fff",
        borderRadius:10,
        alignItems:"center",
        shadowColor: '#000',
        marginBottom:10,
        shadowOffset: {
          width: 0,
          height: 0,
        },
        shadowOpacity: 0.2,
        shadowRadius: 10,
        elevation: 5,
    },
    main_bg:{
        width:"100%", 
        position:"absolute",
        top:0,
        left:0,
        flex:1
      },
    Container2: {
        zIndex: 0, 
        flex:1,
        alignContent: 'center',
        alignSelf: 'center',
        width: wp('100%'),
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
        fontSize: wp('3.4%',),
        color: '#999999',
        marginBottom: wp('3%')
    },
    labelinput1: {
        fontSize: wp('3.4%',),
        color: '#999999',
        marginBottom: wp('3%'),
        paddingTop: hp('1%'),
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
        marginTop: 15,
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
    roletext_verified: {
        color: '#29A500',
        fontSize: wp('3.5%'),  
        textAlign:'left', 
        marginVertical:hp("1%"), 
        fontFamily:"InterBold", 
        
    },
    roletext: {
        color: '#343434',
        fontSize: wp('3.5%'),  
        textAlign:'left', 
        marginVertical:hp("1%"), 
        fontFamily:"InterBold", 
        
    },
    roletext_spa: {
        color: '#2a6496',
        fontSize: wp('2.0%'),  
        textAlign:'left',  
        fontFamily:"InterBold", 
        
    },
    roletext1: {
        color: '#00445D',
        fontSize: wp('5%'),   
        textAlign:'left',
        marginVertical:hp("1%"), 
        fontFamily:"InterBold"
        
    },
    lblUser: {
        flexDirection: 'row',
        color: "#000",
        fontSize: wp("6%"),
        textAlign: 'left',
        fontWeight: 'bold',
        marginLeft: wp('4%'),
        fontFamily:"InterRegular"
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
