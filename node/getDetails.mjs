import https from 'https'
import fs from 'fs'
import 'colors'
import crud from './crud'
import adapter from './adapter'

const path = 'src'
const fileName = 'cars.json'

const getItemData = (link, carInfoId) => {
  const promise = new Promise((resolve) => {
    const tempFile = {
      path: 'temp',
      name: `car_${carInfoId}.html`,
    }
    let data = ''
    https.get(link, (res) => {
      console.log(`Got response: ${res.statusCode}`)
      res.on('data', (chunk) => {
        data += chunk
        crud.writeFile(tempFile.path, tempFile.name, data)
      })
      res.on('end', () => {
        console.log('end')
        resolve(adapter.processDataDetail(tempFile.path, tempFile.name))
      })
    })
  })
  return promise
}

/**
 * 对比文件，并将新增的内容附在后面
 * @param carsArrNew 新数组
 */
const compareAndAppend = async (carsArrNew) =>
  new Promise((resolve, reject) => {
    fs.access(`./${path}/${fileName}`, fs.constants.F_OK, async (err) => {
      if (err) {
        console.log(`./${path}/${fileName} does not exist! It will be written directly`.yellow)
        resolve(carsArrNew)
      } else {
        console.log(`./${path}/${fileName} exists! It will compare and append`.green)
        const diffArr = []
        const carsArrOld = await crud.read(path, fileName)
        carsArrNew.forEach((carNew) => {
          let includeFlag = false
          carsArrOld.forEach((carOld) => {
            if (carNew.carInfoId === carOld.carInfoId) {
              includeFlag = true
            }
          })
          if (!includeFlag) {
            diffArr.push(carNew)
          }
        })
        console.log('compare and append done'.green)
        resolve([...carsArrOld, ...diffArr])
      }
    })
  })

/**
 * 获取每个car的详细数据
 * @param carsJson 主页中的car数据
 */
const getDetails = async (carsJson) => {
  const { carsArr } = carsJson
  const carsArrNew = []
  console.log(carsArr)
  for (const [i, item] of carsArr.entries()) {
    console.log(`${i + 1}/${carsArr.length}...`)
    const res = await getItemData(item.link, item.carInfoId)
    carsArrNew.push({
      ...item,
      ...res,
    })
  }

  // 判断有 data/cars.json 的话进入比对逻辑，仅push新扫描出来的 carInfoId，再写入 cars.json
  // 否则直接写入 cars.json
  const carsArrFinal = await compareAndAppend(carsArrNew)

  await crud.writeFile(path, fileName, JSON.stringify(carsArrFinal))
  console.log(`write file ./${path}/${fileName} done!`.green)

  // // carsJson.carsArr = carsArrNew
  // console.log('------------------------------------')
  // console.log(carsArrNew)
  // console.log('------------------------------------')
}

export default getDetails
