import React from 'react'
import { View, StyleSheet, Text, Platform } from 'react-native'
import { TextInput as Input } from 'react-native-paper'
import { heightPercentageToDP, widthPercentageToDP } from 'react-native-responsive-screen'
import { theme } from '../core/theme'

export default function TextInput1({ errorText, description, ...props }) {

  return (

    <View style={styles.container}>
      <Input
        style={styles.input1}
        {...props}
      />
      {description && !errorText ? (
        <Text style={styles.description}>{description}</Text>
      ) : null}
      {errorText ? <Text style={styles.error}>{errorText}</Text> : null}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginVertical: 5, 
    fontSize:widthPercentageToDP("3%"),
    ...Platform.select({

      android: {
        marginVertical: 10, 
      },
    }),   
    backgroundColor: 'transparent',
    borderRadius: 10,  
    
    textAlign:"center",
    borderWidth:1,   
borderColor: '#ccc', 
  },
  error: {
    color: 'red',
    fontSize: 10,
    paddingHorizontal: 15
  },
  input1:{
    color:'#333',
    fontFamily:"InterRegular"
  }

})
