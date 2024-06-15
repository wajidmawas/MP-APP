import React from 'react'
import { ImageBackground, StyleSheet, KeyboardAvoidingView,Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { theme } from '../core/theme'
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';

export default function Background({ children }) {
  return (
    <LinearGradient
            colors={['#f7e5d6', '#d1e9e9']}
            style={styles.background}
            useAngle={true}
            start={{x:0.6,y:0.35}}
            end={{x:1,y:1}}
        >
      <KeyboardAvoidingView style={styles.container}  >
        {children}
      </KeyboardAvoidingView>
    </LinearGradient>
  )
}

const styles = StyleSheet.create({
  background: {
    width:wp('100%'),
    height: Dimensions.get("window").height,
    backgroundColor: theme.colors.surface,  
  },
  container: {
    flex: 1,
    paddingVertical:hp('10%'),
    width:wp('100%'),
    height:hp('100%')
  },
})
