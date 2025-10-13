const jwt = require('jsonwebtoken')

const authMid = (req, res, next) => {
  const head = req.headers.authorization
  if (!head || !head.startsWith('Bearer ')) {
    return res.status(401).json({ msg: "Authorization token missing", success: false })
  }
  const token = head.split(" ")[1]
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ msg: "Invalid or expired token", success: false });
  }
}

const restAuthMid = (req, res, next) => {
  if (req.user.role != 'RESTAURANT_OWNER') {
    return res.status(401).json({ msg: "Not a Restaurant Owner", success: false });
  }
  next()
}
const userAuthMid = (req, res, next) => {
  if (req.user.role != 'CUSTOMER') {
    return res.status(401).json({ msg: "Not a Customer", success: false });
  }
  next()
}
const agentAuthMid = (req, res, next) => {
  if (req.user.role != 'DELIVERY_AGENT') {
    return res.status(401).json({ msg: "Not a DELIVERY AGENT", success: false });
  }
  next()
}


module.exports = { authMid, restAuthMid, userAuthMid, agentAuthMid }