import {createContext} from 'react';
//import AsyncStorage from '@react-native-async-storage/async-storage';
const AppContext = createContext(initialState);
const initialState={ 
    "token":"",
    "test":0,
    "loggedInUserData":"" 
}

const reducer = (state,action)=>{
    
    switch(action.type){ 
        case 'LOGINDATA':
            return {
                ...state,
                ...{'loggedInUserData':action.payload}
            }
        default: return state
    }
}
// const _storeData = async (userSession) => {
//     try {
//       await  AsyncStorage.setItem('userSession', JSON.stringify(userSession))
//     } catch (error) {
//       // Error saving data
//     }
//   };
//   const _getStoredItem = async (_key) => {
//     try {
//       await  AsyncStorage.getItem(key)
//     } catch (error) {
//       // Error saving data
//     }
//   };
//   const getLoginDetails = async  () => {
//     let user = await  AsyncStorage.getItem('userSession');  
//     let obj=JSON.parse(user); 
//     return obj;
// }
export {initialState,reducer,AppContext}


