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

import QueueButton from '../components/buttons/QueueButton';

import * as RootNavigation from '../RootNavigation';

import {connect} from 'react-redux';
import {
  fetchCustomerActiveQueues,
  fetchCustomerCompletedQueues,
  ioUpdateCusomterActiveQueue,
} from '../redux/action/queueAction';
import openSocket from 'socket.io-client';
import baseServerURL from '../baseServerURL';

class QueuedSuccessfulScreen extends Component {
  componentDidMount() {
    this.props.fetchCustomerActiveQueues(this.props.jwt);

    const socket = openSocket(baseServerURL);
    socket.on('queues', data => {
      if (data.action == 'updateBehind') {
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
      if (data.action == 'update') {
        for (let i = 0; i < this.props.customerActiveQueues.length; i++) {
          if (this.props.customerActiveQueues[i]._id == data.queueId) {
            this.props.fetchCustomerActiveQueues(this.props.jwt);
            this.props.fetchCustomerCompletedQueues(this.props.jwt);
          }
        }
      }
    });
  }

  render() {
    return (
      <SafeAreaView style={styles.mainContainer}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.titleContainer}>
            <Text style={styles.titleText}>Queued Successfully!</Text>
          </View>

          <View style={styles.queueInfoContainer}>
            <View style={styles.imageContainer}>
              <Image
                source={{
                  uri: baseServerURL + this.props.shopStatus.shopStatus_logoUrl,
                }}
                style={styles.imageStyle}
              />
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.shopNameText}>
                {this.props.shopStatus.shopStatus_shopName}
              </Text>
              <Text style={styles.branchText}>
                {this.props.shopStatus.shopStatus_branch}
              </Text>

              <View style={styles.activityAndDescriptionContainer}>
                <Text style={styles.activityAndDescriptionText}>
                  Queued For: {this.props.queue.queue_activity}
                </Text>
                <Text style={styles.activityAndDescriptionText}>
                  Description: {this.props.queue.queue_description}
                </Text>
              </View>
              <View style={styles.queueNumberContainer}>
                <Text style={styles.queueNumberText}>Your Queue Number:</Text>
                <Text style={styles.queueNumberQueueText}>
                  No. {this.props.queue.queue_queueNumber}
                </Text>
              </View>
              <View style={styles.estimationContainer}>
                <Text style={styles.estimationTitleText}>
                  You waiting length:
                </Text>
                <Text style={styles.estimationText}>
                  {this.props.queue.queue_waitingLength}
                </Text>
                <Text style={styles.estimationTitleText}>
                  Estimated waiting time:
                </Text>
                <Text style={styles.estimationText}>
                  {this.props.queue.queue_estimatedWaitingTime}
                </Text>
              </View>
            </View>
            <View style={styles.buttonConatienr}>
              <QueueButton
                text="Done"
                onPress={() => RootNavigation.navigate('Home')}
              />
            </View>
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
  queueInfoContainer: {
    marginHorizontal: 10,
    marginVertical: 15,
    marginTop: 20,
  },
  imageContainer: {
    width: 110,
    height: 110,
    borderRadius: 10,
    alignSelf: 'center',
  },
  imageStyle: {
    width: 110,
    height: 110,
    borderRadius: 10,
    // shadowOpacity: 5,
    // elevation: 5,
  },
  textContainer: {
    marginTop: 5,
    alignSelf: 'center',
    alignItems: 'center',
    marginHorizontal: 20,
  },
  shopNameText: {
    fontFamily: 'Montserrat-Bold',
    fontSize: 20,
  },
  branchText: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 16,
    marginTop: 5,
  },
  activityAndDescriptionContainer: {
    alignItems: 'center',
    marginTop: 12,
  },
  activityAndDescriptionText: {
    fontFamily: 'Montserrat-Light',
    fontSize: 13,
    // marginVertical: 2,
  },
  queueNumberContainer: {
    marginTop: 10,
    alignItems: 'center',
  },
  queueNumberText: {
    fontFamily: 'Montserrat-Medium',
    fontSize: 18,
  },
  queueNumberQueueText: {
    fontFamily: 'Montserrat-Bold',
    fontSize: 18,
  },
  estimationContainer: {
    alignItems: 'center',
    marginVertical: 16,
  },
  estimationTitleText: {
    fontFamily: 'Montserrat-Medium',
    fontSize: 18,
  },
  estimationText: {
    fontFamily: 'Montserrat-Bold',
    fontSize: 18,
  },
  buttonConatienr: {
    // alignSelf: 'center',
  },
});
const mapStateToProps = state => {
  return {
    queue: state.queue.queue,
    shopStatus: state.queue.shopStatus,
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
    fetchCustomerActiveQueues,
    fetchCustomerCompletedQueues,
    ioUpdateCusomterActiveQueue,
  },
)(QueuedSuccessfulScreen);

// export default QueuedSuccessfulScreen;
