const express = require('express')
const bodyParser = require('body-parser')
const session = require('express-session')
const FileStore = require('session-file-store')(session)

const secret = 'something unbelievable'
const app = express()

app.use(bodyParser.urlencoded({ extended: false }))
app.use(session({
  secret,
  saveUninitialized: true,
  resave: true,
  store: new FileStore({ secret }),
}))

// Users (hard coded here but consider it comes from database)
const users = [
  { login: 'bertrand', password: 'azerty123' },
  { login: 'martine', password: 'rosedamour' }
]

app.get('/', (req, res) => {
  res.setHeader('Content-Type', 'text/html')
  if (!req.session.user) {
    return res.end(`
      <form method="post" action="/sign-in">
        <label>login: <input name="login"></label>
        <label>password: <input name="password" type="password"></label>
        <input type="submit">
      </form>
    `)
  }
  res.end(`<div>Hi, ${req.session.user.login} <a href="/sign-out">sign out</a></div>`)
})

app.post('/sign-in', (req, res, next) => {
  const user = users.find(u => req.body.login === u.login)

  if (!user) {
    return next(Error('/sign-in: user not found'))
  }

  if (user.password !== req.body.password) {
    return next(Error('/sign-in: wrong password'))
  }

  req.session.user = user
  res.redirect('/')
})

app.get('/sign-out', (req, res, next) => {
  req.session.user = undefined
  res.redirect('/')
})

app.listen(3232, () => console.log('started on port 3232'))
