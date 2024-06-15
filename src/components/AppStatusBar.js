import React from 'react';
import { StyleSheet, SafeAreaView } from 'react-native';

import AppStatusBar from '../components/AppStatusBar'; 

const THEME_COLOR = '#285E29';

export default function App() {
    return (
        <>
            <SafeAreaView style={styles.topSafeArea}> 
                <AppStatusBar backgroundColor={THEME_COLOR} barStyle="light-content" /> 
            </SafeAreaView>
        </>
    );
}

const styles = StyleSheet.create({
    topSafeArea: {
        flex: 1, 
        backgroundColor: THEME_COLOR
    }, 
    
});