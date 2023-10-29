const dummy = () => {
    return 1;
};

const totalLikes = (list) => {
    const reducer = (sum, item) => {
        return sum + item.likes;
    };

    return list.length === 0
        ? 0
        : list.reduce(reducer, 0);
};

const favoriteBlog = (list) => {
    if (list.length === 0) return "Empty list";

    let mostLikedBlog = list[0];

    for (let i = 1; i < list.length; i++) {
        if (list[i].likes > mostLikedBlog.likes) {
            mostLikedBlog = list[i];
        }
    }

    return {
        title: mostLikedBlog.title,
        author: mostLikedBlog.author,
        likes: mostLikedBlog.likes,
    }
};


module.exports = {
    dummy,
    totalLikes,
    favoriteBlog
};