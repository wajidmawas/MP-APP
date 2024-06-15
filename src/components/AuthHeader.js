import React from 'react'
import { StyleSheet, Image, View, TouchableOpacity, Platform } from 'react-native';
import { Text } from 'react-native-paper'
import { theme } from '../core/theme'
import { heightPercentageToDP as hp } from 'react-native-responsive-screen'
import { widthPercentageToDP as wp } from 'react-native-responsive-screen'
import ImageAssets from '../Global/ImageAssests';
import NetInfo from "@react-native-community/netinfo";
import { useNavigation } from '@react-navigation/native';
import { Icons } from '@expo/vector-icons';
import CONSTANTS from '../Global/Constants'
import Icon from "react-native-vector-icons/MaterialCommunityIcons"
export default function Header(props) {

   
  const nav = useNavigation();
  return (
    <View style={UserLabel.container}>
      <View style={UserLabel.lbllogout}>
        <Image source={require('../assets/images/cong_logo.png')}/> 
        <TouchableOpacity onPress={() => { nav.openDrawer() }}   >
          <Icon onPress={() => { nav.openDrawer() }} name="dots-horizontal" color={'#7F86B2'} size={wp('7%')}></Icon>
            {/* <Image   source={ImageAssets.wifi_icon} style={{
            width: 30, height: 30,position:'absolute',zIndex:999,top:0,left:300,right:5,bottom:0
          }} /> */}
        </TouchableOpacity>


      </View>

      <View style={UserLabel.lblHome}>
        <Text style={UserLabel.lblHome1}>{props.Header}</Text>
      </View>
      <View style={UserLabel.lbllogout1}>
        <TouchableOpacity onPress={() => { props.back == "3" ? nav.replace("DrawerStack", { screen: 'Home' }) : props.back == "1" ? nav.goBack() : null }} >
          {props.back == "1" ?
            <Text onPress={() => { nav.replace("DrawerStack", { screen: 'Home' }) }} style={{ color: '#fff', fontSize: wp("3%"), paddingVertical: 10, textAlign: 'right', fontWeight: 'bold', }}>Back</Text>
            : props.back == "3" ?
              <Text onPress={() => { nav.replace("DrawerStack", { screen: 'Home' }) }} style={{ color: '#fff', textAlign: 'right', fontWeight: 'bold', fontSize: wp("3%"), paddingVertical: 10 }}>Back</Text>
              : props.back == "4" ?
                <Text onPress={() => { nav.replace("DrawerStack", { screen: 'Home' }) }} style={{ color: '#fff', textAlign: 'right', fontWeight: 'bold', fontSize: wp("3%"), paddingVertical: 10 }}>Abort</Text>
                : props.back == "5" ?
                  <Text onPress={() => { nav.replace("DrawerStack", { screen: 'Home' }) }} style={{ color: '#fff', textAlign: 'right', fontWeight: 'bold', fontSize: wp("3%"), paddingVertical: 10 }}>Home</Text>
                  : props.back == "6" ?
                    <Text onPress={() => { nav.replace("DrawerStack", { screen: 'submitlist' }) }} style={{ color: '#fff', textAlign: 'right', fontWeight: 'bold', fontSize: wp("3%"), paddingVertical: 10 }}>Abort</Text>


                    : <></>}

        </TouchableOpacity>
      </View>
    </View>

  )
}

const UserLabel = StyleSheet.create({
  header: {
    color: '#111111',
    fontWeight: 'bold',
    paddingTop: wp('5%'),
    fontSize: wp('5%')
  },
  lblHome: {
    fontSize: wp("5%"),
    color: "#111111",
    fontSize: wp("5%"),
    zIndex: 0,
    display: 'flex',
    alignSelf: 'center',
    alignItems: 'center',
    alignContent: 'center',
  },
  lbllogout: { 
    color: "#ffffff",
    zIndex: 1,
    flexDirection:"row",
    justifyContent:'space-between',
    paddingHorizontal:wp("3%"),
    alignItems:"center",
    width:'100%',
  },
  lbllogout1: {
    right: wp("5%"),
    position: "absolute",
    color: "#ffffff",
    zIndex: 1,
    flexDirection: 'row', display: 'flex',
  },
  lblHome1: {
    color: "#ffffff",
    fontSize: wp("4%"),
    alignItems: "center", zIndex: 1,
    fontWeight: 'bold',
  },
  container: {
    flexDirection: 'row', width: wp("100%"),
    backgroundColor: 'transparent',
    zIndex: 1,
    height: hp("10%"),
    justifyContent: 'center',
    alignItems: 'center',

  },
  lblUser: {
    flexDirection: 'row',
    color: "#111111",
    fontSize: wp("4%"),
    marginTop: wp("10%"),
    marginLeft: wp("1%"),
  },
  lblDept: {
    flexDirection: 'row',
    color: "#999999",
    fontSize: wp("3%"),
    marginLeft: wp("1%"),
  },

  back: { marginLeft: wp("95%"), marginTop: wp("10%") },
  menu: { marginRight: wp("95%") },
  imageleft: { width: wp("10%"), height: wp("10%") },
  imageright: { width: wp("10%"), height: wp("10%") }
})
