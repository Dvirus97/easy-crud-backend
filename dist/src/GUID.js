"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GUID = void 0;
exports.GUID = {
    new: () => {
        const url = URL.createObjectURL(new Blob());
        return url.substring(14);
    },
};
