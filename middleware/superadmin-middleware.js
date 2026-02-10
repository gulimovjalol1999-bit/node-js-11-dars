const jwt = require("jsonwebtoken")

module.exports = function(req, res, next) {
  try{
    const authorization = req.headers.authorization

    if (!authorization) {
      return res.status(401).json({
        message: "Token not found"
      })
    }

    const token = authorization.split(" ")[1]

    const decode = jwt.verify(token, process.env.SECRET_KEY)
    req.user = decode

    if (req.user.role !== "superadmin") {
      return res.status(401).json({
        message: "you are not superadmin"
      })
    }

    next()

  }catch(error) {
    return res.status(500).json({
      message: error.message
    })
  }
}