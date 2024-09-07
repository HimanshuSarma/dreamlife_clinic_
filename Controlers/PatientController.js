const Patient = require("../Models/PatientModel");

exports.createPatient = async(req, res) => {
    const { name, category, complain, visitDate, medPrescribed, phone } = req.body;
    const parsedPhone = parseInt(phone) || '';

    console.log(typeof parsedPhone, 'parsedPhone');

    try {
        if (typeof name === 'string' && name !== '' && typeof category === 'string' && category !== '' &&
            typeof complain === 'string' && complain !== '' && typeof medPrescribed === 'string' && medPrescribed !== '' && 
            typeof visitDate === 'string' && visitDate !== '' && ((typeof parsedPhone === 'number' && parsedPhone > 0) || (typeof parsedPhone === 'string' && 
            parsedPhone === ''))) {
            
            const dateSplittedArray = visitDate.split('-');
            if(dateSplittedArray.length === 3) {
                const year = parseInt(dateSplittedArray[0]);
                const month = parseInt(dateSplittedArray[1]);
                const date = parseInt(dateSplittedArray[2]);

                if(year && month && date && year >= 2021 && month >= 1 && month <= 12 && date >= 1 && date <= 31) {
                    const newPatient = new Patient({
                        name: name.toLowerCase().trim(),
                        category: category.toLowerCase().trim(),
                        complain: complain.toLowerCase().trim(),
                        visitDate: {
                            date, month, year
                        },
                        medPrescribed: medPrescribed.toLowerCase().trim(),
                        phone: parsedPhone ? parsedPhone : null
                    });

                    const newPostedPatient = await newPatient.save();
                    res.status(201).json({payload: newPostedPatient, message: 'Patient posted successfully.'});
                } else {
                    res.status(400).json({message: 'Date is incorrect. Please check and try again.'});
                }
            } else {
                res.status(400).json({message: 'Date is incorrect. Please check and try again.'});
            }
            
        } else {
            return res.status(400).json({message: "Please fill all the fields"});
        }
    } catch (error) {
        console.log(error, 'error')
        return res.status(500).json({message: `Something went wrong. Please try again.`});
    }
}

exports.getPatient = async(req, res) => {
    try {
        const allPatients = await Patient.find();
        res.status(200).json({ payload: allPatients });
    } catch (error) {
        res.status(500).json({ message: `Some error occured. Please try again. ${error}` });
    }
}

exports.getSinglePatient = async(req, res) => {
    try {
        const patient = await Patient.findById(req.params.id);
        if (!patient) {
            return res.status(402).send("Patient Not found");
        }
        res.status(200).send(patient)
    } catch (error) {
        res.status(500).send(error)
    }
}

exports.updatePatient = async(req, res) => {
    try {
        const {body} = req;

        const patient = await Patient.findById(req.params.id);
        
        if(typeof body.name === 'string' && body.name !== '') {
            patient.name = body.name;
        }

        if(typeof body.category === 'string' && body.category !== '') {
            patient.category = body.category;
        }

        if(typeof body.complain === 'string' && body.complain !== '') {
            patient.complain = body.complain;
        }

        if(typeof body.visitDate === 'string' && body.visitDate !== '') {
            const dateSplittedArray = body.visitDate.split('-');
            if(dateSplittedArray.length === 3) {
                const date = parseInt(dateSplittedArray[0]);
                const month = parseInt(dateSplittedArray[1]);
                const year = parseInt(dateSplittedArray[2]);

                if(date && month && year && date >= 1 && date <= 31 && month >= 1 && month <= 12 && year >= 2021) {
                    patient.visitDate = {date, month, year};
                } else return res.status(400).json({message: 'Date is incorrect. Please check and try again.'});
            } else {
                return res.status(400).json({message: 'Date is incorrect. Please check and try again.'});
            }
        }

        if(typeof body.medPrescribed === 'string' && body.medPrescribed !== '') {
            patient.medPrescribed = body.medPrescribed;
        }

        if(typeof body.phone === 'number' && body.phone > 0) {
            patient.phone = body.phone;
        }

        const updatedPatient = await patient.save();
        res.status(200).json({payload: updatedPatient, message: 'Patient updated successfully.'});

    } catch (error) {
        res.status(500).send(error)
    }
}

exports.deletePatient = async(req, res) => {
    try {
        await Patient.findByIdAndDelete(req.params.id);
        res.status(200).json({payload: req.params.id, message: "Patient Deleted Successfully"});
    } catch (error) {
        res.status(500).json({message: 'Something went wrong. Please try again.'})
    }
}