const Company = require('../models/company');
const Comment = require('../models/comment');
const formidable = require('formidable');
const slugify = require('slugify');
const { errorHandler } = require('../helpers/dbErrorHandler');
const fs = require('fs');
const _ = require('lodash');

exports.create = (req, res) => {
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;
  form.parse(req, (err, fields, files) => {
    if (err) {
      return res.status(400).json({
        error: 'Image could not upload',
      });
    }

    const { name, type, city, state, status } = fields;

    if (!name) {
      return res.status(400).json({
        error: 'Name is required',
      });
    }

    let company = new Company();
    company.name = name;
    company.type = type;
    company.city = city;
    company.state = state;
    company.status = status;
    company.view = 0;
    company.slug = slugify(name).toLowerCase();

    if (files.photo) {
      if (files.photo.size > 10000000) {
        return res.status(400).json({
          error: 'Image should be less then 1mb in size',
        });
      }
      company.photo.data = fs.readFileSync(files.photo.path);
      company.photo.contentType = files.photo.type;
    }

    company.save((err, result) => {
      if (err) {
        return res.status(400).json({
          error: errorHandler(err),
        });
      }
      res.json(result);
    });
  });
};

exports.list = (req, res) => {
  Company.find({})
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

exports.read = (req, res) => {
  const slug = req.params.slug.toLowerCase();
  console.log(slug);
  Company.findOne({ slug }).exec((err, company) => {
    if (err) {
      return res.status(400).json({
        error: 'Not Found',
      });
    }
    // res.json(category);
    Comment.find({ company: company })
      .populate('company', '_id name slug')
      .sort({ createdAt: -1 })
      .select(
        '_id name position point content likes dislike reply love violate createdAt updatedAt'
      )
      .exec((err, data) => {
        if (err) {
          return res.status(400).json({
            error: 'Comment Not Found',
          });
        }
        res.json({ company: company, comment: data });
      });
  });
};

exports.view = (req, res) => {
  const slug = req.params.slug.toLowerCase();
  if (slug) {
    Company.findOneAndUpdate(
      { slug },
      {
        $inc: {
          view: 1,
        },
      }
    ).exec((err, company) => {
      if (err) {
        return res.status(400).json({
          error: 'Not Found',
        });
      }
      res.json(company.view);
    });
  }
};

// exports.searchCompany = (req, res) => {
//   const { keyword } = req.body;
//   if (keyword.trim() != '') {
//     Company.find({ name: { $regex: keyword, $options: 'i' } })
//       .limit(10)
//       .exec((err, data) => {
//         if (err) {
//           return res.status(400).json({
//             error: errorHandler(err),
//           });
//         }
//         res.json(data);
//       });
//   }
// };

exports.listSearch = (req, res) => {
  const { search } = req.query;
  console.log(search);
  if (search) {
    Company.find({ name: { $regex: search, $options: 'i' }, status: 1 })
      .limit(10)
      .exec((err, data) => {
        if (err) {
          return res.status(400).json({
            error: 'Not Found',
          });
        }
        res.json(data);
      });
  }
};

exports.photo = (req, res) => {
  const slug = req.params.slug.toLowerCase();
  Company.findOne({ slug })
    .select('photo')
    .exec((err, company) => {
      if (err || !company) {
        return res.status(400).json({
          error: 'Company not found',
        });
      }
      res.set('Content-Type', company.photo.contentType);
      return res.send(company.photo.data);
    });
};

exports.listBySearch = (req, res) => {
  let limit = req.body.limit ? parseInt(req.body.limit) : 3;
  let skip = parseInt(req.body.skip);
  let sortBy = req.body.sortBy ? req.body.sortBy : 'createdAt';
  let order = req.body.order ? req.body.order : 'desc';
  // let filterByState = req.body.filterByState;
  // let state = filterByState
  //   ? { state: filterByState, status: 1 }
  //   : { status: 1 };

  let findArgs = {};
  for (let key in req.body.filters) {
    if (req.body.filters[key].length > 0) {
      findArgs[key] = req.body.filters[key];
    }
  }
  let state = findArgs ? findArgs : { status: 1 };
  console.log('filters', req.body.filters);
  console.log('STATE', state);
  console.log('sortBy', sortBy);
  console.log('order', order);
  Company.find(state)
    .select('-photo')
    .sort([[sortBy, order]])
    // .sort({ sortBy: order })
    .skip(skip)
    .limit(limit)
    .exec((err, data) => {
      if (err) {
        return res.status(400).json({
          error: 'Products not found',
        });
      }
      res.json({
        size: data.length,
        data,
      });
    });
};

exports.remove = (req, res) => {
  const slug = req.params.slug.toLowerCase();
  Company.findOneAndUpdate({ slug }, { status: 0 }).exec((err, data) => {
    if (err) {
      return res.status(400).json({
        error: 'Company Not Found',
      });
    }
    res.json({
      message: 'Company deleted successfully',
    });
  });
};

exports.listSingleCompany = (req, res) => {
  const slug = req.params.slug.toLowerCase();
  console.log('Slug' + slug);
  Company.findOne({ slug })
    .select('_id photo name city state status')
    .exec((err, data) => {
      if (err) {
        return res.status(400).json({
          error: 'Not Found',
        });
      }
      res.json(data);
    });
};

exports.editSingleCompany = (req, res) => {
  const slug = req.params.slug.toLowerCase();

  Company.findOne({ slug }).exec((err, oldCompany) => {
    if (err) {
      return res.status(400).json({
        error: 'Not Found Company',
      });
    }

    let form = new formidable.IncomingForm();
    form.keepExtensions = true;

    form.parse(req, (err, fields, files) => {
      if (err) {
        return res.status(400).json({
          error: 'Image could not upload',
        });
      }

      let slugBeforeMerge = oldCompany.slug;
      oldCompany = _.merge(oldCompany, fields);
      oldCompany.slug = slugBeforeMerge;

      if (files.photo) {
        if (files.photo.size > 10000000) {
          return res.status(400).json({
            error: 'Image should be less then 1mb in size',
          });
        }
        oldCompany.photo.data = fs.readFileSync(files.photo.path);
        oldCompany.photo.contentType = files.photo.type;
      }

      oldCompany.save((err, result) => {
        if (err) {
          return res.status(400).json({
            error: 'cannot save',
          });
        }
        // result.photo = undefined;
        res.json(result);
      });
    });
  });
};

exports.listStatus = (req, res) => {
  let statusChange = '';
  const status1 = req.params.status;
  if (status1 == 0) {
    statusChange = { status: 0 };
  } else if (status1 == 1) {
    statusChange = { status: 1 };
  } else {
    statusChange = {};
  }

  Company.find(statusChange)
    .sort({ createdAt: '-1' })
    .exec((err, data) => {
      if (err) {
        return res.status(400).json({
          error: 'Not Found Company',
        });
      }
      res.json(data);
    });
};

exports.paginationCompany = async (req, res) => {
  // get current page from req.query or use default value of 1
  const currentPage = req.query.page || 1;
  // return 3 posts per page
  const perPage = 6;
  let totalItems;
  let numberOfPages;

  const company = await Company.find()
    // countDocuments() gives you total count of posts
    .countDocuments()
    .then((count) => {
      totalItems = count;
      numberOfPages = Math.ceil(totalItems / perPage);
      return Company.find()
        .skip((currentPage - 1) * perPage)
        .sort({ createdAt: -1 })
        .limit(perPage)
        .select('-photo');
    })
    .then((company) => {
      res.status(200).json({ company, numberOfPages });
    })
    .catch((err) => console.log(err));
};

exports.love = (req, res) => {
  const slug = req.params.slug.toLowerCase();
  if (slug) {
    Company.findOneAndUpdate(
      { slug },
      {
        $inc: {
          love: 1,
        },
      }
    ).exec((err, company) => {
      if (err) {
        return res.status(400).json({
          error: 'Not Found',
        });
      }
      res.json(company);
    });
  }
};
