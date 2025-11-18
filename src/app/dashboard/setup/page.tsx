import { PageHeader } from "../components/page-header";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export default function SetupPage() {
  return (
    <>
      <PageHeader
        title="School Setup"
        description="Manage academic years, classes, subjects, and timetables."
      />
      <Tabs defaultValue="academic-year">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="academic-year">Academic Year</TabsTrigger>
          <TabsTrigger value="classes">Classes</TabsTrigger>
          <TabsTrigger value="subjects">Subjects</TabsTrigger>
          <TabsTrigger value="timetable">Timetable</TabsTrigger>
        </TabsList>
        <TabsContent value="academic-year">
          <Card className="glassmorphic mt-4">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Academic Years</CardTitle>
                  <CardDescription>
                    Manage academic sessions for your school.
                  </CardDescription>
                </div>
                <Button>
                  <PlusCircle className="mr-2 h-4 w-4" /> Add New Year
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Year</TableHead>
                    <TableHead>Start Date</TableHead>
                    <TableHead>End Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">2024-2025</TableCell>
                    <TableCell>01 Apr 2024</TableCell>
                    <TableCell>31 Mar 2025</TableCell>
                    <TableCell>
                      <Badge>Active</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="outline" size="sm">
                        Edit
                      </Button>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">2023-2024</TableCell>
                    <TableCell>01 Apr 2023</TableCell>
                    <TableCell>31 Mar 2024</TableCell>
                    <TableCell>
                      <Badge variant="secondary">Completed</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="outline" size="sm" disabled>
                        Edit
                      </Button>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="classes">
           <Card className="glassmorphic mt-4">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Classes & Sections</CardTitle>
                  <CardDescription>
                    Manage all classes and their respective sections.
                  </CardDescription>
                </div>
                <Button>
                  <PlusCircle className="mr-2 h-4 w-4" /> Add New Class
                </Button>
              </div>
            </CardHeader>
            <CardContent>
               <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Class Name</TableHead>
                    <TableHead>Sections</TableHead>
                    <TableHead>Class Teacher</TableHead>
                    <TableHead>Total Students</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">Class 10</TableCell>
                    <TableCell>A, B, C</TableCell>
                    <TableCell>Mr.  John Smith</TableCell>
                    <TableCell>120</TableCell>
                    <TableCell className="text-right">
                      <Button variant="outline" size="sm">
                        Manage
                      </Button>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Class 9</TableCell>
                    <TableCell>A, B</TableCell>
                    <TableCell>Ms.  Emily White</TableCell>
                     <TableCell>85</TableCell>
                    <TableCell className="text-right">
                      <Button variant="outline" size="sm">
                        Manage
                      </Button>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="subjects">
           <Card className="glassmorphic mt-4">
            <CardHeader>
               <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Subjects</CardTitle>
                    <CardDescription>
                      Manage subjects offered across different classes.
                    </CardDescription>
                  </div>
                  <Button>
                    <PlusCircle className="mr-2 h-4 w-4" /> Add New Subject
                  </Button>
                </div>
            </CardHeader>
            <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Subject Name</TableHead>
                      <TableHead>Subject Code</TableHead>
                      <TableHead>Type</TableHead>
                       <TableHead>Assigned Classes</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">Mathematics</TableCell>
                      <TableCell>MATH101</TableCell>
                      <TableCell>Core</TableCell>
                      <TableCell>Class 9, Class 10</TableCell>
                      <TableCell className="text-right">
                        <Button variant="outline" size="sm">
                          Edit
                        </Button>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Physics</TableCell>
                      <TableCell>PHY101</TableCell>
                      <TableCell>Core</TableCell>
                      <TableCell>Class 10</TableCell>
                      <TableCell className="text-right">
                        <Button variant="outline" size="sm">
                          Edit
                        </Button>
                      </TableCell>
                    </TableRow>
                     <TableRow>
                      <TableCell className="font-medium">Computer Science</TableCell>
                      <TableCell>CS101</TableCell>
                      <TableCell>Elective</TableCell>
                      <TableCell>Class 9, Class 10</TableCell>
                      <TableCell className="text-right">
                        <Button variant="outline" size="sm">
                          Edit
                        </Button>
                      </TableCell>
                    </TableRow>
                  </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="timetable">
          <Card className="glassmorphic mt-4">
            <CardHeader>
               <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Class Timetables</CardTitle>
                  <CardDescription>
                    Create and manage class schedules.
                  </CardDescription>
                </div>
                <Button>
                  <PlusCircle className="mr-2 h-4 w-4" /> Create Timetable
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-center py-8">
                Timetable management is coming soon.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </>
  );
}
