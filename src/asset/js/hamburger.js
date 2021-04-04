// ハンバーガーメニューの実装はこちらに記述してください

  $(function(){
    $(".c-button").click(function() {
      $("body").toggleClass('is-drawerActive');
      $("#header-nav-wrap").slideToggle();

      if ($(".c-button").attr('aria-expanded') == 'false') {
        $(".c-button").attr('aria-expanded', true);
      } else {
          jQuery(".c-button").attr('aria-expanded', false);
      }
    });
});