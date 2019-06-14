
async function feed(root, args, context) {
  const where = args.filter ? {
    OR: [
      { description_contains: args.filter },
      { url_contains: args.filter },
    ],
  } : {}

  const links = await context.prisma.links({
    where
  })
  return links
}

function info(root, args, context, info) {
  return info
}

function link(root, args, context, info) {
  return context.prisma.link({ id: args.id })
}

function user(root, args, context) {
  return context.prisma.user({ id: args.id })
}

module.exports = {
  feed,
  link,
  user,
}
