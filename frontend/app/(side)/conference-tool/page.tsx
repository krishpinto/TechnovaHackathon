"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function VideoUploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [transcription, setTranscription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFile(acceptedFiles[0]);
    setError(""); // Reset error when new file is selected
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "video/*": [],
    },
    multiple: false,
  });

  const handleUpload = async () => {
    if (!file) {
      setError("Please upload a video file first!");
      return;
    }

    const formData = new FormData();
    formData.append("video", file);

    setLoading(true);
    setError("");
    try {
      const response = await fetch("http://127.0.0.1:8000/mainservice/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Upload failed");
      }

      const data = await response.json();
      setTranscription(data.transcription || "No transcription available.");
    } catch (err) {
      console.error("Error:", err);
      setError(err instanceof Error ? err.message : "Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle>Video to Text Converter</CardTitle>
        </CardHeader>
        <CardContent>
          <div
            {...getRootProps()}
            className="border-2 border-dashed border-input rounded-lg p-8 mb-4 text-center cursor-pointer"
          >
            <Input {...getInputProps()} />
            {isDragActive ? (
              <p>Drop the video file here ...</p>
            ) : (
              <p>Drag 'n' drop a video file here, or click to select a file</p>
            )}
          </div>
          {file && <p className="mb-4">Selected file: {file.name}</p>}
          <Button onClick={handleUpload} disabled={loading}>
            {loading ? "Processing..." : "Upload and Convert"}
          </Button>
          {error && <div className="text-destructive mt-4">Error: {error}</div>}
          {transcription && (
            <div className="mt-8">
              <h3 className="text-xl font-semibold mb-2">Transcription:</h3>
              <p>{transcription}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
