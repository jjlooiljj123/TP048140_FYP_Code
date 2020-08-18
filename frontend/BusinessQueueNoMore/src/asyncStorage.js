import AsyncStorage from '@react-native-community/async-storage';

export const storeJWT = async (data) => {
  try {
    await AsyncStorage.setItem('JWT_BUSINESS', 'Bearer ' + data);
  } catch (error) {
    throw new Error(error);
  }
};
export const removeJWT = async () => {
  try {
    await AsyncStorage.removeItem('JWT_BUSINESS');
  } catch (error) {
    throw new Error(error);
  }
};

export const retrieveJWT = async () => {
  try {
    const value = await AsyncStorage.getItem('JWT_BUSINESS');
    return value;
  } catch (error) {
    return null;
  }
};

export const storeUserId = async (data) => {
  try {
    await AsyncStorage.setItem('USERID', data);
  } catch (error) {
    throw new Error(error);
  }
};
export const removeUserId = async () => {
  try {
    await AsyncStorage.removeItem('USERID');
  } catch (error) {
    throw new Error(error);
  }
};

export const retrieveUserId = async () => {
  try {
    const value = await AsyncStorage.getItem('USERID');
    return value;
  } catch (error) {
    return null;
  }
};

export const storeShopId = async (data) => {
  try {
    await AsyncStorage.setItem('SHOPID', data);
  } catch (error) {
    throw new Error(error);
  }
};
export const removeShopId = async () => {
  try {
    await AsyncStorage.removeItem('SHOPID');
  } catch (error) {
    throw new Error(error);
  }
};

export const retrieveShopId = async () => {
  try {
    const value = await AsyncStorage.getItem('SHOPID');
    return value;
  } catch (error) {
    return null;
  }
};

export const storeUserRole = async (data) => {
  try {
    await AsyncStorage.setItem('USER_ROLE', data);
  } catch (error) {
    throw new Error(error);
  }
};
export const removeUserRole = async () => {
  try {
    await AsyncStorage.removeItem('USER_ROLE');
  } catch (error) {
    throw new Error(error);
  }
};

export const retrieveUserRole = async () => {
  try {
    const value = await AsyncStorage.getItem('USER_ROLE');
    return value;
  } catch (error) {
    return null;
  }
};
