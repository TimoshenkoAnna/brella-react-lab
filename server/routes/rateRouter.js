const Router = require('express');
const router = new Router();
const RateController = require('../controllers/RateController');

router.post('/', RateController.create);
router.get('/', RateController.getAll);
router.get('/:id', RateController.getOne);
router.put('/:id', RateController.update);
router.delete('/:id', RateController.delete);

module.exports = router;