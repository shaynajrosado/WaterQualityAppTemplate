import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk';
import rootReducer from './reducers';

const initialState = {
	currentLocation: '1',
	data: '',
	/* TODO: 
	{
		pH: 'null',
		timestamp: 'null',
		conductivity: 'null'
	},
	*/
};

const middleware = [thunk];

const store = createStore(
	rootReducer, 
	initialState, 
	applyMiddleware(...middleware)
);

export default store;