// 全局拼接图片文件url方法
export function getFilePath(fileUrl) {
	const IMAGE_BASE_URL = 'http://minio.goyoto.cn'
    if (!fileUrl) return ''
    if (fileUrl.indexOf('http') > -1) {
        return fileUrl
    }
    return IMAGE_BASE_URL + fileUrl
}