"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TimeoutErrorController = void 0;
const enums_1 = require("../../domain/enums");
const language_1 = require("../../helpers/language");
const logger_1 = require("../../helpers/logger");
const session_1 = require("../../services/session");
class TimeoutErrorController {
    constructor() {
        this.get = async (req, res) => {
            var _a, _b, _c, _d, _e;
            logger_1.logger.event(logger_1.BusinessTelemetryEvents.SESSION_TIMEOUT, "TimeoutErrorController::get: session timeout", {
                candidateId: (_a = req.session.candidate) === null || _a === void 0 ? void 0 : _a.candidateId,
                bookingId: (_b = req.session.currentBooking) === null || _b === void 0 ? void 0 : _b.bookingId,
            });
            const source = String((_c = req === null || req === void 0 ? void 0 : req.query) === null || _c === void 0 ? void 0 : _c.source);
            session_1.store.reset(req, res);
            const target = ((_d = req === null || req === void 0 ? void 0 : req.query) === null || _d === void 0 ? void 0 : _d.target) === enums_1.Target.NI ? enums_1.Target.NI : enums_1.Target.GB;
            res.locals.target = target;
            const localeInput = ((_e = req === null || req === void 0 ? void 0 : req.query) === null || _e === void 0 ? void 0 : _e.lang)
                ? req.query.lang
                : enums_1.Locale.GB;
            const locale = language_1.sanitizeLocale(localeInput);
            let lang = locale;
            await language_1.changeLanguageToLocale(req, res, locale);
            if (!language_1.isLocaleAvailableForTarget(locale, target)) {
                const defaultLocale = language_1.getDefaultLocale(target);
                lang = defaultLocale;
                await language_1.changeLanguageToLocale(req, res, defaultLocale);
            }
            let startAgainLink = `/choose-support?target=${target}&lang=${lang}`;
            if (source === null || source === void 0 ? void 0 : source.startsWith("/manage-booking")) {
                startAgainLink = `/manage-booking?target=${target}&lang=${lang}`;
            }
            else if (source === null || source === void 0 ? void 0 : source.startsWith("/instructor")) {
                startAgainLink = `/instructor?target=${target}&lang=${lang}`;
            }
            return res.render("common/error-timeout", {
                startAgainLink,
            });
        };
    }
}
exports.TimeoutErrorController = TimeoutErrorController;
exports.default = new TimeoutErrorController();
