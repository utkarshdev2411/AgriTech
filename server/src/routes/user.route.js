import { Router } from "express";
import {
    changePassword,
  currentUser,
  removeUserAvatar,
  updateUserAccountDetails,
  updateUserAvatar,
  userLogin,
  userLogout,
  userRegister,
} from "../controllers/user.controller.js";
import { jwtVerify } from "../middlewares/user.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

router.route("/register").post(userRegister);
router.route("/login").post(userLogin);
router.route("/current-user").get(jwtVerify, currentUser);
router.route("/logout").post(jwtVerify, userLogout);
router.route("/update-user-details").post(jwtVerify, updateUserAccountDetails)
router.route("/change-password").post(jwtVerify, changePassword)
router.route("/update-avatar").patch(jwtVerify, upload.single("avatar"), updateUserAvatar);
router.route("/delete-avatar").delete(jwtVerify, removeUserAvatar);

export default router;
