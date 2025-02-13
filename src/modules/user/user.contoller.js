class UserController {
    async getInfo(req, res, next) {
        try {
            res.send(req.user);
        } catch (error) {
            next(error);
        }
    }
}
export const userController = new UserController();
