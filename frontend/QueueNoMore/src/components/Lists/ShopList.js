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

import ShopListCard from '../cards/ShopListCard';

import * as RootNavigation from '../../RootNavigation';

const ShopList = ({shopStatus, activeQueues}) => {
  if (!shopStatus.length) {
    return null;
  }
  return (
    <View>
      <FlatList
        //  horizontal={true}
        //  showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        data={shopStatus}
        keyExtractor={shopStatus => shopStatus._id}
        renderItem={({item}) => {
          return (
            <TouchableOpacity
              onPress={() => {
                let isQueueExist = activeQueues.filter(
                  activeQueue => activeQueue.queue_shop == item._id,
                );
                if (isQueueExist.length > 0) {
                  console.log('isQueueExist', isQueueExist[0]);
                  RootNavigation.navigate('ViewQueue', {
                    queue: isQueueExist[0],
                  });
                } else {
                  RootNavigation.navigate('JoinQueue', {
                    shopId: item._id,
                  });
                }
              }}>
              <ShopListCard
                name={item.shopStatus_shopName}
                location={item.shopStatus_branch}
                category={item.shopStatus_directory}
                queueLength={item.shopStatus_stageOneQueueLength}
                url={item.shopStatus_logoUrl}
                queueTime={item.shopStatus_stageOneWaitingTime}
              />
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({});

export default ShopList;
