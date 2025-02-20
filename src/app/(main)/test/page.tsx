'use client'

import DocViewer, { DocViewerRenderers } from "@cyntler/react-doc-viewer";
import "@cyntler/react-doc-viewer/dist/index.css";
import Loading from "~/components/share/loading-spinner";
import { api } from "~/trpc/react";

export default function TestPage() {
  const { data, isLoading, error } = api.file.getFileByFileId.useQuery({
    fileId: "cm77k2yzh0001l9ja0bm1g1b9"
  });

  if (isLoading) return <Loading />;
  if (error) return <div>Error: {error.message}</div>;

  // console.log("Encoded URL:", encodeURIComponent(data?.signedUrl ?? ""));

  const src = `https://docs.google.com/viewer?url=${encodeURIComponent(data?.signedUrl ?? "")}&embedded=true`

  console.log("Src:", src);

  const docsParam = data?.signedUrl ? {
    uri: data.signedUrl,
    fileType: data.type,
    fileName: data?.name,
  } : {
    uri: "https://mozilla.github.io/pdf.js/web/compressed.tracemonkey-pldi-09.pdf",
    fileType: "pdf",
    fileName: "compressed.tracemonkey-pldi-09.pdf",
  };

  console.log("Docs Param:", docsParam);

  const docs = [docsParam];

  return (
    <div className="h-screen overflow-y-auto">
      {data?.type === "pdf" ? (
        <DocViewer
          documents={docs}
          pluginRenderers={DocViewerRenderers}
          style={{
            height: "1000",
            width: "100%"
          }}
        />
      ) : (
        <iframe
          id="msdoc-iframe"
          title="msdoc-iframe"
          src={src}
          className="w-full h-full"
        ></iframe>
      )}
    </div>
  );
}

// https://promptify-first-bucket.s3.ap-southeast-2.amazonaws.com/cm77k2yzh0001l9ja0bm1g1b9?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIA2S2Y4FDTZZ5247Z6%2F20250218%2Fap-southeast-2%2Fs3%2Faws4_request&X-Amz-Date=20250218T061953Z&X-Amz-Expires=3600&X-Amz-Signature=b29a9479bf89001cbcec5ae6f7a48284223e2b76baf6bbb11f269d6476b0f173&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject

// https://freetestdata.com/wp-content/uploads/2021/09/1-MB-DOC.doc

// https://promptify-first-bucket.s3.ap-southeast-2.amazonaws.com/cm77k2yzh0001l9ja0bm1g1b9
