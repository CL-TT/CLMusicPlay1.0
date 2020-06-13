/*
 * @Author: CL
 * @Date: 2020-06-12 22:54:41
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2020-06-13 11:21:31
 * 进度条模块{
 *   1. 歌曲的播放时间和总时间
 *   2. 进度条拖拽能影响歌曲的进度
 * }
 */
(function (Player) {
  function Progress() {
    this.time = 0; //每一首歌的时间
    this.startTime = 0;
    this.startTime_div = document.querySelector(".start-time");
    this.allTime_div = document.querySelector(".all-time");
    this.fontBg = document.querySelector(".fontbg"); //进度条前置背景
    this.backBg = document.querySelector(".backbg");
    this.point_div = document.querySelector(".point");
    this.timer = null;
    this.lastTime = 0; //记录上一次时间
    this.midTime = 0; //歌曲经过的时间
    this.bgLength = this.backBg.offsetWidth - 5;
  }

  Progress.prototype = {
    init: function (time) {
      this.time = time;
      this.renderDom(this.startTime, time);
    },

    //开始
    start: function () {
      var This = this;
      var curTime = new Date().getTime();
      clearInterval(this.timer);
      this.timer = setInterval(function () {
        This.startTime = This.update(curTime);
        var pre = This.getPre(This.startTime); //得到比例
        This.isOverSize(pre);
        This.proMove(pre); //进度条移动
        This.pointMove(pre); //小圆点移动
        This.renderDom(This.startTime, This.time);
      }, 1000);
    },

    //停止
    stop: function () {
      this.midTime += this.lastTime;
      clearInterval(this.timer);
    },

    //更新时间的方法
    update: function (curTime) {
      var endTime = new Date().getTime();
      var lastTime = Math.round((endTime - curTime) / 1000);
      this.lastTime = lastTime; //当暂停的时候，记录下来已经走过的多长时间
      return lastTime + this.midTime;
    },

    //时间格式化方法 200s => 03:30
    timeFormat: function (time) {
      var m = (Math.floor(time / 60) + "").padStart(2, 0); //分钟
      var s = ((time % 60) + "").padStart(2, 0); //秒
      return m + ":" + s;
    },

    //渲染时间dom的方法
    renderDom: function (start, all) {
      var startTime = this.timeFormat(start);
      var allTime = this.timeFormat(all);
      this.startTime_div.innerText = startTime;
      this.allTime_div.innerText = allTime;
    },

    //根据当前时间求出比例
    getPre: function (curTime) {
      //比例 = 当前时间 / 总的时间
      var pre = (curTime / this.time) * 100;
      return pre;
    },

    //进度条移动
    proMove: function (pre) {
      this.fontBg.style.width = pre + "%";
    },

    //判断比例有没有越界
    isOverSize: function (pre) {
      //如果播放完了那么就清除定时器
      if (pre < 0 || pre >= 100) {
        clearInterval(this.timer);
      }
    },

    //小圆点移动
    pointMove: function (pre) {
      pre = pre / 100;
      var dis = this.bgLength * pre;
      this.point_div.style.transform = "translateX(" + dis + "px)";
    },
  };

  Player.Progress = Progress; //把这个构造函数抛出去
})(window.Player || (window.Player = {}));
