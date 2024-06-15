import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { widthPercentageToDP as wp } from 'react-native-responsive-screen'
import CONSTANTS from '../Global/Constants'

export default function HashedText(props) {
    return (
        <View>
            <Text style={[styles.text,props.style]}>{props.children}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    text:{color:CONSTANTS.COLOR_WHITE, fontSize:CONSTANTS.FONT_SIZE}
})
