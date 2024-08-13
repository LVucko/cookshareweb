import { useEffect, useState } from "react";
import axios from "axios";
import { getJWT } from "../utils/utilities";
import { Button, Image, Space } from "antd";
import {
  RotateLeftOutlined,
  RotateRightOutlined,
  SwapOutlined,
  UndoOutlined,
  ZoomInOutlined,
  ZoomOutOutlined,
  DeleteOutlined,
  LeftOutlined,
  RightOutlined,
} from "@ant-design/icons";
const ImageManagment = () => {
  const [currentPictureIndex, setCurrentPictureIndex] = useState(null);
  const [pictureIds, setPictureIds] = useState(null);
  const [pictures, setPictures] = useState(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    fetchPictures();
  }, []);

  function fetchPictures() {
    axios
      .get("/api/upload", {
        headers: { Authorization: "Bearer " + getJWT() },
      })
      .then((response) => {
        let pictures = response.data.map((obj) => obj.pathToPicture);
        let pictureIds = response.data.map((obj) => obj.id);
        setPictures(pictures);
        setPictureIds(pictureIds);
        if (currentPictureIndex === null)
          setCurrentPictureIndex(response.data.length - 1);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  function handleDelete() {
    axios
      .delete("/api/upload/" + pictureIds[currentPictureIndex], {
        headers: { Authorization: "Bearer " + getJWT() },
      })
      .then(() => {
        fetchPictures();
      })
      .catch((error) => {
        console.log(error);
      });
  }

  const onDelete = () => {
    handleDelete();
  };

  return (
    <>
      {pictures && currentPictureIndex && (
        <div>
          <div className="tight-row">
            <div>
              <Button
                type="default"
                shape="circle"
                onClick={() => {
                  if (currentPictureIndex >= 0)
                    setCurrentPictureIndex(currentPictureIndex - 1);
                }}
              >
                <LeftOutlined />
              </Button>
            </div>
            <Image.PreviewGroup
              items={pictures}
              preview={{
                toolbarRender: (
                  _,
                  {
                    image: { url },
                    transform: { scale },
                    actions: {
                      onFlipY,
                      onFlipX,
                      onRotateLeft,
                      onRotateRight,
                      onZoomOut,
                      onZoomIn,
                      onReset,
                    },
                  }
                ) => (
                  <Space size={15} style={{ fontSize: "25px" }}>
                    <DeleteOutlined onClick={() => onDelete(url)} />
                    <SwapOutlined rotate={90} onClick={onFlipY} />
                    <SwapOutlined onClick={onFlipX} />
                    <RotateLeftOutlined onClick={onRotateLeft} />
                    <RotateRightOutlined onClick={onRotateRight} />
                    <ZoomOutOutlined
                      disabled={scale === 1}
                      onClick={onZoomOut}
                    />
                    <ZoomInOutlined
                      disabled={scale === 50}
                      onClick={onZoomIn}
                    />
                    <UndoOutlined onClick={onReset} />
                  </Space>
                ),
                visible,
                onVisibleChange: (vis) => {
                  setVisible(vis);
                },
                current: currentPictureIndex,
                onChange: (index) => {
                  setCurrentPictureIndex(index);
                },
              }}
            >
              <Image
                width={400}
                src={"/../../" + pictures[currentPictureIndex]}
              />
            </Image.PreviewGroup>
            <div>
              <Button
                type="default"
                shape="circle"
                onClick={() => {
                  if (currentPictureIndex < pictures.length - 1)
                    setCurrentPictureIndex(currentPictureIndex + 1);
                }}
              >
                <RightOutlined />
              </Button>
            </div>
          </div>
          <div className="row">
            <div></div>
            <Button type="primary" onClick={handleDelete}>
              Obriši
            </Button>
            <div></div>
          </div>
        </div>
      )}
    </>
  );
};

export default ImageManagment;
