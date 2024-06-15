import StartScreen from '../screens/StartScreen'
import React, { useState, useEffect, useContext } from 'react'
import { View, Text, BackHandler,Dimensions  } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';
import Register from '../screens/Register'
import Dashboard from '../screens/Dashboard'
import Reports from '../screens/Reports';
import Home from '../screens/Home' 
 import ViewList from '../screens/ViewList';
 import AddMember from '../screens/AddMember'; 
 import Article from '../screens/Article'; 
import CustomSideBar from '../Global/CustomSideBar';
import { AppContext } from '../Global/Stores'; 
import Container from '../components/Container';
import 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';
const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();
import { NavigationActions } from 'react-navigation'
import { heightPercentageToDP } from 'react-native-responsive-screen';
const AppNavigation = () => {
    const [storeState, dispatch] = useContext(AppContext);
    const AuthNavigator = () => {
        return (
            <Stack.Navigator
                screenOptions={{ headerShown: false }}
            >
                <Stack.Screen name="StartScreen" component={StartScreen} /> 
            </Stack.Navigator>
        )
    }
    const logoutScreen = (props) => () => {
        BackHandler.exitApp();
    };
    const DrawerNavigator = (props) => {
        return <Drawer.Navigator initialRouteName="Home" drawerContent={props => <CustomSideBar {...props} />}> 
            <Drawer.Screen
                name="Home"
                component={Home}
                options={{
                    drawerLabel: 'Home',
                    headerShown: false,
                    drawerIcon: ({ focused, size }) => (
                        <Ionicons
                            name="md-home"
                            size={size}
                            color={focused ? '#7cc' : '#ccc'}
                        />
                    ),
                }}
            />
            <Drawer.Screen
                name="Dashboard"
                component={Dashboard}
                options={{
                    drawerLabel: 'Dashboard',
                    headerShown: false,
                    drawerIcon: ({ focused, size }) => (
                        <Ionicons
                            name="md-home"
                            size={size}
                            color={focused ? '#7cc' : '#ccc'}
                        />
                    ),
                }}
            />
              <Drawer.Screen
                name="Reports"
                component={Reports}
                options={{
                    drawerLabel: 'Dashboard',
                    headerShown: false,
                    drawerIcon: ({ focused, size }) => (
                        <Ionicons
                            name="md-home"
                            size={size}
                            color={focused ? '#7cc' : '#ccc'}
                        />
                    ),
                }}
            />
                   <Drawer.Screen
                name="ViewList"
                component={ViewList}
                options={{
                    drawerLabel: 'ViewList',
                    headerShown: false,
                    drawerIcon: ({ focused, size }) => (
                        <Ionicons
                            name="md-home"
                            size={size}
                            color={focused ? '#7cc' : '#ccc'}
                        />
                    ),
                }}
            />
             
             <Drawer.Screen
                name="AddMember"
                component={AddMember}
                options={{
                    drawerLabel: 'AddMember',
                    headerShown: false,
                    drawerIcon: ({ focused, size }) => (
                        <Ionicons
                            name="md-home"
                            size={size}
                            color={focused ? '#7cc' : '#ccc'}
                        />
                    ),
                }}
            />
             <Drawer.Screen
                name="Article"
                component={Article}
                options={{
                    drawerLabel: 'Article',
                    headerShown: false,
                    drawerIcon: ({ focused, size }) => (
                        <Ionicons
                            name="md-home"
                            size={size}
                            color={focused ? '#7cc' : '#ccc'}
                        />
                    ),
                }}
            />
            <Drawer.Screen
                name="Register"
                component={Register}
                options={{
                    drawerLabel: 'Register',
                    headerShown: false,
                    drawerIcon: ({ focused, size }) => (
                        <Ionicons
                            name="md-home"
                            size={size}
                            color={focused ? '#7cc' : '#ccc'}
                        />
                    ),
                }}
            />
             
        </Drawer.Navigator>
    }
    return (
        <NavigationContainer >
            <Stack.Navigator
                headerMode="none"
            >
                <Stack.Screen name="AuthStack" component={AuthNavigator} />
                <Stack.Screen name="DrawerStack" component={DrawerNavigator} />
            </Stack.Navigator>
        </NavigationContainer>
    )

}
export default AppNavigation