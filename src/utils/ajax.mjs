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
import getParamsToken from './token';
import axios from 'axios';
import config from '../../config/config'


var ajax = axios.create({
  baseURL: 'https://wechat.benmu-health.com/mobile/wx/',
  timeout: 1000,
  headers: config.headers
});

ajax.interceptors.request.use(request => {

  var d1 = +new Date;
  if (!request.params) {
      request.params = {};
  }
  request.params._ = d1;
  if (config.tokenUrls.indexOf(request.url) !== -1) {
    var sendOpts = getParamsToken({
        url: request.url,
        type: request.method,
        data: request.params
    });
    request.url = sendOpts.url;
    request.params = sendOpts.data;
  }
  // console.info('Requesting: ', request)
  return request;
}, function(error) {
  console.error('request_error', error)
  return Promise.reject(error);
})

ajax.interceptors.response.use(response => {
  // console.log('Response:', response.data)
  if (response.data.resCode !== 0) {
    return Promise.reject(response.data)
  }
  return response;
})

export default ajax