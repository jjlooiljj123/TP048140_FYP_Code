import React, {Component} from 'react';
import {View, Text, StyleSheet, Image, TouchableOpacity} from 'react-native';

import * as RootNavigation from '../../RootNavigation';
import baseServerURL from '../../baseServerURL';

const ShopListCardWithoutBorder = ({
  name,
  location,
  category,
  queueLength,
  queueTime,
  url,
  onPress,
}) => {
  return (
    <View style={styles.cardContainer}>
      <View style={styles.imageContainer}>
        <Image source={{uri: baseServerURL + url}} style={styles.imageStyle} />
      </View>
      <View style={styles.textStyle}>
        <Text numberOfLines={2} style={styles.shopName}>
          {name}
        </Text>
        <Text numberOfLines={4} style={styles.shopLocation}>
          {location}
        </Text>
        <Text numberOfLines={4} style={styles.shopCategory}>
          {category}
        </Text>
        <View style={styles.queueTextContainer}>
          <Text numberOfLines={1} style={styles.queueText}>
            Length: {queueLength}
          </Text>
          <Text numberOfLines={1} style={styles.queueText}>
            {queueTime} mins
          </Text>
        </View>
        <View style={styles.viewDetailContainer}>
          <TouchableOpacity onPress={onPress}>
            <Text style={styles.viewDetailsText}>View Shop Details</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: 'white',
    // width: 360,
    // height: 120,
    marginVertical: 5,
    // marginRight: 7,
    borderRadius: 10,
    alignItems: 'center',
    padding: 5,
    // flexDirection: 'row',
    // elevation: 1,
    // shadowOpacity: 10.0,
  },

  imageContainer: {
    width: 100,
    height: 100,
    margin: 10,
    borderRadius: 10,
    shadowOpacity: 5,
    elevation: 1,
    // borderWidth: 1,
    // borderColor: 'blue',
    alignSelf: 'center',
  },
  imageStyle: {
    width: 100,
    height: 100,
    // margin: 10,
    borderRadius: 10,
    // shadowOpacity: 5,
    // elevation: 5,
  },

  textStyle: {
    flex: 1,
    flexDirection: 'column',
    alignSelf: 'stretch',
    paddingLeft: 5,
    paddingRight: 10,
    paddingTop: 5,
    // borderWidth: 1,
  },
  shopName: {
    alignSelf: 'center',
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 16,
  },
  shopLocation: {
    alignSelf: 'center',
    fontFamily: 'Montserrat-Regular',
    fontSize: 14,
    //color: 'grey',
    paddingBottom: 5,
  },
  shopCategory: {
    alignSelf: 'center',
    fontFamily: 'Montserrat-Regular',
    color: 'grey',
  },
  queueTextContainer: {
    marginTop: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    // borderWidth: 1,
    marginBottom: 10,
  },
  queueText: {
    fontFamily: 'Montserrat-Regular',
    // fontFamily: 'sans-serif',
    color: 'grey',
  },
  viewDetailContainer: {
    alignSelf: 'flex-end',
    paddingVertical: 5,
  },
  viewDetailsText: {
    fontFamily: 'Montserrat-MediumItalic',
    color: '#8E54E9',
  },
});

export default ShopListCardWithoutBorder;
