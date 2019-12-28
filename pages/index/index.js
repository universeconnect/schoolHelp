//index.js
//获取应用实例

const app = getApp()
let location = require('location')
let countLocation = require('countLocation')
Page({
  data: {
    centerX: '',
    centerY: '',
    scale: 16, //默认缩放比例
    uScale:'', //用户缩放比例
    speed: '',
    accuracy: '',
    cardCur: 0,
    toBottom: '65%', //距离顶部
    x: '0',
    y: '0',
    true: 'true',
    showBlock: 'none',  //是否显示列表none不，block显示
    openCoverView: '',
    covShow: 'block', //是否显示个人中心
    items: [1, 2, 3, 4, 5],
    markers: []
  },

  onLoad: function () {
    let that = this;
    wx.getLocation({
      type: 'gcj02', //返回可以用于wx.openLocation的经纬度
      success: (res) => {
        let latitude = res.latitude;
        let longitude = res.longitude;
        let marker = that.createMarker(res);
        that.setData({
          centerX: longitude,
          centerY: latitude,
          markers: that.getHospitalMarkers(),
          uScale:this.data.scale
        })
      }, //定位失败回调      
      fail: function () {
        wx.hideLoading();
        console.log("getLocationFail")
      },
      complete: function () {
        //隐藏定位中信息进度       
        wx.hideLoading()
      }
    })
  },


  onReady:function(){
    
  },

  //地图缩放时事件
  regionchange(e) {
    let that = this;
    let map = wx.createMapContext("index-map");
    map.getScale({
      success:function(e){
        that.setData({
          uScale:e.scale
        })
        console.log(e.scale)
        if(e.scale<14){   //缩放比例小于14
          that.setData({
            markers:that.getCountMarkers()    //显示统计标记点数
          })
          console.log(that.data.markers)
        }else{
          that.setData({
            markers:that.getHospitalMarkers()   //显示全部标记
          })
        }
      }
    });
   
  },

  /**
   * 点击标识点触发 */
  markertap(e) {
    
    console.log(e);
    this.setData({
      openCoverView:'none'
    })
    //获得组件
    let mesgBox = this.selectComponent("#mesgBox-index");
    //更新数据
    let that = this;
    this.setData({
      openCoverView:'none',
      showBlock:'none'
    })
    wx.request({
      url: 'http://49.234.9.206:3000/app', //仅为示例，并非真实的接口地址
      header: {
        'content-type': 'application/json' // 默认值
      },
      success (res) {
        mesgBox.setData({
          author:res.data.info[0].information_place,
          content:res.data.info[0].information_title,
          hidemesgBox:'block'
        })
        console.log(res.data)
      },
      
    })
   
  },

  /**
   * control控件点击时间
   */
  controltap(e) {
    this.setData({
      showBlock: 'none',   //点击定位按钮，隐藏列表
      openCoverView: 'block'
    });
    this.moveToLocation()
  },


  /**
   * 获取标识
   */
  getHospitalMarkers() {
    let markers = [];
    for (let item of location) {
      let marker = this.createMarker(item);
      markers.push(marker)
    }
    return markers;
  },

  getCountMarkers() {  //获取区域内的标记数量
    let markers = [];
    for (let item of countLocation) {
      let marker = this.createMarker2(item);
      markers.push(marker)
    }
    return markers;
  },


  /**
   * 移动到自己位置
   */
  moveToLocation: function () {
    let mpCtx = wx.createMapContext("index-map");
    mpCtx.moveToLocation();
  },


  /**
   * 还有地图标识，可以在name上面动手
   */
  createMarker(point) {
    let latitude =point.latitude;
    let longitude =point.longitude;
    let bgColor;
    let idColor = (point.id) % 5;
    switch (idColor) {
      case 0:
        bgColor = "#e54d42"; break;
      case 1:
        bgColor = "#f37b1d"; break;
      case 2:
        bgColor = "#39b54a"; break;
      case 3:
        bgColor = "#0081ff"; break;
      case 4:
        bgColor = "#6739b6"; break;
      default:
        bgColor = "#000000"; break;
    }
    let marker = {
      iconPath: "../../images/cr2.png",
      id: point.id || 0,
      title: point.title || '',
      latitude: latitude,
      longitude:longitude,
      width: 30,
      height: 50,
      label: {
        content: point.content,
        fontSize: '25rpx',
        color: "#fff",
        bgColor: bgColor,
        padding: '8rpx',
        anchorY: "-15",
        anchorX: "-15",
        borderRadius: '30rpx'
      }
    };
    return marker;
  },


  createMarker2(point) {               //创建统计标记
    let latitude =point.latitude;
    let longitude =point.longitude;
    let bgColor;
    let idColor = (point.id) % 5;
    switch (idColor) {
      case 0:
        bgColor = "#e54d42"; break;
      case 1:
        bgColor = "#f37b1d"; break;
      case 2:
        bgColor = "#39b54a"; break;
      case 3:
        bgColor = "#0081ff"; break;
      case 4:
        bgColor = "#6739b6"; break;
      default:
        bgColor = "#000000"; break;
    }
    let marker = {
      iconPath: "../../images/po2.png",
      id: point.id || 0,
      title: point.title || '',
      latitude: latitude,
      longitude:longitude,
      width: 50,
      height: 50,
      label: {
        content: point.content,
        fontSize: '25rpx',
        color: "#fff",
        bgColor: bgColor,
        padding: '8rpx',
        anchorY: "-15",
        anchorX: "-15",
        borderRadius: '30rpx'
      }
    };
    return marker;
  },

  //开启列表

  openShowBlock: function () {
    this.setData({
      showBlock: 'block',
      openCoverView: 'none'
    })
  },

  //到顶部
  vtouchmoveFun: function () {
    this.setData({
      toBottom: "20%",
      covShow: 'none'
    })
  },

  //返回底部
  backBottom: function (e) {
    if (e.detail.direction == "top") {
      this.setData({
        toBottom: "65%",
        covShow: 'block'
      })
    }
  },

  //跳转到个人中心
  toPersion: function () {
    wx.navigateTo({
      url: '../../pages/personer/person',
    })
  },

  //搜索
  searchHelp:function(){
      //输入时
  }
})
