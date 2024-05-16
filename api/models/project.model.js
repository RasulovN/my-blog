import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
      unique: true,
    },
    category: {
      type: String,
      default: 'uncategorized',
    },
    projecturl: {
      type: String,
      required: true,
      unique: true,
    },
    source: {
      type: String,
      required: true,
      unique: true,
    },
    image: {
      type: String,
      default:
        'https://firebasestorage.googleapis.com/v0/b/rasulov-portfolio.appspot.com/o/reactshop.jpg?alt=media&token=1c841865-8f6c-4728-ac77-17d98972888c',
      },
      content: {
        type: String,
        required: true,
      },
      slug: {
      type: String,
      required: true,
      unique: true,
    },
  },
  { timestamps: true }
);

const Project = mongoose.model('Project', projectSchema);

export default Project;
