import fs from 'fs'
import mkdirp from 'mkdirp'

/**
 * 读取文件
 */
const read = (path, name) =>
  new Promise((resolve, reject) => {
    fs.readFile(`./${path}/${name}`, 'utf8', (err, data) => {
      if (err) {
        console.log(err)
        reject(err)
      }
      resolve(JSON.parse(data))
    })
  })

/**
 * 写文件，增加路径判断
 */
const writeFile = async (path, fileName, content) => {
  await mkdirp(path)
  fs.writeFileSync(`./${path}/${fileName}`, content)
}

export default {
  // write,
  read,
  writeFile,
}
