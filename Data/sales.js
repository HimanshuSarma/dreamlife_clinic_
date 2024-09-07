const sales = [{
    products: [{
        name: 'Dabur',
        costPrice: 1000,
        sellingPrice: 1010,
        discount: '',
        profit: '',
        qty: 4,
    }],

    custPhone: null,
    createdAt: '2022-06-27T17:27:03.826+00:00'
}, {
    products: [{
        name: 'Juice',
        costPrice: 1100,
        sellingPrice: 1150,
        discount: '',
        profit: '',
        qty: 4,
    }],

    custPhone: null,
    createdAt: '2022-05-27T17:27:03.826+00:00'
}, {
    products: [{
        name: 'Honey',
        costPrice: 700,
        sellingPrice: 800,
        discount: '',
        profit: '',
        qty: 4,
    }],

    custPhone: null,
    createdAt: '2022-04-27T17:27:03.826+00:00'
}, {
    products: [{
        name: 'Eno',
        costPrice: 50,
        sellingPrice: 55,
        discount: '',
        profit: '',
        qty: 100,
    }],

    custPhone: null,
    createdAt: '2022-03-27T17:27:03.826+00:00'
}, {
    products: [{
        name: 'Ras',
        costPrice: 150,
        sellingPrice: 165,
        discount: '',
        profit: '',
        qty: 20,
    }],

    custPhone: null,
    createdAt: '2022-02-27T17:27:03.826+00:00'
}, {
    products: [{
        name: 'Gas Problem',
        costPrice: 250,
        sellingPrice: 260,
        discount: '',
        profit: '',
        qty: 10,
    }],

    custPhone: null,
    createdAt: '2022-01-27T17:27:03.826+00:00'
}, {
    products: [{
        name: 'abcd',
        costPrice: 500,
        sellingPrice: 575,
        discount: '',
        profit: '',
        qty: 5,
    }],

    custPhone: null,
    createdAt: '2022-08-27T17:27:03.826+00:00'
}, {
    products: [{
        name: 'df',
        costPrice: 270,
        sellingPrice: 275,
        discount: '',
        profit: '',
        qty: 25,
    }],

    custPhone: null,
    createdAt: '2022-09-27T17:27:03.826+00:00'
}, {
    products: [{
        name: 'gh',
        costPrice: 50,
        sellingPrice: 55,
        discount: '',
        profit: '',
        qty: 60,
    }],

    custPhone: null,
    createdAt: '2022-10-27T17:27:03.826+00:00'
}, {
    products: [{
        name: 'ij',
        costPrice: 70,
        sellingPrice: 85,
        discount: '',
        profit: '',
        qty: 25,
    }],

    custPhone: null,
    createdAt: '2022-11-27T17:27:03.826+00:00'
}, {
    products: [{
        name: 'kl',
        costPrice: 50,
        sellingPrice: 65,
        discount: '',
        profit: '',
        qty: 30,
    }],

    custPhone: null,
    createdAt: '2022-12-27T17:27:03.826+00:00'
}, {
    products: [{
        name: 'mn',
        costPrice: 78,
        sellingPrice: 90,
        discount: '',
        profit: '',
        qty: 20,
    }],

    custPhone: null,
    createdAt: '2022-12-27T17:27:03.826+00:00'
}];

const days = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

for (let i = 0; i < sales.length; i++) {
    for (let j = 0; j < sales[i].products.length; j++) {
        sales[i].products[j].profit = sales[i].products[j].sellingPrice - sales[i].products[j].costPrice;
        sales[i].products[j].discount = (100 - (sales[i].products[j].sellingPrice * 100) /
            (sales[i].products[j].sellingPrice + 30));
        sales[i].createdAt = {
            year: 2022,
            month: i + 1,
            date: Math.floor(Math.random() * days[i]) + 1
        }
    }
}

module.exports = sales;