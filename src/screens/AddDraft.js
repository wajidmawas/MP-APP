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
import * as DocumentPicker from "expo-document-picker";
const AddDraft = (props) => {
  const [MemberName, setMemberName] = useState({ value: '', error: '' })
  const [PTitle, setPTitle] = useState({ value: '', error: '' })
  const [PDesc, setPDesc] = useState({ value: '', error: '' })
  const [UserList, setUserList] = React.useState("")
  const [AllUserList, setAllUserList] = React.useState("")
  const [selectedUser, setselectedUser] = React.useState("")
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
  const [AttachmentList, setAttachmentList] = useState(null);
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
     setAttachmentList([])
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
    try{  
    // let result = await ImagePicker.launchImageLibraryAsync({
      let result = await DocumentPicker.getDocumentAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        aspect: [4, 3],
        allowsMultipleSelection: true,
        quality: 1,
    });

 
    if (!result.canceled) {
      var files=[];
      files.push({ file: result.uri, fileName: result.uri.split("/").slice(-1)[0],Dur:0 })
      //setAttachmentList(files); 
      setAttachmentList([...files, ...AttachmentList])
        // let image = await ImageManipulator.manipulateAsync(result.uri,[{resize:{width:1080,height:720}}],{compress: 0})
        let fileInfo = await FileSystem.getInfoAsync(result.uri);
        setAttachmentPath({ file: result.uri, fileName: result.uri.split("/").slice(-1)[0],Dur:0 })
        console.log(AttachmentList);
    } 
    }
    catch (error) {
      console.log(error);
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
     setAttachmentList([]);
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
    try {
    const value = await AsyncStorage.getItem("userSession");
    if (value) {
        const obj = JSON.parse(value);        
        setUserObject(obj); // Update state
        var service = new Services();
        const body = {
          TypeId: 1,
          UserId: obj.ID,
          FilterId: obj.stateid,
          FilterText: ''
        }; 
        console.log("Body" + JSON.stringify(body));
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
            setAllUserList(resonseData.response["Table1"])
             setDeptList(_filteredList)
             _filteredList = [];
             resonseData.response["Table1"].map((myValue, myIndex) => {
               _filteredList.push(myValue.Name);
             });  
             setUserList(_filteredList);  
          }
        });
      }
    }
   catch (error) {
    console.error("Error in AddDrafts:", error);
}

  }

  const SavePetition = async () => {
    let deptID = 0;
    let userID = 0;
     
   if (PTitle.value === '' || PTitle.value === undefined
      || PTitle.value === null) {
      notifyMessage('Please enter title')
    }
    else if (PDesc.value === '' || PDesc.value === undefined
      || PDesc.value === null ) {
      notifyMessage('Please enter summary')
    } 
    // else if (AttachmentPath === null || AttachmentPath === '' || AttachmentPath.file === ''){
    //   notifyMessage('Please upload attachment')
    // }   
    else {
      var service = new Services(); 
              var payload = new FormData(); 
                payload.append('title', PTitle.value);
                payload.append('dept', 0);  
                payload.append('desc', PDesc.value); 
                 payload.append('UserId', userObject.ID);  
                 payload.append('AssignUser', 0);  
                payload.append('lat', location != undefined && location != null && location.coords != null ? location.coords.latitude : "");
                payload.append('lon', location != undefined && location != null && location.coords != null ? location.coords.longitude : "");
                if (AttachmentPath != null && AttachmentPath != '' && AttachmentPath.file != '') {
                  let uriParts = AttachmentPath.file.split('.');
                    let fileType = uriParts[uriParts.length - 1];
                    payload.append('imagePath2', {
                        uri: AttachmentPath.file,
                        type: 'image/x-'+fileType,
                        name: "test"
                    });
                }
                if (AudioPath != null && AudioPath != '' && AudioPath.file != '') {
                    let uriParts = AudioPath.file.split('.');
                    let fileType = uriParts[uriParts.length - 1];
                    payload.append('audiofile', {
                        uri: AudioPath.file,
                        type: 'audio/x-' + fileType,
                        name: "test" ,
                    });

                } 
               
      service.postFormData('/_SavePetitionDetails_Draft', payload).then(data => {
        console.log("Response" + JSON.stringify(data));
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
          notifyMessage("Successfully submitted"); 
          setPTitle('');
                    setPDesc('');
         UploadMediaToServer(resonseData.response["Table"][0]["id"]) 
        }
      });


    }
  }
  const UploadMediaToServer = (Pid) => {


    var service = new Services();
    
    if (AttachmentList != null && AttachmentList.length > 0) {
      AttachmentList.map((myValue, myIndex) => {
            var payload = new FormData(); 
            if (myValue.file != null && myValue.file != '') {
              let uriParts = myValue.file.split('.');
              let fileType = uriParts[uriParts.length - 1];
              payload.append('id',Pid);
                payload.append('imagePath2', {
                    uri: myValue.file,
                    type: 'image/x-'+ fileType,
                    name: "test" + myIndex
                });
            } 
            service.postFormData('/upload_attachments', payload).then(data => {
              setVal(false)
              if (data == null || data == "") {
                openSnackBar("Invalid request object");
                return false;
              }
              var resonseData = JSON.parse(data) 
              console.log(resonseData);
              if (resonseData.errorCode == -200) {
                notifyMessage(resonseData.message);
              }
              else if (resonseData.errorCode == 200) {
                notifyMessage('File uploaded ' + (myIndex+1) + " of " + AttachmentList.length);
                if(myIndex+1==AttachmentList.length)
                  {
                    props.navigation.replace('DrawerStack', { screen: 'AddDraft' })
                    
                  }
               
                }
            });
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
        <StatusBar translucent barStyle="light-content" />
      </View>
      <View style={{ width: wp("100%"), height: hp('10%'), paddingHorizontal: wp("2%"), flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
        {/* <TouchableOpacity onPress={back} style={{ flexDirection: "row", alignItems: "center" }}>
        <Icon name='chevron-left' size={wp('6%')} color={'#000'}></Icon>
        <Text style={{ fontSize: wp('5%'), color: "#000" }}>Back</Text>
        </TouchableOpacity> */}
        <TouchableOpacity onPress={() => { props.navigation.openDrawer() }}   >
        <Icon onPress={() => { props.navigation.openDrawer() }} name="dots-horizontal" color={'#000'} size={wp('7%')}></Icon>

        </TouchableOpacity>
      </View>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <> 
            <View style={styles.container}>

                <View style={styles.play_div}>
                <KeyboardAwareScrollView style={{width:'100%'}}>
                
                  <> 
                    <View style={{ width: ('100%'),alignContent:'center',flexDirection: "column" }}>
                    
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
                 
                    <View style={{ width: ('100%'), marginVertical: wp("1%"),  flexDirection: "column" }}>
                   
                      <TextInput
                        theme={{ colors: { primary: 'transparent', text: "#00445D" } }}
                        underlineColor="transparent"
                        returnKeyType="next"
                        outlineColor="#fff"
                        multiline={true}
                        numberOfLines={4}
                        placeholder="Description" 
                        value={PDesc.value}
                        style={[styles.input,{height:100,textAlignVertical:'top'}]} 
                        selectionColor={'#000'}  
                        onChangeText={(text) => setPDesc({ value: text, error: '' })}
                        error={!!PDesc.error}
                        errorText={PDesc.error}
                      />
                    </View>
                    

                     
                    <TouchableOpacity style={[styles.button_submit,{backgroundColor:'#5592d9',width:'100%'}]}
                   onPress={() => { SavePetition() }} 
                                                >  
                                                <Icon name='floppy' size={wp('6%')} color={'#fff'}></Icon>
                                                       <Text style={styles.button_submit_txt}>
                                                           SUBMIT </Text>
                                                     
                                                </TouchableOpacity>
                    
                    {AttachmentPath == null || AttachmentPath.fileName == '' &&
                   <View style={{flexDirection:'column', width: ('100%'),alignItems:'center', marginVertical: wp("1%")}}>
                     <TouchableOpacity style={[styles.button_submit,{backgroundColor:'#faab3b'}]} onPress={() => { pickImage() }} >
                   
                    <Icon name='upload' size={wp('6%')} color={'#fff'}></Icon>  
                    <Text style={styles.button_submit_txt}>UPLOAD ATTACHMENT</Text>
                  
                  </TouchableOpacity></View>
                  } 
                  
{AudioPath == null || AudioPath.fileName == '' &&
  <View style={{flexDirection:'column', width: ('100%'),alignItems:'center', marginVertical: wp("1%")}}>
                  <TouchableOpacity style={[styles.button_submit,{backgroundColor:'#2fc75c'}]}
                                                    onPress={recording ? stopRecording : startRecording}
                                                >
                                                    <View style={styles.audiobtn}>
                                                        <Icon name='google-podcast' size={wp('6%')} color={'#fff'}></Icon>  
                                                        <Text style={styles.button_submit_txt}>
                                                           {recording ? 'STOP RECORDING' : 'RECORD AUDIO'} </Text>
                                                    </View>
                                                </TouchableOpacity>
                                                </View>
}
                                                {recording &&
                                            <View style={styles.waveImage}>
                                               <Text style={styles.waveImage_duration}>{recordingDuration}</Text> 
                                                <Image source={ImageAssets.waveImage} style={styles.waveImage_icon} />
                                            </View>
                                        }
                                         {AttachmentPath != null && AttachmentPath.fileName != '' &&
                                        <View style={{paddingBottom:20}}>
                                            <View style={[styles.grid_title,{flexDirection:'row',alignItems:'center',justifyContent:'space-between'}]}>
                                              
                                               <Text style={[styles.grid_title_text,{textAlign:'left'}]}>Attachment </Text>
                                                  <View style={{flexDirection:'row',alignItems:'center'}}>
                                                <TouchableOpacity onPress={() => { deleteAttachment(1) }}>
                                                <Icon name='delete-circle' size={wp('6%')} color={'#d95554'}></Icon>
                                                </TouchableOpacity>
                                                <TouchableOpacity style={[{marginLeft:10,flexDirection:'row',alignItems:'center'}]} onPress={() => { pickImage() }}>
                                                <Icon name='plus' size={wp('6%')} color={'#5592d9'}></Icon>
                                                <Text style={{color:'#5592d9',fontSize:wp('3%')}}>Add</Text>
                                                </TouchableOpacity>
                                                </View>
                                                </View> 
                                                {AttachmentList != null && AttachmentList.map((item, index) => (
                                            <View style={styles.grid_2} key={index}>
                                            <Icon name='attachment' size={wp('6%')} color={'#ff7900'}></Icon>
                                                <Text style={styles.attach_file} ellipsizeMode='tail' numberOfLines={1} >
                                                    {item != null && item.fileName != null ? item.fileName : ""}

                                                </Text>
                                                
                                            </View>
                                                ))}
                                            </View>
                                    }
                                    {AudioPath != null && AudioPath.fileName != '' &&
                                        <View style={{paddingBottom:20}}>
                                            <View style={styles.grid_title}>
                                                <Text style={styles.grid_title_text}>Audio</Text></View>
                                            <View style={styles.grid_2}>
                                                <TouchableOpacity onPress={() => { playSound() }}>
                                                    {playingStatus.playingStatus==null || playingStatus.playingStatus=="" || playingStatus.playingStatus=="Paused"  || 
                                                   Duration.TotalDuration==Duration.PlayingDuration ?
                                                    <Icon name='play-circle' size={wp('6%')} color={'#ff7900'}></Icon>
                                                    : playingStatus.playingStatus!=null && playingStatus.playingStatus=="Playing"  &&  Duration.TotalDuration!=Duration.PlayingDuration?
                                                    <Icon name='pause-circle' size={wp('6%')} color={'#ff7900'}></Icon>: <></>
                                                     }
                                                      
                                                </TouchableOpacity>

                                                <Text style={styles.attach_audio_file} ellipsizeMode='tail' numberOfLines={1}  >

                                                    {AudioPath != null && AudioPath.fileName != null ? "Audio file : " + AudioPath.Dur : ""}

                                                </Text>
                                                {Duration.TotalDuration != '' && Duration.TotalDuration != 0 &&
                                                    <Text style={styles.attach_audio_duration}>{Duration.TotalDuration + " : " + Duration.PlayingDuration}</Text>
                                                }
                                                <TouchableOpacity style={styles.attach_file_icon} onPress={() => { deleteAttachment(0) }}>
                                                <Icon name='delete-circle' size={wp('6%')} color={'#d95554'}></Icon>
                                                </TouchableOpacity>
                                            </View></View>
                                    }
                  
                  
                   
                  </>

                  </KeyboardAwareScrollView>
                </View>

             
             
                
            </View></>
            </TouchableWithoutFeedback>
        </>
        
        <View style={styles.login_bg}>
                <Image style={{ width: '100%', resizeMode: 'cover', height: ('100%') }} source={require('../assets/main_bg.png')} />
            </View>
    </Container>
  )

}
export default AddDraft

const styles = StyleSheet.create({
  play_div: {
    width: ('100%'),
    flexDirection: 'column', 
    backgroundColor: "#fff", 
    alignItems:'center', 
    borderRadius: 10,
    paddingTop:20,
    paddingHorizontal:wp('2%'),
    height:hp('88%'),
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
    paddingHorizontal:wp('2%'), 
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
    width: '100%', 
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
  height: 25,
  width: 50,
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
  marginBottom:20,
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
  width: wp('90%'),
  height: hp('7%'), 
  borderRadius: 10,
  marginBottom:hp('1%'),
  flexDirection:'row',
  alignItems:'center',
  justifyContent:'center',
  backgroundColor:'#5592d9',
},
button_submit_txt:{
  fontSize:wp('4%'),
  color:"#fff",
  marginLeft:5
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
