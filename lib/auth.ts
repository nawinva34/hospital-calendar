import { SignJWT, jwtVerify } from "jose";

// Using a placeholder secret for MVP. In production, ensure this is a strong environment variable.
const JWT_SECRET = process.env.JWT_SECRET || "hospital-calendar-super-secret-key-12345";
const encodedKey = new TextEncoder().encode(JWT_SECRET);

export async function signToken(payload: Record<string, unknown>) {
    return new SignJWT(payload)
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime("7d")
        .sign(encodedKey);
}

export async function verifyToken(token: string) {
    try {
        const { payload } = await jwtVerify(token, encodedKey);
        return payload;
    } catch {
        return null;
    }
}
