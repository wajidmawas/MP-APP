import React, { useContext,useEffect, useState } from 'react'
import { StyleSheet, Image, View, Text, TouchableOpacity,Alert,AlertIOS,Platform,ToastAndroid} from 'react-native';
import {
    DrawerContentScrollView,
    DrawerItem,
} from '@react-navigation/drawer';
import Container from '../components/Container';
import Services from '../actions/services';
import ImageAssets from '../Global/ImageAssests';
import { LinearGradient } from 'expo-linear-gradient';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import CONSTANTS from '../Global/Constants';
import { useNavigation, DrawerActions } from '@react-navigation/native';
import { AppContext } from '../Global/Stores';
import Loader from '../components/Loader';
import AsyncStorage from '@react-native-async-storage/async-storage'
import Icon from "react-native-vector-icons/MaterialCommunityIcons"





const CustomSideBar = (props) => {
    const [AlertHdr, setAlertHdr] = useState("Delete Account");
const [AlertHdrMsg, setAlertHdrMsg] = useState("Are you sure you want to delete your account?");
    const [storeState, dispatch] = useContext(AppContext);
    const navigation = useNavigation();
    const [userObject, setUserObject] = useState({}); 
    const [val, setVal] = useState(false);
    const notifyMessage = (msg) => {
        if (Platform.OS === 'android') {
          ToastAndroid.show(msg, ToastAndroid.SHORT)
        } else {
          Alert.alert(msg);
        }
      }
    const showConfirmDialog = (_props) => { 
        setAlertHdr("Delete Account")
        setAlertHdrMsg("Are you sure you want to delete your account?")
        return Alert.alert(
            AlertHdr,
            AlertHdrMsg,
            [
                // The "Yes" button
                {
                    text: "Yes Delete",
                    onPress: () => {
                        deleteAccount(_props);
                    },
                },
                // The "No" button
                // Does nothing but dismiss the dialog when tapped
                {
                    text: "Cancel",
                },
            ]
        );
    };
    useEffect(() => {
        onLoad()
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

    
    const deleteAccount  = async (_props) => {
        await AsyncStorage.getItem("userSession").then(async (value) => {
            let obj = JSON.parse(value);
            var _userObject = obj;
        var service = new Services();
        
        const body = {
            TypeId: 4,
            UserId:_userObject.ID,
            FilterId: _userObject.ID,
            FilterText: ''
        }; 
        console.log("Body" + JSON.stringify(body) )
        service.postData('/_getMasters', body).then(data => {
           
            if (data == null || data == "") {
                notifyMessage("Invalid request object");
                return false;
            } 
            
            var resonseData = JSON.parse(data)
            console.log("Response" + data)
            if (resonseData.errorCode == -100) {
                notifyMessage("No User Found");
            }
            else if (resonseData.errorCode == 200) {  
               AsyncStorage.setItem("votersList","");
               AsyncStorage.setItem("userSession", "") 
               _props.nav.dispatch(DrawerActions.closeDrawer())
               _props.nav.replace("AuthStack", { screen: 'StartScreen' });
            }
        });
    })
    }
    const CustomDrawerItem = (props) => (
   
        <DrawerItem {...props} style={styles.DrawerItemContainer}
            icon={({ size }) => (
                <View style={styles.DrawerItemImageContainer}><Icon style={styles.DrawerItemImage} name={[props.icon]} color={'#5592d9'} size={wp('5%')} /></View>
            )}
            label={props.label}
            labelStyle={styles.DrawerItemLabel}
            onPress={() => {
                switch (props.label) {
                    case 'Dashboard':
                        props.nav.navigate("Home");
                        break;
                        case 'MP Dashboard':
                        props.nav.navigate("MPdashboard");
                        break;
                        case 'Reports':
                            props.nav.navigate("Reports");
                            break;
                        case 'New Petition':
                            props.nav.navigate("AddMember");
                            break; 
                        case 'New Draft':
                            props.nav.navigate("AddDraft");
                            break;
                       case 'User Wise Petitions':
                            props.nav.navigate("UserWisePetitions");
                            break;       
                      case 'Assigned Petitions':
                                props.nav.navigate("AssignedPetitions");
                                
                        break; 
                        case 'My Drafts':
                            props.nav.navigate("ViewDrafts");
                            
                    break; 
                        case 'User Wise Rank':
                                props.nav.navigate("UserWiseRank");
                                break;       
                         case 'Completed Petitions':
                                props.nav.navigate("CompletedPetitions");
                        break;       
                            case 'Department Wise Petitions':
                                props.nav.navigate("DepartmentWisePetitions");
                                break;    
                    case 'Logout':
                        AsyncStorage.setItem('userSession', "")
                        props.nav.dispatch(DrawerActions.closeDrawer())
                        props.nav.replace("AuthStack", { screen: 'StartScreen' });
                        break; 
                    case 'My Profile':
                        props.nav.navigate("MyProfile");
                        break;
                        case 'Delete Account': 
                            showConfirmDialog(props);
                            break;
    
                }
    
            }}
        />
    )
    return (
        <LinearGradient
            colors={['#fff', '#fff']}
            style={styles.background}
            useAngle={true}
            start={{ x: 0.6, y: 0.35 }}
            end={{ x: 1, y: 1 }}
        >
            <View style={styles.Container}>

                <View style={styles.UserNameContainer}>
                    {/* <Image style={styles.UserNameImage} source={ImageAssets.user} /> */}
                    {/*  */}
                    <Text style={styles.UserName}>Hi, {userObject!=undefined ? userObject.NAME : "User"}</Text>
                </View>
                
            </View>

            <View style={styles.Container1}>
                {/* <CustomDrawerItem label='My Profile' icon="username" nav={navigation}     /> */}
                {userObject!=null && userObject.ROLETYPE!='N'  &&
                <CustomDrawerItem label='Dashboard' icon="view-dashboard" nav={navigation} />   
                }

                {userObject!=null && userObject.ROLETYPE == 'N' &&
                 <CustomDrawerItem label='My Drafts' icon="file" nav={navigation}  />
                }
                {userObject!=null && userObject.ROLETYPE!='C' && userObject!=null && userObject.ROLETYPE!='N' &&
                 <CustomDrawerItem label='New Petition' icon="plus" nav={navigation}  />
                }
               { userObject!=null && userObject.ROLETYPE=='N' &&
                 <CustomDrawerItem label='New Draft' icon="plus" nav={navigation}  />
                }
                 {userObject!=null && userObject.ROLETYPE=='M' &&
                 <>
                  <CustomDrawerItem label='MP Dashboard' icon="view-list" nav={navigation}  />
                 <CustomDrawerItem label='Assigned Petitions' icon="view-list" nav={navigation}  />
                 <CustomDrawerItem label='User Wise Rank' icon="view-list" nav={navigation}  />
                 </>
                }
                {userObject!=null && userObject.ROLETYPE!='C' && userObject!=null && userObject.ROLETYPE!='N' &&
                <>
                <CustomDrawerItem label='User Wise Petitions' icon="view-list" nav={navigation} /> 
                <CustomDrawerItem label='Department Wise Petitions' icon="view-list" nav={navigation} /> 
                <CustomDrawerItem label='Completed Petitions' icon="view-list" nav={navigation} /> 
                </> 
                                
                }
                <CustomDrawerItem label='Logout' icon="logout" nav={navigation} /> 
                <CustomDrawerItem label='Delete Account' icon="delete" nav={navigation} />
                {/* <CustomDrawerItem label='Campaigns' icon="username" nav={navigation}  />
                     <CustomDrawerItem label='ChangePassword' icon="username" nav={navigation}  /> */}
            </View>
        </LinearGradient>
    );
}
export default CustomSideBar

const styles = StyleSheet.create({
    background:{width:"100%"},
    Container: { height: 90, paddingLeft: wp('0%'), paddingTop: wp('5%'), width:"80%" },
    Container1: { height: hp("94%"), paddingLeft: wp('0%'), width:"100%", paddingTop: wp('5%') },
    DrawerItemContainer: { color: '#5592d9',width:"100%" }, 
    DrawerItemImageContainer: { justifyContent: "center", alignItems: "center" },
    DrawerItemImage: { position: 'absolute', left: 3,  },
    DrawerItemLabel: { fontSize: wp("4%"), color: '#5592d9', paddingLeft: wp('3%') },
    BackButtonContainer: { justifyContent: "flex-start" },
    BackButton: { width: wp('6%'), height: wp('6%'), marginHorizontal: wp("5%"), },
    UserNameContainer: { flex: 1, flexDirection: "row", justifyContent: "flex-start", alignItems: "center", marginTop: 10 },
    UserNameImage: { width: 25, height: 25, marginHorizontal: wp("5%"), position: 'absolute', left: 5, },
    UserName: { fontSize: wp("4%"), fontWeight: "bold", color: '#5592d9', paddingLeft: 30,width:"100%" }, 
})
