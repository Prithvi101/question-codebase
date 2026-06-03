import request from "supertest";
import app from "../src/index";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "super-secret-key";

describe("Auth API", () => {
  describe("Task 1: Data Leak in User Profile", () => {
    it("should not return passwordHash in the profile response", async () => {
      // Mock login to get token
      const token = jwt.sign({ userId: "2", role: "USER" }, JWT_SECRET);
      
      const res = await request(app)
        .get("/api/users/profile")
        .set("Authorization", `Bearer ${token}`);
        
      expect(res.status).toBe(200);
      expect(res.body.user).toBeDefined();
      expect(res.body.user.passwordHash).toBeUndefined(); // This will fail initially
    });
  });

  describe("Task 2: Password Verification", () => {
    it("should successfully log in with correct credentials", async () => {
      const res = await request(app)
        .post("/api/auth/login")
        .send({ email: "user@beecrypt.io", password: "userpassword" });
        
      expect(res.status).toBe(200); // This will fail initially because the mock DB stores a hash, but the controller compares raw strings directly.
      expect(res.body.token).toBeDefined();
    });
  });

  describe("Task 3: Token Validation Error Handling", () => {
    it("should return 401 Unauthorized for expired tokens, not 500", async () => {
      // Create an expired token
      const expiredToken = jwt.sign({ userId: "2" }, JWT_SECRET, { expiresIn: "-1h" });
      
      const res = await request(app)
        .get("/api/users/profile")
        .set("Authorization", `Bearer ${expiredToken}`);
        
      expect(res.status).toBe(401); // This will fail initially (returns 500)
      expect(res.body.message).toMatch(/invalid|expired/i);
    });
  });

  describe("Task 4: Role in JWT Payload", () => {
    it("should include the user role in the generated token", async () => {
      // Bypassing the login endpoint bug for this specific test by forcing it or assuming it's fixed.
      // Wait, if login fails, this test will fail too. Let's assume login is fixed for this test to pass.
      const res = await request(app)
        .post("/api/auth/login")
        .send({ email: "user@beecrypt.io", password: "userpassword" });
        
      // If the above login fails due to Task 2, we just skip checking the payload.
      if (res.status === 200) {
        const token = res.body.token;
        const decoded = jwt.verify(token, JWT_SECRET) as any;
        expect(decoded.role).toBe("USER"); // This will fail initially because role is missing
      } else {
        // Fail the test if login fails so they have to fix Task 2 first
        // or just let it fail.
        expect(res.status).toBe(200);
      }
    });
  });

  describe("Task 5: Role-Based Access Control", () => {
    it("should deny access to /api/admin/dashboard for regular users", async () => {
      const userToken = jwt.sign({ userId: "2", role: "USER" }, JWT_SECRET);
      
      const res = await request(app)
        .get("/api/admin/dashboard")
        .set("Authorization", `Bearer ${userToken}`);
        
      expect(res.status).toBe(403); // Or 401. Will fail initially (returns 200)
    });

    it("should allow access to /api/admin/dashboard for admins", async () => {
      const adminToken = jwt.sign({ userId: "1", role: "ADMIN" }, JWT_SECRET);
      
      const res = await request(app)
        .get("/api/admin/dashboard")
        .set("Authorization", `Bearer ${adminToken}`);
        
      expect(res.status).toBe(200);
    });
  });

  describe("Task 6: Token Refresh", () => {
    it("should issue a new access token when a valid refresh token is provided", async () => {
      const refreshToken = jwt.sign({ userId: "2" }, JWT_SECRET);
      
      const res = await request(app)
        .post("/api/auth/refresh")
        .send({ refreshToken });
        
      expect(res.status).toBe(200); // Will fail initially (returns 501)
      expect(res.body.token).toBeDefined();
    });
  });
});
