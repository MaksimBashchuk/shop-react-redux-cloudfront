import React from "react";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import axios from "axios";

type CSVFileImportProps = {
  url: string;
  title: string;
};

export default function CSVFileImport({ url, title }: CSVFileImportProps) {
  const [file, setFile] = React.useState<File | null>(null);

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      setFile(file);
    }
  };

  const removeFile = () => {
    setFile(null);
  };

  const uploadFile = async () => {
    console.log("uploadFile to", url);

    // Get the presigned URL
    const {
      data: { url: postUrl, fields },
    } = await axios({
      method: "GET",
      url,
      params: {
        name: encodeURIComponent(file ? file.name : ""),
      },
    });

    console.log("File: ", file);
    console.log("File to upload: ", file?.name);
    console.log("Uploading to: ", postUrl);

    const formData = new FormData();

    Object.entries(fields).map(([key, value]) => {
      formData.append(key, value as string);
    });

    if (file) {
      formData.append("file", file);
    }

    const result = await axios.post(postUrl, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    console.log("Result: ", result);
    setFile(null);
  };
  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        {title}
      </Typography>
      {!file ? (
        <input type="file" onChange={onFileChange} />
      ) : (
        <div>
          <button onClick={removeFile}>Remove file</button>
          <button onClick={uploadFile}>Upload file</button>
        </div>
      )}
    </Box>
  );
}
