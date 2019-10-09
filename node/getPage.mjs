// import URL from 'URL'
import https from 'https'
import adapter from './adapter'
import crud from './crud'
import getDetails from './getDetails'

let carsJson
let pageNum = 1
const tempFile = {
  path: 'temp',
  name: 'page.html',
}

/**
 * 生成 url
 */
const generateURL = (page) => {
  const URLObj = new URL('https://bmwusedcar.bmw.com.cn/portal/showroom.action')
  const params = new URLSearchParams({
    method: 'buySearch',
    series: 2,
    page,
    carModel: '敞篷轿跑车',
    sidx: 'salePrice,carInfoId', // 价格排序
    sord: 'ASC,ASC', // 升序
    // rows: 20, // 每页尺寸
    // dealerId:
    // city:
    // province: 100000
    // carModel: 敞篷轿跑车
    // series: 2
    // modelcharacteristics:
    // color:
    // carAge:
    // mileage:
    // carPrice:
    // registFlag:
    // saleFlag:
    // paymentFlag:
    // bpsdayFlag:
    // resetFlag:
    // discharge:
    // isQuasiNewCar:
    // isExecutiveCar:
    // isTestDrive:
    // isLimited:
    // buyList:
    // defaultMonthly:
    // preminumFlag:
  })
  URLObj.search = params.toString()
  return URLObj
}

/**
 * 获取页面
 */
const getPage = () => {
  let data = ''
  const urlObj = generateURL(pageNum)
  console.log(`request link ---> ${urlObj}`)
  console.log(`request search ---> ${urlObj.searchParams}`)

  https.get(urlObj, (res) => {
    console.log(`Got response: ${res.statusCode}`)
    res.on('data', (chunk) => {
      data += chunk
      crud.writeFile(tempFile.path, tempFile.name, data)
    })
    res.on('end', () => {
      if (!carsJson) {
        carsJson = adapter.processData(tempFile.path, tempFile.name)
      } else {
        carsJson.carsArr.push(...adapter.processData(tempFile.path, tempFile.name).carsArr)
      }
      if (pageNum < carsJson.totalPage) {
        pageNum += 1
        getPage()
      } else {
        console.log('get page done')
        getDetails(carsJson)
      }
    })
  })
}

export default getPage
