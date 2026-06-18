export const upload = {
  fields: () => (req, res, next) => {
    if (req.headers["x-test-no-image"] === "true") {
      return next();
    }

    req.files = {
      image: [
        {
          path: "https://res.cloudinary.com/test/image/upload/poster.jpg",
          url: "https://res.cloudinary.com/test/image/upload/poster.jpg",
        },
      ],
    };

    if (req.headers["x-test-with-video"] === "true") {
      req.files.video = [
        {
          path: "https://res.cloudinary.com/test/video/upload/movie.mp4",
          url: "https://res.cloudinary.com/test/video/upload/movie.mp4",
        },
      ];
    }

    next();
  },
};
