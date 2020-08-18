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

import QueueButton from '../components/buttons/QueueButton';

import {Picker} from '@react-native-community/picker';
import ShopTimePicker from '../components/pickers/shopTimePicker';

import {connect} from 'react-redux';
import {
  shopShopNameChanged,
  shopShopBranchChanged,
  shopShopAddress1Changed,
  shopShopAddress2Changed,
  shopShopAddress3Changed,
  shopShopCityChanged,
  shopShopPostalCodeChanged,
  shopShopStateChanged,
  shopShopCountryChanged,
  shopShopDirectoryChanged,
  shopShopOpeningHourChanged,
  shopShopClosingHourChanged,
  createhShop,
  edithShop,
} from '../redux/action/shopAction';

class EditShopInfoScreen extends Component {
  async componentDidMount() {
    console.log('shopOpneningHour', this.props.shopOpneningHour);
    console.log('shopClosingHour', this.props.shopClosingHour);
    console.log('shopDirectory', this.props.shopDirectory);
    await this.props.shopShopOpeningHourChanged(this.props.shopOpneningHour);
    await this.props.shopShopClosingHourChanged(this.props.shopClosingHour);
    await this.props.shopShopDirectoryChanged(this.props.shopDirectory);
  }

  render() {
    return (
      <SafeAreaView style={styles.mainContainer}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.titleContainer}>
            <Text style={styles.titleText}>Edit Shop Infomation</Text>
          </View>
          <View style={styles.contentContainer}>
            <View style={styles.questionContainer}>
              <Text style={styles.questionText}>Shop Name:</Text>
              <TextInput
                style={styles.answerText}
                autoCapitalize="none"
                autoCorrect={false}
                autoCompleteType="off"
                secureTextEntry={false}
                placeholder="McDonald's"
                onChangeText={(text) => {
                  this.props.shopShopNameChanged(text);
                }}
                value={this.props.shopShopName}
                // placeholderTextColor={}
                // selectionColor={}
                // // underlineColorAndroid={}
                // onFocus={}
              />
            </View>
            <View style={styles.questionContainer}>
              <Text style={styles.questionText}>Branch:</Text>
              <TextInput
                style={styles.answerText}
                autoCapitalize="none"
                autoCorrect={false}
                autoCompleteType="off"
                secureTextEntry={false}
                placeholder="Petaling Jaya"
                onChangeText={(text) => {
                  this.props.shopShopBranchChanged(text);
                }}
                value={this.props.shopShopBranch}
                // placeholderTextColor={}
                // selectionColor={}
                // // underlineColorAndroid={}
                // onFocus={}
              />
            </View>
            <View style={styles.questionContainer}>
              <Text style={styles.questionText}>Address:</Text>
              <TextInput
                style={styles.answerText}
                autoCapitalize="none"
                autoCorrect={false}
                autoCompleteType="off"
                secureTextEntry={false}
                placeholder="address line 1"
                onChangeText={(text) => {
                  this.props.shopShopAddress1Changed(text);
                }}
                value={this.props.shopShopAddress1}
                // placeholderTextColor={}
                // selectionColor={}
                // // underlineColorAndroid={}
                // onFocus={}
              />
              <TextInput
                style={styles.answerText}
                autoCapitalize="none"
                autoCorrect={false}
                autoCompleteType="off"
                secureTextEntry={false}
                placeholder="address line 2"
                onChangeText={(text) => {
                  this.props.shopShopAddress2Changed(text);
                }}
                value={this.props.shopShopAddress2}
                // placeholderTextColor={}
                // selectionColor={}
                // // underlineColorAndroid={}
                // onFocus={}
              />
              <TextInput
                style={styles.answerText}
                autoCapitalize="none"
                autoCorrect={false}
                autoCompleteType="off"
                secureTextEntry={false}
                placeholder="address line 3"
                onChangeText={(text) => {
                  this.props.shopShopAddress3Changed(text);
                }}
                value={this.props.shopShopAddress3}
                // placeholderTextColor={}
                // selectionColor={}
                // // underlineColorAndroid={}
                // onFocus={}
              />
            </View>
            <View style={styles.questionContainer}>
              <Text style={styles.questionText}>City:</Text>
              <TextInput
                style={styles.answerText}
                autoCapitalize="none"
                autoCorrect={false}
                autoCompleteType="off"
                secureTextEntry={false}
                placeholder="Petaling Jaya"
                onChangeText={(text) => {
                  this.props.shopShopCityChanged(text);
                }}
                value={this.props.shopCity}
                // placeholderTextColor={}
                // selectionColor={}
                // // underlineColorAndroid={}
                // onFocus={}
              />
            </View>

            <View style={styles.questionContainer}>
              <Text style={styles.questionText}>Postal Code:</Text>
              <TextInput
                style={styles.answerText}
                autoCapitalize="none"
                keyboardType="numeric"
                autoCorrect={false}
                autoCompleteType="off"
                secureTextEntry={false}
                placeholder="57000"
                onChangeText={(text) => {
                  this.props.shopShopPostalCodeChanged(text);
                }}
                value={this.props.shopPostalCode}
                // placeholderTextColor={}
                // selectionColor={}
                // // underlineColorAndroid={}
                // onFocus={}
              />
              <View style={styles.questionContainer}>
                <Text style={styles.questionText}>State:</Text>
                <TextInput
                  style={styles.answerText}
                  autoCapitalize="none"
                  autoCorrect={false}
                  autoCompleteType="off"
                  secureTextEntry={false}
                  placeholder="Kuala Lumpur"
                  onChangeText={(text) => {
                    this.props.shopShopStateChanged(text);
                  }}
                  value={this.props.shopState}
                  // placeholderTextColor={}
                  // selectionColor={}
                  // // underlineColorAndroid={}
                  // onFocus={}
                />
              </View>
              <View style={styles.questionContainer}>
                <Text style={styles.questionText}>Country:</Text>
                <TextInput
                  style={styles.answerText}
                  autoCapitalize="none"
                  autoCorrect={false}
                  autoCompleteType="off"
                  secureTextEntry={false}
                  placeholder="Malaysia"
                  onChangeText={(text) => {
                    this.props.shopShopCountryChanged(text);
                  }}
                  value={this.props.shopCountry}
                  // placeholderTextColor={}
                  // selectionColor={}
                  // // underlineColorAndroid={}
                  // onFocus={}
                />
              </View>
              <View style={styles.questionContainer}>
                <Text style={styles.questionText}>Directory:</Text>
                <Picker
                  style={styles.questionText}
                  selectedValue={this.props.shopDirectory}
                  onValueChange={(itemValue, itemIndex) =>
                    this.props.shopShopDirectoryChanged(itemValue)
                  }>
                  <Picker.Item label="-" value="" />
                  <Picker.Item label="Beauty Salon" value="Beauty Salon" />
                  <Picker.Item label="Food" value="Food" />
                  <Picker.Item label="Hair Salon" value="Hair Salon" />
                  <Picker.Item label="Medical" value="Medical" />
                  <Picker.Item
                    label="Telecommunication"
                    value="Telecommunication"
                  />
                </Picker>
              </View>
              {/* <View style={styles.questionContainer}>
                <Text style={styles.questionText}>Shop Logo:</Text>
                <Text>Image!!!</Text>
              </View> */}
              <View style={styles.questionContainer}>
                <Text style={styles.questionText}>Opening Hours:</Text>
                <ShopTimePicker
                  styles={styles.questionText}
                  selectedValue={this.props.shopOpneningHour}
                  onValueChange={(itemValue, itemIndex) =>
                    this.props.shopShopOpeningHourChanged(itemValue)
                  }
                />
              </View>
              <View style={styles.questionContainer}>
                <Text style={styles.questionText}>Closing Hours:</Text>
                <ShopTimePicker
                  styles={styles.questionText}
                  selectedValue={this.props.shopClosingHour}
                  onValueChange={(itemValue, itemIndex) =>
                    this.props.shopShopClosingHourChanged(itemValue)
                  }
                />
              </View>
            </View>
            <View style={styles.buttonContainer}>
              <QueueButton
                text="Submit"
                onPress={() => {
                  this.props.edithShop({
                    shopId: this.props.shopId,
                    jwt: this.props.jwt,
                    shopName: this.props.shopShopName,
                    branch: this.props.shopShopBranch,
                    streetAddress1: this.props.shopShopAddress1,
                    streetAddress2: this.props.shopShopAddress2,
                    streetAddress3: this.props.shopShopAddress3,
                    city: this.props.shopCity,
                    postalCode: this.props.shopPostalCode,
                    state: this.props.shopState,
                    country: this.props.shopCountry,
                    directory: this.props.shopDirectory,
                    imageUrl: this.props.shopShopImageUrl,
                    openingHour: this.props.shopOpneningHour,
                    closingHour: this.props.shopClosingHour,

                    // monOpen: this.props.shopOpneningHour,
                    // tueOpen: this.props.shopOpneningHour,
                    // wedOpen: this.props.shopOpneningHour,
                    // thuOpen: this.props.shopOpneningHour,
                    // friOpen: this.props.shopOpneningHour,
                    // satOpen: this.props.shopOpneningHour,
                    // sunOpen: this.props.shopOpneningHour,
                    // holOpen: this.props.shopOpneningHour,
                    // monClose: this.props.shopClosingHour,
                    // tueClose: this.props.shopClosingHour,
                    // wedClose: this.props.shopClosingHour,
                    // thuClose: this.props.shopClosingHour,
                    // friClose: this.props.shopClosingHour,
                    // satClose: this.props.shopClosingHour,
                    // sunClose: this.props.shopClosingHour,
                    // holClose: this.props.shopClosingHour,
                  });
                }}
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
    // alignItems: 'center',
    marginHorizontal: 20,
  },
  titleContainer: {
    // alignSelf: 'flex-start',
    marginTop: 15,
  },
  titleText: {
    fontFamily: 'Montserrat-Bold',
    fontSize: 24,
    color: '#8E54E9',
  },
  contentContainer: {
    marginVertical: 0,
    alignSelf: 'stretch',
  },
  questionContainer: {
    marginTop: 10,
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
  buttonContainer: {
    marginVertical: 10,
    marginBottom: 30,
  },
});

const mapStateToProps = (state) => {
  return {
    shopShopName: state.shop.shopShopName,
    shopShopImageUrl: state.shop.shopShopImageUrl,
    shopShopBranch: state.shop.shopShopBranch,
    shopShopAddress1: state.shop.shopShopAddress1,
    shopShopAddress2: state.shop.shopShopAddress2,
    shopShopAddress3: state.shop.shopShopAddress3,
    shopCity: state.shop.shopCity,
    shopPostalCode: state.shop.shopPostalCode,
    shopState: state.shop.shopState,
    shopCountry: state.shop.shopCountry,
    shopDirectory: state.shop.shopDirectory,
    shopOpneningHour: state.shop.shopOpneningHour,
    shopClosingHour: state.shop.shopClosingHour,
    createShopError: state.shop.createShopError,
    shopId: state.auth.shopId,
    jwt: state.auth.jwt,
  };
};

export default connect(mapStateToProps, {
  shopShopNameChanged,
  shopShopBranchChanged,
  shopShopAddress1Changed,
  shopShopAddress2Changed,
  shopShopAddress3Changed,
  shopShopCityChanged,
  shopShopPostalCodeChanged,
  shopShopStateChanged,
  shopShopCountryChanged,
  shopShopDirectoryChanged,
  shopShopOpeningHourChanged,
  shopShopClosingHourChanged,
  createhShop,
  edithShop,
})(EditShopInfoScreen);

// export default CreateShopInfoScreen;
