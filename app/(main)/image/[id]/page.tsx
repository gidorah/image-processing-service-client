"use client";

import { useQuery } from "@tanstack/react-query";
import { SourceImageType } from "@/lib/types";
import Image from "next/image";
import { getSourceImageDetails } from "@/lib/api";
import React from "react";

export default function ImageDetailPage({
  params,
}: {
  params: Promise<{ id: number }>;
}) {
  const { id } = React.use(params);
  console.log(id);
  const {
    data: image,
    isLoading,
    isError,
    error,
  } = useQuery<SourceImageType>({
    queryKey: ["image", id],
    queryFn: () => getSourceImageDetails(id),
    enabled: !!id,
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className="flex items-center justify-center rounded-lg bg-gray-100 p-4 dark:bg-gray-800">
      {image && (
        <Image
          src={image.file}
          alt={image.fileName || "Uploaded image"}
          width={500}
          height={500}
          className="max-h-[70vh] rounded-lg object-contain"
        />
      )}
    </div>
  );
}
