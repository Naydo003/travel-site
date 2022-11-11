import '../styles/styles.css'
import MobileMenu from './modules/MobileMenu'

let mobMenu = new MobileMenu();

if (module.hot) {
    module.hot.accept()
  }