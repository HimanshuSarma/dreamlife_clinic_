const mongoose = require("mongoose");

const { sendEmail } = require('../Controlers/EmailController');

const medicineSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    category: {
        type: String,
        // required: true
    },
    
    // expDate: { type: mongoose.Schema.Types.String, required: true },
    // stock: {
    //     type: Number,
    //     required: true
    // },
    batches: [
        {
            stock: { type: mongoose.Schema.Types.Number, required: true },
            expDate: { type: mongoose.Schema.Types.String, required: true },
            MRP: { type: mongoose.Schema.Types.Number },
            costPrice: { type: mongoose.Schema.Types.Number },
            discount: { type: mongoose.Schema.Types.Number },
            isExpiryNotificationSent: { type: mongoose.Schema.Types.Boolean }
        }
    ],
    shelves: [
        {
            type: mongoose.Schema.Types.String
        }
    ]
})

const Medicine = mongoose.model("Medicine", medicineSchema);
Medicine.watch().on('change', change => {
    const medicineChangeHandler = async() => {
        if (change && change.updateDescription && change.updateDescription.updatedFields &&
            change.updateDescription.updatedFields.stock) {
            const fetchedMedicine = await Medicine.findById(change.documentKey._id);
            if(fetchedMedicine.stock <= 100) {
                sendEmail(undefined, undefined, 
                `Stock is low for the medicine ${fetchedMedicine.name}. Only ${fetchedMedicine.stock} units are remaining.`);
            }
        }
    }
    
    medicineChangeHandler();
});

module.exports = Medicine;

