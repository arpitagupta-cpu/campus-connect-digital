import { pgTable, text, serial, integer, boolean, date, timestamp } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User schema for both students and admins
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  fullName: text("full_name").notNull(),
  userType: text("user_type").notNull(), // 'student' or 'admin'
  // Student specific fields
  studentId: text("student_id"),
  section: text("section"),
  department: text("department"),
  year: integer("year"),
  semester: text("semester"),
  cgpa: text("cgpa"),
});

// Relations will be defined after all tables have been declared

// Assignments
export const assignments = pgTable("assignments", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  course: text("course").notNull(),
  courseCode: text("course_code").notNull(),
  dueDate: date("due_date").notNull(),
  status: text("status").notNull(), // 'pending', 'submitted', 'late', 'graded'
  description: text("description"),
  postedDate: date("posted_date").notNull(),
  fileUrl: text("file_url"),
});

// Student assignment submissions
export const submissions = pgTable("submissions", {
  id: serial("id").primaryKey(),
  assignmentId: integer("assignment_id").notNull(),
  studentId: integer("student_id").notNull(),
  submissionDate: date("submission_date"),
  status: text("status").notNull(), // 'submitted', 'late', 'graded'
  grade: text("grade"),
  feedback: text("feedback"),
});

// Resources
export const resources = pgTable("resources", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  courseCode: text("course_code"),
  category: text("category").notNull(), // 'Lecture Notes', 'Textbooks', 'Reference Materials', etc.
  fileType: text("file_type").notNull(), // 'PDF', 'DOC', 'XLS', 'URL', etc.
  fileSize: text("file_size"),
  fileUrl: text("file_url").notNull(),
  uploadDate: date("upload_date").notNull(),
});

// Notices
export const notices = pgTable("notices", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  category: text("category").notNull(), // 'General', 'Exam', 'Holiday', 'Urgent', etc.
  postedDate: timestamp("posted_date").notNull(),
  expiryDate: timestamp("expiry_date"),
});

// Class Schedule / Timetable
export const schedule = pgTable("schedule", {
  id: serial("id").primaryKey(),
  day: text("day").notNull(), // 'Monday', 'Tuesday', etc.
  startTime: text("start_time").notNull(),
  endTime: text("end_time").notNull(),
  course: text("course").notNull(),
  courseCode: text("course_code").notNull(),
  room: text("room"),
  building: text("building"),
  type: text("type").notNull(), // 'Lecture', 'Lab', 'Tutorial', etc.
  status: text("status").notNull(), // 'Active', 'Cancelled', etc.
});

// To-do items
export const todos = pgTable("todos", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  text: text("text").notNull(),
  completed: boolean("completed").notNull().default(false),
  createdAt: timestamp("created_at").notNull(),
});

// Calendar events
export const events = pgTable("events", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  date: date("date").notNull(),
  category: text("category").notNull(), // 'Assignment', 'Exam', 'Holiday', etc.
  description: text("description"),
});

// Chat messages
export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  senderId: integer("sender_id").notNull(),
  receiverId: integer("receiver_id"),
  content: text("content").notNull(),
  timestamp: timestamp("timestamp").notNull(),
  read: boolean("read").notNull().default(false),
});

// Define all relations
export const usersRelations = relations(users, ({ many }) => ({
  submissions: many(submissions),
  todos: many(todos),
  sentMessages: many(messages, { relationName: "sender" }),
  receivedMessages: many(messages, { relationName: "receiver" }),
}));

export const assignmentsRelations = relations(assignments, ({ many }) => ({
  submissions: many(submissions),
}));

export const submissionsRelations = relations(submissions, ({ one }) => ({
  assignment: one(assignments, {
    fields: [submissions.assignmentId],
    references: [assignments.id],
  }),
  student: one(users, {
    fields: [submissions.studentId],
    references: [users.id],
  }),
}));

export const todosRelations = relations(todos, ({ one }) => ({
  user: one(users, {
    fields: [todos.userId],
    references: [users.id],
  }),
}));

export const messagesRelations = relations(messages, ({ one }) => ({
  sender: one(users, {
    fields: [messages.senderId],
    references: [users.id],
    relationName: "sender",
  }),
  receiver: one(users, {
    fields: [messages.receiverId],
    references: [users.id],
    relationName: "receiver",
  }),
}));

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({ id: true });
export const insertAssignmentSchema = createInsertSchema(assignments).omit({ id: true });
export const insertSubmissionSchema = createInsertSchema(submissions).omit({ id: true });
export const insertResourceSchema = createInsertSchema(resources).omit({ id: true });
export const insertNoticeSchema = createInsertSchema(notices).omit({ id: true });
export const insertScheduleSchema = createInsertSchema(schedule).omit({ id: true });
export const insertTodoSchema = createInsertSchema(todos).omit({ id: true });
export const insertEventSchema = createInsertSchema(events).omit({ id: true });
export const insertMessageSchema = createInsertSchema(messages).omit({ id: true });

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Assignment = typeof assignments.$inferSelect;
export type InsertAssignment = z.infer<typeof insertAssignmentSchema>;

export type Submission = typeof submissions.$inferSelect;
export type InsertSubmission = z.infer<typeof insertSubmissionSchema>;

export type Resource = typeof resources.$inferSelect;
export type InsertResource = z.infer<typeof insertResourceSchema>;

export type Notice = typeof notices.$inferSelect;
export type InsertNotice = z.infer<typeof insertNoticeSchema>;

export type Schedule = typeof schedule.$inferSelect;
export type InsertSchedule = z.infer<typeof insertScheduleSchema>;

export type Todo = typeof todos.$inferSelect;
export type InsertTodo = z.infer<typeof insertTodoSchema>;

export type Event = typeof events.$inferSelect;
export type InsertEvent = z.infer<typeof insertEventSchema>;

export type Message = typeof messages.$inferSelect;
export type InsertMessage = z.infer<typeof insertMessageSchema>;
