import React, { Component } from 'react';
import { AsyncStorage, Button, Text, View, TouchableHighlight, ImageBackground, Linking, Platform } from 'react-native';
import styles from '../styles/styles';
//import app from './config';
import { differenceInDays, differenceInMinutes, differenceInHours } from 'date-fns';
import axios from 'axios';
import firebase from '@react-native-firebase/app';
import '@react-native-firebase/messaging';
import '@react-native-firebase/firestore';
/**
 * This page of the app displays data from sensors and 
 * indicators which determine whether or not they are
 * within a safe range.
 */
export default class QualityPage extends Component {
  // Text for the title-bar of the page goes here
  static navigationOptions = {
	title: 'Welcome to the Blue HomeLab!', 
  }
  // Initialize values here
  constructor(props)  {	  
	super(props);
	this.time_since = null;
	this.registrationToken = null;	// will be used to identify device for notifications
	this.localNotify = null;	
	this.senderID = "";	// Fill in your Firebase Sender ID here
	this.id = null;
	this.state = {	
		//regState: null,
		userId: '',
		salinityIsSafe: null,
		overallQuality: false,
		sensorData: {	// filler data
			data: [{"sensor_name": "Temp", "sensor_data": "13.09"}, {"sensor_name":"Cond","sensor_data":"365"}, {"sensor_name":"DOpct","sensor_data":"97.2"}, {"sensor_name":"Sal","sensor_data":"0.4"}],
			info: [{"time_stamp":"2020-03-18 18:15:00","deployment_id":"10"}],
		},
	};
  }
  // Get fresh data every time the app is opened, in addition to the background functions
  async getData() {
    try {
      await axios.get('www.fillthisin.com/sensorData.json')	// enter the URL to wherever sensor data JSON is hosted
        .then(res => {
            this.setState({
					sensorData: {
						data: res.data['data'],
						info: res.data['info'],
					}
				});
        	});
    } catch(error) {
      console.log(error);
    }
  }
  /**
   * Helper function to parse the time stamp from JSON file,
   * and determine the length of time elapsed since this
   * time stamp.
   * 
   * Format for time_stamp: "YYYY-MM-DD HH:MM:SS"
   */
  timeElapsed(time_stamp) {	
	let year = time_stamp.substring(0,4);
	let month = time_stamp.substring(5,7);
	let date = time_stamp.substring(8,10);
	let hours = time_stamp.substring(11,13);
	let min = time_stamp.substring(14,16);
	let sec = time_stamp.substring(17,19);
	
	var curDate = new Date().getDate(); //Current Date
	var curMonth = new Date().getMonth(); //Current Month
	if(curMonth < 12) {
		curMonth += 1;	// this step is necessary because getMonth() only returns 0-11
	} else {
		curMonth = 1;
	}

	var curYear = new Date().getFullYear(); //Current Year
	var curHours = new Date().getHours(); //Current Hours
	var curMin = new Date().getMinutes(); //Current Minutes
	var curSec = new Date().getSeconds(); //Current Seconds
	let currentDate = new Date(curYear, curMonth, curDate, curHours, curMin, curSec);
	
	
	let timeStampedDate = new Date(year, month, date, hours, min, sec);

	var daysDifference = differenceInDays(currentDate, timeStampedDate);
	var hoursDifference = differenceInHours(currentDate, timeStampedDate) - (daysDifference * 24);
	var minutesDifference = differenceInMinutes(currentDate, timeStampedDate) - (daysDifference*60*24) - (hoursDifference*60);
	
	//var lastUpdate = 'Last Update: ' + (Math.round(daysDifference)) + ' days, ' + (Math.round(hoursDifference)) + ' hours, ' + (minutesDifference) + ' min ago';
	var lastUpdate = 'Last Update: TODAY'
	return lastUpdate;
  }

  async makeID(length) {
	var result           = '';
	var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
	var charactersLength = characters.length;
	for ( var i = 0; i < length; i++ ) {
		result += characters.charAt(Math.floor(Math.random() * charactersLength));
	}
	return result;
  }

  async setToken() {
	let returnValue;
	// get device registration token from firebase.
	const fcmToken = await firebase.messaging().getToken();

	this.registrationToken = fcmToken;
	console.log('[setToken] this.registrationtoken=',this.registrationToken);
	try {
		// save device registration token in AsyncStorage under key=REGISTRATION
		await AsyncStorage.setItem('REGISTRATION',fcmToken);
		console.log('[setToken] FCM token saved to AsyncStorage')
		let keys = await AsyncStorage.getAllKeys();
		console.log('[setToken] AsyncStorage allKeys=', keys);
	   
	} catch (e) {
		console.log('[setToken] Failed to save user registration token to AsyncStorage.')
	}

	

	try {	// make a new user ID for storing user info in firebase
		let asyncID = await AsyncStorage.getItem('USER_ID');	// see what's in AsyncStorage
		console.log('[setToken] AsyncStorage.getItem(USER_ID)=', asyncID);
		returnValue = asyncID;
		let keys = await AsyncStorage.getAllKeys();
		console.log('[setToken] allKeys=', keys);
		if(asyncID != null) {	// if there is something already, store it in the component
			console.log('[setToken] Attempting to update state...'); 
			this.setState({ userId: asyncID }, () => {
				console.log('[setToken] Called updateState after getting asyncID: this.state.userId=',this.state.userId);
			}); 
		} else {
			console.log('[setToken] No user ID detected. Saving new ID to AsyncStorage...');
			var id = await this.makeID(5)
			//console.log(id);
			try {
				await AsyncStorage.setItem('USER_ID', id)
				let keys = await AsyncStorage.getAllKeys();
				console.log('[setToken] allKeys=', keys);
			} catch (e) {
				console.log(e);
			}
			console.log('[setToken] New user id #', this.id);
		}

	} catch (e) {
		console.log('[setToken] Error storing new user ID in AsyncStorage');
	}

	try {	// see if there is an entry in firebase for this user id #
		let userRef = firebase.firestore().collection('users').doc(this.state.userId);
		let userRefExists = await userRef.get();
		console.log('[setToken] Checking for user ', this.state.userId,'...found=', userRefExists.exists);
		if(!userRefExists.exists) {
			console.log('[setToken] userRef.id=', this.state.userId, ' is a new entry. Adding record...');
			userRef.set({
				feedbackRequested: false,
				salinityWarningSent: false,
				tokenID: fcmToken,
				//os: Platform.OS,
			});
			console.log('[setToken] Created firestore entry for user id=' + this.state.userId);
		} else {
			console.log('[setToken] docRef.id=',userRef.id, ' already exists. Updating record to store most recent registration token.');
			userRef.update({
				tokenID: fcmToken,
			});
		}
		/*this.setState({ userId: id }, () => {
			console.log('[setToken] this.state.userId=',this.state.userId);
		  }); */
		return this.state.userId;
	} catch(e) {
		console.log('[setToken] ERROR! Couldnt get firestore reference.');
	}
	//console.log('[setToken] this.state.userId =', this.state.userId);
	return returnValue;
  }
  async getSalinityFlag() {
	try {
		let db = firebase.firestore().collection('sensorData').doc('flags');
		let docRef = await db.get();
		console.log('[getSalinityFlag] salinityIsSafe data from firebase: ', docRef.data());
		let salinityStatus = docRef.data()['salinityIsSafe'];
		console.log('[getSalinityFlag] (to return) salinityStatus: ', salinityStatus);
		return salinityStatus;
	} catch (e) {
		console.log('Error getting salinityIsSafe flag.');
	}
  }
  getFromStorage = async (key) => {
	let asyncData = await AsyncStorage.getItem(key);
	console.log('[getFromStorage] AsyncData=', asyncData);
	let keys = await AsyncStorage.getAllKeys();
	console.log('[getFromStorage] allKeys=', keys);
	//this.state.id = asyncData;
	return asyncData;
  }

  async componentDidMount() {

	let result = await this.setToken();	// Checks asyncStorage for id. if it does not exist, create one, and create an entry in firebase. 
						// if it does exist, store it.
	console.log('[compnentDidMount] result=',result);
	console.log('[componentDidMount] setToken finished executing.');
	console.log('[componentDidMount] this.state.userId=', this.state.userId);

	this.getData();
	let salStatus = await this.getSalinityFlag();
	console.log('[componentDidMout] salstatus=', salStatus);
	this.setState({
		salinityIsSafe: salStatus,
	});
	console.log('[componentDidMount] this.state.salinityIsSafe=', this.state.salinityIsSafe);
	

	this.setState({
		overallQuality: salStatus,		// overall quality is determined here - more params can be added
	})
	//console.log('overall quality: ', this.state.overallQuality);
	console.log('State after componentDidMount():');
	console.log(this.state);
  }
  onRegister(token) {
	  //this.setState({ regState: token });
	  console.log("[Notification] Registered: ", token)
	  return token;
  }
  onNotification(notify) {
	console.log("[Notification] onNotification: ", notify)	  
  }
  onOpenNotification(notify) {
	console.log("[Notification] onOpenNotification: ", notify)
  }
  onPressCancelNotification = () => {
	this.localNotify.cancellAllLocalNotification()
  }
  
  render() {
	var tempData = this.state.sensorData['data'][0]['sensor_data'];
	var condData = this.state.sensorData['data'][1]['sensor_data'];
	var dopctData = this.state.sensorData['data'][2]['sensor_data'];
	var salData = this.state.sensorData['data'][3]['sensor_data'];
	
	/**
	 * Generate dynamic Overall Quality Indicator			// TODO: Make a separate file for rendering different indicators based on parameter values.
	 */
	let overallQualityIndicator;		
	if(salData < 0.5) {						// In the future to account for other sensors:
											// make an AND operation for all sensor conditions.
											// E.G. if(salData < 0.5 && pHData <= ... && condData > ... )
		overallQualityIndicator =
			<TouchableHighlight 
				name="overallQuality"
				style={styles.goodQuality} 	
				>
		
			<Text style={styles.buttonText}>
				Overall Quality 
			</Text>
			
			</TouchableHighlight>
	} else {
		overallQualityIndicator =
		<TouchableHighlight 
				name="overallQuality"
				style={styles.badQuality} 	
				>
		
			<Text style={styles.buttonText}>
				Overall Quality 
			</Text>
			
			</TouchableHighlight>
	}


	/**
	 * Generate Dynamic Salinity Indicator
	 */
	let styledSalinityIndicator;
	if(salData < 0.5) {						// TODO: put this into a function
		styledSalinityIndicator = 
		<TouchableHighlight name="salinityButton" style={styles.neutralParamButton}
              >
               <View>
				<Text style={styles.buttonText}>Salinity:{'\n'}{salData} ppt</Text>
			   </View>
                
            
            </TouchableHighlight> 
	} else {
		styledSalinityIndicator = 
		<TouchableHighlight name="salinityButton" style={styles.unsafeParamButton}
              >
               <View>
				<Text style={styles.buttonText}>Salinity:{'\n'}{ salData } ppt</Text>
			   </View>
                
            
            </TouchableHighlight> 
	} 


	let userIdDisplay;
	if(this.state.userId) {
		userIdDisplay = <View><Text style={styles.buttonText}>ID: {this.state.userId}</Text></View>;
	} else {
		userIdDisplay = null;
	}


	return (
		
        <View style={styles.mainPage}>
		   <ImageBackground source={require('..//background.png')}
			  style={styles.wholeScreen}>
          <View style={styles.container}>
            <Text style={styles.mainTitle}>
              Blue HomeLab
            </Text>

			<View>{overallQualityIndicator}</View>	

            <Text style={styles.paragraph}>
               Sensors
            </Text>

			<TouchableHighlight name="condButton" 
								style={styles.neutralParamButton}
              ><View>
				<Text style={styles.buttonText}>Conductivity: {'\n'}{ condData }{' mg/L'}</Text>
				</View>
            </TouchableHighlight>       

			<TouchableHighlight name="doPctButton" 
							style={styles.neutralParamButton}>
				<View>
				<Text style={styles.buttonText}>Dissolved Oxygen:{'\n'}{ dopctData }{'%'}</Text></View>
		    </TouchableHighlight>     

			<View>{styledSalinityIndicator}</View>
			
			<TouchableHighlight name="tempButton" 
								style={styles.neutralParamButton}
              ><View>
				<Text style={styles.buttonText}>Temperature: {'\n'}{ tempData }{'\u00b0'}C</Text>
               </View>
            </TouchableHighlight>        
				<View>{userIdDisplay}</View>
            </View>
			
		   </ImageBackground>
          </View>
		);
  }
}
