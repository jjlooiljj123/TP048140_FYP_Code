import React, {Component} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  TextInput,
  SafeAreaView,
  ScrollView,
} from 'react-native';

import QueueButton from '../components/buttons/QueueButton';

import * as RootNavigation from '../RootNavigation';

import {connect} from 'react-redux';
import {fetchShop} from '../redux/action/shopAction';
import baseServerURL from '../baseServerURL';

class ShopInformationScreen extends Component {
  constructor(props) {
    super(props);
  }

  async componentDidMount() {
    await this.props.fetchShop(this.props.shopId);
  }
  render() {
    return (
      <SafeAreaView style={styles.mainContainer}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.titleContainer}>
            <Text style={styles.titleText}>Shop Information</Text>
          </View>
          {this.props.isFetching ? (
            <Text>Loading</Text>
          ) : (
            <>
              <View style={styles.inforConatiner}>
                <View style={styles.imageContainer}>
                  <Image
                    source={{
                      uri: baseServerURL + this.props.shop.shop_imageUrl,
                    }}
                    style={styles.imageStyle}
                  />
                </View>
                <View style={styles.textContainer}>
                  <Text style={styles.shopNameText}>
                    {this.props.shop.shop_shopName}
                  </Text>
                  <Text style={styles.branchText}>
                    {this.props.shop.shop_branch}
                  </Text>
                  <Text style={styles.directoryText}>
                    {this.props.shop.shop_directory}
                  </Text>
                  <Text numberOfLines={3} style={styles.addressText}>
                    {
                      (this.props.shop.shop_streetAddress1,
                      this.props.shop.shop_city,
                      this.props.shop.shop_postalCode,
                      this.props.shop.shop_state,
                      this.props.shop.shop_country)
                    }
                  </Text>
                  <View style={styles.operationTimeContainer}>
                    <View style={styles.dayContainer}>
                      <Text style={styles.operationHourText}>Monday</Text>
                      <Text style={styles.operationHourText}>Tuesday</Text>
                      <Text style={styles.operationHourText}>Wednesday</Text>
                      <Text style={styles.operationHourText}>Thursday</Text>
                      <Text style={styles.operationHourText}>Friday</Text>
                      <Text style={styles.operationHourText}>Saturday</Text>
                      <Text style={styles.operationHourText}>Sunday</Text>
                      <Text style={styles.operationHourText}>
                        Public Holiday
                      </Text>
                    </View>
                    <View style={styles.openingHourContainer}>
                      <Text style={styles.operationHourText}>
                        {this.props.shop.shop_monOpen}
                      </Text>
                      <Text style={styles.operationHourText}>
                        {this.props.shop.shop_tueOpen}
                      </Text>
                      <Text style={styles.operationHourText}>
                        {this.props.shop.shop_wedOpen}
                      </Text>
                      <Text style={styles.operationHourText}>
                        {this.props.shop.shop_thuOpen}
                      </Text>
                      <Text style={styles.operationHourText}>
                        {this.props.shop.shop_friOpen}
                      </Text>
                      <Text style={styles.operationHourText}>
                        {this.props.shop.shop_satOpen}
                      </Text>
                      <Text style={styles.operationHourText}>
                        {this.props.shop.shop_sunOpen}
                      </Text>
                      <Text style={styles.operationHourText}>
                        {this.props.shop.shop_holOpen}
                      </Text>
                    </View>
                    <View style={styles.toContainer}>
                      <Text style={styles.operationHourText}>to</Text>
                      <Text style={styles.operationHourText}>to</Text>
                      <Text style={styles.operationHourText}>to</Text>
                      <Text style={styles.operationHourText}>to</Text>
                      <Text style={styles.operationHourText}>to</Text>
                      <Text style={styles.operationHourText}>to</Text>
                      <Text style={styles.operationHourText}>to</Text>
                      <Text style={styles.operationHourText}>to</Text>
                    </View>
                    <View style={styles.closingHourContainer}>
                      <Text style={styles.operationHourText}>
                        {this.props.shop.shop_monClose}
                      </Text>
                      <Text style={styles.operationHourText}>
                        {this.props.shop.shop_tueClose}
                      </Text>
                      <Text style={styles.operationHourText}>
                        {this.props.shop.shop_wedClose}
                      </Text>
                      <Text style={styles.operationHourText}>
                        {this.props.shop.shop_thuClose}
                      </Text>
                      <Text style={styles.operationHourText}>
                        {this.props.shop.shop_friClose}
                      </Text>
                      <Text style={styles.operationHourText}>
                        {this.props.shop.shop_satClose}
                      </Text>
                      <Text style={styles.operationHourText}>
                        {this.props.shop.shop_sunClose}
                      </Text>
                      <Text style={styles.operationHourText}>
                        {this.props.shop.shop_holClose}
                      </Text>
                    </View>
                  </View>
                </View>
                <View style={styles.backButtonContainer}>
                  <QueueButton
                    text="Edit"
                    onPress={() => RootNavigation.navigate('EditShop')}
                  />
                </View>
              </View>
            </>
          )}
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
  },
  titleText: {
    fontFamily: 'Montserrat-Bold',
    fontSize: 24,
    color: '#8E54E9',
  },
  inforConatiner: {
    marginTop: 20,
  },
  imageContainer: {
    width: 110,
    height: 110,
    borderRadius: 10,
    alignSelf: 'center',
  },
  imageStyle: {
    width: 110,
    height: 110,
    borderRadius: 10,
    // shadowOpacity: 5,
    // elevation: 5,
  },
  textContainer: {
    marginTop: 10,
    alignSelf: 'center',
    alignItems: 'center',
    marginHorizontal: 20,
  },
  shopNameText: {
    fontFamily: 'Montserrat-Bold',
    fontSize: 20,
  },
  branchText: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 16,
    marginTop: 5,
  },
  directoryText: {
    fontFamily: 'Montserrat-Italic',
    fontSize: 14,
    marginTop: 5,
  },
  addressText: {
    textAlign: 'center',
    fontFamily: 'Montserrat-Light',
    fontSize: 14,
    marginTop: 5,
  },
  operationTimeContainer: {
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  dayContainer: {
    textAlign: 'left',
    flex: 3,
  },
  openingHourContainer: {
    textAlign: 'left',
    flex: 2,
  },
  toContainer: {
    textAlign: 'left',
    flex: 1,
  },
  closingHourContainer: {
    textAlign: 'left',
    flex: 2,
  },
  operationHourText: {
    fontFamily: 'Montserrat-Regular',
    marginTop: 2,
  },
  backButtonContainer: {
    marginHorizontal: 10,
    marginVertical: 10,
    marginTop: 20,
  },
});

const mapStateToProps = (state) => {
  return {
    isFetching: state.shop.isFetching,
    shopId: state.auth.shopId,
    shop: state.shop.shop,
    fetchingShopError: state.shop.fetchingShopError,
  };
};

export default connect(mapStateToProps, {fetchShop})(ShopInformationScreen);

// export default ShopInformationScreen;
