const dummy = (blogs) => {
    return 1
  }
  
  const totalLikes = (blogs) => {
    return blogs.reduce((sum, blog) => sum + blog.likes, 0)
  }
  
  const favoriteBlog = (blogs) => {
    if (blogs.length === 0) return null
    return blogs.reduce((favorite, blog) => {
      return favorite.likes > blog.likes ? favorite : blog
    }, blogs[0])
  }
  
  const mostBlogs = (blogs) => {
    if (blogs.length === 0) return null
    const authors = blogs.reduce((acc, blog) => {
      acc[blog.author] = (acc[blog.author] || 0) + 1
      return acc
    }, {})
    const [author, count] = Object.entries(authors).reduce((max, entry) => entry[1] > max[1] ? entry : max)
    return { author, blogs: count }
  }
  
  module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs
  }