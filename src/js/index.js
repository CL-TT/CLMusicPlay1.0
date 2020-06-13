/*
 * @Author: CL
 * @Date: 2020-06-11 15:57:58 
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2020-06-13 10:21:44
 * 
 * 主入口文件{
 *   1. 写法是用立即执行函数来模拟模块化开发
 * 
 *   2. 面向对象的编程方式
 * } 
 */


;
(function ($, Player) {

  var div_wrap = document.querySelector('.wrap'); //在外层的div

  //总的构造函数
  function MusicPlayer(dom) {
    this.wrap = dom;
    this.musicList = [];
    this.indexObj = null; //索引对象
    this.listControl = null; //歌曲列表对象
    this.timer = null; //记录定时器的
  }

  MusicPlayer.prototype = {
    //初始化函数
    init: function () {
      var musicUrl = '../mock/data.json';

      this.getDom(); //获取DOM元素

      this.getData(musicUrl); //数据请求

      this.eventListener(); //事件监听
    },

    //获取Dom元素
    getDom: function () {
      this.singImg = document.querySelector('.singbg img'); //歌曲的背景图片的dom元素
      this.munesList = document.querySelectorAll('.munes div'); //底部菜单部分
      this.up_munes = document.querySelector('.up-munes'); //上拉歌曲菜单
      this.close = document.querySelector('.up-munes div'); //关闭按钮
    },

    //获取跟歌曲相关的所有数据
    getData: function (url) {
      //1.第一个错误，this的指向问题
      var This = this;

      $.ajax({
        url: url,
        method: 'get',
        success: function (res) {
          This.musicList = res;
          console.log(This.musicList);
          //列表切歌
          This.listChange(This.musicList);
          //new 出索引对象实例
          This.indexObj = new Player.CurrentIndex(This.musicList);
          //数据请求成功之后，加载跟音乐所有相关的信息
          This.loadMusic(This.indexObj.nowIndex);
          //进度条相关的方法
          This.progress(This.musicList[This.indexObj.nowIndex].duration);
        },
        error: function (err) {
          console.log('请求失败' + err);
        }
      })
    },

    //所有Dom元素的事件监听
    eventListener: function () {
      var audio = Player.Audio;
      var isLike = this.munesList[0];
      var playOrPause = this.munesList[2];
      var munes = this.munesList[4];

      //播放按键的事件监听
      var This = this;

      //喜欢按键监听事件
      isLike.addEventListener('touchend', function () {
        isLike.className = isLike.className ? '' : 'like-active';
      })

      //上一首按键监听
      this.munesList[1].addEventListener('touchend', function () {
        audio.changeStatus(true);
        var nowIndex = This.indexObj.prev();
        This.loadMusic(nowIndex);
        This.proObj.init(This.musicList[nowIndex].duration);
        This.proObj.start();
      }, false)

      //下一首按键监听
      this.munesList[3].addEventListener('touchend', function () {
        audio.changeStatus(true);
        var nowIndex = This.indexObj.next();
        This.loadMusic(nowIndex);
        This.proObj.init(This.musicList[nowIndex].duration);
        This.proObj.start(); //重新计算这个时间
      }, false)

      //播放和暂停按键的事件监听
      playOrPause.addEventListener('touchend', function () {
        if (audio.playStatus === true) {
          //如果是播放状态，那么就转换成暂停状态
          playOrPause.className = '';
          audio.pause(); //音乐暂停播放
          This.stopRotate(); //背景图片暂停旋转
          This.proObj.stop(); //时间暂停
        } else if (audio.playStatus === false) {
          //如果是暂停状态，那么就切换到播放状态
          playOrPause.className = 'start';
          audio.play();
          var deg = This.singImg.dataset.rotate || 0;
          This.bgImgRotate(deg);
          This.proObj.start();
        }
      }, false);

      //菜单按键事件监听
      munes.addEventListener('touchend', function () {
        This.listControl.up();
      }, false)

      //歌曲菜单的关闭按键的事件监听
      this.close.addEventListener('touchend', function () {
        This.listControl.down();
      }, false)
    },

    //音乐加载事件, 用于一开始加载和切歌的时候，背景图片和歌曲信息和歌曲都要变化
    loadMusic: function (index) {
      Player.Render(this.musicList[index]);
      Player.Audio.loadMusic(this.musicList[index]);
      if (Player.Audio.playStatus) {
        Player.Audio.play();
        this.munesList[2].className = 'start';
        this.bgImgRotate(0);
      }
      this.listControl.changeSing(index);
      this.currentIndex = index; //保存目前的索引
    },

    //列表切歌方法
    listChange: function (data) {
      this.listControl = Player.MunesList(data);

      for (var i = 0; i < this.listControl.length; i++) {
        var that = this;
        (function (j) {
          that.listControl.dds[j].addEventListener('touchend', function () {
            if (that.currentIndex === j) {
              //如果你点击的歌曲是目前的索引
              if (Player.Audio.playStatus) {
                return;
              } else {
                Player.Audio.changeStatus(true); //歌曲成播放状态     
              }
            }
            Player.Audio.changeStatus(true); //歌曲成播放状态
            that.indexObj.nowIndex = j; //目前的歌曲的索引改变
            that.loadMusic(j); //切换歌曲所有信息
            that.listControl.down(); //列表隐藏
            that.proObj.init(that.musicList[j].duration)
            that.proObj.start();
          }, false)
        })(i)
      }
    },

    //进度条方法
    progress: function (duration) {
      this.proObj = new Player.Progress();
      this.proObj.init(duration);
    },

    //背景图片旋转
    bgImgRotate: function (deg) {
      var audio = Player.Audio;
      var This = this;
      if (audio.playStatus) {
        //是播放的状态图片才旋转
        clearInterval(this.timer);
        //开一个定时器来旋转图片
        this.timer = setInterval(function () {
          deg = +deg + 0.2;
          This.singImg.style.transform = 'rotate(' + deg + 'deg)';
          This.singImg.dataset.rotate = deg; //把旋转的角度存到标签身上，为了暂停后继续播放能取到
        }, 1000 / 60);
      }
    },

    //背景图片暂停旋转
    stopRotate: function () {
      clearInterval(this.timer);
    }
  }

  var musicPlayer = new MusicPlayer(div_wrap);

  musicPlayer.init();

})(window.Zepto, window.Player)

//第一个参数是简版的jQuery， 第二个参数是对所有可用的接口写在Player这个属性上