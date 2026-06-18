import User from "../../models/user.js";
import { getTestAgent } from "../helpers/testApp.js";

describe("User API", () => {
  let agent;

  beforeAll(async () => {
    agent = await getTestAgent();
  });

  it("PATCH /api/users/:userId updates user fields", async () => {
    const user = await User.create({
      email: "patchuser@test.com",
      password: "password123",
    });

    const res = await agent
      .patch(`/api/users/${user._id}`)
      .send({ favouriteMovies: ["movie1", "movie2"] });

    expect(res.status).toBe(200);
    expect(res.body.msg).toBe("User updated successfully");
    expect(res.body.updateUser.favouriteMovies).toEqual(["movie1", "movie2"]);
  });

  it("DELETE /api/users/:userId removes user", async () => {
    const user = await User.create({
      email: "deleteuser@test.com",
      password: "password123",
    });

    const res = await agent.delete(`/api/users/${user._id}`);

    expect(res.status).toBe(200);
    expect(res.body.msg).toBe("User deleted successfully");
    expect(res.body.deleteUser.email).toBe("deleteuser@test.com");

    const deleted = await User.findById(user._id);
    expect(deleted).toBeNull();
  });
});
