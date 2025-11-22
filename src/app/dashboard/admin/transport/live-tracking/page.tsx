
import { PageHeader } from "../../../components/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function LiveTrackingPage() {
  return (
    <>
      <PageHeader
        title="Live Tracking & GPS"
        description="Monitor all vehicles in real-time on the map."
      />
      <Card className="glassmorphic">
        <CardHeader>
          <CardTitle>Live Vehicle Map</CardTitle>
          <CardDescription>
            This is a placeholder for the live tracking map. In a real application, this would be an interactive map showing the current location of all active vehicles.
          </CardDescription>
        </CardHeader>
        <CardContent>
            <div className="relative w-full h-[600px] bg-muted rounded-lg overflow-hidden border">
                <video
                    src="https://videos.pexels.com/video-files/3209828/3209828-hd_1920_1080_25fps.mp4"
                    autoPlay
                    loop
                    muted
                    className="absolute inset-0 w-full h-full object-cover"
                />
                 <div className="absolute inset-0 bg-black/50"></div>
                 <p className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white text-2xl font-bold bg-black/50 p-4 rounded-md">
                    Live Map Interface
                 </p>
            </div>
        </CardContent>
      </Card>
    </>
  );
}
