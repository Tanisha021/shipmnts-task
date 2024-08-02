import mongoose from 'mongoose';

const ItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    maxlength: 60,
  },
  type: {
    type: String,
    required: true,
    enum: ['file', 'folder'],
  },
  parentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Item',
    default: null,
  },
});

export default mongoose.models.Item || mongoose.model('Item', ItemSchema);