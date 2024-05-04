require('dotenv').config();

const express = require("express");
const app = express();
const port = process.env.PORT;
const ConnectDB = require("./DB/connection");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const bodyParser = require('body-parser');
const path = require('path');

const AdminUser = require("./Routes/AdminUserRoutes");
const MedicineRoutes = require("./Routes/MedicineRoutes");
const PatientRoutes = require('./Routes/PatientRoutes');
const SearchRoutes = require('./Routes/SearchRoutes');
const SaleRoutes = require('./Routes/SaleRoutes');

require('./cron-jobs/index');

app.use(cors({
    credentials: true,
    origin:  ['http://localhost:4000',
    'https://663609c52788c4d5631f41f3--transcendent-wisp-4c8789.netlify.app']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json({ limit: '50mb' }));
app.use(cookieParser());

app.use(AdminUser);
app.use(MedicineRoutes);
app.use(PatientRoutes);
app.use(SearchRoutes);
app.use(SaleRoutes);

process.env.pwd = process.cwd();

if (process.env.ENVIRONMENT === 'production') {
    app.use(express.static(path.join(process.env.pwd, 'frontend', 'build')));
    app.use('*', (req, res) => {
        res.sendFile(path.join(process.env.pwd, 'frontend', 'build', 'index.html'));
    });
}

try {
    ConnectDB()
        .then(() => {
            console.log('Connected to database');
            try {
                app.listen(port || 5000, () => {
                    console.log(`server started at port no ${port || 5000}`);
                })
            } catch (err) {
                console.log(err);
            }
        })
        .catch(err => {
            console.log(err);
        });
} catch (err) {
    console.log(err);
}