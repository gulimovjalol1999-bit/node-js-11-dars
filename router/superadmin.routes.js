const {Router} = require("express")
const { updateRole, deleteUser } = require("../controller/superadmin.controller")
const superadminMiddleware = require("../middleware/superadmin-middleware")

const superadminRouter = Router()

superadminRouter.put("/update_role/:id", superadminMiddleware, updateRole)
superadminRouter.delete("/delet_user/:id", superadminMiddleware, deleteUser)

module.exports = superadminRouter