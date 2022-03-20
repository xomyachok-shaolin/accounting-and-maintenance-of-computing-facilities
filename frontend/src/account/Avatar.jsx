import { Upload, message } from "antd";
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import React, {useState} from "react";
import ImgCrop from "antd-img-crop";

import { useRecoilState } from 'recoil';
import { avatarAtom } from "_state";




function Avatar(){

  const [setImageFile] = useRecoilState(avatarAtom);
  const [imageUrl,setImageUrl] = useState(false);
  const [loading,setLoading] = useState(false);

  const handleChange = (info) => {
    if (info.file.status === "uploading") {
      setLoading(true);
      return;
    }
    
    if (info.file.status === "done") {
      // Get this url from response in real world.
      getBase64(info.file.originFileObj, (imageUrl) => {
        setImageUrl(imageUrl);
        setLoading(false);
        info.file.imageUrl = imageUrl; 
        setImageFile(info.file);
      });                                                                                                                                                                                                                             
    }
  };
  function getBase64(img, callback) {
    const reader = new FileReader();
    reader.addEventListener("load", () => callback(reader.result));
    reader.readAsDataURL(img);
  }
  
  function beforeUpload(file) {
    const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
    if (!isJpgOrPng) {
      message.error("Вы можете загружать только JPG/PNG файлы!");
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error("Изображение должно быть меньше 2 МБ.!");
    }
    return isJpgOrPng && isLt2M;
  }
  

    // if (imageUrl === 'undefined')
    //   imageUrl = defaultImageSrc;

    
    
    const uploadButton = (
      <div>
        {loading ? <LoadingOutlined /> : <PlusOutlined />}
        <div style={{ marginTop: 8 }}>Загрузить</div>
      </div>
    );

    return (
      <ImgCrop
        rotate
        modalTitle="Редактирование изображения"
        modalOk="Сохранить"
        modalCancel="Отмена"
      >
        <Upload
          name="avatar"
          listType="picture-card"
          className="avatar-uploader"
          showUploadList={false}
          action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
          beforeUpload={beforeUpload}
          onChange={handleChange}
        >
          {imageUrl ? (
            <img src={imageUrl} alt="avatar" style={{ width: "100%" }} />
          ) : (
            uploadButton
          )}
        </Upload>
      </ImgCrop>
    );
  }

export { Avatar };
