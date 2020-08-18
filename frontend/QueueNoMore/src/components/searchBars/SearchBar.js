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

const SearchBar = ({
  placeholder,
  searchOnPress,
  filterOnpress,
  value,
  onChangeText,
}) => {
  return (
    <View style={styles.searchContainer}>
      <View style={styles.leftIconContainer}>
        <TouchableOpacity onPress={searchOnPress}>
          <Icon name="search" size={22} color="#8E54E9" />
        </TouchableOpacity>
      </View>
      <View style={styles.inputStyle}>
        <TextInput
          placeholder={placeholder}
          style={styles.textInputStyle}
          autoCapitalize="none"
          autoCorrect={false}
          autoCompleteType="off"
          value={value}
          onChangeText={onChangeText}
        />
      </View>
      <View style={styles.rightIconContainer}>
        <TouchableOpacity onPress={filterOnpress}>
          <Icon name="filter" size={22} color="#8E54E9" />
        </TouchableOpacity>
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
    paddingHorizontal: 5,
    alignSelf: 'center',
    // borderWidth: 1,
  },
  rightIconContainer: {
    paddingHorizontal: 5,
    alignSelf: 'center',
  },
  inputStyle: {
    flex: 1,
    alignSelf: 'flex-start',
    height: 40,
    paddingHorizontal: 10,
    justifyContent: 'center',
  },
  textInputStyle: {
    fontFamily: 'Montserrat-Medium',
    fontSize: 14,
  },
});

export default SearchBar;
