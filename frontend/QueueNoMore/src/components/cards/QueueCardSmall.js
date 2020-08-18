import React, {Component} from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Image} from 'react-native';

import * as RootNavigation from '../../RootNavigation';

const QueueCardSmall = ({name, time, uri}) => {
  return (
    <TouchableOpacity
      onPress={() =>
        // console.log(uri)
        RootNavigation.navigate('')
      }>
      <View style={styles.cardContainer}>
        <View style={styles.imageContainer}>
          <Image
            source={require('../../../assets/images/antherstigma.png')}
            style={styles.imageStyle}
          />
        </View>
        <Text style={styles.shopName}>{name}</Text>
        <Text style={styles.queueTime}>{time}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: 'white',
    width: 120,
    height: 160,
    marginVertical: 7,
    marginRight: 7,
    borderRadius: 10,
    alignItems: 'center',
    padding: 5,
    elevation: 1,
    shadowOpacity: 10.0,
  },
  imageContainer: {
    // borderWidth: 1,
  },
  imageStyle: {
    width: 70,
    height: 70,
    margin: 5,
    borderRadius: 10,
    // shadowOpacity: 5,
    // elevation: 5,
    elevation: 10,
  },
  shopName: {
    fontFamily: 'Montserrat-Regular',
  },
  queueTime: {
    fontFamily: 'Montserrat-Regular',
    color: 'grey',
  },
});

export default QueueCardSmall;
