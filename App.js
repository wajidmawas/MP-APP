import React, { useCallback, useEffect, useReducer, useState } from 'react';
import { Provider } from 'react-native-paper'
import { initialState, reducer, AppContext } from './src/Global/Stores';
import { NavigationContainer } from '@react-navigation/native'
import { StyleSheet, View, Platform, Image, TouchableOpacity } from 'react-native';
import AppLoading from 'expo-app-loading';
import * as SplashScreen from 'expo-splash-screen';
import * as ImagePicker from 'expo-image-picker';
import { createStackNavigator } from '@react-navigation/stack'
import AppNavigation from './src/Global/index'
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { theme } from './src/core/theme'
import * as Font from 'expo-font';
import 'react-native-gesture-handler';
import ErrorScreen from './src/components/ErrorScreen';
import * as Location from 'expo-location'; 
import * as Contacts from "expo-contacts";
const Stack = createStackNavigator()
const fetchFonts = {
  'InterBlack': require("./assets/fonts/Inter-Black.ttf"),
  'InterBold': require("./assets/fonts/Inter-Bold.ttf"),
  'InterRegular': require("./assets/fonts/Inter-Regular.ttf"),
  'InterMedium': require("./assets/fonts/Inter-Medium.ttf"),
  'Natosans': require("./assets/fonts/NotoSansTelugu.ttf")
};
SplashScreen.preventAutoHideAsync();
export default function App() { 
  const [appIsReady, setAppIsReady] = useState(false);
  const [permission, setPermission] = useState(true);
  const [loaded, setLoaded] = useState(false);
  const [state, dispatch] = useReducer(reducer, initialState);
  useEffect(() => {
    async function prepare() {
      if (Platform.OS !== 'web') {
         //const galleryStatus = await ImagePicker.requestMediaLibraryPermissionsAsync();
         const contacts = await Contacts.requestPermissionsAsync();
        //const locationStatus = await Location.requestForegroundPermissionsAsync();


        if (contacts.status !=='granted') {
          setPermission(false); 
        }
      }
      try {
        // Pre-load fonts, make any API calls you need to do here
        await Font.loadAsync(fetchFonts);
        // Artificially delay for two seconds to simulate a slow loading
        // experience. Please remove this if you copy and paste the code!
        await new Promise(resolve => setTimeout(resolve, 2000));
      } catch (e) {
        console.warn(e);
      } finally {
        // Tell the application to render
        setAppIsReady(true);
      }
    }

    prepare();
  }, []);
  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {

      await SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  if (!appIsReady) {

    return null;
  }

  if (permission === true) {
    return (<SafeAreaProvider onLayout={onLayoutRootView}>
      <AppContext.Provider value={[state, dispatch]}>
        <AppNavigation />
      </AppContext.Provider>
    </SafeAreaProvider>)
  } else {
    return <ErrorScreen>
      To Fully access app features permissions are required,
      kindly go to app settings and grant the permissions to continue
    </ErrorScreen>
  }

  // return (
  //   <Provider theme={theme} startAsync={fetchFonts}>
  //     <SafeAreaProvider>
  //   <AppContext.Provider value={[state,dispatch]}>
  //     <AppNavigation />
  //   </AppContext.Provider>
  // </SafeAreaProvider>
  //   </Provider>
  // )
}
