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

import ajax from './utils/ajax';
import config from '../config/config'

export default {

  setUcp: ucp => ajax.defaults.headers['ucp'] = ucp,

  getUser: () => ajax.get(config.urls.user)
    .then(response => ({
      phone: response.data.data.accountDetail.phone,
      name: response.data.data.accountDetail.name,
      wx: response.data.data.accountDetail.authWxLoginNick,
      cards: response.data.data.cardDetails.map(card => ({
        id: card.cardNo,
        type: card.cardName,
        userName: card.userName
      }))
    })),
  getHosList: () => ajax.post(config.urls.hosList, {
    priority: 'recommend'
    }).then(response => 
        response.data.data.hospitals.map(h => ({
          hosCode: h.hosCode,
          hosName: h.hosName
        }))
      ),
  getDeptList: hosCode => ajax.get(config.urls.deptList, {
    params: {
      hosCode: hosCode
    }
  }).then(response => response.data.data.departments.map(dept => ({
        code: dept.departCode,
        name: dept.name,
        subDepts: dept.subDepartments
          .map(subDept => {
            if(subDept.virtual) {
              return subDept.virtualDepartInfoList
                .map(vDept => ({
                  deptId: vDept.vL1Id,
                  subDeptId: vDept.vL2Id,
                  deptCode: vDept.vL1DepartCode,
                  subDeptCode: vDept.vL2DepartCode,
                  name: dept.name + '/' + subDept.name + '/' + vDept.vL1Name + '/' + vDept.vL2Name
                }))
            } else {
              return {
                deptId: dept.id,
                subDeptId: subDept.id,
                deptCode: dept.departCode,
                subDeptCode: subDept.departCode,
                name: dept.name + '/' + subDept.name
              }
            }
          }).reduce((x,y) => x.concat(y), [])
      }))
    ),
    // {
    //   "date": "2019-03-02",
    //   "status": "NO_INVENTORY",
    //   "waitOpenTime": 0,
    //   "openTimestamp": 0
    // }
  getProductList: (hosCode, firstDeptCode, secondDeptCode) => ajax.get(config.urls.productList, {
    params: {
      hosCode: hosCode,
      firstDeptCode: firstDeptCode,
      secondDeptCode: secondDeptCode
    }}).then(response => response.data.data.dateList
      .reduce((x,y) => x.concat(y), [])
    ),
  getProductDetail: (hosCode, firstDeptCode, secondDeptCode, date) => ajax.get(config.urls.productDetail, {
    params: {
      hosCode: hosCode,
      firstDeptCode: firstDeptCode,
      secondDeptCode: secondDeptCode,
      date: date,
      status: 'AVAILABLE',
      extra: true
    }}).then(response => 
      [
        ...response.data.data.amList,
        ...response.data.data.pmList,
        ...response.data.data.nightList,
        ...response.data.data.allDayList
      ].map(product => ({
        id: product.productId,
        type: product.type,
        timeType: product.showTimeType,
        doctorId: product.doctorInfo.doctorId,
        doctorName: product.doctorInfo.name,
        doctorTitle: product.doctorInfo.title,
        status: product.status
      }))
    ),
    
  
  save: data => ajax.post(config.urls.save, data)
  .then(response =>  response.data.data.orderNo ),

  check: data => ajax.post(config.urls.check, data)
    
}