
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const { APP_SECRET, getUserId, findLink } = require('../utils')

function post(parent, args, context) {
  const userId = getUserId(context)
  return context.prisma.createLink({
    url: args.url,
    description: args.description,
    postedBy: { connect: { id: userId } }
  })
}

function updateLink(parent, args) {
  return utils.findLink(links, args.id, false, {
    url: args.url,
    desc: args.description
  })
}

function deleteLink(parent, args) {
  return utils.findLink(links, args.id, true)
}

async function signup(parent, args, context) {
  const password = await bcrypt.hash(args.password, 10)

  const user = await context.prisma.createUser({ ...args, password })

  const token = jwt.sign({ user: user.id }, APP_SECRET)

  return {
    token,
    user
  }
}

async function login(parent, args, context) {
  const user = await context.prisma.user({ email: args.email })

  if(!user) {
    throw new Error('No such user found')
  }

  const valid = await bcrypt.compare(args.password, user.password)

  if(!valid) {
    throw new Error('Invalid password')
  }

  const token = jwt.sign({ userId: user.id }, APP_SECRET)

  return {
    token,
    user
  }
}

module.exports = {
  signup,
  login,
  post,
}
