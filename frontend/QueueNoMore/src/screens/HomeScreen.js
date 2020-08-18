import React, {Component} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  Image,
  TouchableOpacity,
  BackHandler,
} from 'react-native';

import TopBgColor from '../components/backgroundCard/topBgColor';
import Logo from '../../assets/images/Qbutton.png';

import EmptyHistoryQueueCard from '../components/cards/EmptyHistoryQueueCard';
import EmptyCurrentQueueCard from '../components/cards/EmptyCurrentQueueCard';
import SearchBarPicture from '../components/searchBars/SearchBarPicture';

import CurrentQueueList from '../components/Lists/CurrrentQueueList';
import HistoryQueueList from '../components/Lists/HistoryQueueList';

import * as RootNavigation from '../RootNavigation';

import {retrieveJWT, removeJWT} from '../asyncStorage';

import {connect} from 'react-redux';
import {updateJwt, removeJwt} from '../redux/action/authAction';
import {
  fetchCustomerActiveQueues,
  fetchCustomerCompletedQueues,
  ioUpdateCusomterActiveQueue,
} from '../redux/action/queueAction';

import openSocket from 'socket.io-client';
import baseServerURL from '../baseServerURL';

class HomeScreen extends Component {
  async componentDidMount() {
    const jwt = await retrieveJWT();
    await this.props.updateJwt(jwt);
    console.log('jwt home', jwt);
    await this.props.fetchCustomerActiveQueues(this.props.jwt);
    await this.props.fetchCustomerCompletedQueues(this.props.jwt);

    const socket = openSocket(baseServerURL);
    socket.on('queues', data => {
      if (data.action == 'updateBehind') {
        for (let i = 0; i < this.props.customerActiveQueues.length; i++) {
          if (this.props.customerActiveQueues[i]._id == data.queueId) {
            this.props.ioUpdateCusomterActiveQueue(
              this.props.customerActiveQueues,
              data.queue,
            );
            console.log('io home - updateBehind');
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
          console.log('io home - update');
        }
      }
    });
    socket.on('cron', data => {
      for (let i = 0; i < this.props.customerActiveQueues.length; i++) {
        if (data.queueId == this.props.customerActiveQueues[i]._id) {
          // update queue waiting time
          this.props.ioUpdateCusomterActiveQueue(
            this.props.customerActiveQueues,
            data.queue,
          );
        }
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
                <Text style={styles.searchBarTitle}>Join Your Queue Now!</Text>
              </View>
              <TouchableOpacity
                onPress={() => RootNavigation.navigate('SearchShop')}>
                <View style={styles.searchBarContainer}>
                  {/* <SearchBar placeholder="Search" /> */}
                  <SearchBarPicture placeholder="Search" />
                </View>
              </TouchableOpacity>
            </TopBgColor>
          </View>
          <View style={styles.contentContainer}>
            <View style={styles.signOutContainer}>
              <TouchableOpacity
                style={styles.signoutText}
                onPress={() => {
                  removeJWT();
                  removeJwt();
                  // RootNavigation.navigate('Login');
                  BackHandler.exitApp();
                }}>
                <Text style={styles.signoutText}>Sign Out</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.textTitleContainer}>
              <Text style={styles.textTitleText}>Your Currrent Queue!</Text>
            </View>
            {this.props.activeQueueIsFecthing ? (
              <Text>loading...</Text>
            ) : this.props.customerActiveQueues.length > 0 ? (
              <CurrentQueueList results={this.props.customerActiveQueues} />
            ) : (
              <EmptyCurrentQueueCard />
            )}
            <View style={styles.textTitleContainer}>
              <Text style={styles.textTitleText}>Your Queue History</Text>
            </View>
            {this.props.completedQueueIsFecthing ? (
              <Text>loading...</Text>
            ) : this.props.customerCompletedQueues.length > 0 ? (
              <View style={styles.historyCardContainer}>
                <HistoryQueueList
                  results={this.props.customerCompletedQueues}
                />
              </View>
            ) : (
              <View style={styles.historyCardContainer}>
                <EmptyHistoryQueueCard />
              </View>
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
  searchBarTitle: {
    color: 'white',
    fontSize: 24,
    // fontFamily: 'sans-serif-medium',
    fontFamily: 'Montserrat-Bold',
    marginTop: 25,
    // borderWidth: 1,
    top: 5,
  },
  searchBarContainer: {
    // alignItems: 'center',
    // borderWidth: 1,
    marginHorizontal: 10,
    marginBottom: 15,
    // top: 25,
    marginTop: 25,
    elevation: 1,
  },
  contentContainer: {
    marginVertical: 5,
    // flex: 1,
    // marginLeft: 15,
    // paddingLeft: 15,
  },
  signOutContainer: {
    alignSelf: 'flex-end',
    // marginHorizontal: 25,
    marginTop: 5,
    paddingRight: 25,
    position: 'absolute',
    // borderWidth: 1,
  },
  signoutText: {
    fontFamily: 'Montserrat-MediumItalic',
    fontSize: 14,
    color: '#8E54E9',
    alignSelf: 'flex-end',
  },
  textTitleText: {
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 16,
  },
  textTitleContainer: {
    marginLeft: 15,
    marginTop: 10,
  },

  historyCardContainer: {
    // alignItems: 'center',
    flex: 1,
    alignItems: 'stretch',
    marginHorizontal: 15,
  },
});

const mapStateToProps = state => {
  return {
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
    updateJwt,
    fetchCustomerActiveQueues,
    fetchCustomerCompletedQueues,
    ioUpdateCusomterActiveQueue,
    removeJwt,
  },
)(HomeScreen);

// export default HomeScreen;
