
import { PageHeader } from "../../components/page-header";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { AcademicYearClient } from "./academic-year-client";
import { ClassesClient } from "./classes-client";
import { SubjectsClient } from "./subjects-client";
import { TimetableClient } from "./timetable-client";

export default function SetupPage() {
  return (
    <>
      <PageHeader
        title="School Setup"
        description="You can manage academic years, classes, subjects, and timetables."
      />
      <Tabs defaultValue="academic-year">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 h-auto mb-4">
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
          <TimetableClient />
        </TabsContent>
      </Tabs>
    </>
  );
}
