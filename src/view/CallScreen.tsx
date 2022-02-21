import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  Dimensions,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Alert,
} from 'react-native';
import IncomeCallTopSvg from '../components/svg/IncomeCallTopSvg.svg';
import IncomeCallBottomSvg from '../components/svg/IncomeCallBottomSvg.svg';
import AcceptCallSvg from '../components/svg/AcceptCallSvg.svg';
import DeclineCallSvg from '../components/svg/DeclineCallSvg.svg';
import BreakCallSvg from '../components/svg/BreakCallSvg.svg';
import AvatarSvg from '../components/svg/AvatarSvg.svg';
import AvatarBreakSvg from '../components/svg/AvatarBreak.svg';
import {COLORS} from '../constants/colors';
import {FONTS} from '../constants/fonts';
import {Props} from '../constants/types';
import calls from '../store/store';
import {Voximplant} from 'react-native-voximplant';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CallStartSvg from '../components/svg/CallStartSvg.svg';
import BackArrowSvg from '../components/svg/BackArrowSvg.svg';

const width = Dimensions.get('screen').width;
const height = Dimensions.get('screen').height;

const CallScreen = ({
  navigation,
  callType,
  setCallType,
  route,
}: Props) => {
  const {isIncomingCall, isVideoCall, callee, phones, callAgain} = route.params;
  const [callState, setCallState] = useState<string>('Connecting');
  const [isPending, setPending] = useState<boolean>(true);
  const [counterSecond, setCounterSecond] = useState<number>(0);
  const [counterMinute, setCounterMinute] = useState<number>(0);
  const [countNumbers, setCountNumbers] = useState<number>(0);
  const [currentNumber, setCurrentNumber] = useState<string>('');
  const callId = useRef(route.params.callId);
  const voximplant = Voximplant.getInstance();

  useEffect(() => {
    let callSettings = {
      video: {
        sendVideo: false,
        receiveVideo: false,
      },
    };

    let call;
    let endpoint;
    async function makeCall() {
      try {
        const phoneNumber = await AsyncStorage.getItem('username');
        setCurrentNumber(phoneNumber);
        console.log(phones);
        // console.log(phones[countNumbers].phone);
        console.log(phones.length === 0);
        if (phones.length === 0) {
          setCallState('Failed');
          setPending(false);
        } else {
          call = await voximplant.call(
            phones[countNumbers].phone,
            callSettings,
          );
          console.log(call);
          subscribeToCallEvents();
          callId.current = call.callId;
          console.log('call id', callId);
          calls.set(call.callId, call);
          console.log(calls);
        }
      } catch (e) {
        console.log(e);
      }
    }

    async function answerCall() {
      call = calls.get(callId.current);
      subscribeToCallEvents();
      endpoint = call.getEndpoints()[0];
      await call.answer(callSettings);
    }

    function subscribeToCallEvents() {
      call.on(Voximplant.CallEvents.Connected, callEvent => {
        setCallState('Call connected');
        setPending(false);
      });
      call.on(Voximplant.CallEvents.Disconnected, callEvent => {
        calls.delete(callEvent.call.callId);
        navigation.navigate('Home');
        setPending(false);
      });
      call.on(Voximplant.CallEvents.Failed, callEvent => {
        if (countNumbers + 1 >= phones.length) {
          showCallError(callEvent.reason, callEvent);
          setCallState('Failed');
          setPending(false);
        } else {
          let count = countNumbers + 1;
          console.log('звоним - ', phones[count].phone);
          setCountNumbers(count);
          voximplant.call(phones[count].phone, callSettings).then(r => {
            console.log(r);
          });
          showCallError(callEvent.reason, callEvent);
        }
      });
      call.on(Voximplant.CallEvents.ProgressToneStart, callEvent => {
        setCallState('Ringing');
        setPending(true);
      });
    }

    function showCallError(reason: string, callEvent) {
      Alert.alert('Ошибка', reason, [
        {
          text: 'OK',
          onPress: () => {
            calls.delete(callEvent.call.callId);
          },
        },
      ]);
    }

    function getCallFunction() {
      if (isIncomingCall) {
        answerCall();
      } else {
        makeCall();
      }
    }

    getCallFunction();

    return function cleanup() {
      call.off(Voximplant.CallEvents.Connected);
      call.off(Voximplant.CallEvents.Disconnected);
      call.off(Voximplant.CallEvents.Failed);
      call.off(Voximplant.CallEvents.ProgressToneStart);
    };
  }, [isVideoCall]);
  const endCall = useCallback(() => {
    let call = calls.get(callId.current);
    call.hangup();
  }, []);
  const tryCallAgain = () => {
    navigation.goBack();
    callAgain();
  };
  const goBack = () => {
    navigation.goBack();
  };
  useEffect(() => {
    if (counterSecond >= 60) {
      setCounterMinute(counterMinute + 1);
      setCounterSecond(0);
    } else {
      setTimeout(() => {
        setCounterSecond(counterSecond + 1);
      }, 1000);
    }
  }, [counterSecond]);
  return (
    <View style={styles.container}>
      <View style={styles.svgs}>
        <IncomeCallTopSvg width={width} />
        <IncomeCallBottomSvg width={width} />
      </View>
      {callState === 'Failed' ? (
        <TouchableOpacity onPress={goBack} style={styles.backButton}>
          <BackArrowSvg width={height * 0.06} height={height * 0.06} />
        </TouchableOpacity>
      ) : null}
      <View>
        <Text style={styles.text}>
          {callState === 'Call connected'
            ? 'Вызов'
            : callState === 'Ringing' || isPending
            ? 'Вызов...'
            : callState === 'Failed'
            ? 'Не найдено'
            : ''}
        </Text>
        <View style={{marginTop: height * 0.08, alignItems: 'center'}}>
          {callState === 'Failed' ? (
            <AvatarBreakSvg width={height * 0.19} height={height * 0.19} />
          ) : (
            <AvatarSvg width={height * 0.19} height={height * 0.19} />
          )}
        </View>
        {callState !== 'Call connected' ? null : (
          <Text style={[styles.text, {marginTop: height * 0.06}]}>
            {counterMinute < 10 ? 0 : ''}
            {counterMinute}:{counterSecond < 10 ? 0 : ''}
            {counterSecond}
          </Text>
        )}
        <View
          style={{
            marginTop: callType === 'income' ? height * 0.25 : height * 0.09,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <TouchableOpacity
            style={{alignItems: 'center'}}
            onPress={callState === 'Failed' ? tryCallAgain : endCall}>
            {callState === 'Ringing' || isPending ? (
              <DeclineCallSvg width={height * 0.12} height={height * 0.12} />
            ) : callState === 'Failed' ? (
              <CallStartSvg width={height * 0.24} height={height * 0.24} />
            ) : (
              <BreakCallSvg width={height * 0.24} height={height * 0.24} />
            )}
            {callState === 'Call connected' ? (
              <Text style={styles.buttonText}>Завершить</Text>
            ) : callState === 'Failed' ? (
              <Text
                style={{
                  fontSize: height * 0.027,
                  marginTop: height * 0.02,
                  color: COLORS.white,
                  fontFamily: FONTS.montserrat500,
                }}>
                Набрать еще
              </Text>
            ) : null}
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
    textAlign: 'center',
    fontSize: height * 0.03,
  },
  buttonText: {
    fontFamily: FONTS.montserrat500,
    color: COLORS.white,
    marginTop: height * 0.03,
    fontSize: height * 0.027,
  },
  backButton: {
    position: 'absolute',
    top: height * 0.06,
    left: width * 0.064,
    zIndex: 3,
  },
});

export default CallScreen;
