import React, {Component} from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Image} from 'react-native';

import * as RootNavigation from '../../RootNavigation';
import baseServerURL from '../../baseServerURL';

const ActiveQueueCard = ({
  queueNumber,
  queueLength,
  activityName,
  description,
}) => {
  return (
    // <TouchableOpacity onPress={() => RootNavigation.navigate('ViewQueue')}>
    <View style={styles.cardContainer}>
      <View style={styles.textContainer}>
        <View style={styles.titleContainer}>
          {/* <Text style={styles.queueNumberText}>No. 00001</Text>
          <Text style={styles.queueStatusText}>Length: 1</Text> */}
          <Text style={styles.queueNumberText}>No. {queueNumber}</Text>
          <Text style={styles.queueStatusText}>Length: {queueLength}</Text>
        </View>
        <View style={styles.queueInfoContainer}>
          {/* <Text style={styles.queueInfoText}>Dine In</Text>
          <Text numberOfLines={2} style={styles.queueInfoText}>
            -----------------------------------------------------------
          </Text> */}
          <Text style={styles.queueInfoText}>Activity: {activityName}</Text>
          <Text numberOfLines={2} style={styles.queueInfoText}>
            Description: {description}
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
    width: 300,
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
  textContainer: {
    flex: 1,
    flexDirection: 'column',
    alignSelf: 'flex-start',
    padding: 10,
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  queueNumberText: {
    fontFamily: 'Montserrat-Bold',
    fontSize: 20,
  },
  queueStatusText: {
    fontFamily: 'Montserrat-Medium',
    fontSize: 16,
    alignSelf: 'flex-end',
  },
  queueInfoContainer: {marginTop: 5},
  queueInfoText: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 14,
  },
});

export default ActiveQueueCard;
