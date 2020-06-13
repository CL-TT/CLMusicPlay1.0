/*
 * @Author: CL
 * @Date: 2020-06-12 10:59:26 
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2020-06-12 11:11:06
 * 索引模块{
 *   1. 把握全局的索引
 * } 
 */
;
(function (Player) {
  function CurrentIndex(data) {
    this.nowIndex = 0;
    this.dataLength = data.length;
  }

  CurrentIndex.prototype = {
    prev: function () {
      return this.getLength(-1);
    },

    next: function () {
      return this.getLength(1);
    },

    getLength: function (value) {
      this.nowIndex = (this.nowIndex + value + this.dataLength) % this.dataLength;
      return this.nowIndex;
    }
  }

  Player.CurrentIndex = CurrentIndex;
})(window.Player || (window.Player = {}))