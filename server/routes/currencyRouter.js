const Router = require('express');
const router = new Router();
const CurrencyController = require('../controllers/CurrencyController');

router.post('/', CurrencyController.create); 
router.get('/', CurrencyController.getAll);  
router.get('/:id', CurrencyController.getOne); 
router.put('/:id', CurrencyController.update); 
router.delete('/:id', CurrencyController.delete); 
router.get('/:id/exists', CurrencyController.checkExistence); 

module.exports = router;