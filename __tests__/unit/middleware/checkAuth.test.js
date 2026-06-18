import { jest } from "@jest/globals";
import jwt from "jsonwebtoken";
import checkAuth from "../../../middleware/checkAuth.js";

describe("checkAuth middleware", () => {
  let req;
  let res;
  let next;

  beforeEach(() => {
    req = { headers: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
    process.env.JWT_SECRET = "test-jwt-secret";
  });

  it("returns 401 when Authorization header is missing", () => {
    checkAuth(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      message: "Authentication has failed!",
    });
    expect(next).not.toHaveBeenCalled();
  });

  it("returns 401 when token is invalid", () => {
    req.headers.authorization = "Bearer invalid-token";

    checkAuth(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  it("calls next and sets req.user when token is valid", () => {
    const userId = "507f1f77bcf86cd799439011";
    const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    req.headers.authorization = `Bearer ${token}`;

    checkAuth(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(req.user.id).toBe(userId);
    expect(res.status).not.toHaveBeenCalled();
  });

  it("verifies token signed with JWT_KEY when JWT_SECRET is unset", () => {
    delete process.env.JWT_SECRET;
    process.env.JWT_KEY = "fallback-key";

    const userId = "507f1f77bcf86cd799439012";
    const token = jwt.sign({ id: userId }, process.env.JWT_KEY, {
      expiresIn: "1h",
    });
    req.headers.authorization = `Bearer ${token}`;

    checkAuth(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(req.user.id).toBe(userId);

    process.env.JWT_SECRET = "test-jwt-secret";
    delete process.env.JWT_KEY;
  });
});
