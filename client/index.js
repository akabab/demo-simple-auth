const authContainer = document.getElementById('auth')
const signInForm = document.getElementById('sign-in-form')
const signOutForm = document.getElementById('sign-out-form')

handleAuth = user => {
  authContainer.innerHTML = user.login ? `Hi ${user.login}` : 'Not connected, please login'

  signInForm.style.display = user.login ? 'none' : 'block'
  signOutForm.style.display = user.login ? 'block' : 'none'
}

signInForm.addEventListener('submit', e => {
  e.preventDefault()

  const formData = new FormData(e.target)

  const credentials = {
    login: formData.get('login'),
    password: formData.get('password')
  }

  fetch('http://localhost:3232/sign-in', {
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
    },
    'credentials': 'include', // Always send user credentials (cookies, basic http auth, etc..), even for cross-origin calls.
    body: JSON.stringify(credentials)
  })
  .then(res => res.json())
  .then(user => handleAuth(user))
})

signOutForm.addEventListener('submit', e => {
  e.preventDefault()

  fetch('http://localhost:3232/sign-out', { 'credentials': 'include' })
    .then(res => res.json())
    .then(user => handleAuth(user))
})


fetch('http://localhost:3232/', { 'credentials': 'include' })
  .then(res => res.json())
  .then(user => handleAuth(user))

