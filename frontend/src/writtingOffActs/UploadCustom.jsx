import { Upload, Button, } from "antd";
import {  UploadOutlined  } from "@ant-design/icons";
import React, {useState} from "react";

import { useRecoilState } from 'recoil';
import { writtingOffActAtom } from "_state";

function UploadCustom(){

  const [writtingOffAct,setWrittingOffAct] = useRecoilState(writtingOffActAtom);


  const fileProps = {
    name: "file",  
  };



  const uploadFile = async (e) => {
    console.log(e)

    const fileList = [];

    for (const f of e.fileList){
      const originFile = f.originFileObj;
      const base64 = await convertBase64(originFile);
      let file = {};
      file.fileName = f.name
      file.base64 = base64
      fileList.push(file)
    }

    setWrittingOffAct(fileList);
  }

  const convertBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);

      fileReader.onload = () => {
        resolve(fileReader.result);
      };
      fileReader.onerror = (error) => {
        reject(error);
      };
    })}



  return (
      <Upload {...fileProps}
      beforeUpload={() => false}
        onChange={e => uploadFile(e)}
      >

        <Button icon={<UploadOutlined />}>Загрузить</Button>
      </Upload>
    );
  }

export { UploadCustom };