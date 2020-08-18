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
  BackHandler,
} from 'react-native';

import QueueButton from '../components/buttons/QueueButton';
import {Picker} from '@react-native-community/picker';

import {
  removeJWT,
  removeUserId,
  removeShopId,
  removeUserRole,
} from '../asyncStorage';

import {connect} from 'react-redux';
import {
  registerEmailChanged,
  registerPasswordChanged,
  registerConfirmPasswordChanged,
  registerNameChanged,
  createhUser,
  fetchUserById,
  allShopActivitiesChanged,
  availableActivitiesChanged,
  currenlyServingActivitiesChanged,
  selectStartActivityChanged,
  selectStopActivityChanged,
  updateStartStopServing,
  registerEmailInvalidChanged,
  registerPasswordInvalidChanged,
  registerConfirmPasswordInvalidChanged,
  registerNameInalidChanged,
} from '../redux/action/authAction';
import {fetchShopActivities} from '../redux/action/queueAction';

import * as RootNavigation from '../RootNavigation';

class OthersScreen extends Component {
  constructor(props) {
    super(props);
  }

  validateEmail = (email) => {
    var regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return regex.test(email);
  };

  async componentDidMount() {
    console.log('other screen jwt:', this.props.jwt);

    await this.props.fetchUserById(this.props.userId);
    const currentlyServingId = this.props.user.user_servingShopActivityId;
    await this.props.fetchShopActivities({
      shopId: this.props.shopId,
      stage: 0,
    });
    const allShopActivities = this.props.shopActivities;
    let currentlyServingActivities = [];
    let otherAvailableActivities = [];
    if (!currentlyServingId) {
      currentlyServingId = [];
    }

    currentlyServingActivities = allShopActivities.filter((allId) =>
      currentlyServingId.includes(allId._id),
    );
    otherAvailableActivities = allShopActivities.filter(
      (allId) => !currentlyServingId.includes(allId._id),
    );

    await this.props.allShopActivitiesChanged(allShopActivities);
    await this.props.currenlyServingActivitiesChanged(
      currentlyServingActivities,
    );
    await this.props.availableActivitiesChanged(otherAvailableActivities);

    await this.props.selectStopActivityChanged(
      this.props.currentlyServingActivities[0],
    );
    await this.props.selectStartActivityChanged(
      this.props.availableShopActivities[0],
    );
  }

  render() {
    const availableShopActivities = this.props.availableShopActivities.map(
      (activity) => (
        <Picker.Item
          label={activity.shopActivity_activity}
          value={activity}
          key={activity._id}
        />
      ),
    );

    const currentlyServingActivities = this.props.currentlyServingActivities.map(
      (activity) => (
        <Picker.Item
          label={activity.shopActivity_activity}
          value={activity}
          key={activity._id}
        />
      ),
    );

    const currentlyServingActivitiesName = this.props.currentlyServingActivities.map(
      (activity) => (
        <Text
          style={styles.questionText}
          key={this.props.currentlyServingActivities._id}>
          {activity.shopActivity_activity}
        </Text>
      ),
    );

    return (
      <SafeAreaView style={styles.mainContainer}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.titleContainer}>
            <Text style={styles.titleText}>Others</Text>
            <TouchableOpacity
              style={styles.signoutText}
              onPress={() => {
                removeJWT();
                removeUserId();
                removeShopId();
                removeUserRole();
                // RootNavigation.navigate('Login');
                BackHandler.exitApp();
              }}>
              <Text style={styles.signoutText}>Sign Out</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.contentContainer}>
            <View style={styles.signUpContainer}>
              <Text style={styles.subTitleText}>Your Responsibility</Text>
              {currentlyServingActivitiesName}
            </View>
            {this.props.availableShopActivities.length > 0 ? (
              <>
                <View style={styles.signUpContainer}>
                  <Text style={styles.subTitleText}>
                    Start Serving An Activity
                  </Text>
                  <Picker
                    selectedValue={this.props.selectStartActivity}
                    // style={{height: 50, width: 100}}
                    onValueChange={(itemValue, itemIndex) =>
                      this.props.selectStartActivityChanged(itemValue)
                    }>
                    {availableShopActivities}
                  </Picker>
                  <QueueButton
                    text="Start"
                    onPress={() => {
                      console.log(
                        'onpress add -act:',
                        this.props.selectStartActivity,
                      );
                      console.log(
                        'onpress add -id:',
                        this.props.selectStartActivity._id,
                      );
                      this.props.updateStartStopServing({
                        jwt: this.props.jwt,
                        shopId: this.props.shopId,
                        action: 'add',
                        activityId: this.props.selectStartActivity._id,
                      });
                    }}
                  />
                </View>
              </>
            ) : (
              <></>
            )}
            {this.props.currentlyServingActivities.length > 0 ? (
              <>
                <View style={styles.signUpContainer}>
                  <Text style={styles.subTitleText}>
                    Stop Serving An Activity
                  </Text>
                  <Picker
                    selectedValue={this.props.selectStopActivity}
                    // style={{height: 50, width: 100}}
                    onValueChange={(itemValue, itemIndex) =>
                      this.props.selectStopActivityChanged(itemValue)
                    }>
                    {currentlyServingActivities}
                  </Picker>
                  <QueueButton
                    text="Stop"
                    onPress={() =>
                      this.props.updateStartStopServing({
                        jwt: this.props.jwt,
                        shopId: this.props.shopId,
                        action: 'minus',
                        activityId: this.props.selectStopActivity._id,
                      })
                    }
                  />
                </View>
              </>
            ) : (
              <></>
            )}
            {this.props.user.user_role == 'owner' ? (
              <>
                <View style={styles.signUpContainer}>
                  <Text style={styles.subTitleText}>Create Staff Account</Text>
                  <Text style={styles.questionText}>Staff E-mail:</Text>
                  <TextInput
                    style={styles.answerText}
                    autoCapitalize="none"
                    autoCorrect={false}
                    autoCompleteType="off"
                    secureTextEntry={false}
                    placeholder="staff1@gmail.com"
                    onChangeText={async (text) => {
                      await this.props.registerEmailChanged(text);
                      if (!this.validateEmail(this.props.register_email)) {
                        this.props.registerEmailInvalidChanged(
                          'Invalid Email Format',
                        );
                      } else {
                        this.props.registerEmailInvalidChanged('');
                      }
                    }}
                    value={this.props.register_email}
                    // placeholderTextColor={}
                    // selectionColor={}
                    // // underlineColorAndroid={}
                    // onFocus={}
                  />
                  <Text style={styles.errorText}>
                    {this.props.register_email_inValid}
                  </Text>
                  <Text style={styles.questionText}>Password:</Text>
                  <TextInput
                    style={styles.answerText}
                    autoCapitalize="none"
                    autoCorrect={false}
                    autoCompleteType="off"
                    secureTextEntry={true}
                    placeholder="password"
                    onChangeText={async (text) => {
                      await this.props.registerPasswordChanged(text);
                      if (this.props.register_password.length < 8) {
                        this.props.registerPasswordInvalidChanged(
                          'Password must have aleast 8 characters',
                        );
                      } else {
                        this.props.registerPasswordInvalidChanged('');
                      }
                    }}
                    value={this.props.register_password}
                    // placeholderTextColor={}
                    // selectionColor={}
                    // // underlineColorAndroid={}
                    // onFocus={}
                  />
                  <Text style={styles.errorText}>
                    {this.props.register_password_inValid}
                  </Text>
                  <Text style={styles.questionText}>Confirm Password:</Text>
                  <TextInput
                    style={styles.answerText}
                    autoCapitalize="none"
                    autoCorrect={false}
                    autoCompleteType="off"
                    secureTextEntry={true}
                    placeholder="confirm password"
                    onChangeText={async (text) => {
                      await this.props.registerConfirmPasswordChanged(text);
                      if (
                        this.props.register_confirmPassword !=
                        this.props.register_password
                      ) {
                        this.props.registerConfirmPasswordInvalidChanged(
                          'Confirm password does not match with password',
                        );
                      } else {
                        this.props.registerConfirmPasswordInvalidChanged('');
                      }
                    }}
                    value={this.props.register_confirmPassword}
                    // placeholderTextColor={}
                    // selectionColor={}
                    // // underlineColorAndroid={}
                    // onFocus={}
                  />
                  <Text style={styles.errorText}>
                    {this.props.register_confirmPassword_inValid}
                  </Text>
                  <Text style={styles.questionText}>Name:</Text>
                  <TextInput
                    style={styles.answerText}
                    autoCapitalize="none"
                    autoCorrect={false}
                    autoCompleteType="off"
                    secureTextEntry={false}
                    placeholder="staff1"
                    onChangeText={(text) => {
                      this.props.registerNameChanged(text);
                    }}
                    value={this.props.register_name}
                    // placeholderTextColor={}
                    // selectionColor={}
                    // // underlineColorAndroid={}
                    // onFocus={}
                  />
                  <Text style={styles.errorText}>
                    {this.props.register_name_inValid}
                  </Text>
                  <View style={styles.createButtonContainer}>
                    <QueueButton
                      text="Create"
                      onPress={() => {
                        if (
                          this.props.register_email_inValid != '' ||
                          this.props.register_password_inValid != '' ||
                          this.props.register_confirmPassword_inValid != '' ||
                          this.props.register_name_inValid != ''
                        ) {
                        } else {
                          this.props.createhUser({
                            email: this.props.register_email,
                            password: this.props.register_password,
                            name: this.props.register_name,
                            role: 'staff',
                            shopId: this.props.shopId,
                          });
                        }
                      }}
                    />
                    <Text style={styles.errorText}>
                      {this.props.register_Error}
                    </Text>
                  </View>
                </View>
              </>
            ) : (
              <></>
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
    marginHorizontal: 15,
  },
  titleContainer: {
    // alignSelf: 'flex-start',
    marginTop: 15,
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
  contentContainer: {
    marginVertical: 0,
    alignSelf: 'stretch',
  },
  signUpContainer: {
    borderRadius: 10,
    elevation: 1,
    paddingHorizontal: 6,
    paddingVertical: 5,
    marginVertical: 10,
  },
  subTitleText: {
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 18,
    marginBottom: 10,
  },
  questionText: {
    fontFamily: 'Montserrat-Light',
    fontSize: 14,
    marginVertical: 3,
    marginLeft: 15,
  },
  answerText: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 14,
    // borderWidth: 1,
    height: 40,
    // backgroundColor: 'rgba(255,255,255,0.4)', // 40% opaque
    backgroundColor: 'rgba(0,0,0,0.1)', // 40% opaque
    borderRadius: 40,
    paddingHorizontal: 15,
    marginTop: 1,
  },
  errorText: {
    color: 'red',
    fontSize: 14,
    fontFamily: 'Montserrat-Italic',
    marginBottom: 10,
    marginLeft: 10,
  },
  createButtonContainer: {
    marginVertical: 15,
  },
});

const mapStateToProps = (state) => {
  return {
    register_email: state.auth.register_email,
    register_password: state.auth.register_password,
    register_confirmPassword: state.auth.register_confirmPassword,
    register_name: state.auth.register_name,
    register_Error: state.auth.register_Error,
    loading: state.auth.loading,
    isFetching: state.auth.isFetching,
    user: state.auth.user,
    shopId: state.auth.shopId,
    userId: state.auth.userId,
    userRole: state.auth.userRole,
    shopActivities: state.queue.shopActivities,
    allShopActivities: state.auth.allShopActivities,
    availableShopActivities: state.auth.availableShopActivities,
    currentlyServingActivities: state.auth.currentlyServingActivities,
    selectStartActivity: state.auth.selectStartActivity,
    selectStopActivity: state.auth.selectStopActivity,
    jwt: state.auth.jwt,
    register_email_inValid: state.auth.register_email_inValid,
    register_password_inValid: state.auth.register_password_inValid,
    register_confirmPassword_inValid:
      state.auth.register_confirmPassword_inValid,
    register_name_inValid: state.auth.register_name_inValid,
  };
};

export default connect(mapStateToProps, {
  registerEmailChanged,
  registerPasswordChanged,
  registerConfirmPasswordChanged,
  registerNameChanged,
  createhUser,
  fetchShopActivities,
  fetchUserById,
  allShopActivitiesChanged,
  availableActivitiesChanged,
  currenlyServingActivitiesChanged,
  selectStartActivityChanged,
  selectStopActivityChanged,
  updateStartStopServing,
  registerEmailInvalidChanged,
  registerPasswordInvalidChanged,
  registerConfirmPasswordInvalidChanged,
  registerNameInalidChanged,
})(OthersScreen);
// export default OthersScreen;
