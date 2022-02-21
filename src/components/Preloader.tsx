import React from 'react';
import {Dimensions, Image, StyleSheet, View} from 'react-native';

const height = Dimensions.get('screen').height;

const Preloader = () => {
  return (
    <View
      style={[
        {
          backgroundColor: 'rgba(255,255,255,0.3)',
          justifyContent: 'center',
          alignItems: 'center',
          height,
          zIndex: 100,
        },
        StyleSheet.absoluteFillObject,
      ]}>
      <Image
        source={{
          uri: 'https://i.imgur.com/0R6Xzlf.gif',
        }}
        style={{width: 300, height: 300}}
      />
    </View>
  );
};

export default Preloader;
