import React from 'react';
import {Dimensions, StyleSheet, TouchableOpacity, Text} from 'react-native';
import {chooseLanguagePropsType} from '../constants/types';
import {COLORS} from '../constants/colors';
import { FONTS } from "../constants/fonts";

const width = Dimensions.get('screen').width;
const height = Dimensions.get('screen').height;

const ChooseLanguage = (props: chooseLanguagePropsType) => {
  return (
    <TouchableOpacity
      onPress={props.onPress}
      style={[
        styles.container,
        {
          borderColor: props.active ? COLORS.white : COLORS.darkblue,
          marginLeft: props.marginLeft ?? 0,
          marginRight: props.marginRight ?? 0,
        },
      ]}>
      <Text style={styles.text}>{props.language}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.darkblue,
    borderWidth: 1,
    borderRadius: width * 0.03,
    width: width * 0.41,
    height: height * 0.069,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: height * 0.02,
    fontFamily: FONTS.montserrat600,
    color: COLORS.white,
  },
});

export default ChooseLanguage;
