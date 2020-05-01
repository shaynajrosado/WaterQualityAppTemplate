
import * as React from 'react';
import {AsyncStorage } from 'react-native';
import 'react-native-gesture-handler';
import AppContainer from './ScreenContainer';
//import BackgroundFetch from "react-native-background-fetch";
//import BackgroundTask from 'react-native-background-task';



export default class App extends React.Component {
	constructor(props) {
		super(props)
	}


	


	render() {
	 	return (
			//<Provider store={store}>
			  <AppContainer />
			//</Provider>
		);
		
       
	}
}




