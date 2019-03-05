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

const pathHosList = '/product/hosList'
const pathSave = '/order/save'
const pathCheck = '/order/preSaveCheck'
const pathDeptList = '/product/departments'
const pathUser = '/user/account'
const pathProductList = '/product/list/v2'
const pathProductDetail = '/product/dic/detail/v2'
export default {
  urls: {
    hosList: pathHosList,
    deptList: pathDeptList,
    save: pathSave,
    check: pathCheck,
    user: pathUser,
    productList: pathProductList,
    productDetail: pathProductDetail
  },
  headers: {
    'Host': 'wechat.benmu-health.com',
    'Accept': 'application/json, text/plain, */*',
    'User-Agent': 'Mozilla/5.0 (Linux; Android 9; MIX 2S Build/PKQ1.180729.001; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/66.0.3359.126 MQQBrowser/6.2 TBS/044504 Mobile Safari/537.36 MMWEBID/7711 MicroMessenger/7.0.3.1400(0x2700033A) Process/tools NetType/WIFI Language/zh_CN',
    'Referer': 'https://wechat.benmu-health.com/wechatV2/',
    'Accept-Language': 'zh-CN,en-US;q=0.9'
  },
  tokenUrls: [
    pathProductList, 
    pathProductDetail
  ]
}