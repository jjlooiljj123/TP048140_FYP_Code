import React, {Component} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  Image,
  TouchableOpacity,
  TextInput,
} from 'react-native';

import TopBgColor from '../components/backgroundCard/topBgColor';
// import ActiveQueueCard from '../components/cards/ActiveQueueCard';
import EmptyActiveQueueCard from '../components/cards/EmptyActiveQueueCard';

import QueueList from '../components/lists/QueueList';

import * as RootNavigation from '../RootNavigation';

import {
  retrieveJWT,
  retrieveUserRole,
  retrieveUserId,
  retrieveShopId,
} from '../asyncStorage';

import {connect} from 'react-redux';
import {
  updateJwt,
  updateUserRole,
  updateShopId,
  updateUserId,
} from '../redux/action/authAction';
import {
  fetchCurrentlyServingQueues,
  fetchQueuingQueues,
  fetchStageOneQueues,
} from '../redux/action/queueAction';
import {
  updateClearQueueTime,
  timeToClearQueueChanged,
  fetchingShopStatus,
  updateServerRequriedIO,
} from '../redux/action/shopStatusAction';

import openSocket from 'socket.io-client';
import baseServerURL from '../baseServerURL';
import Icon from 'react-native-vector-icons/FontAwesome';

class HomeScreen extends Component {
  async componentDidMount() {
    const jwt = await retrieveJWT();
    const userRole = await retrieveUserRole();
    const userId = await retrieveUserId();
    const shopId = await retrieveShopId();

    if (shopId == null || shopId == '') {
      console.log('no shop foudn on home page');
      RootNavigation.navigate('CreateShopInfo');
    }

    // await

    this.props.updateJwt(jwt);
    this.props.updateUserRole(userRole);
    this.props.updateUserId(userId);
    this.props.updateShopId(shopId);
    console.log('componentdidmount home');
    await this.props.fetchCurrentlyServingQueues({
      shopId: this.props.shopId,
      jwt: this.props.jwt,
    });
    await this.props.fetchQueuingQueues({
      shopId: this.props.shopId,
      jwt: this.props.jwt,
    });
    await this.props.fetchStageOneQueues({
      shopId: this.props.shopId,
      jwt: this.props.jwt,
    });

    await this.props.fetchingShopStatus(this.props.shopId);
    console.log(
      'after fetching shopstatus',
      this.props.timeToClearQueueTextInput,
    );

    if (this.props.shopStatus.shop_hasQueuePlan == false) {
      console('no queue plan foudn on home page');
      RootNavigation.navigate('CreateQueuePlan');
    }

    // socket
    const socket = openSocket(baseServerURL);
    socket.on('queues', (data) => {
      if (
        data.action == 'update'
        // && data.shopStatus._id == this.props.shopId
      ) {
        console.log('trigger home io update');
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
        data.action == 'create'
        // &&
        // data.shopStatus._id == this.props.shopId
      ) {
        console.log('trigger home io create');
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
    socket.on('serversWarning', (data) => {
      console.log('socket io serversWarning called', data.extraNumberNeeded);

      if (data.shopId == this.props.shopId) {
        this.props.updateServerRequriedIO(
          data.numberOfServerNeeded,
          data.extraNumberNeeded,
          data.isNewServerNeeded,
        );
      }
    });
  }
  render() {
    return (
      <SafeAreaView style={styles.mainContainer}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.topBgColorContainer}>
            <TopBgColor>
              <View style={styles.topContainer}>
                <Text style={styles.pageTitleText}>All Active Queue!</Text>
              </View>
            </TopBgColor>
            <View style={styles.topContentContainer}>
              <View style={styles.serverNeededContainer}>
                <Text style={styles.topContentContainerTextInputText}>
                  Time to clear stage 1 queue (min)
                </Text>
                <View style={styles.serverNeededTextInputContainer}>
                  <TextInput
                    style={styles.serverNeededTextInput}
                    keyboardType="numeric"
                    placeholder="1"
                    // clearTextOnFocus={true}
                    onChangeText={(text) => {
                      this.props.timeToClearQueueChanged(Number(text));
                      // console.log(
                      //   'after',
                      //   this.props.timeToClearQueueTextInput,
                      // );
                      // this.props.updateClearQueueTime({
                      //   shopId: this.props.shopId,
                      //   time: this.props.timeToClearQueueTextInput,
                      //   jwt: this.props.jwt,
                      // });
                    }}
                    value={this.props.timeToClearQueueTextInput.toString()}
                  />
                  <TouchableOpacity
                    onPress={() => {
                      // console.log(
                      //   'this.props.timeToClearQueueTextInput',
                      //   this.props.timeToClearQueueTextInput,
                      // );
                      this.props.updateClearQueueTime({
                        shopId: this.props.shopId,
                        time: this.props.timeToClearQueueTextInput,
                        jwt: this.props.jwt,
                      });
                    }}>
                    <Icon name="arrow-right" size={20} color="#8E54E9" />
                  </TouchableOpacity>
                </View>
                {/* <TouchableOpacity>
                  <Icon name="arrow-right" size={20} color="#8E54E9" />
                </TouchableOpacity> */}
              </View>
              <View style={styles.shopInfoContainer}>
                {/* <Text style={styles.topContentContainerTitleText}>
                  Stage 1 queues:{' '}
                  {this.props.shopStatus.shopStatus_stageOneQueueLength}
                </Text>
                <Text style={styles.topContentContainerTitleText}>
                  All queues: {this.props.shopStatus.shopStatus_queueLength}
                </Text> */}
                {/* <Text style={styles.topContentContainerTitleText}>
                  Number of Servers: {this.props.shopStatus.shopStatus_queueLength}:::::{dsa]]d[as]]]]]]]}::::::sadasd
                </Text> */}
                <Text style={styles.topContentContainerTitleText}>
                  number of extra servers needed: {this.props.extraNumberNeeded}
                </Text>
              </View>
            </View>
          </View>
          <View style={styles.contentContainer}>
            <Text style={styles.contentTitleText}>
              Currently Serving: {this.props.currentlyServingQueues.length}{' '}
              Customers
            </Text>
            {/* <ActiveQueueCard /> */}
            {this.props.isFetchingCurrentlyServing ? (
              <EmptyActiveQueueCard />
            ) : this.props.currentlyServingQueues.length > 0 ? (
              <QueueList results={this.props.currentlyServingQueues} />
            ) : (
              <EmptyActiveQueueCard />
            )}

            <Text style={styles.contentTitleText}>
              Stage 1 Queuing: {this.props.stageOneQueues.length} Customers
            </Text>
            {/* <ActiveQueueCard /> */}
            {this.props.isFetchingStageOne ? (
              <Text>Loading...</Text>
            ) : this.props.stageOneQueues.length > 0 ? (
              <QueueList results={this.props.stageOneQueues} />
            ) : (
              <EmptyActiveQueueCard />
            )}
            <Text style={styles.contentTitleText}>
              All Queuing: {this.props.queuingQueues.length} Customers
            </Text>
            {/* <ActiveQueueCard /> */}
            {this.props.isFetchingQueuing ? (
              <Text>Loading...</Text>
            ) : this.props.queuingQueues.length > 0 ? (
              <QueueList results={this.props.queuingQueues} />
            ) : (
              <EmptyActiveQueueCard />
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
  topBgColorContainer: {
    // alignSelf: 'stretch',
    // alignItems: 'stretch',
    // position: 'absolute',
    // height: 300,
  },
  topContainer: {
    alignItems: 'center',
    flex: 1,
  },
  pageTitleText: {
    color: 'white',
    fontSize: 24,
    // fontFamily: 'sans-serif-medium',
    fontFamily: 'Montserrat-Bold',
    marginTop: 15,
    marginBottom: 15,
    // borderWidth: 1,
    top: 5,
  },
  topContentContainer: {
    // alignItems: 'center',
    elevation: 1,
    borderRadius: 40,
    flex: 1,
    padding: 10,
    marginVertical: 10,
    marginHorizontal: 15,
  },
  serverNeededContainer: {
    // backgroundColor: 'white',
    // marginTop: 10,
    // borderRadius: 40,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    paddingHorizontal: 15,
    alignItems: 'center',
  },
  serverNeededTextInputContainer: {
    backgroundColor: 'white',
    paddingVertical: 0,
    borderRadius: 40,
    paddingHorizontal: 15,
    flex: 2,
    alignSelf: 'stretch',
    height: 40,
    paddingHorizontal: 5,
    alignItems: 'center',
    justifyContent: 'space-between',
    marginLeft: 5,
    paddingRight: 15,
    flexDirection: 'row',
    // borderWidth: 1,
  },
  serverNeededTextInput: {
    backgroundColor: 'white',
    height: 40,
    fontFamily: 'Montserrat-Medium',
    fontSize: 14,
    borderRadius: 40,
    textAlign: 'center',
    flex: 4,
  },
  topContentContainerTextInputText: {
    fontFamily: 'Montserrat-Medium',
    fontSize: 12,
  },
  shopInfoContainer: {
    marginHorizontal: 15,
  },
  topContentContainerTitleText: {
    // color: 'white',
    fontSize: 14,
    fontFamily: 'Montserrat-Italic',
  },
  contentContainer: {
    marginVertical: 5,
  },
  contentTitleText: {
    marginLeft: 15,
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 16,
  },
});

const mapStateToProps = (state) => {
  return {
    jwt: state.auth.jwt,
    userId: state.auth.userId,
    shopId: state.auth.shopId,
    userRole: state.auth.userRole,
    isFetchingCurrentlyServing: state.queue.isFetchingCurrentlyServing,
    currentlyServingQueues: state.queue.currentlyServingQueues,
    numberOfCurrentlyServingQueues: state.queue.numberOfCurrentlyServingQueues,
    fetchingCurrentlyServingQueuesError:
      state.queue.fetchingCurrentlyServingQueuesError,
    isFetchingQueuing: state.queue.isFetchingQueuing,
    queuingQueues: state.queue.queuingQueues,
    numberOfQueuingQueues: state.queue.numberOfQueuingQueues,
    fetchingQueuingQueuesError: state.queue.fetchingQueuingQueuesError,
    isFetchingStageOne: state.queue.isFetchingStageOne,
    stageOneQueues: state.queue.stageOneQueues,
    numberOfStageOneQueues: state.queue.numberOfStageOneQueues,
    fetchingStageOneQueuesError: state.queue.fetchingStageOneQueuesError,
    isFetchingShopStatus: state.shopStatus.isFetchingShopStatus,
    shopStatus: state.shopStatus.shopStatus,
    fetchingShopStatusError: state.shopStatus.fetchingShopStatusError,
    timeToClearQueueTextInput: state.shopStatus.timeToClearQueueTextInput,
    isNewServerNeeded: state.shopStatus.isNewServerNeeded,
    numberOfServerNeeded: state.shopStatus.numberOfServerNeeded,
    extraNumberNeeded: state.shopStatus.extraNumberNeeded,
    isUpdatingClearQueueTime: state.shopStatus.isUpdatingClearQueueTime,
    updatingClearQueueTimeError: state.shopStatus.updatingClearQueueTimeError,
  };
};

export default connect(mapStateToProps, {
  updateJwt,
  updateUserRole,
  updateShopId,
  updateUserId,
  fetchCurrentlyServingQueues,
  fetchQueuingQueues,
  fetchStageOneQueues,
  updateClearQueueTime,
  timeToClearQueueChanged,
  fetchingShopStatus,
  updateServerRequriedIO,
})(HomeScreen);

// export default HomeScreen;
