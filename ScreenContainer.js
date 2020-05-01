import React, { Component } from 'react';
import { createStackNavigator } from 'react-navigation-stack';
import { createAppContainer } from 'react-navigation';
//import LocationPage from './components/LocationPage'; 
import QualityPage from './components/QualityPage';


const screens = {

    /**Location: { 
        screen: LocationPage,
    },**/
	Quality: {
		screen: QualityPage,
	},
}


const TopLevelNavigator = createStackNavigator(screens);

const AppContainer = createAppContainer(TopLevelNavigator);

export default AppContainer; 