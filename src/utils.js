
const jwt = require('jsonwebtoken')
const APP_SECRET = 'HoW-2-GraphQL'

function getUserId(context) {
  const Authorization = context.request.get('Authorization')

  if (Authorization) {
    const token = Authorization.replace('Bearer ', '')
    const { userId } = jwt.verify(token, APP_SECRET)
    return userId
  }

  throw new Error('Not authenticated')
}

findLink = (links, id, del, sub) => {
  let res = null

  links.forEach((link, index) => {
    if (link.id === id) {
      res = {...link}

      if (del) links.splice(index, 1)

      if (sub) {
        res = {
          id: link.id,
          url: sub.url || link.url,
          description: sub.desc || link.description
        }
        links.splice(index, 1, res)
      }
    }
  })
  return res
}

module.exports = {
  findLink,
  APP_SECRET,
  getUserId
}
