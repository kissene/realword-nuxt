export const splitStr = function (str, separator = ",") {
  let res = []
  if (str !== '') {
    // 去空 去重
    res = [...new Set(str.split(separator).filter(i => i && i.trim()))]
  }
  return res
}


export function is_img_url(imgurl) {
  var ImgObj = new Image(); //判断图片是否存在
  ImgObj.src = imgurl;//没有图片，则返回-1
  if (ImgObj.fileSize > 0 || (ImgObj.width > 0 && ImgObj.height > 0)) {
    return true;
  } else {
    return false;
  }
}