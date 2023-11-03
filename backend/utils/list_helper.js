const _ = require('lodash')

const dummy = () => {
    return 1;
};

const totalLikes = (blogsList) => {
    const reducer = (sum, item) => {
        return sum + item.likes;
    };

    return blogsList.length === 0
        ? 0
        : blogsList.reduce(reducer, 0);
};

const favoriteBlog = (blogsList) => {
    if (blogsList.length === 0) return "Empty blogsList";

    let mostLikedBlog = blogsList[0];

    for (let i = 1; i < blogsList.length; i++) {
        if (blogsList[i].likes > mostLikedBlog.likes) {
            mostLikedBlog = blogsList[i];
        }
    }

    return {
        title: mostLikedBlog.title,
        author: mostLikedBlog.author,
        likes: mostLikedBlog.likes,
    }
};

const mostBlogs = (blogsList) => {

    const blogsCount = _.countBy(blogsList, 'author')
    const maxBlogsCount = _.max(_.values(blogsCount));
    const mostBlogsAuthors = _.reduce(blogsCount, (result, count, author) => {
        if (count === maxBlogsCount) {
            result.push(author);
        }
        return result;
    }, []);

    const theChosenOne = {
        author: _.sample(mostBlogsAuthors),
        blogs: maxBlogsCount
    }

    return theChosenOne;
}

const mostLikes = (blogsList) => {
    const authorLikesCount = _.chain(blogsList)
        .groupBy('author')
        .map((blogsArray, author) => ({
            author,
            likes: _.sumBy(blogsArray, 'likes'),
        }))
        .value();

    const mostLikesAuthor = _.maxBy(authorLikesCount, 'likes');

    return mostLikesAuthor;
};

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes
};