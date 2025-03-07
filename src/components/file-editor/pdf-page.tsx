import {
  PdfViewerComponent, Toolbar, Magnification, Navigation, LinkAnnotation,
  Print, TextSelection, Annotation, TextSearch, FormFields, FormDesigner, Inject
} from '@syncfusion/ej2-react-pdfviewer';

export default function PdfPage({ documentLink }: { documentLink: string }) {
  return (
    <div className='h-full w-full'>
      <div className='control-section h-full'>
        <PdfViewerComponent
          id="container"
          documentPath={documentLink}
          resourceUrl="https://cdn.syncfusion.com/ej2/26.2.11/dist/ej2-pdfviewer-lib"
          style={{ height: '100%' }}
        >
          <Inject services={[Toolbar, Magnification, Navigation, Annotation, LinkAnnotation,
            Print, TextSelection, TextSearch, FormFields, FormDesigner]} />
        </PdfViewerComponent>
      </div>
    </div>
  );
}
