import * as Localization from 'expo-localization';
import i18n from 'i18n-js';

// localization translated text json files
import en from './en.json';
import es from './es.json';
import hi from './hi.json';


// Bind to i18n
i18n.translations = {
    en,
    hi,
    es,
}

// set app to local phones setting

const getLanguage = async() => {
    try {
        const choice = await Localization.locale
        i18n.locale = choice.substr(0, 2)
        i18n.initAsync();
    }  catch (error) {
        console.log('unable to get local');
    }
}

getLanguage()

// export module
export function t(name) {
    return i18n.t(name)
}
