import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import ActiveFieldSvg from '../components/svg/ActiveFieldSvg.svg';
import FreeThemeSvg from '../components/svg/FreeThemeSvg.svg';
import PsyhologThemeSvg from '../components/svg/PsyhologThemeSvg.svg';
import LawerThemeSvg from '../components/svg/LawerThemeSvg.svg';
import {FONTS} from '../constants/fonts';
import {themeComponentPropsType} from '../constants/types';
import {COLORS} from '../constants/colors';

const width = Dimensions.get('screen').width;
const height = Dimensions.get('screen').height;

const ThemeComponent = (props: themeComponentPropsType) => {
  return (
    <TouchableOpacity onPress={props.onPress}>
      <LinearGradient
        start={{x: 0, y: 1}}
        end={{x: 1, y: 0}}
        colors={['#1DA0FF', '#2575FC']}
        style={[
          styles.container,
          {marginLeft: props.marginLeft, marginRight: props.marginRight ?? 0},
        ]}>
        {props.active ? (
          <View style={{alignItems: 'flex-end'}}>
            <ActiveFieldSvg />
          </View>
        ) : (
          <View style={{width: 21, height: 21}} />
        )}
        <View>
          {props.theme === 'На свободную тему' ? (
            <FreeThemeSvg width={width * 0.12} height={height * 0.054} />
          ) : props.theme === 'Психолог' ? (
            <PsyhologThemeSvg width={width * 0.12} height={height * 0.054} />
          ) : props.theme === 'Юрист' ? (
            <LawerThemeSvg width={width * 0.12} height={height * 0.054} />
          ) : null}
        </View>
        <Text style={styles.text}>
          {props.theme === 'На свободную тему'
            ? 'На свободную тему'
            : props.theme === 'Психолог'
            ? 'Психолог'
            : props.theme === 'Юрист'
            ? 'Юрист'
            : null}
        </Text>
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: height * 0.3,
    height: height * 0.16,
    borderRadius: width * 0.04,
    paddingTop: height * 0.025,
    paddingLeft: width * 0.07,
    paddingRight: width * 0.05,
    zIndex: 5,
  },
  text: {
    fontFamily: FONTS.montserrat600,
    fontSize: height * 0.019,
    letterSpacing: width * 0.00225,
    paddingBottom: height * 0.025,
    color: COLORS.white,
  },
});

export default ThemeComponent;
