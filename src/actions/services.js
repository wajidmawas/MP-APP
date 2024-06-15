import axios from 'axios';
import React, { useContext } from "react";
import { axiosURL, apiKey } from "./types";
export default class Services {

    constructor() {
        this.baseUrlHead = axiosURL;
        this.axiosInstance = axios.create({
            baseURL: axiosURL,

        });
        // const headers = {
        //     'Content-Type': 'application/json;charset=utf-8',
        //     'Access-Control-Allow-Origin': '*'
        // };


        // this.axiosKYCInstanceWithHeader = axios.create({
        //     baseURL: axiosURL,
        //     header: {}
        // });
    }
    GetResults(url, payload) {
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("ApiKey", apiKey)
        var call_response;
        if (url == "/register") {
            payload.password2 = payload.password;
        }
        var data = JSON.stringify(payload);
        //  return this.axiosInstance.post(this.baseUrlHead+url, data)
        //     .then(function (response) { 
        //         console.log(response);
        //           return call_response= response;
        //     })
        //     .catch(function (error) {

        //         console.log(error);
        //         call_response= error
        //     }); 
        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: data,
            redirect: 'follow'
        };
        return fetch(this.baseUrlHead + url, requestOptions)
            .then(response => response.text())
            .then(result => { return result })
            .catch(error => console.log('error', JSON.stringify(error)));

    }
  
    postData(url, payload) {
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json;charset=utf-8");
        myHeaders.append("ApiKey", apiKey)
        var call_response;
        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: JSON.stringify(payload),
            redirect: 'follow'
        }; 
        return fetch(this.baseUrlHead + url, requestOptions)
            .then(response => response.text())
            .then(result => { return result })
            .catch(error => console.log('error', JSON.stringify(error)));

    }
    postDatawithPayload(url, payload, clientid) {
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json;charset=utf-8");
        myHeaders.append("ApiKey", clientid)
        let axiosConfig = {
            headers: {
                'Content-Type': 'application/json;charset=UTF-8',
                "Access-Control-Allow-Origin": "*",
                "ApiKey": clientid
            }
        };

        var call_response;
        return axios.post(this.baseUrlHead + url, payload, axiosConfig)
            .then(result => { return JSON.stringify(result["data"]) })
            .catch(error => console.log('error', JSON.stringify(error)));


    }
    postDatawithPayload_v2(url, payload, clientid) {
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json;charset=utf-8");
        myHeaders.append("ApiKey", clientid)
        let axiosConfig = {
            headers: {
                'Content-Type': 'application/json;charset=UTF-8',
                "Access-Control-Allow-Origin": "*",
                "ApiKey": clientid
            }
        };

        var call_response;
        return axios.post(this.baseUrlHead + url, payload, axiosConfig)
            .then(result => { return JSON.stringify(result) })
            .catch(error => console.log('error', JSON.stringify(error)));


    }
    postFormData(url, payload) {
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "multipart/form-data");
        myHeaders.append("Accept", "application/json;charset=utf-8");
        myHeaders.append("ApiKey", apiKey)
        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: payload,
            redirect: 'follow'
        };                  
        return fetch(this.baseUrlHead + url, requestOptions)
            .then(response => response.text())
            .then(result => { return result })
            .catch(error => console.log('error', JSON.stringify(error)));

    }

}

