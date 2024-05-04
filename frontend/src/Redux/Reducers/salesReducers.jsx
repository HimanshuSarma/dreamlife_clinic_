export const salesFormReducer = (currentSalesFormState = [], action) => {
    if(action.type === 'ADD_SALE') {
        const newSalesForm = currentSalesFormState;
        for(let i = 0; i < action.amount; i++) {
            newSalesForm.push({
                products: [{
                    name: '',
                    MRP: '',
                    costPrice: '',
                    sellingPrice: '',
                    profit: '',
                    qty: '',
                    isFocused: false,
                    debouncingTimerID: '',
                    searchedProducts: []
                }],
                
                custPhone: '',
            });
        } 

        return newSalesForm;

    } else if(action.type === 'UPDATE_SALE') {
        return currentSalesFormState.map((formItem, i) => {
            if(i === action.payload.index) {
                return {...formItem, [action.payload.property]: action.payload.value};
            } else return formItem;
        })
    } else if(action.type === 'DELETE_SALE') {
        return currentSalesFormState.filter((formItem, i) => action.payload !== i);
    } else if(action.type === 'ADD_PRODUCT') {
        const newProducts = currentSalesFormState[action.payload.currentSaleIndex].products;
        for(let i = 0; i < action.payload.val; i++) {
            newProducts.push({
                name: '',
                MRP: '',
                costPrice: '',
                sellingPrice: '',
                profit: '',
                qty: '',
                isFocused: false,
                debouncingTimerID: '',
                searchedProducts: []
            })
        }

        return currentSalesFormState.map((currentSaleObj, index) => {
            if(index === action.payload.currentSaleIndex) {
                return {...currentSaleObj, products: newProducts};
            } else return currentSaleObj;
        });
    } else if(action.type === 'DELETE_PRODUCT') {
        if(currentSalesFormState[action.payload.currentSaleIndex].products.length === 1) {
            return currentSalesFormState.filter((currentSaleObj, currentSaleIndex) => {
                return currentSaleIndex !== action.payload.currentSaleIndex;
            })
        }

        return currentSalesFormState.map((currentSaleObj, currentSaleIndex) => {
            if(currentSaleIndex === action.payload.currentSaleIndex) {
                return {...currentSaleObj, products: currentSaleObj.products.filter((currentProductObj, currentProductIndex) => {
                    return currentProductIndex !== action.payload.currentProductIndex;
                })}
            } else return currentSaleObj;
        })
    } else if(action.type === 'UPDATE_SALES_PRODUCT') {
        return currentSalesFormState.map((currentSaleObj, currentSaleIndex) => {
            if(currentSaleIndex === action.payload.currentSaleIndex) {
                return {...currentSaleObj, 
                products: currentSaleObj.products.map((currentProductObj, currentProductIndex) => {
                    if(currentProductIndex === action.payload.currentProductIndex) {
                        return {...currentProductObj, [action.payload.property]: action.payload.value, 
                            isFocused: true};
                    } else return currentProductObj;
                })}
            } else return {...currentSaleObj, 
                products: currentSaleObj.products.map((currentProductObj) => {
                    return {...currentProductObj, isFocused: false};
                })
            };
        })
    } else if(action.type === 'UPDATE_SALES_PRODUCT_PROFIT_SELLING_PRICE') {
        return currentSalesFormState.map((currentSaleObj, currentSaleIndex) => {
            if(currentSaleIndex === action.payload.currentSaleIndex) {
                return {...currentSaleObj,
                products: currentSaleObj.products.map((currentProductObj, currentProductIndex) => {
                    if(currentProductIndex === action.payload.currentProductIndex) {
                        if(action.payload.property === 'profit') {
                            return {...currentProductObj, 
                                profit: action.payload.value,
                                sellingPrice: typeof action.payload.value === "number" ? currentProductObj.costPrice ?
                                    (currentProductObj.costPrice + action.payload.value) : '' : currentProductObj.costPrice,
                                isFocused: true
                            }
                        } else if(action.payload.property === 'sellingPrice') {
                            return {...currentProductObj, 
                                profit: typeof action.payload.value === "number" ? currentProductObj.costPrice ?
                                (action.payload.value - currentProductObj.costPrice) : '' : 0,
                                sellingPrice: action.payload.value,
                                isFocused: true
                            }
                        } else return {};
                    } else return {...currentProductObj, isFocused: false};
                })}
            } else return {...currentSaleObj, 
                products: currentSaleObj.products.map(currentProductObj => {
                    return {...currentProductObj, isFocused: false};
                })};
        })
    } else if(action.type === 'UPDATE_SALES_PRODUCT_DEBOUNCING_ID') {
        return currentSalesFormState.map((currentSaleObj, currentSaleIndex) => {
            if(currentSaleIndex === action.payload.currentSaleIndex) {
                return {...currentSaleObj,
                products: currentSaleObj.products.map((currentProductObj, currentProductIndex) => {
                    if(currentProductIndex === action.payload.currentProductIndex) {
                        return {...currentProductObj, debouncingTimerID: action.payload.debouncingTimerID}
                    } else return currentProductObj;
                })
                }
            } else return currentSaleObj;
        })
    } else if(action.type === 'UPDATE_SALES_SEARCHED_PRODUCTS_LOADED') {
        return currentSalesFormState.map((currentSaleObj, currentSaleIndex) => {
            if(currentSaleIndex === action.payload.currentSaleIndex) {
                return {...currentSaleObj, 
                products: currentSaleObj.products.map((currentProductObj, currentProductIndex) => {
                    if(currentProductIndex === action.payload.currentProductIndex) {
                        return {...currentProductObj, isFocused: true, 
                            searchedProducts: action.payload.searchedProducts};
                    } else return {...currentProductObj, isFocused: false};
                })}
            } else return {...currentSaleObj, 
                products: currentSaleObj.products.map((currentProductObj) => {
                    return {...currentProductObj, isFocused: false};
                })
            };
        });
    } else if(action.type === 'UPDATE_SALES_SELECTED_PRODUCT') {
        return currentSalesFormState.map((currentSaleObj, currentSaleIndex) => {
            if(currentSaleIndex === action.payload.currentSaleIndex) {
                return {...currentSaleObj, 
                products: currentSaleObj.products.map((currentProductObj, currentProductIndex) => {
                    if(currentProductIndex === action.payload.currentProductIndex) {
                        return {
                            ...currentProductObj,
                            name: currentProductObj.searchedProducts[action.payload.searchedProductIndex].name,
                            MRP: currentProductObj.searchedProducts[action.payload.searchedProductIndex].MRP,
                            costPrice: currentProductObj.searchedProducts[action.payload.searchedProductIndex].costPrice,
                            sellingPrice: currentProductObj.searchedProducts[action.payload.searchedProductIndex].defaultSellingPrice, 
                            profit: (currentProductObj.searchedProducts[action.payload.searchedProductIndex].defaultSellingPrice - 
                                currentProductObj.searchedProducts[action.payload.searchedProductIndex].costPrice),
                            qty: '',
                            isFocused: true
                        }
                    } else return {...currentProductObj, isFocused: false};
                })}
            } else return {...currentSaleObj, 
                products: currentSaleObj.products.map(currentProductObj => {
                    return {...currentProductObj, isFocused: false};
                })};
        })
    } else if(action.type === 'USER_LOGGED_IN' || action.type === 'USER_LOGGED_OUT' || 
        action.type === 'DELETE_SALES_FORM') {
        return [];
    }

    return currentSalesFormState;
}


export const salesOfGivenYearAndMonthReducer = (currentSalesOfGivenYearAndMonth = {
        salesOfGivenYearAndMonth: null,
        yearAndMonth: null,
        isSalesOfGivenYearAndMonthLoading: false
    }, action) => {
    
    if(action.type === 'FETCH_SALES_OF_GIVEN_YEAR_AND_MONTH_LOADING') {
        return {...currentSalesOfGivenYearAndMonth, isSalesOfGivenYearAndMonthLoading: true};
    } else if(action.type === 'FETCH_SALES_OF_GIVEN_YEAR_AND_MONTH_LOADED') {
        return {salesOfGivenYearAndMonth: action.payload.data, yearAndMonth: action.payload.yearAndMonth,
            isSalesOfGivenYearAndMonthLoading: false};
    } else if(action.type === 'FETCH_SALES_OF_GIVEN_YEAR_AND_MONTH_LOAD_FAILED') {
        return {...currentSalesOfGivenYearAndMonth, isSalesOfGivenYearAndMonthLoading: false};
    } else if(action.type === 'SALE_PRODUCT_STATE_TO_UPDATE') {
        return {...currentSalesOfGivenYearAndMonth, salesOfGivenYearAndMonth: 
        currentSalesOfGivenYearAndMonth.salesOfGivenYearAndMonth.map((currentSale, currentSaleIndex) => {
            if(currentSaleIndex === action.payload.saleIndex) {
                return {...currentSale, products: currentSale.products.map((currentProduct, currentProductIndex) => {
                    if(currentProductIndex === action.payload.productIndex) {
                        return {
                            ...currentProduct, 
                            isEditing: true, 
                            editForm: {
                                sellingPrice: currentProduct.sellingPrice,
                                profit: currentProduct.profit,
                                qty: currentProduct.qty
                            }
                        }
                    } else return currentProduct;
                })}
            } else return currentSale;
        })}
    } else if(action.type === 'SALE_PRODUCT_STATE_TO_CANCEL_UPDATE') {
        return {...currentSalesOfGivenYearAndMonth, 
            salesOfGivenYearAndMonth: 
            currentSalesOfGivenYearAndMonth.salesOfGivenYearAndMonth.map((currentSale, currentSaleIndex) => {
                if(currentSaleIndex === action.payload.saleIndex) {
                    return {...currentSale, products: currentSale.products.map((currentProduct, currentProductIndex) => {
                        if(currentProductIndex === action.payload.productIndex) {
                            return {...currentProduct, 
                            isEditing: false,
                            editForm: null};
                        } else return currentProduct;
                    })}
                } else return currentSale;
            })}
    } else if(action.type === 'UPDATE_SALE_PRODUCT_EDIT_FORM') {
        return {...currentSalesOfGivenYearAndMonth, 
        salesOfGivenYearAndMonth: currentSalesOfGivenYearAndMonth.salesOfGivenYearAndMonth.map((currentSale, currentSaleIndex) => {
            if(currentSaleIndex === action.payload.saleIndex) {
                return {...currentSale, products: currentSale.products.map((currentProduct, currentProductIndex) => {
                    if(currentProductIndex === action.payload.productIndex) {
                        return {...currentProduct, editForm: {
                            ...currentProduct.editForm,
                            [action.payload.property]: action.payload.val
                        }};
                    } else return currentProduct;
                })}
            } else return currentSale;
        })}
    } else if(action.type === 'UPDATE_SALE_PRODUCT_PROFIT_SELLING_PRICE_EDIT_FORM') {
        return {...currentSalesOfGivenYearAndMonth,
        salesOfGivenYearAndMonth: currentSalesOfGivenYearAndMonth.salesOfGivenYearAndMonth.map((currentSale, currentSaleIndex) => {
            if(currentSaleIndex === action.payload.saleIndex) {
                return {...currentSale, products: currentSale.products.map((currentProduct, currentProductIndex) => {
                    if(currentProductIndex === action.payload.productIndex) {
                        return {...currentProduct, 
                        editForm: {
                            ...currentProduct.editForm,
                            sellingPrice: action.payload.property === 'sellingPrice' ? action.payload.val : 
                            (currentProduct.costPrice + action.payload.val),
                            profit: action.payload.property === 'profit' ? action.payload.val : 
                            (action.payload.val - currentProduct.costPrice)
                        }}
                    } else return currentProduct;
                })}
            } else return currentSale;
        })}
    } else if(action.type === 'POST_EDITED_SALE_PRODUCT_LOADING') {
        return {...currentSalesOfGivenYearAndMonth, isSalesOfGivenYearAndMonthLoading: true};
    } else if(action.type === 'POST_EDITED_SALE_PRODUCT_LOADED') {
        return {...currentSalesOfGivenYearAndMonth, 
        salesOfGivenYearAndMonth: currentSalesOfGivenYearAndMonth.salesOfGivenYearAndMonth.map(currentSale => {
            if(currentSale._id === action.payload.saleID) {
                return {...currentSale, 
                products: currentSale.products.map(currentProduct => {
                    if(currentProduct._id === action.payload.productID) {
                        return {...action.payload.updatedProduct,
                            isEditing: false,
                            editForm: null
                        }
                    } else return currentProduct;
                })};
            } else return currentSale;
        })}
    } else if(action.type === 'POST_SALE_LOADING') {
        return {...currentSalesOfGivenYearAndMonth, isSalesOfGivenYearAndMonthLoading: true};
    } else if(action.type === 'POST_SALE_LOADED') {
        return {...currentSalesOfGivenYearAndMonth, salesOfGivenYearAndMonth: 
            [...currentSalesOfGivenYearAndMonth.salesOfGivenYearAndMonth, action.payload], 
            isSalesOfGivenYearAndMonthLoading: false};
    } else if(action.type === 'POST_SALE_LOAD_FAILED') {
        return {...currentSalesOfGivenYearAndMonth, isSalesOfGivenYearAndMonthLoading: false};
    } else if(action.type === 'DELETE_SALE_LOADING') {
        return {...currentSalesOfGivenYearAndMonth, isSalesOfGivenYearAndMonthLoading: true};
    } else if(action.type === 'DELETE_SALE_LOADED') {
        return {...currentSalesOfGivenYearAndMonth, 
            salesOfGivenYearAndMonth: currentSalesOfGivenYearAndMonth.salesOfGivenYearAndMonth.filter(currentSale => {
            return currentSale._id !== action.payload;
        }), isSalesOfGivenYearAndMonthLoading: false};
    } else if(action.type === 'DELETE_SALE_FAILED') {
        return {...currentSalesOfGivenYearAndMonth, isSalesOfGivenYearAndMonthLoading: false};
    } else if(action.type === 'USER_LOGGED_IN' || action.type === 'USER_LOGGED_OUT') {
        return {
            salesOfGivenYearAndMonth: null,
            yearAndMonth: null,
            isSalesOfGivenYearAndMonthLoading: false
        };
    }
 
    return currentSalesOfGivenYearAndMonth;
}