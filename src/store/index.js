import { createStore } from 'redux';
import volumeReducer from '~/reducers/volumeReducer';

const storeVolume = createStore(volumeReducer);

export default storeVolume;
