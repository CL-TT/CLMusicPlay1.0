/*
 * @Author: CL
 * @Date: 2020-06-11 16:58:59 
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2020-06-12 00:04:15
 * 
 * 渲染页面的接口{
 *   1. 渲染歌曲的背景图片
 *   2. 歌曲的文字信息
 * }
 */

(function (Player) {
  //render构造函数
  function Render() {}

  Render.prototype = {
    //初始化
    init: function (data) {
      this.getDom();
      this.renderImg(data.image);
      this.renderWords(data);
      this.renderIsLike(data.isLike);
    },

    //渲染背景图片
    renderImg: function (image) {
      // console.log(Player);
      Player.blurImg(image);
      this.singImg.src = image;
    },

    //渲染歌曲信息部分
    renderWords: function (data) {
      this.singTitle.innerText = data.song;
      this.singSinger.innerText = data.singer;
      this.singWords.innerText = data.album;
    },

    //渲染是否喜欢这首歌曲
    renderIsLike: function (isLike) {
      if (isLike) {
        //如果喜欢这首歌， 那么就添加一个class
        this.munesList[0].className = 'like-active';
      }
    },

    //获取Dom元素
    getDom: function () {
      this.singImg = document.querySelector('.singbg img');
      this.singTitle = document.querySelector('.singwords>h1');
      this.singSinger = document.querySelector('.singwords>h3');
      this.singWords = document.querySelector('.singwords>span');
      this.munesList = document.querySelectorAll('.munes div');
    }
  }

  var render = new Render();

  //把接口抛出去
  Player.Render = function (musicData) {
    //传入一条音乐数据
    render.init(musicData)
  };
})(window.Player || (window.Player = {}))