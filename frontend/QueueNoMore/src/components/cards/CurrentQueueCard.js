import React, {Component} from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Image} from 'react-native';

import * as RootNavigation from '../../RootNavigation';
import baseServerURL from '../../baseServerURL';

const CurrentQueueCard = ({
  queueStatus,
  name,
  queueNumber,
  queueLength,
  queueTime,
  url,
}) => {
  return (
    // <TouchableOpacity onPress={() => RootNavigation.navigate('ViewQueue')}>
    <View style={styles.cardContainer}>
      <View style={styles.imageContainer}>
        <Image source={{uri: baseServerURL + url}} style={styles.imageStyle} />
      </View>
      <View style={styles.textStyle}>
        <Text numberOfLines={2} style={styles.queueStatus}>
          {queueStatus}
        </Text>
        <Text numberOfLines={2} style={styles.shopName}>
          {name}
        </Text>
        <Text numberOfLines={4} style={styles.queueNumber}>
          No. {queueNumber}
        </Text>

        <View style={styles.queueTextContainer}>
          <Text numberOfLines={1} style={styles.queueText}>
            Length: {queueLength}
          </Text>
          <Text numberOfLines={1} style={styles.queueText}>
            {queueTime} mins
          </Text>
        </View>
      </View>
    </View>
    // </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: 'white',
    width: 340,
    height: 120,
    marginVertical: 7,
    marginLeft: 15,
    borderRadius: 10,
    alignItems: 'center',
    padding: 5,
    flexDirection: 'row',
    elevation: 1,
    shadowOpacity: 10.0,
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
    alignSelf: 'flex-start',
    paddingLeft: 5,
    paddingRight: 10,
    paddingTop: 5,
  },
  queueStatus: {
    fontFamily: 'Montserrat-Bold',
    fontSize: 16,
  },
  shopName: {
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 14,
    marginTop: 5,
  },
  queueNumber: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 14,
    //color: 'grey',
    paddingBottom: 5,
  },
  queueTextContainer: {
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  queueText: {
    fontFamily: 'Montserrat-Regular',
    // fontFamily: 'sans-serif',
    color: 'grey',
  },
});

export default CurrentQueueCard;
