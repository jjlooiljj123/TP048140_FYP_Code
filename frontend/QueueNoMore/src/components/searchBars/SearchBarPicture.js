import React, {Component} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  TextInput,
} from 'react-native';

import Icon from 'react-native-vector-icons/FontAwesome';

const SearchBarPicture = ({placeholder}) => {
  return (
    <View style={styles.searchContainer}>
      <View style={styles.leftIconContainer}>
        <Icon name="search" size={22} color="#8E54E9" />
      </View>
      <View style={styles.inputStyle}>
        {/* <TextInput placeholder={placeholder} style={styles.textInputStyle} /> */}
        <Text style={styles.textInputStyle}>{placeholder}</Text>
      </View>
      <View style={styles.rightIconContainer}>
        <Icon name="filter" size={22} color="#8E54E9" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  searchContainer: {
    backgroundColor: 'white',
    paddingVertical: 0,
    borderRadius: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    // borderWidth: 3,
    // borderColor: '#8E54E9',
  },
  leftIconContainer: {
    padding: 5,
    alignSelf: 'center',
    // borderWidth: 1,
  },
  rightIconContainer: {
    padding: 5,
    alignSelf: 'center',
  },
  inputStyle: {
    flex: 1,
    alignSelf: 'flex-start',
    height: 50,
    paddingHorizontal: 10,
    justifyContent: 'center',
  },
  textInputStyle: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 18,
    color: 'gray',
  },
});

export default SearchBarPicture;
