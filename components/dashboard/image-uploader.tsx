"use client";

import { useCallback } from "react";
import { useDropzone } from "react-dropzone";

export default function ImageUploader() {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    console.log(acceptedFiles);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".png", ".jpg", ".jpeg"],
    },
    maxSize: 10 * 1024 * 1024, // 10MB
    maxFiles: 1,
  });

  return (
    <div
      {...getRootProps()}
      className="flex w-full items-center justify-center"
    >
      <input {...getInputProps()} />
      <div className="flex h-64 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed hover:bg-gray-100 dark:hover:bg-gray-800">
        <div className="flex flex-col items-center justify-center pt-5 pb-6">
          <svg
            className="mb-4 h-8 w-8 text-gray-500 dark:text-gray-400"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 20 16"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
            />
          </svg>
          {isDragActive ? (
            <p className="mb-2 text-sm font-semibold text-gray-500 dark:text-gray-400">
              Drop the files here ...
            </p>
          ) : (
            <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
              <span className="font-semibold">Click to upload</span> or drag and
              drop
            </p>
          )}
          <p className="text-xs text-gray-500 dark:text-gray-400">
            PNG, JPG (MAX. 10MB)
          </p>
        </div>
      </div>
    </div>
  );
}
