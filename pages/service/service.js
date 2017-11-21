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