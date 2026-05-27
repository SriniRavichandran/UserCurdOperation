import { Router } from 'express';
import UserController from '../controllers/user.controller';
import { validateBody } from '../middleware/validationHandler';
import { createUserSchema, updateUserSchema } from '../validators/user.validator';

const router = Router();

// Stats route (defined first to prevent matching :id)
router.get('/stats', UserController.getUserStats);

// General collection routes
router.get('/', UserController.getUsers);
router.post('/', validateBody(createUserSchema), UserController.createUser);

// Individual resource routes
router.get('/:id', UserController.getUserById);
router.put('/:id', validateBody(updateUserSchema), UserController.updateUser);
router.delete('/:id', UserController.deleteUser);

export default router;
