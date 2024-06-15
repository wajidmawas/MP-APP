import React from 'react'
import { StyleSheet } from 'react-native'
import { Text } from 'react-native-paper'
import { theme } from '../core/theme'
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
export default function Header(props) {
  return <Text style={styles.header} {...props} />
}

const styles = StyleSheet.create({
  header: {
    fontSize: wp('5%'),
    color: theme.colors.primary,
    fontWeight: 'bold', 
    color:'#fff',  
    marginHorizontal:hp('2%'),
    paddingVertical:wp('3%'),
  },
})
