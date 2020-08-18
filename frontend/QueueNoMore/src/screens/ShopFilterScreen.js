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

import QueueButton from '../components/buttons/QueueButton';

import {Picker} from '@react-native-community/picker';
import CheckBox from '@react-native-community/checkbox';

import * as RootNavigation from '../RootNavigation';

import {connect} from 'react-redux';
import {
  selectQueueLengthChanged,
  beatySalonChecked,
  foodChecked,
  hairSalonChecked,
  medicalChecked,
  telecommunicationChecked,
  clearChecked,
  filterShops,
} from '../redux/action/shopAction';

// const [toggleCheckBox, setToggleCheckBox] = useState(false);

class FvouriteScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      checkbox1: false,
      checkbox2: false,
    };
  }

  async componentDidMount() {
    await this.props.clearChecked();
    await this.props.selectQueueLengthChanged('99999');
  }

  render() {
    return (
      <SafeAreaView style={styles.mainContainer}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.titleContainer}>
            <Text style={styles.titleText}>Filter Shop</Text>
          </View>
          <View style={styles.contentContainer}>
            <View style={styles.waitingTimeContainer}>
              <Text style={styles.waitingTimetitle}>
                Estimated waiting time:
              </Text>
              <Picker
                selectedValue={this.props.queueLengthFilter}
                itemStyle={{fontFamily: 'Montserrat-Regular'}}
                textStyle={{fontFamily: 'Montserrat-Regular', fontSize: 20}}
                itemTextStyle={{fontFamily: 'Montserrat-Regular'}}
                onValueChange={(itemValue, itemIndex) =>
                  this.props.selectQueueLengthChanged(itemValue)
                }>
                <Picker.Item label="No limit" value="99999" />
                <Picker.Item label="5 mins" value="5" />
                <Picker.Item label="15 mins" value="15" />
                <Picker.Item label="30 mins" value="30" />
                <Picker.Item label="1 hour" value="60" />
              </Picker>
            </View>
            <View style={styles.directoryContainer}>
              <Text style={styles.directoryText}>Directory:</Text>
              <View style={styles.directoryOptionContainer}>
                <CheckBox
                  disabled={false}
                  tintColors={{true: '#8E54E9', false: 'grey'}}
                  value={this.props.beautySalonOption}
                  onValueChange={() => {
                    // this.state.checkbox1
                    //   ? this.setState({checkbox1: false})
                    //   : this.setState({checkbox1: true, checkbox2: false})
                    this.props.beatySalonChecked('beauty salon');
                  }}
                />
                <Text style={styles.directoryText}>Beauty Salon</Text>
              </View>
              <View style={styles.directoryOptionContainer}>
                <CheckBox
                  disabled={false}
                  tintColors={{true: '#8E54E9', false: 'grey'}}
                  value={this.props.foodOption}
                  onValueChange={() => {
                    // this.state.checkbox2
                    // ? this.setState({checkbox2: false})
                    // : this.setState({checkbox2: true, checkbox1: false})
                    this.props.foodChecked('food');
                  }}
                />
                <Text style={styles.directoryText}>Food</Text>
              </View>
              <View style={styles.directoryOptionContainer}>
                <CheckBox
                  disabled={false}
                  tintColors={{true: '#8E54E9', false: 'grey'}}
                  value={this.props.hairSalonOption}
                  onValueChange={() => {
                    // this.state.checkbox2
                    // ? this.setState({checkbox2: false})
                    // : this.setState({checkbox2: true, checkbox1: false})
                    this.props.hairSalonChecked('hair salon');
                  }}
                />
                <Text style={styles.directoryText}>Hair Salon</Text>
              </View>
              <View style={styles.directoryOptionContainer}>
                <CheckBox
                  disabled={false}
                  tintColors={{true: '#8E54E9', false: 'grey'}}
                  value={this.props.medicalOption}
                  onValueChange={() => {
                    // this.state.checkbox2
                    // ? this.setState({checkbox2: false})
                    // : this.setState({checkbox2: true, checkbox1: false})
                    this.props.medicalChecked('medical');
                  }}
                />
                <Text style={styles.directoryText}>Medical</Text>
              </View>
              <View style={styles.directoryOptionContainer}>
                <CheckBox
                  disabled={false}
                  tintColors={{true: '#8E54E9', false: 'grey'}}
                  value={this.props.telecommunicationOption}
                  onValueChange={() => {
                    // this.state.checkbox2
                    // ? this.setState({checkbox2: false})
                    // : this.setState({checkbox2: true, checkbox1: false})
                    this.props.telecommunicationChecked('medical');
                  }}
                />
                <Text style={styles.directoryText}>Telecommunication</Text>
              </View>
              <View style={styles.directoryOptionContainer}>
                <CheckBox
                  disabled={false}
                  tintColors={{true: '#8E54E9', false: 'grey'}}
                  value={this.props.clearOption}
                  onValueChange={() => {
                    // this.state.checkbox2
                    // ? this.setState({checkbox2: false})
                    // : this.setState({checkbox2: true, checkbox1: false})
                    this.props.clearChecked();
                  }}
                />
                <Text style={styles.directoryText}>No Directory Selected</Text>
              </View>
            </View>
            <QueueButton
              text="Submit"
              onPress={() =>
                this.props.filterShops({
                  directory: this.props.selectedOption,
                  queueLength: Number(this.props.queueLengthFilter),
                })
              }
            />
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
  waitingTimeContainer: {
    marginVertical: 10,
  },
  waitingTimetitle: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 14,
  },
  directoryContainer: {
    marginVertical: 10,
  },
  directoryText: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 14,
  },
  directoryOptionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
const mapStateToProps = state => {
  return {
    queueLengthFilter: state.shop.queueLengthFilter,
    beautySalonOption: state.shop.beautySalonOption,
    foodOption: state.shop.foodOption,
    hairSalonOption: state.shop.hairSalonOption,
    medicalOption: state.shop.medicalOption,
    telecommunicationOption: state.shop.telecommunicationOption,
    selectedOption: state.shop.selectedOption,
    // beautySalonOption: state.shop.beautySalonOption,
    // foodOption: state.shop.foodOption,
    // hairSalonOption: state.shop.hairSalonOption,
    // medicalOption: state.shop.medicalOption,
    // telecommunicationOption: state.shop.telecommunicationOption,
    // selectedOption: state.shop.selectedOption,
    clearOption: state.shop.clearOption,
  };
};

export default connect(
  mapStateToProps,
  {
    selectQueueLengthChanged,
    beatySalonChecked,
    foodChecked,
    hairSalonChecked,
    medicalChecked,
    telecommunicationChecked,
    clearChecked,
    filterShops,
  },
)(FvouriteScreen);
