import { Upload, Image, Button } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";

const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

const ImageUpload = ({ value, onChange, isProcessing, currentImagePath }) => {
  const [defaultPictureId, setDefaultPictureId] = useState("0");
  const [defaultFileList, setDefaultFileList] = useState(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");

  useEffect(() => {
    setDefaultPictureId(value);
    if (currentImagePath !== undefined) {
      setDefaultFileList([
        {
          uid: "-1",
          name: "Trenutna slika",
          status: "done",
          url: currentImagePath,
        },
      ]);
      onChange(null);
    } else setDefaultFileList([]);
  }, []);

  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
  };

  const uploadImage = (options) => {
    isProcessing(true);
    const { onSuccess, onError, file } = options;
    const fmData = new FormData();
    fmData.append("file", file);
    axios
      .post("/api/upload", fmData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((response) => {
        console.log(response.data);
        onChange(response.data);
        isProcessing(false);
        onSuccess("Ok");
      })
      .catch((error) => {
        isProcessing(false);
        console.log(error);
        onError({ error });
        onChange("Upload datoteke nije uspio, probajte ponovo");
      });
  };
  const handleOnChange = ({ fileList }) => {
    setDefaultFileList(fileList);
  };

  const handleOnRemove = () => {
    console.log("removing");
    onChange(defaultPictureId);
  };
  if (defaultFileList !== null)
    return (
      <>
        <Upload
          accept="image/*"
          customRequest={uploadImage}
          onChange={handleOnChange}
          listType="picture"
          defaultFileList={defaultFileList}
          onRemove={handleOnRemove}
          onPreview={handlePreview}
        >
          {defaultFileList.length >= 1 ? null : (
            <Button style={{ width: "100%" }} type="dashed">
              Odaberi sliku
            </Button>
          )}
        </Upload>
        {previewImage && (
          <Image
            wrapperStyle={{
              display: "none",
            }}
            preview={{
              visible: previewOpen,
              onVisibleChange: (visible) => setPreviewOpen(visible),
              afterOpenChange: (visible) => !visible && setPreviewImage(""),
            }}
            src={previewImage}
          />
        )}
      </>
    );
};

export default ImageUpload;
