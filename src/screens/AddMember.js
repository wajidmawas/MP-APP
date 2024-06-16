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
import * as FileSystem from 'expo-file-system';
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
import { Audio } from 'expo-av';
import { COLORS } from "../components/colors";
const AddMember = (props) => {
  const [MemberName, setMemberName] = useState({ value: '', error: '' })
  const [PTitle, setPTitle] = useState({ value: '', error: '' })
  const [PDesc, setPDesc] = useState({ value: '', error: '' })
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
  const [playingStatus, setplayingStatus] = useState({ playingStatus: ""});  
  const [AttachmentPath, setAttachmentPath] = useState({ file: '', fileName: '' });
  const [DeptList, setDeptList] = React.useState("")
  const [AllDeptList, setAllDeptList] = React.useState("")
    const [recording, setRecording] = React.useState();
    const [recordingDuration, setrecordingDuration] = React.useState();
    const [recordingText, setrecordingText] = React.useState();
    const [AudioPath, setAudioPath] = useState(null);
    const [sound, setSound] = React.useState();
    const [Duration, setDuration] = React.useState({ TotalDuration: 0, PlayingDuration: 0 });
    const [DeptSelected, setDeptSelected] = React.useState("")
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
    setAudioPath({ file: "", fileName: "",Dur:0 })
     setAttachmentPath({ file: "", fileName: "",Dur:0 })
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
  const pickImage = async (flg) => {
    let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        aspect: [4, 3],
        quality: 1,
    });



    if (!result.canceled) {
        // let image = await ImageManipulator.manipulateAsync(result.uri,[{resize:{width:1080,height:720}}],{compress: 0})
        let fileInfo = await FileSystem.getInfoAsync(result.assets[0].uri);
        setAttachmentPath({ file: result.assets[0].uri, fileName: result.assets[0].uri.split("/").slice(-1)[0],Dur:0 })

    }
};

  async function stopRecording() {
    setDuration({
        TotalDuration: 0,
        PlayingDuration: 0
    })
    setRecording(undefined);
    await recording.stopAndUnloadAsync();
    const uri = recording.getURI();
    console.log('Recording stopped and stored at', recording);
    setplayingStatus({
        playingStatus: ""
    });
    setrecordingText(uri)
    setAudioPath({ file: uri, fileName: uri.split("/").slice(-1)[0],Dur:recordingDuration })
}
async function startRecording() {
    try {
        console.log('Requesting permissions..');
        setDuration({
            TotalDuration: 0,
            PlayingDuration: 0
        })
        await Audio.requestPermissionsAsync();
        await Audio.setAudioModeAsync({
            allowsRecordingIOS: true,
            playsInSilentModeIOS: true,
        });
        console.log('Starting recording..');
        const recording = new Audio.Recording();
        await recording.prepareToRecordAsync(Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY);
        await recording.startAsync();
        recording.setOnRecordingStatusUpdate(onRecordingStatusUpdate); 
        setRecording(recording);
        console.log('Recording started');
    } catch (err) {
        console.error('Failed to start recording', err);
    }
}
async function playSound() {
  console.log('Loading Sound : '+ playingStatus.playingStatus);
  let beginFromStart=0;
  if(Duration.TotalDuration==Duration.PlayingDuration){ 
      setplayingStatus({
          playingStatus: null
      }); 
      beginFromStart=1;
  }
  if(playingStatus.playingStatus ==null || playingStatus.playingStatus=="" || beginFromStart==1){
  const { sound } = await Audio.Sound.createAsync({ uri: recordingText },
      { shouldPlay: true },
      (status) => setDuration({
          TotalDuration: millisToMinutesAndSeconds(status.durationMillis),
          PlayingDuration: millisToMinutesAndSeconds(status.positionMillis)
      }));
  setSound(sound);
  await sound.playAsync();
  setplayingStatus({
      playingStatus: "Playing"
  });
   
  }
  else  if(playingStatus.playingStatus !=null && playingStatus.playingStatus=="Playing"){
      await sound.pauseAsync();
      setplayingStatus({
          playingStatus: "Paused"
      });
        
  }
  else  if(playingStatus.playingStatus !=null && playingStatus.playingStatus=="Paused"){
      await sound.playAsync();
      setplayingStatus({
          playingStatus: "Playing"
      });
     
  }
}
const millisToMinutesAndSeconds = (millis) => {
  var minutes = Math.floor(millis / 60000);
  var seconds = ((millis % 60000) / 1000).toFixed(0);
  return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
}
const deleteAttachment = async (flg) => {
  if (flg == 1) {
     
      setAttachmentPath({ file: "", fileName: "" })
  }
  else {
      
      setDuration({
          TotalDuration: 0,
          PlayingDuration: 0
      })
      setRecording(undefined);
      setAudioPath({ file: "", fileName: "",Dur:0 })
     await sound.stopAndUnloadAsync();
  }
}
const onRecordingStatusUpdate =async(e)=>{
    //console.log("recording update:" + Math.floor((e.durationMillis/1000) % 60))
    setrecordingDuration(Math.floor((e.durationMillis/1000) % 60)+1 + " sec[s]")
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
            var _filteredList = [];
            resonseData.response["Table"].map((myValue, myIndex) => {
              _filteredList.push(myValue.dept);
            });
            setAllDeptList(resonseData.response["Table"])
             setDeptList(_filteredList)
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

  const SavePetition = async () => {
    let deptID = 0;
    
    if(DeptSelected!=null && DeptSelected!=undefined && DeptSelected!="")
    {
    let assembly = AllDeptList.filter(a => a.dept == DeptSelected);  
    if (assembly != null) {
      deptID = assembly[0].id;
    }
  } 
    if (DeptSelected === '' || DeptSelected === undefined
      || DeptSelected === null || deptID === 0) {
      notifyMessage('Please select dept')
    }
    else if (PTitle.value === '' || PTitle.value === undefined
      || PTitle.value === null) {
      notifyMessage('Please enter title')
    }
    else if (PDesc.value === '' || PDesc.value === undefined
      || PDesc.value === null ) {
      notifyMessage('Please enter summary')
    }
    
    else {
      var service = new Services(); 
              var payload = new FormData();

                payload.append('title', PTitle.value);
                payload.append('dept', deptID);  
                payload.append('desc', PDesc.value); 
                 payload.append('UserId', userObject.ID);  
                payload.append('lat', location != undefined && location != null && location.coords != null ? location.coords.latitude : "");
                payload.append('lon', location != undefined && location != null && location.coords != null ? location.coords.longitude : "");
                if (AttachmentPath != null && AttachmentPath != '') {
                    payload.append('imagePath2', {
                        uri: AttachmentPath.file,
                        type: 'image/jpeg',
                        name: "test"
                    });
                }
                if (AudioPath != null && AudioPath != '') {
                    let uriParts = AudioPath.file.split('.');
                    let fileType = uriParts[uriParts.length - 1];
                    payload.append('audiofile', {
                        uri: AudioPath.file,
                        type: 'audio/x-' + fileType,
                        name: "test" ,
                    });

                }

      service.postFormData('/_SavePetitionDetails', payload).then(data => {
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
        <Icon name='chevron-left' size={wp('6%')} color={'black'}></Icon>
        <Text style={{ fontSize: wp('5%'), color: "black" }}>Back</Text>
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
                    <View style={{ width: wp('90%'),alignContent:'center', marginVertical: wp("2%"),    flexDirection: "column" }}>
                    <Text style={styles.labelinput} >Title</Text>
                      <TextInput
                        theme={{ colors: { primary: 'transparent', text: "#00445D" } }}
                        underlineColor="transparent"
                        returnKeyType="next"
                        outlineColor="#fff"
                        placeholder="Title"
                        autoCapitalize='characters' 
                        value={PTitle.value}
                        style={styles.input}
                        selectionColor={'#000'}
                        maxLength={100}
                        onChangeText={(text) => setPTitle({ value: text, error: '' })}
                        error={!!PTitle.error}
                        errorText={PTitle.error}
                      />
                    </View>
                    <View style={{ width: wp('90%'), marginVertical: wp("1%"),  flexDirection: "column" }}>
                    <Text style={styles.labelinput} >Summary</Text>
                      <TextInput
                        theme={{ colors: { primary: 'transparent', text: "#00445D" } }}
                        underlineColor="transparent"
                        returnKeyType="next"
                        outlineColor="#fff"
                        placeholder="Description"
                        autoCapitalize='characters' 
                        value={PDesc.value}
                        style={styles.input}
                        selectionColor={'#000'} 
                        onChangeText={(text) => setPDesc({ value: text, error: '' })}
                        error={!!PDesc.error}
                        errorText={PDesc.error}
                      />
                    </View>
                    <View style={{ width: wp('90%'), marginVertical: wp("1%"),   flexDirection: "column" }}>
                    <Text style={styles.labelinput} >Department</Text>
                    <HashedDropdown dropdownName="Select" style={styles.input}
                                            onSelect={(selectedItem, index) => setDeptSelected(selectedItem)}
                                            dropdownList={DeptList} type="Dept" />
                    </View>

                    <View style={{flexDirection:'column', width: wp('90%'), marginVertical: wp("1%"),marginTop:wp('30%')}}>
                    
                    {AttachmentPath == null || AttachmentPath.fileName == '' &&
                    <TouchableOpacity style={{width:'50%',backgroundColor:'#faab3b'}} onPress={() => { pickImage() }} >
                  <Button
                    style={styles.button_submit}
                    name="Submit"
                  >
                    <Icon name='upload' size={wp('6%')} color={'#fff'}></Icon>  Upload Photos
                  </Button>
                  </TouchableOpacity>
                  }
                  
{AudioPath == null || AudioPath.fileName == '' &&
                  <TouchableOpacity style={{width:'50%'}}
                                                    onPress={recording ? stopRecording : startRecording}
                                                >
                                                    <View style={styles.audiobtn}>
                                                        <Image source={ImageAssets.audio} style={styles.audio_icon} />
                                                        <Text style={styles.audioText}>
                                                           {recording ? 'STOP RECORDING' : 'RECORD AUDIO'} </Text>
                                                    </View>
                                                </TouchableOpacity>
}
                                                {recording &&
                                            <View style={styles.waveImage}>
                                               <Text style={styles.waveImage_duration}>{recordingDuration}</Text> 
                                                <Image source={ImageAssets.waveImage} style={styles.waveImage_icon} />
                                            </View>
                                        }
                                         {AttachmentPath != null && AttachmentPath.fileName != '' &&
                                        <>
                                            <View style={styles.grid_title}>
                                                <Text style={styles.grid_title_text}>Attachment</Text></View>
                                            <View style={styles.grid_2}>
                                                <Image source={ImageAssets.attachment} style={styles.attach_file_icon} />
                                                <Text style={styles.attach_file} ellipsizeMode='tail' numberOfLines={1} >
                                                    {AttachmentPath != null && AttachmentPath.fileName != null ? AttachmentPath.fileName : ""}

                                                </Text>
                                                <TouchableOpacity style={styles.attach_file_icon} onPress={() => { deleteAttachment(1) }}>
                                                    <Image source={ImageAssets.delete} style={styles.delete_icon} />
                                                </TouchableOpacity>
                                            </View></>
                                    }
                                    {AudioPath != null && AudioPath.fileName != '' &&
                                        <>
                                            <View style={styles.grid_title}>
                                                <Text style={styles.grid_title_text}>Audio</Text></View>
                                            <View style={styles.grid_2}>
                                                <TouchableOpacity onPress={() => { playSound() }}>
                                                    {playingStatus.playingStatus==null || playingStatus.playingStatus=="" || playingStatus.playingStatus=="Paused"  || 
                                                   Duration.TotalDuration==Duration.PlayingDuration ?
                                                    <Image source={ImageAssets.play_icon} style={styles.attach_audio_icon} />
                                                    : playingStatus.playingStatus!=null && playingStatus.playingStatus=="Playing"  &&  Duration.TotalDuration!=Duration.PlayingDuration?
                                                    <Image source={ImageAssets.pause_icon} style={styles.attach_audio_icon} /> : <></>
                                                     }
                                                      
                                                </TouchableOpacity>

                                                <Text style={styles.attach_audio_file} ellipsizeMode='tail' numberOfLines={1}  >

                                                    {AudioPath != null && AudioPath.fileName != null ? "Audio file : " + AudioPath.Dur : ""}

                                                </Text>
                                                {Duration.TotalDuration != '' && Duration.TotalDuration != 0 &&
                                                    <Text style={styles.attach_audio_duration}>{Duration.TotalDuration + " : " + Duration.PlayingDuration}</Text>
                                                }
                                                <TouchableOpacity style={styles.attach_file_icon} onPress={() => { deleteAttachment(0) }}>
                                                    <Image source={ImageAssets.delete} style={styles.delete_icon} />
                                                </TouchableOpacity>
                                            </View></>
                                    }
                   <TouchableOpacity style={{width:'100%' ,alignItems:'center' }}
                   onPress={() => { SavePetition() }} 
                                                >
                                                    <View style={styles.submit_button}> 
                                                       <Text style={styles.audioText}>
                                                       <Icon name='floppy' size={wp('8%')} color={'#fff'}></Icon>    Submit </Text>
                                                    </View>
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
  audiobtn: {
    width: 160,
    height: 48,
    marginTop: 20,
    paddingRight: 10,
    backgroundColor: '#2fc75c', 
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    display: 'flex',
},
submit_button: {
  width: 160,
  height: 48,
  marginTop: 20,
  paddingRight: 10,
  backgroundColor: COLORS.blue, 
  alignContent: 'center',
  alignItems: 'center',
  justifyContent: 'center',
  flexDirection: 'row',
  display: 'flex',
},
waveImage_icon: {
  height: 45,
  width: 80,
  ...Platform.select({

      android: {
          height: 25,
      },
  })
},
waveImage_duration : {
  position:'absolute',
  color:"#fff",
  zIndex:999,
  top:1,
  fontSize:8
},
waveImage: {
  width: 120,
  height: 60,
  marginTop: 20,
  backgroundColor: '#d95554',
  borderRadius: 50,
  alignContent: 'center',
  alignItems: 'center',
  justifyContent: 'center',
  flexDirection: 'row',
  display: 'flex',  
  ...Platform.select({

      android: {
          height: 50,
      },
  })
},
audioText: {
  color: '#fff',
  fontSize: 14,
  fontWeight: 'bold'
},
audio_icon: {
    width: 32,
    height: 32,
    marginRight: 10,
},
grid_2: { 
  flexDirection: 'row',  
  backgroundColor: '#fff', 
  alignItems: 'center',
  borderRadius: 30,
  justifyContent: 'space-between',
},
grid_title: {
  display: 'flex',  
  borderRadius: 50,
  margin: 'auto',
},
grid_title_text: {
  color: '#d95554',
  fontSize: 18,
  borderRadius: 50,
  fontWeight: 'bold',
  textAlign: 'center',
  paddingVertical: 15,
},
attach_audio_icon: {
  width: 32,
  height: 32,
},
attach_file: {
  fontSize: 12,
  fontWeight: 'bold',
  left: 5,
  color: "#d95554",
  zIndex: 999,
  margin: 10
},
attach_audio_file: {
  fontSize: 12,
  fontWeight: 'bold',
  left: 5,
  color: "#d95554",
  zIndex: 999,
  margin: 10,

},
attach_audio_duration: {
  fontSize: 10,
  fontWeight: 'bold',
  left: 5,
  color: "blue",
  zIndex: 999,
  margin: 10,

},
delete_icon: {
  width: 32,
  height: 32,
  right: 10
},
attach_file_icon: {
  width: 32,
  height: 32,
  left: 10
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
