// "use client";

// import { useSession, signIn, signOut } from "next-auth/react";
// import { useEffect, useState } from "react";
// import axios from "axios";
// import { useRouter } from "next/navigation";
// import { extractTextFromGoogleDoc } from "./utils/extractText";

// export default function HomePage() {
//   const router = useRouter();
//   const { data: session } = useSession();
//   const [files, setFiles] = useState<DriveFile[]>([]);
//   const [selectedFile, setSelectedFile] = useState<DriveFile | null>(null);
//   const [extractedText, setExtractedText] = useState<string>("");

//   const [loadingPage, setLoadingPage] = useState<boolean>(true);

//   const handleExtractText = async () => {
//     if (!selectedFile || !session?.accessToken) return;

//     const { id, mimeType, name } = selectedFile;

//     if (mimeType === "application/vnd.google-apps.document") {
//       const res = await axios.get(
//         `https://docs.googleapis.com/v1/documents/${id}`,
//         {
//           headers: {
//             Authorization: `Bearer ${session.accessToken}`,
//           },
//         }
//       );

//       const text = extractTextFromGoogleDoc(res.data);
//       setExtractedText(text);
//     } else if (mimeType === "application/vnd.google-apps.spreadsheet") {
//       const res = await axios.get(
//         `https://sheets.googleapis.com/v4/spreadsheets/${id}/values/A1:Z1000`,
//         {
//           headers: {
//             Authorization: `Bearer ${session.accessToken}`,
//           },
//         }
//       );

//       const rows = res.data.values || [];
//       const text = rows.map((row: string[]) => row.join(" | ")).join("\n");
//       setExtractedText(text);
//     } else if (mimeType === "application/pdf") {
//       try {
//         // 1. Copy and convert the PDF to a Google Doc
//         const convertRes = await axios.post(
//           `https://www.googleapis.com/drive/v3/files/${id}/copy`,
//           {
//             name: `${name}-converted`,
//             mimeType: "application/vnd.google-apps.document",
//           },
//           {
//             headers: {
//               Authorization: `Bearer ${session.accessToken}`,
//               "Content-Type": "application/json",
//             },
//           }
//         );

//         const convertedDocId = convertRes.data.id;

//         // 2. Wait a second to let the conversion settle (optional but safe)
//         await new Promise((r) => setTimeout(r, 1000));

//         // 3. Fetch the converted doc
//         const docRes = await axios.get(
//           `https://docs.googleapis.com/v1/documents/${convertedDocId}`,
//           {
//             headers: {
//               Authorization: `Bearer ${session.accessToken}`,
//             },
//           }
//         );

//         const text = extractTextFromGoogleDoc(docRes.data);
//         setExtractedText(text);
//       } catch (err) {
//         console.error("PDF conversion error:", err);
//         setExtractedText("Failed to convert and extract PDF.");
//       }
//     } else {
//       setExtractedText("Unsupported file type for extraction.");
//     }
//   };

//   const handleDownload = () => {
//     if (!selectedFile) return;
//     window.open(
//       `https://www.googleapis.com/drive/v3/files/${selectedFile.id}?alt=media&access_token=${session?.accessToken}`,
//       "_blank"
//     );
//   };

//   // Redirect to login page if no session
//   useEffect(() => {
//     if (!session) {
//       router.push("/login");
//     } else {
//       const timeout = setTimeout(() => {
//         setLoadingPage(false);
//       }, 1000);

//       return () => clearTimeout(timeout);
//     }
//   }, [session]);

//   // Fetches files when session is fecthed
//   useEffect(() => {
//     const fetchFiles = async () => {
//       if (!session?.accessToken) return;

//       const res = await axios.get("https://www.googleapis.com/drive/v3/files", {
//         headers: {
//           Authorization: `Bearer ${session.accessToken}`,
//         },
//         params: {
//           fields: "files(id,name,mimeType,webViewLink)",
//         },
//       });
//       setFiles(res.data.files);
//     };

//     fetchFiles();
//   }, [session]);

//   if (loadingPage)
//     return <div className="h-screen w-screen font-bold text-4xl ">Loading</div>;

//   return (
//     <div className="p-4 space-y-4">
//       <div className="flex justify-between items-center">
//         <h1 className="text-xl font-bold">Welcome, {session?.user?.name}</h1>
//         <button
//           onClick={() => signOut()}
//           className="text-sm text-blue-600 underline"
//         >
//           Sign out
//         </button>
//       </div>

//       <select
//         onChange={(e) => {
//           const file = files.find((f) => f.id === e.target.value) || null;
//           setSelectedFile(file);
//           setExtractedText("");
//         }}
//         className="border p-2 rounded w-full text-matchita-text-alt bg-bg-alt"
//       >
//         <option value="">Select a document...</option>
//         {files.map((file) => (
//           <option key={file.id} value={file.id}>
//             {file.name} ({file.mimeType})
//           </option>
//         ))}
//       </select>

//       {selectedFile && (
//         <div className="space-y-2">
//           <div className="space-x-4">
//             <button
//               onClick={() => window.open(selectedFile.webViewLink, "_blank")}
//               className="bg-blue-500 text-white px-4 py-2 rounded"
//             >
//               Preview
//             </button>
//             <button
//               onClick={handleExtractText}
//               className="bg-green-500 text-white px-4 py-2 rounded"
//             >
//               Extract Text
//             </button>
//             <button
//               onClick={handleDownload}
//               className="bg-gray-700 text-white px-4 py-2 rounded"
//             >
//               Download
//             </button>
//           </div>

//           <div className="mt-4">
//             <h2 className="font-semibold mb-2">Extracted Text:</h2>
//             <pre className="whitespace-pre-wrap border p-2 bg-gray-100 rounded text-matchita-900">
//               {extractedText || "No text extracted yet."}
//             </pre>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }
