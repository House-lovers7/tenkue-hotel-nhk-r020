// ハンバーガーメニューの実装はこちらに記述してください

  $(function(){
    $(".c-button").click(function() {
      $("body").toggleClass('is-drawerActive');
      $('.l-global_nav, .js-nav-cover').toggleClass('is-hidden');    
      
      
      if ($(".c-button").attr('aria-expanded') == 'false') {
        $(".c-button").attr('aria-expanded', true);       
      } else {                        
          $(".c-button").attr('aria-expanded', false);          
      }
    });
});