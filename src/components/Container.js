import React from 'react'
import { StyleSheet, SafeAreaView, Text, View, KeyboardAvoidingView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import CONSTANTS from '../Global/Constants';
import { theme } from '../core/theme'
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
export default function Container(props) {
  return (
    <LinearGradient
      colors={['#fff', '#fff']}
      style={styles.background}
      useAngle={true}
      start={{ x: 0.6, y: 0.35 }}
      end={{ x: 1, y: 1 }}
    >
      {props.children}
    </LinearGradient>
  )
}


const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: theme.colors.surface,
  },

})

