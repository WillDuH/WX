var postsData = require("../../../data/post_data.js");
var app = getApp();
Page({
    data: {

    },
    onLoad: function (options) {
        // 生命周期函数--监听页面加载
        var postId = options.id;
        this.data.currentPostId = postId;
        var postData = postsData.postList[postId];
        this.setData({
            postData: postData
        })
        var postsCollected = wx.getStorageSync('posts_collected');
        if (postsCollected) {
            var postCollected = postsCollected[postId];
            this.setData({
                collected: postCollected
            })
        }
        else {
            var postsCollected = {};
            postsCollected[postId] = false;
            wx.setStorageSync('posts_collected', postsCollected)
        }
        if (app.globalData.g_isPlayingMusic && app.globalData.g_currentMusicPostId === postId) {
            this.setData({
                isPlayingMusic: true
            })

        }
        this.setMusicMonitor();
    },

    //音乐监听
    setMusicMonitor: function () {
        var that = this;
        wx.onBackgroundAudioPlay(function (event) {
            that.setData({
                isPlayingMusic: true
            })
            app.globalData.g_isPlayingMusic = true;
            app.globalData.g_currentMusicPostId = that.data.currentPostId
        }),
            wx.onBackgroundAudioPause(function (event) {
                that.setData({
                    isPlayingMusic: false
                })
                app.globalData.g_isPlayingMusic = false;
                app.globalData.g_currentMusicPostId = null
            }),
            wx.onBackgroundAudioStop(function (event) {
                that.setData({
                    isPlayingMusic: false
                })
                app.globalData.g_isPlayingMusic = false;
                app.globalData.g_currentMusicPostId = null
            })
    },

    onCollectionTap: function (event) {
        this.getPostCollectedSync();
        //this.getPostCollectedAsy();
        //wx.showModal({
        // title: "收藏",
        //content: "是否收藏该文章",
        // cancelText: "否",
        //confirmText: "是",
        //})
    },

    //异步缓存
    getPostCollectedAsy: function (event) {
        var that = this;
        wx.getStorage({
            key: 'posts_collected',
            success: function (res) {
                var postsCollected = res.data;
                var postCollected = postsCollected[that.data.currentPostId];
                //收藏变成未收藏，为收藏变成收藏
                postCollected = !postCollected;
                //更新文章是或者否的缓存值;
                postsCollected[that.data.currentPostId] = postCollected;
                //更新数据绑定变量，实现收藏和未收藏图片切换；
                wx.setStorageSync('posts_collected', postsCollected);
                that.setData({
                    collected: postCollected
                }),
                    that.showToast(postsCollected, postCollected);
            },

        })
    },

    //同步缓存
    getPostCollectedSync: function (event) {
        // postsCollected,为数组；postCollected;为单一变量；
        var postsCollected = wx.getStorageSync('posts_collected');
        var postCollected = postsCollected[this.data.currentPostId];
        //收藏变成未收藏，为收藏变成收藏
        postCollected = !postCollected;
        //更新文章是或者否的缓存值;
        postsCollected[this.data.currentPostId] = postCollected;
        //更新数据绑定变量，实现收藏和未收藏图片切换；
        wx.setStorageSync('posts_collected', postsCollected);
        this.setData({
            collected: postCollected
        })
        this.showToast(postsCollected, postCollected);
    },

    //收藏按钮
    showToast: function (postsCollected, postCollected) {
        wx.setStorageSync('posts_collected', postsCollected);
        this.setData({
            collected: postCollected
        }),
            //提示收藏成功
            wx.showToast({
                title: postCollected ? "收藏成功" : "取消成功",
                duation: 1000,
            })
    },

    //。。。分享
     onShareAppMessage: function (event) {
        return {
            title: this.data.postData.title,
            desc: this.data.postData.content,
            path: '/pages/posts/post-detail/post-detail?id=0'
        }
    },
//分享按钮
    onShareTap: function (event) {
        var itemList = [
            "分享到微信好友",
            "分享到朋友圈",
            "分享到微博",
            "分享到QQ"
        ]
        wx.showActionSheet({
            itemList: itemList,
            itemColor: "#405f80",
            success: function (res) {
                wx.showModal({
                    title: "用户" + itemList[res.tapIndex],
                    content: "用户是否取消," + res.cancle + "现在还不能分享，因为暂时没有此功能",
                })
            }
        })
    },

    //音乐播放控制
    onMusicTap: function (event) {
        var currentPostId = this.data.currentPostId;
        var postDate = postsData.postList[currentPostId];
        var isPlayingMusic = this.data.isPlayingMusic;
        if (isPlayingMusic) {
            wx.pauseBackgroundAudio();
            this.setData({
                isPlayingMusic: false
            })

        }
        else {
            wx.playBackgroundAudio({
                dataUrl: postDate.music.url,
                title: postDate.music.title,
                coverImgUrl: postDate.music.coverImg,
            });
            this.setData({
                isPlayingMusic: true
            })
        }

    }
})