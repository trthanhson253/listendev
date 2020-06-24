const Request = require('../models/request');
const { errorHandler } = require('../helpers/dbErrorHandler');

exports.create = (req, res) => {
  const { name, email, reason, content } = req.body;
  console.log(name);
  let requestModel = new Request({
    name,
    email,
    reason,
    content,
  });
  requestModel.save((err, data) => {
    if (err) {
      console.log(err);
      return res.status(400).json({
        error: errorHandler(err),
      });
    }
    res.json(data);
  });
};

exports.list = (req, res) => {
  Request.find({})
    .sort({ createdAt: '-1' })
    .exec((err, data) => {
      if (err) {
        return res.status(400).json({
          error: errorHandler(err),
        });
      }
      res.json(data);
    });
};

exports.remove = (req, res) => {
  const idRequest = req.params.idRequest;
  Request.findOneAndRemove(idRequest).exec((err, data) => {
    if (err) {
      return res.status(400).json({
        error: 'Request Not Found',
      });
    }
    res.json({
      message: 'Request deleted successfully',
    });
  });
};

exports.toggle = (req, res) => {
  const idRequest = req.params.idRequest;
  const status1 = req.params.status1;

  var flag;
  if (status1 == 0) {
    flag = 1;
  } else {
    flag = 0;
  }

  Request.findByIdAndUpdate(idRequest, { status: flag }).exec((err, data) => {
    if (err) {
      return res.status(400).json({
        error: 'Not Found',
      });
    }
    res.json(data);
  });
};

exports.newestRequestCount = (req, res) => {
  Request.find({ status: 0 }).exec((err, data) => {
    if (err) {
      return res.status(400).json({
        error: errorHandler(err),
      });
    }
    res.json(data);
  });
};
