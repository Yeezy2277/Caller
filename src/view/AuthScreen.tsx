import React, {useEffect, useState} from 'react';
import {
  Alert,
  Dimensions,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import AuthTopSvg from '../components/svg/AuthTopSvg.svg';
import AuthBottomSvg from '../components/svg/AuthBottomSvg.svg';
import LogoSvg from '../components/svg/LogoSvg.svg';
import LogoTextSvg from '../components/svg/LogoTextSvg.svg';
import ActiveCheckboxSvg from '../components/svg/ActiveCheckboxSvg.svg';
import NotActiveCheckboxSvg from '../components/svg/NotActiveCheckboxSvg.svg';
import FormComponent from '../components/FormComponent';
import {FORMTYPES} from '../constants/formTypes';
import {COLORS} from '../constants/colors';
import {Props} from '../constants/types';
import {Voximplant} from 'react-native-voximplant';
import {authApi, code, sendCode} from '../constants/api';
const width = Dimensions.get('screen').width;
const height = Dimensions.get('screen').height;
import {TextInputMask} from 'react-native-masked-text';
import calls, {RootState} from '../store/store';
import Preloader from '../components/Preloader';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {setAuth} from '../store/authSlice';
import {useAppDispatch, useAppSelector} from '../store/hooks';
import { setTokenRequest } from "../constants/functions";

const AuthScreen = ({navigation}: Props) => {
  const dispatch = useAppDispatch();
  const commonState = useAppSelector((state: RootState) => state.slice);
  const [checkboxes, setCheckboxes] = useState({
    checkbox1: true,
    checkbox2: true,
  });
  const [err, setErr] = useState<string>('');
  const client = Voximplant.getInstance();
  const [phoneField, setPhoneField] = useState<any>();
  const [isPending, setPending] = useState<boolean>(true);
  const updateCheckbox = (name: keyof typeof checkboxes, bool: boolean) => {
    return function () {
      let object = {...checkboxes};
      object[name] = bool;
      setCheckboxes(object);
    };
  };
  const [phone, setPhone] = useState<string>('');
  useEffect(() => {
    console.log('isAuth', commonState.isAuth);
  }, [commonState.isAuth]);
  useEffect(() => {
    (async () => {
      try {
        // console.log(responseAuth);
        const token = await AsyncStorage.getItem('userToken');
        console.log('token' + token);
        const phoneString = await AsyncStorage.getItem('username');
        console.log('phoneString' + phoneString);
        console.log('isSignout', commonState.isSignout);
        let clientState = await client.getClientState();
        if (clientState === Voximplant.ClientState.DISCONNECTED) {
          await client.connect();
          let authResult = await client.login(
            `${phoneString}@caller.yeazzy1122.n4.voximplant.com`,
            'gh85962h7d6h27d6d6',
          );
          console.log(authResult);
        }
        if (clientState === Voximplant.ClientState.CONNECTED) {
          let authResult = await client.login(
            `${phoneString}@caller.yeazzy1122.n4.voximplant.com`,
            'gh85962h7d6h27d6d6',
          );
          console.log(authResult);
        }
        token === null || phoneString === null || commonState.isSignout
          ? dispatch(setAuth(false))
          : dispatch(setAuth(true));
        setPending(false);
      } catch (e) {
        console.log(e);
        setPending(false);
      }
    })();
  }, [commonState.isSignout]);
  const onSubmit = () => {
    setPending(true);
    authApi
      .code({phone: phoneField.getRawValue()})
      .then(r => {
        if (r === undefined) {
          setErr(r);
        } else {
          setPending(false);
          navigation.navigate('Code', {phone: phoneField.getRawValue()});
        }
      })
      .catch(error => {
        setErr(error.toString());
      });
  };
  const disabled =
    !checkboxes.checkbox1 || !checkboxes.checkbox2 || phone.length < 18;
  async function login() {
    const Vemail = 'vital.popov.03@gmail.com';
    const Vpassword = 'jystas-wivjit-seMdu5';
    const responseM = await fetch(
      'https://api.voximplant.com/platform_api/Logon/?account_email=' +
        Vemail +
        '&account_password=' +
        Vpassword,
    );
    const jsonM = await responseM.json();
    const api_key = jsonM.api_key;
    const account_id = JSON.stringify(jsonM.account_id);
    // await AsyncStorage.setItem("API", api_key);
    // await AsyncStorage.setItem("ACC_ID", account_id);
    console.log(api_key);
    console.log(account_id);
  }

  return (
    <FlatList
      data={['1']}
      showsVerticalScrollIndicator={false}
      style={{flex: 1, backgroundColor: COLORS.violet}}
      renderItem={({item}) => (
        <View
          style={{
            alignItems: 'center',
            flex: 1,
          }}>
          {isPending ? <Preloader /> : null}
          <View style={styles.svgs}>
            <AuthTopSvg width={width} />
            <AuthBottomSvg width={width} />
          </View>
          <View style={{marginTop: height * 0.08}}>
            <LogoSvg width={height * 0.14} height={height * 0.14} />
          </View>
          <View style={{marginTop: width * 0.08}}>
            <LogoTextSvg width={height * 0.32} height={height * 0.065} />
          </View>
          <TextInputMask
            style={styles.input}
            type={'cel-phone'}
            maxLength={18}
            options={{
              maskType: 'BRL',
              withDDD: true,
              dddMask: '+7 (999) 999-99-99',
            }}
            value={phone}
            ref={(ref): void => setPhoneField(ref)}
            onChangeText={setPhone}
          />
          <FormComponent
            onPress={onSubmit}
            disabled={disabled}
            marginTop={width * 0.05}
            type={FORMTYPES.button}
            text={'Войти'}
          />
          <View style={{marginTop: height * 0.05, flexDirection: 'row'}}>
            <TouchableOpacity
              onPress={updateCheckbox('checkbox1', !checkboxes.checkbox1)}>
              {checkboxes.checkbox1 ? (
                <ActiveCheckboxSvg
                  width={height * 0.037}
                  height={height * 0.037}
                />
              ) : (
                <NotActiveCheckboxSvg
                  width={height * 0.037}
                  height={height * 0.037}
                />
              )}
            </TouchableOpacity>
            <Text style={styles.checkboxText}>
              Даю согласие на обработку персоналных данных
            </Text>
          </View>
          <View style={{marginTop: height * 0.016, flexDirection: 'row'}}>
            <TouchableOpacity
              onPress={updateCheckbox('checkbox2', !checkboxes.checkbox2)}>
              {checkboxes.checkbox2 ? (
                <ActiveCheckboxSvg
                  width={height * 0.037}
                  height={height * 0.037}
                />
              ) : (
                <NotActiveCheckboxSvg
                  width={height * 0.037}
                  height={height * 0.037}
                />
              )}
            </TouchableOpacity>
            <Text style={[styles.checkboxText]}>Договор оферту принимаю.</Text>
          </View>
          <Text
            style={[
              styles.checkboxText,
              {
                marginTop: height * 0.028,
                fontSize: height * 0.018,
                lineHeight: 15,
                width: width * 0.77,
              },
            ]}>
            При входе вы подтверждаете согласие с условиями использования и
            политикой о данных пользователей.
          </Text>
        </View>
      )}
    />
  );
};

const styles = StyleSheet.create({
  checkboxText: {
    textAlign: 'center',
    color: COLORS.whiteOpacity,
    width: '70%',
    fontSize: height * 0.02,
    fontWeight: '500',
    lineHeight: 24,
  },
  svgs: {
    position: 'absolute',
    justifyContent: 'space-between',
    height,
  },
  input: {
    borderRadius: width * 0.03,
    color: COLORS.darkblue,
    justifyContent: 'center',
    textAlign: 'center',
    fontSize: height * 0.022,
    backgroundColor: COLORS.whiteOpacity,
    marginTop: height * 0.08,
    width: width * 0.77,
    height: height * 0.07,
  },
});

export default AuthScreen;
