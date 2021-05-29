import { BASE_URL } from './API';
import * as Localization from 'expo-localization';

export class RestClient {

    constructor(baseUrl) {
        this._baseUrl = baseUrl;
        this._finalLocal = '';

        _headers = new Headers({
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        });

        this.getLocal();
    }

    async getLocal() {
        const locale = await Localization.locale;
        this._finalLocal = locale.substr(0, 2);

    }

    /** Send otp in sms */
    sendOTP(mobile, country) {
        var countryCode = null;
        var otpTemplate = null;
        
        // if (country == 'IN') {
        //     countryCode = '507';
        //     otpTemplate = '5f153b4dd6fc0564ba422448';
        // } else if (country == 'US') {
        //     countryCode = '1';
        //     otpTemplate = '5f608280b9b2190522088999';
        // } else {
        //     countryCode = '91';
        //     otpTemplate = '5f1e5da0d6fc056fee763517';
        // }
        if (country == 'IN') {
            countryCode = '91';
            otpTemplate = '5f1e5da0d6fc056fee763517';
        } else if (country == 'US') {
            countryCode = '1';
            otpTemplate = '5f608280b9b2190522088999';
        } else {
            countryCode = '507';
            otpTemplate = '5f153b4dd6fc0564ba422448';
        }

        return fetch(
            "https://api.msg91.com/api/v5/otp?authkey=8021AEb8FlH35f115208P123&template_id=" + otpTemplate + "&mobile=+" + countryCode + mobile + "&otp_length=4",
            {

                // return fetch("https://api.msg91.com/api/v5/otp?authkey=8021AEb8FlH35f115208P123&template_id=5f1e5da0d6fc056fee763517&mobile=+91"+mobile+"&otp_length=4", {
                // return fetch("https://api.msg91.com/api/v5/otp?authkey=8021AEb8FlH35f115208P123&template_id=5f608280b9b2190522088999&mobile=+1"+mobile+"&otp_length=4", {
                // return fetch("https://api.msg91.com/api/v5/otp?authkey=8021AEb8FlH35f115208P123&template_id=5f153b4dd6fc0564ba422448&mobile=+507"+mobile+"&otp_length=4", {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
            })

            .then((response) => response.json())

            .then((responseJson) => {
                return responseJson;
            })
            .catch((error) => {
                console.log(error);
            })

    }

    resendOTP(mobile, country) {
        var countryCode = null;
        if (country == 'IN') {
            countryCode = '91';
        } else if (country == 'US') {
            countryCode = '1';
        } else {
            countryCode = '507';
        }
        // if (country == 'IN') {
        //     countryCode = '507';
        // } else if (country == 'US') {
        //     countryCode = '1';
        // } else {
        //     countryCode = '91';
        // }
        return fetch("https://api.msg91.com/api/v5/otp/retry?authkey=8021AEb8FlH35f115208P123&mobile=+"+ countryCode + mobile + "&otp_length=4&retrytype=text", {
            // return fetch("https://api.msg91.com/api/v5/otp/retry?authkey=8021AEb8FlH35f115208P123&mobile=+1"+mobile+"&otp_length=4&retrytype=text", {
            // return fetch("https://api.msg91.com/api/v5/otp/retry?authkey=8021AEb8FlH35f115208P123&mobile=+507"+mobile+"&otp_length=4&retrytype=text", {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
        })
            .then((response) => response.json())

            .then((responseJson) => {
                return responseJson;
            })
            .catch((error) => {
                console.log(error);
            })
    }

    verifyOTP(mobile, otp, country) {

        var countryCode = null;
        if (country == 'IN') {
            countryCode = '91';
        } else if (country == 'US') {
            countryCode = '1';
        } else {
            countryCode = '507';
        }
        // if (country == 'IN') {
        //     countryCode = '507';
        // } else if (country == 'US') {
        //     countryCode = '1';
        // } else {
        //     countryCode = '91';
        // }

        return fetch(
            "https://api.msg91.com/api/v5/otp/verify?mobile=+" + countryCode +
            mobile +
            "&otp=" +
            otp +
            "&authkey=8021AEb8FlH35f115208P123",
            {

                // return fetch("https://api.msg91.com/api/v5/otp/verify?mobile=+91" + mobile + "&otp=" + otp + "&authkey=8021AEb8FlH35f115208P123", {
                // return fetch("https://api.msg91.com/api/v5/otp/verify?mobile=+1" + mobile + "&otp=" + otp + "&authkey=8021AEb8FlH35f115208P123", {
                // return fetch("https://api.msg91.com/api/v5/otp/verify?mobile=+507" + mobile + "&otp=" + otp + "&authkey=8021AEb8FlH35f115208P123", {

                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
            }
        )

            .then((response) => response.json())
            .then((responseJson) => {
                return responseJson;
            })
            .catch((error) => {
                console.log(error);
            })

    }
    paymentAction(method_name, card_number, year, month, cvv) {
        return fetch('http://pushnifty.com/dasinfoau/client/masrapido/api/save-customer-payment-method', {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
        })
            .then((response) => response.json())
            .then((responseJson) => {
                return responseJson;
            })
            .catch((error) => {
                console.log(error);
            })
    }

    /** POST with body */
    postWithBody(url, data) {
        return this.callRequest('POST', url, data);
    }

    /* POST without body */
    postWithoutBody(url) {
        return this.callRequest('POST', url);
    }

    /** POST with body and check api token */
    postWithBodyToken(url, data, Token) {
        return this.callRequestWithToken('POST', url, data, Token);
    }

    /** POST with form data */
    postWithFormData(url, data, Token) {
        return this.callRequestWithFormToken("POST", url, data, Token);
    }

    /** callRequest for non authenticated method */
    callRequest(method, url, data = null) {
        let API_URL = `${this._baseUrl}/${url}`

        return fetch(API_URL, {
            method: method,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                "X-localization" : this._finalLocal,
            },
            body: JSON.stringify(data)
        })
            .then((response) => response.json())
            .then((responseJson) => {
                if (responseJson.isError == false) {
                    return responseJson;
                } else {
                    return responseJson;
                }
            })
            .catch((error) => {
                console.log(error);
            })
    }

    /** callRequestWithToken for authentication token */
    callRequestWithToken(method, url, data, token) {
        let API_URL = `${this._baseUrl}/${url}`

        return fetch(API_URL, {
            method: method,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                "X-localization" : this._finalLocal,
                'Authorization': token
            },
            body: JSON.stringify(data)
        })
            .then((response) => response.json())
            .then((responseJson) => {
                if (responseJson.isError == false) {
                    return responseJson;
                } else {
                    return responseJson;
                }
            })
            .catch((error) => {
                return error;
            })
    }

    /** call request with formdata and api token */
    callRequestWithFormToken(method, url, data, token) {
        console.log(token);
        let API_URL = `${this._baseUrl}/${url}`;
        
        console.log(API_URL);
        // return fetch(API_URL, {
        //     method: method,
        //     headers: {
        //         Accept: 'application/json',
        //         'Content-Type': 'multipart/form-data',
        //         'Authorization': token
        //     },
        //     body: data
        // })
        //     .then((response) => response.json())
        //     .then((responseJson) => {
        //         if (responseJson.isError == false) {
        //             return responseJson;
        //         } else {
        //             return responseJson;
        //         }
        //     })
        //     .catch((error) => {
        //         return error;
        //     })
        var xhr = new XMLHttpRequest();
            return new Promise((resolve, reject) => {
            xhr.withCredentials = true;
            xhr.onreadystatechange = e => {
            if (xhr.readyState !== 4) {
            return;
            }
            if (xhr.status === 200) {
                resolve(JSON.parse(xhr.responseText));
            } else {
                // alert("Request Failed");
                reject("Request Failed");
                console.log(xhr.status);
            }
            };
            xhr.open("POST", API_URL);
            xhr.setRequestHeader("cache-control", "no-cache");
            xhr.setRequestHeader("Content-Type", "multipart/form-data");
            xhr.setRequestHeader("Accept", "application/json");
            xhr.setRequestHeader("Authorization", token);
            xhr.setRequestHeader("X-localization", this._finalLocal);
            console.log(xhr);
            xhr.send(data);
        });

    }

    /** send notification */
    sendNotification(data, title, msg) {
        return fetch('https://exp.host/--/api/v2/push/send', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'accept-encoding': 'gzip, deflate',
                'host': 'exp.host'
            },
            body: JSON.stringify({
                to: data,
                title: title,
                body: msg,
            }),
        }).then((response) => response.json())
            .then((responseJson) => {
            })
            .catch((error) => { console.log(error) });
    }
}

export const defaultRestClient = new RestClient(BASE_URL);