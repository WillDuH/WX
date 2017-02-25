var util = require("../../utils/utils.js");
var app = getApp();
Page({
    data: {
        inTheaters: {},
        comingSoon: {},
        top250: {},
        containerShow: true,
        searchPanalShow: false,
        searchResult: {}
    },
    onLoad: function (event) {
        var top250Url = app.globalData.doubanBase + "/v2/movie/top250" + "?start=0&count=3";
        var inTheatersUrl = app.globalData.doubanBase + "/v2/movie/in_theaters" + "?start=0&count=3";
        var comingSoonUrl = app.globalData.doubanBase + "/v2/movie/coming_soon" + "?start=0&count=3";
        this.getMovieListData(top250Url, "top250", "豆瓣Top250");
        this.getMovieListData(inTheatersUrl, "inTheaters", "正在热映");
        this.getMovieListData(comingSoonUrl, "comingSoon", "即将上映");

    },
    //更多跳转
    onMoreTap: function (event) {
        var category = event.currentTarget.dataset.category;
        wx.navigateTo({
            url: "more-movie/more-movie?category=" + category,
        })
    },
    //电影详情页跳转
    onMovieTap: function (event) {
        var movieId = event.currentTarget.dataset.movieid;
        wx.navigateTo({
            url: "movie-detail/movie-detail?id=" + movieId,
        })
    },
    getMovieListData: function (url, settedkey, categoryTitle) {
        var that = this;
        wx.request({
            url: url,
            data: {},
            method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
            header: {
                "content-type": "json"
            }, // 设置请求的 header
            success: function (res) {
                // success
                that.processDoubanData(res.data, settedkey, categoryTitle)
            }
        })
    },

    onBindFocus: function (event) {
        var text = event.detail.value;
        this.setData({
            containerShow: false,
            searchPanalShow: true,
            searchResult: {}

        })
    },

    onCancalImgTap: function (event) {
        this.setData({
            containerShow: true,
            searchPanalShow: false
        })
    },

    onBindconfirm: function (event) {
        var text = event.detail.value;
        var searchUrl = app.globalData.doubanBase + "/v2/movie/search?q={text}" + text;
        this.getMovieListData(searchUrl, "searchResult", "")
    },

    processDoubanData: function (moviesDouban, settedkey, categoryTitle) {
        var movies = [];
        for (var idx in moviesDouban.subjects) {
            var subject = moviesDouban.subjects[idx];
            var title = subject.title;
            if (title.length >= 6) {
                title = title.substring(0, 6) + "...";
            }
            var temp = {
                stars: util.convertToStarsArray(subject.rating.stars),
                title: title,
                average: subject.rating.average,
                coverageUrl: subject.images.large,
                movieId: subject.id
            }
            movies.push(temp);
        }
        var redayData = {};
        redayData[settedkey] = {
            categoryTitle: categoryTitle,
            movies: movies
        }
        this.setData(redayData);
    }

})