'use client'

import { DocumentEditorContainerComponent, Toolbar } from '@syncfusion/ej2-react-documenteditor';
import { useRef } from 'react';
import { Button } from '~/components/ui/button';

DocumentEditorContainerComponent.Inject(Toolbar);

export default function TestPage() {
  const containerRef = useRef<DocumentEditorContainerComponent>(null);

  function load(): void {
    fetch(
      'http://localhost:6002/api/documenteditor/LoadFromS3',
      {
        method: 'Post',
        headers: { 'Content-Type': 'application/json;charset=UTF-8' },
        body: JSON.stringify({ documentName: 'cm77k2yzh0001l9ja0bm1g1b9' })
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

  return (
    <div className="h-full">
      <Button onClick={load}>Open Document From AWS S3 Bucket</Button>
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

