// モーダルの実装はこちらに記述してください

$(function () {
  // モーダルのボタンをクリックした時
  $('.js-modal-opener').on('click', function() {
    // thisでクラスを指定
    var i = $('.js-modal-opener').index(this); 
    //.eqでindex番号の指定
    $('.js-modal-element').eq(i).fadeIn(200);
    //スクロールできないように
    $('html,body').css('overflow', 'hidden');
  });

  //黒い背景色・クローズボタンをクリックした時
  $('.js-modal-closer, .js-modal-cover').on('click', function() {
    //removeAttr()で属性削除
    $('html,body').removeAttr('style');
    $('.js-modal-element').fadeOut(300);
  });
});