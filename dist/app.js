"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.App = void 0;
// NPM dependencies
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const i18next_1 = __importDefault(require("i18next"));
const i18next_browser_languagedetector_1 = __importDefault(require("i18next-browser-languagedetector"));
const nunjucks_1 = __importDefault(require("nunjucks"));
const path_1 = __importDefault(require("path"));
const helmet_1 = __importDefault(require("helmet"));
const uuid_1 = require("uuid");
const axios_1 = __importDefault(require("axios"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const csurf_1 = __importDefault(require("csurf"));
// Local dependencies
const config_1 = __importDefault(require("./src/config"));
require("./src/libraries/dayjs-config");
const errorHandler = __importStar(require("./src/middleware/error-handler"));
const filter_manager_1 = require("./src/nunjucks-filters/filter-manager");
const ftts_session_1 = __importDefault(require("./src/libraries/ftts-session"));
const xrobots_tag_filter_1 = require("./src/middleware/xrobots-tag-filter");
const internationalisation_1 = require("./src/middleware/internationalisation");
const locales_1 = __importDefault(require("./src/locales"));
const enums_1 = require("./src/domain/enums");
const helmetConfiguration_1 = __importDefault(require("./src/libraries/helmetConfiguration"));
const setup_locals_1 = require("./src/middleware/setup-locals");
const setup_google_analytics_1 = require("./src/middleware/setup-google-analytics");
const set_analytics_cookie_1 = require("./src/middleware/set-analytics-cookie");
const routes_1 = require("./src/routes");
const logger_1 = require("./src/helpers/logger");
const setup_telemetry_1 = require("./src/middleware/setup-telemetry");
const setup_queue_it_1 = require("./src/middleware/queue-it/setup-queue-it");
const no_cache_1 = require("./src/middleware/no-cache");
axios_1.default.defaults.timeout = config_1.default.http.timeout;
// Function returns an express app, which we can't type to due to express being a namespace
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const App = () => {
    const app = express_1.default();
    app.use(cors_1.default());
    app.use("/public/fonts", express_1.default.static(path_1.default.join(__dirname, "assets/fonts")));
    app.use("/public/images", express_1.default.static(path_1.default.join(__dirname, "assets/images")));
    app.use("/public/javascripts", express_1.default.static(path_1.default.join(__dirname, "assets/javascripts")));
    app.use("/public/langs", express_1.default.static(path_1.default.join(__dirname, "assets/langs")));
    app.use("/public/stylesheets", express_1.default.static(path_1.default.join(__dirname, "assets/stylesheets")));
    // Setup nonce
    app.use((req, res, next) => {
        res.locals.scriptNonce = Buffer.from(uuid_1.v4()).toString("base64");
        next();
    });
    // Setup Google Analytics
    app.use(setup_google_analytics_1.setGoogleAnalyticsId);
    // Setup Helmet
    app.use(helmet_1.default(helmetConfiguration_1.default));
    app.set("trust proxy", 1);
    // Set up App
    const appViews = [path_1.default.join(__dirname, "/views/")];
    // Internationalisation
    i18next_1.default
        .use(i18next_browser_languagedetector_1.default)
        .init({
        resources: locales_1.default,
        initImmediate: false,
        fallbackLng: enums_1.Locale.GB,
        preload: [enums_1.Locale.GB, enums_1.Locale.NI, enums_1.Locale.CY],
    })
        .catch((e) => {
        logger_1.logger.error(e, "Could not instantiate i18next");
    });
    /**
     * Nunjucks environment options
     *
     * _noCache_ - False - use a cache, do not recompile templates each time (server-side);
     * _watch_ - False - do not reload templates when they are changed
     */
    const nunjucksAppEnv = nunjucks_1.default.configure(appViews, {
        autoescape: true,
        express: app,
        noCache: process.env.NODE_ENV === "development",
        watch: process.env.NODE_ENV === "development",
    });
    // Add Nunjucks filters
    filter_manager_1.addNunjucksFilters(nunjucksAppEnv);
    // Set views engine
    app.set("view engine", "njk");
    // Support for parsing data in POSTs
    app.use(body_parser_1.default.urlencoded({
        extended: true,
    }));
    app.use(cookie_parser_1.default());
    // Set up redis session
    app.use(ftts_session_1.default);
    // Add variables that are available in all views
    app.locals = {
        ...app.locals,
        ...config_1.default.view,
        assetUrl: config_1.default.view.assetPath,
    };
    app.use(xrobots_tag_filter_1.XRobotsTagFilter.filter);
    app.use(setup_locals_1.setupLocals);
    app.use(internationalisation_1.internationalisation);
    app.use(set_analytics_cookie_1.setAnalyticsCookie);
    app.use(setup_queue_it_1.setupQueueIt);
    app.use(no_cache_1.noCache);
    // CSRF token setup
    app.use(csurf_1.default({ cookie: false }));
    app.use((req, res, next) => {
        res.locals.csrfToken = req.csrfToken();
        next();
    });
    app.use(setup_telemetry_1.setupTelemetry);
    // Setup Routes
    app.use("/", routes_1.candidateRouter);
    app.use("/instructor", routes_1.instructorRouter);
    app.use("/manage-booking", routes_1.manageBookingRouter);
    app.use("/", routes_1.landingRouter);
    app.use("/admin/warmup", routes_1.warmupRouter);
    // Display error
    app.use(errorHandler.internalServerError);
    app.use(errorHandler.pageNotFound);
    return app;
};
exports.App = App;
exports.default = exports.App();
