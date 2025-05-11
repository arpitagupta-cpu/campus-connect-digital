import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Download, ExternalLink, Search } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Resource } from "@shared/schema";
import { Skeleton } from "@/components/ui/skeleton";

export function ResourcesList() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const { data: resources, isLoading } = useQuery<Resource[]>({
    queryKey: ["/api/resources"],
  });

  const categories = ["All", "Lecture Notes", "Textbooks", "Reference Materials"];

  const filteredResources = resources
    ? resources.filter(
        (resource) =>
          (selectedCategory === "All" || resource.category === selectedCategory) &&
          (searchQuery === "" ||
            resource.title.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : [];

  const getResourceIcon = (fileType: string) => {
    switch (fileType.toUpperCase()) {
      case "PDF":
        return (
          <div className="h-9 w-9 rounded-lg bg-red-100 dark:bg-red-900/30 flex items-center justify-center text-red-500 mr-3">
            <FilePdf className="h-5 w-5" />
          </div>
        );
      case "DOC":
      case "DOCX":
        return (
          <div className="h-9 w-9 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-500 mr-3">
            <FileText className="h-5 w-5" />
          </div>
        );
      case "XLS":
      case "XLSX":
        return (
          <div className="h-9 w-9 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-500 mr-3">
            <FileSpreadsheet className="h-5 w-5" />
          </div>
        );
      case "URL":
        return (
          <div className="h-9 w-9 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-500 mr-3">
            <Link className="h-5 w-5" />
          </div>
        );
      default:
        return (
          <div className="h-9 w-9 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-500 mr-3">
            <File className="h-5 w-5" />
          </div>
        );
    }
  };

  return (
    <Card>
      <CardHeader className="border-b p-6">
        <CardTitle>Resources</CardTitle>
      </CardHeader>
      
      <CardContent className="p-4">
        <div className="mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search resources..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        
        {/* Resource Categories */}
        <div className="mb-4">
          <div className="flex items-center space-x-2 overflow-x-auto pb-2">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className="whitespace-nowrap"
              >
                {category}
              </Button>
            ))}
          </div>
        </div>
        
        {/* Resource List */}
        {isLoading ? (
          <div className="space-y-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex items-center p-3">
                <Skeleton className="h-9 w-9 rounded-lg mr-3" />
                <div className="flex-1 space-y-1">
                  <Skeleton className="h-4 w-[250px]" />
                  <Skeleton className="h-3 w-[180px]" />
                </div>
                <Skeleton className="h-8 w-8 rounded-full" />
              </div>
            ))}
          </div>
        ) : filteredResources.length > 0 ? (
          <div className="space-y-3">
            {filteredResources.map((resource) => (
              <div
                key={resource.id}
                className="flex items-center p-3 rounded-lg hover:bg-muted transition-colors"
              >
                {getResourceIcon(resource.fileType)}
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium truncate">{resource.title}</h4>
                  <p className="text-xs text-muted-foreground">
                    {resource.courseCode || "General"} • {resource.fileType} •{" "}
                    {resource.fileSize}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-muted-foreground hover:text-foreground"
                >
                  {resource.fileType === "URL" ? (
                    <ExternalLink className="h-4 w-4" />
                  ) : (
                    <Download className="h-4 w-4" />
                  )}
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6 text-muted-foreground">
            No resources found. Try adjusting your search.
          </div>
        )}
      </CardContent>
      
      <CardFooter className="p-4 border-t text-center">
        <Button variant="link" className="mx-auto">
          View All Resources
        </Button>
      </CardFooter>
    </Card>
  );
}

function FilePdf(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
      <polyline points="14 2 14 8 20 8" />
      <path d="M9 15h6" />
      <path d="M9 18h6" />
      <path d="M12 11h3" />
      <path d="M9 11h.01" />
    </svg>
  );
}

function FileText(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" x2="8" y1="13" y2="13" />
      <line x1="16" x2="8" y1="17" y2="17" />
      <line x1="10" x2="8" y1="9" y2="9" />
    </svg>
  );
}

function FileSpreadsheet(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
      <polyline points="14 2 14 8 20 8" />
      <path d="M8 13h2" />
      <path d="M8 17h2" />
      <path d="M14 13h2" />
      <path d="M14 17h2" />
    </svg>
  );
}

function Link(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </svg>
  );
}

function File(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
      <polyline points="14 2 14 8 20 8" />
    </svg>
  );
}
