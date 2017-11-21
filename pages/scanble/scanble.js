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
