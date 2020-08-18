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

import * as RootNavigation from '../RootNavigation';

import {connect} from 'react-redux';
import {removeJWT} from '../asyncStorage';
import {removeJwt} from '../redux/action/authAction';

class ProfileScreen extends Component {
  render() {
    return (
      <SafeAreaView style={styles.mainContainer}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.titleContainer}>
            <Text style={styles.titleText}>Profile</Text>
            <TouchableOpacity
              style={styles.signoutText}
              onPress={() => {
                removeJWT();
                removeJwt();
                RootNavigation.navigate('Login');
              }}>
              <Text style={styles.signoutText}>Sign Out</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.notificationContainer}>
            <Text>notificationContainer</Text>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  titleText: {
    fontFamily: 'Montserrat-Bold',
    fontSize: 24,
    color: '#8E54E9',
  },
  signoutText: {
    fontFamily: 'Montserrat-MediumItalic',
    fontSize: 14,
    color: '#8E54E9',
    alignSelf: 'flex-end',
  },
  notificationContainer: {
    marginTop: 10,
    borderWidth: 1,
    marginHorizontal: 10,
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
    removeJwt,
  },
)(ProfileScreen);

// export default ProfileScreen;
