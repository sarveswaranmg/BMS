const router = require("express").Router();
const stripe = require("stripe")(process.env.STRIPE_KEY);
const authMiddleware = require("../middlewares/authMiddlewares");
const Booking = require("../model/bookingModel");
const Show = require("../model/showModel");
const EmailHelper = require("../utils/emailHelper");
router.post("/make-payment", authMiddleware, async (req, res) => {
  try {
    console.log("mp called");
    const { token, amount } = req.body;
    const customer = await stripe.customers.create({
      email: token.email,
      source: token.id,
    });
    console.log(customer);
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      currency: "usd",
      customer: customer.id,
      payment_method_types: ["card"],
      receipt_email: token.email,
      description: "Movie Ticket Booking",
      confirm: true,
    });
    console.log(paymentIntent);

    const transactionId = paymentIntent.id;
    res.send({
      success: true,
      message: "Payment Successful",
      data: transactionId,
    });
  } catch (error) {
    console.log("error occured in routes");
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post("/book-show", authMiddleware, async (req, res) => {
  try {
    const newBooking = new Booking(req.body);
    await newBooking.save();
    const show = await Show.findById(req.body.show).populate("movie");
    const updatedBookedSeats = [...show.bookedSeats, ...req.body.seats];
    await Show.findByIdAndUpdate(req.body.show, {
      bookedSeats: updatedBookedSeats,
    });
    // adding more details to the booking
    const populatedBooking = await Booking.findById(newBooking._id)
      .populate("user")
      .populate("show")
      .populate({
        path: "show",
        populate: {
          path: "movie",
          model: "movies",
        },
      })
      .populate({
        path: "show",
        populate: {
          path: "theatre",
          model: "theatres",
        },
      });
    console.log("this is populated Booking", populatedBooking);
    // console.log(populatedBooking.user.email);
    await EmailHelper("ticketTemplate.html", populatedBooking.user.email, {
      name: populatedBooking.user.name,
      movie: populatedBooking.show.movie.title,
      theatre: populatedBooking.show.theatre.name,
      date: populatedBooking.show.date,
      time: populatedBooking.show.time,
      seats: populatedBooking.seats,
      amount: populatedBooking.seats.length * populatedBooking.show.ticketPrice,
      transactionId: populatedBooking.transactionId,
    });
    res.send({
      success: true,
      message: "New Booking done!",
      data: populatedBooking,
    });
  } catch (err) {
    console.log(err);
    res.send({
      success: false,
      message: "Failed to book show",
    });
  }
});

router.get("/get-all-bookings/:userId", authMiddleware, async (req, res) => {
  try {
    console.log("fetching tickets");
    const data = await Booking.find({ user: req.params.id });
    console.log(data);
    const bookings = await Booking.find({ user: req.params.userId })
      .populate("user")
      .populate("show")
      .populate({
        path: "show",
        populate: {
          path: "movie",
          model: "movies",
        },
      })
      .populate({
        path: "show",
        populate: {
          path: "theatre",
          model: "theatres",
        },
      });
    res.send({
      success: true,
      message: "All bookings fetched",
      data: bookings,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
