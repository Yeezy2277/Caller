import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {
  Dimensions,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  SafeAreaView,
  Platform,
  PermissionsAndroid,
} from 'react-native';
import {COLORS} from '../constants/colors';
import AuthTopSvg from '../components/svg/AuthTopSvg.svg';
import AuthBottomSvg from '../components/svg/AuthBottomSvg.svg';
import {FONTS} from '../constants/fonts';
import ProfileAvatarSvg from '../components/svg/ProfileAvatarSvg.svg';
import CallStartSvg from '../components/svg/CallStartSvg.svg';
import ActiveToggleSvg from '../components/svg/ActiveToggleSvg.svg';
import NotActiveToggleSvg from '../components/svg/NotActiveToggleSvg.svg';
import ThemeComponent from '../components/ThemeComponent';
import ChooseGender from '../components/ChooseGender';
import ChooseAge from '../components/ChooseAge';
import ChooseLanguage from '../components/ChooseLanguage';
import {FORMTYPES} from '../constants/formTypes';
import {USERTYPES} from '../constants/userTypes';
import {LANGUAGES} from '../constants/languages';
import {Props} from '../constants/types';
import {BottomSheetModal} from '@gorhom/bottom-sheet';
import {AGES} from '../constants/ages';
import {Voximplant} from 'react-native-voximplant';
import calls from '../store/store';
import {SEXTYPES} from '../constants/sexTypes';
import {authApi} from '../constants/api';
import {setTokenRequest} from '../constants/functions';
import AsyncStorage from '@react-native-async-storage/async-storage';

const height = Dimensions.get('screen').height;
const width = Dimensions.get('screen').width;

const HomeScreen = ({navigation, route}: Props) => {
  const [isIncoming, setIncoming] = useState<boolean>(false);
  const [isNeedCall, setNeedCall] = useState(false);
  const [ages, setAges] = useState<AGES[]>(Object.values(AGES));
  const [activeLanguage, setActiveLanguage] = useState(LANGUAGES.japan);
  const [activeTheme, setActiveTheme] = useState(USERTYPES.lawer);
  const [isAccessIncoming, setAccessIncoming] = useState<boolean>(true);
  const [activeGender, setActiveGender] = useState(SEXTYPES.male);
  const [activeAge, setActiveAge] = useState(AGES[0]);
  const [callType, setCallType] = useState('none');
  const [callId, setCallId] = useState<any>(0);
  const [caller, setCaller] = useState('unknown');
  const [isPending, setPending] = useState<boolean>(true);
  const client = Voximplant.getInstance();
  const [isModalOpen, setModalOpen] = useState<boolean>(false);
  const panelsData: Array<'На свободную тему' | 'Психолог' | 'Юрист'> = [
    'На свободную тему',
    'Психолог',
    'Юрист',
  ];
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  // variables
  const snapPoints = useMemo(() => ['50%', '50%'], []);

  // callbacks
  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
    setModalOpen(false);
  }, []);
  const handleSheetChanges = useCallback((index: number) => {
    index === -1 ? setModalOpen(false) : setModalOpen(true);
    console.log('handleSheetChanges', index);
  }, []);
  const setIncomingState = () => {
    setPending(true);
    setTokenRequest(authApi.setIncomingState, {
      isIncoming: !isAccessIncoming,
    }).then(r => {
      if (r === undefined) {
        return;
      } else {
        console.log(r);
        console.log(!isAccessIncoming);
        setAccessIncoming(!isAccessIncoming);
        setPending(false);
      }
    });
  };
  useEffect(() => {
    client.on(Voximplant.ClientEvents.IncomingCall, incomingCallEvent => {
      calls.set(incomingCallEvent.call.callId, incomingCallEvent.call);
      navigation.navigate('IncomingCall', {
        callId: incomingCallEvent.call.callId,
      });
    });
    return function cleanup() {
      client.off(Voximplant.ClientEvents.IncomingCall);
    };
  });
  useEffect(() => {
    (async () => {
      try {
        console.log(calls);
        const token = await AsyncStorage.getItem('userToken');
        authApi.getIncomingState(token).then(r => {
          console.log(r);
          console.log(r);
          setAccessIncoming(r.data.isIncome);
          setPending(false);
        });
      } catch (e) {
        console.log(e);
      }
    })();
  }, []);

  async function makeCall() {
    try {
      if (Platform.OS === 'android') {
        let permission = PermissionsAndroid.PERMISSIONS.RECORD_AUDIO;
        const granted = await PermissionsAndroid.request(permission);
        if (granted) {
          if (!granted) {
            console.warn(
              'MainScreen: makeCall: audio permission is not granted',
            );
            return;
          }
        } else {
          console.warn(
            'MainScreen: makeCall: record audio permission is not granted',
          );
          return;
        }
      }
      const phones = await setTokenRequest(authApi.users, {
        language: activeLanguage,
        sex: activeGender,
        age: activeAge,
        userType: activeTheme,
      });
      console.log({
        language: activeLanguage,
        sex: activeGender,
        age: activeAge,
        userType: activeTheme,
      });
      navigation.navigate('Call', {
        isVideoCall: false,
        isIncomingCall: false,
        phones: phones.data,
        callAgain: makeCall,
      });
    } catch (e) {
      console.warn(`MainScreen: makeCall failed: ${e}`);
    }
  }
  const callCondition = item => {
    return item === 0 || item === 1 || item === 2 || item === 3;
  };
  const languages: LANGUAGES[] = [
    LANGUAGES.russian,
    LANGUAGES.english,
    LANGUAGES.ukrainian,
    LANGUAGES.french,
    LANGUAGES.italian,
    LANGUAGES.spanish,
    LANGUAGES.japan,
  ];
  const onTransferProfile = () => {
    navigation.navigate('Profile');
  };
  const chooseAge = value => {
    return function () {
      setModalOpen(false);
      bottomSheetModalRef.current?.dismiss();
      setActiveAge(value);
    };
  };

  return (
    <SafeAreaView style={styles.container}>
      <View
        style={[
          styles.grayBackground,
          {display: isModalOpen ? 'flex' : 'none'},
        ]}
      />
      <View style={styles.svgs}>
        <AuthTopSvg width={width} />
        <AuthBottomSvg width={width} />
      </View>
      <TouchableOpacity
        onPress={onTransferProfile}
        style={{
          alignItems: 'flex-end',
          marginTop: height * 0.0012,
          marginRight: width * 0.128,
        }}>
        <ProfileAvatarSvg width={width * 0.1} height={height * 0.047} />
      </TouchableOpacity>
      <Text style={styles.title}>Я хочу поговорить :</Text>
      <View style={{marginTop: height * 0.018}}>
        <FlatList
          data={panelsData}
          showsHorizontalScrollIndicator={false}
          horizontal={true}
          renderItem={({item}) => (
            <ThemeComponent
              onPress={() => setActiveTheme(item)}
              marginLeft={item === 'На свободную тему' ? width * 0.12 : width * 0.064}
              marginRight={item === 'Юрист' ? width * 0.12 : 0}
              active={item === activeTheme}
              theme={item}
            />
          )}
        />
      </View>
      <View style={styles.titles}>
        <Text
          style={[
            styles.title,
            {marginTop: 0, marginLeft: 0, fontSize: height * 0.02},
          ]}>
          Пол
        </Text>
        <Text
          style={[
            styles.title,
            {marginTop: 0, marginLeft: width * 0.264, fontSize: height * 0.02},
          ]}>
          Возраст
        </Text>
      </View>
      <View
        style={{
          marginLeft: width * 0.12,
          marginRight: width * 0.12,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginTop: height * 0.014,
        }}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <ChooseGender
            onPress={() => setActiveGender('Мужской')}
            active={activeGender === 'Мужской'}
            gender={'Мужчина'}
          />
          <View style={{marginLeft: width * 0.032}}>
            <ChooseGender
              onPress={() => setActiveGender('Женщина')}
              active={activeGender === 'Женщина'}
              gender={'Женщина'}
            />
          </View>
        </View>
        <ChooseAge onPress={handlePresentModalPress} text={activeAge} />
        <BottomSheetModal
          enableDismissOnClose={true}
          enablePanDownToClose={true}
          ref={bottomSheetModalRef}
          index={1}
          snapPoints={snapPoints}
          onChange={handleSheetChanges}>
          <View style={styles.contentContainer}>
            {ages.map(item => {
              return callCondition(item) ? null : (
                <TouchableOpacity
                  style={{height: '25%'}}
                  onPress={chooseAge(item)}>
                  <Text style={{fontSize: 16, color: COLORS.lightblue}}>
                    {item}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </BottomSheetModal>
      </View>
      <Text
        style={[
          styles.title,
          {marginTop: width * 0.03, fontSize: height * 0.02},
        ]}>
        На языке
      </Text>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginTop: width * 0.024,
        }}>
        <FlatList
          horizontal={true}
          data={languages}
          showsHorizontalScrollIndicator={false}
          renderItem={({item}) => (
            <ChooseLanguage
              marginLeft={item === 'Русский' ? width * 0.12 : width * 0.061}
              marginRight={item === 'Японский' ? width * 0.12 : 0}
              language={item}
              onPress={() => setActiveLanguage(item)}
              active={item === activeLanguage}
            />
          )}
        />
      </View>
      <TouchableOpacity style={styles.call} onPress={makeCall}>
        <CallStartSvg width={height * 0.24} height={height * 0.24} />
        <Text
          style={{
            fontSize: height * 0.027,
            marginTop: height * 0.02,
            color: COLORS.white,
            fontFamily: FONTS.montserrat500,
          }}>
          Набрать
        </Text>
      </TouchableOpacity>
      <View style={styles.bottomTextBlock}>
        <Text style={styles.bottomText}>Готов принимать входящие звонки</Text>
        <TouchableOpacity onPress={setIncomingState}>
          {isAccessIncoming ? (
            <ActiveToggleSvg width={width * 0.18} height={width * 0.059} />
          ) : (
            <NotActiveToggleSvg width={width * 0.18} height={width * 0.059} />
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.violet,
  },
  grayBackground: {
    width,
    height,
    backgroundColor: 'rgba(0,0,0,0.0)',
    position: 'absolute',
    zIndex: 10,
  },
  svgs: {
    position: 'absolute',
    justifyContent: 'space-between',
    height: height,
  },
  title: {
    marginLeft: width * 0.12,
    marginTop: width * 0.072,
    fontFamily: FONTS.montserrat500,
    color: COLORS.white,
    fontSize: height * 0.027,
    letterSpacing: width * 0.005,
  },
  panels: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  titles: {
    marginTop: width * 0.038,
    marginLeft: width * 0.12,
    flexDirection: 'row',
  },
  call: {
    width,
    alignItems: 'center',
    marginTop: width * 0.038,
  },
  bottomTextBlock: {
    width,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: width * 0.015,
    paddingRight: width * 0.12,
    paddingLeft: width * 0.12,
    paddingBottom: height * 0.043,
  },
  bottomText: {
    fontSize: width * 0.032,
    fontFamily: FONTS.montserrat400,
    color: COLORS.white,
  },
  contentContainer: {
    flex: 1,
    marginTop: '10%',
    alignItems: 'center',
  },
});

export default HomeScreen;
