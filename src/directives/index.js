import { auth } from './auth'

const directivesList = {
  auth
}

export default {
  install(app) {
    Object.keys(directivesList).forEach((key) => {
      app.directive(key, directivesList[key])
    })
  }
}
