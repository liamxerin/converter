document.getElementById('convertButton').addEventListener('click', async function() {
    pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js';
    
    const fileInput = document.getElementById('pdfFile');
    const file = fileInput.files[0];

    if (!file) {
      alert('Please upload a PDF file first!');
      return;
    }

    const reader = new FileReader();
    reader.readAsArrayBuffer(file);

    reader.onload = async function(e) {
      const arrayBuffer = e.target.result;
      const pdfDoc = await pdfjsLib.getDocument(arrayBuffer).promise;

      let text = '';
      for (let pageNum = 1; pageNum <= pdfDoc.numPages; pageNum++) {
        let page = await pdfDoc.getPage(pageNum);
        let textContent = await page.getTextContent();
        text += textContent.items.map(item => item.str).join(' ') + '\n';
      }

      convertTextToDoc(text);
    };
  });

  function convertTextToDoc(text) {
    const htmlContent = `<html><head><meta charset="UTF-8"></head><p>${text.replace(/\n/g, '</p><p>')}</p></html>`;

    // Create a Blob with HTML content and MS Word MIME type
    const blob = new Blob(['\ufeff', htmlContent], { type: 'application/msword' });

    // Create a download link
    const downloadLink = document.createElement('a');
    downloadLink.href = URL.createObjectURL(blob);
    downloadLink.download = 'converted-document.doc';
    downloadLink.click();
  }