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
import inquirer from 'inquirer'
import request from './requests'


let save = data => {
  inquirer.prompt([{
    type: 'confirm',
    name: 'confirm',
    message: '确定要挂号吗？',
    default: true
  }]).then(ans => {
    if(ans.confirm) {
      request.save(data)
        .then(orderNo => {
            console.log('恭喜！抢号成功！订单号：' + orderNo + '。请在微信公众号京医通-个人中心-我的账户-挂号订单中继续支付。')
        }).catch(error => {
          console.log('没挂上!', error)
          save(data)
        })
    }}
  )
}

let data = {
  "price":null,
  "regHour":"",
  "orderProductType":""
}

console.log('+----------------------------------+')
console.log('|                                  |')
console.log('|  京医通挂号：开挂有风险，封号两行泪！  |')
console.log('|                                  |')
console.log('+----------------------------------+')
inquirer.prompt([
  {
    type: 'input',
    name: 'ucp',
    message: '输入UCP:'
  }
])
.then((ansUcp) => {
  request.setUcp(ansUcp.ucp)
  return request.getHosList()
})
.then(hosList => inquirer.prompt([
  {
    type: 'rawlist',
    name: 'hos',
    message: '选择医院:',
    paginated: true,
    choices: hosList.map(hos => ({name: hos.hosName, value: hos}))
  }]))
.then((ansHos) => {
  data.hosCode = ansHos.hos.hosCode
  console.log('选择了医院：', ansHos.hos.hosName)
  return request.getDeptList(data.hosCode).then(deptList => inquirer.prompt([
    {
      type: 'rawlist',
      name: 'dept',
      message: '选择部门:',
      paginated: true,
      choices: deptList.map(dept => ({name: dept.name, value: dept}))
    }
  ]))})
.then(ansDept => inquirer.prompt([
    {
      type: 'rawlist',
      name: 'subDept',
      message: '选择二级部门:',
      paginated: true,
      choices: ansDept.dept.subDepts.map(subDept => ({name: subDept.name, value: subDept}))
    }]))
.then(ansSubDept => {
      console.log('选择了部门:', ansSubDept.subDept.name)
      data.firstDeptCode = ansSubDept.subDept.deptCode
      data.firstDeptId = ansSubDept.subDept.deptId
      data.secondDeptCode = ansSubDept.subDept.subDeptCode
      data.secondDeptId = ansSubDept.subDept.subDeptId
      return request.getProductList(data.hosCode, data.firstDeptCode, data.secondDeptCode)
})
.then(dateList => inquirer.prompt([
          {
            type: 'rawlist',
            name: 'date',
            message: '选择日期:',
            paginated: true,
            choices: dateList.map(date => ({name: date.date + ': ' + date.status, value: date.date}))      
          }
]))
.then(ansDate => {
          data.treatmentDay = ansDate.date
          console.log('选择了日期:', ansDate.date)
          return request.getProductDetail(data.hosCode, data.firstDeptCode, data.secondDeptCode, data.treatmentDay)
})
.then(productList => inquirer.prompt([
              {
                type: 'rawlist',
                name: 'product',
                message: '选择科室医生:',
                paginated: true,
                choices: productList.map(product => ({
                  name: product.doctorName + '/' + product.doctorTitle + '/' + product.timeType + '/' + product.status,
                  value: product}))
              }          
])).then(ansProduct => {
              let product = ansProduct.product
              // console.log('product: ', JSON.stringify(product))
              data.productId = product.id
              data.doctorId = product.doctorId
              data.productType = product.type
              data.productTimeType = product.timeType
              console.log('选择了：', product.doctorName + '/' + product.doctorTitle + '/' + product.timeType + '/' + product.status)
              return ansProduct
}).then(() => request.getUser())
.then(user => inquirer.prompt([{
  type: 'rawlist',
  name: 'card',
  message: '选择医保卡:',
  paginated: true,
  choices: user.cards.map(card => ({
    name: card.type + '/' + card.userName,
    value: card}))
}])).then(ans => {
  data.cardNo = ans.card.id
  console.log('选择了:', ans.card.type + '/' + ans.card.userName)
  return ans
})
.then(() => save(data))
.catch(error => console.log('粗错啦！', error, JSON.stringify(data)))