import express from 'express';
import Form from '../models/form.model';
import ExcelJS from 'exceljs';

const formRouter = express.Router();

/* Get all Forms */
formRouter.get('/', (req, res, next) => {
    Form.find({}, function (err, result) {
        if (err) {
            res.status(400).send({
                'success': false,
                'error': err.message
            });
        } else {
            res.status(200).send({
                'success': true,
                'data': result
            });
        }
    });
});

/* Get Single Form */
formRouter.get("/:form_id", (req, res, next) => {
    Form.findById(req.params.form_id, function (err, result) {
        if (err) {
            res.status(400).send({
                success: false,
                error: err.message
            });
        } else {
            res.status(200).send({
                success: true,
                data: result
            });
        }
    });
});

/* Add Single Form */
formRouter.post("/", (req, res, next) => {
    const { name, phoneNumber, region, individuals, departureDate, returnDate } = req.body;
    let newForm = { name, phoneNumber, region, individuals, departureDate, returnDate };

    Form.create(newForm, function (err, result) {
        if (err) {
            res.status(400).send({
                success: false,
                error: err.message
            });
        } else {
            res.status(201).send({
                success: true,
                data: result,
                message: "Form submitted successfully"
            });
        }
    });
});

/* Edit Single Form */
formRouter.patch("/:form_id", (req, res, next) => {
    let fieldsToUpdate = req.body;
    Form.findByIdAndUpdate(req.params.form_id, { $set: fieldsToUpdate }, { new: true }, function (err, result) {
        if (err) {
            res.status(400).send({
                success: false,
                error: err.message
            });
        } else {
            res.status(200).send({
                success: true,
                data: result,
                message: "Form updated successfully"
            });
        }
    });
});

/* Delete Single Form */
formRouter.delete("/:form_id", (req, res, next) => {
    Form.findByIdAndDelete(req.params.form_id, function (err, result) {
        if (err) {
            res.status(400).send({
                success: false,
                error: err.message
            });
        } else {
            res.status(200).send({
                success: true,
                data: result,
                message: "Form deleted successfully"
            });
        }
    });
});

/* Download all Forms as Excel */
formRouter.get('/download/excel', async (req, res) => {
    try {
        const forms = await Form.find({});

        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Forms');

        // Define the columns for the worksheet
        worksheet.columns = [
            { header: 'Creation Date', key: 'createdAt', width: 20 },
            { header: 'Name', key: 'name', width: 30 },
            { header: 'Phone Number', key: 'phoneNumber', width: 20 },
            { header: 'Region', key: 'region', width: 20 },
            { header: 'Number of Individuals', key: 'individuals', width: 20 },
            { header: 'Departure Date', key: 'departureDate', width: 20 },
            { header: 'Return Date', key: 'returnDate', width: 20 },
        ];

        // Add rows to the worksheet
        forms.forEach(form => {
            worksheet.addRow({
                createdAt: form.createdAt.toISOString().split('T')[0], // Format date as YYYY-MM-DD
                name: form.name,
                phoneNumber: form.phoneNumber,
                region: form.region,
                individuals: form.individuals,
                departureDate: form.departureDate.toISOString().split('T')[0], // Format date as YYYY-MM-DD
                returnDate: form.returnDate.toISOString().split('T')[0], // Format date as YYYY-MM-DD
            });
        });

        // Write to a buffer
        const buffer = await workbook.xlsx.writeBuffer();

        // Set headers to download the file
        res.setHeader('Content-Disposition', 'attachment; filename="forms.xlsx"');
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');

        res.send(buffer);
    } catch (err) {
        res.status(500).send({
            success: false,
            error: err.message
        });
    }
});

/* Download Forms as Excel within a date range */
formRouter.get('/download/excel/:startDate/:endDate', async (req, res) => {
    try {
        const { startDate, endDate } = req.params;

        const forms = await Form.find({
            createdAt: {
                $gte: new Date(startDate),
                $lte: new Date(endDate)
            }
        });

        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Forms');

        // Define the columns for the worksheet
        worksheet.columns = [
            { header: 'Creation Date', key: 'createdAt', width: 20 },
            { header: 'Name', key: 'name', width: 30 },
            { header: 'Phone Number', key: 'phoneNumber', width: 20 },
            { header: 'Region', key: 'region', width: 20 },
            { header: 'Number of Individuals', key: 'individuals', width: 20 },
            { header: 'Departure Date', key: 'departureDate', width: 20 },
            { header: 'Return Date', key: 'returnDate', width: 20 },
            
        ];

        // Add rows to the worksheet
        forms.forEach(form => {
            worksheet.addRow({
                createdAt: form.createdAt.toISOString().split('T')[0],// Format date as YYYY-MM-DD
                name: form.name,
                phoneNumber: form.phoneNumber,
                region: form.region,
                individuals: form.individuals,
                departureDate: form.departureDate.toISOString().split('T')[0], // Format date as YYYY-MM-DD
                returnDate: form.returnDate.toISOString().split('T')[0], // Format date as YYYY-MM-DD
            });
        });

        // Write to a buffer
        const buffer = await workbook.xlsx.writeBuffer();

        // Set headers to download the file
        res.setHeader('Content-Disposition', 'attachment; filename="forms_in_interval.xlsx"');
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');

        res.send(buffer);
    } catch (err) {
        res.status(500).send({
            success: false,
            error: err.message
        });
    }
});

export default formRouter;
