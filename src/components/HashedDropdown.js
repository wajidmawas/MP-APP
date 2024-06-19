import React, { useState, useCallback, useContext, useEffect, useRef } from 'react'
import { StyleSheet, View, Text, Button, Platform } from 'react-native'
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import CONSTANTS from '../Global/Constants';
// You can import from local files
import SelectDropdown from 'react-native-select-dropdown';
 
import Icon from "react-native-vector-icons/MaterialCommunityIcons"
import { LinearGradient } from 'expo-linear-gradient';
import ImageAssests from '../Global/ImageAssests';
export default function HashedDropdown(props) {
    const [showDropdown, setShowDropdown] = useState(true)
    const [state, setstate] = useState(false);
    const dropdownState = props.onSelect;
    return (
            <View style={styles.container}>
               
                <SelectDropdown style={{ width: wp('70%')}}
                    data={props.dropdownList}
                    onSelect={(selectedItem, index) => { 
                          if (props.type == "AssemblyList" || props.type == "Industry1" || props.type=="VaccineList") {
                                    props.onSelect((prev) => {
                                        return {
                                            ...prev,
                                            location: selectedItem
                                        }

                                    }
                                    );
                        }
                        else{
                            return props.onSelect(selectedItem)
                        }
                    }}
                    buttonTextAfterSelection={(selectedItem, index) => {
                        // text represented after item is selected
                        // if data array is an array of objects then return selectedItem.property to render after item is selected
                        return selectedItem
                    }}
                    rowTextForSelection={(item, index) => {
                        // text represented for each item in dropdown
                        // if data array is an array of objects then return item.property to represent item in dropdown
                        return item
                    }}
                    renderDropdownIcon={() => {
                        return (
                            <Icon name={'chevron-down'} size={wp('5%')} color={"#323232"} />
                        );
                    }}
                    dropdownIconPosition={"right"}
                    buttonStyle={styles.dropdown1BtnStyle}
                    buttonTextStyle={styles.dropdown1BtnTxtStyle}
                    dropdownStyle={styles.dropdown1DropdownStyle} 
                    rowTextStyle={styles.dropdown1RowTxtStyle}
                    defaultValue={props.SelectedValue}  
                    defaultButtonText={props.dropdownName}
                    rowStyle={styles.rowStyle}
                />
                 
            </View>
    )
}


const styles = StyleSheet.create({
    container: {
        flex:1,
        flexDirection:'row',
        width:('100%'), 
        justifyContent:"center"
    },
    rowStyle:{
        backgroundColor:"#fff",
        height:hp("7%"), 
        borderBottomWidth:0.2,
        ...Platform.select({
            android: {
                borderBottomWidth: 0.5,
            },
          }),
    },
    dropdown1DropdownStyle: {
        //  backgroundColor: CONSTANTS.COLOR_GREY_ONE,
        backgroundColor:'#fff',
          color:"#fff" , textAlign:'left', 
          fontSize:wp('3%'),  borderRadius:15,
          ...Platform.select({
            android: {
                marginTop: -30,
            },
          }),
        }, 
    dropdown1RowTxtStyle: { color:'#000',textAlign:'left',fontSize:wp('4%'),paddingVertical:hp('1%')},
    dropdown1BtnStyle: { 
        backgroundColor:'transparent', 
        fontSize:wp('3%'), 
        color:'#111111',  
        borderWidth:1,  
        borderRadius:10,
        borderColor:'#ccc',   
        height:65, 
        textAlign:'left',
        width:('100%'),
        marginBottom: hp('2%'),
       
    },
    dropdown1BtnTxtStyle: { 
        color: '#323232',
        textAlign: "left",
        fontSize:wp('3.5%'), 
        fontFamily:"InterRegular"
        
    },
});
