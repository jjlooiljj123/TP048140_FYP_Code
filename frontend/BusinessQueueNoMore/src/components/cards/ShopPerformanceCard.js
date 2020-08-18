import React, {Component} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  Image,
  TouchableOpacity,
} from 'react-native';

const ShopPerformanceCard = ({
  hour,
  arrivalRate,
  serviceRate,
  serviceRatePerServer,
  interarrival,
  toToServeCus,
  timeInQueue,
  timeInSystem,
  serverUtilization,
}) => {
  return (
    <View style={styles.cardContainer}>
      <Text style={styles.HourText}>Hour: {hour}.00</Text>
      <Text style={styles.titleText}>Arrival Rate:</Text>
      <Text style={styles.contentText}>{arrivalRate} per hour</Text>
      <Text style={styles.titleText}>Service Rate:</Text>
      <Text style={styles.contentText}>{serviceRate} per hour</Text>
      <Text style={styles.titleText}>Service Rate Per Server:</Text>
      <Text style={styles.contentText}>{serviceRatePerServer} per hour</Text>
      <Text style={styles.titleText}>Customer Inter-arrival Time:</Text>
      <Text style={styles.contentText}>{interarrival} mins</Text>
      <Text style={styles.titleText}>Average Time to Serve A Customer:</Text>
      <Text style={styles.contentText}>{toToServeCus} mins</Text>
      <Text style={styles.titleText}>
        Average Time for a Customer Spent in the Queue:
      </Text>
      <Text style={styles.contentText}>{timeInQueue} mins</Text>
      <Text style={styles.titleText}>
        Average Time for a Customer Spent in the System:
      </Text>
      <Text style={styles.contentText}>{timeInSystem} mins</Text>
      <Text style={styles.titleText}>Utilization of servers:</Text>
      <Text style={styles.contentText}>{serverUtilization}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    marginTop: 10,
    borderRadius: 10,
    elevation: 1,
    padding: 5,
  },
  HourText: {
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 12,
    marginTop: 6,
  },
  titleText: {
    fontFamily: 'Montserrat-Light',
    fontSize: 12,
    marginTop: 6,
  },
  contentText: {
    fontFamily: 'Montserrat-Italic',
    fontSize: 12,
  },
});

export default ShopPerformanceCard;
