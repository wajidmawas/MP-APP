import React from 'react';
import { StyleSheet, View, TextInput } from 'react-native';
import PropTypes from 'prop-types';
import { TextInput as Input } from 'react-native-paper'

import colors from '../Global/Constants';
import { GenericStyles } from '../Global/Styles';

const CustomTextInput = function (props) {
  const {
    containerStyle,
    style,
    LeftComponent,
    RightComponent,
    refCallback,
    ...remainingProps
  } = props;

  return (
    
    <View style={[styles.containerStyle, containerStyle]}>
      {LeftComponent}
      <Input
        {...remainingProps}
        style={[styles.textInputStyle, GenericStyles.fill, style]}
        ref={refCallback}
      />
      {RightComponent}
    </View>
  );
};

const styles = StyleSheet.create({
  containerStyle: {
    flexDirection: 'row',
    borderWidth: 1,
    paddingVertical: 10, flex: 1, 
    borderColor: 'transparent',
    marginVertical: 10,
    marginHorizontal: 5,
    backgroundColor: 'transparent'
  },
  textInputStyle: {
    padding: 0,

  },
});

CustomTextInput.defaultProps = {
  LeftComponent: <></>,
  RightComponent: <></>,
};

CustomTextInput.propTypes = {

  LeftComponent: PropTypes.object,
  RightComponent: PropTypes.object,
  refCallback: PropTypes.func,
};

export default CustomTextInput;