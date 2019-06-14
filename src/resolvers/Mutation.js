
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const { APP_SECRET, getUserId } = require('../utils')

async function post(parent, args, context) {
  const userId = getUserId(context)
  return await context.prisma.createLink({
    url: args.url,
    description: args.description,
    postedBy: { connect: { id: userId } }
  })
}

async function updateLink(parent, args, context) {
  return await context.prisma.updateLink({
    data: {
      url: args.url,
      description: args.description
    },
    where: {
      id: args.id
    }
  })
}

async function deleteLink(parent, args, context) {
  return await context.prisma.deleteLink({ id: args.id })
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

async function vote(parent, args, context) {
   const userId = getUserId(context)

   const linkExists = await context.prisma.$exists.vote({
     user: { id: userId },
     link: { id: args.linkId },
   })
   if (linkExists) {
     throw new Error(`Already voted for link: ${args.linkId}`)
   }

   return context.prisma.createVote({
     user: { connect: { id: userId } },
     link: { connect: { id: args.linkId } },
   })
}

module.exports = {
  signup,
  login,
  deleteLink,
  updateLink,
  post,
  vote,
}
