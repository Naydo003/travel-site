import '../styles/styles.css'
import 'lazysizes'
import MobileMenu from './modules/MobileMenu'
import RevealOnScroll from './modules/RevealOnScroll'
import StickyHeader from './modules/StickyHeader'

// If constructors are not going to have methods called outside of the class file. No need to save the new instance to a variable.
// If modules need to interact they will trigger events which can be passed around. Need to save to variable.
// See npm event-emitter
new MobileMenu();
new StickyHeader();   // Why it works with no ()????

// This constructor requires params and can be applied for than once.
new RevealOnScroll(document.querySelectorAll(".feature-item"), 75);
new RevealOnScroll(document.querySelectorAll(".testimonial"), 60);


// The Modal class will have methods called in App.js so we need to save to variable. eg. let modal = new Modal()
// The variable was defined initially so we could access it outside of the then function.
let modal

document.querySelectorAll(".open-modal").forEach( el => {
  el.addEventListener("click", e => {                       // e is the click event
    e.preventDefault();                               // the buttons are anchor links and its default behaviour is to follow the link. We dont want this for now.
    if (typeof modal == "undefined") {
      import(/* webpackChunkName: "changes default name in Network" */ './modules/Modal').then( x => {
        modal = new x.default();
        setTimeout(()=> modal.openTheModal(), 20)             // When a new instance of modal is created it will take some time. So wait before trying to open the modal.
      }).catch( ()=> console.log("There was an error"))
    } else {
      modal.openTheModal()
    }
  })
})


// Part of webpack
if (module.hot) {
    module.hot.accept()
  }