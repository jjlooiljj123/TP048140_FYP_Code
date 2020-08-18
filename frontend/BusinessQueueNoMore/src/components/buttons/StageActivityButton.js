import React from 'react';
import {View, TouchableOpacity, Text, StyleSheet} from 'react-native';

const StageActivityButton = ({text, onPress}) => {
  return (
    <TouchableOpacity style={styles.containerStyle} onPress={onPress}>
      <Text style={styles.textStyle}>{text}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  containerStyle: {
    borderColor: '#8E54E9',
    // backgroundColor: '#8E54E9',
    borderWidth: 1.8,
    borderRadius: 40,
    flex: 1,
  },
  textStyle: {
    color: '#8E54E9',
    // color: 'white',
    alignSelf: 'center',
    paddingVertical: 6,
    paddingHorizontal: 10,
    // fontFamily: 'Montserrat-SemiBold',
    fontFamily: 'Montserrat-Bold',

    // fontFamily: 'sans-serif',
    // fontWeight: 'bold',
    fontSize: 12,
  },
});

export default StageActivityButton;
