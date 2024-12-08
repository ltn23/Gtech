import React, { useState } from 'react';
import axios from 'axios';
import './UploadImage.css';

function UploadImage() {
  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState('');

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  // Upload hình lên Cloudinary
  const handleUpload = async () => {
    const formData = new FormData();
    formData.append('file', image);
    formData.append('upload_preset', 'gtechnology');
  
    try {
      const response = await axios.post(
        'https://api.cloudinary.com/v1_1/dsh0cqmhc/image/upload',
        formData
      );
  
      const imageUrl = response.data.secure_url;
  
      // Gửi URL ảnh lên Laravel để lưu
      await axios.post('http://localhost:8000/api/images', { url: imageUrl });
  
      alert('Upload và lưu URL thành công!');
      setImageUrl(imageUrl);
    } catch (error) {
      console.error('Lỗi khi upload và lưu URL:', error);
    }
  };
  

  return (
    <div className="upload-container">
      <h1>Upload Image</h1>
      <input type="file" onChange={handleImageChange} />
      <button onClick={handleUpload}>Upload</button>
      {imageUrl && (
        <div className="upload-image-preview">
          <p>Hình đã upload:</p>
          <img src={imageUrl} alt="Uploaded" />
        </div>
      )}
    </div>
  );
}

export default UploadImage;
