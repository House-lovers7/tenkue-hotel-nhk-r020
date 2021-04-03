// ハンバーガーメニューの実装はこちらに記述してください


$(function(){
    $('.btn-trigger').on('click', function() {
      $(this).toggleClass('active');
      return false;
    });
  });

  
  // ページ遷移のJS

  $(window).load(function() {
    setTimeout(function(){
      window.location.href = '/';
    }, 3000);
  });


  // ページ遷移のJS


  // ページを開くとき


  $(function () {
    $('.btn-trigger').on('click', function () {
      $(this).toggleClass('active');
      $("#js-buttonHamburger").toggleClass('active');
    })
  }) $(function () {
    $('#global_nav a').on('click', function () {
      $('#global_nav').toggleClass('active');
      $("#js-buttonHamburger").toggleClass('active');
    })
  });


  // ページを閉じる時