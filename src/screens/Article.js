import React, { useState, useEffect, useContext } from 'react'
import {
  View, Text, Image, Modal, TouchableOpacity, ScrollView, StatusBar, Alert, StyleSheet, TouchableHighlight,
  TouchableWithoutFeedback, Keyboard, KeyboardAvoidingView, Linking
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
  AlertIOS, FlatList
} from 'react-native';
import TextInput from '../components/TextInput'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Location from 'expo-location';
import Services from '../actions/services';
import NetInfo from '@react-native-community/netinfo';
import TextInput1 from '../components/TextInput1'
import Icon from "react-native-vector-icons/MaterialCommunityIcons"
import * as Contacts from "expo-contacts";
const Article = (props) => {
  const [MemberName, setMemberName] = useState({ value: '', error: '' })
  const [MemberMobile, setMemberMobile] = useState({ value: '', error: '' })
  const [MemberVoterId, setMemberVoterId] = useState({ value: '', error: '' })
  const [storeState, dispatch] = useContext(AppContext);
  const [val, setVal] = useState(false);
  const [AssemblyList, setAssemblyList] = useState([])
  const [AllAssemblyList, setAllAssemblyList] = useState([])
  const [userObject, setUserObject] = useState({});
  const { isActive, type, message, openSnackBar, closeSnackBar } = useSnackbar();
  const [ArticlesList, setArticlesList] = useState(null)
  const [SelectedArticle, setSelectedArticle] = useState(null)
  const [userSession, setuserSession] = useState(null);
  const [SendModal, setSendModal] = useState(false);
  const [article, setarticle] = useState(true);
  const [Videos, setVideos] = useState(false);
  const [livestream, setlivestream] = useState(false);
  const [ContactNo, setContactNo] = useState({ value: '' })
  const [ContactName, setContactName] = useState({ value: '' })
  const [ContactVisibile, setContactVisibile] = useState(false);
  const [contacts, setContacts] = useState([]);
  const [Allcontacts, setAllContacts] = useState([]);
  const keyExtractor = (item, idx) => {
    return item?.id?.toString() || idx.toString();
  };
  const Contact = ({ contact }) => {
    return (
      <TouchableOpacity onPress={() => { selectContactItem(contact) }}>
        <View style={styles.contactCon}>

          <View style={styles.imgCon}>
            <View style={styles.placeholder}>
              <Text style={styles.txt}>{contact?.name[0]}</Text>
            </View>
          </View>
          <View style={styles.contactDat}>
            <Text style={styles.name}>{contact?.name}</Text>
            <Text style={styles.phoneNumber}>
              {contact?.phoneNumbers != undefined ?
                contact?.phoneNumbers[0]?.number
                :
                "N/A"
              }

            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };
  const renderItem = ({ item, index }) => {
    return <Contact contact={item} />;
  };
  const selectContactItem = async (item) => {
    setContactVisibile(!ContactVisibile)
    setContactNo({ value: item?.phoneNumbers[0]?.number });
    setContactName({ value: item?.name });
  };
  const filterList = async (_text) => {
    let _fList = Allcontacts.filter(a => a.name != null && a.name.toUpperCase().includes(_text.toUpperCase()));
    if (_text == "" || _text == null || _text == undefined)
      _fList = Allcontacts;
    setContacts(_fList);
  }
  const loadContacts = async () => {
    const { status } = await Contacts.requestPermissionsAsync();
    if (status === "granted") {
      const { data } = await Contacts.getContactsAsync({
        fields: [Contacts.Fields.PhoneNumbers],
      });
      if (data.length > 0) {
        setContacts(data);
        setAllContacts(data);
      }
    }

  }
  const notifyMessage = (msg) => {
    if (Platform.OS === 'android') {
      ToastAndroid.show(msg, ToastAndroid.SHORT)
    } else {
      Alert.alert(msg);
    }
  }

  useEffect(() => {
    onLoad()
    loadContacts();
    //console.log("Home page Ended:");
  }, [])

  const sendManifesto = async () => {
    if (ContactNo.value === '' || ContactNo.value === undefined
      || ContactNo.value === null) {
      notifyMessage('Please select contact no')
      return;
    }
    else if (ContactName.value === '' || ContactName.value === undefined
      || ContactName.value === null) {
      notifyMessage('Please select contact name')
    }
    else {
      setSendModal(false)
      let msg = "Dear " + ContactName.value + " Ji,%0D%0A%0D%0A" + SelectedArticle.long_desc + '%0D%0A%0D%0A' + SelectedArticle.short_desc;
      Linking.openURL('whatsapp://send?text=' + msg + '&phone=' + ContactNo.value)

    }
  }
  const onLoad = async () => {
    await AsyncStorage.getItem("userSession").then(async (value) => {
      let obj = JSON.parse(value);
      var _userObject = obj;
      if (_userObject != undefined) {
        setUserObject(_userObject)
        var service = new Services();
        const body = {
          TypeId: 5,
          UserId: _userObject.ID,
          FilterId: _userObject.stateid,
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
            setArticlesList(resonseData.response["Table"])
          }
        });
      }
    }).then(res => {
      //do something else
    });

  }


  const back = () => {
    props.navigation.replace('DrawerStack', { screen: 'Home' })
  }
  const livestreamtab = () => {
    setlivestream(true)
    setVideos(false)
    setarticle(false)
  }
  const videotab = () => {
    setVideos(true)
    setarticle(false)
    setlivestream(false)
  }
  const articletab = () => {
    setVideos(false)
    setarticle(true)
    setlivestream(false)
  }
  const shareContent = async (item) => {
    setContactNo({ value: "" });
    setContactName({ value: "" });
    setContacts(Allcontacts);
    setSendModal(true);
    setSelectedArticle(item);
  }
  return (
    <Container>


      <View style={styles.StatusBar} >
        <StatusBar translucent barStyle="light-content" />
      </View>
      <View style={{ width: wp("100%"), height: hp('10%'), paddingHorizontal: wp("2%"), flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
        <TouchableOpacity onPress={back} style={{ flexDirection: "row", alignItems: "center" }}>
          <Icon name='chevron-left' size={wp('6%')} color={'#000'}></Icon>
          <Text style={{ fontSize: wp('5%'), color: "#000" }}>Back</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => { props.navigation.openDrawer() }}   >
          <Icon onPress={() => { props.navigation.openDrawer() }} name="dots-horizontal" color={'#7F86B2'} size={wp('7%')}></Icon>

        </TouchableOpacity>
      </View>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <>
          <View style={styles.container}>


            <View style={{ flex: 1 }}>

              <>
                <View style={{ width: "100%", justifyContent: 'space-between', flexDirection: "row", alignItems: "center", backgroundColor: "#ccc" }}>
                  <TouchableOpacity style={styles.tab_btn} onPress={() => { articletab() }}>
                    <Text style={styles.tab_txt}>Articles</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.tab_btn} onPress={() => { videotab() }}>
                    <Text style={styles.tab_txt}>Videos</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.tab_btn} onPress={() => { livestreamtab() }}>
                    <Text style={styles.tab_txt}>Live Streaming</Text>
                  </TouchableOpacity>
                </View>
                <View style={{ flex: 1 }}>
                  {article &&
                    <KeyboardAwareScrollView onPress={Keyboard.dismiss} style={{ width: '100%' }}>
                      <View style={{ flexDirection: "row", flexWrap: "wrap", width: "100%", paddingVertical: hp('4%'), paddingHorizontal: hp('2%'), justifyContent: 'space-between', alignItems: 'center' }}>
                        {ArticlesList != null && ArticlesList.filter(a => a.article_type == 1).map((item, index) => (
                          <TouchableOpacity style={styles.main_div} onPress={() => shareContent(item)}>
                            <Image source={{ uri: item.thumbnail_img }} style={styles.main_img} />
                            <Text style={styles.main_txt}>{item.title}</Text>
                            <Text style={styles.main_txt_dt}>{item.published_date.split('T')[0]}</Text>
                            <Icon name='share' size={wp('6%')} color={'#000'}></Icon>


                          </TouchableOpacity>
                        ))
                        }
                      </View>
                    </KeyboardAwareScrollView>
                  }
                  {Videos &&
                    <KeyboardAwareScrollView onPress={Keyboard.dismiss} style={{ width: '100%' }}>
                      <View style={{ flexDirection: "row", flexWrap: "wrap", width: "100%", paddingVertical: hp('4%'), paddingHorizontal: hp('2%'), justifyContent: 'space-between', alignItems: 'center' }}>
                        {ArticlesList != null && ArticlesList.filter(a => a.article_type == 2).map((item, index) => (
                          <TouchableOpacity style={styles.main_div} onPress={() => shareContent(item)}>
                            <Image source={{ uri: item.thumbnail_img }} style={styles.main_img} />
                            <Text style={styles.main_txt}>{item.title}</Text>                            
                            <Text style={styles.main_txt_dt}>{item.published_date.split('T')[0]}</Text>
                            <Icon name='share' size={wp('6%')} color={'#000'}></Icon>


                          </TouchableOpacity>
                        ))
                        }

                      </View>
                    </KeyboardAwareScrollView>
                  }
                  {livestream &&
                    <KeyboardAwareScrollView onPress={Keyboard.dismiss} style={{ width: '100%' }}>
                      <View style={{ flexDirection: "row", flexWrap: "wrap", width: "100%", paddingVertical: hp('4%'), paddingHorizontal: hp('2%'), justifyContent: 'space-between', alignItems: 'center' }}>

                        {ArticlesList != null && ArticlesList.filter(a => a.article_type == 3).map((item, index) => (
                          <TouchableOpacity style={styles.main_div} onPress={() => shareContent(item)}>
                            <Image source={{ uri: item.thumbnail_img }} style={styles.main_img} />
                            <Text style={styles.main_txt}>{item.title}</Text>                            
                            <Text style={styles.main_txt_dt}>{item.published_date.split('T')[0]}</Text>
                            <Icon name='share' size={wp('6%')} color={'#000'}></Icon>


                          </TouchableOpacity>
                        ))
                        }

                      </View>
                    </KeyboardAwareScrollView>
                  }
                </View>
                <Modal
                  animationType="slide"
                  transparent={true}
                  visible={ContactVisibile}
                  onRequestClose={() => {
                    setContactVisibile(!ContactVisibile);
                  }}>
                  <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                      <View style={{ backgroundColor: "#fff", flexDirection: 'row', width: ('90%'), justifyContent: "space-between", alignItems: 'flex-end', marginBottom: hp('3%') }}>
                        <Text style={{ fontFamily: 'InterBold', color: "#0080AF", fontSize: wp('5%') }}>Contact List</Text>
                        <TouchableOpacity style={{ backgroundColor: "#ccc" }} onPress={() => { setContactVisibile(!ContactVisibile) }} >
                          <Icon name="close" size={wp('6%')} color={"#000"} />
                        </TouchableOpacity>
                      </View>
                      <View style={{ flexDirection: "row", alignItems: "flex-start", justifyContent: "flex-start" }}>
                        <TextInput
                          theme={{ colors: { primary: 'transparent', text: '#323232' } }}
                          style={{ width: '100%' }}
                          returnKeyType="next"
                          placeholder="Search Here"
                          onChangeText={(text) => filterList(text)}
                          activeUnderlineColor="transparent"
                          underlineColor="transparent"
                        />
                      </View>

                      <KeyboardAwareScrollView keyboardShouldPersistTaps='always' style={{ width: '90%' }}>
                        <View style={{ width: wp('90%'), flexDirection: "row" }}>
                          <FlatList
                            onPress={() => selectContactItem(item)}
                            data={contacts}
                            renderItem={renderItem}
                            keyExtractor={keyExtractor}
                            style={styles.contact_list}
                          />

                        </View>
                      </KeyboardAwareScrollView>
                      <View style={{ marginVertical: hp('3%'), flexDirection: 'row', alignItems: 'center', textAlign: 'left', justifyContent: 'flex-start' }}>
                        <TouchableOpacity onPress={() => { setContactVisibile(!ContactVisibile); }}>
                          <Button style={{ backgroundColor: '#001335', borderRadius: 40, paddingHorizontal: wp("4%") }}
                            name="EnrolledMember"
                          ><Icon name="close" size={wp('5%')} color={"#fff"} />
                            Close
                          </Button>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                </Modal>
                <Modal
                  animationType="slide"
                  transparent={true}
                  visible={SendModal}
                  onRequestClose={() => {
                    setSendModal(!SendModal);
                  }}>
                  <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                      <View style={{ backgroundColor: "#fff", flexDirection: 'row', width: ('90%'), justifyContent: "space-between", alignItems: 'flex-end', marginBottom: hp('3%') }}>
                        <Text style={{ fontFamily: 'InterBold', color: "#0080AF", fontSize: wp('5%') }}>Send Manifesto</Text>
                        <TouchableOpacity style={{ backgroundColor: "#ccc" }} onPress={() => { setSendModal(!SendModal); }} >
                          <Icon name="close" size={wp('6%')} color={"#000"} />
                        </TouchableOpacity>
                      </View>

                      <KeyboardAwareScrollView keyboardShouldPersistTaps='always' style={{ width: '90%' }}>
                        <View style={{ width: wp('90%'), flexDirection: "column" }}>
                          <View style={{ width: ('100%'), marginBottom: 2 }}>
                            <Text style={styles.labelinput} >Contact No

                            </Text>
                            <TextInput1 theme={{ colors: { primary: "transparent" } }}
                              underlineColor="transparent"
                              returnKeyType="next"
                              keyboardType='numeric'
                              placeholder="Select Contact No"
                              value={ContactNo.value}
                              selectionColor={'#000'}
                              onChangeText={(text) => setContactNo({ value: text })}
                            />
                            <TouchableOpacity
                              onPress={() => { setContactVisibile(true) }} style={{ position: 'absolute', right: 0 }}>

                              <Icon name="contacts-outline" size={wp('6%')} color={"#2ca8df"} />

                            </TouchableOpacity>
                          </View>
                          <View style={{ width: ('100%'), marginBottom: 5 }}>
                            <Text style={styles.labelinput} >Contact Name

                            </Text>
                            <TextInput1 theme={{ colors: { primary: "transparent" } }}
                              underlineColor="transparent"
                              returnKeyType="next"
                              placeholder="Select Contact Name"
                              value={ContactName.value}
                              selectionColor={'#000'}
                              onChangeText={(text) => setContactName({ value: text })}
                            />
                            <TouchableOpacity
                              onPress={() => { setContactVisibile(true) }} style={{ position: 'absolute', right: 0 }}>

                              <Icon name="contacts-outline" size={wp('6%')} color={"#2ca8df"} />

                            </TouchableOpacity>
                          </View>



                        </View>
                      </KeyboardAwareScrollView>
                      <View style={{ marginVertical: hp('3%'), flexDirection: 'row', alignItems: 'center', textAlign: 'left', justifyContent: 'flex-start' }}>

                        <TouchableOpacity onPress={() => { sendManifesto() }} >
                          <Button style={{ backgroundColor: '#4e73df', borderRadius: 40, paddingHorizontal: wp("4%") }}
                            name="Submit"
                          ><Icon name="content-save" size={wp('5%')} color={"#fff"} />
                            Send
                          </Button>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => { setSendModal(!SendModal); }}>
                          <Button style={{ backgroundColor: '#001335', borderRadius: 40, paddingHorizontal: wp("5%") }}
                            name="EnrolledMember"
                          ><Icon name="close" size={wp('5%')} color={"#fff"} />
                            Close
                          </Button>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                </Modal>
              </>


            </View>




          </View></>
      </TouchableWithoutFeedback>

    </Container>
  )

}
export default Article

const styles = StyleSheet.create({
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
  contactCon: {
    flex: 1,
    flexDirection: "row",
    padding: 5,
    borderBottomWidth: 0.5,
    borderBottomColor: "#d9d9d9",
  },
  imgCon: {},
  placeholder: {
    width: 55,
    height: 55,
    borderRadius: 30,
    overflow: "hidden",
    backgroundColor: "#d9d9d9",
    alignItems: "center",
    justifyContent: "center",
  },
  contactDat: {
    flex: 1,
    justifyContent: "center",
    paddingLeft: 5,
  },
  txt: {
    fontSize: 18,
  },
  name: {
    fontSize: 16,
  },
  phoneNumber: {
    color: "#888",
  },
  contact_list: {
    flex: 1,
  },
  labelinput: {
    fontSize: wp('3.4%',),
    color: '#999999',
    marginBottom: wp('3%')
  },
  main_div: {
    width: ("49%"),
    backgroundColor: "#fff",
    borderRadius: 20,
    alignItems: "center",
    paddingHorizontal: 10,
    marginTop: 10
  },
  main_img: {
    width: "100%",
    height: 100,
    resizeMode: "contain",
  },
  main_txt: {
    fontSize: wp('4%'),
    paddingVertical: hp('1%')
  },
  main_txt_dt: {
    fontSize: wp('3%'), 
  },
  tab_btn: {
    backgroundColor: "#4e73df",
    width: "33%",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: hp('2%')
  },
  tab_txt: {
    color: "#fff",
    fontSize: wp('3.5%')
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
  login_bg: {
    width: wp('100%'),
    paddingHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'center',
    height: hp('100%'),
    alignContent: 'center',
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
    height: wp("8%"),
    borderTopWidth: 0,
    borderLeftWidth: 0,
    borderRightWidth: 0,
    paddingHorizontal: wp('5%'),
    width: wp('60%'),
    marginBottom: hp('2%'),
    backgroundColor: 'transparent',
    fontSize: wp('8%'),
    fontFamily: "InterRegular",
    color: '#00445D',

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
