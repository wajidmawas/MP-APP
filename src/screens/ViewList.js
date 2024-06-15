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
const ViewList = (props) => {
    const [onlineplayers, setonlineplayers] = useState(0);
    const [storeState, dispatch] = useContext(AppContext);
    const [modalVisible, setModalVisible] = useState(false)
    const [saveConfirmation, setsaveConfirmation] = useState(false)
    const [ResendMsg, setResendMsg] = useState(false)
    const [showUpload, setshowUpload] = useState(false)
    const [val, setVal] = useState(false);
    const [loading, setloading] = React.useState(false)
    const [disabledButton, setdisabledButton] = React.useState(false)
    const [screenName, setscreenName] = useState("Members");
    const [userObject, setUserObject] = useState({});
    const { isActive, type, message, openSnackBar, closeSnackBar } = useSnackbar();
    const [state, setState] = useState({});
    const [VerifiedList, setVerifiedList] = useState(null);
    const [AllVerifiedList, setAllVerifiedList] = useState(null);
    const [totalVerifiedList, sertotalVerifiedList] = useState(null);
    const [Name, setName] = React.useState("")
    const [RName, setRName] = React.useState("")
    const [refreshing, setRefreshing] = React.useState(false);
    const [EName, setEName] = React.useState("")
    const [REName, setREName] = React.useState("")
    const [sex, setsex] = React.useState("")
    const [Age, setAge] = React.useState("")
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
    const [AllTables, setTables] = React.useState("")
    const [CasteList, setCasteList] = React.useState("")
    const [PreferenceList, setPreferenceList] = React.useState("")
    const [SubCasteList, setSubCasteList] = React.useState("")
    const [AllSubCasteList, setAllSubCasteList] = React.useState("")
    const [OccupationList, setOccupationList] = React.useState("")
    const [CasteSelected, setCasteSelected] = React.useState("")
    const [PreferenceSelected, setPreferenceSelected] = React.useState("")
    const [SubCasteSelected, setSubCasteSelected] = React.useState("")

    const [OccupationSelected, setOccupationSelected] = React.useState("")
    const isMobile = ["ఉంది", "లేదు"]
    const [imageselected, setImage] = useState(null);
    const clickImage = async () => {

        try {
            let result = await ImagePicker.launchCameraAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [4, 3],
                quality: 1,
            })
            if (!result.canceled) {
                let fileInfo = await FileSystem.getInfoAsync(result.assets[0].uri);
                setImage(fileInfo);
            }
        } catch (error) {
            notifyMessage(error);
            pickImage();
        }

    }
    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });



        if (!result.canceled) {
            // let image = await ImageManipulator.manipulateAsync(result.uri,[{resize:{width:1000,height:760}}],{compress: 0})
            let fileInfo = await FileSystem.getInfoAsync(result.assets[0].uri);
            setImage(fileInfo);

        }
    };
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
            onLoad(screenName)
        }, 1000);
    }, []);
    useEffect(() => {
        if (props["route"]["params"] != undefined &&
            props["route"]["params"]["screenName"] != null && props["route"]["params"]["screenName"] != undefined) {
            setscreenName(props["route"]["params"]["screenName"])
        }
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

    const filterList = async (_text) => {
        if (_text == "" || _text == null || _text == undefined) {
            if (pageCnt < totalVerifiedList.length) {
                let tempList = totalVerifiedList.slice(pageCnt, pageCnt + 10);
                setVerifiedList(VerifiedList.concat(tempList))
                let _temp = pageCnt;
                _temp = _temp + 10;
                setpageCnt(_temp);
            }
            else {
                setVerifiedList(totalVerifiedList)
            }
        }
        else {
            let _fList = totalVerifiedList.filter(a => a.EName != null && (
                a.EName.toUpperCase().includes(_text.toUpperCase()) ||
                a.House_No.toUpperCase().includes(_text.toUpperCase()) ||
                a.Voter.toUpperCase().includes(_text.toUpperCase())
                ||
                a.Mobile.toUpperCase().includes(_text.toUpperCase())));
            setVerifiedList(_fList);
        }

    }
    const onLoad = async () => {
        setloading(false)
        loadDataFromDB(props["route"]["params"]["screenName"]);
        loadMastersData();
    }
    const loadOfflineDataFromDB = async () => {
        await AsyncStorage.getItem("votersList").then(async (value) => {
            let obj = JSON.parse(value);
            if (obj != undefined) {
                setloading(false)
                let tempList = obj.slice(0, pageCnt + 50);
                setVerifiedList(tempList)
                let _temp = 0;
                _temp = _temp + 50;
                setpageCnt(_temp);
                sertotalVerifiedList(obj)
            }
            else {
                loadDataFromDB(props["route"]["params"]["screenName"]);
            }
        })
    }

    const reloadData = async () => {
        setloading(true)
        AsyncStorage.setItem("votersList", "");
        loadDataFromDB(props["route"]["params"]["screenName"]);
    }

    const loadDataFromDB = async (_scn) => {
        await AsyncStorage.getItem("userSession").then(async (value) => {
            let obj = JSON.parse(value);
            var _userObject = obj;
            if (_userObject != undefined) {
                setUserObject(_userObject)
                var service = new Services();
                console.log(_scn)
                const body = {
                    TypeId: 100,
                    filterId: _userObject.ID,
                    FilterText: _scn == "Voters to Meet" ? "" : "1",
                    UserId: _userObject.ID,
                };
                console.log(body);
                service.postData('/_getMasters', body).then(data => {
                    setloading(false)
                    if (data == null || data == "") {
                        openSnackBar("Invalid request object");
                        return false;
                    }
                    var resonseData = JSON.parse(data)

                    if (resonseData.errorCode == -100 || resonseData.errorCode == -200) {
                        notifyMessage(resonseData.response);
                    }
                    else if (resonseData.errorCode == 200) {
                        let _dt = resonseData.response["Table"];
                        if (_scn == "Manifesto Sent to Voters") {
                            _dt = _dt.filter(a => a.isWhatsupSend > 0);
                        }
                        else if (_scn == "Manifesto to be Sent") {
                            _dt = _dt.filter(a => a.isWhatsupSend == 0);
                        }
                        AsyncStorage.setItem("votersList", JSON.stringify(_dt));
                        loadOfflineDataFromDB();
                    }
                });
            }
        })
            .then(res => {
                //do something else
            });
    }
    const loadMastersData = async () => {
        await AsyncStorage.getItem("userSession").then(async (value) => {
            let obj = JSON.parse(value);
            var _userObject = obj;
            if (_userObject != undefined) {
                setUserObject(_userObject)
                var service = new Services();
                const body = {
                    TypeId: 6,
                    filterId: _userObject.ID,
                    filterText: "",
                    UserId: _userObject.ID,
                };
                service.postData('/_getMasters', body).then(data => {

                    if (data == null || data == "") {
                        openSnackBar("Invalid request object");
                        return false;
                    }
                    var resonseData = JSON.parse(data)
                    if (resonseData.errorCode == -100) {
                        notifyMessage(resonseData.message);
                    }
                    else if (resonseData.errorCode == 200) {
                        setTables(resonseData.response)
                        var _filteredList = [];
                        resonseData.response["Table"].map((myValue, myIndex) => {
                            _filteredList.push(myValue.name);
                        });

                        setCasteList(_filteredList);
                        _filteredList = [];
                        resonseData.response["Table1"].map((myValue, myIndex) => {
                            _filteredList.push(myValue.name);
                        });
                        setOccupationList(_filteredList);
                        _filteredList = [];
                        resonseData.response["Table2"].map((myValue, myIndex) => {
                            _filteredList.push(myValue.name);
                        });
                        setPreferenceList(_filteredList);
                        _filteredList = [];
                        resonseData.response["Table3"].map((myValue, myIndex) => {
                            _filteredList.push(myValue.name);
                        });
                        setAllSubCasteList(_filteredList);
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
    const OnPreferenceChange = async (_preferenceSelect) => {
        setPreferenceSelected(_preferenceSelect);
        if (_preferenceSelect == "కాంగ్రెస్ కార్యకర్త") {
            setshowUpload(true);
        }
        else {
            setshowUpload(false);
        }
    }

    const onChangeCaste = async (_casteSelected) => {
        var casteID = AllTables["Table"].filter(a => a.name == _casteSelected)
        setCasteSelected(_casteSelected);
        if (casteID != null && casteID.length > 0) {
            var _filterSub = AllTables["Table3"].filter(a => a.cid == casteID[0].seqno);
            let _filteredList = [];
            _filterSub.map((myValue, myIndex) => {
                _filteredList.push(myValue.name);
            });
            setSubCasteList(_filteredList);
        }
    }
    const OpenWhatsApp = async () => {
        if (MobileNo.value === '' || MobileNo.value === undefined
            || MobileNo.value === null) {
            notifyMessage('Please enter mobile no')
            return;
        }
        setloading(true)
        var service = new Services();
        const body = {
            code: UniqueCode,
            userid: userObject.ID,
            seqno: SeqNo,
            boothno: PBNO,
            assemblyId: AssemblyId,
            userid: userObject.ID,
            msg: whatsappmessage,
            from_no: userObject.MOBILE,
            to_no: MobileNo.value,
        };

        service.postData('/_sendMessage', body).then(data => {
            console.log(data)
            setloading(false)
            if (data == null || data == "") {
                openSnackBar("Invalid request object");
                return false;
            }
            var resonseData = JSON.parse(data)
            if (resonseData.errorCode == -100 || resonseData.errorCode == -200) {
                notifyMessage(resonseData.response);
            }
            else if (resonseData.errorCode == 200) {
                AsyncStorage.setItem("votersList", "");
                Linking.openURL('whatsapp://send?text=' + whatsappmessage + '&phone=' + MobileNo.value)
                setTimeout(() => {
                    props.navigation.replace('DrawerStack', { screen: 'Home' })
                }, 500);
            }
        });

    }
    const go2Home = async () => {
        props.navigation.replace('DrawerStack', { screen: 'Home' })
    }
    const SaveMember = async () => {

        if (MobileNo.value === '' || MobileNo.value === undefined
            || MobileNo.value === null) {
            notifyMessage('Please enter mobile no')
            return;
        }
        else if (CasteSelected === '' || CasteSelected === undefined
            || CasteSelected === null) {
            notifyMessage('Please select')
        }
        // else  if (SubCasteSelected === '' || SubCasteSelected === undefined
        // || SubCasteSelected === null) {
        // notifyMessage('Please select sub caste')
        // }
        else if (OccupationSelected === '' || OccupationSelected === undefined
            || OccupationSelected === null) {
            notifyMessage('Please select')
        }
        else if (PreferenceSelected === '' || PreferenceSelected === undefined
            || PreferenceSelected === null) {
            notifyMessage('Please select')
        }
        else if (PreferenceSelected === "కాంగ్రెస్ కార్యకర్త" && (imageselected === undefined
            || imageselected === null || imageselected === "")) {
            notifyMessage('Please select image')
        }
        else {
            var service = new Services();
            setdisabledButton(true)
            let _cID = 0, _oID = 0, _pID = 0, _scID = 0;
            let selectedItem = AllTables["Table"].filter(a => a.name == CasteSelected)
            if (selectedItem != null && selectedItem.length > 0) {
                _cID = selectedItem[0].seqno;
            }
            selectedItem = AllTables["Table1"].filter(a => a.name == OccupationSelected)
            if (selectedItem != null && selectedItem.length > 0) {
                _oID = selectedItem[0].seqno;
            }
            selectedItem = AllTables["Table2"].filter(a => a.name == PreferenceSelected)
            if (selectedItem != null && selectedItem.length > 0) {
                _pID = selectedItem[0].seqno;
            }

            selectedItem = AllTables["Table3"].filter(a => a.name == SubCasteSelected)
            if (selectedItem != null && selectedItem.length > 0) {
                _scID = selectedItem[0].seqno;
            }
            var payload = new FormData();

            payload.append('UserId', userObject.ID);
            payload.append('id', SeqNo);
            payload.append('caste', _cID);
            payload.append('subCasteName', _scID);
            payload.append('VotingPref', _pID);
            payload.append('VersionNo', "3.0");
            payload.append('Mobile', MobileNo.value);
            payload.append('Profession', _oID);
            payload.append('boothNO', PBNO);
            payload.append('latitude', location != undefined && location != null && location.coords != null ? location.coords.latitude : "");
            payload.append('longitude', location != undefined && location != null && location.coords != null ? location.coords.longitude : "");
            if (imageselected != null && imageselected != "") {
                payload.append('imagePath2', {
                    uri: imageselected.uri,
                    type: 'image/jpeg',
                    name: "test"
                });
            }
            service.postFormData('/_UpdateVoterDetails', payload).then(data => {
                setVal(false)
                setdisabledButton(false)
                if (data == null || data == "") {
                    openSnackBar("Invalid request object");
                    return false;
                }

                var resonseData = JSON.parse(data)
                if (resonseData.errorCode == -100 || resonseData.errorCode == -200) {
                    notifyMessage(resonseData.message);
                }
                else if (resonseData.errorCode == 200) {
                    notifyMessage("Successfully submitted");
                    AsyncStorage.setItem("votersList", "");
                    setsaveConfirmation(true);

                }
            });
        }
    }

    const back = () => {
        props.navigation.replace('DrawerStack', { screen: 'Home' })
    }
    const LoadMore = () => {
        let tempList = totalVerifiedList.slice(pageCnt, pageCnt + 50);
        setVerifiedList(VerifiedList.concat(tempList))
        let _temp = pageCnt;
        _temp = _temp + 50;
        setpageCnt(_temp);

    }
    const sendWhatsUp = (item) => {
        setRMobileNo({ value: item.Mobile })
        setResendMsg(true);
        editdetails(item, 0);
        setMobileNo({ value: item.Mobile })
    }
    const editdetails = (item, flg) => {
        setshowUpload(false);
        setMobileNo({ value: '' })
        if (flg == 1)
            setModalVisible(true)
        setName("")
        setEName("")
        setRName("")
        setREName("")
        setAge("")
        setHNO("")
        setEpicNo("")
        setSeqNo(0)
        setwhatsappmessage("")
        setUniqueCode("")
        setPBNO("")
        setAssemblyId("")
        var service = new Services();
        const body = {
            TypeId: 10,
            UserId: userObject.ID,
            FilterId: userObject.ID,
            FilterText: item.SeqNo
        };
        service.postData('/_getMasters', body).then(data => {
            setVal(false)
            //console.log(data);
            if (data == null || data == "") {
                openSnackBar("Invalid request object");
                return false;
            }

            var resonseData = JSON.parse(data)
            if (resonseData.errorCode == -100) {
                notifyMessage(resonseData.message);
            }
            else if (resonseData.errorCode == 200) {
                setName(resonseData.response["Table"][0].name)
                setEName(resonseData.response["Table"][0].EVoter)
                setRName(resonseData.response["Table"][0].GuardianName)
                setREName(resonseData.response["Table"][0].EGuardianName)
                setAge(resonseData.response["Table"][0].Age)
                setHNO(resonseData.response["Table"][0].House_No)
                setEpicNo(resonseData.response["Table"][0].EPIC_NO)
                setSeqNo(item.SeqNo)
                setwhatsappmessage(resonseData.response["Table"][0].whatsappmessage)
                setUniqueCode(resonseData.response["Table"][0].unique_code)
                setPBNO(resonseData.response["Table"][0].PBNO)
                setAssemblyId(resonseData.response["Table"][0].AC_NO)
            }
        });
    }
    const addmember = () =>{
        props.navigation.replace('DrawerStack', { screen: 'AddMember' })
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
                        <Icon name='chevron-left' size={wp('6%')} color={'#fff'}></Icon>
                        <Text style={{ fontSize: wp('5%'), color: "#fff" }}>Back</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => { props.navigation.openDrawer() }}   >
                        <Icon onPress={() => { props.navigation.openDrawer() }} name="dots-horizontal" color={'#fff'} size={wp('7%')}></Icon>

                    </TouchableOpacity>
                </View>
                <View style={styles.Container2}>

                    <HashedSnackbar visible={isActive} message={message} type={type} close={closeSnackBar} />

                    <View >
                        <View style={styles.top_div_lbl}>
                            <Text style={{ fontSize: wp('8%'), color: '#fff', fontFamily: 'InterBold' }}>16</Text>
                            <TouchableOpacity onPress={addmember} style={{ backgroundColor: '#fff', borderRadius: 10, paddingVertical: 10, paddingHorizontal: wp('5%') }}>
                                <Text style={{ fontSize: wp('4%'), color: '#5592d9', fontFamily: 'InterBold' }}>Add</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={UserLabel.play_div}>
                        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                            <>
                                <KeyboardAwareScrollView keyboardShouldPersistTaps='always' refreshControl={
                                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#000" />}>
                                    <View style={{ backgroundColor: "transparent", paddingBottom: hp('10%') }} animationEnabled={false}>
                                        <>


                                            <View style={styles.div_bg} >
                                                <View style={{ width: wp('90%'), flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center' }}>

                                                    <View style={{ width: 32, height: 32, backgroundColor: '#faab3b', borderRadius: 50, alignItems: 'center', justifyContent: 'center' }}>

                                                        <Text style={{ color: "#fff", fontSize: wp('3.5%'), fontFamily: 'InterBold' }}>1</Text>

                                                    </View>
                                                    <View style={{ flexDirection: "column", paddingHorizontal: 10 }}>
                                                    <Text style={{ fontSize: wp('5%'), color: "#383838", fontFamily: "InterBold" }}>Seqno</Text>
                                                    <Text style={{ fontSize: wp('3.5%'), color: "#adadad", fontFamily: "InterRegular" }}>Lorem Ipsum simply dummy text</Text>
                                                </View>
                                                </View> 
                                                <View style={{ width: wp('90%'),marginTop:hp('3%'), flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center' }}>

 
<View style={{ flexDirection: "row",alignItems:'center',justifyContent:"space-between",paddingHorizontal:10,width:'100%' }}>
    <View style={{ flexDirection: "row",alignItems:'center' }}>
<Icon name='image' size={wp('4%')} color={'#5592d9'}></Icon>
<Text style={{ marginLeft:wp('2%'),fontSize: wp('3.5%'), color: "#383838", fontFamily: "InterBold" }}>4</Text>
</View>
<View style={{ flexDirection: "row",alignItems:'center' }}>
<Icon name='video' size={wp('4%')} color={'#5592d9'}></Icon>
<Text style={{ marginLeft:wp('2%'),fontSize: wp('3.5%'), color: "#383838", fontFamily: "InterBold" }}>4</Text>
</View>
<View style={{ flexDirection: "row",alignItems:'center' }}>
<Icon name='clock' size={wp('4%')} color={'#5592d9'}></Icon>
<Text style={{ marginLeft:wp('2%'),fontSize: wp('3.5%'), color: "#383838", fontFamily: "InterBold" }}>02:10PM</Text>
</View>
</View>
</View> 
                                            </View>


                                        </>
                                    </View>
                                </KeyboardAwareScrollView>
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
                            <View style={styles.modalView}>
                                <View style={{ backgroundColor: "#fff", flexDirection: 'row', width: ('90%'), justifyContent: "space-between", alignItems: 'center', marginBottom: hp('3%') }}>
                                    <Text style={{ fontFamily: 'InterBold', color: "#0080AF", fontSize: wp('5%') }}>Voter Details</Text>
                                    <TouchableOpacity style={{ backgroundColor: "#ccc" }} onPress={() => { closemodal() }} >
                                        <Icon name="close" size={wp('6%')} color={"#000"} />
                                    </TouchableOpacity>
                                </View>

                                <ScrollView style={{ flexGrow: 1 }}>
                                    <View style={{ flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center' }}>

                                        <View style={{ width: ('50%'), marginBottom: 10 }}>
                                            <Text style={UserLabel.labelinput} >Voter:</Text>
                                            <Text style={styles.labelinput1} >{EName} </Text>
                                        </View>
                                        <View style={{ width: ('50%'), marginBottom: 10 }}>
                                            <Text style={UserLabel.labelinput} >Relative Name:</Text>
                                            <Text style={styles.labelinput1} >{REName}</Text>
                                        </View>
                                        <View style={{ width: ('50%'), marginBottom: 10 }}>
                                            <Text style={UserLabel.labelinput} >Seqno:</Text>
                                            <Text style={styles.labelinput1} >{SeqNo}</Text>
                                        </View>
                                        <View style={{ width: ('50%'), marginBottom: 10 }}>
                                            <Text style={UserLabel.labelinput} >Age:</Text>
                                            <Text style={styles.labelinput1} >{Age}</Text>
                                        </View>
                                        <View style={{ width: ('50%'), marginBottom: 10 }}>
                                            <Text style={UserLabel.labelinput} >Address:</Text>
                                            <Text style={styles.labelinput1} >{HNO}</Text>
                                        </View>
                                        <View style={{ width: ('50%'), marginBottom: 10 }}>
                                            <Text style={UserLabel.labelinput} >Epic No:</Text>
                                            <Text style={styles.labelinput1} >{EpicNo}</Text>
                                        </View>
                                    </View>


                                    <View style={{ width: ('100%'), marginBottom: 15 }}>
                                        <Text style={UserLabel.labelinput} >Mobile

                                        </Text>
                                        <TextInput1 theme={{ colors: { primary: "transparent" } }}
                                            underlineColor="transparent"
                                            returnKeyType="next"
                                            keyboardType='numeric'
                                            placeholder="Enter your Mobile Number"
                                            value={MobileNo.value}
                                            style={styles.input}
                                            selectionColor={'#000'}
                                            onChangeText={(text) => setMobileNo({ value: text })}
                                        />
                                        {/* <TouchableOpacity onPress={() => { OpenWhatsApp() }} style={{ top: 0  }}>

                                               <Text style={{ color: "#25D366"  }}> ఓటరు కు వాట్సాప్ పంపించుటకు క్లిక్ చేయండి <Icon name="whatsapp" size={wp('6%')} color={"#25D366"} /></Text> 

</TouchableOpacity> */}
                                    </View>
                                    <View style={{ width: ('100%'), marginBottom: 2 }}>
                                        <Text style={UserLabel.labelinput} >Who do you normally vote?</Text>
                                        <HashedDropdown dropdownName="Select" style={UserLabel.input}
                                            onSelect={(selectedItem, index) => onChangeCaste(selectedItem)}
                                            dropdownList={CasteList} type="Caste" />
                                    </View>
                                    <View style={{ width: ('100%'), marginBottom: 2 }}>
                                        <Text style={UserLabel.labelinput} >Do you feel the current Member of Parliament representing your interests?</Text>
                                        <HashedDropdown dropdownName="Select" style={UserLabel.input}
                                            onSelect={(selectedItem, index) => setSubCasteSelected(selectedItem)}
                                            dropdownList={SubCasteList} type="SubCaste" />
                                    </View>
                                    <View style={{ width: ('100%'), marginBottom: 5 }}>
                                        <Text style={UserLabel.labelinput} >Do you think the change in local election to Liberal Democrats will bring you the change you have been longing for?</Text>
                                        <HashedDropdown dropdownName="Select" style={UserLabel.input}
                                            onSelect={(selectedItem, index) => setOccupationSelected(selectedItem)}
                                            dropdownList={OccupationList} type="Profession" />
                                    </View>
                                    <View style={{ width: ('100%'), marginBottom: 5 }}>
                                        <Text style={UserLabel.labelinput} >Who do you think is responsible for the bankruptcy of the Council, increase in Council tax, increase in cost of living? </Text>
                                        <HashedDropdown dropdownName="Select" style={UserLabel.input}
                                            onSelect={(selectedItem, index) => OnPreferenceChange(selectedItem)}
                                            dropdownList={PreferenceList} type="Preference" />
                                    </View>
                                    <View style={{ width: ('100%'), marginBottom: 5 }}>
                                        <Text style={UserLabel.labelinput} > Your input to Jai Husain who is standing for Liberal Democrats? </Text>
                                        <HashedDropdown dropdownName="Select" style={UserLabel.input}
                                            onSelect={(selectedItem, index) => OnPreferenceChange(selectedItem)}
                                            dropdownList={PreferenceList} type="Preference" />
                                    </View>
                                    {showUpload && (
                                        <View style={{ width: ('100%'), marginBottom: 15, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around' }}>
                                            <View style={{ flexDirection: 'column', justifyContent: 'center' }}>

                                                <>
                                                    <LinearGradient
                                                        colors={['#4e73df', '#4e73df']}
                                                        useAngle={true}
                                                        style={styles.btn}
                                                        start={{ x: 0.7, y: 1 }}
                                                        end={{ x: 0, y: 1 }}
                                                    >
                                                        <TouchableOpacity onPress={() => { clickImage() }}>
                                                            <Text style={{ fontFamily: "InterBold", fontSize: wp('3%'), color: "#fff", marginVertical: wp('1%'), paddingHorizontal: wp("1%") }}>
                                                                <Icon name="camera" size={wp('4%')} color={"#fff"} />
                                                                &nbsp;&nbsp;Take Selfie</Text>
                                                        </TouchableOpacity>
                                                    </LinearGradient></>
                                            </View>
                                            <View>
                                                {imageselected == null || imageselected == "" ?
                                                    <Image source={require('../assets/user_profile.png')} style={{ width: 100, height: 100, resizeMode: 'contain' }} />
                                                    :
                                                    <Image source={{ uri: imageselected.uri }} style={{ width: 100, height: 100, resizeMode: 'contain' }} />
                                                }
                                            </View>
                                        </View>
                                    )}


                                    <View style={{ width: ('100%'), marginBottom: 15 }}>
                                        <>

                                            <TouchableOpacity onPress={() => { SaveMember() }} disabled={disabledButton}>
                                                <LinearGradient
                                                    colors={['#4e73df', '#4e73df']}
                                                    useAngle={true}
                                                    style={styles.btn}
                                                    start={{ x: 0.7, y: 1 }}
                                                    end={{ x: 0, y: 1 }}
                                                >

                                                    <Text style={{ fontFamily: "InterBold", fontSize: wp('4%'), color: "#fff", marginVertical: wp('1%'), paddingHorizontal: wp("5%") }}>Submit</Text>

                                                </LinearGradient>
                                            </TouchableOpacity>

                                        </>
                                    </View>
                                </ScrollView>


                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                </Modal>

                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={saveConfirmation}
                    onRequestClose={() => {
                        setsaveConfirmation(!saveConfirmation);
                    }}>
                    <View style={styles.centeredView}>
                        <View style={styles.modalView}>
                            <View style={{ backgroundColor: "#fff", flexDirection: 'row', width: ('90%'), justifyContent: "space-between", alignItems: 'center', marginBottom: hp('3%') }}>
                                <Text style={{ fontFamily: 'InterBold', color: "#0080AF", fontSize: wp('5%') }}>Survey Submitted</Text>
                                <TouchableOpacity style={{ backgroundColor: "#ccc" }} onPress={() => { setsaveConfirmation(!saveConfirmation) }} >
                                    <Icon name="close" size={wp('6%')} color={"#000"} />
                                </TouchableOpacity>
                            </View>
                            <View style={{ width: wp('90%'), flexDirection: "column" }}>
                                <View style={{ marginVertical: hp('3%'), flexDirection: 'column', alignItems: 'center', textAlign: 'left', justifyContent: 'flex-start' }}>
                                    <TouchableOpacity onPress={() => { OpenWhatsApp() }} style={{ paddingHorizontal: wp('1%'), flexDirection: 'row', alignItems: 'center', width: '100%', backgroundColor: '#4e73df', color: '#25D366', height: 50, borderRadius: 40, paddingHorizontal: wp("4%"), fontSize: wp('2%') }}>
                                        <Icon name="whatsapp" size={wp('6%')} color={"#25D366"} />
                                        <Text style={{ fontSize: wp('3.5%'), color: '#fff', marginLeft: wp('1%') }} numberOfLines={2}>Click to whatsapp Congress Guarantee to Voter.</Text>

                                    </TouchableOpacity>

                                    <TouchableOpacity onPress={() => { go2Home() }} style={{ paddingHorizontal: wp('1%'), flexDirection: 'row', alignItems: 'center', width: '100%', backgroundColor: '#001335', marginTop: hp('2%'), height: 50, borderRadius: 40, paddingHorizontal: wp("4%") }}>
                                        <Icon name="close" size={wp('6%')} color={"#fff"} />
                                        <Text style={{ fontSize: wp('3.5%'), color: '#fff', marginLeft: wp('1%') }} numberOfLines={2}>Go to the next record without sending a guarantee card.</Text>

                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </View>
                </Modal>
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={ResendMsg}
                    onRequestClose={() => {
                        setResendMsg(!ResendMsg);
                    }}>
                    <View style={styles.centeredView}>
                        <View style={styles.modalView}>
                            <View style={{ backgroundColor: "#fff", flexDirection: 'row', width: ('90%'), justifyContent: "space-between", alignItems: 'center', marginBottom: hp('3%') }}>
                                <Text style={{ fontFamily: 'InterBold', color: "#0080AF", fontSize: wp('5%') }}>Send WhatsUp Message</Text>
                                <TouchableOpacity style={{ backgroundColor: "#ccc" }} onPress={() => { setResendMsg(!ResendMsg) }} >
                                    <Icon name="close" size={wp('6%')} color={"#000"} />
                                </TouchableOpacity>
                            </View>
                            <View style={{ width: ('100%'), marginBottom: 5 }}>
                                <Text style={UserLabel.labelinput} >మొబైల్

                                </Text>
                                <TextInput1 theme={{ colors: { primary: "transparent" } }}
                                    underlineColor="transparent"
                                    returnKeyType="next"
                                    keyboardType='numeric'
                                    placeholder="Enter your Mobile Number"
                                    value={RMobileNo.value}
                                    style={styles.input}
                                    selectionColor={'#000'}
                                    selection={{ start: 0 }}
                                    onChangeText={(text) => setRMobileNo({ value: text })}
                                />

                            </View>
                            <View style={{ width: wp('90%'), flexDirection: "column" }}>
                                <View style={{ marginVertical: hp('3%'), flexDirection: 'column', alignItems: 'center', textAlign: 'left', justifyContent: 'flex-start' }}>
                                    <TouchableOpacity onPress={() => { OpenWhatsApp() }} style={{ paddingHorizontal: wp('1%'), flexDirection: 'row', alignItems: 'center', width: '100%', backgroundColor: '#4e73df', color: '#25D366', height: 50, borderRadius: 40, paddingHorizontal: wp("4%"), fontSize: wp('2%') }}>
                                        <Icon name="whatsapp" size={wp('6%')} color={"#25D366"} />
                                        <Text style={{ fontSize: wp('3.5%'), color: '#fff', marginLeft: wp('1%') }} numberOfLines={2}>Click to Send Congress Guarantee to Voter.</Text>

                                    </TouchableOpacity>

                                    <TouchableOpacity onPress={() => { setResendMsg(false) }} style={{ paddingHorizontal: wp('1%'), flexDirection: 'row', alignItems: 'center', width: '100%', backgroundColor: '#001335', marginTop: hp('2%'), height: 50, borderRadius: 40, paddingHorizontal: wp("4%") }}>
                                        <Icon name="close" size={wp('6%')} color={"#fff"} />
                                        <Text style={{ fontSize: wp('3.5%'), color: '#fff', marginLeft: wp('1%') }} numberOfLines={2}>Close</Text>

                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </View>
                </Modal>
            </>
            <View style={styles.login_bg}>
                <Image style={{ width: '100%', resizeMode: 'cover', height: ('100%') }} source={require('../assets/main_bg.png')} />
            </View>
        </Container >

    )

}
export default ViewList

const styles = StyleSheet.create({
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
        zIndex: 999,
    },
    div_bg: {
        width: wp('90%'),
        flexDirection: 'column',
        justifyContent: "flex-start",
        alignItems: 'center',
        marginTop: hp('1%'),
        paddingVertical: hp('1%'),
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
        width: ('100%'),
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: "#fff",
        marginTop: hp('5%'),
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
