
import { PageHeader } from "../../../components/page-header";
import { VehiclesClient } from "./vehicles-client";
import { vehicles, teacherDirectory, transportRoutes } from "@/lib/mock-data";

export default function VehiclesPage() {
  return (
    <>
      <PageHeader
        title="Vehicle Management"
        description="Oversee the school's fleet of vehicles."
      />
      <VehiclesClient 
        initialVehicles={vehicles}
        allDrivers={teacherDirectory.filter(t => t.department === 'Transport')}
        allRoutes={transportRoutes}
      />
    </>
  );
}
