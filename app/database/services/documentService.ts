import Document, { IDocument } from "../models/documents";
import { Types } from "mongoose";

export const createDocument = (data: Partial<IDocument>) => Document.create(data);

export const getDocumentById = (docId: Types.ObjectId) => Document.findById(docId);

export const deleteDocument = (docId: Types.ObjectId) => Document.findByIdAndDelete(docId);

export const updateDocumentTagsFolder = (
  docId: Types.ObjectId,
  tags: string[],
  folder: string
) => Document.findByIdAndUpdate(docId, { tags, folder });