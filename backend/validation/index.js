const z = require("zod");

const userSignUpBody = z.object({
  firstName: z.string().max(50),
  lastName: z.string().max(50),
  username: z.string().min(3).max(30).email(),
  password: z.string().min(6),
});

const userSignInBody = z.object({
  username: z.string().min(3).max(30).email(),
  password: z.string().min(6),
});

const updateBody = z.object({
  password: z.string().min(6).optional(),
  firstName: z.string().max(50).optional(),
  lastName: z.string().max(50).optional(),
});

module.exports = {
  userSignUpBody,
  userSignInBody,
  updateBody,
};
