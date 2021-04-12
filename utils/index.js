import htmlParser from "./html-parser.js"

/*
 * 全局拼接图片文件url方法
 * @description 加上域名前缀以保证图片的正常使用
 * @param {String} fileUrl - 传入的路径
 */
export function getFilePath(fileUrl) {
	const IMAGE_BASE_URL = 'http://minio.goyoto.cn'
    if (!fileUrl) return ''
    if (fileUrl.indexOf('http') > -1) {
        return fileUrl
    }
    return IMAGE_BASE_URL + fileUrl
}

/*
 * @description 将 html 字符串转换为支持 rich-text 的 node 节点
 * @param {String} str - 传入一个 HTML 格式的字符串
 */
export function htmlToNode(str){
	return htmlParser(str)
}