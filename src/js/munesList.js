/*
 * @Author: CL
 * @Date: 2020-06-12 11:39:11 
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2020-06-12 16:20:05
 * 上拉歌曲菜单模块{
 *   1. 点击菜单的歌曲可以切歌
 *   2. 正在播放的歌曲高亮显示
 * } 
 */
;
(function (Player) {
  var dl = document.querySelector('.up-munes dl');
  var up_munes = document.querySelector('.up-munes');

  function createList(data) {
    for (var i = 0; i < data.length; i++) {
      var dd = document.createElement('dd');
      dd.className = i === 0 ? 'active' : '';
      dd.innerText = data[i].song;
      dl.appendChild(dd);
    }

    //让列表上去
    function up() {
      up_munes.style.transform = 'translateY(0vh)'
      up_munes.style.opacity = 1;
      up_munes.style.transition = '1s';
    }

    //让列表下去
    function down() {
      up_munes.style.transform = 'translateY(33vh)';
      up_munes.style.opacity = 0
      up_munes.style.transition = '1s';
    }

    var dds = document.querySelectorAll('.up-munes dd');

    //切歌方法, 并改变活跃状态
    function changeSing(index) {
      for (var i = 0; i < dds.length; i++) {
        dds[i].className = '';
      }
      dds[index].className = 'active';
    }

    return {
      up: up,
      down: down,
      changeSing: changeSing,
      dds: dds,
      length: dds.length
    }
  }

  Player.MunesList = createList;
})(window.Player || (window.Player = {}))