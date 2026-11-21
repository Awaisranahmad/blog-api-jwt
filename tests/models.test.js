/* Model validation tests — no database needed.
 * Mongoose schema validation runs offline; only `unique` needs an index,
 * so uniqueness is covered by the auth controller tests instead.
 * Run: npm test   (node --test tests/)
 */
'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const mongoose = require('mongoose');

const User = require('../models/user');
const Post = require('../models/Post');

test('User rejects an invalid email', async () => {
  const user = new User({ username: 'awais', email: 'not-an-email', password: 'secret123' });
  await assert.rejects(() => user.validate(), (err) => {
    assert.equal(err.name, 'ValidationError');
    assert.ok(err.errors.email, 'expected an email validation error');
    return true;
  });
});

test('User rejects a username shorter than 3 characters', async () => {
  const user = new User({ username: 'ab', email: 'awais@blog.com', password: 'secret123' });
  await assert.rejects(() => user.validate(), (err) => {
    assert.ok(err.errors.username, 'expected a username validation error');
    return true;
  });
});

test('User rejects a password shorter than 6 characters', async () => {
  const user = new User({ username: 'awais', email: 'awais@blog.com', password: '12345' });
  await assert.rejects(() => user.validate(), (err) => {
    assert.ok(err.errors.password, 'expected a password validation error');
    return true;
  });
});

test('User accepts a valid user', async () => {
  const user = new User({ username: 'awais', email: 'awais@blog.com', password: 'secret123' });
  await user.validate(); // must not throw
});

test('Post rejects a title shorter than 3 characters', async () => {
  const post = new Post({
    title: 'ab',
    content: 'This content is long enough.',
    author: new mongoose.Types.ObjectId(),
  });
  await assert.rejects(() => post.validate(), (err) => {
    assert.ok(err.errors.title, 'expected a title validation error');
    return true;
  });
});

test('Post rejects content shorter than 10 characters', async () => {
  const post = new Post({
    title: 'Valid title',
    content: 'short',
    author: new mongoose.Types.ObjectId(),
  });
  await assert.rejects(() => post.validate(), (err) => {
    assert.ok(err.errors.content, 'expected a content validation error');
    return true;
  });
});

test('Post schema has timestamps enabled (createdAt/updatedAt)', () => {
  // Regression test: the option was mistyped as `timestamp: true`, so
  // createdAt/updatedAt were never set and sorting by createdAt did nothing.
  assert.equal(Post.schema.options.timestamps, true);
});

test('Post accepts a valid post', async () => {
  const post = new Post({
    title: 'My First Blog Post',
    content: 'This is the content of my first blog post.',
    author: new mongoose.Types.ObjectId(),
  });
  await post.validate(); // must not throw
});
