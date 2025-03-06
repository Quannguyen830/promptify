'use client'

import { DocumentEditorContainerComponent, Toolbar } from '@syncfusion/ej2-react-documenteditor';
import { useRef, useEffect } from 'react';

DocumentEditorContainerComponent.Inject(Toolbar);

interface TextEditorProps {
  documentName: string
}

export default function TextEditorPage({ documentName }: TextEditorProps) {
  const containerRef = useRef<DocumentEditorContainerComponent>(null);

  useEffect(() => {
    if (documentName) {
      fetch(
        'http://localhost:6002/api/documenteditor/LoadFromS3',
        {
          method: 'Post',
          headers: { 'Content-Type': 'application/json;charset=UTF-8' },
          body: JSON.stringify({ documentName: documentName })
        }
      )
        .then(response => {
          if (response.status === 200 || response.status === 304) {
            return response.json();
          } else {
            throw new Error('Error loading data');
          }
        })
        .then(json => {
          if (containerRef.current) {
            containerRef.current.documentEditor.open(JSON.stringify(json));
          }
        })
        .catch(error => {
          console.error(error);
        });
    }
  }, [documentName]);

  return (
    <div className="h-full">
      <DocumentEditorContainerComponent
        id="container"
        height='100%'
        serviceUrl="http://localhost:6002/api/documenteditor"
        enableToolbar={true}
        ref={containerRef}
      />
    </div>
  )
}

