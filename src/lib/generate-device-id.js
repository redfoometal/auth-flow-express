import crypto from "crypto";

export const generateDeviceId = async (userAgent) => {
    return crypto.createHash("sha256").update(userAgent).digest("hex");
};
