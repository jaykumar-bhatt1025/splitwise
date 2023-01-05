import jwt from 'jsonwebtoken';

export const createToken = (data) => {
  const newObj = {
    id: data.id,
    email: data.email,
    contactNumber: data.contactNumber,
  };
  const token = jwt.sign(newObj, process.env.SECRET, { expiresIn: '12h' });
  return token;
};

// success response
export const successResponse = (req, res, data = 'Success.', code = 200) => ({
  code,
  data,
  success: true,
});

// error response
export const errorResponse = (
  req,
  res,
  errorMessage = 'Something went wrong',
  code = 500,
  error = {},
) => ({
  code,
  errorMessage,
  error,
  success: false,
});
