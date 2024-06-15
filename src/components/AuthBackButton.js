import React from 'react'
import { TouchableOpacity, Image, StyleSheet,Text } from 'react-native'
import { getStatusBarHeight } from 'react-native-status-bar-height'
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
export default function BackButton({ goBack }) {
  return (
    <TouchableOpacity onPress={goBack} style={styles.container}>
      <Image onPress={goBack}
        style={styles.image}
        source={require('../assets/arrow_back.png')}
      />
      <Text onPress={goBack} style={styles.lable}>Back</Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    top:hp('-6%'),
    left:wp('-5%'),
    zIndex:1,
    paddingHorizontal:wp('3%'),
    paddingVertical:wp('3%'),
  },
  image: {
    width:wp('5%'),
    height: hp('5%'),
    resizeMode:'contain',
    marginTop:wp('-1%'), 
  },
  lable :{ 
    marginLeft:hp("5%"),
    position:"absolute",
    width:wp("100%"),
    marginTop:hp('2.2%'),
    textTransform:'uppercase',
    fontFamily:'InterBlack',
    color:'#111',
    fontSize:wp('3.5%')
  }
})
