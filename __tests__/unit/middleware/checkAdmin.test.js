import { jest } from "@jest/globals";
import checkAdmin from "../../../middleware/checkAdmin.js";
import User from "../../../models/user.js";

describe("checkAdmin middleware", () => {
  let req;
  let res;
  let next;

  beforeEach(() => {
    req = { user: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  it("returns 403 when user is not found", async () => {
    req.user.id = "507f1f77bcf86cd799439011";

    await checkAdmin(req, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({
      message: "Access denied. Admins only.",
    });
    expect(next).not.toHaveBeenCalled();
  });

  it("returns 403 when user role is not admin", async () => {
    const user = await User.create({
      email: "user@test.com",
      password: "password123",
      role: "user",
    });
    req.user.id = user._id.toString();

    await checkAdmin(req, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(next).not.toHaveBeenCalled();
  });

  it("calls next when user role is admin", async () => {
    const admin = await User.create({
      email: "admin@test.com",
      password: "password123",
      role: "admin",
    });
    req.user.id = admin._id.toString();

    await checkAdmin(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
  });
});
