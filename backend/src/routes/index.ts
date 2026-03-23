import { Router } from "express";
import usersRouter from './users.route';
import authRouter from './auth.route';
import unidadeRouter from './unidade.route';

const router = Router();

router.use('/users', usersRouter);
router.use('/auth', authRouter)
router.use('/unidades', unidadeRouter);
export default router;