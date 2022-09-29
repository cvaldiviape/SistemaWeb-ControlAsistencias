import instanceAxios from './baseApi';
import Constants from '../util/constants';

export const getExistSettings = () => !!sessionStorage.getItem(Constants.settingName);

const getSettings = () => instanceAxios.get('settings');

export default getSettings;
