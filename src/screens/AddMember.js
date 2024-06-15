import React, { useState, useEffect, useContext } from 'react'
import {
  View, Text, Image, Modal, TouchableOpacity, ScrollView, StatusBar, Alert, StyleSheet, TouchableHighlight,
  TouchableWithoutFeedback, Keyboard, KeyboardAvoidingView
} from 'react-native'
import AuthHeader from '../components/AuthHeader';
import Container from '../components/Container';
import Background from '../components/Background'
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import ImageAssets from '../Global/ImageAssests';
import * as ImagePicker from 'expo-image-picker';
import CONSTANTS from '../Global/Constants' 
import HashedText from '../components/HashedText';
import Loader from '../components/Loader';
import HashedSnackbar, { useSnackbar } from '../components/HashedSnackbar';
import { theme } from '../core/theme'
import Button from '../components/Button'
import HashedDropdown from '../components/HashedDropdown'
import { AppContext } from '../Global/Stores';
import { LinearGradient } from 'expo-linear-gradient';
import Constants from 'expo-constants';
import {
  ToastAndroid,
  Platform,
  AlertIOS,
} from 'react-native';
import TextInput from '../components/TextInput'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Location from 'expo-location';
import Services from '../actions/services';
import NetInfo from '@react-native-community/netinfo';
import Icon from "react-native-vector-icons/MaterialCommunityIcons"
const AddMember = (props) => {
  const [MemberName, setMemberName] = useState({ value: '', error: '' })
  const [MemberMobile, setMemberMobile] = useState({ value: '', error: '' })
  const [MemberVoterId, setMemberVoterId] = useState({ value: '', error: '' })
  const [storeState, dispatch] = useContext(AppContext);
  const [val, setVal] = useState(false);
  const [AssemblyList, setAssemblyList] = useState([])
  const [AllAssemblyList, setAllAssemblyList] = useState([])
  const [userObject, setUserObject] = useState({});
  const { isActive, type, message, openSnackBar, closeSnackBar } = useSnackbar();
  const [AssemblySelect, SelectedAssembly] = useState(null)
  const [defaultCoordinates, setDefaultCoordinates] = useState({ DefaultLat: 0, DefaultLon: 0 });
  const [ustorage, setClientStorage] = useState({ UsedStorage: '0', ClientStorage: '200MB' });
  const [userSession, setuserSession] = useState(null);
  const [defaultAssembly, setDefaultAssembly] = useState("Select");
  const [username, setusername] = useState(null);
  const [VerifiedList, setVerifiedList] = useState(null);
  const [location, setLocation] = useState(null);
  const notifyMessage = (msg) => {
    if (Platform.OS === 'android') {
      ToastAndroid.show(msg, ToastAndroid.SHORT)
    } else {
      Alert.alert(msg);
    }
  }

  useEffect(() => {
    onLoad()
    GetCurrentLocation();
    //console.log("Home page Ended:");
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
    await AsyncStorage.getItem("userSession").then(async (value) => {
      let obj = JSON.parse(value);
      var _userObject = obj;
      if (_userObject != undefined) {
        setUserObject(_userObject)
        var service = new Services();
        const body = {
          TypeId: 1,
          UserId: _userObject.ID,
          FilterId: _userObject.State,
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
            notifyMessage(resonseData.message);
          }
          else if (resonseData.errorCode == 200) {
            // var _filteredList = [];
            // resonseData.response["Table"].map((myValue, myIndex) => {
            //   _filteredList.push(myValue.AssemblyName);
            // });
            // setAllAssemblyList(resonseData.response["Table"])
            // setAssemblyList(_filteredList)
            // let assembly = resonseData.response["Table"].filter(a => a.AssemblyID == _userObject.Assembly);
            // if (assembly != null) {
            //   setDefaultAssembly({"location": assembly[0].AssemblyName});
            //   SelectedAssembly({"location": assembly[0].AssemblyName});
            // }
          }
        });
      }
    }).then(res => {
      //do something else
    });

  }

  const SaveMember = async () => {
    let assemblyId = 0;
    if(AssemblySelect!=null && AssemblySelect!=undefined && AssemblySelect.location!=undefined)
    {
    let assembly = AllAssemblyList.filter(a => a.AssemblyName == AssemblySelect.location);
    if (assembly != null) {
      assemblyId = assembly[0].AssemblyID;
    }
  } 
    if (AssemblySelect === '' || AssemblySelect === undefined
      || AssemblySelect === null || assemblyId === 0) {
      notifyMessage('Please select assembly')
    }
    else if (MemberName.value === '' || MemberName.value === undefined
      || MemberName.value === null) {
      notifyMessage('Please enter beneficiary name')
    }
    else if (MemberMobile.value === '' || MemberMobile.value === undefined
      || MemberMobile.value === null ) {
      notifyMessage('Please enter beneficiary mobile no')
    }
    else if (MemberMobile.value.length==0 || MemberMobile.value.length<10) {
      notifyMessage('Invalid beneficiary mobile no')
    }
    else if (MemberVoterId.value === '' || MemberVoterId.value === undefined
      || MemberVoterId.value === null ) {
      notifyMessage('Please enter beneficiary voterid')
    }
    else if (MemberVoterId.value.length==0 || MemberVoterId.value.length<10) {
      notifyMessage('Invalid voterid')
    }
    else {
      var service = new Services();


      const body = {
        AssemblyId: assemblyId,
        UserId: userObject.ID,
        Member_Name: MemberName.value,
        Member_Mobile: MemberMobile.value,
        Member_VoterId: MemberVoterId.value,
        lat: location != undefined && location != null && location.coords != null ? location.coords.latitude : "",
        lon: location != undefined && location != null && location.coords != null ? location.coords.longitude : "",
      };
      console.log(body)
      service.postData('/_saveMember', body).then(data => {
        setVal(false)
        if (data == null || data == "") {
          openSnackBar("Invalid request object");
          return false;
        }

        var resonseData = JSON.parse(data)
        console.log(resonseData)
        if (resonseData.errorCode == -100) {
          notifyMessage(resonseData.message);
        }
        else if (resonseData.errorCode == 200) {
          notifyMessage("Successfully submitted");
          props.navigation.replace('DrawerStack', { screen: 'Home' })
        }
      });


    }
  }
  const back = () => {
    props.navigation.replace('DrawerStack', { screen: 'Home' })
  }
  return (
    <Container>

<>
      <View style={styles.StatusBar} >
        <StatusBar translucent barStyle="dark-content" />
      </View>
      <View style={{ width: wp("100%"), height: hp('10%'), paddingHorizontal: wp("2%"), flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
        <TouchableOpacity onPress={back} style={{ flexDirection: "row", alignItems: "center" }}>
        <Icon name='chevron-left' size={wp('6%')} color={'#fff'}></Icon>
        <Text style={{ fontSize: wp('5%'), color: "#fff" }}>Back</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => { props.navigation.openDrawer() }}   >
        <Icon onPress={() => { props.navigation.openDrawer() }} name="dots-horizontal" color={'#fff'} size={wp('7%')}></Icon>

        </TouchableOpacity>
      </View>
      <KeyboardAwareScrollView>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <> 
            <View style={styles.container}>

              <KeyboardAwareScrollView onPress={Keyboard.dismiss} style={{ width: '100%' }}>
                <View style={styles.play_div}>
                  
                  <> 
                    <View style={{ width: wp('100%'), marginVertical: wp("1%"), alignItems: "center", justifyContent: "center", flexDirection: "column" }}>
                      
                      <TextInput
                        theme={{ colors: { primary: 'transparent', text: "#00445D" } }}
                        underlineColor="transparent"
                        returnKeyType="next"
                        outlineColor="#fff"
                        placeholder="Title"
                        autoCapitalize='characters' 
                        value={MemberMobile.value}
                        style={styles.input}
                        selectionColor={'#000'}
                        maxLength={10}
                        onChangeText={(text) => setMemberMobile({ value: text, error: '' })}
                        error={!!MemberMobile.error}
                        errorText={MemberMobile.error}
                      />
                    </View>
                    <View style={{ width: wp('100%'), marginVertical: wp("1%"), alignItems: "center", justifyContent: "center", flexDirection: "column" }}>
                      
                      <TextInput
                        theme={{ colors: { primary: 'transparent', text: "#00445D" } }}
                        underlineColor="transparent"
                        returnKeyType="next"
                        outlineColor="#fff"
                        placeholder="Description"
                        autoCapitalize='characters' 
                        value={MemberMobile.value}
                        style={styles.input}
                        selectionColor={'#000'}
                        maxLength={10}
                        onChangeText={(text) => setMemberMobile({ value: text, error: '' })}
                        error={!!MemberMobile.error}
                        errorText={MemberMobile.error}
                      />
                    </View>
                    <View style={{ width: wp('100%'), marginVertical: wp("1%"), alignItems: "center", justifyContent: "center", flexDirection: "column" }}>
                      
                      <TextInput
                        theme={{ colors: { primary: 'transparent', text: "#00445D" } }}
                        underlineColor="transparent"
                        returnKeyType="next"
                        outlineColor="#fff"
                        placeholder="Department of Petition"
                        autoCapitalize='characters' 
                        value={MemberMobile.value}
                        style={styles.input}
                        selectionColor={'#000'}
                        maxLength={10}
                        onChangeText={(text) => setMemberMobile({ value: text, error: '' })}
                        error={!!MemberMobile.error}
                        errorText={MemberMobile.error}
                      />
                    </View>

                    <View style={{flexDirection:'row',flexWrap:'wrap',alignItems:'center',justifyContent:'space-between',marginTop:20,width:'100%',paddingHorizontal:wp('2%')}}>
                    
                   <TouchableOpacity style={{width:'48%',marginBottom:10,backgroundColor:'#faab3b'}} onPress={() => { SaveMember() }} >
                  <Button
                    style={styles.button_submit}
                    name="Submit"
                  >
                    Upload Photos
                  </Button>
                  </TouchableOpacity>
                  <TouchableOpacity style={{width:'48%',marginBottom:10,backgroundColor:'#2fc75c'}} onPress={() => { SaveMember() }} >
                  <Button
                    style={styles.button_submit} 
                  >
                    Upload Video
                  </Button>
                  </TouchableOpacity>
                  <TouchableOpacity style={{width:'48%',backgroundColor:'#5592d9'}} onPress={() => { SaveMember() }} >
                  <Button
                    style={styles.button_submit} 
                  >
                    Upload Audio
                  </Button>
                  </TouchableOpacity>
                  <TouchableOpacity style={{width:'48%',backgroundColor:'#ff7900'}} onPress={() => { SaveMember() }} >
                  <Button
                    style={styles.button_submit} 
                  >
                    Upload Attachment
                  </Button>
                  </TouchableOpacity>
                    </View>
                  </>


                </View>

              </KeyboardAwareScrollView>
             
                
            </View></>
        </TouchableWithoutFeedback></KeyboardAwareScrollView>
        </>
        <View style={styles.login_bg}>
                <Image style={{ width: '100%', resizeMode: 'cover', height: ('100%') }} source={require('../assets/main_bg.png')} />
            </View>
    </Container>
  )

}
export default AddMember

const styles = StyleSheet.create({
  play_div: {
    width: ('100%'),
    flexDirection: 'column', 
    alignItems: 'center',
    backgroundColor: "#fff",
    marginTop: hp('3%'),
    height: hp('100%'),
    borderRadius: 10,
    paddingTop:20
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
  main_bg: {
    width: "100%",
    height: "100%",
    position: "absolute",
    top: 0,
    left: 0,
    flex: 1
  },
  main_bg1: {
    width: "100%",
    resizeMode: 'contain',
    position: "absolute",
    top: hp('-2%'),
    left: 0,
  },
  container: {
    width: '100%',
    height: hp('100%'),
    alignItems: 'center',
    justifyContent: 'center',
  },
  login_image: {
    width: wp("80%"),
    height: wp("80%"),
    alignItems: 'center',
    resizeMode: 'contain',
    marginTop: wp("4%"),
  },
  loading_image: {
    width: 100,
    height: 50,
    zIndex: 999
  },
  logo_bg: {
    justifyContent: 'center',
    alignContent: 'center',
    paddingTop: 100,
  },
  login_text1: {
    fontSize: wp("4%"),
    color: '#fff',
    fontWeight: 'bold',
  },
  
  login_name: {
    width: wp('90%'),
    flexDirection: 'column',
    paddingTop: 100,
    paddingBottom: 40,
    ...Platform.select({
      android: {
        paddingTop: 20,
        paddingBottom: 40,
      },
    }),
  },
  login_text: {
    fontSize: wp("8%"),
    color: '#fff',
    fontWeight: 'bold',

  },
  login_span: {
    fontSize: wp("3%"),
    color: '#fff',
    paddingTop: 10,
    fontWeight: 'bold',
  },
  link1: {
    fontWeight: 'bold',
    color: '#AA0000',
    fontSize: wp("3%"),

  },
  row_text: {
    fontSize: wp("3%"),

  },
  row: {
    position: 'absolute',
    bottom: 70,
    flexDirection: 'row',
    alignItems: 'center',
    alignContent: 'center',
    justifyContent: 'center',
    zIndex: 9,
    width: wp('100%'),

  },
  row1: {
    position: 'absolute',
    bottom: 30,
    flexDirection: 'row',
    alignItems: 'center',
    alignContent: 'center',
    justifyContent: 'center',
    zIndex: 9,
    width: wp('100%'),

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
 
  link: {
    fontWeight: 'bold',
    textAlign: 'right',
    color: '#fff',
    fontSize: wp("2.5%"),
    ...Platform.select({
      android: {
        fontSize: wp("3%"),
      },
    }),

  },
  button_submit: {
    width: wp('100%'),
    color: '#409fbf',
    fontSize: wp("3%"),
    backgroundColor: 'transparent',
  },
  btn: {
    width: wp('70%'),
    borderRadius: 50,
    justifyContent: 'center',
    marginVertical: 30,
    alignContent: 'center',
    alignItems: 'center',
    position: "absolute",
    alignSelf: "center",
    bottom: hp('5%'),
    paddingVertical: wp("2%"),
    flexDirection: 'row', 
    ...Platform.select({
      ios: {
        bottom: hp('15%'),
      }
    })
  },
  btn1: {
    width: wp('50%'),
    borderRadius: 50,
    justifyContent: 'center',
    marginVertical: 30,
    alignContent: 'center',
    alignItems: 'center',
    position: "relative",
    alignSelf: "center", 
    paddingVertical: wp("2%"),
    flexDirection: 'row',
    
    
  },
  button_submit_dis: {
    marginVertical: wp('5%'),
    width: wp('60%'),
    backgroundColor: 'Silver',
    color: '#000',
    borderWidth: 4,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  labelinput1: {
    fontSize: wp("4%"),
    color: '#fff',
    fontWeight: 'bold',
    paddingLeft: 10,
    marginBottom: 5,

  },
  text_center: {
    textAlign: 'center',
  },
  labelinput: {
    fontSize: wp("4.5%"),
    color: '#0081B0',
    textAlign: "center",
    fontFamily: "InterRegular"

  },
  labelinput1: {
    fontSize: wp("3%"),
    color: '#fff',
    fontWeight: 'bold',
    paddingLeft: 10,
    fontFamily: "InterRegular"

  },
  StatusBar: {
    height: Constants.statusBarHeight,
    backgroundColor: 'transparent',
  },
})
