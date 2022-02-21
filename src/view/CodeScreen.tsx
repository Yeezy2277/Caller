import React, {useState} from 'react';
import {Dimensions, StyleSheet, Text, View} from 'react-native';
import {COLORS} from '../constants/colors';
import CodeTopSvg from '../components/svg/CodeTopSvg.svg';
import CodeBottomSvg from '../components/svg/CodeBottomSvg.svg';
import {FONTS} from '../constants/fonts';
import FormComponent from '../components/FormComponent';
import {FORMTYPES} from '../constants/formTypes';
import {Props} from '../constants/types';
import {authApi} from '../constants/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Voximplant} from 'react-native-voximplant';
import {useAppDispatch, useAppSelector} from '../store/hooks';
import {RootState} from '../store/store';
import {setAuth, setSignout} from '../store/authSlice';
import Preloader from "../components/Preloader";

const height = Dimensions.get('screen').height;
const width = Dimensions.get('screen').width;

const CodeScreen = ({navigation, route}: Props) => {
  const dispatch = useAppDispatch();
  const commonState = useAppSelector((state: RootState) => state.slice);
  const client = Voximplant.getInstance();
  const [code, setCode] = useState<string>('');
  const [isPending, setPending] = useState<boolean>(false);
  const onSubmit = () => {
    setPending(true);
    authApi
      .login(route?.params?.phone, code)
      .then(async responseAuth => {
        if (responseAuth === undefined) {
          console.log(responseAuth);
        } else {
          try {
            console.log('phone voximplant', route?.params?.phone);
            await AsyncStorage.setItem('userToken', responseAuth.data.token);
            await AsyncStorage.setItem('username', route?.params?.phone);
            await AsyncStorage.setItem('password', 'gh85962h7d6h27d6d6');
            let clientState = await client.getClientState();
            if (clientState === Voximplant.ClientState.DISCONNECTED) {
              await client.connect();
              let authResult = await client.login(
                `${route?.params?.phone}@caller.yeazzy1122.n4.voximplant.com`,
                'gh85962h7d6h27d6d6',
              );
              console.log(authResult);
            }
            if (clientState === Voximplant.ClientState.CONNECTED) {
              let authResult = await client.login(
                `${route?.params?.phone}@caller.yeazzy1122.n4.voximplant.com`,
                'gh85962h7d6h27d6d6',
              );
              console.log(authResult);
            }
            dispatch(setAuth(true));
            dispatch(setSignout(false));
            setPending(false);
          } catch (e) {
            console.log(e);
          }
        }
      })
      .catch(err => console.log(err.response.data.message));
  };

  return (
    <View style={styles.container}>
      {isPending ? <Preloader /> : null}
      <View style={styles.svgs}>
        <CodeTopSvg width={width} />
        <CodeBottomSvg width={width} />
      </View>
      <View style={{marginTop: height * 0.24, width: width * 0.77}}>
        <Text style={styles.text}>На ваш номер отправлено SMS сообщение</Text>
        <Text
          style={[
            styles.text,
            {
              marginTop: height * 0.052,
              fontSize: height * 0.022,
              fontFamily: FONTS.montserrat500,
            },
          ]}>
          Введите 4 значный код
        </Text>
        <FormComponent
          onChangeText={setCode}
          value={code}
          maxLength={4}
          keyboardType={'numeric'}
          type={FORMTYPES.input}
          marginTop={height * 0.074}
          placeholder={'----'}
        />
        <FormComponent
          type={FORMTYPES.button}
          marginTop={height * 0.023}
          text={'Подтвердить'}
          onPress={onSubmit}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.violet,
    flex: 1,
    alignItems: 'center',
  },
  svgs: {
    position: 'absolute',
    justifyContent: 'space-between',
    height,
  },
  text: {
    fontSize: height * 0.02,
    fontFamily: FONTS.montserrat600,
    color: COLORS.whiteOpacity,
    textAlign: 'center'
  },
});

export default CodeScreen;
