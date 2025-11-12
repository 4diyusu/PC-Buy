// removeDuplicates.js
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('../models/product'); // adjust path if needed

dotenv.config();

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ MongoDB connected'))
.catch(err => console.error('❌ Connection error:', err));

const removeDuplicates = async () => {
  try {
    // Step 1: Find duplicates grouped by title
    const duplicates = await Product.aggregate([
      {
        $group: {
          _id: "$title",
          ids: { $push: "$_id" },
          count: { $sum: 1 }
        }
      },
      {
        $match: { count: { $gt: 1 } }
      }
    ]);

    console.log(`Found ${duplicates.length} duplicate titles.`);

    // Step 2: Delete all but the first _id in each duplicate group
    for (const dup of duplicates) {
      const [keepId, ...removeIds] = dup.ids; // keep first, remove the rest
      await Product.deleteMany({ _id: { $in: removeIds } });
      console.log(`Removed ${removeIds.length} duplicates for title: ${dup._id}`);
    }

    console.log('✅ Duplicate removal complete.');
  } catch (err) {
    console.error('❌ Error removing duplicates:', err);
  } finally {
    mongoose.connection.close();
  }
};

removeDuplicates();
