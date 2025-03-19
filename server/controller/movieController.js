const Movie = require("../model/movieModel");

const addMovie = async (req, res) => {
  try {
    const newMovie = new Movie(req.body);
    await newMovie.save();
    res.send({
      success: true,
      message: "New movie has been added",
    });
  } catch (error) {
    return res.send(500).json({ success: false, message: error.message });
  }
};

const getAllMovies = async (req, res) => {
  try {
    const allMovie = await Movie.find();
    console.log(allMovie);

    res.send({
      success: true,
      message: "All movies have been fetched",
      data: allMovie,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const updateMovie = async (req, res) => {
  try {
    await Movie.findByIdAndUpdate(req.body.movieId, req.body);
    res.send({
      success: true,
      message: "Movie has been updated",
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const deleteMovie = async (req, res) => {
  try {
    await Movie.findByIdAndDelete(req.body.movieId);
    res.send({
      success: true,
      message: "Movie has been deleted",
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const getMovieById = async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    res.send({ success: true, message: "movie fetch successful", data: movie });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: err.message });
  }
};
module.exports = {
  addMovie,
  getAllMovies,
  updateMovie,
  deleteMovie,
  getMovieById,
};
