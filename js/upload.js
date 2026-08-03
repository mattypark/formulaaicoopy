/* Hero dropzone. Click to browse, drag to highlight, drop to validate.
   Nothing is uploaded anywhere — this is the visual affordance only. */

const ACCEPTED = /^image\//;

export function initUpload() {
  const dropZone = document.getElementById('dropZone');
  const fileInput = document.getElementById('fileInput');
  const errorMessage = document.getElementById('errorMessage');

  if (!dropZone || !fileInput) return;

  function showError(msg) {
    if (errorMessage) errorMessage.textContent = msg;
  }

  function handleFiles(files) {
    const list = Array.from(files);
    if (!list.length) return;

    const rejected = list.filter(f => !ACCEPTED.test(f.type));

    if (rejected.length) {
      showError('Images only, please.');
      return;
    }

    showError('');
    dropZone.classList.add('is-filled');
  }

  dropZone.addEventListener('click', () => fileInput.click());

  dropZone.addEventListener('dragover', e => {
    e.preventDefault();
    dropZone.classList.add('is-dragging');
  });

  dropZone.addEventListener('dragleave', () => {
    dropZone.classList.remove('is-dragging');
  });

  dropZone.addEventListener('drop', e => {
    e.preventDefault();
    dropZone.classList.remove('is-dragging');
    handleFiles(e.dataTransfer.files);
  });

  fileInput.addEventListener('change', () => handleFiles(fileInput.files));
}
