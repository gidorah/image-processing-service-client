"use client";

import { useQuery } from "@tanstack/react-query";
import { SourceImageType } from "@/lib/types";
import Image from "next/image";
import { getSourceImageDetails } from "@/lib/api";
import React from "react";
import TransformationForm from "@/components/image/transformation-form";
import { TransformationsSection } from "@/components/image";
import { queryKeys } from "@/lib/query-keys";

export default function ImageDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = React.use(params);
  const imageId = Number(id);

  const {
    data: image,
    isLoading,
    isError,
    error,
  } = useQuery<SourceImageType>({
    queryKey: queryKeys.image(imageId),
    queryFn: () => getSourceImageDetails(imageId),
    enabled: imageId >= 0 && !isNaN(imageId),
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error: {error.message}</div>;
  }

  if (!image) {
    return <div>Image not found.</div>;
  }

  return (
    <div>
      <div className="flex items-center justify-center gap-12 rounded-lg bg-gray-100 p-4 dark:bg-gray-800">
        <Image
          src={image.file}
          alt={image.fileName || "Uploaded image"}
          width={500}
          height={500}
          className="max-h-[70vh] rounded-lg object-contain"
        />
        <TransformationForm imageId={imageId} />
      </div>
      <TransformationsSection imageId={imageId} />
    </div>
  );
}
