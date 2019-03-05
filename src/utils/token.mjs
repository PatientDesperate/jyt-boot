// Copy from https://github.com/karynsong/mobile-template
// Copyright [2019] [patientdesperate@gmail.com]

// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at

//     http://www.apache.org/licenses/LICENSE-2.0

// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import md5 from './md5'
import _isUndefined from 'lodash/isUndefined';
/**
 * [getParamsToken 验签 hubi 写的逻辑]
 * @author songqi
 * @param  {[type]} options [description]
 * @return {[type]}         [description]
 */
export default function getParamsToken(options) {
    var timestamp = options.data._ || +new Date(),
        sendParams = options.url + '?',
        params = {
            _: timestamp
        },
        keyArr = ['_'],
        paramsStr = '';
    if(options.type.toUpperCase() === 'POST' && options['data']){
        params['data'] = JSON.stringify(options['data']);
        keyArr.push('data');
    }else{
        for(var i in options.data){
            if(_isUndefined(params[i]) && !_isUndefined(options.data[i])){
                params[i] = options.data[i];
                keyArr.push(i);
            }
        }
    }
    keyArr.sort();
    keyArr.push('paterner_key');
    keyArr.map((item, index) => {
        paramsStr += item + '=';
        if(item === 'paterner_key'){
            paramsStr += timestamp.toString().slice(-6, -1);
        }else{
            paramsStr += decodeURIComponent(params[item]);
        }
        if(index !== keyArr.length - 1){
            paramsStr += '&';
        }
    });
    params['xa7w6pf'] = md5(paramsStr);
    if(options.type.toUpperCase() === 'POST' && params['data']){
        delete params['data'];
    }
    for(var j in params){
        sendParams += j + '=' + encodeURIComponent(decodeURIComponent(params[j])) + '&';
    }
    sendParams = sendParams.slice(0, sendParams.length - 1);
    if(options.type.toUpperCase() === 'POST'){
        return {
            url: sendParams,
            data: options.data
        };
    }
    return {
        url: sendParams
    };
}