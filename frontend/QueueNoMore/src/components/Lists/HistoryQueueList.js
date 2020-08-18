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

import HistoryQueueCard from '../cards/HistoryQueueCard';

const HistoryQueueList = ({results}) => {
  if (!results.length) {
    return null;
  }
  return (
    <View>
      <FlatList
        //  horizontal={true}
        //  showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        data={results}
        keyExtractor={results => results._id}
        renderItem={({item}) => {
          return (
            // <TouchableOpacity
            // // onPress={() => navigation.navigate('JoinQueue', {id: item._id})}
            // >
            <HistoryQueueCard
              name={item.queue_shopName}
              location={item.queue_shopBranch}
              totalWaitingTime={item.queue_totalWaitingTime}
              date={item.queue_date}
              url={item.queue_shopImageUrl}
            />
            // </TouchableOpacity>
          );
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({});

export default HistoryQueueList;
