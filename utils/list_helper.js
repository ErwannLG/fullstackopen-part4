const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  return blogs.reduce((sum, item) => sum + item.likes, 0)
}

const favoriteBlog = (blogs) => {
  const filteredBlogs = blogs.map(({ _id, url, __v, ...rest}) => rest)
  return filteredBlogs.reduce((prev, current) => (prev.likes > current.likes) ? prev : current, 'no likes yet')
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
}
