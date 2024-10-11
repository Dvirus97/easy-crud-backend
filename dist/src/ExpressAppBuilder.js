"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExpressAppBuilder = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
class ExpressAppBuilder {
    constructor() {
        this.app = (0, express_1.default)();
    }
    build() {
        return this.app;
    }
    withJson() {
        this.app.use(express_1.default.json());
        return this;
    }
    withStatic(path) {
        this.app.use(express_1.default.static(path));
        return this;
    }
    withAnyCors() {
        this.app.use((0, cors_1.default)());
        return this;
    }
}
exports.ExpressAppBuilder = ExpressAppBuilder;
