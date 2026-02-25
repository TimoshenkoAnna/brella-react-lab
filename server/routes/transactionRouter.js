const Router = require('express');
const router = new Router();
const TransactionController = require('../controllers/TransactionController');

router.post('/', TransactionController.create);
router.get('/', TransactionController.getAll);
router.get('/:id', TransactionController.getOne);
router.put('/:id', TransactionController.update);
router.delete('/:id', TransactionController.delete);

module.exports = router;