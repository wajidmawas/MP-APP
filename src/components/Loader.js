import React from 'react'
import { StyleSheet, Text, View, Modal, ActivityIndicator } from 'react-native';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import Container from './Container';
import CONSTANTS from '../Global/Constants';


export default function Loader(props) {
    return (
        <Modal transparent={true}>
        {props.transparent === true ? 
                <View style={{flex:1,justifyContent:"center",alignItems:"center",backgroundColor:'rgba(0, 0, 0, 0.5)'}}>
                    <Container style={{flex:0,backgroundColor:"black", padding: wp('5%'), borderRadius:wp('3%')}} viewStyle={{flex:0}}>
                        <ActivityIndicator size='large' color={CONSTANTS.COLOR_GOLD_ONE}/>
                    </Container>
                </View>
        : 
                <Container>
                <View style={{flex:1,justifyContent:"center"}}>
                    <ActivityIndicator size='large' color={CONSTANTS.COLOR_GOLD_ONE}/>
                </View>
                </Container>
        
        }
        </Modal>
    )
}

const styles = StyleSheet.create({})
