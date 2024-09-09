import React, { useState, useEffect, useContext } from 'react'
import { View, Text, Image, Modal, TouchableOpacity, ScrollView, StatusBar, Alert, StyleSheet, RefreshControl, Linking, FlatList } from 'react-native'

import AuthHeader from '../components/AuthHeader';
import Container from '../components/Container';
import Background from '../components/Background'
import { heightPercentageToDP as hp, widthPercentageToDP as wp,widthPercentageToDP } from 'react-native-responsive-screen';
import ImageAssets from '../Global/ImageAssests';
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
import Icon from "react-native-vector-icons/MaterialCommunityIcons"
import HashedDropdown from '../components/HashedDropdown'
import {
    ToastAndroid,
    Platform,
    AlertIOS,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Services from '../actions/services';
import Cards from '../components/Cards';
import { COLORS } from "../components/colors";
const MPdashboard = (props) => {
    const [viewHide, setviewHide] = useState(0);
    const [val, setVal] = useState(false);
    const [userObject, setUserObject] = useState({});
    const { isActive, type, message, openSnackBar, closeSnackBar } = useSnackbar();
    const [user, setuser] = useState('');
    const [setVersion, setsetVersion] = useState(false);
    const [TotalRecords, setTotalRecords] = useState(0)
    const [dashboardDtls, setdashboardDtls] = useState(0)
    const [refreshing, setRefreshing] = React.useState(false);
    const [imageselected, setImage] = useState(null);
    const [pageIndex, setpageIndex] = useState(0);
    const [CARDS_DATA, SETCARDS_DATA] = useState(null); 
    const [loading, setloading] = React.useState(false)
    const [PetitionList, setPetitionList] = React.useState("") 
    const notifyMessage = (msg) => {
        if (Platform.OS === 'android') {
            ToastAndroid.show(msg, ToastAndroid.SHORT)
        } else {
            Alert.alert(msg);
        }
    }
    const In_Cards = ({ item }) => { 

        const { title, amount, lastFourDigits, cardColor } = item; 
        
        return (
          <TouchableOpacity onPress={() => { gotoViewlist(item.title) }} style={[card_styles.container]} key={item.title}>
            <LinearGradient
              style={[card_styles.background]}
              colors={[cardColor, cardColor]}
            > 
              <View   key={item.title}>
                <Text style={card_styles.title}>{title}</Text> 
                <Text style={card_styles.lastFourDigits}>{lastFourDigits}</Text>
              </View>
            </LinearGradient>
          </TouchableOpacity>
        );
      };

    useEffect(() => {
        onLoad(); 
    }, [])

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        setTimeout(() => {
            setRefreshing(false);
            onLoad(); 
        }, 1000);
    }, []);
    
    const onLoad = async () => {
        await AsyncStorage.getItem("userSession").then(async (value) => {
            let obj = JSON.parse(value);
            var _userObject = obj;
            if (_userObject != undefined) {
                setUserObject(_userObject)
                console.log(_userObject)
                var service = new Services();
                const body = {
                    TypeId: 22,
                    filterId: _userObject.ID,
                    filterText: "",
                    UserId: _userObject.ID,
                };
                service.postData('/_getMasters', body).then(data => {
                    setVal(false)
                    if (data == null || data == "") {
                        openSnackBar("Invalid request object");
                        return false;
                    } 
                    var resonseData = JSON.parse(data) 
                    if (resonseData.errorCode == -100) {
                        notifyMessage(resonseData.message);
                    }
                    else if (resonseData.errorCode == 200) {
                        
                         
                        setdashboardDtls(resonseData.response["Table"]);
                        var _filteredList = [];
                        var totalCnt=0; 
                        resonseData.response["Table"].map((myValue, myIndex) => {
                          _filteredList.push({ title :myValue.name,lastFourDigits: myValue.cnt,
                            cardColor : myValue.color
                          });
                        }); 

                        SETCARDS_DATA(_filteredList);
                    }
                });
            }
        })
            .then(res => {
                //do something else
            });
        CheckVersion();
    }
    const CheckVersion = async () => {
        var service = new Services();
        const body = {
            TypeId: 3,
            UserId: userObject.ID,
            FilterId: userObject.State,
            FilterText: ''
        };
        service.postData('/_getMasters', body).then(data => {
            setVal(false)
            if (data == null || data == "") {
                openSnackBar("Invalid request object");
                return false;
            }

            var resonseData = JSON.parse(data)
            if (resonseData.errorCode == -100) {
                notifyMessage(resonseData.response);
            }
            else if (resonseData.errorCode == 200) {
                setsetVersion(false);
                if (resonseData.response["Table"][0]["Version_no"] != "1.0") {
                    setsetVersion(true);
                }
            }
        });
    } 
    const gotoViewlist = (title) => {   
        var service = new Services();
                const body = {
                    TypeId: 23,
                    filterId: userObject.ID,
                    filterText: title,
                    UserId: userObject.ID,
                };
               
                service.postData('/_getMasters', body).then(data => {
                    setVal(false)
                    if (data == null || data == "") {
                        openSnackBar("Invalid request object");
                        return false;
                    } 
                    
                    var resonseData = JSON.parse(data) 
                    if (resonseData.errorCode == -100) {
                        notifyMessage(resonseData.message);
                    }
                    else if (resonseData.errorCode == 200) { 
                        setPetitionList(resonseData.response["Table"]); 
                        setpageIndex(1);
                    }
                });

    }
    const back = () => {
        setpageIndex(0);
    }

    const ApprovePetition = (item) => {   
        var service = new Services();
                const body = {
                    Pid: item.id,
                    Comments: item.description, 
                    Userid: userObject.ID,
                };
                setloading(true)
                service.postData('/_ApprovePetition', body).then(data => { 
                    setloading(false)
                    if (data == null || data == "") {
                        openSnackBar("Invalid request object");
                        return false;
                    } 
                    
                    var resonseData = JSON.parse(data) 
                    if (resonseData.errorCode == -100) {
                        notifyMessage(resonseData.message);
                    }
                    else if (resonseData.errorCode == 200) { 
                        onLoad();
                        setpageIndex(0);
                    }
                });

    }
    const RejectPetition = (item) => {   
        var service = new Services();
        const body = {
            TypeId: 20,
            filterId: item.id,
            filterText: "",
            UserId: userObject.ID,
        }; 
        setloading(true)
        service.postData('/_RejectPetition', body).then(data => {
                    setloading(false)
                    if (data == null || data == "") {
                        notifyMessage("Invalid request object");
                        return false;
                    } 
                    
                    var resonseData = JSON.parse(data) 
                    
                    if (resonseData.errorCode == -100) {
                        notifyMessage(resonseData.message);
                    }
                    else if (resonseData.errorCode == 200) { 
                        onLoad();
                        //console.log(resonseData.response["Table"])
                        setpageIndex(0);
                    }
                });

    }
    const newPetition = () => {
        props.navigation.replace('DrawerStack', {
            screen: 'AddMember'
        })
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
            <View style={styles.StatusBar}>
                <StatusBar translucent barStyle="dark-content" />
            </View>
            <View style={{ width: wp("100%"), height: hp('4%'), paddingHorizontal: wp("2%"), flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                <TouchableOpacity onPress={() => { props.navigation.openDrawer() }} style={{ flexDirection: "row", alignItems: "center", }}>
                    <Icon name='menu' size={wp('8%')} color={'#000'}></Icon>
                </TouchableOpacity>
            </View>
            <KeyboardAwareScrollView keyboardShouldPersistTaps='always' refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#000" />}>
                <View style={styles.Container2}>
                    <HashedSnackbar visible={isActive} message={message} type={type} close={closeSnackBar} />




                    <View style={UserLabel.play_div}>

                        <View style={{ marginVertical: hp('1%'), flexDirection: 'row', alignItems: 'center', textAlign: 'left', justifyContent: 'flex-start' }}>
                            <Image
                                source={ImageAssets.logo} style={UserLabel.profile} />
                            <View style={{ marginVertical: hp('1%'), flexDirection: 'column', alignItems: 'flex-start', marginLeft: wp('3%'), textAlign: 'left', justifyContent: 'flex-start' }}>
                                <Text style={UserLabel.lblUser_lbl} ellipsizeMode='tail' numberOfLines={1}>{userObject.NAME}</Text>
                                <Text style={[UserLabel.lblUser_lbl, { fontSize: wp('3.5%'), color: '#adadad' }]} ellipsizeMode='tail' numberOfLines={1}>{userObject.SPA}</Text>
                            </View>
                        </View>
 

                        <View style={{ marginVertical: hp('2%'), width: '100%' }}>
                            <Text style={{ color: '#383838', fontFamily: 'InterBold', fontSize: wp('6%'), marginVertical: hp('2%') }}>Petition Status</Text>
                            {pageIndex==0 && 
                            <FlatList
                                style={styles.cardsWrapper}
                                data={CARDS_DATA}
                                renderItem={In_Cards} 
                                keyExtractor={(item) => item.title} 
                                contentContainerStyle={{ paddingRight: 20 }}
                            />
}
                        </View>

  {pageIndex==1 &&
                        <>
 <TouchableOpacity onPress={back} style={{ flexDirection: "row", alignItems: "center", }}>
                        <Icon name='chevron-left' size={wp('6%')} color={'#000'}></Icon>
                        <Text style={{ fontSize: wp('5%'), color: "#000" }}>Back</Text>
</TouchableOpacity>

{PetitionList != null && PetitionList != undefined && PetitionList.length>0 && PetitionList.map((item, index) => (
<View style={styles.div_bg}  key={index}>
<View style={{ width: wp('90%'), flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center' }}>


<View style={{ flexDirection: "column",paddingHorizontal: 10,width:'100%' }}>
<Text style={{ fontSize: wp('4.5%'), color: "#383838", fontFamily: "InterBold" }}>#{item.id}.{item.title}</Text>
<Text style={{ fontSize: wp('3%'), color: "#adadad", fontFamily: "InterRegular",paddingVertical:hp('1%')  }} numberOfLines={1} ellipsizeMode="tail">{item.dept}</Text>
</View>

</View> 
<View style={{ width: wp('90%'),flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center' }}>
<View style={{ flexDirection: "row", paddingHorizontal: 10,width:'100%',marginBottom:hp('4%') }}>
    {(item.status=='ToBeAssign' || item.status=='Rejected') &&
<TouchableOpacity onPress={() => { ApprovePetition(item) }} style={{ flexDirection: "row",width:'50%', alignItems: "center" }}>
<Icon name='thumb-up' size={wp('4%')} color='orange'></Icon>
<Text  style={{ marginLeft:wp('2%'),color: "#000", fontSize: wp('3.5%'), fontFamily: 'InterBold' }}>Click To Approve</Text>
</TouchableOpacity> 
}
{(item.status=='ToBeAssign' || item.status=='Approved') &&
<TouchableOpacity onPress={() => { RejectPetition(item) }} style={{ flexDirection: "row",width:'50%', alignItems: "center" }}>
<Icon name='cancel' size={wp('4%')} color='red'></Icon>
<Text  style={{ marginLeft:wp('2%'),color: "#000", fontSize: wp('3.5%'), fontFamily: 'InterBold' }}>Click To Reject</Text>
</TouchableOpacity> 
}
</View>

<View style={{ flexDirection: "row",alignItems:'center',justifyContent:"space-between",paddingHorizontal:10,width:'100%' }}>
 
<View style={{ flexDirection: "row",alignItems:'center',width:'23%' }}> 
<TouchableOpacity onPress={() => { showdetails(item) }} style={{ flexDirection: "row", alignItems: "center" }}>
<Icon name='eye' size={wp('4%')} color={'#5592d9'}></Icon>
<Text  style={{ marginLeft:wp('2%'),color: "#000", fontSize: wp('3.5%'), fontFamily: 'InterBold' }}>View</Text>
</TouchableOpacity>

</View> 
<View style={{ flexDirection: "row",alignItems:'center',width:'43%' }}>
<Icon name='clock' size={wp('4%')} color={'#5592d9'}></Icon>
<Text style={{ marginLeft:wp('2%'),fontSize: wp('3.5%'), color: "#383838", fontFamily: "InterBold" }}>{item.format_date}</Text>
</View>
</View>
</View> 
</View>
))
} 
</>
}
                    </View>


                </View>

            </KeyboardAwareScrollView>
            {/* 17B0E8 */}


        </Container>

    )

}
export default MPdashboard

const styles = StyleSheet.create({
    cardsWrapper: {
        
    },
    div_bg: {
        width: ('100%'),
        flexDirection: 'column',
        justifyContent: "flex-start",
        alignItems: 'center',
        marginTop: hp('1%'),
        paddingVertical: hp('1%'),
        marginBottom:hp('1%'),
        paddingHorizontal:wp('1%'),
        borderRadius: 10,
        backgroundColor: "#f0f3fe",

    },
    up_rank: {
        fontSize: wp('3%'),
        marginRight: 10,
        color: "#000",
        fontWeight: "bold"
    },
    edit: {
        borderRadius: 50,
        backgroundColor: "#17B0E8",
        marginLeft: wp('1%'),
        padding: 5
    },
    cord_btn: {
        backgroundColor: "#17B0E8",
        borderRadius: 50,
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: wp('2%'),
        paddingVertical: hp('1%'),
    },
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 22,
    },
    modalView: {
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 35,
        alignItems: 'center',

    },
    button: {
        borderRadius: 20,
        padding: 10,
        margin: 10,
        width: wp('40%'),
        elevation: 2,
    },
    buttonOpen: {
        backgroundColor: '#000',
    },
    buttonClose: {
        backgroundColor: '#2196F3',
    },
    textStyle: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    modalText: {
        marginBottom: 15,
        textAlign: 'center',
    },
    voters_div: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        width: '100%',
        paddingVertical: hp('2%'),
        marginTop: hp('1%'),
        backgroundColor: "#fff",
        height: 250,
        shadowColor: '#888',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.2,
        shadowRadius: 6,
        elevation: 14,
    },
    ann_img: {
        position: 'absolute',
        right: 0,
        top: 0,
        width: ('50%'),
        height: 250,
        resizeMode: 'contain'
    },
    Container2: {
        zIndex: 0,
        paddingTop: hp('2%'),
        alignContent: 'flex-start',
        alignSelf: 'flex-start',
        width: ('100%'),
        paddingHorizontal: wp('2%')
    },
    button_submit_2: {
        width: wp("70%"),
    },
    btn: {
        width: wp('40%'),
        borderRadius: 50,
        marginHorizontal: 2,
        justifyContent: 'center',
        alignContent: 'center',
        alignItems: 'center',
        alignSelf: "center",
        paddingVertical: wp("1%"),
        flexDirection: 'row',

    },
    loading_image: {
        width: 100,
        height: 50,
        zIndex: 999,
    },
    StatusBar: {
        height: Constants.statusBarHeight,
        backgroundColor: 'transparent'
    },
    button_submit: {
        width: wp('60%'),
        height: hp('7%'), 
        borderRadius: 10,
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'center',
        backgroundColor:'#5592d9'
    },
    button_submit_txt:{
        fontSize:wp('4%'),
        color:"#fff",
        marginLeft:5
    }
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

    },
    lblView1: {
        fontSize: wp("4%"),
        height: hp("70%"),
        width: wp('100%'),
        position: 'absolute',
        zIndex: 0,
        borderTopLeftRadius: 0,
        opacity: 0.5,
        borderTopRightRadius: 0,
        borderBottomLeftRadius: 150,
        borderBottomRightRadius: 150,

        paddingTop: hp("2%"),
        ...Platform.select({

            android: {
                height: hp("80%"),
            },
        })
    },
    profile: {
        width: wp('15%'),
        height: wp('15%'),
        borderRadius: 100,
        resizeMode: 'contain',
        marginTop: hp('1%')
    },
    label_bot_div: {
        alignSelf: 'center',
        display: 'flex',
        alignContent: 'center',
        flexDirection: 'column'
    },
    play_div: {
        width: ('100%'),
        flexDirection: 'column',
        marginTop: 6,
        alignContent: 'flex-start',
        alignItems: 'flex-start',
        paddingHorizontal: 5,

        paddingBottom: 100,
    },
    label_bot_div1: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
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
        color: '#323232',
        fontSize: wp("3.5%"),
        fontWeight: 'bold',
        textAlign: 'center',

    },
    lblUser: {
        flexDirection: 'row',
        color: "#000",
        fontSize: wp("6%"),
        textAlign: 'left',
        fontWeight: 'bold',
        marginLeft: wp('4%')
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
        fontSize: wp("6%"),
        fontWeight: '600',
        color: '#383838',
        textAlign: 'left',
        fontFamily: "InterMedium"
    },
    lblUser_lbl_1: {
        fontSize: wp("4%"),
        color: '#343434',
        borderColor: '#ffffff',
        marginLeft: wp('1%'),
        fontFamily: "InterRegular"
    },
    lblUser_lbl_1_underline: {
        fontSize: wp("4%"),
        color: '#fff',
        marginLeft: wp('1%'),
        fontFamily: "InterRegular",
    },
    lblNoOfPlayers: {
        fontSize: wp("3.5%"),
        fontWeight: 'bold',
        color: '#343434',
        textAlign: 'left',
        borderColor: '#ffffff',
    },
})


const card_styles = StyleSheet.create({
    container: {
      marginLeft: 20,
      width: wp('80%'),
      borderRadius: 10,
      shadowColor: '#888',
      shadowOffset: {
          width: 0,
          height: 4,
      },
      shadowOpacity: 0.2,
      shadowRadius: 6,
      elevation: 14, 
      padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
    height:150
    },
    background: {
      position: "absolute",
      left: 0,
      right: 0,
      top: 0,
      borderRadius: 10, 
      padding:10
    },  
    title: {
      marginTop: 0,
      fontSize:widthPercentageToDP('5%'),
      color:'#fff',
      fontFamily:'InterBold'
    }, 
    lastFourDigits: {
      marginTop: 15,
      paddingBottom: 8, 
      textAlign:'center',
      fontSize:widthPercentageToDP('8%'),
      color:'#fff',
      fontFamily:'InterBold'
    },
  });
  
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
