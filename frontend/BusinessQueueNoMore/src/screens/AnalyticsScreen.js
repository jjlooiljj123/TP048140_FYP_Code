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

import DatePicker from 'react-native-datepicker';

import StageActivityButton from '../components/buttons/StageActivityButton';
import ShopPerformanceCard from '../components/cards/ShopPerformanceCard';
import ShopAnalysisList from '../components/lists/ShopAnalysisList';

import {
  datePickerToBackendFormatMapping,
  addOneDayFromPicker,
} from '../datePickerMapping';

import {connect} from 'react-redux';
import {
  dateAnalysisChanged,
  fetchShopAnalysis,
} from '../redux/action/performanceAction';

class AnalyticsScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {date: '2016-05-15'};
  }

  render() {
    return (
      <SafeAreaView style={styles.mainContainer}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.titleContainer}>
            <Text style={styles.titleText}>Performance Analysis</Text>
          </View>
          <View style={styles.contentContainer}>
            <View style={styles.dateContainer}>
              <DatePicker
                style={{width: 200, marginHorizontal: 10}}
                date={this.props.dateAnalysis}
                mode="date"
                placeholder="select date"
                format="YYYY-MM-DD"
                // minDate="2016-05-01"
                // maxDate="2016-06-01"
                confirmBtnText="Confirm"
                cancelBtnText="Cancel"
                customStyles={{
                  dateIcon: {
                    position: 'absolute',
                    left: 0,
                    top: 4,
                    marginLeft: 0,
                  },
                  dateInput: {
                    marginLeft: 36,
                  },
                  // ... You can check the source to find the other keys.
                }}
                onDateChange={(date) => {
                  this.props.dateAnalysisChanged(date);
                }}
              />
              {/* <View style={styles.dateButtonContainer}> */}
              <StageActivityButton
                text="search"
                onPress={() => {
                  this.props.fetchShopAnalysis({
                    shopId: this.props.shopId,
                    startTime: datePickerToBackendFormatMapping(
                      this.props.dateAnalysis,
                    ),
                    endtime: addOneDayFromPicker(this.props.dateAnalysis),
                  });
                }}
              />
              {/* </View> */}
            </View>
            {this.props.shopPerformanceAnalyses.length != 0 ? (
              <ShopAnalysisList results={this.props.shopPerformanceAnalyses} />
            ) : (
              <></>
            )}
            {/* <ShopAnalysisList results={this.props.shopPerformanceAnalyses} /> */}
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
    // borderWidth: 1,
  },
  dateContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 10,
  },
  dateButtonContainer: {},
});

const mapStateToProps = (state) => {
  return {
    jwt: state.auth.jwt,
    userId: state.auth.userId,
    shopId: state.auth.shopId,
    userRole: state.auth.userRole,
    dateAnalysis: state.performance.dateAnalysis,
    shopPerformanceAnalyses: state.performance.shopPerformanceAnalyses,
  };
};

export default connect(mapStateToProps, {
  dateAnalysisChanged,
  fetchShopAnalysis,
})(AnalyticsScreen);

// export default AnalyticsScreen;
