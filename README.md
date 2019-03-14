JTY-BOOT
==

京医通辅助快速挂号抢号

# 小心被封号！
使用辅助有风险，小心被封号！
当请求响应回来是这样的：
```json
{ "resCode": 10000, "msg": "您的账户存在异常，请到现场挂号!", "data": null }
```
或者，微信中打开京医通提示“您的账户存在异常，请到现场挂号!”
恭喜您！你已经被封号了。

## 什么情况下会被封？
猜测可能是短时间内过于频繁请求接口会被封号。
## 被封号了怎么办？
京医通封号以微信号为准，你可以换个微信，登录你原来的京医通账号继续挂号。

# 如何使用？
安装最新版本的Node.js。
```
git clone git@github.com:PatientDesperate/jyt-boot.git
cd jyt-boot
npm install
node --experimental-modules src/main.mjs
```
按照提示操作即可。
```
+----------------------------------+
|                                  |
|  京医通挂号：开挂有风险，封号两行泪！  |
|                                  |
+----------------------------------+
? 输入UCP: ；skdfjslkfjJKlkJJkkkjjlhgggg..
? 选择医院: [object Object]
选择了医院： 北京友谊医院通州院区
? 选择部门: [object Object]
? 选择二级部门: [object Object]
选择了部门: 妇产科/妇产科门诊
? 选择日期: 2019-03-08
选择了日期: 2019-03-08
? 选择科室医生: [object Object]
选择了： 通州院区妇科门诊(上午)/普通门诊号/AM/VALID
? 选择医保卡: [object Object]
选择了: 北京通·京医通卡/*三
? 确定要挂号吗？ Yes
没挂上!
? 确定要挂号吗？ Yes
没挂上!
? 确定要挂号吗？ Yes
没挂上!
? 确定要挂号吗？ Yes
恭喜！抢号成功！订单号：888888888888。请在微信公众号京医通-个人中心-我的账户-挂号订单中继续支付。
```

# 为什么不做成自动抢号？
由于不清楚封号的具体细节，不希望不明真相的小伙伴使用的时候被封号，所以做成手动抢号。稍微懂一点儿JS的同学可以很容易自己改成自动抢号。
和人肉在微信里抢号相比，去掉了各种限制、查询和确认的步骤，每按一次回车就会抢一次。**即使手动抢号，也比在微信上人肉抢号要快很多。**
# 获取UCP
先在微信的京医通公众号中注册、绑卡一套流程都走完，确保你的京医通可以人肉挂号。
在微信中使用京医通随便打开几个页面，用各种方式抓包域名**wechat.benmu-health.com**下的HTTP请求，从Request Header中可以看到UCP：
```
ucp: [your ucp string]
```

# 鉴权

ucp是一组加密的字符串，是京医通鉴权的唯一凭据，猜测是用微信的OpenID加密变形而来，跟微信号一一对应，对于一个特定的微信号一段时间内不变。

另外，京医通账户有自己的用户名密码，一般用户名就是手机号。

其帐号模型如下：
* 微信号与UCP一一对应；
* 微信号与京医通账户临时关联，可随时取消：在某个微信号中打开京医通登录，建立临时关联关系；
* 京医通帐号和社保卡绑定：在京医通中登录后绑定社保卡建立绑定关系；

# TOKEN

每个请求都需要用请求参数按照一定的规则生成token一并加入请求参数中，具体生成token的算法参见[token.mjs](src/utils/token.mjs)。

# 错误码

```json
{"resCode":101,"msg":"[MTS]需要微信授权","data":null
```
原因：UCP不正确或者已过期。

```json
{ "resCode": 10000, "msg": "您的账户存在异常，请到现场挂号!", "data": null }
```
原因：被封号了。

```json
{ "resCode": 102, "msg": "[MTS]需要登录", "data": null }
```
原因：未登录京医通账号。
解决方法：在微信中登录京医通账号。

```json
{"resCode":103,"msg":"操作频率过快，请稍后再试。","data":null}
```
原因：并不是操作频率过快，而是请求参数或token不正确。

# HTTP接口
Base URL： [https://wechat.benmu-health.com/mobile/wx/](https://wechat.benmu-health.com/mobile/wx/)

## 查询个人信息
获取登录用户和绑定的社保卡
```bash
curl -H 'Host: wechat.benmu-health.com' -H 'Accept: application/json, text/plain, */*' -H 'ucp: [your ucp string]' -H 'lgd: ' -H 'attention: 1' -H 'User-Agent: Mozilla/5.0 (Linux; Android 9; MIX 2S Build/PKQ1.180729.001; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/66.0.3359.126 MQQBrowser/6.2 TBS/044504 Mobile Safari/537.36 MMWEBID/7711 MicroMessenger/7.0.3.1400(0x2700033A) Process/tools NetType/WIFI Language/zh_CN' -H 'Referer: https://wechat.benmu-health.com/wechatV2/' -H 'Accept-Language: zh-CN,en-US;q=0.9'  -H 'X-Requested-With: com.tencent.mm' --compressed 'https://wechat.benmu-health.com/mobile/wx/user/account?_=1551492121317'
```
返回
```json
{
	"resCode": 0,
	"msg": null,
	"data": {
		"accountDetail": {
			"image": "http://wx.qlogo.cn/mmopen/wrS1Ed6pBjrclaZ1yLeEfoNSSfzv199Bpbics4TUVrriaJrZNd6DJPFxpTdx692kX3PNdJNCpmRtlVic9Ghnvyqcwt9Sjnk5YPo/0",
			"name": "*三",
			"nickName": "张三",
			"phone": "18888888888",
			"password": "notEmpty",
			"auth": true,
			"authWxLogin": true,
			"authWxLoginNick": "张三"
		},
		"cardDetails": [{
			"cardNo": "888888888888",
			"cardType": "JYT",
			"cardName": "北京通·京医通卡",
			"status": "OK",
			"userName": "[姓名]",
			"idType": "ID",
			"idNo": "******8888",
			"phone": "*******8888",
			"balance": 0,
			"createHospital": "首都医科大学附属北京同仁医院南区",
			"createTime": "2000-01-01 00:00:00",
			"entityCardNo": "8888888888888",
			"birthday": "1988-08-08",
			"sex": "FEMALE",
			"recentUsed": true
		}],
		"patientList": [{
			"name": "*三",
			"idNo": "******8888",
			"cardDetails": [{
				"cardNo": "8888888888888",
				"cardType": "JYT",
				"cardName": "北京通·京医通卡",
				"status": "OK",
				"userName": "[姓名]",
				"idType": "ID",
				"idNo": "******8888",
				"phone": "*******8888",
				"balance": 0,
				"createHospital": "首都医科大学附属北京同仁医院南区",
				"createTime": "2000-01-01 00:00:00",
				"entityCardNo": "8888888888888",
				"birthday": "1988-08-08",
				"sex": "FEMALE",
				"recentUsed": true
			}]
		}],
		"cardCount": 1,
		"couponCount": 0,
		"scSwitch": true
	}
}
```

## 查询医院列表
获取医院ID

```bash
curl -H 'Host: wechat.benmu-health.com' -H 'ucp: [your ucp string]' -H 'Origin: https://wechat.benmu-health.com' -H 'attention: 1' -H 'User-Agent: Mozilla/5.0 (Linux; Android 9; MIX 2S Build/PKQ1.180729.001; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/66.0.3359.126 MQQBrowser/6.2 TBS/044504 Mobile Safari/537.36 MMWEBID/7711 MicroMessenger/7.0.3.1400(0x2700033A) Process/tools NetType/WIFI Language/zh_CN' -H 'Content-Type: application/json;charset=UTF-8' -H 'Accept: application/json, text/plain, */*' -H 'lgd: 1' -H 'Referer: https://wechat.benmu-health.com/wechatV2/' -H 'Accept-Language: zh-CN,en-US;q=0.9' -H 'X-Requested-With: com.tencent.mm' --data-binary '{"priority":"recommend"}' --compressed 'https://wechat.benmu-health.com/mobile/wx/product/hosList?_=1551281152598'
```
返回
```json
{
  "resCode":0,
  "msg":null,
  "data":{
    "hospitalCount":27,
    "infirmaryCount":35,
    "hospitals":[
      {
        "hosCode":"H111511",
        "hosName":"北京友谊医院",
        "hosLevel":"三级甲等",
        "countyName":"西城区",
        "smallLogo":"//lev-inf.benmu-health.com/resource/image/eb63828872f2676e3d2f4b42e7c7f51f.jpg",
        "open":true,
        "openView":"升级中",
        "distance":0.0,
        "advanceDay":8,
        "doubleVisitAdvanceDay":8,
        "curDayOpenTime":"00:00:00",
        "lastDayOpenTime":"00:00:00",
        "registerView":"00:00放第8天号",
        "distanceView":"",
        "keyDeptView":"国家重点",
        "keyDeptList":[
          "消化门诊",
          "普外门诊",
          "病理科"
        ],
        "processorTypes":null,
        "association":false
      },
      {
        "hosCode":"H111512",
        "hosName":"北京友谊医院通州院区",
        "hosLevel":"三级甲等",
        "countyName":"通州区",
        "smallLogo":"//lev-inf.benmu-health.com/resource/image/eb63828872f2676e3d2f4b42e7c7f51f.jpg",
        "open":true,
        "openView":"开通中",
        "distance":0.0,
        "advanceDay":8,
        "doubleVisitAdvanceDay":8,
        "curDayOpenTime":"00:00:00",
        "lastDayOpenTime":"00:00:00",
        "registerView":"00:00放第8天号",
        "distanceView":"",
        "keyDeptView":"",
        "keyDeptList":[

        ],
        "processorTypes":null,
        "association":false
      }
    ]
  }
}
```
## 查询医院部门信息
获取科室CODE和ID
```bash
curl -H 'Host: wechat.benmu-health.com' -H 'Accept: application/json, text/plain, */*' -H 'ucp: [your ucp string]' -H 'lgd: 1' -H 'attention: 1' -H 'User-Agent: Mozilla/5.0 (Linux; Android 9; MIX 2S Build/PKQ1.180729.001; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/66.0.3359.126 MQQBrowser/6.2 TBS/044504 Mobile Safari/537.36 MMWEBID/7711 MicroMessenger/7.0.3.1400(0x2700033A) Process/tools NetType/WIFI Language/zh_CN' -H 'Referer: https://wechat.benmu-health.com/wechatV2/' -H 'Accept-Language: zh-CN,en-US;q=0.9' -H 'X-Requested-With: com.tencent.mm' --compressed 'https://wechat.benmu-health.com/mobile/wx/product/departments?hosCode=H111512&CHANNEL=wechat&_=1551281169848'
```
返回数据
```json
{
  "resCode":0,
  "msg":null,
  "data":{
    "hosLevel":"三级甲等",
    "hosAddress":"北京市通州区潞苑四街苏坨新村南侧",
    "lng":116.683295,
    "lat":39.9377623,
    "name":"北京友谊医院通州院区",
    "logo":"//lev-inf.benmu-health.com/resource/image/eb63828872f2676e3d2f4b42e7c7f51f.jpg",
    "open":true,
    "advanceDay":8,
    "curOpenRegTime":"00:00:00",
    "lastOpenRegTime":"00:00:00",
    "noticeBoardStatus":false,
    "noticeBoardBrief":null,
    "noticeBoardDetail":null,
    "departments":[
      {
        "id":0,
        "departCode":"知名专家团队",
        "name":"知名专家团队",
        "subDepartments":[
          {
            "id":0,
            "departCode":null,
            "name":"龚树生教授耳鸣耳聋、面神经、听力知名专家团队",
            "virtual":true,
            "virtualDepartInfoList":[
              {
                "virtual":true,
                "vL1Id":1630646,
                "vL2Id":1620475,
                "vL1DepartCode":"h_EBYHK_f8180703_vir",
                "vL2DepartCode":"1209",
                "vL1Name":"耳鼻咽喉科",
                "vL2Name":"耳鼻喉科门诊",
                "virtualType":"expert",
                "keyword":"龚树生"
              }
            ],
            "virtualType":"expert",
            "importantDeptView":""
          }
        ],
        "importantDeptView":""
      },
      {
        "id":1688327,
        "departCode":"h_ZBZJMZ_b961cd7f_vir",
        "name":"专病专家门诊",
        "subDepartments":[
          {
            "id":1620461,
            "departCode":"1253",
            "name":"骨质疏松专病专家门诊",
            "virtual":false,
            "virtualDepartInfoList":null,
            "virtualType":null,
            "importantDeptView":""
          }
        ],
        "importantDeptView":""
      }
    ],
    "healthCheckOpen":false,
    "openCheckup":false,
    "checkupH5Link":null
  }
}
```
## 查询部门近日号源
```bash
curl -H 'Host: wechat.benmu-health.com' -H 'Accept: application/json, text/plain, */*' -H 'ucp: [your ucp string]' -H 'lgd: 1' -H 'attention: 1' -H 'User-Agent: Mozilla/5.0 (Linux; Android 9; MIX 2S Build/PKQ1.180729.001; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/66.0.3359.126 MQQBrowser/6.2 TBS/044504 Mobile Safari/537.36 MMWEBID/7711 MicroMessenger/7.0.3.1400(0x2700033A) Process/tools NetType/WIFI Language/zh_CN' -H 'Referer: https://wechat.benmu-health.com/wechatV2/' -H 'Accept-Language: zh-CN,en-US;q=0.9' -H 'X-Requested-With: com.tencent.mm' --compressed 'https://wechat.benmu-health.com/mobile/wx/product/list/v2?_=1551494062572&hosCode=H111512&firstDeptCode=mn_fst_zlk_0c5468&secondDeptCode=1264&xa7w6pf=e3a1e29cf1681423c9ec63d03b71a287&_=1551494062610'
```
返回
```json
{
	"resCode": 0,
	"msg": null,
	"data": {
		"dateList": [
			[{
				"date": "2019-03-02",
				"status": "NO_INVENTORY",
				"waitOpenTime": 0,
				"openTimestamp": 0
			}, {
				"date": "2019-03-03",
				"status": "NO_INVENTORY",
				"waitOpenTime": 0,
				"openTimestamp": 0
			}, {
				"date": "2019-03-04",
				"status": "NO_INVENTORY",
				"waitOpenTime": 0,
				"openTimestamp": 0
			}, {
				"date": "2019-03-05",
				"status": "NO_INVENTORY",
				"waitOpenTime": 0,
				"openTimestamp": 0
			}, {
				"date": "2019-03-06",
				"status": "AVAILABLE",
				"waitOpenTime": 0,
				"openTimestamp": 0
			}, {
				"date": "2019-03-07",
				"status": "NO_INVENTORY",
				"waitOpenTime": 0,
				"openTimestamp": 0
			}, {
				"date": "2019-03-08",
				"status": "NO_INVENTORY",
				"waitOpenTime": 0,
				"openTimestamp": 0
			}, {
				"date": "2019-03-09",
				"status": "NO_INVENTORY",
				"waitOpenTime": 0,
				"openTimestamp": 0
			}, {
				"date": "2019-03-10",
				"status": "TOMORROW_OPEN",
				"waitOpenTime": 48337098,
				"openTimestamp": 1551542400000
			}]
		],
		"today": "2019-03-02"
	}
}
```

## 查询科室医生和号源

```bash
curl -H 'Host: wechat.benmu-health.com' -H 'ucp: [your ucp string]' -H 'attention: 1' -H 'longitude: 116.55323' -H 'User-Agent: Mozilla/5.0 (Linux; Android 9; MIX 2S Build/PKQ1.180729.001; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/66.0.3359.126 MQQBrowser/6.2 TBS/044504 Mobile Safari/537.36 MMWEBID/7711 MicroMessenger/7.0.3.1400(0x2700033A) Process/tools NetType/WIFI Language/zh_CN' -H 'Accept: application/json, text/plain, */*' -H 'lgd: 1' -H 'latitude: 39.77783' -H 'Referer: https://wechat.benmu-health.com/wechatV2/' -H 'Accept-Language: zh-CN,en-US;q=0.9' -H 'X-Requested-With: com.tencent.mm' --compressed 'https://wechat.benmu-health.com/mobile/wx/product/dic/detail/v2?_=1551275844958&hosCode=H111512&firstDeptCode=mn_fst_fck_433ac3&secondDeptCode=1187&date=2019-02-28&status=AVAILABLE&extra=true&xa7w6pf=214664efad7f4d3431f0bfb924eaf3e4&_=1551275844991'
```
返回结果
```json
{
  "resCode":0,
  "msg":null,
  "data":{
    "hosCode":"H111512",
    "evaluation":"https://wechat.benmu-health.com/mobile/wx/common/marticle/render/2312",
    "amList":[
      {
        "productId":"MD5_184a6cb9e42ff420c48f3dae142a113d",
        "uniqProductKey":"168add26a8215723b75182bc49a62408fabc4334",
        "date":"2019-02-28",
        "type":"FAMOUS",
        "orderProductType":0,
        "doctorInfo":{
          "doctorId":918053,
          "code":"18053",
          "name":"通州院区刘芸(上午)",
          "title":"知名专家,教授号",
          "specialtyDesc":"刘医生专长：子宫内膜异位症、早期恶性肿瘤、宫腔黏连微创治疗",
          "special":false
        },
        "remark":"",
        "price":0,
        "inventory":0,
        "showTimeType":"AM",
        "treatEffectiveTimeRanges":[

        ],
        "status":"INVALID",
        "hidePrice":false,
        "priceType":"CONFIRMED",
        "sourceExtParam":"21813||5",
        "regNoTimes":[

        ],
        "specialInfo":null,
        "refundTip":null,
        "unrefundable":false,
        "inventoryV2":"&#xf6d4;",
        "priceV2":"&#xf5f3;&#xf6d4;&#xf6d4;",
        "dic":"//img.benmu-health.com/wechat/icons/91f7h1hn9fybwmbalp550o1or",
        "revolution":false
      },
      {
        "productId":"MD5_76b558e14b71f3f6862f63faf033f782",
        "uniqProductKey":"bbaeae89579128b44d0a37d6bc0b128129b5eb12",
        "date":"2019-02-28",
        "type":"CHIEF",
        "orderProductType":0,
        "doctorInfo":{
          "doctorId":918069,
          "code":"18069",
          "name":"通州院区龙燕(上午)",
          "title":"正主任医师（80元）",
          "specialtyDesc":"龙医生专长：产前咨询、高危妊娠、常见妇产科疾病",
          "special":false
        },
        "remark":"妇科门诊",
        "price":0,
        "inventory":0,
        "showTimeType":"AM",
        "treatEffectiveTimeRanges":[

        ],
        "status":"INVALID",
        "hidePrice":false,
        "priceType":"CONFIRMED",
        "sourceExtParam":"21829||9",
        "regNoTimes":[

        ],
        "specialInfo":null,
        "refundTip":null,
        "unrefundable":false,
        "inventoryV2":"&#xf6d4;",
        "priceV2":"&#xf5b8;&#xf6d4;",
        "dic":"//img.benmu-health.com/wechat/icons/91f7h1hn9fybwmbalp550o1or",
        "revolution":false
      },
      {
        "productId":"MD5_b94345298114f9eaceafa6119cb00e9c",
        "uniqProductKey":"3a7a7ae71af9faf77c1edcf7e752b4f5bb7a5973",
        "date":"2019-02-28",
        "type":"ORDINARY",
        "orderProductType":0,
        "doctorInfo":{
          "doctorId":917630,
          "code":"17630",
          "name":"通州院区妇科门诊(上午)",
          "title":"普通门诊号",
          "specialtyDesc":"",
          "special":false
        },
        "remark":"妇科门诊",
        "price":0,
        "inventory":0,
        "showTimeType":"AM",
        "treatEffectiveTimeRanges":[

        ],
        "status":"INVALID",
        "hidePrice":false,
        "priceType":"CONFIRMED",
        "sourceExtParam":"19637||92",
        "regNoTimes":[

        ],
        "specialInfo":null,
        "refundTip":null,
        "unrefundable":false,
        "inventoryV2":"&#xf6d4;",
        "priceV2":"&#xf17c;&#xf6d4;",
        "dic":"//img.benmu-health.com/wechat/icons/91f7h1hn9fybwmbalp550o1or",
        "revolution":false
      }
    ],
    "pmList":[
      {
        "productId":"MD5_69aff1a132352b6b05ecc6585d4ee562",
        "uniqProductKey":"ecff496d3ea18d1a52d57dc60134015ba209784d",
        "date":"2019-02-28",
        "type":"FAMOUS",
        "orderProductType":0,
        "doctorInfo":{
          "doctorId":918054,
          "code":"18054",
          "name":"通州院区刘芸(下午)",
          "title":"知名专家,教授号",
          "specialtyDesc":"刘医生专长：子宫内膜异位症、早期恶性肿瘤、宫腔黏连微创治疗",
          "special":false
        },
        "remark":"",
        "price":0,
        "inventory":0,
        "showTimeType":"PM",
        "treatEffectiveTimeRanges":[

        ],
        "status":"VALID",
        "hidePrice":false,
        "priceType":"CONFIRMED",
        "sourceExtParam":"21814||5",
        "regNoTimes":[

        ],
        "specialInfo":null,
        "refundTip":null,
        "unrefundable":false,
        "inventoryV2":"&#xf531;",
        "priceV2":"&#xf5f3;&#xf6d4;&#xf6d4;",
        "dic":"//img.benmu-health.com/wechat/icons/91f7h1hn9fybwmbalp550o1or",
        "revolution":false
      },
      {
        "productId":"MD5_81522b4b7c9d80e02a901394f16be87e",
        "uniqProductKey":"d3e60764b8c5379140c25c2dd177c002f3d9659e",
        "date":"2019-02-28",
        "type":"ORDINARY",
        "orderProductType":0,
        "doctorInfo":{
          "doctorId":917636,
          "code":"17636",
          "name":"通州院区妇科门诊(下午)",
          "title":"普通门诊号",
          "specialtyDesc":"",
          "special":false
        },
        "remark":"妇科门诊",
        "price":0,
        "inventory":0,
        "showTimeType":"PM",
        "treatEffectiveTimeRanges":[

        ],
        "status":"VALID",
        "hidePrice":false,
        "priceType":"CONFIRMED",
        "sourceExtParam":"19638||78",
        "regNoTimes":[

        ],
        "specialInfo":null,
        "refundTip":null,
        "unrefundable":false,
        "inventoryV2":"&#xf00e;&#xf17c;",
        "priceV2":"&#xf17c;&#xf6d4;",
        "dic":"//img.benmu-health.com/wechat/icons/91f7h1hn9fybwmbalp550o1or",
        "revolution":false
      },
      {
        "productId":"MD5_391b2daed5124e0e51a454d169c99f3a",
        "uniqProductKey":"956c5e8f0d0ffdaf00d2afe9e98f17ecb507cf7f",
        "date":"2019-02-28",
        "type":"CHIEF",
        "orderProductType":0,
        "doctorInfo":{
          "doctorId":918070,
          "code":"18070",
          "name":"通州院区龙燕(下午)",
          "title":"正主任医师（80元）",
          "specialtyDesc":"龙医生专长：产前咨询、高危妊娠、常见妇产科疾病",
          "special":false
        },
        "remark":"妇科门诊",
        "price":0,
        "inventory":0,
        "showTimeType":"PM",
        "treatEffectiveTimeRanges":[

        ],
        "status":"INVALID",
        "hidePrice":false,
        "priceType":"CONFIRMED",
        "sourceExtParam":"21830||8",
        "regNoTimes":[

        ],
        "specialInfo":null,
        "refundTip":null,
        "unrefundable":false,
        "inventoryV2":"&#xf6d4;",
        "priceV2":"&#xf5b8;&#xf6d4;",
        "dic":"//img.benmu-health.com/wechat/icons/91f7h1hn9fybwmbalp550o1or",
        "revolution":false
      },
      {
        "productId":"MD5_b4fdbb2d6d8a7e9d99a88d1d0cf7ab5b",
        "uniqProductKey":"357839705f56c1cc9864892edea9d1183cccfa90",
        "date":"2019-02-28",
        "type":"ORDINARY",
        "orderProductType":0,
        "doctorInfo":{
          "doctorId":917704,
          "code":"17704",
          "name":"通州院区产科建档预约号(下午)",
          "title":"普通门诊号",
          "specialtyDesc":"此号仅限于同时满足：1.宫内孕8-9周活胎；2.艾梅乙血液检查正常；3.办好母子健康手册3个条件的孕妇挂号",
          "special":false
        },
        "remark":"产科建档预约",
        "price":0,
        "inventory":0,
        "showTimeType":"PM",
        "treatEffectiveTimeRanges":[

        ],
        "status":"INVALID",
        "hidePrice":false,
        "priceType":"CONFIRMED",
        "sourceExtParam":"19653||7",
        "regNoTimes":[

        ],
        "specialInfo":null,
        "refundTip":null,
        "unrefundable":false,
        "inventoryV2":"&#xf6d4;",
        "priceV2":"&#xf17c;&#xf6d4;",
        "dic":"//img.benmu-health.com/wechat/icons/91f7h1hn9fybwmbalp550o1or",
        "revolution":false
      }
    ],
    "nightList":[

    ],
    "allDayList":[

    ],
    "refSourceNo":[

    ],
    "referProduct":[

    ],
    "currentType":"AM",
    "queryDate":"2019-02-28",
    "weekDisplay":null,
    "dic":"//img.benmu-health.com/wechat/icons/91f7h1hn9fybwmbalp550o1or",
    "productTip":"",
    "firstDepartName":"妇产科",
    "secondDepartName":"妇产科门诊",
    "deptHomeLevel":"none",
    "hosName":"北京友谊医院通州院区",
    "expertId":null,
    "expertName":null,
    "showConsult":false
  }
}
```

## 确认是否可以挂号

```bash
curl -H 'Host: wechat.benmu-health.com' -H 'ucp: [your ucp string]' -H 'Origin: https://wechat.benmu-health.com' -H 'attention: 1' -H 'User-Agent: Mozilla/5.0 (Linux; Android 9; MIX 2S Build/PKQ1.180729.001; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/66.0.3359.126 MQQBrowser/6.2 TBS/044504 Mobile Safari/537.36 MMWEBID/7711 MicroMessenger/7.0.3.1400(0x2700033A) Process/tools NetType/WIFI Language/zh_CN' -H 'Content-Type: application/json;charset=UTF-8' -H 'Accept: application/json, text/plain, */*' -H 'lgd: 1' -H 'Referer: https://wechat.benmu-health.com/wechatV2/' -H 'Accept-Language: zh-CN,en-US;q=0.9' -H 'X-Requested-With: com.tencent.mm' --data-binary '{"productId":"MD5_a82e138b515d701cc55a65162d575c1c","doctorId":4289908,"hosCode":"H111501","firstDeptCode":"1010601","secondDeptCode":"1010601_1061010","firstDeptId":37442,"secondDeptId":549160,"productType":"VICE","price":null,"treatmentDay":"2019-03-01","regHour":"","productTimeType":"PM","orderProductType":"","cardNo":"[医保卡ID]"}' --compressed 'https://wechat.benmu-health.com/mobile/wx/order/preSaveCheck?_=1551274074817'
```
返回结果
有号
```json
{"resCode":0,"msg":null,"data":{"message":"","state":"OK"}}
```
无号
```json
{"resCode":10000,"msg":"没有相关号源","data":null}
```
## 挂号
```bash
curl -H 'Host: wechat.benmu-health.com' -H 'ucp: [your ucp string]' -H 'Origin: https://wechat.benmu-health.com' -H 'attention: 1' -H 'User-Agent: Mozilla/5.0 (Linux; Android 9; MIX 2S Build/PKQ1.180729.001; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/66.0.3359.126 MQQBrowser/6.2 TBS/044504 Mobile Safari/537.36 MMWEBID/7711 MicroMessenger/7.0.3.1400(0x2700033A) Process/tools NetType/WIFI Language/zh_CN' -H 'Content-Type: application/json;charset=UTF-8' -H 'Accept: application/json, text/plain, */*' -H 'lgd: 1' -H 'Referer: https://wechat.benmu-health.com/wechatV2/' -H 'Accept-Language: zh-CN,en-US;q=0.9' -H 'X-Requested-With: com.tencent.mm' --data-binary '{"productId":"MD5_a82e138b515d701cc55a65162d575c1c","doctorId":4289908,"hosCode":"H111501","firstDeptCode":"1010601","secondDeptCode":"1010601_1061010","firstDeptId":37442,"secondDeptId":549160,"productType":"VICE","price":null,"treatmentDay":"2019-03-01","regHour":"","productTimeType":"PM","orderProductType":0,"orderFrom":"REGISTER","cardNo":"[医保卡ID]"}' --compressed 'https://wechat.benmu-health.com/mobile/wx/order/save?_=1551274075262'
```
返回结果
获得orderNo说明挂号成功。
```json
{"resCode":0,"msg":null,"data":{"orderNo":100972646585}}
```

# 参考

[mobile-template](https://github.com/karynsong/mobile-template)

# 版权
采用Apache 2.0 协议，作者：patientdesperate@gmail.com
