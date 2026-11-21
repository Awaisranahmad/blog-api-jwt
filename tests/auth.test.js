/* Auth controller tests — no database needed.
 * The User model and bcrypt are stubbed through require.cache; the real
 * jsonwebtoken signs tokens with a throwaway test secret.
 * Run: npm test   (node --test tests/)
 */
'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');

process.env.JWT_SECRET = 'test-secret-for-tests-only';

const FAKE_USER = {
  _id: '507f1f77bcf86cd799439011',
  username: 'awais',
  email: 'awais@blog.com',
  password: 'hashed-password',
};

// --- Stubs (installed before the controller is required) ---
const bcryptPath = require.resolve('bcrypt');
require.cache[bcryptPath] = {
  id: bcryptPath,
  filename: bcryptPath,
  loaded: true,
  exports: {
    hash: async (plain) => `hashed:${plain}`,
    compare: async (plain) => plain === 'correct-password',
  },
};

const userPath = require.resolve('../models/user');
require.cache[userPath] = {
  id: userPath,
  filename: userPath,
  loaded: true,
  exports: {
    findOne: async (query) => {
      if (query && query.$or) {
        const hit = query.$or.some(
          (c) =>
            (c.email && c.email === FAKE_USER.email) ||
            (c.username && c.username === FAKE_USER.username),
        );
        return hit ? { ...FAKE_USER } : null;
      }
      if (query && query.email === FAKE_USER.email) return { ...FAKE_USER };
      return null;
    },
    create: async (data) => ({ _id: FAKE_USER._id, ...data }),
  },
};

const { register, login } = require('../controllers/authController');
const jwt = require('jsonwebtoken');

function mockRes() {
  const res = {
    statusCode: 200,
    body: null,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(obj) {
      this.body = obj;
      return this;
    },
  };
  return res;
}

function mockNext() {
  const next = (err) => {
    next.error = err || null;
  };
  next.error = null;
  return next;
}

// The controller is wrapped by asyncHandler, which forwards errors to
// next() on a later tick — wait for the promise to settle.
async function settle() {
  await new Promise((r) => setImmediate(r));
  await new Promise((r) => setImmediate(r));
}

test('login with the WRONG password must fail with 401 (auth bypass regression)', async () => {
  const req = { body: { email: 'awais@blog.com', password: 'wrong-password' } };
  const res = mockRes();
  const next = mockNext();
  login(req, res, next);
  await settle();
  assert.equal(res.statusCode, 401);
  assert.ok(next.error, 'expected an error to be passed to next()');
  assert.equal(res.body, null, 'no token must be issued on a wrong password');
});

test('login with the CORRECT password succeeds and returns a valid token', async () => {
  const req = { body: { email: 'awais@blog.com', password: 'correct-password' } };
  const res = mockRes();
  const next = mockNext();
  login(req, res, next);
  await settle();
  assert.equal(next.error, null);
  assert.equal(res.statusCode, 200);
  assert.equal(res.body.success, true);
  assert.ok(res.body.token, 'expected a JWT token');
  const payload = jwt.verify(res.body.token, 'test-secret-for-tests-only');
  assert.equal(payload.email, 'awais@blog.com');
  assert.equal(String(payload.userId), FAKE_USER._id);
});

test('login with an unknown email fails with 401', async () => {
  const req = { body: { email: 'nobody@blog.com', password: 'correct-password' } };
  const res = mockRes();
  const next = mockNext();
  login(req, res, next);
  await settle();
  assert.equal(res.statusCode, 401);
  assert.ok(next.error);
});

test('login with missing fields fails with 400', async () => {
  const req = { body: { email: 'awais@blog.com' } };
  const res = mockRes();
  const next = mockNext();
  login(req, res, next);
  await settle();
  assert.equal(res.statusCode, 400);
  assert.ok(next.error);
});

test('register with missing fields fails with 400', async () => {
  const req = { body: { username: 'newuser', email: 'new@blog.com' } };
  const res = mockRes();
  const next = mockNext();
  register(req, res, next);
  await settle();
  assert.equal(res.statusCode, 400);
  assert.ok(next.error);
});

test('register with an existing email/username fails with 400', async () => {
  const req = {
    body: { username: 'awais', email: 'awais@blog.com', password: 'secret123' },
  };
  const res = mockRes();
  const next = mockNext();
  register(req, res, next);
  await settle();
  assert.equal(res.statusCode, 400);
  assert.ok(next.error);
});

test('register with a new user succeeds with 201 and no password in the response', async () => {
  const req = {
    body: { username: 'newuser', email: 'new@blog.com', password: 'secret123' },
  };
  const res = mockRes();
  const next = mockNext();
  register(req, res, next);
  await settle();
  assert.equal(next.error, null);
  assert.equal(res.statusCode, 201);
  assert.equal(res.body.success, true);
  assert.equal(res.body.data.email, 'new@blog.com');
  assert.equal(res.body.data.password, undefined);
});
