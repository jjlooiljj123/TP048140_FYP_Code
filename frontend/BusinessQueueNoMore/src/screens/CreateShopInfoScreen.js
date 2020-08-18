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
  CameraRoll,
} from 'react-native';

import QueueButton from '../components/buttons/QueueButton';
import StageActivityButton from '../components/buttons/StageActivityButton';

import {Picker} from '@react-native-community/picker';
import ShopTimePicker from '../components/pickers/shopTimePicker';

// import ImagePicker from 'react-native-image-picker';
import ImagePicker from 'react-native-image-picker';
let options = {
  title: 'Select a photo',
  takePhotoButtonTitle: 'Take a photo',
  ChooseFromLibraryButtonTitle: 'Choose from gallery',
  quality: 1,
};

import {connect} from 'react-redux';
import {
  selectImageFileChanged,
  imageUriChanged,
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
  shopShopNameInvalidChanged,
  shopShopBranchInvalidChanged,
  shopShopAddress1InvalidChanged,
  shopShopAddress2InvalidChanged,
  shopShopAddress3InvalidChanged,
  shopShopCityInvalidChanged,
  shopShopPostalCodeInvalidChanged,
  shopShopStateInvalidChanged,
  shopShopCountryInvalidChanged,
  shopShopDirectoryInvalidChanged,
  shopShopOpeningHourInvalidChanged,
  shopShopClosingHourInvalidChanged,
} from '../redux/action/shopAction';

class CreateShopInfoScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      imageSource: null,
    };
  }

  selectPhoto() {
    ImagePicker.showImagePicker(options, (response) => {
      console.log('Response = ', response);

      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else {
        const source = {uri: response.uri};

        // You can also display the image using data:
        // const source = { uri: 'data:image/jpeg;base64,' + response.data };

        // this.setState({
        //   imageSource: source,
        // });
        this.props.selectImageFileChanged(response);
        this.props.imageUriChanged(source);
      }
    });
  }

  async componentDidMount() {
    await this.props.shopShopDirectoryChanged('beauty salon');
    await this.props.shopShopOpeningHourChanged('10.00 am');
    await this.props.shopShopClosingHourChanged('10.00 pm');
  }

  render() {
    return (
      <SafeAreaView style={styles.mainContainer}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.titleContainer}>
            <Text style={styles.titleText}>Your Shop Infomation</Text>
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
                onChangeText={async (text) => {
                  await this.props.shopShopNameChanged(text);
                  if (this.props.shopShopName.length == 0) {
                    this.props.shopShopNameInvalidChanged('Required');
                  } else {
                    this.props.shopShopNameInvalidChanged('');
                  }
                }}
                value={this.props.shopShopName}
                // placeholderTextColor={}
                // selectionColor={}
                // // underlineColorAndroid={}
                // onFocus={}
              />
              <Text style={styles.errorText}>
                {this.props.shopShopNameInvalid}
              </Text>
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
                onChangeText={async (text) => {
                  await this.props.shopShopBranchChanged(text);
                  if (this.props.shopShopBranch.length == 0) {
                    this.props.shopShopBranchInvalidChanged('Required');
                  } else {
                    this.props.shopShopBranchInvalidChanged('');
                  }
                }}
                value={this.props.shopShopBranch}
                // placeholderTextColor={}
                // selectionColor={}
                // // underlineColorAndroid={}
                // onFocus={}
              />
              <Text style={styles.errorText}>
                {this.props.shopShopBranchInvalid}
              </Text>
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
                onChangeText={async (text) => {
                  await this.props.shopShopAddress1Changed(text);
                  if (this.props.shopShopAddress1.length == 0) {
                    this.props.shopShopAddress1InvalidChanged(
                      'At least 1 line required',
                    );
                  } else {
                    this.props.shopShopAddress1InvalidChanged('');
                  }
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
              <Text style={styles.errorText}>
                {this.props.shopShopAddress1Invalid}
              </Text>
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
                onChangeText={async (text) => {
                  await this.props.shopShopCityChanged(text);
                  if (this.props.shopCity.length == 0) {
                    this.props.shopShopCityInvalidChanged('Required');
                  } else {
                    this.props.shopShopCityInvalidChanged('');
                  }
                }}
                value={this.props.shopCity}
                // placeholderTextColor={}
                // selectionColor={}
                // // underlineColorAndroid={}
                // onFocus={}
              />
              <Text style={styles.errorText}>{this.props.shopCityInvalid}</Text>
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
                onChangeText={async (text) => {
                  await this.props.shopShopPostalCodeChanged(text);
                  if (this.props.shopPostalCode.length == 0) {
                    this.props.shopShopPostalCodeInvalidChanged('Required');
                  } else {
                    this.props.shopShopPostalCodeInvalidChanged('');
                  }
                }}
                value={this.props.shopPostalCode}
                // placeholderTextColor={}
                // selectionColor={}
                // // underlineColorAndroid={}
                // onFocus={}
              />
              <Text style={styles.errorText}>
                {this.props.shopPostalCodeInvalid}
              </Text>
              <View style={styles.questionContainer}>
                <Text style={styles.questionText}>State:</Text>
                <TextInput
                  style={styles.answerText}
                  autoCapitalize="none"
                  autoCorrect={false}
                  autoCompleteType="off"
                  secureTextEntry={false}
                  placeholder="Kuala Lumpur"
                  onChangeText={async (text) => {
                    await this.props.shopShopStateChanged(text);
                    if (this.props.shopState.length == 0) {
                      this.props.shopShopStateInvalidChanged('Required');
                    } else {
                      this.props.shopShopStateInvalidChanged('');
                    }
                  }}
                  value={this.props.shopState}
                  // placeholderTextColor={}
                  // selectionColor={}
                  // // underlineColorAndroid={}
                  // onFocus={}
                />
                <Text style={styles.errorText}>
                  {this.props.shopStateInvalid}
                </Text>
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
                  onChangeText={async (text) => {
                    await this.props.shopShopCountryChanged(text);
                    if (this.props.shopCountry.length == 0) {
                      this.props.shopShopCountryInvalidChanged('Required');
                    } else {
                      this.props.shopShopCountryInvalidChanged('');
                    }
                  }}
                  value={this.props.shopCountry}
                  // placeholderTextColor={}
                  // selectionColor={}
                  // // underlineColorAndroid={}
                  // onFocus={}
                />
                <Text style={styles.errorText}>
                  {this.props.shopCountryInvalid}
                </Text>
              </View>
              <View style={styles.questionContainer}>
                <Text style={styles.questionText}>Directory:</Text>
                <Picker
                  style={styles.questionText}
                  selectedValue={this.props.shopDirectory}
                  onValueChange={(itemValue, itemIndex) =>
                    this.props.shopShopDirectoryChanged(itemValue)
                  }>
                  <Picker.Item label="Beauty Salon" value="beauty salon" />
                  <Picker.Item label="Food" value="food" />
                  <Picker.Item label="Hair Salon" value="hair salon" />
                  <Picker.Item label="Medical" value="medical" />
                  <Picker.Item
                    label="Telecommunication"
                    value="telecommunication"
                  />
                </Picker>
              </View>
              <View style={styles.questionContainer}>
                <Text style={styles.questionText}>Shop Logo:</Text>

                <Image
                  source={
                    // this.state.imageSource != null
                    //   ? this.state.imageSource
                    //   : require('../../assets/images/Qbutton.png')
                    this.props.shopShopImageUrl != null
                      ? this.props.shopShopImageUrl
                      : require('../../assets/images/Qbutton.png')
                  }
                  style={styles.image}
                />
                <View style={styles.imageButtonContainer}>
                  <StageActivityButton
                    text="Select a photo"
                    onPress={this.selectPhoto.bind(this)}
                  />
                </View>
              </View>
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
                  if (
                    this.props.shopShopNameInvalid != '' ||
                    this.props.shopShopBranchInvalid != '' ||
                    this.props.shopShopAddress1Invalid != '' ||
                    this.props.shopCityInvalid != '' ||
                    this.props.shopPostalCodeInvalid != '' ||
                    this.props.shopStateInvalid != '' ||
                    this.props.shopCountryInvalid != ''
                  ) {
                  } else {
                    this.props.createhShop({
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
                      // imageUrl: '/images/1.jpeg',
                      image: this.props.shopImageFile,
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
                      openingHour: this.props.shopOpneningHour,
                      closingHour: this.props.shopClosingHour,
                    });
                  }
                }}
              />
              <Text style={styles.errorText}>{this.props.createShopError}</Text>
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
  image: {
    width: 150,
    height: 150,
    borderWidth: 1,
    alignSelf: 'center',
    marginVertical: 10,
  },
  imageButtonContainer: {
    // borderWidth: 1,
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    fontFamily: 'Montserrat-Italic',
    marginBottom: 10,
    marginLeft: 10,
  },
  buttonContainer: {
    marginVertical: 10,
    marginBottom: 30,
  },
});

const mapStateToProps = (state) => {
  return {
    shopShopName: state.shop.shopShopName,
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
    jwt: state.auth.jwt,
    shopImageFile: state.shop.shopImageFile,
    shopShopImageUrl: state.shop.shopShopImageUrl,
    shopShopNameInvalid: state.shop.shopShopNameInvalid,
    shopShopBranchInvalid: state.shop.shopShopBranchInvalid,
    shopShopAddress1Invalid: state.shop.shopShopAddress1Invalid,
    shopShopAddress2Invalid: state.shop.shopShopAddress2Invalid,
    shopShopAddress3Invalid: state.shop.shopShopAddress3Invalid,
    shopCityInvalid: state.shop.shopCityInvalid,
    shopPostalCodeInvalid: state.shop.shopPostalCodeInvalid,
    shopStateInvalid: state.shop.shopStateInvalid,
    shopCountryInvalid: state.shop.shopCountryInvalid,
    shopDirectoryInvalid: state.shop.shopDirectoryInvalid,
    shopOpneningHourInvalid: state.shop.shopOpneningHourInvalid,
    shopClosingHourInvalid: state.shop.shopClosingHourInvalid,
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
  selectImageFileChanged,
  imageUriChanged,
  shopShopNameInvalidChanged,
  shopShopBranchInvalidChanged,
  shopShopAddress1InvalidChanged,
  shopShopAddress2InvalidChanged,
  shopShopAddress3InvalidChanged,
  shopShopCityInvalidChanged,
  shopShopPostalCodeInvalidChanged,
  shopShopStateInvalidChanged,
  shopShopCountryInvalidChanged,
  shopShopDirectoryInvalidChanged,
  shopShopOpeningHourInvalidChanged,
  shopShopClosingHourInvalidChanged,
})(CreateShopInfoScreen);

// export default CreateShopInfoScreen;
