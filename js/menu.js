
const menuOpenButton = document.querySelector("#btn-open");
const menuCloseButton = document.querySelector("#btn-close");
menuOpenButton.addEventListener("click", () => {
    document.body.classList.toggle("show-mobile-menu");
});


menuCloseButton.addEventListener("click", () => menuOpenButton.click());