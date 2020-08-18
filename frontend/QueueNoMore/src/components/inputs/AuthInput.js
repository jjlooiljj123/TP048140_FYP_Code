import React, {Component} from 'react';
import {TextInput, StyleSheet} from 'react-native';

const AuthInput = ({
  placeholder,
  value,
  onChangeText,
  selectionColor,
  underlineColorAndroid,
  secureTextEntry,
  placeholderTextColor,
  onFocus,
}) => {
  return (
    <TextInput
      autoCapitalize="none"
      autoCorrect={false}
      autoCompleteType="off"
      style={styles.inputStyle}
      value={value}
      placeholder={placeholder}
      placeholderTextColor={placeholderTextColor}
      onChangeText={onChangeText}
      selectionColor={selectionColor}
      // underlineColorAndroid={underlineColorAndroid}
      secureTextEntry={secureTextEntry}
      onFocus={onFocus}
    />
  );
};

const styles = StyleSheet.create({
  inputStyle: {
    color: 'white',
    // fontFamily: 'sans-serif',
    fontFamily: 'Montserrat-Regular',
    backgroundColor: 'rgba(255,255,255,0.4)', // 40% opaque
    borderRadius: 40,
    paddingLeft: 20,
    marginTop: 5,
    fontSize: 18,
  },
});

export default AuthInput;
