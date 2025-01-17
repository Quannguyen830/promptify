import { type Session } from "next-auth";
import { type UploadResponse } from "~/interface";

export const uploadFileService = async (session: Session, event: React.ChangeEvent<HTMLInputElement>) => {
  const file = event.target.files?.[0];
  if (!file) return;

  const formData = new FormData();
  formData.append("file", file);
  formData.append("fileName", file.name);

  if (session?.user.id) {
    formData.append("userId", session.user.id);
  }

  const response = await fetch('/api/upload-single-file', {
    method: 'POST',
    body: formData,
  });

  const result = await response.json() as UploadResponse;
  console.log(result);
}

export const createNewFolderService = async (session: Session, folderName: string) => {
  const formData = new FormData();
  formData.append("folderName", folderName);
  
  if(session?.user.id) {
    formData.append("userId", session.user.id)
  }

  const response = await fetch('/api/create-new-folder', {
    method: 'POST',
    body: formData,
  })

  const result = await response.json() as UploadResponse;
  console.log(result)
}

export const uploadFolderService = async (session: Session, event: React.ChangeEvent<HTMLInputElement>, folderName: string) => {
  const folder = event.target.files;
  if (!folder || folder.length === 0) return;

  const formData = new FormData();
  formData.append("folderName", folderName);

  for (const file of folder) {
    formData.append("files", file); 
  }
  
  if(session?.user.id) {
    formData.append("userId", session.user.id);
  }

  const response = await fetch('/api/upload-folder', {
    method: 'POST',
    body: formData,
  });

  const result = await response.json() as UploadResponse;
  console.log(result);
}

export const getFiles = () => {
  console.log("Hello")
}