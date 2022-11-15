// This constructor can be reused to make anything appear on scroll. 
// Pass in the element to reveal and the threshold Percent (how high up the element you would like it to reveal)


import throttle from 'lodash/throttle'
import debounce from 'lodash/debounce'

class RevealOnScroll {
    constructor(els, thresholdPercent) {
        this.itemsToReveal = els
        this.thresholdPercent = thresholdPercent
        this.browserHeight = window.innerHeight
        this.hideInitially()                          // This is called before other functions run
        this.scrollThrottle = throttle(this.calCaller, 200).bind(this)
        this.events()
    }

    events() {
        window.addEventListener("scroll", this.scrollThrottle)   // Maybe just add throttle(this.calCaller... in here like in StickyHeader.js???
        window.addEventListener("resize", debounce( () => {
            console.log("Resize just ran")
            this.browserHeight = window.innerHeight
        }, 333 ) )
    }

    calCaller() {
        // console.log("scroll function ran");
        this.itemsToReveal.forEach(el => {
            if (el.isRevealed == false) {
                this.calculateIfScrolledTo(el)
            }
        })
    }

    calculateIfScrolledTo(el) {
        // console.log('El calculated')
        if (window.scrollY + this.browserHeight > el.offsetTop) {
            let scrollPercent = ( el.getBoundingClientRect().y / this.browserHeight ) * 100          // How high up the viewport the top of element is... getBoundingClientRect.y gets the disctance from top of element to top of view port. This is zero when at top.
            if (scrollPercent < this.thresholdPercent) {
                el.classList.add("reveal-item--is-visible")
                el.isRevealed = true;
                if (el.isLastItem) {
                    window.removeEventListener("scroll", this.scrollThrottle )
                }
            }
        }
    }

    hideInitially() {
        this.itemsToReveal.forEach(el => {
            el.classList.add("reveal-item")
            el.isRevealed = false;
        })

        this.itemsToReveal[this.itemsToReveal.length - 1].isLastItem = true          // So the event listeners can be turned off once all revealed.
    }
}

export default RevealOnScroll;