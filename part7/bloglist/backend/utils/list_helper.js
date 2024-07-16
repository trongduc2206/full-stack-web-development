const lodash = require('lodash');

const dummy = (blogs) => {
    return 1;
}

const totalLikes = (blogs) => {
    let totalLike = 0;
    blogs.forEach(blog => {
        totalLike += blog.likes
    });
    return totalLike;
}

const favoriteBlog = (blogs) => {
    if(blogs.length === 0) return {};

    let favoriteBlog = {likes: 0};
    blogs.forEach(blog => {
        if(blog.likes > favoriteBlog.likes) {
            favoriteBlog = {
                title: blog.title,
                author: blog.author,
                likes: blog.likes
            };
        }
    });

    return favoriteBlog;
}

const mostBlogs = (blogs) => {
    if(blogs.length === 0) return {}
    const groupedByAuthorObject = lodash.groupBy(blogs, 'author');
    // console.log(groupedByAuthorObject)
    const convertedArray = lodash.map(groupedByAuthorObject, (value, key) => {
        return {
          author: key,
          blogs: value.length
        };
      });
    // console.log(convertedArray);
    return lodash.maxBy(convertedArray, 'blogs');
}

const mostLikes = (blogs) => {
  if(blogs.length === 0) return {}
  const groupedByAuthorObject = lodash.groupBy(blogs, 'author');
  // console.log(groupedByAuthorObject)
  const convertedArray = lodash.map(groupedByAuthorObject, (value, key) => {
    const totalLikesOfAuthor = totalLikes(value);
    return {
      author: key,
      likes: totalLikesOfAuthor
    };
  });
  return lodash.maxBy(convertedArray, 'likes');
}
  
module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}