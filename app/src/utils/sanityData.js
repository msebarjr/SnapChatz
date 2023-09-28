export const userQuery = (userId) => `*[_type == 'user' && _id == '${userId}']`;

export const searchQuery = (searchInput) =>
  `*[_type == 'post' && title match '${searchInput}*' || category match '${searchInput}*' || about match '${searchInput}*'] {
    image {
      asset -> {
        url
      }
    },
    _id,
    destination,
    postedBy -> {
      _id,
      userName,
      image
    },
    like[] {
      _key,
      postedBy -> {
        _id,
        userName,
        image
      },
    },
  }`;

export const feedQuery = `*[_type == 'post'] | order(_createdAt desc) {
  image {
    asset -> {
      url
    }
  },
  _id,
  destination,
  postedBy -> {
    _id,
    userName,
    image
  },
  like[] {
    _key,
    postedBy -> {
      _id,
      userName,
      image
    },
  },
}`;

export const postDetailQuery = (postId) => {
  const query = `*[_type == "post" && _id == '${postId}']{
    image{
      asset->{
        url
      }
    },
    _id,
    title, 
    about,
    category,
    destination,
    postedBy->{
      _id,
      userName,
      image
    },
   like[]{
      postedBy->{
        _id,
        userName,
        image
      },
    },
    comments[]{
      comment,
      _key,
      postedBy->{
        _id,
        userName,
        image
      },
    }
  }`;
  return query;
};

export const postDetailMorePostQuery = (post) => {
  const query = `*[_type == "post" && category == '${post.category}' && _id != '${post._id}' ]{
    image{
      asset->{
        url
      }
    },
    _id,
    destination,
    postedBy->{
      _id,
      userName,
      image
    },
    like[]{
      _key,
      postedBy->{
        _id,
        userName,
        image
      },
    },
  }`;
  return query;
};

export const userCreatedPostsQuery = (userId) => {
  const query = `*[ _type == 'post' && userId == '${userId}'] | order(_createdAt desc){
    image{
      asset->{
        url
      }
    },
    _id,
    destination,
    postedBy->{
      _id,
      userName,
      image
    },
    like[]{
      postedBy->{
        _id,
        userName,
        image
      },
    },
  }`;
  return query;
};

export const userLikedPostsQuery = (userId) => {
  const query = `*[_type == 'post' && '${userId}' in like[].userId ] | order(_createdAt desc) {
    image{
      asset->{
        url
      }
    },
    _id,
    destination,
    postedBy->{
      _id,
      userName,
      image
    },
    like[]{
      postedBy->{
        _id,
        userName,
        image
      },
    },
  }`;
  return query;
};
