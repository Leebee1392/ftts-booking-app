"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const connect_redis_1 = __importDefault(require("connect-redis"));
const express_session_1 = __importDefault(require("express-session"));
const redis_1 = __importDefault(require("redis"));
const config_1 = __importDefault(require("../config"));
const RedisStore = connect_redis_1.default(express_session_1.default);
const client = redis_1.default.createClient(config_1.default.redisClient);
const store = new RedisStore({
    client,
    ttl: config_1.default.sessionTtlSessionDuration,
});
const fttsSession = express_session_1.default({
    ...config_1.default.session,
    store,
    rolling: true,
});
exports.default = fttsSession;
