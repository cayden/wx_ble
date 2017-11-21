# 微信小程序 蓝牙实现

此前是通过安卓客户端实现对蓝牙设备的扫描、连接和通讯等操作，本篇主要介绍一下使用微信小程序来对蓝牙设备的操作。

## 1.简述

 - 蓝牙适配器接口是基础库版本 1.1.0 开始支持。
 - iOS 微信客户端 6.5.6 版本开始支持，Android 6.5.7 版本开始支持。
 - 蓝牙总共增加了18个api接口。
 - 目前不支持在开发者工具上进行调试，需要使用真机才能正常调用小程序蓝牙接口。


## 2.Api分类

 - 搜索类
 - 连接类
 - 通信类

## 3.API的具体使用
详细见官网：

[https://mp.weixin.qq.com/debug/wxadoc/dev/api/bluetooth.html#wxgetconnectedbluethoothdevicesobject](https://mp.weixin.qq.com/debug/wxadoc/dev/api/bluetooth.html#wxgetconnectedbluethoothdevicesobject)

## 4. 案例实现
#### 4.1 搜索蓝牙设备

```
/**
 * 搜索设备界面
 */
Page({
  data: {
    logs: [],
    loading:false,
    list:[]
  },
   onLoad: function () {
    console.log('onLoad')
    var that = this;

      wx.openBluetoothAdapter({
      success: function(res){
        // success
        console.log("-----success----------");
         console.log(res);
       wx.startBluetoothDevicesDiscovery({
  services: [],
  success: function(res){
    // success
     console.log("-----startBluetoothDevicesDiscovery--success----------");
     console.log(res);
  },
  fail: function(res) {
    // fail
     console.log(res);
  },
  complete: function(res) {
    // complete
     console.log(res);
  }
})


      },
      fail: function(res) {
         console.log("-----fail----------");
        // fail
         console.log(res);
      },
      complete: function(res) {
        // complete
         console.log("-----complete----------");
         console.log(res);
      }
    })

     wx.getBluetoothDevices({
       success: function(res){
         // success
         //{devices: Array[11], errMsg: "getBluetoothDevices:ok"}
         console.log("getBluetoothDevices");
         console.log(res);
          that.setData({
          list:res.devices,
          loading: true
          });
          console.log(that.data.list);
       },
       fail: function(res) {
         // fail
       },
       complete: function(res) {
         // complete
       }
     })

  },
  onShow:function(){
 

  },
   //点击事件处理
  bindViewTap: function(e) {
     console.log(e.currentTarget.dataset.title);
     console.log(e.currentTarget.dataset.name);
     console.log(e.currentTarget.dataset.advertisData);
     
    var title =  e.currentTarget.dataset.title;
    var name = e.currentTarget.dataset.name;
     wx.redirectTo({
       url: '../service/service?deviceId='+title+'&name='+name,
       success: function(res){
         // success
       },
       fail: function(res) {
         // fail
       },
       complete: function(res) {
         // complete
       }
     })
  },
  
})

```
<img src="http://img.blog.csdn.net/20171120093931680?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQvY3VpcmFu/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/SouthEast" width = "60%" />

#### 4.2 连接蓝牙设备，并获取服务列表

```
/**
 * 显示设备服务界面
 */

/**
 * 连接设备。获取数据
 */
var dId;
Page({
  data: {
    motto: 'Hello World',
    loading: false,
    userInfo: {},
    deviceId: '',
    name: '',
    serviceId: '',
    services: [],
    cd20: '',
    cd01: '',
    cd02: '',
    cd03: '',
    cd04: '',
    characteristics20: null,
    characteristics01: null,
    characteristics02: null,
    characteristics03: null,
    characteristics04: null,
    list: []

  },
  onLoad: function (opt) {
    var that = this;
    console.log("onLoad");
    console.log('deviceId=' + opt.deviceId);
    console.log('name=' + opt.name);
    dId = opt.deviceId;
    that.setData({ deviceId: opt.deviceId });
    /**
     * 监听设备的连接状态
     */
    wx.onBLEConnectionStateChanged(function (res) {
      console.log(`device ${res.deviceId} state has changed, connected: ${res.connected}`)
    })
    /**
     * 连接设备
     */
    wx.createBLEConnection({
      deviceId: that.data.deviceId,
      success: function (res) {
        // success
        console.log(res);
        /**
         * 连接成功，后开始获取设备的服务列表
         */
        wx.getBLEDeviceServices({
          // 这里的 deviceId 需要在上面的 getBluetoothDevices中获取
          deviceId: that.data.deviceId,
          success: function (res) {
            console.log('device services:', res.services)
            that.setData({ 
              list: res.services,
              loading: true
             });
           
          }
        })
      },
      fail: function (res) {
        // fail
        console.log(res);
      },
      complete: function (res) {
        // complete
        console.log(res);
      }
    })
  },

  /**
   * 获取特征值列表
   */
  bindViewTap: function (e) {
    console.log(e.currentTarget.dataset);
    var name = e.currentTarget.dataset.title;
    var deviceId = dId;
    console.log("uuid:" + name + ",deviceId:" + deviceId);
    wx.redirectTo({
      url: '../charact/charact?deviceId=' + deviceId + '&serviceId=' + name,
      success: function (res) {
        // success
      },
      fail: function (res) {
        // fail
      },
      complete: function (res) {
        // complete
      }
    })

  },
  buf2hex: function (buffer) { // buffer is an ArrayBuffer
    return Array.prototype.map.call(new Uint8Array(buffer), x => ('00' + x.toString(16)).slice(-2)).join('');
  }
})
```
<img src="http://img.blog.csdn.net/20171120094936690?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQvY3VpcmFu/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/SouthEast" width = "60%" />

从图可知道uuid 为0000FEE7的是记录步数的服务，通过此uuid可以获得对应的特征值列表
#### 4.3 获取特征值列表，并根据对应的uuid读取对应的值

```
/**
 * 显示设备服务界面
 */

/**
 * 连接设备。获取数据
 */
Page({
  data: {
    motto: 'Hello World',
    loading: false,
    userInfo: {},
    deviceId: '',
    name: '',
    serviceId: '',
    services: [],
    cd20: '',
    cd01: '',
    cd02: '',
    cd03: '',
    cd04: '',
    characteristics20: null,
    characteristics01: null,
    characteristics02: null,
    characteristics03: null,
    characteristics04: null,
    list: []

  },
  onLoad: function (opt) {
    var that = this;
    console.log("onLoad");
    console.log('deviceId=' + opt.deviceId);

    that.setData({
       deviceId: opt.deviceId ,
       serviceId:opt.serviceId
       });
    /**
     * 监听设备的连接状态
     */
    wx.onBLEConnectionStateChanged(function (res) {
      console.log(`device ${res.deviceId} state has changed, connected: ${res.connected}`)
    })
   
    wx.getBLEDeviceCharacteristics({
      deviceId: that.data.deviceId,
      serviceId: that.data.serviceId,
      success:function(res){
        that.setData({
          list: res.characteristics,
          loading: true
        });

        /**
         * 回调获取 设备发过来的数据
         */
        wx.onBLECharacteristicValueChange(function (characteristic) {
          console.log(characteristic);
          const hex = that.buf2hex(characteristic.value);
          console.log('characteristic value comed:', hex);
          wx.showModal({
            title: '读取的值',
            content: '结果:' + hex,
            success: function (ress) {
              if (ress.confirm) {
                console.log('用户点击确定');
              }
            }
          })
        })
      }
    })
  },
  //读取数据
  readViewTap: function (e) {
  
    var that = this;
    var name = e.currentTarget.dataset.name;
    console.log("characteristicId:" + name + ",serviceId:" + that.data.serviceId + ",deviceId:" + that.data.deviceId);

    // wx.notifyBLECharacteristicValueChanged({
    //   state: true, // 启用 notify 功能
    //   deviceId: that.data.deviceId,
    //   serviceId: that.data.serviceId,
    //   characteristicId: name,
    //   success: function (res) {
    //     console.log("启用notify:" + res);
    //     console.log(res);

    //   }
    // })

    //读取记录
    wx.readBLECharacteristicValue({
      deviceId: that.data.deviceId,
      serviceId: that.data.serviceId,
      characteristicId: name,
      success: function(res) {
        console.log('readBLECharacteristicValue:', res.errMsg);  
       

      },
    })

  },

  notifyViewTap: function (e) {
    var that = this;
    var name = e.currentTarget.dataset.name;
    console.log("characteristicId:" + name + ",serviceId:" + that.data.serviceId + ",deviceId:" + that.data.deviceId);

    wx.notifyBLECharacteristicValueChanged({
      state: true, // 启用 notify 功能
      deviceId: that.data.deviceId,
      serviceId: that.data.serviceId,
      characteristicId: name,
      success: function (res) {
        console.log("启用notify:");
        console.log(res);
        // wx.onBLECharacteristicValueChange(function (res) {
        //   console.log("onBLECharacteristicValueChange:" + res);
        //   console.log(res.value);
        // })

      }
    })

  },
  /**
   *读取数据
   */
  bindViewTap: function (e) {
  var that=this;
  var name = e.currentTarget.dataset.title;
  console.log("characteristicId:" + name + ",serviceId:" + that.data.serviceId + ",deviceId:" + that.data.deviceId);
    //读取记录

  // var hex = '0A3700';
  // var typedArray = new Uint8Array(hex.match(/[\da-f]{2}/gi).map(function (h) {
  //   return parseInt(h, 16)
  // }))
  // console.log(typedArray);


      wx.notifyBLECharacteristicValueChanged({
      state: true, // 启用 notify 功能
      deviceId: that.data.deviceId,
      serviceId: that.data.serviceId,
      characteristicId: name,
      success: function (res) {
        console.log("启用notify:" + res);
        wx.onBLECharacteristicValueChange(function (res) {
          console.log("onBLECharacteristicValueChange:" + res);
          console.log(res.value);
        })

      }
    })

  // var buffer1 = typedArray.buffer
  // console.log("buffer1:");
  // console.log(buffer1);

  var Bytes = new Array();
    Bytes[0] = 0x01;
    Bytes[1] = 0x02;
    Bytes[2] = 0x03;
    console.log(Bytes);

    // wx.readBLECharacteristicValue({
    //   deviceId: that.data.deviceId,
    //   serviceId: that.data.serviceId,
    //   characteristicId: name,
    //   success: function(res) {
    //     console.log('readBLECharacteristicValue:', res.errMsg);  
    //     wx.showModal({
    //       title: '读取的值',
    //       content: '结果:' + res,
    //       success: function (ress) {
    //         if (ress.confirm) {
    //           console.log('用户点击确定')
    //         }
    //       }
    //     })
       
    //   },
    // })




   
    
    
    
    // wx.writeBLECharacteristicValue({
    //   deviceId: that.data.deviceId,
    //   serviceId: that.data.serviceId,
    //   characteristicId: name,
    //   value: buffer1,
    //   success: function (res) {
    //     // success
    //     console.log("success  指令发送成功");
    //     console.log(res);
    //   },
    //   fail: function (res) {
    //     // fail
    //     console.log("fail  指令发送fail");
    //     console.log(res);
    //   },
    //   complete: function (res) {
    //     // complete
    //   }
    // })

 
  },
  buf2hex: function (buffer) { // buffer is an ArrayBuffer
    return Array.prototype.map.call(new Uint8Array(buffer), x => ('00' + x.toString(16)).slice(-2)).join('');
  }
})
```

<img src="http://img.blog.csdn.net/20171120095236884?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQvY3VpcmFu/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/SouthEast" width = "60%" />
