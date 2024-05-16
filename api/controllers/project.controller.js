import Project from '../models/project.model.js';
import { errorHandler } from '../utils/error.js';

export const procreate = async (req, res, next) => {
  if (!req.user.isAdmin) {
    return next(errorHandler(403, 'You are not allowed to create a project'));
  }
  // if (!req.body.title || !req.body.content || !req.body.projecturl || !req.body.source) {
  //   return next(errorHandler(400, 'Please provide all required fields'));
  // }
  if (!req.body.title && !req.body.content) {
    return next(errorHandler(400, 'Please provide all required fields'));
  }
  
  const slug = req.body.title
    .split(' ')
    .join('-')
    .toLowerCase()
    .replace(/[^a-zA-Z0-9-]/g, '');
    // .replace(/[^a-zA-Z0-9-]/g, '-')

  const newProject = new Project({
    ...req.body,
    slug,
    userId: req.user.id,
  });
  try {
    const savedProject = await newProject.save();
    res.status(201).json(savedProject);
  } catch (error) {
    next(error);
  }
};

export const getprojects = async (req, res, next) => {
  try {
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 9;
    const sortDirection = req.query.order === 'asc' ? 1 : -1;
    const projects = await Project.find({
      ...(req.query.userId && { userId: req.query.userId }),
      ...(req.query.projecturl && { projecturl: req.query.projecturl }),
      ...(req.query.source && { source: req.query.source }),
      ...(req.query.category && { category: req.query.category }),
      ...(req.query.image && { image: req.query.image }),
      ...(req.query.slug && { slug: req.query.slug }),
      ...(req.query.projectId && { _id: req.query.projectId }),
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

    const totalProjects = await Project.countDocuments();
    const now = new Date();
    const oneMonthAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate()
    );

    const lastMonthProjects = await Project.countDocuments({
      createdAt: { $gte: oneMonthAgo },
    });

    res.status(200).json({
      projects,
      totalProjects,
      lastMonthProjects,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteproject = async (req, res, next) => {
  if (!req.user.isAdmin || req.user.id !== req.params.userId) {
    return next(errorHandler(403, 'You are not allowed to delete this project'));
  }
  try {
    await Project.findByIdAndDelete(req.params.projectId);
    res.status(200).json('The project has been deleted');
  } catch (error) {
    next(error);
  }
};

export const updateproject = async (req, res, next) => {
  if (!req.user.isAdmin || req.user.id !== req.params.userId) {
    return next(errorHandler(403, 'You are not allowed to update this project'));
  }
  try {
    const updatedProject = await Project.findByIdAndUpdate(
      req.params.projectId,
      {
        $set: {
          title: req.body.title,
          projecturl: req.body.projecturl,
          source: req.body.source,
          content: req.body.content,
          category: req.body.category,
          image: req.body.image,
        },
      },
      { new: true }
    );
    res.status(200).json(updatedProject);
  } catch (error) {
    next(error);
  }
};
