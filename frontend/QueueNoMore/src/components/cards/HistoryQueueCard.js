import React, {Component} from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Image} from 'react-native';

import * as RootNavigation from '../../RootNavigation';
import baseServerURL from '../../baseServerURL';

const HistoryQueueCard = ({name, location, totalWaitingTime, date, url}) => {
  return (
    <View style={styles.biggestContainer}>
      <View />
      <View style={styles.imageContainer}>
        <Image source={{uri: baseServerURL + url}} style={styles.imageStyle} />
      </View>
      <View style={styles.cardContainer}>
        <View style={styles.textContainer}>
          <Text numberOfLines={1} style={styles.shopName}>
            {name}
          </Text>
          <Text numberOfLines={1} style={styles.shopLocation}>
            {location}
          </Text>
          <View style={styles.subTextContainer}>
            <Text numberOfLines={1} style={styles.shopSubText}>
              Waited: {totalWaitingTime} mins
            </Text>
            <Text numberOfLines={1} style={styles.shopSubText}>
              {date}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  biggestContainer: {
    marginTop: 10,
  },
  cardContainer: {
    backgroundColor: 'white',
    // width: 360,
    height: 75,
    marginVertical: 5,

    borderRadius: 10,
    // alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    flexDirection: 'row',
    elevation: 1,
  },
  imageContainer: {
    width: 75,
    height: 75,
    //margin: 10,
    position: 'absolute',
    zIndex: 1,
    marginLeft: 15,
    borderRadius: 10,
    // borderWidth: 1,
    shadowOffset: {width: 10, height: 10},
    shadowColor: '#8E54E9',
    shadowOpacity: 10.0,
    elevation: 2,
  },
  imageStyle: {
    width: 75,
    height: 75,
    borderRadius: 10,
  },
  textContainer: {
    flex: 1,
    flexDirection: 'column',
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    marginLeft: 90,
  },
  shopName: {
    fontFamily: 'Montserrat-Regular',
    // fontFamily: 'sans-serif',
    fontSize: 16,
  },
  subTextContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  shopLocation: {
    fontFamily: 'Montserrat-Regular',
    // fontFamily: 'sans-serif',
    fontSize: 14,
    //color: 'grey',
    // paddingBottom: 5,
  },
  shopSubText: {
    fontFamily: 'Montserrat-Regular',
    // fontFamily: 'sans-serif',
    color: 'grey',
    fontSize: 12,
  },
});

export default HistoryQueueCard;
