import fetch from "isomorphic-fetch"
import { getPreset,ApiConfig } from "../network/constants"
import axios from "axios"
const defaultMethod = 'post';
const defaultOption = { method: defaultMethod, headers: ApiConfig.headers , credentials:'include'};
const AUTHORIZE_URL = "http://newers-world-oauth.qa2.tothenew.net/oauth/authorize?client_id=e6d6a83e-6c7a-11e7-9394-406186be844b";
function TokenNotExistError () {
    this.code= 'TOKEN_NOT_EXIST'
};

/**
 * it takes only one parameter options which is nothing but an object containing info related to :-
 * method,headers,data
 * this function also extracts token from the cookie and adds it in headers object
 * @param options
 * @returns {{method: string, headers: (ApiConfig.headers|{Content-Type, Accept})}}
 */
const getFetchOptions = (options = defaultOption) => {
    //_.merge(defaultOption,options);
    let token;
    const tokenString = document.cookie.split(';').find( (cookie) => cookie.includes('Tsms') );
    if(!tokenString){
        throw new TokenNotExistError();
    }
    if(tokenString) {
        token = tokenString.split("=")[1];
    }
    if(!options.headers){
        options.headers = {
            authorization : token,
            'Content-Type' : 'application/json',
            'Accept' : 'application/json',
        };
    }
    if(!options.method){
        options.method=defaultMethod;
    }
    options.headers.authorization = token;
    if(options.body){
        options.body = JSON.stringify(options.body);
    }
    if(!options.credentials){
        options.credentials='include';
    }
    return options;
};

/**
 *it takes 2 parameters
 * one is the url which user want to hit
 * another one is customOptions which is nothing but an object containing following keys:-
 * method,headers,data
 * it also handles the case for TokenNotExistError in this case employee is redirected to the login page
 * it also makes fetch request and returns the response
 * @param url
 * @param customOptions
 */
export  function decoratedFetch (url, customOptions) {
    let apiConfig = null;
    try{
        apiConfig = getFetchOptions(customOptions);
    }catch(e){
        if(e.code=='TOKEN_NOT_EXIST'){
            axios({
                url:"/authFail",
                method:'get',
                crossDomain: true,
            })
        }else{
            // todo: log error...
        }
    }
    return fetch(url, apiConfig);}


