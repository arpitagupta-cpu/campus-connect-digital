import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import { z } from "zod";
import { insertTodoSchema } from "@shared/schema";

// Middleware
function requireAuth(req: Request, res: Response, next: NextFunction) {
  if (!req.isAuthenticated?.()) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  next();
}

function requireAdmin(req: Request, res: Response, next: NextFunction) {
  const user = req.user as Express.User;
  if (user?.userType !== "admin") {
    return res.status(403).json({ message: "Forbidden" });
  }
  next();
}

export async function registerRoutes(app: Express): Promise<Server> {
  setupAuth(app);

  // Admin-only: Manage Student IDs
  app.get("/api/admin/students", requireAuth, requireAdmin, async (req, res) => {
    try {
      const students = await storage.getAllStudents();
      res.json(students);
    } catch (err) {
      res.status(500).json({ message: "Error fetching students" });
    }
  });

  app.post("/api/admin/student-ids", requireAuth, requireAdmin, async (req, res) => {
    const schema = z.object({
      studentId: z.string().min(1, "Student ID is required"),
      section: z.string().optional(),
      department: z.string().optional(),
      year: z.number().optional(),
      semester: z.string().optional()
    });

    try {
      const validData = schema.parse(req.body);
      const result = await storage.createStudentEntry(validData);
      res.status(201).json(result);
    } catch (err) {
      res.status(400).json({ message: "Invalid student data", error: err instanceof Error ? err.message : String(err) });
    }
  });

  app.put("/api/admin/student-ids/:id", requireAuth, requireAdmin, async (req, res) => {
    const schema = z.object({
      studentId: z.string().min(1).optional(),
      section: z.string().optional(),
      department: z.string().optional(),
      year: z.number().optional(),
      semester: z.string().optional()
    });

    const studentId = req.params.id;

    try {
      const validUpdate = schema.parse(req.body);
      const updatedData = await storage.updateStudentEntry(studentId, validUpdate);
      if (!updatedData) {
        return res.status(404).json({ message: "Student ID not found" });
      }
      res.json(updatedData);
    } catch (err) {
      res.status(400).json({ message: "Invalid student data", error: err instanceof Error ? err.message : String(err) });
    }
  });

  // Assignments
  app.get("/api/assignments", requireAuth, async (_req, res) => {
    const assignments = await storage.getAssignments();
    res.json(assignments);
  });

  app.get("/api/assignments/:id", requireAuth, async (req, res) => {
    const id = parseInt(req.params.id);
    const assignment = await storage.getAssignmentById(id);
    if (!assignment) return res.status(404).json({ message: "Assignment not found" });
    res.json(assignment);
  });

  app.post("/api/assignments", requireAuth, requireAdmin, async (req, res) => {
    try {
      const assignment = await storage.createAssignment(req.body);
      res.status(201).json(assignment);
    } catch (err) {
      res.status(400).json({ message: "Invalid assignment data" });
    }
  });

  // Resources
  app.get("/api/resources", requireAuth, async (req, res) => {
    const category = req.query.category as string | undefined;
    const resources = await storage.getResources(category);
    res.json(resources);
  });

  app.post("/api/resources", requireAuth, requireAdmin, async (req, res) => {
    try {
      const resource = await storage.createResource(req.body);
      res.status(201).json(resource);
    } catch (err) {
      res.status(400).json({ message: "Invalid resource data" });
    }
  });

  // Notices
  app.get("/api/notices", requireAuth, async (_req, res) => {
    const notices = await storage.getNotices();
    res.json(notices);
  });

  app.post("/api/notices", requireAuth, requireAdmin, async (req, res) => {
    try {
      const notice = await storage.createNotice(req.body);
      res.status(201).json(notice);
    } catch (err) {
      res.status(400).json({ message: "Invalid notice data" });
    }
  });

  // Schedule
  app.get("/api/schedule", requireAuth, async (req, res) => {
    const day = req.query.day as string | undefined;
    const schedule = await storage.getSchedule(day);
    res.json(schedule);
  });

  // Todos
  app.get("/api/todos", requireAuth, async (req, res) => {
    const user = req.user as Express.User;
    const todos = await storage.getTodos(user.id);
    res.json(todos);
  });

  app.post("/api/todos", requireAuth, async (req, res) => {
    const user = req.user as Express.User;

    try {
      const todoData = insertTodoSchema.parse({
        ...req.body,
        userId: user.id,
        createdAt: new Date()
      });
      const todo = await storage.createTodo(todoData);
      res.status(201).json(todo);
    } catch (err) {
      res.status(400).json({ message: "Invalid todo data", error: err instanceof Error ? err.message : String(err) });
    }
  });

  app.put("/api/todos/:id", requireAuth, async (req, res) => {
    const id = parseInt(req.params.id);
    const completed = req.body.completed;

    if (typeof completed !== "boolean") {
      return res.status(400).json({ message: "Invalid completed value" });
    }

    const todo = await storage.updateTodo(id, completed);
    if (!todo) {
      return res.status(404).json({ message: "Todo not found" });
    }
    res.json(todo);
  });

  app.delete("/api/todos/:id", requireAuth, async (req, res) => {
    const id = parseInt(req.params.id);
    const success = await storage.deleteTodo(id);
    if (!success) {
      return res.status(404).json({ message: "Todo not found" });
    }
    res.sendStatus(204);
  });

  // Events
  app.get("/api/events", requireAuth, async (_req, res) => {
    const events = await storage.getEvents();
    res.json(events);
  });

  // Messages
  app.get("/api/messages", requireAuth, async (req, res) => {
    const user = req.user as Express.User;
    const messages = await storage.getMessages(user.id);
    res.json(messages);
  });

  app.post("/api/messages", requireAuth, async (req, res) => {
    const user = req.user as Express.User;

    try {
      const message = await storage.createMessage({
        ...req.body,
        senderId: user.id,
        timestamp: new Date()
      });
      res.status(201).json(message);
    } catch (err) {
      res.status(400).json({ message: "Invalid message data", error: err instanceof Error ? err.message : String(err) });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
