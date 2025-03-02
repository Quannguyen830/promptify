'use client'

import { DocumentEditorContainerComponent, Toolbar } from '@syncfusion/ej2-react-documenteditor';
import { useQuery } from '@tanstack/react-query';
import Loading from '~/components/share/loading-spinner';
import { api } from '~/trpc/react';
import { useRef } from 'react';
import { Button } from '~/components/ui/button';

DocumentEditorContainerComponent.Inject(Toolbar);

interface DocumentResponse {
  // Add specific type definition based on your API response
  content: string;
  // other properties...
}

export default function TestPage() {
  const containerRef = useRef<DocumentEditorContainerComponent>(null);
  const { data, isLoading, error } = api.file.getFileByFileId.useQuery({
    fileId: 'cm77k2yzh0001l9ja0bm1g1b9'
  });

  const handleOpenDocument = async (): Promise<void> => {
    const response = await fetch('http://localhost:3000/api/ping/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json() as DocumentResponse;

    if (containerRef.current?.documentEditor) {
      containerRef.current.documentEditor.open(data.content);
    } else {
      throw new Error('Document editor not initialized');
    }
  }

  if (isLoading) return <Loading />
  if (error) return <div>Error: {error.message}</div>

  return (
    <div className="h-full">
      <Button onClick={handleOpenDocument}>Open Document From AWS S3 Bucket</Button>
      <DocumentEditorContainerComponent
        id="container"
        height='100%'
        // serviceUrl="http://localhost:3000/api/ping/"
        enableToolbar={true}
        ref={containerRef}
      />
    </div>
  )
}

