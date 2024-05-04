const mongoose = require('mongoose');
const SaleSchema = require('../Models/SaleModel');
const Medicine = require('../Models/MedicineModel');
const moment = require('moment');

exports.createSale = async(req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const reqSale = req.body;
        const postSale = { products: [], phone: null };
        const custPhone = parseInt(reqSale?.custPhone) || '';
        console.log('custPhone', typeof custPhone);
        if ((typeof custPhone === 'number' && custPhone > 0) || custPhone === '') {
            postSale.custPhone = custPhone;
            for (let i = 0; i < reqSale.products.length; i++) {
                if (reqSale.products[i].name !== '' && typeof reqSale.products[i].sellingPrice === 'number' &&
                    reqSale.products[i].sellingPrice > 0 && typeof reqSale.products[i].profit === 'number' &&
                    reqSale.products[i].profit >= 0 && typeof reqSale.products[i].qty === 'number' &&
                    reqSale.products[i].qty > 0) {
                    const medicine = await Medicine.find({ 'name': reqSale.products[i].name });

                    if (medicine.length !== 1 && reqSale.products[i].costPrice !== medicine[0].costPrice) {
                        await session.abortTransaction();
                        session.endSession();
                        return res.status(400).json({ message: 'Invalid inputs. Please fill the details correctly.' });
                    } else if(reqSale.products[i].qty > medicine[0].stock) {
                        await session.abortTransaction();
                        session.endSession();
                        return res.status(400).json({message: `Only ${medicine[0].stock} units of ${medicine[0].name} 
                        is/are available. Please adjust the sale.`});
                    } else {
                        const discount = (100 - (reqSale.products[i].sellingPrice * 100) /
                            medicine[0].MRP);

                        if (reqSale.products[i].profit === reqSale.products[i].sellingPrice -
                            medicine[0].costPrice) {
                            postSale.products.push({
                                name: reqSale.products[i].name,
                                costPrice: medicine[0].costPrice,
                                sellingPrice: reqSale.products[i].sellingPrice,
                                discount,
                                profit: reqSale.products[i].profit,
                                qty: reqSale.products[i].qty
                            });

                            medicine[0].stock -= reqSale.products[i].qty;
                            await medicine[0].save({ session });
                        } else {
                            await session.abortTransaction();
                            session.endSession();
                            return res.status(400).json({ message: 'Profit is incorrect. Please check again.' });
                        }

                    }
                } else {
                    await session.abortTransaction();
                    session.endSession();
                    return res.status(400).json({ message: 'Invalid inputs. Please fill the details correctly.' });
                }
            }

            const dateNow = moment().utc();
            dateNow.set('hour', dateNow.hour() + 5);
            dateNow.set('minute', dateNow.minute() + 30);
            postSale.createdAt = {
                date: dateNow.date(),
                month: dateNow.month() + 1,
                year: dateNow.year()
            };
            const newSale = new SaleSchema(postSale);
            const postedSale = await newSale.save({ session });
            await session.commitTransaction();
            session.endSession();

            res.status(200).json({ payload: postedSale, message: 'Sale posted successfully.' });

        } else {
            await session.abortTransaction();
            session.endSession();
            res.status(400).json({ message: 'Please enter the customer phone correctly.' });
        }
    } catch (err) {
        console.log(err);
        await session.abortTransaction();
        session.endSession();
        res.status(500).json({ message: 'Something went wrong. Please try again.' });
    }
}


exports.updateProductInSale = async(req, res) => {

    const {saleID, productID} = req.params;
    const {name, sellingPrice, profit, qty} = req.body;
    let sale;
    let medicine;

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        if(sellingPrice && typeof sellingPrice === 'number' && sellingPrice >= 0 &&
        typeof profit === 'number' && profit >= 0 && qty && typeof qty === 'number' && qty >= 0) {
            sale = await SaleSchema.findById(saleID);
            medicine = await Medicine.find({name});

            if(sale && medicine[0]) {
                for(let i = 0; i < sale.products.length; i++) {
                    if(sale.products[i]._id.equals(productID)) {
                        if(profit === sellingPrice - medicine[0].costPrice) {
                            medicine[0].stock += sale.products[i].qty;
                            medicine[0].stock -= qty;

                            sale.products[i].sellingPrice = sellingPrice;
                            sale.products[i].profit = profit;
                            sale.products[i].qty = qty;
                            sale.products[i].discount = (100 - (sellingPrice * 100) /
                            medicine[0].MRP);

                            const updatedSale = await sale.save({session});
                            const updatedMedicine = await medicine[0].save({session});

                            await session.commitTransaction();
                            session.endSession();

                            return res.status(200).json({payload: {
                                updatedProduct: updatedSale.products.filter(currentProduct => {
                                    return currentProduct._id.equals(productID);
                                })[0], 
                                updatedMedicine, 
                                saleID, productID,
                                message: 'Sale was updated successfully.'
                            }});

                        } else {
                            await session.abortTransaction();
                            session.endSession();
                            return res.status(400).json({message: 'The profit and selling price are incorrect.'});
                        }
                    } else if((i === sale.products.length - 1) && !sale.products[i]._id.equals(productID)) {
                        await session.abortTransaction();
                        session.endSession();
                        return res.status(404).json({message: 'The product to be updated was not found. Please try again.'});
                    }
                }
            } else {
                return res.status(404).json({message: 'Sale or medicine was not found. Please try again.'});
            }
        } else {
            await session.abortTransaction();
            session.endSession();
            return res.status(400).json({message: 'Please fill out all the fields correctly.'});
        }
        
    } catch(err) {
        await session.abortTransaction();
        session.endSession();
        return res.status(500).json({ message: 'Something went wrong. Please try again.' });
    }
}


exports.getSalesForReqdYear = async(req, res) => {
    try {
        if (req.params.year >= 2021) {
            const sales = await SaleSchema.find({ 'createdAt.year': req.params.year });
            res.status(200).json({ payload: sales });
        }
    } catch (err) {
        res.status(500).json({ message: 'Something went wrong. Please try again.' });
    }
}

exports.getSalesForReqdYearAndMonth = async(req, res) => {
    try {
        const { year, month } = req.params;
        const sales = await SaleSchema.find({ 'createdAt.year': year, 'createdAt.month': month });
        res.status(200).json({ payload: sales, yearAndMonth: {year: parseInt(year), month: parseInt(month)} });
    } catch (err) {
        res.status(500).json({ message: 'Something went wrong. Please try again.' });
    }
}

exports.deleteSale = async(req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    let sale;
    let medicine;
    try {
        sale = await SaleSchema.findById(req.params.id);
        if(!sale) {
            await session.abortTransaction();
            session.endSession();
            return res.status(404).json({message: 'No sale found for the given id.'});
        }

        for(let i = 0; i < sale.products.length; i++) {
            medicine = await Medicine.find({name: sale.products[i].name});
            if(!medicine[0]) {
                await session.abortTransaction();
                session.endSession();
                return res.status(404).json({message: 'No medicine found for the sale product.'});
            }

            medicine[0].stock += sale.products[i].qty;
            await medicine[0].save({session});
        }

        await sale.deleteOne({session});
        await session.commitTransaction();
        session.endSession();
        return res.status(200).json({payload: req.params.id, message: 'Sale deleted successfully.'});
    } catch(err) {
        await session.abortTransaction();
        session.endSession();
        return res.status(500).json({ message: 'Something went wrong. Please try again.' });
    }
}