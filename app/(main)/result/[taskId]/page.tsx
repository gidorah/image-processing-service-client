"use client";

import React from "react";

export default function ResultPage({
  params,
}: {
  params: Promise<{ taskId: string }>;
}) {
  const { taskId } = React.use(params);

  return (
    <div className="container mx-auto p-4">
      <h1 className="mb-4 text-2xl font-bold">Transformation Result</h1>
      <p>Task ID: {taskId}</p>
      <p>This page will display the transformation result.</p>
    </div>
  );
}
