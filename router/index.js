import { Router } from "express";

const router = new Router();

router.post("/registration");
router.post("/login");
router.post("/logout");
router.get("/active/:link");
router.get("/refresh");
router.get("/users");

export default router;
