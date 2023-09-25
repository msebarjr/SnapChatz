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
