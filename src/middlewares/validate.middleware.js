import { validationResult } from 'express-validator';
import { BadRequestException } from '../lib/http-exeption.js';
import { rimraf } from 'rimraf';

export const validate = (validations) => {
    return async (req, res, next) => {
        for (let validation of validations) {
            const result = await validation.run(req);
            if (result.errors.length) break;
        }

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            if (req.file) {
                rimraf(req.file.path);
            }

            return next(
                new BadRequestException(
                    errors
                        .array()
                        .map((err) => err.msg)
                        .join(', '),
                ),
            );
        }

        next();
    };
};
