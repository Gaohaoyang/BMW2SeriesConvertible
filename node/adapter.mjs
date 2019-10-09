import cheerio from 'cheerio'
import fs from 'fs'

import config from './config'

const processText = (title) => unescape(title.replace(/&#x/g, '%u').replace(/;/g, ''))

/**
 * 处理详情页数据
 */
const processDataDetail = (path, pageName) => {
  const $ = cheerio.load(fs.readFileSync(`./${path}/${pageName}`))

  const gallery = []
  const galleryHTML = $('#mycycle li img')
  for (let index = 0; index < galleryHTML.length; index += 1) {
    gallery.push(`${config.linkBase}${galleryHTML.eq(index).attr('src')}`)
  }

  const yearVersion = processText(
    $('.mycycle-modal .album-h4')
      .html()
      .split(' ')[1]
  )

  const viewHeat = parseInt($('.icon-view').html(), 10)

  const priceNewCar = parseInt(
    $('#sfinit')
      .siblings()
      .find('.loadPrice')
      .html(),
    10
  )

  const location = processText(
    $('.car-info-detail')
      .find('td')
      .eq(2)
      .html()
  )

  const emissionStandards = processText(
    $('.car-info-detail')
      .find('td')
      .eq(3)
      .html()
      .trim()
  )

  const agencyBrand = processText(
    $('.agency')
      .children()
      .eq(0)
      .html()
  ).split('：')[1]

  const agencyName = processText(
    $('.agency')
      .children()
      .eq(1)
      .html()
  ).split('：')[1]

  const agencyTelArr = []
  const agencyTel = $('.detail-left .row-information a')
  for (let index = 0; index < agencyTel.length; index += 1) {
    agencyTelArr.push(agencyTel.eq(index).html())
  }

  const factoryTime = $('#params-modal ul')
    .eq(0)
    .find('li')
    .eq(0)
    .children()
    .eq(1)
    .html()
    .trim()

  const cardTime = $('#params-modal ul')
    .eq(0)
    .find('li')
    .eq(3)
    .children()
    .eq(1)
    .html()
    .trim()

  const color = processText(
    $('#params-modal ul')
      .eq(0)
      .find('li')
      .eq(1)
      .children()
      .eq(1)
      .html()
      .trim()
  )

  const engine = $('#params-modal ul')
    .eq(0)
    .find('li')
    .eq(5)
    .children()
    .eq(1)
    .html()
    .trim()

  const cylindersNum = $('#params-modal ul')
    .eq(1)
    .find('li')
    .eq(2)
    .children()
    .eq(1)
    .html()
    .trim()

  const displacement = $('#params-modal ul')
    .eq(1)
    .find('li')
    .eq(5)
    .children()
    .eq(1)
    .html()
    .trim()

  return {
    gallery, // 细节大图
    yearVersion, // 几几年款
    viewHeat, // 浏览热度
    priceNewCar, // 新车指导价
    location, // 所在地
    emissionStandards, // 排放标准
    agencyBrand, // 经销商
    agencyName, // 销售顾问姓名
    agencyTelArr, // 销售顾问电话
    color, // 颜色
    factoryTime, // 出厂时间
    engine, // 发动机型号
    cylindersNum, // 气缸数
    displacement, // 排量
    cardTime, // 上牌时间
  }
}

/**
 * 处理主页面
 */
const processData = (path, name) => {
  const $ = cheerio.load(fs.readFileSync(`./${path}/${name}`))
  const dataGrid = $('#dataGrid')
  const totalPage = parseInt($('#totalPage').attr('value'), 10)
  const carsArr = []

  for (let index = 0; index < dataGrid.find('.card').length; index += 1) {
    const item = dataGrid.find('.card').eq(index)
    let title = item
      .find('h3 span')
      .eq(2)
      .html()
    if (title) {
      title = processText(title)
    }

    const fullTitle = `${processText(
      item
        .find('h3 span')
        .eq(0)
        .html()
        .trim()
        .replace(/\s+/g, ' ')
    )}${title}`

    const carOfficial =
      processText(
        item
          .find('h3 span')
          .eq(1)
          .html()
      ) === '官方认证'

    const price = parseInt(
      item
        .find('.car-price-month .car-important')
        .html()
        .substr(6)
        .replace(',', ''),
      10
    )

    const link = `${config.linkBase}${item.find('a').attr('href')}`
    const URLObj = new URL(link)
    const carInfoId = URLObj.searchParams.get('carInfoId')
    const img = `${config.linkBase}${item.find('img').attr('src')}`
    const soldOut = item.find('i').hasClass('icon-sold')
    const useInfo = processText(item.find('.car-useinfo').html()).split(' | ')
    const birth = useInfo[0].trim()
    const distance = parseInt(useInfo[1].match(/\d+/g).join(''), 10)
    const loanMoney = item
      .find('.loanMoney')
      .html()
      .split('&#xA5;')[1]
    const scanDate = new Date().toLocaleString('zh-CN')

    carsArr.push({
      title, // 标题
      fullTitle, // 完整标题
      carOfficial, // 官方认证
      link, // 详情页链接
      carInfoId, // id
      price, // 价格
      img, // 图片
      soldOut, // 是否已卖出
      birth, // 出厂时间
      distance, // 距离
      loanMoney, // 月供金额
      scanDate, // 爬虫抓取时间
    })
  }

  return {
    carsArr,
    totalPage,
  }
}

export default {
  processData,
  processDataDetail,
}
