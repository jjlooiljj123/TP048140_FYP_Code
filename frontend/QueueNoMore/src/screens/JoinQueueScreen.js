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

import {Picker} from '@react-native-community/picker';

import ShopListCardWithoutBorder from '../components/cards/ShopListCardWithoutBorder';
import QueueButton from '../components/buttons/QueueButton';

import * as RootNavigation from '../RootNavigation';

import {connect} from 'react-redux';
import {
  fetchShop,
  ioUpdateSpecificShopInfo,
  ioUpdatViewingShopInfo,
} from '../redux/action/shopAction';
import {
  selectActivityChanged,
  queueDescriptionChanged,
  createQueue,
  fetchCustomerActiveQueues,
  fetchCustomerCompletedQueues,
  ioUpdateCusomterActiveQueue,
} from '../redux/action/queueAction';

import openSocket from 'socket.io-client';
import baseServerURL from '../baseServerURL';

class JoinQueueScreen extends Component {
  constructor(props) {
    super(props);
  }

  async componentDidMount() {
    const {shopId} = this.props.route.params;
    await this.props.fetchShop(shopId);
    await this.props.selectActivityChanged(this.props.shopActivities[0]);

    const socket = openSocket(baseServerURL);
    socket.on('queues', data => {
      if (data.action == 'update') {
        for (let i = 0; i < this.props.shops.length; i++) {
          if (this.props.shops[i]._id == data.shopId) {
            this.props.ioUpdatViewingShopInfo(data.shopStatus);
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
        for (let i = 0; i < this.props.shops.length; i++) {
          if (this.props.shops[i]._id == data.shopId) {
            this.props.ioUpdatViewingShopInfo(data.shopStatus);
            this.props.ioUpdateSpecificShopInfo(
              this.props.shops,
              data.shopStatus,
            );
          }
        }
      }
    });
  }

  render() {
    const shopActivites = this.props.shopActivities.map(activity => (
      <Picker.Item
        label={activity.shopActivity_activity}
        value={activity}
        key={activity._id}
      />
    ));

    return (
      <SafeAreaView style={styles.mainContainer}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.titleContainer}>
            <Text style={styles.titleText}>Queue Now</Text>
          </View>
          {this.props.isFetching ? (
            <Text>Loading</Text>
          ) : (
            <>
              <View style={styles.shopInfoContainer}>
                <ShopListCardWithoutBorder
                  name={this.props.shop.shopStatus_shopName}
                  location={this.props.shop.shopStatus_branch}
                  category={this.props.shop.shopStatus_directory}
                  queueLength={this.props.shop.shopStatus_stageOneQueueLength}
                  queueTime={this.props.shop.shopStatus_stageOneWaitingTime}
                  url={this.props.shop.shopStatus_logoUrl}
                  onPress={() => {
                    RootNavigation.navigate('ShopInformation', {
                      shopId: this.props.shop._id,
                    });
                    console.log('onpress');
                  }}
                />
              </View>
              <View style={styles.formContainer}>
                <Text style={styles.formText}>Choose An Acitivy</Text>
                <Picker
                  selectedValue={this.props.selectedActivity}
                  // style={{height: 50, width: 100}}
                  onValueChange={(itemValue, itemIndex) =>
                    this.props.selectActivityChanged(itemValue)
                  }>
                  {shopActivites}
                </Picker>
                <Text style={styles.formText}>Any Description?</Text>
                <TextInput
                  placeholder="Description"
                  style={styles.textInputStyle}
                  autoCapitalize="none"
                  autoCorrect={false}
                  autoCompleteType="off"
                  value={this.props.queueDescription}
                  onChangeText={text =>
                    this.props.queueDescriptionChanged(text)
                  }
                />
              </View>
              <View style={styles.submitButtonContainer}>
                <QueueButton
                  text="Queue"
                  onPress={() => {
                    this.props.createQueue({
                      queueStage: this.props.selectedActivity
                        .shopActivity_queueStage,
                      description: this.props.queueDescription,
                      activity: this.props.selectedActivity
                        .shopActivity_activity,
                      activityId: this.props.selectedActivity._id,
                      priority: this.props.selectedActivity
                        .shopActivity_priority,
                      queueDiscipline: this.props.shop
                        .shopStatus_queueDiscipline,
                      shopStatusId: this.props.shop._id,
                      jwt: this.props.jwt,
                    });
                  }}
                />
              </View>
            </>
          )}
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
  shopInfoContainer: {
    marginHorizontal: 15,
    marginTop: 10,
  },
  formContainer: {
    marginVertical: 5,
    marginHorizontal: 10,
  },
  formText: {
    fontFamily: 'Montserrat-Italic',
    fontSize: 14,
    marginTop: 5,
  },
  textInputStyle: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 14,
  },
  submitButtonContainer: {
    marginVertical: 5,
    marginHorizontal: 10,
  },
});

const mapStateToProps = state => {
  return {
    isFetching: state.shop.isFetching,
    shop: state.shop.shop,
    shops: state.shop.shops,
    QueueNowPageFetchingError: state.shop.QueueNowPageFetchingError,
    shopActivities: state.shop.shopActivities,
    selectedActivity: state.queue.selectedActivity,
    queueDescription: state.queue.queueDescription,
    jwt: state.auth.jwt,
    customerActiveQueues: state.queue.customerActiveQueues,
    fetchingActiveQueuesError: state.queue.fetchingActiveQueuesError,
    activeQueueIsFecthing: state.queue.activeQueueIsFecthing,
    completedQueueIsFecthing: state.queue.completedQueueIsFecthing,
    customerCompletedQueues: state.queue.customerCompletedQueues,
    fetchingCompletedQueuesError: state.queue.fetchingCompletedQueuesError,
  };
};

export default connect(
  mapStateToProps,
  {
    fetchShop,
    selectActivityChanged,
    queueDescriptionChanged,
    createQueue,
    ioUpdatViewingShopInfo,
    ioUpdateSpecificShopInfo,
    fetchCustomerActiveQueues,
    fetchCustomerCompletedQueues,
    ioUpdateCusomterActiveQueue,
  },
)(JoinQueueScreen);
