import React, {Component} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  TextInput,
  FlatList,
} from 'react-native';

import ShopPerformanceCard from '../cards/ShopPerformanceCard';

import * as RootNavigation from '../../RootNavigation';

const ShopAnalysisList = ({results}) => {
  if (!results.length) {
    return null;
  }
  return (
    <View>
      <FlatList
        // horizontal={true}
        // showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        data={results}
        keyExtractor={(results) => results._id}
        renderItem={({item}) => {
          return (
            <TouchableOpacity
              onPress={() => {
                // RootNavigation.navigate('ViewQueue', {queue: item});
              }}>
              <ShopPerformanceCard
                // queueNumber={item.queue_queueNumber}
                hour={item.shopPerformanceAnalysis_hour}
                arrivalRate={item.shopPerformanceAnalysis_arrivalRate}
                serviceRate={item.shopPerformanceAnalysis_serviceRate}
                serviceRatePerServer={
                  item.shopPerformanceAnalysis_serviceRatePerServer
                }
                interarrival={
                  item.shopPerformanceAnalysis_averageInterarrivalTime
                }
                toToServeCus={
                  item.shopPerformanceAnalysis_averageTimeToServerACustomer
                }
                timeInQueue={
                  item.shopPerformanceAnalysis_averageTimeSpentInQueue
                }
                timeInSystem={
                  item.shopPerformanceAnalysis_averageTimeSpentInSystem
                }
                serverUtilization={
                  item.shopPerformanceAnalysis_utilizationOfServer
                }
              />
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
};

export default ShopAnalysisList;
