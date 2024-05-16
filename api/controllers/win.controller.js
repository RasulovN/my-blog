import Win from '../models/win.model.js';
import { errorHandler } from '../utils/error.js';

export const procreate = async (req, res, next) => {
  if (!req.user.isAdmin) {
    return next(errorHandler(403, 'You are not allowed to create a win'));
  }
  if (!req.body.title && !req.body.content) {
    return next(errorHandler(400, 'Please provide all required fields'));
  }
  
  const slug = req.body.title
    .split(' ')
    .join('-')
    .toLowerCase()
    .replace(/[^a-zA-Z0-9-]/g, '');
    // .replace(/[^a-zA-Z0-9-]/g, '-')

  const newWin = new Win({
    ...req.body,
    slug,
    userId: req.user.id,
  });
  try {
    const savedWin = await newWin.save();
    res.status(201).json(savedWin);
  } catch (error) {
    next(error);
  }
};

export const getwins = async (req, res, next) => {
  try {
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 9;
    const sortDirection = req.query.order === 'asc' ? 1 : -1;
    const wins = await Win.find({
      ...(req.query.userId && { userId: req.query.userId }),
      ...(req.query.winurl && { winurl: req.query.winurl }),
      ...(req.query.image && { image: req.query.image }),
      ...(req.query.slug && { slug: req.query.slug }),
      ...(req.query.winId && { _id: req.query.winId }),
      ...(req.query.searchTerm && {
        $or: [
          { title: { $regex: req.query.searchTerm, $options: 'i' } },
          { content: { $regex: req.query.searchTerm, $options: 'i' } },
        ],
      }),
    })
      .sort({ updatedAt: sortDirection })
      .skip(startIndex)
      .limit(limit);

    const totalWins = await Win.countDocuments();
    const now = new Date();
    const oneMonthAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate()
    );

    const lastMonthWins = await Win.countDocuments({
      createdAt: { $gte: oneMonthAgo },
    });

    res.status(200).json({
      wins,
      totalWins,
      lastMonthWins,
    });
  } catch (error) {
    next(error);
  }
};

export const deletewin = async (req, res, next) => {
  if (!req.user.isAdmin || req.user.id !== req.params.userId) {
    return next(errorHandler(403, 'You are not allowed to delete this win'));
  }
  try {
    await Win.findByIdAndDelete(req.params.winId);
    res.status(200).json('The win has been deleted');
  } catch (error) {
    next(error);
  }
};

export const updatewin = async (req, res, next) => {
  if (!req.user.isAdmin || req.user.id !== req.params.userId) {
    return next(errorHandler(403, 'You are not allowed to update this win'));
  }
  try {
    const updatedWin = await Win.findByIdAndUpdate(
      req.params.winId,
      {
        $set: {
          title: req.body.title,
          winurl: req.body.winurl,
          content: req.body.content,
          image: req.body.image,
        },
      },
      { new: true }
    );
    res.status(200).json(updatedWin);
  } catch (error) {
    next(error);
  }
};
