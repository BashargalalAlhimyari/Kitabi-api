const mongoose = require('mongoose');
const slugify = require('slugify');

const { Schema } = mongoose;

const CategorySchema = new Schema(
    {
        name: {
            type: String,
            required: [true, 'Category name is required'],
            trim: true,
            maxlength: [100, 'Name too long'],
            unique: true,
        },
        slug: {
            type: String,
            lowercase: true,
            trim: true,
            index: true,
            unique: true,
        },
        description: {
            type: String,
            trim: true,
            maxlength: [1000, 'Description too long'],
        },
        meta: {
            type: Schema.Types.Mixed,
            default: {},
        },
        isActive: {
            type: Boolean,
            default: true,
        },
     
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

// Generate slug from name before validation/save
CategorySchema.pre('validate', function (next) {
    if (this.isModified('name') && this.name) {
        this.slug = slugify(this.name, { lower: true, strict: true });
    }
    next();
});

// Ensure slug uniqueness on conflicts by appending a short id if necessary
CategorySchema.pre('save', async function (next) {
    if (!this.isModified('slug')) return next();

    const Model = this.constructor;
    let slug = this.slug;
    let count = 0;

    // If slug already exists, append a suffix until unique
    while (await Model.exists({ slug, _id: { $ne: this._id } })) {
        count += 1;
        slug = `${this.slug}-${count}`;
    }
    this.slug = slug;
    next();
});

// Simple static helpers
CategorySchema.statics.findBySlug = function (slug) {
    return this.findOne({ slug });
};

CategorySchema.statics.createCategory = function (data) {
    return this.create(data);
};

// Optional virtual: URL or full title
CategorySchema.virtual('url').get(function () {
    return `/categories/${this.slug}`;
});

module.exports = mongoose.models.Category || mongoose.model('Category', CategorySchema);