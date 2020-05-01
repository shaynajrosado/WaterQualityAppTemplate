'use strict';
import { Dimensions, StyleSheet } from 'react-native';

let deviceHeight = Dimensions.get('window').height;
let deviceWidth = Dimensions.get('window').width;

export default StyleSheet.create({

  button: {
    height: deviceHeight/17,
    width: deviceWidth/3.5,
    backgroundColor: 'white',
    borderColor: 'black',
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 5,
  },
 
   buttonText: {
    fontWeight: 'bold',
    fontSize: deviceHeight/40,
    textAlign: 'center',
    color: 'black',
  },
 
  container: {
    height: deviceHeight,
    width: deviceWidth,
    justifyContent: 'center',
    backgroundColor: 'white',
    padding: 1,
  },
  
    detailsText: {
    fontSize: deviceHeight/35,
    textAlign: 'center',
    color: 'black',
    fontWeight: 'bold',   
  },
  
  detailsContainer: {
	padding: 10, 
	backgroundColor: 'rgba(217, 217, 217, 0.8)',
    height: 300,	
  },
  
  flatListStyle: {
	  flex:3
  },
  
  badQuality: {
    backgroundColor: 'rgb(255, 0, 0)', 
	  height: deviceHeight/17,
    width: deviceWidth/1.5,
    borderColor: 'black',
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 5,
  },
  
  goodQuality: {
	  backgroundColor: 'rgb(159, 255, 128)', 
	  height: deviceHeight/17,
    width: deviceWidth/1.5,
    borderColor: 'black',
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 5,
  },

  
  container: {
	  borderWidth: 2,
    borderColor: 'black',
	  backgroundColor: 'rgba(217, 217, 217, 0.8)',
	  alignItems: 'center',
	  padding: 8
  },	  
	
  locationPulldownBar: {
	  borderColor: 'black',  
	  borderWidth: 2,
    height: deviceHeight/14,
    width: deviceWidth/2.7,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 5,
  },
  
  locationPulldownText: {
    fontSize: deviceHeight/35,
    textAlign: 'center',
    color: 'black',
  },
  
  mainPage: {
   flex: 1,
   height: deviceHeight,
   width: deviceWidth,
   justifyContent: 'center',
  },
  
  mainTitle: {
    fontSize: deviceHeight/16,
    fontWeight: 'bold',
    color: 'black',
  },
  

  
  paragraph: {
    margin: 24,
    fontSize: deviceHeight/25,
    fontWeight: 'bold',
    textAlign: 'center',
    color: 'black',
  },

  safeParamButton: {
	  height: deviceHeight/12,
    width: deviceWidth/2,
    backgroundColor: 'rgb(159, 255, 128)',
    borderColor: 'black',
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 5, 
  },

  unsafeParamButton: {
	  height: deviceHeight/12,
    width: deviceWidth/2,
    backgroundColor: 'rgb(255, 0, 0)',
    borderColor: 'black',
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 5, 
  },

  sensorText: {
    textAlignVertical: "center", 
    textAlign: "center",
    fontWeight: 'bold',
  },
 
  neutralParamButton: {
    height: deviceHeight/12,
    width: deviceWidth/2,
    justifyContent: 'center',
    backgroundColor: 'white',
    padding: 1,
    borderColor: 'black',
    borderWidth: 2,
    margin: 5,
  },
 
  wholeScreen: {
	  flex: 1,
	  alignItems: 'center',
	  justifyContent: 'center',
  },

  surveyButtons: {
    height: deviceHeight/17,
    width: deviceWidth/6,
    justifyContent: 'center',
    backgroundColor: 'white',
    padding: 1,
    borderColor: 'black',
    borderWidth: 2,
    margin: 5,    
  }
  
});
