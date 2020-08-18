import AsyncStorage from '@react-native-community/async-storage';

export const storeJWT = async data => {
  try {
    await AsyncStorage.setItem('JWT', 'Bearer ' + data);
  } catch (error) {
    throw new Error(error);
  }
};
export const removeJWT = async () => {
  try {
    await AsyncStorage.removeItem('JWT');
  } catch (error) {
    throw new Error(error);
  }
};
export const retrieveJWT = async () => {
  try {
    const value = await AsyncStorage.getItem('JWT');
    return value;
  } catch (error) {
    return null;
  }
};
