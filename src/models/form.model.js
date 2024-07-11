import mongoose from 'mongoose';

const { Schema } = mongoose;

// Define the schema for the form
const formSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: String,
        required: true
    },
    region: {
        type: String,
        required: true
    },
    individuals: {
        type: Number,
        required: true
    },
    departureDate: {
        type: Date,
        required: true
    },
    returnDate: {
        type: Date,
        required: true
    }
}, {
    timestamps: true // This adds createdAt and updatedAt fields
});

// Create the model using the schema
const Form = mongoose.model('Form', formSchema);

export default Form;
