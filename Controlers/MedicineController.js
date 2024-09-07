const mongoose = require('mongoose');
const joi = require('joi');
const moment = require('moment');
const Medicine = require("../Models/MedicineModel");

exports.createMedicineController = {
    validation: async (req, res, next) => {
        try {
            const newMedicineSchema = joi.object({
                name: joi.string().required(),
                batches: joi.array().items(
                    joi.object({
                        MRP: joi.number().min(1),
                        costPrice: joi.number().min(1),
                        discount: joi.number().min(1),
                        expDate: joi.string().required()
                            .custom((value, helper) => {
                                const dateParsed = value?.split('-');
                                const year = parseInt(dateParsed?.[0]);
                                const month = parseInt(dateParsed?.[1]);
                                const dateOfMonth = parseInt(dateParsed?.[2]);
                    
                                console.log(dateOfMonth, 'dateOfMonth');
                        
                                if (dateOfMonth >= 1 && dateOfMonth <= 31 
                                && month >= 1 && month <= 12
                                && year >= 2000) {
                                return true;
                                } else {
                                console.log('expDateError')
                                return helper?.message(`expDate is either invalid or not in the format yyyy-mm-dd`);
                                }
                            }), 
                            // .custom((value, helper) => {
                            //     const dateParsed= new Date(Date.parse(value));
                            //     if(dateParsed.toISOString() === value){
                            //         return true;
                            //     } else {
                            //         return helper.message(`expDate must be in UTC format`);
                            //     }
                            // }),
                        stock: joi.number().min(1).required(),
                    })
                ).min(1),
                shelves: joi.array().items(
                    joi.string()
                ),
                category: joi.string(),
            });

            const newBatchSchema = joi.object({
                name: joi.string().required(),
                batches: joi.array().items(
                    joi.object({
                        MRP: joi.number().min(1),
                        costPrice: joi.number().min(1),
                        discount: joi.number().min(1),
                        expDate: joi.string().required()
                            .custom((value, helper) => {
                                const dateParsed = value?.split('-');
                                const year = parseInt(dateParsed?.[0]);
                                const month = parseInt(dateParsed?.[1]);
                                const dateOfMonth = parseInt(dateParsed?.[2]);
                    
                                console.log(dateOfMonth, 'dateOfMonth');
                        
                                if (dateOfMonth >= 1 && dateOfMonth <= 31 
                                && month >= 1 && month <= 12
                                && year >= 2000) {
                                return true;
                                } else {
                                console.log('expDateError')
                                return helper?.message(`expDate is either invalid or not in the format yyyy-mm-dd`);
                                }
                            }), 
                        stock: joi.number().min(1).required(),
                    })
                ).min(1),
                shelves: joi.array().items(
                    joi.string()
                ),
            });

            if (req?.query?.name) {
                await newBatchSchema.validateAsync({
                    name: req?.query?.name,
                    ...req?.body,
                });
            } else {
                await newMedicineSchema.validateAsync({
                    ...req?.body,
                });    

                req.body = {
                    ...req.body,
                    name: req?.body?.name?.toLowerCase?.()
                }
            }

            next();
        } catch (err) {
            console.log(err, 'createMedicineValidationError');
            res?.status(400)?.json({
                errorMessage: err?.message
            })
        }
    },
    handler: async (req, res, next) => {
        try {
    
            let newMedicineBatch;
            let newMedicine;

            console.log(req?.query);

            if (req?.query?.name) {
                newMedicineBatch = await Medicine.findOneAndUpdate(
                    { name: req?.query?.name },
                    {
                        $push: {
                            batches: {
                                $each: req?.body?.batches 
                            }   
                        },
                        $addToSet: {
                            shelves: {
                                $each: req?.body?.shelves
                            }
                        }
                    },
                    { new: true }
                );

                if (newMedicineBatch?._id) {
                    return res.status(200).json({ 
                        payload: newMedicineBatch, 
                        message: 'Medicine batch created successfully.' 
                    });
                } else {
                    throw new Error(`Some error occured in adding the batch(Probably no medicine found)!`);
                }
            } else {
                newMedicine = await Medicine.create({
                    ...req.body
                });

                if (newMedicine?._id) {
                    return res.status(200).json({ 
                        payload: newMedicine, 
                        message: 'Medicine added successfully.' 
                    });
                } else {
                    throw new Error(`Some error occured in adding the medicine!`);
                }
            }            
        } catch (err) {
            console.log(err, 'CreateMedicineControllerError');
            res.status(500).json({
                errorMessage: err?.message
            });
        }
    }
};

exports.getToBeExpiredMedicinesController = {
    validation: async ({
        input,
        next
    }) => {
        try {
            const schema = joi.object({
                runwayDate: joi.string().required()
                    .custom((value, helper) => {
                        const dateParsed= new Date(Date.parse(value));
                        if(dateParsed.toISOString() === value){
                            return true;
                        } else {
                            return helper.message(`runwayDate is not valid or it is not in UTC format`);
                        }
                    }),
            });

            await schema.validateAsync(
                input
            );

            if (next) {
                next();
            } else {
                return {
                    success: true
                };
            }
        } catch (err) {
            return {
                success: false,
                error: err
            };
        }
    },
    handler: async ({
        input,
        next
    }) => {
        try {
            const toBeExpiredMedicinesInDB = await Medicine.aggregate([
                {
                    $match: {
                        $and: [
                            {
                                "batches": {
                                    $type: 'array'
                                }
                            },
                            {
                                $expr: {
                                    $gte: [
                                        { $size: "$batches" },
                                        1
                                    ]
                                }
                            }
                        ]
                    },
                },
                {
                    $project: {
                        "batches": {
                            $filter: {
                                input: "$batches",
                                as: "batch",
                                cond: {
                                    $lte: ["$$batch.expDate", input?.runwayDate]
                                }
                            }
                        },
                        name: 1,
                        category: 1
                    }
                },
                {
                    $match: {
                        $expr: {
                            $gte: [
                                { $size: "$batches" },
                                1
                            ]
                        }
                    }
                }
            ]);

            return {
                success: true,
                payload: {
                    medicines: toBeExpiredMedicinesInDB
                }
            };
        } catch (err) {
            console.log(err, 'toBeExpiredMedicinesInDBError');
            return {
                success: false,
                error: err
            };
        }
    }
};

exports.setExpiryNotificationForMedicinesController = {
    handler: async ({
        input,
        next
    }) => {
        try {
            const schema = joi.object({
                batches: joi.array().items(
                    joi.string().min(12).required()
                )
            });

            await schema.validateAsync(
                input
            );

            const setExpiryNotificationForMedicineBatchesInDB = await Medicine.updateMany(
                {
                    "batches._id": {
                        $in: input?.batches?.map?.(currBatchId => {
                            return new mongoose.Types.ObjectId(currBatchId);
                        })
                    }
                },
                {
                    $set: {
                        "batches.$.isExpiryNotificationSent": true
                    }
                }
            );

            if (setExpiryNotificationForMedicineBatchesInDB?.acknowledged) {
                return {
                    success: true
                }
            } else {
                return {
                    success: false
                }
            }

        } catch (err) {
            return {
                success: false,
                error: err
            };
        }
    },
};

exports.createMedicine = async(req, res) => {
    const { name, category, MRP, costPrice, discount, expDate, stock } = req.body;
    if (!name || !category || typeof costPrice !== 'number' || costPrice <= 0 ||
        typeof discount !== 'number' || discount < 0 || discount > 100 || !expDate ||
        typeof stock !== 'number' || stock <= 0 || typeof MRP !== 'number' || MRP < 0) {
        return res.status(400).json({ message: `please fill all the details` });
    }

    const date = expDate.split('-');
    if(date.length === 3) {
        const expDateObj = {
            date: '', month: '', year: ''
        };

        const dateNow = moment().utc().set('hour', moment().utc().hour() + 5).set('minute', moment().utc().minute() + 30);

        if((date[0] !== '' && date[1] !== '' && date[2] !== '') && (parseInt(date[0]) >= dateNow.year() || 
            parseInt(date[1]) >= dateNow.month() || parseInt(date[2]) >= dateNow.date())) {

            expDateObj.year = parseInt(date[0]);
            expDateObj.month = parseInt(date[1]);
            expDateObj.date = parseInt(date[2]);

            try {
                const medicine = new Medicine({
                    name: name.toLowerCase(),
                    category: category.toLowerCase(),
                    MRP,
                    costPrice,
                    discount,
                    expDate: expDateObj,
                    stock
                });

                const existingMedicine = await Medicine.findOne({ name: name.toLowerCase()});
                if (existingMedicine) {
                    return res.status(401).json({ message: 'medicine already exists' });
                }
    
                const newMedicine = await medicine.save();
                res.status(201).json({ payload: newMedicine, message: 'Medicine saved successfully.' });
        
            } catch (error) {
                res.status(500).json({ message: 'Some error occured. Please try again.' });
            }
        } else {
            res.status(400).json({message: 'Expiry date of the medicine is invalid. Please check again.'});
        }
    } else {
        res.status(400).json({message: 'Date is incorrect. Please check again.'});
    }
    
}

exports.getMedicine = async(req, res) => {
    try {
        const allMedicines = await Medicine.find();
        res.status(200).json({ payload: allMedicines });
    } catch (error) {
        res.status(500).json({ message: 'Some error occured. Please try again.' });
    }
}

exports.getMedicinesByName = async(req, res) => {
    if (req.params.name.trim().toLowerCase() === '' || req.params.name.trim().toLowerCase() === '.') {
        return res.status(200).json({ payload: [] });
    }

    try {
        const medicine = await Medicine.find({ 
            name: { 
                $regex: `${req.params.name.trim().toLowerCase()}`,
                $options: 'i'
            }
        });
        if (medicine.length) {
            res.status(200).json({ payload: medicine });
        } else {
            res.status(404).json({ message: 'Medicine not found.' });
        }
    } catch (err) {
        res.status(500).json({ message: 'Some error occured. Please try again.' });
    }
}

exports.getMedicinesWithGivenStocks = async(req, res) => {
    try {
        const medicines = await Medicine.find({ stock: { $lte: req.params.stock } });
        res.status(200).json({ payload: medicines });
    } catch (err) {
        res.status(500).json({ message: 'Some error occured. Please try again.' })
    }
}

exports.getSingleMedicine = async(req, res) => {
    try {
        const medicine = await Medicine.findById(req.params.id);
        if (!medicine) {
            return res.status(400).send("this medicine does not exist");
        }
        res.status(200).send(medicine)
    } catch (error) {
        res.status(500).send(error)
    }
}

exports.updateMedicine = async(req, res) => {
    try {
        const {body} = req;
        const reqdMedicine = await Medicine.findById(req.params.id);
        if(body.name && typeof body.name === 'string' && body.name !== '') 
            reqdMedicine.name = body.name;
        if(body.category && typeof body.category === 'string' && body.category !== '') {
            reqdMedicine.category = body.category;
        }
        if(body.expDate && typeof body.expDate === 'string' && body.expDate !== '') {
            const dateSplittedArray = body.expDate.split('-');
            if(dateSplittedArray.length === 3) {
                const year = parseInt(dateSplittedArray[0]);
                const month = parseInt(dateSplittedArray[1]);
                const date = parseInt(dateSplittedArray[2]);
                if(year >= 2021 && month <= 12 && 
                    (date <= 31 && date >= 1)) {
                    
                    reqdMedicine.expDate = {
                        date, month, year
                    };
                } else return res.status(400).json({message: 'Date format is invalid. Please check again.'});
            }
        }
        if(body.stock && typeof body.stock === 'number' && body.stock > 0) {
            reqdMedicine.stock = body.stock;
        }
        if(body.costPrice && typeof body.costPrice === 'number' && body.costPrice > 0) {
            reqdMedicine.costPrice = body.costPrice;
        }
        if(body.MRP && typeof body.MRP === 'number' && body.MRP > 0) {
            reqdMedicine.MRP = body.MRP;
        }  
        
        const updatedMedicine = await reqdMedicine.save();
        if(updatedMedicine && updatedMedicine._id)
            res.status(201).json({payload: updatedMedicine, message: 'Medicine updated successfully.'});
    } catch (error) {
        res.status(500).json({message: 'Some error occured. Please try again.'});
    }
}

exports.deleteMedicine = async(req, res) => {
    try {
        await Medicine.findByIdAndDelete(req.params.id);
        res.status(200).json({ payload: req.params.id, message: "Medicine deleted successfully." });
    } catch (error) {
        res.status(500).json({ message: 'Some error occured. Please try again.' });
    }
}