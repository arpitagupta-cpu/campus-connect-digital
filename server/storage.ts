import { 
  User, InsertUser, Assignment, InsertAssignment, Resource, InsertResource,
  Notice, InsertNotice, Schedule, InsertSchedule, Todo, InsertTodo,
  Event, InsertEvent, Message, InsertMessage, Submission, InsertSubmission,
  users, assignments, submissions, resources, notices, schedule, 
  todos, events, messages
} from "@shared/schema";
import { createId } from '@paralleldrive/cuid2';
import session from "express-session";
import createMemoryStore from "memorystore";
import connectPg from "connect-pg-simple";
import { db, pool } from "./db";
import { eq, and, desc, or } from "drizzle-orm";

const MemoryStore = createMemoryStore(session);
const PostgresSessionStore = connectPg(session);

// Storage interface
export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Assignment methods
  getAssignments(): Promise<Assignment[]>;
  getAssignmentById(id: number): Promise<Assignment | undefined>;
  createAssignment(assignment: InsertAssignment): Promise<Assignment>;
  updateAssignment(id: number, assignment: Partial<Assignment>): Promise<Assignment | undefined>;
  deleteAssignment(id: number): Promise<boolean>;
  
  // Submission methods
  getSubmissions(assignmentId?: number, studentId?: number): Promise<Submission[]>;
  createSubmission(submission: InsertSubmission): Promise<Submission>;
  
  // Resource methods
  getResources(category?: string): Promise<Resource[]>;
  getResourceById(id: number): Promise<Resource | undefined>;
  createResource(resource: InsertResource): Promise<Resource>;
  deleteResource(id: number): Promise<boolean>;
  
  // Notice methods
  getNotices(): Promise<Notice[]>;
  getNoticeById(id: number): Promise<Notice | undefined>;
  createNotice(notice: InsertNotice): Promise<Notice>;
  
  // Schedule methods
  getSchedule(day?: string): Promise<Schedule[]>;
  createScheduleItem(scheduleItem: InsertSchedule): Promise<Schedule>;
  updateScheduleItem(id: number, scheduleItem: Partial<Schedule>): Promise<Schedule | undefined>;
  
  // Todo methods
  getTodos(userId: number): Promise<Todo[]>;
  createTodo(todo: InsertTodo): Promise<Todo>;
  updateTodo(id: number, completed: boolean): Promise<Todo | undefined>;
  deleteTodo(id: number): Promise<boolean>;
  
  // Event methods
  getEvents(): Promise<Event[]>;
  createEvent(event: InsertEvent): Promise<Event>;
  
  // Message methods
  getMessages(userId: number): Promise<Message[]>;
  createMessage(message: InsertMessage): Promise<Message>;
  markAsRead(id: number): Promise<Message | undefined>;
  
  // Session store
  sessionStore: any; // Using any to avoid type issues with session.SessionStore
}

export class DatabaseStorage implements IStorage {
  sessionStore: any; // Using any to avoid type issues

  constructor() {
    this.sessionStore = new PostgresSessionStore({ 
      pool, 
      createTableIfMissing: true 
    });
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  // Assignment methods
  async getAssignments(): Promise<Assignment[]> {
    return await db.select().from(assignments).orderBy(desc(assignments.postedDate));
  }

  async getAssignmentById(id: number): Promise<Assignment | undefined> {
    const [assignment] = await db.select().from(assignments).where(eq(assignments.id, id));
    return assignment;
  }

  async createAssignment(assignment: InsertAssignment): Promise<Assignment> {
    const [newAssignment] = await db.insert(assignments).values(assignment).returning();
    return newAssignment;
  }

  async updateAssignment(id: number, assignment: Partial<Assignment>): Promise<Assignment | undefined> {
    const [updatedAssignment] = await db
      .update(assignments)
      .set(assignment)
      .where(eq(assignments.id, id))
      .returning();
    return updatedAssignment;
  }

  async deleteAssignment(id: number): Promise<boolean> {
    const result = await db.delete(assignments).where(eq(assignments.id, id)).returning();
    return result.length > 0;
  }

  // Submission methods
  async getSubmissions(assignmentId?: number, studentId?: number): Promise<Submission[]> {
    if (assignmentId && studentId) {
      return await db
        .select()
        .from(submissions)
        .where(
          and(
            eq(submissions.assignmentId, assignmentId),
            eq(submissions.studentId, studentId)
          )
        );
    } else if (assignmentId) {
      return await db
        .select()
        .from(submissions)
        .where(eq(submissions.assignmentId, assignmentId));
    } else if (studentId) {
      return await db
        .select()
        .from(submissions)
        .where(eq(submissions.studentId, studentId));
    } else {
      return await db.select().from(submissions);
    }
  }

  async createSubmission(submission: InsertSubmission): Promise<Submission> {
    const [newSubmission] = await db.insert(submissions).values(submission).returning();
    return newSubmission;
  }

  // Resource methods
  async getResources(category?: string): Promise<Resource[]> {
    if (category) {
      return await db
        .select()
        .from(resources)
        .where(eq(resources.category, category))
        .orderBy(desc(resources.uploadDate));
    } else {
      return await db.select().from(resources).orderBy(desc(resources.uploadDate));
    }
  }

  async getResourceById(id: number): Promise<Resource | undefined> {
    const [resource] = await db.select().from(resources).where(eq(resources.id, id));
    return resource;
  }

  async createResource(resource: InsertResource): Promise<Resource> {
    const [newResource] = await db.insert(resources).values(resource).returning();
    return newResource;
  }

  async deleteResource(id: number): Promise<boolean> {
    const result = await db.delete(resources).where(eq(resources.id, id)).returning();
    return result.length > 0;
  }

  // Notice methods
  async getNotices(): Promise<Notice[]> {
    return await db.select().from(notices).orderBy(desc(notices.postedDate));
  }

  async getNoticeById(id: number): Promise<Notice | undefined> {
    const [notice] = await db.select().from(notices).where(eq(notices.id, id));
    return notice;
  }

  async createNotice(notice: InsertNotice): Promise<Notice> {
    const [newNotice] = await db.insert(notices).values(notice).returning();
    return newNotice;
  }

  // Schedule methods
  async getSchedule(day?: string): Promise<Schedule[]> {
    if (day) {
      return await db
        .select()
        .from(schedule)
        .where(eq(schedule.day, day))
        .orderBy(schedule.startTime);
    } else {
      return await db.select().from(schedule).orderBy(schedule.day, schedule.startTime);
    }
  }

  async createScheduleItem(scheduleItem: InsertSchedule): Promise<Schedule> {
    const [newScheduleItem] = await db.insert(schedule).values(scheduleItem).returning();
    return newScheduleItem;
  }

  async updateScheduleItem(id: number, scheduleItem: Partial<Schedule>): Promise<Schedule | undefined> {
    const [updatedScheduleItem] = await db
      .update(schedule)
      .set(scheduleItem)
      .where(eq(schedule.id, id))
      .returning();
    return updatedScheduleItem;
  }

  // Todo methods
  async getTodos(userId: number): Promise<Todo[]> {
    return await db
      .select()
      .from(todos)
      .where(eq(todos.userId, userId))
      .orderBy(todos.createdAt);
  }

  async createTodo(todo: InsertTodo): Promise<Todo> {
    const [newTodo] = await db.insert(todos).values(todo).returning();
    return newTodo;
  }

  async updateTodo(id: number, completed: boolean): Promise<Todo | undefined> {
    const [updatedTodo] = await db
      .update(todos)
      .set({ completed })
      .where(eq(todos.id, id))
      .returning();
    return updatedTodo;
  }

  async deleteTodo(id: number): Promise<boolean> {
    const result = await db.delete(todos).where(eq(todos.id, id)).returning();
    return result.length > 0;
  }

  // Event methods
  async getEvents(): Promise<Event[]> {
    return await db.select().from(events).orderBy(events.date);
  }

  async createEvent(event: InsertEvent): Promise<Event> {
    const [newEvent] = await db.insert(events).values(event).returning();
    return newEvent;
  }

  // Message methods
  async getMessages(userId: number): Promise<Message[]> {
    return await db
      .select()
      .from(messages)
      .where(
        or(
          eq(messages.senderId, userId),
          eq(messages.receiverId, userId)
        )
      )
      .orderBy(messages.timestamp);
  }

  async createMessage(message: InsertMessage): Promise<Message> {
    const [newMessage] = await db.insert(messages).values(message).returning();
    return newMessage;
  }

  async markAsRead(id: number): Promise<Message | undefined> {
    const [updatedMessage] = await db
      .update(messages)
      .set({ read: true })
      .where(eq(messages.id, id))
      .returning();
    return updatedMessage;
  }
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private assignments: Map<number, Assignment>;
  private submissions: Map<number, Submission>;
  private resources: Map<number, Resource>;
  private notices: Map<number, Notice>;
  private schedules: Map<number, Schedule>;
  private todos: Map<number, Todo>;
  private events: Map<number, Event>;
  private messages: Map<number, Message>;
  
  sessionStore: any; // Using any to avoid type issues
  
  private userIdCounter: number = 1;
  private assignmentIdCounter: number = 1;
  private submissionIdCounter: number = 1;
  private resourceIdCounter: number = 1;
  private noticeIdCounter: number = 1;
  private scheduleIdCounter: number = 1;
  private todoIdCounter: number = 1;
  private eventIdCounter: number = 1;
  private messageIdCounter: number = 1;
  
  constructor() {
    this.users = new Map();
    this.assignments = new Map();
    this.submissions = new Map();
    this.resources = new Map();
    this.notices = new Map();
    this.schedules = new Map();
    this.todos = new Map();
    this.events = new Map();
    this.messages = new Map();
    
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000 // prune expired entries every 24h
    });
    
    // Seed initial data
    this.seedData();
  }
  
  private seedData() {
    // Seed some initial data for demonstration purposes
    const today = new Date();
    
    // Seed assignments
    this.createAssignment({
      title: "Database Normalization Exercise",
      course: "Database Systems",
      courseCode: "CSE-301",
      dueDate: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 7),
      status: "pending",
      description: "Complete the database normalization exercises from chapter 4",
      postedDate: new Date(),
      fileUrl: ""
    });
    
    this.createAssignment({
      title: "Network Security Protocol Analysis",
      course: "Network Security",
      courseCode: "CSE-305",
      dueDate: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 10),
      status: "pending",
      description: "Analyze the security protocols discussed in class",
      postedDate: new Date(),
      fileUrl: ""
    });
    
    // Seed resources
    this.createResource({
      title: "Database Systems Concepts Ch.4-6",
      courseCode: "CSE-301",
      category: "Textbooks",
      fileType: "PDF",
      fileSize: "5.2 MB",
      fileUrl: "/resources/db-concepts-ch4-6.pdf",
      uploadDate: new Date()
    });
    
    this.createResource({
      title: "Network Security Lecture Notes Week 8",
      courseCode: "CSE-305",
      category: "Lecture Notes",
      fileType: "DOC",
      fileSize: "1.8 MB",
      fileUrl: "/resources/network-security-week8.doc",
      uploadDate: new Date()
    });
    
    // Seed notices
    this.createNotice({
      title: "Lab Cancelled",
      content: "The Database Systems lab scheduled for Oct 12 has been cancelled.",
      category: "Urgent",
      postedDate: new Date(),
      expiryDate: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 7)
    });
    
    this.createNotice({
      title: "Holiday Announcement",
      content: "The campus will be closed on Oct 24 for the national holiday.",
      category: "General",
      postedDate: new Date(),
      expiryDate: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 15)
    });
    
    // Seed schedule
    this.createScheduleItem({
      day: "Thursday",
      startTime: "10:00",
      endTime: "11:30",
      course: "Database Systems",
      courseCode: "CSE-301",
      room: "Lab 3",
      building: "Block B",
      type: "Lab",
      status: "Cancelled"
    });
    
    this.createScheduleItem({
      day: "Thursday",
      startTime: "13:00",
      endTime: "14:30",
      course: "Network Security",
      courseCode: "CSE-305",
      room: "Room 204",
      building: "Block A",
      type: "Lecture",
      status: "Active"
    });
    
    // Seed events
    this.createEvent({
      title: "Database Assignment Due",
      date: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 7),
      category: "Assignment",
      description: "Database Normalization Exercise due"
    });
    
    this.createEvent({
      title: "Database Systems Exam",
      date: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 9),
      category: "Exam",
      description: "Midterm exam covering chapters 1-6"
    });
  }
  
  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }
  
  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username
    );
  }
  
  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
  
  // Assignment methods
  async getAssignments(): Promise<Assignment[]> {
    return Array.from(this.assignments.values());
  }
  
  async getAssignmentById(id: number): Promise<Assignment | undefined> {
    return this.assignments.get(id);
  }
  
  async createAssignment(assignment: InsertAssignment): Promise<Assignment> {
    const id = this.assignmentIdCounter++;
    const newAssignment: Assignment = { ...assignment, id };
    this.assignments.set(id, newAssignment);
    return newAssignment;
  }
  
  async updateAssignment(id: number, assignment: Partial<Assignment>): Promise<Assignment | undefined> {
    const existingAssignment = this.assignments.get(id);
    if (!existingAssignment) {
      return undefined;
    }
    
    const updatedAssignment = { ...existingAssignment, ...assignment };
    this.assignments.set(id, updatedAssignment);
    return updatedAssignment;
  }
  
  async deleteAssignment(id: number): Promise<boolean> {
    return this.assignments.delete(id);
  }
  
  // Submission methods
  async getSubmissions(assignmentId?: number, studentId?: number): Promise<Submission[]> {
    let submissions = Array.from(this.submissions.values());
    
    if (assignmentId !== undefined) {
      submissions = submissions.filter(s => s.assignmentId === assignmentId);
    }
    
    if (studentId !== undefined) {
      submissions = submissions.filter(s => s.studentId === studentId);
    }
    
    return submissions;
  }
  
  async createSubmission(submission: InsertSubmission): Promise<Submission> {
    const id = this.submissionIdCounter++;
    const newSubmission: Submission = { ...submission, id };
    this.submissions.set(id, newSubmission);
    return newSubmission;
  }
  
  // Resource methods
  async getResources(category?: string): Promise<Resource[]> {
    let resources = Array.from(this.resources.values());
    
    if (category) {
      resources = resources.filter(r => r.category === category);
    }
    
    return resources;
  }
  
  async getResourceById(id: number): Promise<Resource | undefined> {
    return this.resources.get(id);
  }
  
  async createResource(resource: InsertResource): Promise<Resource> {
    const id = this.resourceIdCounter++;
    const newResource: Resource = { ...resource, id };
    this.resources.set(id, newResource);
    return newResource;
  }
  
  async deleteResource(id: number): Promise<boolean> {
    return this.resources.delete(id);
  }
  
  // Notice methods
  async getNotices(): Promise<Notice[]> {
    return Array.from(this.notices.values());
  }
  
  async getNoticeById(id: number): Promise<Notice | undefined> {
    return this.notices.get(id);
  }
  
  async createNotice(notice: InsertNotice): Promise<Notice> {
    const id = this.noticeIdCounter++;
    const newNotice: Notice = { ...notice, id };
    this.notices.set(id, newNotice);
    return newNotice;
  }
  
  // Schedule methods
  async getSchedule(day?: string): Promise<Schedule[]> {
    let schedules = Array.from(this.schedules.values());
    
    if (day) {
      schedules = schedules.filter(s => s.day === day);
    }
    
    return schedules;
  }
  
  async createScheduleItem(scheduleItem: InsertSchedule): Promise<Schedule> {
    const id = this.scheduleIdCounter++;
    const newScheduleItem: Schedule = { ...scheduleItem, id };
    this.schedules.set(id, newScheduleItem);
    return newScheduleItem;
  }
  
  async updateScheduleItem(id: number, scheduleItem: Partial<Schedule>): Promise<Schedule | undefined> {
    const existingItem = this.schedules.get(id);
    if (!existingItem) {
      return undefined;
    }
    
    const updatedItem = { ...existingItem, ...scheduleItem };
    this.schedules.set(id, updatedItem);
    return updatedItem;
  }
  
  // Todo methods
  async getTodos(userId: number): Promise<Todo[]> {
    return Array.from(this.todos.values()).filter(t => t.userId === userId);
  }
  
  async createTodo(todo: InsertTodo): Promise<Todo> {
    const id = this.todoIdCounter++;
    const newTodo: Todo = { ...todo, id };
    this.todos.set(id, newTodo);
    return newTodo;
  }
  
  async updateTodo(id: number, completed: boolean): Promise<Todo | undefined> {
    const existingTodo = this.todos.get(id);
    if (!existingTodo) {
      return undefined;
    }
    
    const updatedTodo = { ...existingTodo, completed };
    this.todos.set(id, updatedTodo);
    return updatedTodo;
  }
  
  async deleteTodo(id: number): Promise<boolean> {
    return this.todos.delete(id);
  }
  
  // Event methods
  async getEvents(): Promise<Event[]> {
    return Array.from(this.events.values());
  }
  
  async createEvent(event: InsertEvent): Promise<Event> {
    const id = this.eventIdCounter++;
    const newEvent: Event = { ...event, id };
    this.events.set(id, newEvent);
    return newEvent;
  }
  
  // Message methods
  async getMessages(userId: number): Promise<Message[]> {
    return Array.from(this.messages.values()).filter(
      m => m.senderId === userId || m.receiverId === userId
    );
  }
  
  async createMessage(message: InsertMessage): Promise<Message> {
    const id = this.messageIdCounter++;
    const newMessage: Message = { ...message, id };
    this.messages.set(id, newMessage);
    return newMessage;
  }
  
  async markAsRead(id: number): Promise<Message | undefined> {
    const existingMessage = this.messages.get(id);
    if (!existingMessage) {
      return undefined;
    }
    
    const updatedMessage = { ...existingMessage, read: true };
    this.messages.set(id, updatedMessage);
    return updatedMessage;
  }
}

export const storage = new DatabaseStorage();
