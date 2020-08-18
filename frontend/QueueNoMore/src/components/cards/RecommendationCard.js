import React, {Component} from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Image} from 'react-native';

const RecommendationCard = ({
  name,
  location,
  category,
  queueLength,
  queueTime,
}) => {
  return (
    <TouchableOpacity onPress={() => console.log()}>
      <View style={styles.cardContainer}>
        <View style={styles.imageContainer}>
          <Image
            source={require('../../../assets/images/antherstigma.png')}
            style={styles.imageStyle}
          />
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
              {queueLength}
            </Text>
            <Text numberOfLines={1} style={styles.queueText}>
              {queueTime}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: 'white',
    width: 360,
    height: 120,
    marginVertical: 7,
    marginRight: 7,
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
  shopName: {
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 16,
  },
  shopLocation: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 14,
    //color: 'grey',
    paddingBottom: 5,
  },
  shopCategory: {
    fontFamily: 'Montserrat-Regular',
    color: 'grey',
  },
  queueTextContainer: {
    marginTop: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  queueText: {
    fontFamily: 'Montserrat-Regular',
    // fontFamily: 'sans-serif',
    color: 'grey',
  },
});

export default RecommendationCard;
