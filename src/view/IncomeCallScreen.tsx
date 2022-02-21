import {useNavigation} from '@react-navigation/native';
import React, {useState, useEffect} from 'react';
import {
  Dimensions,
  PermissionsAndroid,
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import calls from '../store/store';
import {Voximplant} from 'react-native-voximplant';
import IncomeCallTopSvg from '../components/svg/IncomeCallTopSvg.svg';
import IncomeCallBottomSvg from '../components/svg/IncomeCallBottomSvg.svg';
import AvatarSvg from '../components/svg/AvatarSvg.svg';
import DeclineCallSvg from '../components/svg/DeclineCallSvg.svg';
import AcceptCallSvg from '../components/svg/AcceptCallSvg.svg';
import BreakCallSvg from '../components/svg/BreakCallSvg.svg';
import {COLORS} from '../constants/colors';
import {FONTS} from '../constants/fonts';

const width = Dimensions.get('screen').width;
const height = Dimensions.get('screen').height;

const IncomingCallScreen = ({route}) => {
  const navigation = useNavigation();
  const {callId} = route.params;
  const [caller, setCaller] = useState('Unknown');

  useEffect(() => {
    let call = calls.get(callId);
    console.log('callId - ' + callId);
    setCaller(call.getEndpoints()[0].displayName);
    call.on(Voximplant.CallEvents.Disconnected, callEvent => {
      calls.delete(callEvent.call.callId);
      navigation.navigate('Home');
    });
    return function cleanup() {
      call.off(Voximplant.CallEvents.Disconnected);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [callId]);

  async function answerCall() {
    try {
      if (Platform.OS === 'android') {
        let permission = PermissionsAndroid.PERMISSIONS.RECORD_AUDIO;
        const granted = await PermissionsAndroid.request(permission);
        const recordAudioGranted = granted === 'granted';
        if (recordAudioGranted) {
          return;
        } else {
          console.warn(
            'MainScreen: makeCall: record audio permission is not granted',
          );
          return;
        }
      }
      navigation.navigate('Call', {
        isVideoCall: false,
        callId,
        isIncomingCall: true,
      });
    } catch (e) {
      console.warn(`MainScreen: makeCall failed: ${e}`);
    }
  }

  async function declineCall() {
    let call = calls.get(callId);
    call.decline();
  }

  return (
    <View style={styles.container}>
      <View style={styles.svgs}>
        <IncomeCallTopSvg width={width} />
        <IncomeCallBottomSvg width={width} />
      </View>
      <Text style={styles.text}>Входящий</Text>
      <View style={{marginTop: height * 0.08}}>
        <AvatarSvg width={height * 0.19} height={height * 0.19} />
      </View>
      <View
        style={{
          marginTop: height * 0.25,
          flexDirection: 'row',
          alignItems: 'center',
        }}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <TouchableOpacity
            onPress={declineCall}
            style={{marginRight: height * 0.06, alignItems: 'center'}}>
            <DeclineCallSvg width={height * 0.12} height={height * 0.12} />
            <Text style={styles.buttonText}>Отклонить</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={answerCall}
            style={{marginLeft: height * 0.06, alignItems: 'center'}}>
            <AcceptCallSvg width={height * 0.12} height={height * 0.12} />
            <Text style={styles.buttonText}>Принять</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.violet,
    alignItems: 'center',
  },
  svgs: {
    position: 'absolute',
    height,
    justifyContent: 'space-between',
  },
  text: {
    marginTop: height * 0.13,
    fontFamily: FONTS.montserrat600,
    color: COLORS.white,
    fontSize: height * 0.03,
  },
  buttonText: {
    fontFamily: FONTS.montserrat500,
    color: COLORS.white,
    marginTop: height * 0.03,
    fontSize: height * 0.027,
  },
});

export default IncomingCallScreen;
