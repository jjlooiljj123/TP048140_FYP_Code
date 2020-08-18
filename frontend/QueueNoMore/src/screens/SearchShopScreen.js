import React, {Component} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  TextInput,
  SafeAreaView,
  ScrollView,
} from 'react-native';

import SearchBar from '../components/searchBars/SearchBar';
import ShopListCard from '../components/cards/ShopListCard';
import ShopList from '../components/Lists/ShopList';

import * as RootNavigation from '../RootNavigation';

import {connect} from 'react-redux';
import {
  fetchAllShops,
  searchShopChanged,
  ioUpdateSpecificShopInfo,
} from '../redux/action/shopAction';
import {
  fetchCustomerActiveQueues,
  fetchCustomerCompletedQueues,
  ioUpdateCusomterActiveQueue,
} from '../redux/action/queueAction';

import openSocket from 'socket.io-client';
import baseServerURL from '../baseServerURL';

class SearchShopScreen extends Component {
  async componentDidMount() {
    await this.props.fetchAllShops();

    const socket = openSocket(baseServerURL);
    socket.on('queues', data => {
      if (data.action == 'update' || data.action == 'create') {
        console.log('io searc shop - update');
        for (let i = 0; i < this.props.shops.length; i++) {
          if (this.props.shops[i]._id == data.shopStatus._id) {
            this.props.ioUpdateSpecificShopInfo(
              this.props.shops,
              data.shopStatus,
            );
          }
        }
        for (let i = 0; i < this.props.customerActiveQueues.length; i++) {
          if (this.props.customerActiveQueues[i]._id == data.queueId) {
            this.props.fetchCustomerActiveQueues(this.props.jwt);
            this.props.fetchCustomerCompletedQueues(this.props.jwt);
          }
        }
      }
      if (data.action == 'create') {
        console.log('io searc shop - create');
        for (let i = 0; i < this.props.shops.length; i++) {
          if (this.props.shops[i]._id == data.shopStatus._id) {
            this.props.ioUpdateSpecificShopInfo(
              this.props.shops,
              data.shopStatus,
            );
          }
        }
      }
      if (data.action == 'updateBehind') {
        console.log('io searc shop - updateBehind');
        for (let i = 0; i < this.props.customerActiveQueues.length; i++) {
          if (this.props.customerActiveQueues[i]._id == data.queueId) {
            this.props.ioUpdateCusomterActiveQueue(
              this.props.customerActiveQueues,
              data.queue,
            );
          }
        }
        // this.props.fetchCustomerActiveQueues(this.props.jwt);
      }
      // else if (data.action == 'create') {
      //   this.props.ioUpdateSpecificShopInfo(this.props.shops, data.shopStatus);
      // }
    });
  }

  render() {
    return (
      <SafeAreaView style={styles.mainContainer}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.titleContainer}>
            <Text style={styles.titleText}>Search Shop</Text>
          </View>
          <View style={styles.searchBarContainer}>
            <SearchBar
              placeholder="Search"
              searchOnPress={() => console.log('search pressed')}
              filterOnpress={() => RootNavigation.navigate('ShopFilter')}
              value={this.props.search_shop}
              onChangeText={text =>
                this.props.searchShopChanged(text, this.props.shops)
              }
            />
          </View>
          <View style={styles.shopListContainer}>
            {this.props.isFetching ? (
              // <Text>loading...</Text>
              <View />
            ) : (
              <ShopList
                activeQueues={this.props.customerActiveQueues}
                shopStatus={
                  this.props.search_shop.length > 0
                    ? this.props.filteredShops
                    : this.props.shops
                }
              />
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    // alignItems: 'center',
  },
  titleContainer: {
    marginHorizontal: 10,
    marginTop: 10,
  },
  titleText: {
    fontFamily: 'Montserrat-Bold',
    fontSize: 24,
    color: '#8E54E9',
  },
  searchBarContainer: {
    marginHorizontal: 10,
    marginTop: 10,
  },
  shopListContainer: {
    marginTop: 10,
    marginHorizontal: 10,
  },
});

const mapStateToProps = state => {
  return {
    isFetching: state.shop.isFetching,
    shops: state.shop.shops,
    searchShopPageFetchingError: state.shop.searchShopPageFetchingError,
    search_shop: state.shop.search_shop,
    jwt: state.auth.jwt,
    customerActiveQueues: state.queue.customerActiveQueues,
    fetchingActiveQueuesError: state.queue.fetchingActiveQueuesError,
    activeQueueIsFecthing: state.queue.activeQueueIsFecthing,
    completedQueueIsFecthing: state.queue.completedQueueIsFecthing,
    customerCompletedQueues: state.queue.customerCompletedQueues,
    fetchingCompletedQueuesError: state.queue.fetchingCompletedQueuesError,
    filteredShops: state.shop.filteredShops,
  };
};

export default connect(
  mapStateToProps,
  {
    fetchAllShops,
    searchShopChanged,
    ioUpdateSpecificShopInfo,
    fetchCustomerActiveQueues,
    fetchCustomerCompletedQueues,
    ioUpdateCusomterActiveQueue,
  },
)(SearchShopScreen);
