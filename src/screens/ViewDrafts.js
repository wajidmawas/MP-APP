import React, { useState, useEffect, useContext } from 'react'
import { View, Modal, Text, KeyboardAvoidingView, Image, Picker, Linking, TouchableWithoutFeedback, Keyboard, RefreshControl, TouchableOpacity, ScrollView, StatusBar, Alert, StyleSheet, TouchableHighlight, ViewBase } from 'react-native'
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
import { color } from 'react-native-reanimated';
import StepIndicator from 'react-native-step-indicator';
const ViewDrafts = (props) => {
    const [onlineplayers, setonlineplayers] = useState(0);
    const [storeState, dispatch] = useContext(AppContext);
    const [modalVisible, setModalVisible] = useState(false)
    const [Pstatus, setPstatus] = useState(false)
    const [PImage, setPImage] = useState(false)
    const [PAudioPath, setPAudioPath] = useState(false)
    const [saveConfirmation, setsaveConfirmation] = useState(false)
    const [ResendMsg, setResendMsg] = useState(false)
    const [showUpload, setshowUpload] = useState(false)
    const [val, setVal] = useState(false);
    const [loading, setloading] = React.useState(false)
    const [disabledButton, setdisabledButton] = React.useState(false)
    const [screenName, setscreenName] = useState("Petitions");
    const [tempUser, settempUser] = useState(0);
    const [userObject, setUserObject] = useState({});
    const { isActive, type, message, openSnackBar, closeSnackBar } = useSnackbar();
    const [state, setState] = useState({});
    const [VerifiedList, setVerifiedList] = useState(null); 
    const [Name, setName] = React.useState("")
    const [RName, setRName] = React.useState("")
    const [refreshing, setRefreshing] = React.useState(false);
    const [EName, setEName] = React.useState("")
    const [REName, setREName] = React.useState("")
    const [sex, setsex] = React.useState("")
    const [Age, setAge] = React.useState("")
    const [Comments, setComments] = useState({ value: '' })
    const [AttachmentPath, setAttachmentPath] = useState({ file: '', fileName: '' });
    const [MobileNo, setMobileNo] = useState({ value: '' })
    const [RMobileNo, setRMobileNo] = useState({ value: '' })
    const [HNO, setHNO] = React.useState("")
    const [EpicNo, setEpicNo] = React.useState("")
    const [whatsappmessage, setwhatsappmessage] = React.useState("")
    const [UniqueCode, setUniqueCode] = React.useState("")
    const [pageCnt, setpageCnt] = React.useState(0)
    const [SeqNo, setSeqNo] = React.useState(0)
    const [PBNO, setPBNO] = React.useState(0)
    const [AssemblyId, setAssemblyId] = React.useState(0)
    const [fillIsmobile, setfillIsmobile] = React.useState(false)
    const [location, setLocation] = useState(null);
    const [ModalTitle, setModalTitle] = React.useState("")
    const [ModalDesc, setModalDesc] = React.useState("")
    const [PID, setPID] = React.useState(0)
    const [AllTables, setTables] = React.useState("")
    const [selectedStatus, setselectedStatus] = React.useState("")
    const [selectedUser, setselectedUser] = React.useState("")
    const [StatusList, setStatusList] = React.useState("")
    const [UserList, setUserList] = React.useState("")
    const [PetitionList, setPetitionList] = React.useState("")     
    const [AllPetitionList, setAllPetitionList] = useState(null);   
    const isMobile = ["ఉంది", "లేదు"]
    const [imageselected, setImage] = useState(null);
    const [currentPage, setCurrentPage] = React.useState(0);
    const [currentPosition, setcurrentPosition] = React.useState(0);
    const [labels, setlabels] = React.useState(null);
    const [ActivitiesList, setActivitiesList] = React.useState(null);
    const [alldrafts, setalldrafts] = React.useState('')
    const [alldraftslist, setalldraftslist] = React.useState('')
     // ["Cart","Delivery Address","Order Summary","Payment Method","Track"];
   
    
    
       
        
       
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
            setRefreshing(false);
            GetDrafts()
        }, 1000);
    }, []);
    useEffect(() => {
        GetDrafts()
        
        //console.log("Home page Ended:");
      }, [])
    const onLoad = async () => {
        await AsyncStorage.getItem("userSession").then(async (value) => {
          let obj = JSON.parse(value);
          var _userObject = obj;
          if (_userObject != undefined) {
            setUserObject(_userObject)
            setuserid(_userObject.ID)
            GetDrafts();
             
          }
        }).then(res => {
          //do something else
        });
    
      }

    const filterList = async (_text) => {
        if (_text == "" || _text == null || _text == undefined) {
           
            setalldrafts(alldraftslist)
        }
        else {
            let _fList = alldraftslist.filter(a => a.title != null && ( 
                a.description.toUpperCase().includes(_text.toUpperCase()) ||
                a.title.toUpperCase().includes(_text.toUpperCase()) ));
                setalldrafts(_fList);
        }

    }
     
    const GetDrafts = async () => {
        try {
            const value = await AsyncStorage.getItem("userSession");
            if (value) {
                const obj = JSON.parse(value);
                const _userObject = obj
                const userID = _userObject.ID; // Store ID directly for immediate use
                setUserObject(_userObject); // Update state
    
                const body = {
                    TypeId: 24,
                    filterId: userID,
                    UserId: userID,
                    filterText: ""
                };
    
                console.log(JSON.stringify(body)); // Check output here
    
                const service = new Services();
                const data = await service.postData('/_getMasters', body);
    
                if (!data) {
                    openSnackBar("Invalid request object");
                    return;
                }
    
                const responseData = JSON.parse(data);
               
                if (responseData.errorCode == -100) {
                    notifyMessage(responseData.response);
                } else if (responseData.errorCode == 200) {
                    setalldrafts(responseData.response["Table"]);
                    setalldraftslist(responseData.response["Table"])
                    console.log(JSON.stringify(alldrafts))
                } 
            }
        } catch (error) {
            console.error("Error in GetDrafts:", error);
        }
    };
    
    const closemodal = () => {
        setModalVisible(false)
        setsaveConfirmation(false)
    }
    
    const deleteAttachment = async (flg) => {
        if (flg == 1) {
           
            setAttachmentPath({ file: "", fileName: "" })
        } 
      }
    const ViewAttachment = (file) => {
        Linking.openURL(file);
    } 
     
   
    const showdetails = (item) => { 
        setModalTitle(item.title);
        setModalDesc(item.description);
        setPID(item.id); 
        setPstatus(item.status); 
        setPImage(item.attachment);
        setPAudioPath(item.audio_path);
        setPstatus(item.status); 
        setselectedStatus("");setlabels([]); 
            setModalVisible(true)  
            // var service = new Services();
            // const body = {
            //     TypeId: 5,
            //     filterId: item.id,
            //     filterText: "",
            //     UserId: userObject.ID, 
            // };
             
            // service.postData('/_getMasters', body).then(data => {

            //     if (data == null || data == "") {
            //         openSnackBar("Invalid request object");
            //         return false;
            //     }
            //     var resonseData = JSON.parse(data) 
            //     if (resonseData.errorCode == -100) {
            //         notifyMessage(resonseData.response);
            //     }
            //     else if (resonseData.errorCode == 200) { 
            //         setActivitiesList(resonseData.response["Table"]) 
            //     }
            // });
    }
   
    const adddraft = () =>{
        props.navigation.replace('DrawerStack', { screen: 'AddDraft' })
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
                    <StatusBar translucent barStyle="light-content" />
                </View>
                {/* <AuthHeader back="0" /> */}
                <View style={{ width: wp("100%"), height: hp('10%'), paddingHorizontal: wp("2%"), flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>

                    {/* <TouchableOpacity onPress={back} style={{ flexDirection: "row", alignItems: "center", }}>
                        <Icon name='chevron-left' size={wp('6%')} color={'#000'}></Icon>
                        <Text style={{ fontSize: wp('5%'), color: "#000" }}>Back</Text>
                    </TouchableOpacity> */}
                    <TouchableOpacity onPress={() => { props.navigation.openDrawer() }}   >
                        <Icon onPress={() => { props.navigation.openDrawer() }} name="dots-horizontal" color={'#000'} size={wp('7%')}></Icon>

                    </TouchableOpacity>
                </View>
                <View style={styles.Container2}>

                    <HashedSnackbar visible={isActive} message={message} type={type} close={closeSnackBar} />

                    <View >
                        <View style={styles.top_div_lbl}>
                            <Text style={{ fontSize: wp('4%'), color: '#000', fontFamily: 'InterBold' }}>Total Drafts : {(alldrafts != null ?   alldrafts.length   : 0)}</Text>
                            <TouchableOpacity onPress={adddraft} style={{ backgroundColor: '#fff', borderRadius: 10, paddingVertical: 10,flexDirection:"row",alignItems:'center', paddingHorizontal: wp('5%') }}>
                            <Icon name='plus' size={wp('6%')} color={'#5592d9'}></Icon>   
                            <Text style={{ fontSize: wp('4%'), color: '#5592d9', fontFamily: 'InterBold' }}>Add</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                 
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
                        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                            <>
                               
                                    <View style={{ backgroundColor: "transparent", height:('90%'),paddingBottom: hp('2%') }} animationEnabled={false}>
                                    <KeyboardAwareScrollView keyboardShouldPersistTaps='always' refreshControl={
                                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#000" />}>
<>
                                        {alldrafts!=null && alldrafts!=undefined && alldrafts!="" && alldrafts.length>0 && alldrafts.map((item, index) => (
  <View style={styles.div_bg}  key={index}>
  <View style={{ width: wp('90%'), flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center' }}>

       
      <View style={{ flexDirection: "column",paddingHorizontal: 10,width:'100%' }}>
      <Text style={{ fontSize: wp('4.5%'), color: "#383838", fontFamily: "InterBold" }}>#{item.id}.{item.title}</Text>
      <Text style={{ fontSize: wp('3%'), color: "#adadad", fontFamily: "InterRegular",paddingVertical:hp('1%')  }} numberOfLines={1} ellipsizeMode="tail">{item.description}</Text>
  </View>
 
  </View> 
  <View style={{ width: wp('90%'),flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center' }}>
   

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
                                        </KeyboardAwareScrollView>
                                    </View>
                              
                            </>
                        </TouchableWithoutFeedback>

                    </View>
                </View >
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalVisible}
                    onRequestClose={() => {
                        setModalVisible(!modalVisible);
                    }}>
                    <View style={styles.centeredView}>
                        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                            <View style={[styles.modalView]}>
                                <View style={{ backgroundColor: "#fff", flexDirection: 'row', width: ('100%'), justifyContent: "space-between", alignItems: 'center', marginBottom: hp('3%') }}>
                                    <Text style={{ fontFamily: 'InterBold', color: "#0080AF", fontSize: wp('5%') }}>{ModalTitle}</Text>
                                    <TouchableOpacity style={{ backgroundColor: "#ccc" }} onPress={() => { closemodal() }} >
                                        <Icon name="close" size={wp('6%')} color={"#000"} />
                                    </TouchableOpacity>
                                </View>
                                <View style={{ width: ('100%'),paddingBottom:hp('2%')}}>
                                    <Text style={{ fontFamily: 'InterRegular', color: "#333", fontSize: wp('3.5%') }}>{ModalDesc}</Text>
                                </View>
                                <ScrollView style={{ width: '100%' }}> 
                                   
        <View style={{width:'100%',height:100,alignItems:'flex-start',marginBottom:hp('2%')}}>  
            <TouchableOpacity   style={styles.ann_img_1}  onPress={() => { ViewAttachment(PAudioPath) }} > 
            <Image  style={styles.ann_img_1} source={ImageAssets.play_icon} />
            <Text style={{top:50,left:10}}>Audio</Text>
                                    </TouchableOpacity>
 
                                    <TouchableOpacity  style={styles.ann_img} onPress={() => { ViewAttachment(PImage) }} >
                                   
                                    <Image  style={styles.ann_img} source={{ uri: PImage }}   />
                                    <Text style={{top:50,left:50}}>Attachment</Text>
                                    </TouchableOpacity>
                                   
        
            </View>

            <View style={{width:'100%', alignItems:'flex-start',marginBottom:hp('2%')}}>
                                {/* <StepIndicator
          customStyles={customStyles}
          stepCount={labels==undefined?0:labels.length}
          direction="vertical"
          currentPosition={labels==undefined?0:labels.length-1}
          labels={labels} 
        /> */}
        {ActivitiesList != null && ActivitiesList != undefined && ActivitiesList.length>0 && ActivitiesList.map((item, index) => (
 <> 
 <View style={styles.div_bg} >
  <View style={{ width: ('100%'), flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center' }}>

       
      <View style={{ flexDirection: "column", paddingHorizontal: 10,width:'100%' }}> 
      <Text style={{ fontSize: wp('3%'), color: "#adadad", fontFamily: "InterRegular" }}>{item.comments}</Text>
  </View>
  </View> 
  <View style={{ width: ('100%'),marginTop:hp('3%'), flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center' }}>


<View style={{ flexDirection: "row",alignItems:'center',justifyContent:"space-between",paddingHorizontal:10,width:'100%' }}>
<View style={{ flexDirection: "row",alignItems:'center',width:'25%' }}> 
<Text  style={{ color: "#faab3b", fontSize: wp('3.5%'), fontFamily: 'InterBold' }}>{item.status}</Text>
</View> 
<View style={{ flexDirection: "row",alignItems:'center',width:'23%' }}> 
<TouchableOpacity onPress={() => { ViewAttachment(item.attachment) }} style={{ flexDirection: "row", alignItems: "center" }}> 
<Image  style={styles.act_img} source={{ uri: item.attachment }}   />
 </TouchableOpacity>

</View> 
<View style={{ flexDirection: "row",alignItems:'center',width:'50%' }}>
<Icon name='clock' size={wp('4%')} color={'#5592d9'}></Icon>
<Text style={{ marginLeft:wp('2%'),fontSize: wp('3.5%'), color: "#383838", fontFamily: "InterBold" }}>{item.format_date}</Text>
</View>
</View>
</View> 
</View> 
 
</>
                                       ))
                                    }

        </View>
 
                                </ScrollView>


                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                </Modal>

                
            </>
            <View style={styles.login_bg}>
                <Image style={{ width: '100%', resizeMode: 'cover', height: ('100%') }} source={require('../assets/main_bg.png')} />
            </View>
        </Container >

    )

}
export default ViewDrafts

const styles = StyleSheet.create({
    stepIndicator: {
        marginVertical: 50,
        paddingHorizontal: 20,
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
    keyboardcontainer: {
        width: wp('90%'),
    },
    btn: {
        width: ('70%'),
        borderRadius: 50,
        justifyContent: 'center',
        marginVertical: 10,
        alignContent: 'center',
        alignItems: 'center',
        position: "relative",
        alignSelf: "center",
        paddingVertical: wp("4%"),
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
    act_img: { 
        width: ('100%'),
        height: 50,
        resizeMode: 'contain'
    },
    ann_img: {
        position: 'absolute',
        right: 0,
        top: 0,
        width: ('40%'),
        height: 50,
        resizeMode: 'contain'
    },
    ann_img_1: {
        position: 'absolute',
        left: 0,
        top: 0,
        width: ('40%'),
        height: 50,
        resizeMode: 'contain'
    },
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: 'rgba(0,0,0,0.6)'
    },
    modalView: {
       
        paddingTop: hp('6%'),
        width: ('100%'),
        backgroundColor: "white",
        borderRadius: 0,
        height:'100%',
        padding: ('4%'), 
        justifyContent: 'flex-start',
    },
    loading_image: {
        width: 100,
        height: 50,
        zIndex: 999,
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
    top_div_lbl: {
        width: '100%',
        alignItems: "center",
        flexDirection: 'row',
        justifyContent: 'space-between'
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
        paddingHorizontal: wp('2%'),
        alignContent: 'center',
        alignSelf: 'center',
        width: ('100%'),
    },
    input: {
        borderTopWidth: 0,
        borderLeftWidth: 0,
        borderRightWidth: 0,
        borderBottomWidth:0,
        paddingHorizontal: wp('2%'),  
        width: ('100%'), 
        color:'#333',  
        backgroundColor: 'transparent',
        fontFamily:"InterRegular",
        fontSize: wp('4%'), 
    },
    StatusBar: {
        height: Constants.statusBarHeight,
        backgroundColor: 'transparent'
    },
    fieldSet:{ 
        paddingTop: hp('2%'),
        paddingHorizontal: 10,
        paddingBottom: 10,
        borderRadius: 5,
        borderWidth: 1, 
        marginTop:hp('1%'),
        borderColor: '#ccc',
        marginBottom:50
    },
    legend:{
        position: 'absolute',
        top: -10,
        paddingHorizontal:10,
        left: 10,
        fontWeight: 'bold',
        backgroundColor: '#FFFFFF'
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
        width: ('100%'),
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: "#fff",
        marginTop: hp('2%'),
        height: hp('70%'),
        borderRadius: 10
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
        color: '#343434',
        fontSize: wp('3%'),
        textAlign: 'left',
        width: wp('100%'),
        marginVertical: hp('1%'),
        fontFamily: "InterBold"

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
