import React from "react";
import {
  StyleSheet,
  Text,
  View,
  Platform,
  Image,
  TouchableOpacity,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { widthPercentageToDP } from "react-native-responsive-screen"; 
 

const Cards = ({ item }) => { 

  const { title, amount, lastFourDigits, cardColor } = item; 
  const gotoViewlist = (title) => {
    props.navigation.replace('DrawerStack', {
        screen: 'ViewList'
    })
}
  return (
    <TouchableOpacity onPress={() => { gotoViewlist(item.title) }} style={[styles.container]} key={item.title}>
      <LinearGradient
        style={[styles.background]}
        colors={[cardColor, cardColor]}
      >
        <View style={styles.wrapper} key={item.title}>
         
          <Text style={styles.title}>{title}</Text> 
          <Text style={styles.lastFourDigits}>{lastFourDigits}</Text>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
};

export default Cards;

const styles = StyleSheet.create({
  container: {
    marginLeft: 20,
    borderRadius: 10,
    shadowColor: '#888',
    shadowOffset: {
        width: 0,
        height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 14, 
  },
  background: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    borderRadius: 10, 
    padding:10,
  },  
  title: {
    marginTop: 0,
    fontSize:widthPercentageToDP('5%'),
    color:'#fff',
    fontFamily:'InterBold'
  }, 
  lastFourDigits: {
    marginTop: 26,
    paddingBottom: 10,
    textAlign:'right',
    fontSize:widthPercentageToDP('4%'),
    color:'#fff',
    fontFamily:'InterBold'
  },
});
