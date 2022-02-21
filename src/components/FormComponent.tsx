import React from 'react';
import {
  Dimensions,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import {FORMTYPES} from '../constants/formTypes';
import {COLORS} from '../constants/colors';
import {FONTS} from '../constants/fonts';
import {formComponentPropsType} from '../constants/types';

const width = Dimensions.get('screen').width;
const height = Dimensions.get('screen').height;

const FormComponent = (props: formComponentPropsType) => {
  return props.type === FORMTYPES.input ? (
    <TextInput
      style={[
        styles.input,
        {
          backgroundColor: props.backgroundColor ?? COLORS.white,
          marginTop: props.marginTop ?? 0.05,
          width: props.width ?? width * 0.77,
          height: props.height ?? height * 0.07,
        },
      ]}
      keyboardType={props.keyboardType}
      placeholder={props.placeholder}
      maxLength={props.maxLength}
      value={props.value}
      onChangeText={props.onChangeText}
      placeholderTextColor={COLORS.darkblue}
    />
  ) : props.type === FORMTYPES.button ? (
    <TouchableOpacity
      onPress={props.onPress}
      disabled={props.disabled}
      style={[
        styles.button,
        {
          backgroundColor: props.backgroundColor ?? COLORS.white,
          marginTop: props.marginTop ?? 0.05,
          width: props.width ?? width * 0.77,
          height: props.height ?? height * 0.07,
        },
      ]}>
      <Text
        style={[styles.buttonText, {color: props.color ?? COLORS.darkblue}]}>
        {props.text}
      </Text>
    </TouchableOpacity>
  ) : null;
};

const styles = StyleSheet.create({
  input: {
    borderRadius: width * 0.03,
    color: COLORS.darkblue,
    justifyContent: 'center',
    textAlign: 'center',
    fontSize: height * 0.022,
  },
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: width * 0.03,
  },
  buttonText: {
    fontFamily: FONTS.montserrat500,
    fontSize: height * 0.022,
  },
});

export default FormComponent;
