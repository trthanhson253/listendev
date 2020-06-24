const Comment = require('../models/comment');
const Company = require('../models/company');
const { errorHandler } = require('../helpers/dbErrorHandler');

exports.create = (req, res) => {
  const { name, position, point, content, company } = req.body;
  console.log(name);
  Company.findOne({ name: company }).exec((err, companyAdding) => {
    if (err || !companyAdding) {
      return res.status(400).json({
        error: 'Company not found',
      });
    }
    let company = companyAdding._id;
    let commentModel = new Comment({
      name,
      position,
      point,
      content,
      company,
    });
    commentModel.save((err, data) => {
      if (err) {
        console.log(err);
        return res.status(400).json({
          error: errorHandler(err),
        });
      }
      res.json(data);
    });
  });
};

exports.like = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    const newLikes = {
      name: req.body.name,
    };

    comment.likes.unshift(newLikes);

    await comment.save();

    res.json(comment);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

exports.reply = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    const newReply = {
      name: req.body.name,
      content: req.body.content,
    };

    comment.reply.unshift(newReply);

    await comment.save();

    res.json(comment);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

exports.violate = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    const newViolate = {
      content: req.body.content,
    };

    comment.violate.unshift(newViolate);

    await comment.save();

    res.json(comment);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

exports.averageRating = async (req, res) => {
  const slug = req.params.slug.toLowerCase();
  const company = await Company.findOne({ slug });
  var companyId = company._id;
  console.log('companyId' + companyId);
  const comments = await Comment.find({ company: companyId });
  var sum = 0;
  var result = 0;
  for (var i = 0; i < comments.length; i++) {
    sum += comments[i].point;
  }
  if (comments.length > 0) {
    result = sum / comments.length;
  } else {
    result = 0;
  }

  let a = await Company.findOneAndUpdate(
    { slug },
    { $set: { avgRating: result } },
    { new: true }
  );

  res.send({ result });
};

exports.list = (req, res) => {
  Comment.find({})
    .select('_id name point content violate createdAt updatedAt')
    .populate('company', '_id name slug')
    .sort({ createdAt: -1 })
    .limit(10)
    .exec((err, data) => {
      if (err) {
        return res.status(400).json({
          error: 'Comment Not Found',
        });
      }

      res.json(data);
    });
};

exports.removeComment = (req, res) => {
  const idComment = req.params.id;
  console.log('Id la:' + idComment);
  Comment.findOneAndRemove({ idComment }).exec((err, data) => {
    if (err) {
      return res.status(400).json({
        error: 'Tag Not Found',
      });
    }
    res.json({
      message: 'Tag deleted successfully',
    });
  });
};

exports.dislike = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    const newDisLikes = {};

    comment.dislike.unshift(newDisLikes);

    await comment.save();

    res.json(comment);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};
