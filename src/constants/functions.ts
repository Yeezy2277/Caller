import AsyncStorage from '@react-native-async-storage/async-storage';

export async function setTokenRequest(req, data) {
  try {
    const token = await AsyncStorage.getItem('userToken');
    return await req(data, token);
  } catch (e) {
    console.log(e);
  }
}
