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

import CurrentQueueCard from '../cards/CurrentQueueCard';

import {queueStatusMapping} from '../../queueStatusMapping';

import * as RootNavigation from '../../RootNavigation';

const CurrentQueueList = ({results}) => {
  if (!results.length) {
    return null;
  }
  return (
    <View>
      <FlatList
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        // showsVerticalScrollIndicator={false}
        data={results}
        keyExtractor={results => results._id}
        renderItem={({item}) => {
          return (
            <TouchableOpacity
              onPress={() =>
                RootNavigation.navigate('ViewQueue', {queue: item})
              }>
              <CurrentQueueCard
                queueStatus={queueStatusMapping(item.queue_queueStatus)}
                name={item.queue_shopName}
                queueNumber={item.queue_queueNumber}
                queueLength={item.queue_waitingLength}
                queueTime={item.queue_estimatedWaitingTime}
                url={item.queue_shopImageUrl}
              />
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({});

export default CurrentQueueList;
