import React, {Component} from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Image} from 'react-native';

const EmptyHistoryQueueCard = () => {
  return (
    <View style={styles.biggestContainer}>
      <View style={styles.cardContainer}>
        <Text style={styles.text}>No Queue History Yet</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  biggestContainer: {
    marginTop: 10,
    flex: 1,
  },
  cardContainer: {
    // flex: 1,
    backgroundColor: 'white',
    // width: 360,
    height: 75,
    // marginVertical: 5,
    marginHorizontal: 0,
    // marginTop: 15,

    borderRadius: 10,
    // alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    flexDirection: 'row',
    elevation: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 16,
  },
});

export default EmptyHistoryQueueCard;
