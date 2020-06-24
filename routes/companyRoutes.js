const express = require('express');
const router = express.Router();
const {
  create,
  list,
  read,
  listSearch,
  photo,
  listBySearch,
  remove,
  listSingleCompany,
  editSingleCompany,
  listStatus,
  view,
  paginationCompany,
  love,
} = require('../controllers/companyController');
const { runValidation } = require('../validators');
const { companyCreateValidator } = require('../validators/companyValidator');

router.get('/company', list);
router.get('/companies/:slug', read);
router.get('/companies/view/:slug', view);
router.get('/company/search', listSearch);
// http://localhost:8000/api/company/search?search=kms

router.get('/company/photo/:slug', photo);
router.post('/company/by/search', listBySearch);
router.get('/company/love/:slug', love);
// ADMIN
router.post('/admin/company/create', create);
router.delete('/admin/company/delete/:slug', remove);
router.get('/admin/company/:slug', listSingleCompany);
router.put('/admin/company/:slug', editSingleCompany);
router.get('/admin/company/status/:status', listStatus);

router.get('/admin/companies', paginationCompany);

module.exports = router;
