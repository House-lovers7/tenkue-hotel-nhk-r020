// 画像スライダーの実装はこちらに記述してください
document.addEventListener('DOMContentLoaded', function() {
  //インスタス化
  const hero = new HeroSlider();
});

class HeroSlider {
  constructor() {
    this.swiper = new Swiper('.swiper-container', {
      loop: true,
      effect: 'fade',
      speed: 2000,
      //○秒後にスライド
      autoplay: {
        delay: 4000,
        disableOnInteraction: false
      },
    });
  }
}