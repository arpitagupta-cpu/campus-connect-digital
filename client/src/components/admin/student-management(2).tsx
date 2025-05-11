import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient, getQueryFn } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Loader2, PlusCircle, Check, X } from "lucide-react";

// Type for Student Entry data from API
interface StudentEntry {
  id: number;
  studentId: string;
  section: string | null;
  department: string | null;
  year: number | null;
  semester: string | null;
  assigned: boolean;
  userId: number | null;
}

// Schema for adding a new student ID
const addStudentSchema = z.object({
  studentId: z.string().min(1, "Student ID is required"),
  section: z.string().optional(),
  department: z.string().optional(),
  year: z.coerce.number().optional(),
  semester: z.string().optional()
});

type AddStudentFormValues = z.infer<typeof addStudentSchema>;

export function StudentManagement() {
  const { toast } = useToast();
  const [isAddingStudent, setIsAddingStudent] = useState(false);
  
  // Query to fetch all student entries
  const { data: students, isLoading, isError } = useQuery<StudentEntry[]>({
    queryKey: ["/api/admin/students"],
    queryFn: getQueryFn({ on401: "throw" }),
  });
  
  // Form for adding a new student ID
  const form = useForm<AddStudentFormValues>({
    resolver: zodResolver(addStudentSchema),
    defaultValues: {
      studentId: "",
      section: "",
      department: "",
      year: undefined,
      semester: ""
    }
  });
  
  // Mutation to add a new student ID
  const addStudentMutation = useMutation({
    mutationFn: async (data: AddStudentFormValues) => {
      const res = await apiRequest("POST", "/api/admin/student-ids", data);
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Student ID added successfully",
        variant: "default",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/students"] });
      form.reset();
      setIsAddingStudent(false);
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to add student ID",
        variant: "destructive",
      });
    }
  });
  
  const onSubmit = (data: AddStudentFormValues) => {
    addStudentMutation.mutate(data);
  };
  
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Student ID Management</CardTitle>
          <CardDescription>Manage student IDs for registration</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center py-10">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }
  
  if (isError) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Student ID Management</CardTitle>
          <CardDescription>Manage student IDs for registration</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-destructive">Failed to load student data. Please try again later.</p>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Student ID Management</CardTitle>
          <CardDescription>Manage student IDs for registration</CardDescription>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => setIsAddingStudent(!isAddingStudent)}
        >
          {isAddingStudent ? "Cancel" : (
            <>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Student ID
            </>
          )}
        </Button>
      </CardHeader>
      <CardContent>
        {isAddingStudent && (
          <div className="mb-6 p-4 border rounded-md bg-muted/50">
            <h3 className="text-lg font-medium mb-4">Add New Student ID</h3>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="studentId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Student ID*</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter student ID" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="section"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Section</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. A, B, C" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="department"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Department</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. Computer Science" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="year"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Year</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="e.g. 1, 2, 3, 4" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="semester"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Semester</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. Spring 2023" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="flex justify-end">
                  <Button 
                    type="submit" 
                    disabled={addStudentMutation.isPending}
                  >
                    {addStudentMutation.isPending && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Add Student ID
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        )}
        
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student ID</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Section</TableHead>
                <TableHead>Year & Semester</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {students && students.length > 0 ? (
                students.map((student) => (
                  <TableRow key={student.id}>
                    <TableCell className="font-medium">{student.studentId}</TableCell>
                    <TableCell>{student.department || "-"}</TableCell>
                    <TableCell>{student.section || "-"}</TableCell>
                    <TableCell>
                      {student.year ? `Year ${student.year}` : "-"}
                      {student.semester ? `, ${student.semester}` : ""}
                    </TableCell>
                    <TableCell>
                      {student.assigned ? (
                        <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 flex w-fit items-center">
                          <Check className="h-3 w-3 mr-1" />
                          Assigned
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400 flex w-fit items-center">
                          <X className="h-3 w-3 mr-1" />
                          Unassigned
                        </Badge>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                    No student IDs available. Add some to enable student registration.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}