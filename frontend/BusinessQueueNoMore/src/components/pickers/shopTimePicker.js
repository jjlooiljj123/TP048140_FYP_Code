import React, {Component} from 'react';
import {Picker} from '@react-native-community/picker';

const ShopTimePicker = ({styles, selectedValue, onValueChange}) => {
  return (
    <Picker
      style={styles}
      selectedValue={selectedValue}
      onValueChange={onValueChange}>
      <Picker.Item label="-" value="" />
      <Picker.Item label="Close" value="Close" />
      <Picker.Item label="0.00 am" value="0.00 am" />
      <Picker.Item label="0.30 am" value="0.30 am" />
      <Picker.Item label="1.00 am" value="1.00 am" />
      <Picker.Item label="1.30 am" value="1.30 am" />
      <Picker.Item label="2.00 am" value="2.00 am" />
      <Picker.Item label="2.30 am" value="2.30 am" />
      <Picker.Item label="3.00 am" value="3.00 am" />
      <Picker.Item label="3.30 am" value="3.30 am" />
      <Picker.Item label="4.00 am" value="4.00 am" />
      <Picker.Item label="4.30 am" value="4.30 am" />
      <Picker.Item label="5.00 am" value="5.00 am" />
      <Picker.Item label="5.30 am" value="5.30 am" />
      <Picker.Item label="6.00 am" value="6.00 am" />
      <Picker.Item label="6.30 am" value="6.30 am" />
      <Picker.Item label="7.00 am" value="7.00 am" />
      <Picker.Item label="7.30 am" value="7.30 am" />
      <Picker.Item label="8.00 am" value="8.00 am" />
      <Picker.Item label="8.30 am" value="8.30 am" />
      <Picker.Item label="9.00 am" value="9.00 am" />
      <Picker.Item label="9.30 am" value="9.30 am" />
      <Picker.Item label="10.00 am" value="10.00 am" />
      <Picker.Item label="10.30 am" value="10.30 am" />
      <Picker.Item label="11.00 am" value="11.00 am" />
      <Picker.Item label="11.30 am" value="11.30 am" />
      <Picker.Item label="12.00 pm" value="12.00 pm" />
      <Picker.Item label="12.30 pm" value="12.30 pm" />
      <Picker.Item label="1.00 pm" value="1.00 pm" />
      <Picker.Item label="1.30 pm" value="1.30 pm" />
      <Picker.Item label="2.00 pm" value="2.00 pm" />
      <Picker.Item label="2.30 pm" value="2.30 pm" />
      <Picker.Item label="3.00 pm" value="3.00 pm" />
      <Picker.Item label="3.30 pm" value="3.30 pm" />
      <Picker.Item label="4.00 pm" value="4.00 pm" />
      <Picker.Item label="4.30 pm" value="4.30 pm" />
      <Picker.Item label="5.00 pm" value="5.00 pm" />
      <Picker.Item label="5.30 pm" value="5.30 pm" />
      <Picker.Item label="6.00 pm" value="6.00 pm" />
      <Picker.Item label="6.30 pm" value="6.30 pm" />
      <Picker.Item label="7.00 pm" value="7.00 pm" />
      <Picker.Item label="7.30 pm" value="7.30 pm" />
      <Picker.Item label="8.00 pm" value="8.00 pm" />
      <Picker.Item label="8.30 pm" value="8.30 pm" />
      <Picker.Item label="9.00 pm" value="9.00 pm" />
      <Picker.Item label="9.30 pm" value="9.30 pm" />
      <Picker.Item label="10.00 pm" value="10.00 pm" />
      <Picker.Item label="10.30 pm" value="10.30 pm" />
      <Picker.Item label="11.00 pm" value="11.00 pm" />
      <Picker.Item label="11.30 pm" value="11.30 pm" />
    </Picker>
  );
};

export default ShopTimePicker;
