var mobileBreakpoint = 1024;

[].forEach.call(document.querySelectorAll('nav a[href*="#"]'), function(el) {
  el.addEventListener('click', function(e) {
    e.preventDefault();
    var targetSection = el.getAttribute('href').substring(1);
    document.querySelector('[data-section="' + targetSection + '"]').scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
  });
});

[].forEach.call(document.querySelectorAll('.party-member:not(.filler)'), function(el) {
  el.addEventListener('click', function(e) {
    var popup = document.getElementById('member-popup');
    if (popup) {
      popup.parentElement.removeChild(popup);
    }
    popup = document.createElement('div');
    document.body.classList.add('popup-active');
    popup.setAttribute('id', 'member-popup');
    popup.classList.add('member-popup');
    var popupImageSource = el.getElementsByClassName('cropped')[0].src;
    if (el.getElementsByClassName('full').length > 0) {
      popupImageSource = el.getElementsByClassName('full')[0].dataset.src;
    }
    popup.innerHTML = '<div class="popup-inner"><div class="popup-inner-wrap"><div id="popup-close" class="popup-close">&times;</div><div class="party-member-inner"><img src="' + popupImageSource + '"><div class="popup-content">' + el.getElementsByClassName('party-member-inner')[0].innerHTML + '</div></div></div></div>';
    document.getElementsByTagName('body')[0].appendChild(popup);
    document.getElementById('popup-close').addEventListener('click', function(e) {
      document.body.classList.remove('popup-active');
    });
    document.getElementById('member-popup').addEventListener('click', function(e) {
      document.body.classList.remove('popup-active');
    });
  });
});

var headerEl = document.querySelector('header');
var headerNavEl = document.querySelector('.header-wrap nav');

var scrollOffset = 0;
if (window.outerWidth >= mobileBreakpoint) {
	scrollOffset = document.querySelector('.header-wrap nav');
}

var scroll = new SmoothScroll('a[href*="#"]', {
	speed: 400
});

// ScrollOut({
// 	targets: 'header',
// 	onShown: function(element, ctx, scrollingElement) {
// 		if (window.outerWidth >= mobileBreakpoint) {
// 			headerEl.style.height = null;
// 		}
// 	},
// 	onHidden: function(element, ctx, scrollingElement) {
// 		if (window.outerWidth >= mobileBreakpoint) {
// 			headerEl.style.height = headerNavEl.offsetHeight + 'px';
// 		}
// 	}
// });
