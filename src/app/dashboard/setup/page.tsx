
import { PageHeader } from "../components/page-header";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { AcademicYearClient } from "./academic-year-client";
import { ClassesClient } from "./classes-client";
import { SubjectsClient } from "./subjects-client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

export default function SetupPage() {
  return (
    <>
      <PageHeader
        title="School Setup"
        description="You can manage academic years, classes, subjects, and timetables."
      />
      <Tabs defaultValue="academic-year">
        <TabsList className="grid w-full max-w-md grid-cols-2 md:grid-cols-4">
          <TabsTrigger value="academic-year">Academic Year</TabsTrigger>
          <TabsTrigger value="classes">Classes</TabsTrigger>
          <TabsTrigger value="subjects">Subjects</TabsTrigger>
          <TabsTrigger value="timetable">Timetable</TabsTrigger>
        </TabsList>
        <TabsContent value="academic-year">
          <AcademicYearClient />
        </TabsContent>
        <TabsContent value="classes">
           <ClassesClient />
        </TabsContent>
        <TabsContent value="subjects">
           <SubjectsClient />
        </TabsContent>
        <TabsContent value="timetable">
          <Card className="glassmorphic mt-4">
            <CardHeader>
               <div className="flex flex-col sm:flex-row items-start sm:items-center sm:justify-between gap-4">
                <div>
                  <CardTitle>Class Timetables</CardTitle>
                  <CardDescription>
                    You can create and manage class schedules.
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
