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

import {connect} from 'react-redux';
import {
  registerEmailChanged,
  registerPasswordChanged,
  registerConfirmPasswordChanged,
  registerNameChanged,
  createhUser,
  registerEmailInvalidChanged,
  registerPasswordInvalidChanged,
  registerConfirmPasswordInvalidChanged,
  registerNameInalidChanged,
} from '../redux/action/authAction';

import BgColor from '../components/backgroundCard/bgColor';
import AuthInput from '../components/inputs/AuthInput';
import AuthButton from '../components/buttons/authButton';

class RegisterScreen extends Component {
  constructor(props) {
    super(props);
  }

  validateEmail = email => {
    var regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return regex.test(email);
  };

  render() {
    return (
      <BgColor>
        <SafeAreaView style={styles.mainContainer}>
          <ScrollView contentContainerStyle={styles.scrollContainer}>
            <View style={styles.titleContainer}>
              <Text style={styles.titleText}>Sign Up</Text>
            </View>
            <View style={styles.inputContainer}>
              <AuthInput
                placeholder="Email"
                value={this.props.register_email}
                placeholderTextColor="white"
                selectionColor="white"
                underlineColorAndroid={true ? 'white' : 'grey'}
                onChangeText={async text => {
                  await this.props.registerEmailChanged(text);
                  if (!this.validateEmail(this.props.register_email)) {
                    this.props.registerEmailInvalidChanged(
                      'Invalid Email Format',
                    );
                  } else {
                    this.props.registerEmailInvalidChanged('');
                  }
                }}
                secureTextEntry={false}
              />
              <Text style={styles.errorText}>
                {this.props.register_email_inValid}
              </Text>
              <AuthInput
                placeholder="Password"
                value={this.props.register_password}
                placeholderTextColor="white"
                selectionColor="white"
                underlineColorAndroid={true ? 'white' : 'grey'}
                onChangeText={async text => {
                  await this.props.registerPasswordChanged(text);
                  if (this.props.register_password.length < 8) {
                    this.props.registerPasswordInvalidChanged(
                      'Password must have aleast 8 characters',
                    );
                  } else {
                    this.props.registerPasswordInvalidChanged('');
                  }
                }}
                secureTextEntry={true}
              />
              <Text style={styles.errorText}>
                {this.props.register_password_inValid}
              </Text>
              <AuthInput
                placeholder="Confirm Password"
                value={this.props.register_confirmPassword}
                placeholderTextColor="white"
                selectionColor="white"
                underlineColorAndroid={true ? 'white' : 'grey'}
                onChangeText={async text => {
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
                secureTextEntry={true}
              />
              <Text style={styles.errorText}>
                {this.props.register_confirmPassword_inValid}
              </Text>
              <AuthInput
                placeholder="Name"
                value={this.props.register_name}
                placeholderTextColor="white"
                selectionColor="white"
                underlineColorAndroid={true ? 'white' : 'grey'}
                onChangeText={async text => {
                  await this.props.registerNameChanged(text);
                }}
                secureTextEntry={false}
              />
              <Text style={styles.errorText}>
                {this.props.register_name_inValid}
              </Text>
            </View>
            <View style={styles.buttonContainer}>
              <AuthButton
                text="Sign Up"
                disabled={
                  this.props.register_email_inValid != '' ||
                  this.props.register_password_inValid != '' ||
                  this.props.register_confirmPassword_inValid != '' ||
                  this.props.register_name_inValid != ''
                    ? true
                    : false
                }
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
                    });
                  }
                }}
              />
              <Text style={styles.errorText}>{this.props.register_Error}</Text>
              <View style={styles.touchableContainer}>
                <TouchableOpacity
                  style={styles.signinButtonContainer}
                  onPress={() => this.props.navigation.navigate('Login')}>
                  <Text style={styles.signinButtonText}>
                    Already have an account? Sign In here!
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </SafeAreaView>
      </BgColor>
    );
  }
}

RegisterScreen.navigationOptions = {
  headerShown: false,
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    alignItems: 'center',
    marginHorizontal: 20,
  },
  titleContainer: {
    alignSelf: 'flex-start',
    marginTop: 20,
  },
  titleText: {
    color: 'white',
    fontSize: 30,
    fontWeight: 'bold',
    // fontFamily: 'sans-serif',
    fontFamily: 'Montserrat-Regular',
  },
  inputContainer: {
    alignSelf: 'stretch',
    marginTop: 20,
    // borderWidth: 1,
  },
  errorText: {
    color: 'white',
    fontSize: 14,
    fontFamily: 'Montserrat-Italic',
    marginBottom: 10,
    marginLeft: 10,
  },
  buttonContainer: {
    alignSelf: 'stretch',
    paddingTop: 14,
  },
  touchableContainer: {
    // flexDirection: 'row',
    // justifyContent: 'space-between',
  },
  signinButtonContainer: {
    marginTop: 5,
    paddingVertical: 5,
    paddingRight: 10,
    alignSelf: 'flex-start',
  },
  signinButtonText: {
    color: 'white',
    // fontStyle: 'italic',
    // fontFamily: 'sans-serif',
    fontFamily: 'Montserrat-Regular',
  },
});

const mapStateToProps = state => {
  return {
    register_email: state.auth.register_email,
    register_password: state.auth.register_password,
    register_confirmPassword: state.auth.register_confirmPassword,
    register_name: state.auth.register_name,
    register_Error: state.auth.register_Error,
    loading: state.auth.loading,
    isCreating: state.auth.isCreating,
    user: state.auth.user,
    register_email_inValid: state.auth.register_email_inValid,
    register_password_inValid: state.auth.register_password_inValid,
    register_confirmPassword_inValid:
      state.auth.register_confirmPassword_inValid,
    register_name_inValid: state.auth.register_name_inValid,
  };
};

export default connect(
  mapStateToProps,
  {
    registerEmailChanged,
    registerPasswordChanged,
    registerConfirmPasswordChanged,
    registerNameChanged,
    createhUser,
    registerEmailInvalidChanged,
    registerPasswordInvalidChanged,
    registerConfirmPasswordInvalidChanged,
    registerNameInalidChanged,
  },
)(RegisterScreen);
