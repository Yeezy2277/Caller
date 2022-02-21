import React, {FC, useEffect, useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {RootStackParamList} from './src/constants/types';
import {Provider} from 'react-redux';
import {store} from './src/store/store';
import AuthScreen from './src/view/AuthScreen';
import CodeScreen from './src/view/CodeScreen';
import CallScreen from './src/view/CallScreen';
import ProfileSettingsScreen from './src/view/ProfileSettingsScreen';
import {BottomSheetModalProvider} from '@gorhom/bottom-sheet';
import AsyncStorage from '@react-native-async-storage/async-storage';
import HomeScreen from './src/view/HomeScreen';
import {Voximplant} from 'react-native-voximplant';
import {useAppDispatch, useAppSelector} from './src/store/hooks';
import {selectAuth, setAuth} from './src/store/authSlice';
import {RootState} from './src/store/store';
import IncomingCallScreen from "./src/view/IncomeCallScreen";

const RootStack = createNativeStackNavigator<RootStackParamList>();

const WrappedApp: FC = () => {
  return (
    <Provider store={store}>
      <App />
    </Provider>
  );
};

const App: FC = () => {
  const dispatch = useAppDispatch();
  const commonState = useAppSelector((state: RootState) => state.slice);
  const client = Voximplant.getInstance();
  useEffect(() => {
    console.log('isAuth' + commonState.isAuth);
    AsyncStorage.getItem('userToken')
      .then(async r => {
        try {
          let state = await client.getClientState();
          console.log(r);
          if (
            r === undefined ||
            state === Voximplant.ClientState.DISCONNECTED
          ) {
            dispatch(setAuth(false));
          } else {
            dispatch(setAuth(true));
          }
          console.log(commonState.isAuth);
        } catch (e) {
          console.log(e);
        }
      })
      .catch(err => {
        console.log(err);
        setAuth(false);
      });
  }, []);
  return (
    <BottomSheetModalProvider>
      <NavigationContainer>
        {!commonState.isAuth ? (
          <RootStack.Navigator
            screenOptions={{
              headerShown: false,
            }}>
            <RootStack.Screen name="Auth" component={AuthScreen} />
            <RootStack.Screen name="Code" component={CodeScreen} />
          </RootStack.Navigator>
        ) : (
          <RootStack.Navigator
            screenOptions={{
              headerShown: false,
            }}>
            <RootStack.Screen name="Home" component={HomeScreen} />
            <RootStack.Screen name="Call" component={CallScreen} />
            <RootStack.Screen
              name="IncomingCall"
              component={IncomingCallScreen}
            />
            <RootStack.Screen
              name="Profile"
              component={ProfileSettingsScreen}
            />
          </RootStack.Navigator>
        )}
      </NavigationContainer>
    </BottomSheetModalProvider>
  );
};

export default WrappedApp;
