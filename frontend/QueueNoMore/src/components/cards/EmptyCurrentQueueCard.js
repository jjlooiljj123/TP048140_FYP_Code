import React, {Component} from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Image} from 'react-native';

import * as RootNavigation from '../../RootNavigation';
import baseServerURL from '../../baseServerURL';

const EmptyCurrentQueueCard = ({}) => {
  return (
    <TouchableOpacity onPress={() => RootNavigation.navigate('SearchShop')}>
      <View style={styles.cardContainer}>
        <View style={styles.imageContainer}>
          <Image
            source={require('../../../assets/images/Qbutton.png')}
            style={styles.imageStyle}
          />
        </View>
        <View style={styles.textStyle}>
          <Text numberOfLines={2} style={styles.cardTitle}>
            You are not in the queue!
          </Text>
          <Text numberOfLines={2} style={styles.joinNowText}>
            Join Now!
          </Text>
          {/* <Text numberOfLines={4} style={styles.queueNumber}>
          No. {queueNumber}
        </Text> */}

          {/* <View style={styles.queueTextContainer}>
          <Text numberOfLines={1} style={styles.queueText}>
            Length: {queueLength}
          </Text>
          <Text numberOfLines={1} style={styles.queueText}>
            {queueTime} mins
          </Text>
        </View> */}
        </View>
      </View>
    </TouchableOpacity>
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
    // shadowOpacity: 5,
    // elevation: 1,
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
  cardTitle: {
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 5,
  },
  joinNowText: {
    fontFamily: 'Montserrat-Bold',
    fontSize: 20,
    textAlign: 'center',
    marginTop: 10,
  },
  // queueNumber: {
  //   fontFamily: 'Montserrat-Regular',
  //   fontSize: 14,
  //   //color: 'grey',
  //   paddingBottom: 5,
  // },
  // queueTextContainer: {
  //   marginTop: 10,
  //   flexDirection: 'row',
  //   justifyContent: 'space-between',
  // },
  // queueText: {
  //   fontFamily: 'Montserrat-Regular',
  //   // fontFamily: 'sans-serif',
  //   color: 'grey',
  // },
});

export default EmptyCurrentQueueCard;
