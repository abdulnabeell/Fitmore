const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product"
        },
        name: String,
        price: Number,
        image: String,
        qty: Number
      }
    ],

    shippingAddress: {
      address: String,
      city: String,
      postalCode: String,
      country: String
    },

    total: {
      type: Number,
      required: true
    },

    paymentMethod: {
      type: String,
      default: "COD"
    },

    status: {
      type: String,
      enum: ["PLACED", "CONFIRMED", "SHIPPED", "OUT_FOR_DELIVERY", "DELIVERED", "RETURN_REQUESTED", "RETURNED", "CANCELLED"],
      default: "PLACED"
    },

    isPaid: {
      type: Boolean,
      default: false
    },

    isDelivered: {
      type: Boolean,
      default: false
    },

    returnReason: {
      type: String
    },

    returnNotes: {
      type: String
    }

  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);