var postsData = require("../../data/post_data.js")
Page({
  data: {

  },
  onLoad: function () {
    // 生命周期函数--监听页面加载
    this.setData({
      post_key: postsData.postList
    });
    //this.data.postList = postsData.postList(失效)
  },
  onPostTap: function (event) {
    var postId = event.currentTarget.dataset.postid;
    wx.navigateTo({
      url: "post-detail/post-detail?id=" + postId

    });
  },

  onSwiperTap: function (event) {
    //target和currentTarget的区别：点击目标，和捕获目标；
    var postId = event.target.dataset.postid;
    wx.navigateTo({
      url: "post-detail/post-detail?id=" + postId

    });
  }

})