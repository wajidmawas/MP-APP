import React from 'react'
import { StyleSheet, View, Platform, Image, TouchableOpacity } from 'react-native';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import CONSTANTS from '../Global/Constants';
import ImageAssets from '../Global/ImageAssests';
import HashedText from './HashedText';

export default function HashedSnackbar(props) {
    let bg = styles.error
    if(props.type==='success'){
        bg = styles.success
    }
    if(props.type==='warning'){
        bg = styles.warning
    }
    if(props.visible){
    return (<View
                style={[bg,styles.container]}
                >
                <HashedText style={styles.text}>{props.message}</HashedText>
                <TouchableOpacity style={styles.button} onPress={()=>{props.close()}}>
                    <Image source={ImageAssets.cancel} style={styles.image}/>
                </TouchableOpacity>
            </View>)
    }
    else{
        return <View />
    }
}

const styles = StyleSheet.create({
    success:{
        backgroundColor:'green'
    },
    error:{
        backgroundColor: CONSTANTS.COLOR_ALERT_RED
    },
    warning:{
        backgroundColor:'darkorange'
    },
    container:{
        width:wp('100%'), 
        alignSelf:'center', 
        position:'absolute',
        top: hp('5%'), 
        justifyContent:'center', 
        zIndex:9999999999,
        elevation: (Platform.OS === 'android') ? 9999999999 : 0
    },
    text:{
        fontSize:wp('4%'),
        paddingLeft:wp('2%'),
    },
    button:{
        position:'absolute',
        right:wp('5%'),
    },
    image:{
        width: wp('6%'),
        height:wp('6%')
    }
})


export function useSnackbar() {
    const [isActive, setIsActive] = React.useState(false);
    const [message, setMessage] = React.useState();
    const [type, setType] = React.useState('error');
    
    React.useEffect(() => {
        if (isActive === true) {
            setTimeout(() => {
                setIsActive(false);
            }, 3000);
        }
    }, [isActive]);

    const openSnackBar = (msg = 'Something went wrong...', type='error') => {
        setMessage(msg)
        setType(type)
        setIsActive(true);
    }
    const closeSnackBar = () =>{
        setIsActive(false);
    }

    return { isActive, type, message, openSnackBar, closeSnackBar }
}




// How to use
// import 
    // import HashedSnackbar, { useSnackbar } from '../Components/HashedSnackbar';
// initialize
    // const { isActive, type, message, openSnackBar, closeSnackBar } = useSnackbar();
// render
    {/* <HashedSnackbar visible={isActive} message={message} type={type} close ={closeSnackBar}/> */}
// call
    // openSnackBar('message')