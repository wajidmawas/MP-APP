import React from 'react'
import { StyleSheet, Platform } from 'react-native'
import { Button as PaperButton } from 'react-native-paper'
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { theme } from '../core/theme'

export default function Button({ mode, style, ...props }) {
  return (
    <PaperButton
      style={[
        styles.button,
        mode === 'outlined' && { backgroundColor: theme.colors.surface },
        style,
      ]}
      labelStyle={styles.text}
      mode={mode}
      {...props}
    />
  )
}

const styles = StyleSheet.create({
  button: {
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center', 

  },
  text: {
    fontSize: wp('3.5%'),
    fontFamily:"InterBold",
    lineHeight: 30, 
    color: '#fff',
    ...Platform.select({

      android: {
        lineHeight: 30,
        fontSize: wp('3.5%'),
      },
    })
  },
})
