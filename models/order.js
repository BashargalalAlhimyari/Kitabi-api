const mongoose = require('mongoose');
const { Schema } = mongoose;

// Order Schema
const OrderSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    items: [
      {
        product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
        quantity: { type: Number, required: true, min: 1 },
        price: { type: Number, required: true }, // price per unit
      },
    ],
    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'failed', 'refunded'],
      default: 'pending',
    },
    orderStatus: {
      type: String,
      enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
      default: 'pending',
    },
    shippingAddress: {
      fullName: { type: String, required: true },
      addressLine1: { type: String, required: true },
      addressLine2: { type: String },
      city: { type: String, required: true },
      state: { type: String },
      postalCode: { type: String },
    },
    meta: {
      type: Schema.Types.Mixed, // أي بيانات إضافية
      default: {},
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true, // createdAt & updatedAt
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// 🔹 Virtual: order summary
OrderSchema.virtual('summary').get(function () {
  return {
    totalItems: this.items.reduce((sum, item) => sum + item.quantity, 0),
    totalAmount: this.totalAmount,
    status: this.orderStatus,
    payment: this.paymentStatus,
  };
});

// 🔹 Statics: find by user
OrderSchema.statics.findByUser = function (userId) {
  return this.find({ user: userId }).sort({ createdAt: -1 });
};

// 🔹 Statics: create order
OrderSchema.statics.createOrder = function (data) {
  return this.create(data);
};

module.exports = mongoose.models.Order || mongoose.model('Order', OrderSchema);
