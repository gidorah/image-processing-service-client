"use client";

import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { uploadImage } from "@/lib/api";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function ImageUploader() {
  const router = useRouter();

  const { mutate: handleUpload, isPending: isUploading } = useMutation({
    mutationFn: (image: File) => {
      const promise = uploadImage(image);

      toast.promise(promise, {
        loading: "Uploading your image...",
        success: (data) => {
          router.push(`/image/${data.id}`);
          return "Image uploaded successfully! Redirecting...";
        },
        error: "Upload failed. Please try again.",
      });

      return promise;
    },
  });

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        handleUpload(acceptedFiles[0]);
      }
    },
    [handleUpload]
  );

  const { getRootProps, getInputProps, isDragActive, fileRejections } =
    useDropzone({
      onDrop,
      accept: {
        "image/*": [".png", ".jpg", ".jpeg"],
      },
      maxSize: 10 * 1024 * 1024, // 10MB
      maxFiles: 1,
      disabled: isUploading,
    });

  const isFileRejected = fileRejections.length > 0;
  let errorMessage = "";

  const messages = new Set<string>();
  fileRejections.forEach(({ errors }) => {
    errors.forEach((err) => {
      switch (err.code) {
        case "file-too-large":
          messages.add("File size exceeds 10MB.");
          break;
        case "file-invalid-type":
          messages.add("Invalid file type. Please upload a PNG or JPG.");
          break;
        case "too-many-files":
          messages.add("You can only upload one file at a time.");
          break;
        default:
          messages.add(err.message);
      }
    });
  });
  if (messages.size > 0) {
    errorMessage = [...messages].join(", ");
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <div
        {...getRootProps()}
        className={`flex w-full items-center justify-center rounded-lg border-2 border-dashed ${isDragActive ? "border-blue-500" : "border-gray-300"} ${isUploading ? "cursor-not-allowed bg-gray-100" : "cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800"}`}
      >
        <input {...getInputProps()} />
        <div className="flex h-64 w-full flex-col items-center justify-center">
          {isUploading ? (
            <div className="flex flex-col items-center">
              <Loader2 className="h-12 w-12 animate-spin text-blue-500" />
              <p className="mt-4 text-sm font-semibold text-gray-600">
                Uploading...
              </p>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center">
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
                <p className="mb-2 text-sm font-semibold">
                  Drop the file here...
                </p>
              ) : (
                <p className="mb-2 text-sm">
                  <span className="font-semibold">Click to upload</span> or drag
                  and drop
                </p>
              )}
              <p className="text-xs text-gray-500">PNG, JPG up to 10MB</p>
            </div>
          )}
        </div>
      </div>
      {isFileRejected && (
        <div className="w-full rounded-md border border-red-300 bg-red-50 p-3 text-center text-sm text-red-700">
          <p>{errorMessage}</p>
        </div>
      )}
    </div>
  );
}
