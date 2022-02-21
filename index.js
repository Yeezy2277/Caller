/**
 * @format
 */

import {AppRegistry} from 'react-native';
import {name as appName} from './app.json';
import WrappedApp from './App';
import {gestureHandlerRootHOC} from 'react-native-gesture-handler';

AppRegistry.registerComponent(appName, () => gestureHandlerRootHOC(WrappedApp));
