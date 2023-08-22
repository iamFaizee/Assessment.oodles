import {legacy_createStore as createStore} from 'redux'
import rootReducer from './Reducer'

export const store = createStore(rootReducer)

store.subscribe(()=>{
    return console.log(store.getState());
})