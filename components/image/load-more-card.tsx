import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import React from "react";

interface LoadMoreCardProps {
  onClick: () => void;
  isFetchingNextPage: boolean;
}

export const LoadMoreCard: React.FC<LoadMoreCardProps> = ({
  onClick,
  isFetchingNextPage,
}) => {
  return (
    <Card className="flex h-[160px] w-[200px] flex-col items-center justify-center md:h-[180px] md:w-[240px] lg:h-[200px] lg:w-[280px]">
      <CardContent className="flex flex-col items-center justify-center p-6">
        <Button
          onClick={onClick}
          disabled={isFetchingNextPage}
          variant="outline"
          size="lg"
        >
          {isFetchingNextPage ? (
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          ) : null}
          {isFetchingNextPage ? "Loading..." : "Load More"}
        </Button>
      </CardContent>
    </Card>
  );
};
