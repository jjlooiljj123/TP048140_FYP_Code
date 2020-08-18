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

import QueueInfoCard from '../components/cards/QueueInfoCard';
import QueueButton from '../components/buttons/QueueButton';

import {Picker} from '@react-native-community/picker';

import * as RootNavigation from '../RootNavigation';
import {queueStatusMapping} from '../queueStatusMapping';

import {connect} from 'react-redux';
import {
  fetchSpecificQueues,
  fetchShopActivities,
  selectActivityChanged,
  updateQueue,
  isAbleToServeAvtivityChanged,
  fetchCurrentlyServingQueues,
  fetchQueuingQueues,
  fetchStageOneQueues,
} from '../redux/action/queueAction';
import {fetchUserById} from '../redux/action/authAction';

import openSocket from 'socket.io-client';
import baseServerURL from '../baseServerURL';

class ViewQueueScreen extends Component {
  async componentDidMount() {
    const {queue} = this.props.route.params;
    console.log('queue ID passed', queue._id);

    await this.props.fetchSpecificQueues(queue._id);
    await this.props.fetchShopActivities({
      shopId: this.props.shopId,
      stage: 0,
    });

    if (this.props.totalStage > this.props.specificQueue.queue_stage) {
      console.log('componentdidmount: enter fetch next stage activity');
      await this.props.fetchShopActivities({
        shopId: this.props.shopId,
        stage: this.props.specificQueue.queue_stage + 1,
      });
      await this.props.selectActivityChanged(this.props.shopActivities[0]);
    }

    let ableToServe = false;
    await this.props.fetchUserById(this.props.userId);
    const currentlyServingId = this.props.user.user_servingShopActivityId;
    for (let i = 0; i < currentlyServingId.length; i++) {
      if (currentlyServingId[i] == queue.queue_activityId) {
        ableToServe = true;
      }
    }
    this.props.isAbleToServeAvtivityChanged(ableToServe);

    // socket
    const socket = openSocket(baseServerURL);
    socket.on('queues', (data) => {
      if (data.action == 'update' && data.shopStatus._id == this.props.shopId) {
        console.log('trigger view io update');
        this.props.fetchCurrentlyServingQueues({
          shopId: this.props.shopId,
          jwt: this.props.jwt,
        });
        this.props.fetchQueuingQueues({
          shopId: this.props.shopId,
          jwt: this.props.jwt,
        });
        this.props.fetchStageOneQueues({
          shopId: this.props.shopId,
          jwt: this.props.jwt,
        });
      } else if (
        data.action == 'create' &&
        data.shopStatus._id == this.props.shopId
      ) {
        console.log('trigger view io create');
        this.props.fetchQueuingQueues({
          shopId: this.props.shopId,
          jwt: this.props.jwt,
        });
        this.props.fetchStageOneQueues({
          shopId: this.props.shopId,
          jwt: this.props.jwt,
        });
      }
    });
  }

  render() {
    const shopActivites = this.props.shopActivities.map((activity) => (
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
            <Text style={styles.titleText}>Queue</Text>
          </View>
          <View style={styles.contentContainer}>
            <QueueInfoCard
              queueStatus={queueStatusMapping(
                this.props.specificQueue.queue_queueStatus,
              )}
              queueNumber={this.props.specificQueue.queue_queueNumber}
              queueLength={this.props.specificQueue.queue_waitingLength}
              queueStage={this.props.specificQueue.queue_stage}
              activity={this.props.specificQueue.queue_activity}
              description={this.props.specificQueue.queue_description}
            />

            {this.props.specificQueue.queue_queueStatus == 1 &&
            this.props.isAbleToServeActivity == true ? (
              <>
                <View style={styles.buttonContainer}>
                  <QueueButton
                    text="Called"
                    onPress={() => {
                      this.props.updateQueue({
                        jwt: this.props.jwt,
                        queueId: this.props.specificQueue._id,
                        action: 'called',
                        currentShopActivityId: this.props.specificQueue
                          .queue_activityId,
                        nextShopActivityId: null,
                        stage: this.props.specificQueue.queue_stage,
                      });
                      RootNavigation.navigate('Home');
                    }}
                  />
                </View>
              </>
            ) : this.props.specificQueue.queue_queueStatus == 2 &&
              this.props.totalStage > this.props.specificQueue.queue_stage &&
              this.props.isAbleToServeActivity == true ? (
              <>
                <Picker
                  selectedValue={this.props.selectedActivity}
                  // style={{height: 50, width: 100}}
                  onValueChange={(itemValue, itemIndex) =>
                    this.props.selectActivityChanged(itemValue)
                  }>
                  {shopActivites}
                </Picker>
                <View style={styles.buttonContainer}>
                  <QueueButton
                    text="Proceed"
                    onPress={() => {
                      this.props.updateQueue({
                        jwt: this.props.jwt,
                        queueId: this.props.specificQueue._id,
                        action: 'proceed',
                        currentShopActivityId: this.props.specificQueue
                          .queue_activityId,
                        nextShopActivityId: this.props.selectedActivity,
                        stage: this.props.specificQueue.queue_stage,
                      });
                      RootNavigation.navigate('Home');
                    }}
                  />
                </View>
                <View style={styles.buttonContainer}>
                  <QueueButton
                    text="Complete"
                    onPress={() => {
                      this.props.updateQueue({
                        jwt: this.props.jwt,
                        queueId: this.props.specificQueue._id,
                        action: 'accepted',
                        currentShopActivityId: this.props.specificQueue
                          .queue_activityId,
                        nextShopActivityId: null,
                        stage: this.props.specificQueue.queue_stage,
                      });
                      RootNavigation.navigate('Home');
                    }}
                  />
                </View>
                <View style={styles.buttonContainer}>
                  <QueueButton
                    text="Skip"
                    onPress={() => {
                      this.props.updateQueue({
                        jwt: this.props.jwt,
                        queueId: this.props.specificQueue._id,
                        action: 'skip',
                        currentShopActivityId: this.props.specificQueue
                          .queue_activityId,
                        nextShopActivityId: null,
                        stage: this.props.specificQueue.queue_stage,
                      });
                      RootNavigation.navigate('Home');
                    }}
                  />
                </View>
              </>
            ) : this.props.specificQueue.queue_queueStatus == 2 &&
              this.props.isAbleToServeActivity == true &&
              !(
                this.props.totalStage > this.props.specificQueue.queue_stage
              ) ? (
              <>
                <View style={styles.buttonContainer}>
                  <QueueButton
                    text="Complete"
                    onPress={() => {
                      this.props.updateQueue({
                        jwt: this.props.jwt,
                        queueId: this.props.specificQueue._id,
                        action: 'accepted',
                        currentShopActivityId: this.props.specificQueue
                          .queue_activityId,
                        nextShopActivityId: null,
                        stage: this.props.specificQueue.queue_stage,
                      });
                      RootNavigation.navigate('Home');
                    }}
                  />
                </View>
                <View style={styles.buttonContainer}>
                  <QueueButton
                    text="Skip"
                    onPress={() => {
                      this.props.updateQueue({
                        jwt: this.props.jwt,
                        queueId: this.props.specificQueue._id,
                        action: 'skip',
                        currentShopActivityId: this.props.specificQueue
                          .queue_activityId,
                        nextShopActivityId: null,
                        stage: this.props.specificQueue.queue_stage,
                      });
                      RootNavigation.navigate('Home');
                    }}
                  />
                </View>
              </>
            ) : (
              <>
                <View style={styles.buttonContainer}>
                  <QueueButton
                    text="Back"
                    onPress={() => RootNavigation.navigate('Home')}
                  />
                </View>
              </>
            )}
            {/* <View style={styles.buttonContainer}>
              <QueueButton text="Accept" />
            </View>
            <View style={styles.buttonContainer}>
              <QueueButton text="Proceed" />
            </View> */}
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
  contentContainer: {
    marginVertical: 10,
    marginHorizontal: 10,
  },
  buttonContainer: {
    marginVertical: 10,
  },
});

const mapStateToProps = (state) => {
  return {
    jwt: state.auth.jwt,
    userId: state.auth.userId,
    shopId: state.auth.shopId,
    userRole: state.auth.userRole,
    specificQueue: state.queue.specificQueue,
    isFetchingSpecific: state.queue.isFetchingSpecific,
    fetchingSpecificQueueError: state.queue.fetchingSpecificQueueError,
    totalStage: state.queue.totalStage,
    shopActivities: state.queue.shopActivities,
    selectedActivity: state.queue.selectedActivity,
    isAbleToServeActivity: state.queue.isAbleToServeActivity,
    user: state.auth.user,
  };
};

export default connect(mapStateToProps, {
  fetchSpecificQueues,
  fetchShopActivities,
  selectActivityChanged,
  updateQueue,
  fetchUserById,
  isAbleToServeAvtivityChanged,
  fetchCurrentlyServingQueues,
  fetchQueuingQueues,
  fetchStageOneQueues,
})(ViewQueueScreen);

// export default ViewQueueScreen;
