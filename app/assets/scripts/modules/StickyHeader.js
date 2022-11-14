import { info } from 'autoprefixer';
import throttle from 'lodash/throttle'
import debounce from 'lodash/debounce'


class StickyHeader {
    constructor() {
        this.siteHeader = document.querySelector(".site-header")
        this.pageSections = document.querySelectorAll(".page-section")
        this.browserHeight = window.innerHeight
        this.previousScrollY = window.scrollY
        this.events();
    }

    events() {
        window.addEventListener("scroll", throttle(() => this.runOnScroll(), 200))
        window.addEventListener("resize", debounce( () => {
            console.log("Resize just ran")
            this.browserHeight = window.innerHeight
        }, 333 ) )
    }

    runOnScroll() {
        console.log("runOnScroollllll")
        this.determineScrollDirection()

        if (window.scrollY > 60) {
            this.siteHeader.classList.add("site-header--dark")
        } else {
            this.siteHeader.classList.remove("site-header--dark")

        }

        this.pageSections.forEach(el => this.calcSection(el))
    }

    determineScrollDirection() {
        console.log("detScroll Direction running")

        if ( window.scrollY > this.previousScrollY ) {
            this.scrollDirection = 'down'
        } else {
            this.scrollDirection = 'up'
        }
        this.previousScrollY = window.scrollY

    }

    calcSection(el) {
        console.log("calcSection running")

        if (window.scrollY + window.innerHeight > el.offsetTop && window.scrollY < el.offsetTop + el.offsetHeight ) {
            let scrollPercent = el.getBoundingClientRect().y / window.innerHeight * 100;
            if (scrollPercent < 18 && scrollPercent > -0.1 && this.scrollDirection == 'down' || scrollPercent < 33 && this.scrollDirection == 'up') {
                let matchingLink = el.getAttribute("data-matching-link")
                console.log("matching link")
                console.log(matchingLink)

                document.querySelectorAll(`.primary-nav a:not(${matchingLink})`).forEach(el => el.classList.remove("is-current-link"))
                document.querySelector(matchingLink).classList.add("is-current-link")
            }
        }
    }
}


export default StickyHeader