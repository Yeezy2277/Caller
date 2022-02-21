import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Dimensions,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {FONTS} from '../constants/fonts';
import {COLORS} from '../constants/colors';
import AuthTopSvg from '../components/svg/AuthTopSvg.svg';
import AuthBottomSvg from '../components/svg/AuthBottomSvg.svg';
import FormComponent from '../components/FormComponent';
import {FORMTYPES} from '../constants/formTypes';
import {LANGUAGES} from '../constants/languages';
import {BottomSheetModal} from '@gorhom/bottom-sheet';
import {SEXTYPES} from '../constants/sexTypes';
import {AGES} from '../constants/ages';
import {USERTYPES} from '../constants/userTypes';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import {setTokenRequest} from '../constants/functions';
import {authApi} from '../constants/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAppDispatch } from "../store/hooks";
import { setAuth, setSignout } from "../store/authSlice";
import Preloader from "../components/Preloader";

const width = Dimensions.get('screen').width;
const height = Dimensions.get('screen').height;

const ProfileSettingsScreen = ({navigation}) => {
  const dispatch = useAppDispatch();
  const [isModalOpen, setModalOpen] = useState<boolean>(false);
  const [activeLanguage, setActiveLanguage] = useState(LANGUAGES.russian);
  const [activeGender, setActiveGender] = useState(SEXTYPES.male);
  const [activeAccountType, setActiveAccountType] = useState(USERTYPES.common);
  const [isPending, setPending] = useState<boolean>(false);
  const [activeAge, setActiveAge] = useState(AGES[0]);
  const [ages, setAges] = useState<AGES[]>(Object.values(AGES));
  const [activeDate, setActiveDate] = useState('Выбрать');

  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem('userToken').then(token => {
      authApi.getIncomingState(token).then(r => {
        setActiveGender(r.data.sex);
        setActiveLanguage(r.data.language);
        setActiveAge(r.data.age);
        setActiveAccountType(r.data.userType);
      });
    });
    // setTokenRequest(authApi.getIncomingState, {}).then(r => {
    //   setActiveGender(r.data.sex);
    //   setActiveLanguage(r.data.language);
    //   setActiveAge(r.data.age);
    //   setActiveAccountType(r.data.userType);
    // });
  }, []);
  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const onSubmit = () => {
    setPending(true);
    setTokenRequest(authApi.userProfile, {
      language: activeLanguage,
      sex: activeGender,
      birthday: activeDate === 'Выбрать' ? null : activeDate,
      age: activeAge,
      userType: activeAccountType,
    })
      .then(r => {
        console.log({
          language: activeLanguage,
          sex: activeGender,
          birthday: activeDate === 'Выбрать' ? null : activeDate,
          age: activeAge,
          userType: activeAccountType,
        });
        setPending(false);
        navigation.goBack();
      })
      .catch(err => console.log(err));
  };

  const handleConfirm = date => {
    setActiveDate(
      `${date.getDate() < 10 ? 0 : ''}${date.getDate()}.${
        date.getMonth() + 1 < 10 ? 0 : ''
      }${date.getMonth() + 1}.${date.getFullYear()}`,
    );
    hideDatePicker();
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

  const genders: SEXTYPES[] = [SEXTYPES.male, SEXTYPES.female];
  const userTypes: USERTYPES[] = [
    USERTYPES.common,
    USERTYPES.lawer,
    USERTYPES.psyholog,
  ];

  const bottomSheetLanguagesRef = useRef<BottomSheetModal>(null);
  const bottomSheetGendersRef = useRef<BottomSheetModal>(null);
  const bottomSheetAgesRef = useRef<BottomSheetModal>(null);
  const bottomSheetUserTypesRef = useRef<BottomSheetModal>(null);

  // variables
  const snapPointsLanguages = useMemo(() => ['60%', '60%'], []);
  const snapPointsGenders = useMemo(() => ['25%', '25%'], []);
  const snapPointsAges = useMemo(() => ['32%', '32%'], []);

  // callbacks
  const handlePresentLanguagesPress = useCallback(() => {
    bottomSheetLanguagesRef.current?.present();
    setModalOpen(false);
  }, []);
  const handlePresentGendersPress = useCallback(() => {
    bottomSheetGendersRef.current?.present();
    setModalOpen(false);
  }, []);
  const handlePresentAgesPress = useCallback(() => {
    bottomSheetAgesRef.current?.present();
    setModalOpen(false);
  }, []);
  const handlePresentUserTypesPress = useCallback(() => {
    bottomSheetUserTypesRef.current?.present();
    setModalOpen(false);
  }, []);

  const handleSheetChanges = useCallback((index: number) => {
    index === -1 ? setModalOpen(false) : setModalOpen(true);
    console.log('handleSheetChanges', index);
  }, []);

  const chooseLanguage = value => {
    return function () {
      setModalOpen(false);
      bottomSheetLanguagesRef.current?.dismiss();
      setActiveLanguage(value);
    };
  };
  const chooseGender = value => {
    return function () {
      setModalOpen(false);
      bottomSheetGendersRef.current?.dismiss();
      setActiveGender(value);
    };
  };
  const chooseAge = value => {
    return function () {
      setModalOpen(false);
      bottomSheetAgesRef.current?.dismiss();
      setActiveAge(value);
    };
  };
  const chooseUserTypes = value => {
    return function () {
      setModalOpen(false);
      bottomSheetUserTypesRef.current?.dismiss();
      setActiveAccountType(value);
    };
  };
  const onLeave = async () => {
    setPending(true);
    try {
      dispatch(setAuth(false));
      dispatch(setSignout(true));
      await AsyncStorage.removeItem('username');
      await AsyncStorage.removeItem('password');
      await AsyncStorage.removeItem('userToken');
      setPending(false);
    } catch (e) {
      console.log(e);
      setPending(false);
    }
  };
  const callCondition = item => {
    return item === 0 || item === 1 || item === 2 || item === 3;
  };

  return (
    <View style={styles.container}>
      {isPending ? <Preloader /> : null}
      <View style={styles.svgs}>
        <AuthTopSvg width={width} />
        <AuthBottomSvg width={width} />
      </View>
      <Text style={styles.title}>Настройки профиля</Text>
      <Text style={[styles.text, {marginTop: height * 0.03}]}>Язык</Text>
      <FormComponent
        type={FORMTYPES.button}
        onPress={handlePresentLanguagesPress}
        text={activeLanguage}
      />
      <BottomSheetModal
        enableDismissOnClose={true}
        enablePanDownToClose={true}
        ref={bottomSheetLanguagesRef}
        index={1}
        snapPoints={snapPointsLanguages}
        onChange={handleSheetChanges}>
        <View style={styles.contentContainer}>
          {languages.map(item => {
            return (
              <TouchableOpacity
                style={{height: '15%'}}
                onPress={chooseLanguage(item)}>
                <Text style={{fontSize: 16, color: COLORS.lightblue}}>
                  {item}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </BottomSheetModal>
      <Text style={[styles.text, {marginTop: height * 0.025}]}>Пол</Text>
      <FormComponent
        type={FORMTYPES.button}
        onPress={handlePresentGendersPress}
        text={activeGender}
      />
      <BottomSheetModal
        enableDismissOnClose={true}
        enablePanDownToClose={true}
        ref={bottomSheetGendersRef}
        index={1}
        snapPoints={snapPointsGenders}
        onChange={handleSheetChanges}>
        <View style={styles.contentContainer}>
          {genders.map(item => {
            return (
              <TouchableOpacity
                style={{height: '45%'}}
                onPress={chooseGender(item)}>
                <Text style={{fontSize: 16, color: COLORS.lightblue}}>
                  {item}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </BottomSheetModal>
      <View style={styles.birthdayAgeBlock}>
        <View>
          <Text style={[styles.text, {paddingLeft: 0}]}>Дата рождения</Text>
          <FormComponent
            type={FORMTYPES.button}
            width={width * 0.352}
            onPress={showDatePicker}
            text={activeDate}
          />
          <DateTimePickerModal
            isVisible={isDatePickerVisible}
            mode="date"
            display={Platform.OS === 'ios' ? 'inline' : 'default'}
            onConfirm={handleConfirm}
            cancelTextIOS={'Отмена'}
            confirmTextIOS={'Выбрать'}
            onCancel={hideDatePicker}
          />
        </View>
        <View>
          <Text style={[styles.text, {paddingLeft: 0}]}>Возраст</Text>
          <FormComponent
            type={FORMTYPES.button}
            width={width * 0.352}
            onPress={handlePresentAgesPress}
            text={activeAge}
          />
          <BottomSheetModal
            enableDismissOnClose={true}
            enablePanDownToClose={true}
            ref={bottomSheetAgesRef}
            index={1}
            snapPoints={snapPointsAges}
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
      </View>
      <FormComponent
        type={FORMTYPES.button}
        text={activeAccountType}
        onPress={handlePresentUserTypesPress}
        marginTop={height * 0.037}
      />
      <BottomSheetModal
        enableDismissOnClose={true}
        enablePanDownToClose={true}
        ref={bottomSheetUserTypesRef}
        index={1}
        snapPoints={snapPointsAges}
        onChange={handleSheetChanges}>
        <View style={styles.contentContainer}>
          {userTypes.map(item => {
            return callCondition(item) ? null : (
              <TouchableOpacity
                style={{height: '25%'}}
                onPress={chooseUserTypes(item)}>
                <Text style={{fontSize: 16, color: COLORS.lightblue}}>
                  {item}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </BottomSheetModal>
      <FormComponent
        type={FORMTYPES.button}
        backgroundColor={COLORS.green}
        color={COLORS.white}
        text={'Сохранить'}
        onPress={onSubmit}
        marginTop={height * 0.037}
      />
      <FormComponent
        type={FORMTYPES.button}
        text={'Выход'}
        onPress={onLeave}
        marginTop={height * 0.025}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: COLORS.violet,
  },
  title: {
    marginTop: height * 0.07,
    fontFamily: FONTS.montserrat600,
    color: COLORS.white,
    fontSize: height * 0.03,
  },
  svgs: {
    position: 'absolute',
    justifyContent: 'space-between',
    height,
  },
  text: {
    fontSize: height * 0.02,
    fontFamily: FONTS.montserrat600,
    color: COLORS.white,
    alignSelf: 'flex-start',
    textAlign: 'left',
    paddingLeft: width * 0.12,
    paddingBottom: height * 0.018,
  },
  birthdayAgeBlock: {
    width,
    marginTop: height * 0.04,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingLeft: width * 0.12,
    paddingRight: width * 0.12,
  },
  contentContainer: {
    flex: 1,
    marginTop: '2%',
    alignItems: 'center',
  },
});

export default ProfileSettingsScreen;
