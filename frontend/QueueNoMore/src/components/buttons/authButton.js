import React from 'react';
import {View, TouchableOpacity, Text, StyleSheet} from 'react-native';

const AuthButton = ({text, onPress, disabled}) => {
  return (
    <TouchableOpacity
      style={styles.containerStyle}
      onPress={onPress}
      disabled={false}>
      <Text style={styles.textStyle}>{text}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  containerStyle: {
    borderColor: 'white',
    backgroundColor: 'white',
    borderWidth: 1.8,
    borderRadius: 40,
  },
  textStyle: {
    color: '#8E54E9',

    alignSelf: 'center',
    padding: 10,
    // fontFamily: 'Montserrat-SemiBold',
    fontFamily: 'Montserrat-Bold',

    // fontFamily: 'sans-serif',
    // fontWeight: 'bold',
    fontSize: 18,
  },
});

export default AuthButton;
