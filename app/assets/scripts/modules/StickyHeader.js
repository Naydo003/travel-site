import { info } from 'autoprefixer';
import throttle from 'lodash/throttle'        // Allows a function to be run every so often as opposed to everytime its called.
import debounce from 'lodash/debounce'        // Allows a function to be called at the end of an action such as dragging screen resize


class StickyHeader {
    constructor() {
        this.siteHeader = document.querySelector(".site-header")
        this.pageSections = document.querySelectorAll(".page-section")
        this.browserHeight = window.innerHeight
        this.previousScrollY = window.scrollY
        this.events();
    }

    events() {
        window.addEventListener("scroll", throttle(() => this.runOnScroll(), 200))       // The runOnScroll is limited to being called every 200milliseconds.
        window.addEventListener("resize", debounce( () => {                              // The browserHeight will be recalculated once a resize is finished (thanks to debounce).
            console.log("Resize just ran")
            this.browserHeight = window.innerHeight
        }, 333 ) )
    }

    // This will run every time the scroll event happens. In a single human scroll there may be thousands of scroll events so it needs to be throttled.
    runOnScroll() {
        // console.log("runOnScroollllll")
        this.determineScrollDirection()

        if (window.scrollY > 60) {
            this.siteHeader.classList.add("site-header--dark")
        } else {
            this.siteHeader.classList.remove("site-header--dark")
        }

        this.pageSections.forEach(el => this.calcSection(el))      // This passes each page-section to calcSection function
    }

    determineScrollDirection() {
        // console.log("detScroll Direction running")

        if ( window.scrollY > this.previousScrollY ) {
            this.scrollDirection = 'down'
        } else {
            this.scrollDirection = 'up'
        }
        this.previousScrollY = window.scrollY
    }

    calcSection(el) {
        // console.log("calcSection running")

        if (window.scrollY + window.innerHeight > el.offsetTop && window.scrollY < el.offsetTop + el.offsetHeight ) {
            let scrollPercent = el.getBoundingClientRect().y / window.innerHeight * 100;
            if (scrollPercent < 18 && scrollPercent > -0.1 && this.scrollDirection == 'down' || scrollPercent < 33 && this.scrollDirection == 'up') {
                let matchingLink = el.getAttribute("data-matching-link")
                document.querySelectorAll(`.primary-nav a:not(${matchingLink})`).forEach(el => el.classList.remove("is-current-link"))
                document.querySelector(matchingLink).classList.add("is-current-link")
            }
        }
    }
}


export default StickyHeader