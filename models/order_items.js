const { Schema } = require("mongoose");

const orderItemSchema = new Schema(
  {
    product: {
      type: Schema.Types.ObjectId,
      ref: "product",
      required: true,
    },
    productName: { type: String, required: true },
    productImage: { type: String, required: true },
    productPrice: { type: Number, required: true, min: 0 },
    quantity: { type: Number, default: 1, min: 1 },
    selectedSize: { type: String },
    selectedColor: { type: String },
  },
  { timestamps: true }
);

// Virtual field for subtotal
orderItemSchema.virtual("subtotal").get(function () {
  return this.productPrice * this.quantity;
});

module.exports = orderItemSchema;
