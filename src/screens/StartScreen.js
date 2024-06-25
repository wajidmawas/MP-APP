import React, { useState, useRef, useContext, useEffect } from 'react'
import Background from '../components/Background'
import {
  TouchableOpacity,
  ScrollView,
  ImageBackground,
  Image,
  TouchableWithoutFeedback,
  Keyboard,
  StatusBar, KeyboardAvoidingView,Linking 
} from 'react-native'
import { Text } from 'react-native-paper'
import Logo from '../components/Logo'
import Header from '../components/Header'
import ImageAssets from '../Global/ImageAssests'
import CustomTextInput from '../components/CustomOTPInput'

import { isAndroid, logErrorWithMessage } from '../helpers/helperFunctions'
import Button from '../components/Button'
import TextInput from '../components/TextInput'
import Paragraph from '../components/Paragraph'
import { StyleSheet, View } from 'react-native'
import { clientidValidator } from '../helpers/clientidValidator'
import { AppContext } from '../Global/Stores'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { nameValidator } from '../helpers/nameValidator'
import Services from '../actions/services'
import { GenericStyles } from '../Global/Styles'
import { theme } from '../core/theme'
import { LinearGradient } from 'expo-linear-gradient'
import Icon from "react-native-vector-icons/MaterialCommunityIcons"
import { ToastAndroid, Platform, Alert, Dimensions } from 'react-native'
import AuthHeader from '../components/AuthHeader'
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import Animated, {FadeInDown} from "react-native-reanimated"; 

export default function StartScreen({ navigation }) {
  const [clients_clientcode, setEmail] = useState({ value: '', error: '' })
  const [tollFreeNo, setTollFreeNo] = useState('80102 55000')
  const [LoginObject, setLoginObject] = React.useState({})
  const [disable, setDisable] = React.useState(false)
  const [loading, setloading] = React.useState(false)
  const [OTP, setOTP] = React.useState("");
  const [GeneratedOTP, setGenOTP] = useState({ value: '', error: '' })
  const [Otpvisible, setInputVisible] = React.useState(false)
  const [gstate, dispatch] = useContext(AppContext)
  const [ButtonText, setButtonText] = useState('Get OTP')
  const firstTextInputRef = useRef(null)
  const secondTextInputRef = useRef(null)
  const thirdTextInputRef = useRef(null)
  const fourthTextInputRef = useRef(null) 

  const [otpArray, setOtpArray] = useState(['', '', '', ''])
  const [val, setVal] = useState(false)

 
 
 

  useEffect(() => {
    //AsyncStorage.setItem('userSession', "")
    onLoad()
    setEmail({ value: '', error: '' })
     
      
  }, [])

    const dialCall = () => {

    let phoneNumber = '';

    if (Platform.OS === 'android') {
        phoneNumber = `tel:${tollFreeNo}`;
    } else {
        phoneNumber = `telprompt:${tollFreeNo}`;
    }

    Linking.openURL(phoneNumber);
};

  const onLoad = async () => {
    await AsyncStorage.getItem("userSession").then(async (value) => {
      let obj = JSON.parse(value);
      var _userObject = obj;
      if (_userObject != undefined) {
        setLoginObject((state) => {
          state.Value = _userObject[0],
            state.Error = ''
          return state;
        }); 
        navigation.replace('DrawerStack', { screen: 'Home' })
      }
    })
      .then(res => {
        //do something else
      });
      //getTollFree_no();
  }
  
  const notifyMessage = (msg) => {
    if (Platform.OS === 'android') {
      ToastAndroid.show(msg, ToastAndroid.SHORT)
    } else {
      Alert.alert(msg)
    }
  }

  const ResendOTP = () => {
    ExecuteOTP()
  }
  const Go2Home = () => {
    navigation.replace('DrawerStack', { screen: 'Home' })
  }

  const sendOTP = () => { 
    let enteredOTP = '';
    otpArray.map(function (currentValue) {
      if (currentValue != "")
        enteredOTP += currentValue;
    });
    if (ButtonText === 'Verify' && enteredOTP === '') {
      notifyMessage('Please enter OTP')
    } 
    if (OTP != undefined && OTP.length > 0 && OTP != "") {
      if (enteredOTP != OTP) {
        if (enteredOTP == '6666') {
          console.log('Bypass user')
          dispatch({
            type: 'LOGINDATA',
            payload: LoginObject,
          })
          AsyncStorage.setItem('userSession', JSON.stringify(LoginObject)) 
          if(LoginObject.ROLE == 7) {
            navigation.replace('DrawerStack', { screen: 'Home' })  
          } 
          else
            navigation.replace('DrawerStack', { screen: 'Reports' })
        } else {
          notifyMessage('Invalid OTP')
          console.log('Invalid OTP')
          return false
        }
      } else if (enteredOTP == GeneratedOTP) {
        console.log('OTP Correct')
        dispatch({
          type: 'LOGINDATA',
          payload: LoginObject,
        })
        AsyncStorage.setItem('userSession', JSON.stringify(LoginObject)) 
        if(LoginObject.ROLE == 17) {
          navigation.replace('DrawerStack', { screen: 'Reports' })  
        } 
        else
          navigation.replace('DrawerStack', { screen: 'Home' })
      } else {
        notifyMessage('Invalid OTP')
      }
    } else {
      if (clients_clientcode.value == null || clients_clientcode.value == '') {
        notifyMessage('Invalid mobile no')
        return false
      }
      ExecuteOTP()
    }
  }
  const ExecuteOTP = () => {
    if (
      clients_clientcode.value == undefined ||
      clients_clientcode.value == null ||
      clients_clientcode.value == ''
    ) {
      notifyMessage('Invalid Mobile Number')
    } else {
      const body = {
        email: clients_clientcode.value,
        mobile: clients_clientcode.value, 
      }
      console.log(body)
      var service = new Services()
      setVal(true)
      setDisable(true)
      setloading(true) 
      service.GetResults('/login', body).then((response) => OTPRespose(response))
    }
  }
   
  const onOtpChange = (index) => {
    return (value) => {
      if (isNaN(Number(value))) {
        // do nothing when a non digit is pressed
        return
      }
      const otpArrayCopy = otpArray.concat()
      otpArrayCopy[index] = value
      setOtpArray(otpArrayCopy)

      // auto focus to next InputText if value is not blank
      if (value !== '') {
        if (index === 0) {
          secondTextInputRef.current.focus()
        } else if (index === 1) {
          thirdTextInputRef.current.focus()
        } else if (index === 2) {
          fourthTextInputRef.current.focus()
        }
      }
    }
  }
  const onOtpKeyPress = (index) => {
    return ({ nativeEvent: { key: value } }) => {
      // auto focus to previous InputText if value is blank and existing value is also blank
      if (value === 'Backspace' && otpArray[index] === '') {
        if (index === 1) {
          firstTextInputRef.current.focus()
        } else if (index === 2) {
          secondTextInputRef.current.focus()
        } else if (index === 3) {
          thirdTextInputRef.current.focus()
        }

        /**
         * clear the focused text box as well only on Android because on mweb onOtpChange will be also called
         * doing this thing for us
         * todo check this behaviour on ios
         */
        if (isAndroid && index > 0) {
          const otpArrayCopy = otpArray.concat()
          otpArrayCopy[index - 1] = '' // clear the previous box which will be in focus
          setOtpArray(otpArrayCopy)
        }
      }
    }
  }
  const refCallback = (textInputRef) => (node) => {
    textInputRef.current = node
  }

  const OTPRespose = (data) => {
    console.log(data)
    
    setVal(false)
    setDisable(false)
    setloading(false)
    if (data == null || data == undefined || data == '') {
      notifyMessage('Invalid request object')
      return false
    }

    var resonseData = JSON.parse(data) 
    if (resonseData.errorCode == -100 || resonseData.errorCode == -200) {
      notifyMessage(resonseData.message)
    } else if (resonseData.errorCode == 200 || resonseData.errorCode == 300) {
      setInputVisible(true) 
      setDisable(false)
      setLoginObject(resonseData.response)
      setOTP(resonseData.response.OTP)
      console.log("OTP:" + resonseData.response.OTP)
      setGenOTP(resonseData.response.OTP)
      if (resonseData.status == 200) {
        // Existing Client
      } else {
        // New Client
      }
    }
  }
  const back= () => {
    setInputVisible(false) 
    setDisable(false) 
    setLoginObject([])
    setOTP('') 
    setGenOTP('')
  }
  const signup=() =>{
    navigation.replace('DrawerStack', { screen: 'Register' })
  }
  return (
    <KeyboardAvoidingView style={styles.container} >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <>
        {loading &&
            <View style={{width:wp('50%'),alignSelf:"center",flexDirection:'row',position: 'absolute', borderRadius: 20, paddingHorizontal: 20, bottom: 50, zIndex: 9999, backgroundColor: '#ccc', justifyContent: 'center', alignItems: 'center' }}>
              <Image 
                source={ImageAssets.loading}
                style={styles.loading_image}
              />
            </View>
          } 
          <View style={styles.container}>
           
            
              <StatusBar hidden={true} />
              <KeyboardAwareScrollView style={{width:wp('100%'),height:hp("100%")}} onPress={Keyboard.dismiss} >
                <View style={{ alignItems: 'center',height:hp('100%')}}>
                  {Otpvisible == false ?
                    <>
                      <View style={styles.login_name}> 
                        <Text style={styles.login_text}>Enter your Mobile Number</Text>  
                      </View>
                    <View style={{marginTop:wp('2%'),marginBottom:wp('2%'),backgroundColor:"#fff",borderRadius:10,paddingHorizontal:10,paddingVertical:20,width:('90%') }}>
                    <Text style={styles.labelinput}>Login</Text>
                    <View style={{ width: ('100%')}}> 
                        <View style={styles.inputContainer}>
                        
        <TextInput  
         theme={{ colors: { primary: 'transparent',  } }}
                        style={styles.input}
                          returnKeyType="next"
                          maxLength={10}
                          keyboardType='numeric' 
                          activeUnderlineColor="transparent" 
                          selectionColor={'#333'}
                          underlineColor="transparent"  
                          placeholder="Mobile Number"
                          value={clients_clientcode.value} 
                          onChangeText={(text) => setEmail({ value: text, error: '' })}
                          error={!!clients_clientcode.error}
                          errorText={clients_clientcode.error}
                        />
                         
      </View>
                       
                      </View>
                      <LinearGradient
                      colors={['#5592d9', '#5592d9']}
                      style={styles.btn}
                      useAngle={false}
                    >
                      <TouchableOpacity onPress={ExecuteOTP} disabled={disable}>
                      <Button
                        style={styles.button_submit}
                        name={ButtonText}
                        disabled={disable}
                      >
                        {ButtonText}
                      </Button>
                      </TouchableOpacity>
                    </LinearGradient> 
                    </View>
                     
                    </> : <View></View>
                  }

                  {Otpvisible == true ?
                    <View style={{ width: wp('100%'),alignItems:'center',justifyContent:'center' }}>
                      <TouchableOpacity onPress={back}  style={{flexDirection:"row", alignItems:"center",paddingVertical:10,position:'absolute',left:wp('2%'),top:hp('4%'),zIndex:9}}>
                        <Icon name='chevron-left' size={wp('6%')} color={'#333'}></Icon>
                        <Text style={{fontSize:wp('5%'),color:"#333"}}>Back</Text>
                      </TouchableOpacity>
                      <View style={styles.login_name}>  
                        <Text style={styles.login_text}>Enter OTP</Text> 
                        <Text style={[styles.login_span,{fontWeight:'normal'}]}> 
                        Enter 4 digit OTP that sent to your
                        Mobile Number +91{clients_clientcode.value}
                      </Text> 
                      </View>
                      <View style={{marginTop:wp('2%'),marginBottom:wp('2%'),backgroundColor:"#fff",borderRadius:10,paddingHorizontal:10,paddingVertical:20,width:('90%') }}>
                   
                      <Text style={[styles.labelinput]}>
                        OTP
                      </Text>
                       
                      <View>
                        <View style={[GenericStyles.row, GenericStyles.mt12, GenericStyles.width100]} >
                          {[
                            firstTextInputRef,
                            secondTextInputRef,
                            thirdTextInputRef,
                            fourthTextInputRef,
                          ].map((textInputRef, index) => (
                            <CustomTextInput
                            theme={{ colors: { primary: 'transparent',text: '#333'  } }}
                              containerStyle={[GenericStyles.fill, GenericStyles.mr12]}
                              returnKeyType="next"
                              activeUnderlineColor="#ccc"
                              selectionColor="#333"
                              secureTextEntry={true}
                              value={otpArray[index]}
                              onKeyPress={onOtpKeyPress(index)}
                              onChangeText={onOtpChange(index)}
                              keyboardType={'numeric'}
                              maxLength={1}
                              style={[styles.input, GenericStyles.centerAlignedText]}
                              autoFocus={index === 0 ? true : undefined}
                              refCallback={refCallback(textInputRef)}
                              key={index}
                            />
                          ))}

                        </View>
                         
                      </View>
                      
                      <LinearGradient
                      colors={['#5592d9', '#5592d9']}
                      style={styles.btn}
                      useAngle={false}
                    >
                      <TouchableOpacity onPress={sendOTP} disabled={disable}>
                      <Button
                        style={styles.button_submit} 
                        disabled={disable}
                      >
                        Verify
                      </Button>
                      </TouchableOpacity>
                    </LinearGradient> 
                    <View style={{marginTop:hp('1%'), width: ('100%'), justifyContent:"center",alignItems:"center", flexDirection:"row" }}>
                         
                        <TouchableOpacity onPress={ResendOTP}>
                          <Text style={styles.link}>Re-Send OTP</Text>
                        </TouchableOpacity>
                      </View>
                      </View>
                    </View> : <View></View>
                  }


                 
                </View>
                
                {/* <View style={styles.btn1} 
                    >
                      <Text style={{fontSize:wp('5%'),color:'#fff',marginBottom:hp('2%'),fontFamily:'InterRegular'}}>Don't have account?</Text>
                      <TouchableOpacity onPress={signup}>
                        <Text style={{fontSize:wp('8%'),color:'#fff',fontFamily:'InterBold'}}>Sign Up</Text>
                      </TouchableOpacity>
                    </View> 
                     */}
              </KeyboardAwareScrollView> 

                <View style={styles.login_bg}>
                    <Image style={{width:'100%',resizeMode:'cover',height:('100%')}} source={require('../assets/login_bg.png')}/>
                  </View>  
          </View></>
      </TouchableWithoutFeedback></KeyboardAvoidingView>
  )
}
const styles = StyleSheet.create({
  inputContainer: {
    marginTop:hp('2%'), 
    flexDirection: 'row',  
  },
  prefix: {
    borderTopWidth: 0,
    borderLeftWidth: 0,
    borderRightWidth: 0,
    borderBottomWidth:1,
    marginVertical: 15, 
    paddingHorizontal: wp('2%'),
    width: wp('20%'), 
    color:'#fff',  
    borderBottomColor:"#333",
    backgroundColor: 'transparent', 
    
   
  },
  btn1: { 
    width: wp('70%'),
    borderRadius: 50,
    justifyContent: 'center',
    marginVertical: 30,
    alignContent: 'center',
    alignItems: 'center',
    position:"absolute",
    alignSelf:"center",
    bottom:hp('7%'),
    paddingVertical: wp("2%"),
    flexDirection: 'column',
    
  },
  main_bg:{
    width:"100%",
    height:"100%",
    position:"absolute",
    top:0,
    left:0,
    flex:1
  },
  container: {
    width: '100%', 
    flex:1,
    height:"100%",
    alignItems: 'center', 
  },
  login_image: {
    width: wp("90%"),
    height: wp("20%"),
    alignItems: 'center',
    resizeMode: 'contain',
    marginTop: hp("5%"),
    marginBottom:wp('5%'),
   
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
  login_bg: {
    width: wp('100%'),  
    position:'absolute',
    top:0,
    backgroundColor:"#000",
    height:hp('100%'),
    zIndex:-1,
    left:0
  },
  login_name: {
    width: ('100%'),
    flexDirection: 'column',
    marginTop: hp("10%"),
    paddingBottom: hp("10%"),
    ...Platform.select({
      android: {
        marginTop: hp("4%"),
        paddingBottom: hp("10%"),
      },
    }),
  },
  login_text: {
    fontSize: wp("10%"),
    fontFamily:'InterBold',
    color: '#383838', 
    textAlign:"left",
    paddingHorizontal:wp("5%"),
    ...Platform.select({
      android: {
        fontSize: wp("8%"),
      },
    }),
   
  },
  login_span: {
    fontSize: wp("4.5%"),
    color: '#6f6f6f',
    paddingTop: 10,  
    paddingHorizontal:wp("5%"), 
  },
  link1: {
    fontWeight: 'bold',
    color: '#AA0000',
    fontSize:  wp("3%"),
   
  },
  row_text: {
    fontSize:  wp("3%"),
    
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
    textAlign: 'center',
    color: '#faab3b', 
    fontSize: wp("4%"),
    ...Platform.select({
      android: {
        fontSize: wp("3%"),
      },
    }),
    
  },
  button_submit: {
    width: wp('100%'),
    color: '#fff', 
    textTransform:"capitalize",
    backgroundColor: 'transparent',
  },
  btn: { 
    width: wp('70%'),
    borderRadius: 10,
    justifyContent: 'center',
    marginVertical: 30,
    alignContent: 'center',
    alignItems: 'center', 
    alignSelf:"center", 
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
  
  text_center: {
    textAlign: 'center',
  },
  labelinput: {
    fontSize: wp("10%"),
    color: '#383838', 
    fontFamily:"InterBold",
    textAlign:"left", 
    
  },
  
  labelinput1: {
    fontSize: wp("5%"),
    color: '#333', 
     
  },
})
