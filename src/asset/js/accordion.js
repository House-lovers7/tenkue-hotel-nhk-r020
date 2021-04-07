// アコーディオンの実装はこちらに記述してください

const menu = document.querySelectorAll(".js-accordion-trigger");

function toggle() {
  const content = this.nextElementSibling;
  this.classList.toggle("is-active");
  content.classList.toggle("is-active");
}

for (let i = 0; i < menu.length; i++) {
  menu[i].addEventListener("click", toggle);
}



