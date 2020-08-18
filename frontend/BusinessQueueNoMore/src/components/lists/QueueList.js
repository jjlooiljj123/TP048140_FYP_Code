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

import ActiveQueueCard from '../cards/ActiveQueueCard';

// import {queueStatusMapping} from '../../queueStatusMapping';

import * as RootNavigation from '../../RootNavigation';

const QueueList = ({results}) => {
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
        keyExtractor={(results) => results._id}
        renderItem={({item}) => {
          return (
            <TouchableOpacity
              onPress={() => {
                RootNavigation.navigate('ViewQueue', {queue: item});
              }}>
              <ActiveQueueCard
                queueNumber={item.queue_queueNumber}
                queueLength={item.queue_waitingLength}
                activityName={item.queue_activity}
                description={item.queue_description}
                // queueStatus={queueStatusMapping(item.queue_queueStatus)}
                // name={item.queue_shopName}
                // queueNumber={item.queue_queueNumber}
                // queueLength={item.queue_waitingLength}
                // queueTime={item.queue_estimatedWaitingTime}
                // url={item.queue_shopImageUrl}
              />
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({});

export default QueueList;
