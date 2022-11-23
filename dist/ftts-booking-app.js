"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.index = exports.httpTrigger = void 0;
const aws_serverless_express_1 = __importDefault(require("aws-serverless-express"));
const egress_filtering_1 = require("@dvsa/egress-filtering");
const url_1 = __importDefault(require("url"));
const azure_logger_1 = require("@dvsa/azure-logger");
const index_1 = require("./src/services/egress/index");
const app_1 = __importDefault(require("./app"));
const logger_1 = require("./src/helpers/logger");
const cookie_helper_1 = require("./src/helpers/cookie-helper");
const server = aws_serverless_express_1.default.createServer(app_1.default, undefined, ["*/*"]);
const httpTrigger = (context, req) => {
    const path = url_1.default.parse(req.originalUrl).pathname;
    const event = {
        path,
        httpMethod: req.method,
        headers: {
            ...req.headers,
        },
        queryStringParameters: {
            ...req.query,
        },
        body: req.rawBody,
        isBase64Encoded: false,
    };
    const awsContext = {
        succeed(awsResponse) {
            if (context.res) {
                // Need to deal with the cookies and make sure we set them correctly
                context.res.cookies = [];
                // eslint-disable-next-line no-restricted-syntax
                for (const [key, value] of Object.entries(awsResponse.headers)) {
                    if (key.toLowerCase() === "set-cookie") {
                        const cookie = cookie_helper_1.createAzureCookie(value);
                        context.res.cookies.push(cookie);
                        // eslint-disable-next-line security/detect-object-injection
                        delete awsResponse.headers[key];
                    }
                }
                context.res.status = awsResponse.statusCode;
                context.res.headers = {
                    ...context.res.headers,
                    ...awsResponse.headers,
                };
                context.res.body = Buffer.from(awsResponse.body, awsResponse.isBase64Encoded ? "base64" : "utf8");
                context.res.isRaw = true;
            }
            context.done();
        },
    };
    aws_serverless_express_1.default.proxy(server, event, awsContext);
};
exports.httpTrigger = httpTrigger;
const index = (context, req) => {
    azure_logger_1.httpTriggerContextWrapper(egress_filtering_1.withEgressFiltering(exports.httpTrigger, index_1.ALLOWED_ADDRESSES, () => { }, logger_1.logger), context, req).catch((e) => {
        logger_1.logger.error(e, "httpTriggerContextWrapper failure");
    });
};
exports.index = index;
