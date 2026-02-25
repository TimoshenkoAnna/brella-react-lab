const Router = require('express');
const router = new Router();
const currencyRouter = require('./currencyRouter');
const rateRouter = require('./rateRouter');
const transactionRouter = require('./transactionRouter');

router.use('/currency', currencyRouter); 
router.use('/rate', rateRouter);         
router.use('/transaction', transactionRouter); 

module.exports = router;