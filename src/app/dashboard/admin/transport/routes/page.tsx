
import { PageHeader } from "../../../components/page-header";
import { RoutesClient } from "./routes-client";
import { transportRoutes, vehicles, teacherDirectory } from "@/lib/mock-data";

export default function RoutesPage() {
  return (
    <>
      <PageHeader
        title="Routes & Stops"
        description="Manage all transportation routes and their stops."
      />
      <RoutesClient 
        initialRoutes={transportRoutes}
        allVehicles={vehicles}
        allDrivers={teacherDirectory} // Assuming drivers are staff/teachers
      />
    </>
  );
}
