import React from 'react';
import {Dimensions, StyleSheet, TouchableOpacity, View} from 'react-native';
import {COLORS} from '../constants/colors';
import Male from '../components/svg/MaleSvg.svg';
import Female from '../components/svg/FemaleSvg.svg';
import {chooseGenderPropsType} from '../constants/types';

const width = Dimensions.get('screen').width;
const height = Dimensions.get('screen').height;

const ChooseGender = (props: chooseGenderPropsType) => {
  return (
    <TouchableOpacity
      onPress={props.onPress}
      style={[
        styles.container,
        {borderColor: props.active ? COLORS.white : COLORS.darkblue},
      ]}>
      {props.gender === 'male' ? (
        <Male width={width * 0.035} height={height * 0.04} />
      ) : (
        <Female width={width * 0.035} height={height * 0.04} />
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: height * 0.069,
    height: height * 0.069,
    backgroundColor: COLORS.darkblue,
    borderRadius: width * 0.03,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
  },
});

export default ChooseGender;
