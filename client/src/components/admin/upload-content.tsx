import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Upload, FileUp } from "lucide-react";

export function UploadContent() {
  const { toast } = useToast();
  const [contentType, setContentType] = useState("assignment");
  const [title, setTitle] = useState("");
  const [section, setSection] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [dueDate, setDueDate] = useState("");

  const uploadMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const endpoint = `/api/${contentType}s`;
      const res = await apiRequest("POST", endpoint, Object.fromEntries(formData));
      return res.json();
    },
    onSuccess: () => {
      // Reset form
      setTitle("");
      setSection("");
      setDescription("");
      setFile(null);
      setDueDate("");
      
      // Refresh relevant data
      queryClient.invalidateQueries({ queryKey: [`/api/${contentType}s`] });
      
      toast({
        title: "Content uploaded",
        description: `Your ${contentType} has been uploaded successfully.`,
      });
    },
    onError: (error) => {
      toast({
        title: "Upload failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title) {
      toast({
        title: "Missing information",
        description: "Please enter a title for the content.",
        variant: "destructive",
      });
      return;
    }
    
    const formData = new FormData();
    formData.append("title", title);
    formData.append("section", section);
    
    if (contentType === "assignment") {
      if (!dueDate) {
        toast({
          title: "Missing information",
          description: "Please specify a due date for the assignment.",
          variant: "destructive",
        });
        return;
      }
      formData.append("dueDate", dueDate);
      formData.append("course", "Course Name"); // This would typically come from a field
      formData.append("courseCode", section); // Using section as courseCode for simplicity
      formData.append("status", "pending");
      formData.append("description", description);
      formData.append("postedDate", new Date().toISOString());
    } else if (contentType === "resource") {
      formData.append("category", "Lecture Notes"); // This would typically be selectable
      formData.append("courseCode", section);
      formData.append("fileType", file ? file.name.split('.').pop()?.toUpperCase() || "PDF" : "PDF");
      formData.append("fileSize", file ? `${(file.size / (1024 * 1024)).toFixed(1)} MB` : "0 MB");
      formData.append("uploadDate", new Date().toISOString());
      formData.append("fileUrl", "/path/to/file"); // This would normally be set after actual file upload
    } else if (contentType === "notice") {
      formData.append("content", description);
      formData.append("category", "General"); // This would typically be selectable
      formData.append("postedDate", new Date().toISOString());
    }
    
    if (file) {
      formData.append("file", file);
    }
    
    uploadMutation.mutate(formData);
  };

  return (
    <Card>
      <CardHeader className="border-b p-6">
        <CardTitle>Upload Content</CardTitle>
      </CardHeader>
      
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="content-type">Content Type</Label>
            <Select
              value={contentType}
              onValueChange={setContentType}
            >
              <SelectTrigger id="content-type">
                <SelectValue placeholder="Select content type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="assignment">Assignment</SelectItem>
                <SelectItem value="notice">Notice</SelectItem>
                <SelectItem value="resource">Resource</SelectItem>
                <SelectItem value="result">Result</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              placeholder="Enter content title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="section">Target Section</Label>
            <Select
              value={section}
              onValueChange={setSection}
            >
              <SelectTrigger id="section">
                <SelectValue placeholder="Select target section" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All Sections">All Sections</SelectItem>
                <SelectItem value="CSE-301">CSE-301</SelectItem>
                <SelectItem value="CSE-305">CSE-305</SelectItem>
                <SelectItem value="CSE-401">CSE-401</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {contentType === "assignment" && (
            <div>
              <Label htmlFor="due-date">Due Date</Label>
              <Input
                id="due-date"
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
            </div>
          )}
          
          {(contentType === "assignment" || contentType === "notice") && (
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder={`Enter ${contentType} details...`}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
              />
            </div>
          )}
          
          <div>
            <Label htmlFor="file">Upload File (optional)</Label>
            <div className="border border-dashed border-input rounded-lg p-8 text-center">
              <div className="flex flex-col items-center">
                <Upload className="h-10 w-10 text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground mb-2">
                  {file ? `Selected: ${file.name}` : "Drag and drop files here, or"}
                </p>
                <div className="relative">
                  <Input
                    id="file"
                    type="file"
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    onChange={handleFileChange}
                  />
                  <Button type="button" className="relative">
                    Browse Files
                  </Button>
                </div>
              </div>
            </div>
          </div>
          
          <Button
            type="submit"
            className="w-full"
            disabled={uploadMutation.isPending}
          >
            {uploadMutation.isPending ? (
              <div className="flex items-center">
                <FileUp className="mr-2 h-4 w-4 animate-bounce" />
                <span>Uploading...</span>
              </div>
            ) : (
              "Upload Content"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
