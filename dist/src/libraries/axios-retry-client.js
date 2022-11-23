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
exports.AxiosRetryClient = void 0;
const axios_1 = __importDefault(require("axios"));
const axios_retry_1 = __importStar(require("axios-retry"));
const axios_retry_client_helper_1 = require("./axios-retry-client-helper");
class AxiosRetryClient {
    constructor(retryPolicy) {
        this.retryPolicy = retryPolicy;
        this.axiosRetryClient = axios_1.default.create();
        this.setupAxiosRetry();
    }
    getClient() {
        return this.axiosRetryClient;
    }
    setupAxiosRetry() {
        axios_retry_1.default(this.axiosRetryClient, {
            retries: this.retryPolicy.maxRetries,
            // Retry if network/connection error, 5xx response or 429 response
            retryCondition: (err) => axios_retry_1.isNetworkError(err) || axios_retry_1.isRetryableError(err) || axios_retry_client_helper_1.is429Error(err),
            retryDelay: (retryCount, err) => axios_retry_client_helper_1.calculateRetryDelay(retryCount, err, this.retryPolicy),
        });
    }
}
exports.AxiosRetryClient = AxiosRetryClient;
