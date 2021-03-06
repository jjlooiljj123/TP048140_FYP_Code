import LinearGradient from 'react-native-linear-gradient';
import React, {Component} from 'react';
import {StyleSheet} from 'react-native';

class TopBgColor extends Component {
  render() {
    return (
      <LinearGradient
        colors={['#4776E6', '#8E54E9']}
        style={styles.linearGradient}>
        {this.props.children}
      </LinearGradient>
    );
  }
}

const styles = StyleSheet.create({
  linearGradient: {
    flex: 1,
    alignItems: 'stretch',
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
  },
});

export default TopBgColor;
