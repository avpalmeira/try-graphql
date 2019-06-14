
async function feed(root, args, context) {
  const where = args.filter ? {
    OR: [
      { description_contains: args.filter },
      { url_contains: args.filter },
    ],
  } : {}

  const links = await context.prisma.links({
    where,
    skip: args.skip,
    first: args.first,
    orderBy: args.orderBy,
  })

  const count = await context.prisma
    .linksConnection({
      where
    })
    .aggregate()
    .count()

  return {
    links,
    count,
  }
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
