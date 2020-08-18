import React, {Component, useState} from 'react';
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
  loginEmailChanged,
  loginPasswordChanged,
  fetchUser,
  loginEmailInvalidChanged,
  loginPasswordInvalidChanged,
} from '../redux/action/authAction';

import BgColor from '../components/backgroundCard/bgColor';
import Logo from '../../assets/images/Qbutton.png';
import AuthInput from '../components/inputs/AuthInput';
import AuthButton from '../components/buttons/authButton';

import * as RootNavigation from '../RootNavigation';

class LoginScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      emailPlaceHolder: 'Email',
      passwordPlaceHolder: 'Password',
    };
  }

  validateEmail = (email) => {
    var regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return regex.test(email);
  };

  render() {
    return (
      <BgColor>
        <SafeAreaView style={styles.mainContainer}>
          <ScrollView contentContainerStyle={styles.scrollContainer}>
            <View style={styles.logoContainer}>
              <Image source={Logo} style={styles.logoImage} />
            </View>
            <Text style={styles.logoTextStyle}>QueueNoMore</Text>
            <Text style={styles.logoTextStyle}>Business</Text>
            <View style={styles.textInputContainer}>
              <AuthInput
                placeholder={this.state.emailPlaceHolder}
                // placeholder={this.props.email? ""}
                value={this.props.login_email}
                placeholderTextColor="white"
                selectionColor="white"
                // underlineColorAndroid={true ? 'white' : 'grey'}
                onChangeText={async (text) => {
                  await this.props.loginEmailChanged(text);
                  if (!this.validateEmail(this.props.login_email)) {
                    this.props.loginEmailInvalidChanged('Invalid Email Format');
                  } else {
                    this.props.loginEmailInvalidChanged('');
                  }
                }}
                secureTextEntry={false}
                // onFocus={() => this.setState({emailPlaceHolder: ''})}
              />
              <Text style={styles.errorText}>
                {this.props.login_email_invalid}
              </Text>
              <AuthInput
                placeholder={this.state.passwordPlaceHolder}
                value={this.props.login_password}
                placeholderTextColor="white"
                selectionColor="white"
                // underlineColorAndroid={true ? 'white' : 'grey'}
                onChangeText={async (text) => {
                  await this.props.loginPasswordChanged(text);
                  if (this.props.login_password.length < 8) {
                    this.props.loginPasswordInvalidChanged(
                      'Password must have at least 8 characters',
                    );
                  } else {
                    this.props.loginPasswordInvalidChanged('');
                  }
                }}
                secureTextEntry={true}
              />
              <Text style={styles.errorText}>
                {this.props.login_password_invalid}
              </Text>
            </View>
            <View style={styles.buttonInputContainer}>
              <AuthButton
                text="Sign In"
                onPress={async () => {
                  if (
                    this.props.login_email_invalid != '' ||
                    this.props.login_password_invalid != ''
                  ) {
                  } else {
                    await this.props.fetchUser({
                      email: this.props.login_email,
                      password: this.props.login_password,
                    });
                    // if (this.props.jwt != null || this.props.jwt != '') {
                    if (this.props.jwt != null) {
                      if (
                        this.props.shopId == '' ||
                        this.props.shopId == null
                      ) {
                        RootNavigation.navigate('CreateShopInfo');
                        // RootNavigation.navigate('CreateShopInfo');
                      } else {
                        RootNavigation.navigate('Home');
                        // RootNavigation.navigate('CreateShopInfo');
                      }
                    }
                  }
                }}
                // onPress={() => this.props.navigation.navigate('Home')}
              />
              <Text style={styles.errorText}>{this.props.login_Error}</Text>
              <View style={styles.touchableContainer}>
                <TouchableOpacity
                  style={styles.registerButtonContainer}
                  onPress={() => this.props.navigation.navigate('Register')}>
                  <Text style={styles.registerButtonText}>Sign Up</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.forgotPasswordButtonContainer}
                  // onPress={() =>
                  //   this.props.navigation.navigate('CreateQueuePlan')
                  // }
                >
                  <Text style={styles.forgotPasswordButtonText}>
                    Forgot Password
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

LoginScreen.navigationOptions = {
  headerShown: false,
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    // alignItems: 'center',
    // justifyContent: 'center',
  },
  scrollContainer: {
    flexGrow: 1,
    // justifyContent: 'space-around',
    alignItems: 'center',
  },
  logoContainer: {
    marginTop: 30,
    marginBottom: 20,
  },
  logoImage: {},
  logoTextStyle: {
    fontFamily: 'Montserrat-BoldItalic',
    color: 'white',
    fontSize: 30,
    paddingTop: 0,
  },
  textInputContainer: {
    alignSelf: 'stretch',
    paddingHorizontal: 20,
    marginTop: 20,
  },
  errorText: {
    color: 'white',
    fontSize: 14,
    fontFamily: 'Montserrat-Italic',
    marginBottom: 10,
    marginLeft: 10,
  },
  buttonInputContainer: {
    alignSelf: 'stretch',
    paddingHorizontal: 20,
    paddingTop: 14,
  },
  touchableContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  registerButtonContainer: {
    marginTop: 5,
    paddingVertical: 5,
    paddingRight: 20,
    alignSelf: 'flex-start',
  },
  registerButtonText: {
    color: 'white',
    fontStyle: 'italic',
    // fontFamily: 'sans-serif',
    fontFamily: 'Montserrat-Regular',
  },
  forgotPasswordButtonContainer: {
    marginTop: 5,
    paddingVertical: 5,
    paddingLeft: 10,
    alignSelf: 'flex-end',
  },
  forgotPasswordButtonText: {
    color: 'white',
    fontStyle: 'italic',
    // fontFamily: 'sans-serif',
    fontFamily: 'Montserrat-Regular',
  },
});

// const navigateToHome = () => {
//   this.props.navigation.navigate('Register');
// };

const mapStateToProps = (state) => {
  return {
    login_email: state.auth.login_email,
    login_password: state.auth.login_password,
    login_Error: state.auth.login_Error,
    loading: state.auth.loading,
    isFetching: state.auth.isFetching,
    userId: state.auth.userId,
    shopId: state.auth.shopId,
    jwt: state.auth.jwt,
    login_email_invalid: state.auth.login_email_invalid,
    login_password_invalid: state.auth.login_password_invalid,
  };
};

export default connect(mapStateToProps, {
  loginEmailChanged,
  loginPasswordChanged,
  fetchUser,
  loginEmailInvalidChanged,
  loginPasswordInvalidChanged,
})(LoginScreen);
