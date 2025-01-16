import { type Session } from "next-auth";
import { type UploadResponse } from "~/interface";

export const uploadFile = async (session: Session, event: React.ChangeEvent<HTMLInputElement>) => {
  const file = event.target.files?.[0];
  if (!file) return;

  const formData = new FormData();
  formData.append("file", file);
  formData.append("caption", file.name);

  if (session?.user.id) {
    formData.append("userId", session.user.id);
  }

  const response = await fetch('/api/upload', {
    method: 'POST',
    body: formData,
  });

  const result = await response.json() as UploadResponse;
  console.log(result);
}

export const getFiles = () => {
  
  console.log("Hello")
}