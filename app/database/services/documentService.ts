import Document from "../models/documents";
import { Types } from "mongoose";
import { IDocument } from "@/app/types";

export const createDocument = (data: Partial<IDocument>) =>
  Document.create(data);

export const getDocumentById = (docId: Types.ObjectId) =>
  Document.findById(docId);

export const deleteDocument = (docId: Types.ObjectId) =>
  Document.findByIdAndDelete(docId);

export const updateDocumentTagsFolder = (
  docId: Types.ObjectId,
  tags: string[],
  folder: string
) => Document.findByIdAndUpdate(docId, { tags, folder });

export const updateDocumentName = (docId: Types.ObjectId, name: string) =>
  Document.findByIdAndUpdate(
    docId,
    { $set: { title: name } },
    { new: true, runValidators: true }
  );
