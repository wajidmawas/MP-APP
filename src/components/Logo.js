import React from 'react'
import { Image, StyleSheet } from 'react-native';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';

export default function Logo() {
  return <Image source={require('../assets/logo.png')} style={styles.image} />
}

const styles = StyleSheet.create({
  image: {
    width:wp('80%'),
    height: hp('30%'),
    marginBottom:hp('0%'),
    marginTop:hp('3%'),
    resizeMode:'cover',
    margin:'auto',
    alignSelf:'center',
     
  },
})
