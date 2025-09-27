document.getElementById('upload-form').addEventListener('submit', async function(e) {
  e.preventDefault();
  
  const form = e.target;
  const fileInput = form.file;
  const status = document.getElementById('upload-status');
  
  if (!fileInput.files[0]) {
    status.textContent = 'Pilih file terlebih dahulu!';
    return;
  }
  
  status.textContent = 'Uploading...';

  const formData = new FormData();
  formData.append('file', fileInput.files[0]);

  try {
    const res = await fetch('/api/users/upload', {
      method: 'POST',
      body: formData
    });
    
    const data = await res.json();
    
    if (res.ok) {
      status.textContent = `Berhasil upload: ${data.imported} data, ${data.ignored} diabaikan.`;
    } else {
      status.textContent = `Gagal upload: ${data.error || 'Unknown error'}`;
    }
  } catch (err) {
    console.error('❌ Upload error:', err);
    status.textContent = 'Gagal upload: ' + err.message;
  }
});