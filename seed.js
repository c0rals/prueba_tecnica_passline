require('dotenv').config();

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const User = require('./models/User');
const Book = require('./models/Book');
const Comment = require('./models/Comment');
const Order = require('./models/Order');

async function connect() {
  const mongoUri = process.env.MONGO_URI;
  if (!mongoUri) {
    throw new Error('Missing MONGO_URI. Set it in your environment (or a .env file).');
  }

  const hasDbName = /mongodb(\+srv)?:\/\/[^/]+\/[^/?#]+/i.test(mongoUri);
  if (!hasDbName) {
    console.warn(
      'Warning: MONGO_URI does not include a database name. Mongo will default to "test".'
    );
  }

  await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 5000 });
}

async function seed({ clear = false } = {}) {
  if (clear) {
    await Promise.all([
      Order.deleteMany({}),
      Comment.deleteMany({}),
      Book.deleteMany({}),
      User.deleteMany({})
    ]);
    console.log('Cleared collections: orders, comments, books, users');
  }

  const passwordHash = await bcrypt.hash('Password123!', 10);

  const admin = await User.findOneAndUpdate(
    { email: 'admin@bookstore.local' },
    { name: 'Admin', email: 'admin@bookstore.local', password: passwordHash, role: 'admin' },
    { new: true, upsert: true, setDefaultsOnInsert: true }
  );

  const alice = await User.findOneAndUpdate(
    { email: 'alice@bookstore.local' },
    { name: 'Alice', email: 'alice@bookstore.local', password: passwordHash, role: 'customer' },
    { new: true, upsert: true, setDefaultsOnInsert: true }
  );

  const bob = await User.findOneAndUpdate(
    { email: 'bob@bookstore.local' },
    { name: 'Bob', email: 'bob@bookstore.local', password: passwordHash, role: 'customer' },
    { new: true, upsert: true, setDefaultsOnInsert: true }
  );

  const booksData = [
    {
      title: 'Clean Code',
      image: 'https://picsum.photos/seed/clean-code/600/800',
      description:
        'A Handbook of Agile Software Craftsmanship. Seed data for development/testing.',
      price: 29.99
    },
    {
      title: 'The Pragmatic Programmer',
      image: 'https://picsum.photos/seed/pragmatic/600/800',
      description: 'Your Journey to Mastery. Seed data for development/testing.',
      price: 34.5
    },
    {
      title: "You Don't Know JS Yet",
      image: 'https://picsum.photos/seed/ydkjs/600/800',
      description: 'A deep dive into JavaScript. Seed data for development/testing.',
      price: 24.0
    }
  ];

  const books = [];
  for (const data of booksData) {
    const book = await Book.findOneAndUpdate(
      { title: data.title },
      { $set: data, $setOnInsert: { comments: [] } },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );
    books.push(book);
  }

  // Create 2 comments and attach to first book
  const c1 = await Comment.create({
    author: { id: alice._id, name: alice.name },
    title: 'Excelente',
    content: 'Me ayudó a mejorar la calidad del código y mantener buenas prácticas.'
  });
  const c2 = await Comment.create({
    author: { id: bob._id, name: bob.name },
    title: 'Muy recomendado',
    content: 'Ideal para repasar conceptos y aplicarlos en proyectos reales.'
  });

  await Book.updateOne(
    { _id: books[0]._id },
    { $addToSet: { comments: { $each: [c1._id, c2._id] } } }
  );

  // Add one cart item for Alice
  await User.updateOne(
    { _id: alice._id },
    { $set: { carts: [{ book: books[1]._id, quantity: 2 }] } }
  );

  // Create a sample order for Alice
  await Order.create({
    user: alice._id,
    details: [
      { book: books[1]._id, quantity: 2 },
      { book: books[2]._id, quantity: 1 }
    ],
    amount: Number((books[1].price * 2 + books[2].price).toFixed(2))
  });

  console.log('Seed complete.');
  console.log('- Users:', 3, '(admin + 2 customers)');
  console.log('- Books:', books.length);
  console.log('- Comments:', 2);
  console.log('- Orders:', 1);
  console.log('Login examples:');
  console.log('- admin@bookstore.local / Password123!');
  console.log('- alice@bookstore.local / Password123!');
  console.log('- bob@bookstore.local / Password123!');
}

async function main() {
  const clear = process.argv.includes('--clear');
  await connect();
  console.log(`Connected DB: ${mongoose.connection.name} @ ${mongoose.connection.host}`);
  await seed({ clear });
  await mongoose.disconnect();
}

main().catch(async (err) => {
  console.error(err);
  try {
    await mongoose.disconnect();
  } catch (_) {}
  process.exitCode = 1;
});
