/*
 * @Author: CL
 * @Date: 2020-06-11 17:58:58 
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2020-06-12 11:24:09
 * 
 * 音乐播放接口{
 *   1. 音乐的播放
 *   2. 音乐的暂停
 * }
 */
;
(function (Player) {
  function AudioPlay() {
    this.playStatus = false;
    this.audio = new Audio();
  }

  AudioPlay.prototype = {
    //加载音乐
    loadMusic: function (data) {
      this.audio.src = data.audio;
      this.audio.load();
    },

    //播放音乐的方法
    play: function () {
      this.audio.play();
      this.playStatus = true;
    },

    //暂停播放的方法
    pause: function () {
      this.audio.pause();
      this.playStatus = false;
    },

    changeStatus: function (status) {
      this.playStatus = status;
    }
  }

  Player.Audio = new AudioPlay(); //把实例对象抛出去

})(window.Player || (window.Player))