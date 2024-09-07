const bcrypt = require('bcrypt');

const fun = async () => {

    const hash = await bcrypt.hash('password', 10);

    console.log(hash);

    const match = await bcrypt.compare('password', hash);

    console.log(match);
} 

fun();