import { Card } from "@/components/card";
import { Skeleton } from "@/components/skeleton";

function CardSkeleton() {
  return (
    <Card className="rounded-lg flex flex-col justify-between space-y-3 h-32 col-span-12 sm:col-span-6">
      <Skeleton className="w-full h-12" />
    </Card>
  );
}

export default function Loading() {
  return (
    <div className="grid grid-cols-12 gap-5 mt-10">
      {Array.from({ length: 12 }, (_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  );
}
