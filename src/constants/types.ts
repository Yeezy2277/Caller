import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {FORMTYPES} from './formTypes';
import {COLORS} from './colors';
import {LANGUAGES} from './languages';
import {Dispatch, SetStateAction} from 'react';

export type RootStackParamList = {
  Auth: undefined | object;
  Code: {phone: string} | undefined;
  Home: undefined | object;
  Call: undefined | object;
  CallMe: undefined | object;
  Profile: undefined | object;
  IncomingCall: undefined | object;
};

export type Props = NativeStackScreenProps<
  RootStackParamList,
  keyof RootStackParamList
>;

export type initialStateType = {
  isAuth: boolean;
  token: string;
  isSignout: boolean;
};

export type formComponentPropsType = {
  type: keyof typeof FORMTYPES;
  backgroundColor?: COLORS;
  color?: COLORS;
  text?: string;
  placeholder?: string;
  marginTop?: number;
  onPress?: () => void;
  width?: number;
  height?: number;
  maxLength?: number;
  value?: string;
  keyboardType?: string;
  disabled?: boolean;
  onChangeText?: (text: string) => void | Dispatch<SetStateAction<string>>;
};

export type themeComponentPropsType = {
  active: boolean;
  theme: 'free' | 'psyholog' | 'lawer';
  marginLeft?: number;
  marginRight?: number;
};

export type chooseGenderPropsType = {
  active: boolean;
  gender: 'male' | 'female';
};

export type chooseLanguagePropsType = {
  language: LANGUAGES;
  onPress: () => void;
  active: boolean;
  marginLeft?: number;
  marginRight?: number;
};

export type configType = {
  baseURL: 'http://80.78.244.88:3000/api/';
  headers: {
    Accept: 'application/json';
    'Content-Type': 'application/json';
  };
};
