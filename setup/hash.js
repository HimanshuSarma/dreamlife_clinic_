const bcrypt = require('bcryptjs');

const hashValue = async() => {
    const hashedPassword = await bcrypt.hash('', 10);
    console.log(hashedPassword);
}

hashValue();