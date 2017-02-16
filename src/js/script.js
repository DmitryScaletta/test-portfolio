const activeLinkClass = 'nav__link_active'
const menuLinks       = document.querySelectorAll('#menu a')



function removeActiveClass() {
	const currents = document.querySelectorAll('#menu a.' + activeLinkClass)
	for (let i = 0; i < currents.length; ++i) {
		currents[i].classList.remove(activeLinkClass)
	}
}

for (let i = 0; i < menuLinks.length; ++i) {
	menuLinks[i].onclick = () => {
		removeActiveClass()
		menuLinks[i].classList.add(activeLinkClass)
	}
}

window.onscroll = () => {
	const scrollPosition = window.pageYOffset || document.documentElement.scrollTop;
	
	for (let i = 0; i < menuLinks.length; ++i) {
		const hash = menuLinks[i].getAttribute('href').substr(1)
		const elem = document.getElementById(hash)

		if (elem.offsetTop <= scrollPosition && elem.offsetTop + elem.offsetHeight > scrollPosition) {
			menuLinks[i].classList.add(activeLinkClass)
		} else {
			menuLinks[i].classList.remove(activeLinkClass)
		}
	}
}
