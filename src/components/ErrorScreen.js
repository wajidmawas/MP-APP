import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import Container from './Container';
import HashedText from './HashedText';

export default function ErrorScreen(props) {
    return (
        <Container viewStyle={{width:wp("80%"),alignSelf:"center",justifyContent:"center",alignItems:"center"}}>
            <HashedText style={{lineHeight: wp("8%")}}>{props.children}</HashedText>
        </Container>
    )
}

const styles = StyleSheet.create({})
