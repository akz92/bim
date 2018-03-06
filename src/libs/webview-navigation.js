var scrollsize = 60

function goToPageBottom () { window.scrollBy(0, document.body.scrollHeight) }
function goToPageTop () { window.scrollBy(0, -document.body.scrollHeight) }
function scrollUpHalfPage () { window.scrollBy(0, window.innerHeight / -2) }
function scrollDownHalfPage () { window.scrollBy(0, window.innerHeight / 2) }
function scrollUp () { window.scrollBy(0, -scrollSize) }
function scrollDown () { window.scrollBy(0, scrollSize) }
function scrollLeft () { window.scrollBy(-scrollSize, 0) }
function scrollRight () { window.scrollBy(scrollSize, 0) }

global.pageScroll = {
  goToPageBottom,
  goToPageTop,
  scrollUpHalfPage,
  scrollDownHalfPage,
  scrollUp,
  scrollDown,
  scrollLeft,
  scrollRight
}
