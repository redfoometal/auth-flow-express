class HttpException extends Error {
    constructor(message, code) {
        super(message);
        this.code = code;
        Error.captureStackTrace(this, this.constructor);
    }
}

function createHttpException(name, code, defaultMessage) {
    return class extends HttpException {
        constructor(message = defaultMessage) {
            super(message, code);
            this.name = name;
        }
    };
}

const BadRequestException = createHttpException('BadRequestException', 400, 'Некорректный запрос');
const UnauthorizedException = createHttpException('UnauthorizedException', 401, 'Пользователь не авторизован');
const ForbidenException = createHttpException('ForbiddenException', 403, 'Доступ запрещен');
const ConflictException = createHttpException('ConflictException', 409, 'Конфликт');
const NotFoundException = createHttpException('NotFoundException', 404, 'Ресурс не найден');
const InternalServerErrorException = createHttpException('InternalServerErrorException', 500, 'Внутренняя ошибка сервера');

export {
    HttpException,
    BadRequestException,
    UnauthorizedException,
    ForbidenException,
    ConflictException,
    NotFoundException,
    InternalServerErrorException,
};
