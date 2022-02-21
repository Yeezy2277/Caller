import React from 'react';
import {Dimensions, StyleSheet, Text, TouchableOpacity} from 'react-native';
import {COLORS} from '../constants/colors';
import AgeSvg from '../components/svg/AgeSvg.svg';

const width = Dimensions.get('screen').width;
const height = Dimensions.get('screen').height;

const ChooseAge = props => {
  return (
    <TouchableOpacity style={styles.container} onPress={props.onPress}>
      <Text style={{color: COLORS.white}}>{props.text}</Text>
      <AgeSvg height={height * 0.007} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.darkblue,
    borderRadius: width * 0.03,
    width: width * 0.41,
    paddingLeft: width * 0.064,
    height: height * 0.069,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
});

export default ChooseAge;
