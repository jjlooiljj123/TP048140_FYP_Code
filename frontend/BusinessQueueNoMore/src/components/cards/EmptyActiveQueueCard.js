import React, {Component} from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Image} from 'react-native';

import * as RootNavigation from '../../RootNavigation';
import baseServerURL from '../../baseServerURL';

const EmptyActiveQueueCard = ({}) => {
  return (
    // <TouchableOpacity onPress={() => RootNavigation.navigate('ViewQueue')}>
    <View style={styles.cardContainer}>
      <View style={styles.textContainer}>
        <Text style={styles.queueNumberText}>No Active Record</Text>
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
    // alignSelf: 'flex-start',
    padding: 10,
    // justifyContent: 'center',
  },
  queueNumberText: {
    fontFamily: 'Montserrat-Bold',
    fontSize: 20,
    alignSelf: 'center',
  },
});

export default EmptyActiveQueueCard;
