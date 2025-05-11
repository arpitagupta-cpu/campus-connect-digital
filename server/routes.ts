import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import { z } from "zod";
import { insertTodoSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Set up authentication
  setupAuth(app);
  
  // API routes
  // Assignments
  app.get("/api/assignments", async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Unauthorized" });
    const assignments = await storage.getAssignments();
    res.json(assignments);
  });
  
  app.get("/api/assignments/:id", async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Unauthorized" });
    const id = parseInt(req.params.id);
    const assignment = await storage.getAssignmentById(id);
    if (!assignment) {
      return res.status(404).json({ message: "Assignment not found" });
    }
    res.json(assignment);
  });
  
  app.post("/api/assignments", async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Unauthorized" });
    const user = req.user as Express.User;
    if (user.userType !== "admin") {
      return res.status(403).json({ message: "Forbidden" });
    }
    
    try {
      const assignment = await storage.createAssignment(req.body);
      res.status(201).json(assignment);
    } catch (err) {
      res.status(400).json({ message: "Invalid assignment data" });
    }
  });
  
  // Resources
  app.get("/api/resources", async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Unauthorized" });
    const category = req.query.category as string | undefined;
    const resources = await storage.getResources(category);
    res.json(resources);
  });
  
  app.post("/api/resources", async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Unauthorized" });
    const user = req.user as Express.User;
    if (user.userType !== "admin") {
      return res.status(403).json({ message: "Forbidden" });
    }
    
    try {
      const resource = await storage.createResource(req.body);
      res.status(201).json(resource);
    } catch (err) {
      res.status(400).json({ message: "Invalid resource data" });
    }
  });
  
  // Notices
  app.get("/api/notices", async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Unauthorized" });
    const notices = await storage.getNotices();
    res.json(notices);
  });
  
  app.post("/api/notices", async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Unauthorized" });
    const user = req.user as Express.User;
    if (user.userType !== "admin") {
      return res.status(403).json({ message: "Forbidden" });
    }
    
    try {
      const notice = await storage.createNotice(req.body);
      res.status(201).json(notice);
    } catch (err) {
      res.status(400).json({ message: "Invalid notice data" });
    }
  });
  
  // Schedule
  app.get("/api/schedule", async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Unauthorized" });
    const day = req.query.day as string | undefined;
    const schedule = await storage.getSchedule(day);
    res.json(schedule);
  });
  
  // Todos
  app.get("/api/todos", async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Unauthorized" });
    const user = req.user as Express.User;
    const todos = await storage.getTodos(user.id);
    res.json(todos);
  });
  
  app.post("/api/todos", async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Unauthorized" });
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
      res.status(400).json({ message: "Invalid todo data" });
    }
  });
  
  app.put("/api/todos/:id", async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Unauthorized" });
    const id = parseInt(req.params.id);
    const completed = req.body.completed;
    
    if (typeof completed !== 'boolean') {
      return res.status(400).json({ message: "Invalid completed value" });
    }
    
    const todo = await storage.updateTodo(id, completed);
    if (!todo) {
      return res.status(404).json({ message: "Todo not found" });
    }
    res.json(todo);
  });
  
  app.delete("/api/todos/:id", async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Unauthorized" });
    const id = parseInt(req.params.id);
    const success = await storage.deleteTodo(id);
    if (!success) {
      return res.status(404).json({ message: "Todo not found" });
    }
    res.sendStatus(204);
  });
  
  // Events
  app.get("/api/events", async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Unauthorized" });
    const events = await storage.getEvents();
    res.json(events);
  });
  
  // Messages
  app.get("/api/messages", async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Unauthorized" });
    const user = req.user as Express.User;
    const messages = await storage.getMessages(user.id);
    res.json(messages);
  });
  
  app.post("/api/messages", async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Unauthorized" });
    const user = req.user as Express.User;
    
    try {
      const message = await storage.createMessage({
        ...req.body,
        senderId: user.id,
        timestamp: new Date()
      });
      res.status(201).json(message);
    } catch (err) {
      res.status(400).json({ message: "Invalid message data" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
