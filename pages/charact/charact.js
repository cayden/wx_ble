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