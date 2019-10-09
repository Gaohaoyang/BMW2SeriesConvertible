import React from 'react'
import { Table, Button, Checkbox, Drawer } from 'antd'

import carsData from './cars.json'
import './App.css'

class App extends React.Component {
  state = {
    filteredInfo: {
      soldOut: ['false']
    },
    // sortedInfo: null,
    drawerVisible: false,
    drawerGallery: [],
  }

  handleChange = (pagination, filters, sorter) => {
    console.log('Various parameters', pagination, filters, sorter)
    this.setState({
      filteredInfo: filters,
      sortedInfo: sorter,
    })
  }

  clearFilters = () => {
    this.setState({ filteredInfo: null })
  }

  // clearAll = () => {
  //   this.setState({
  //     filteredInfo: null,
  //     sortedInfo: null,
  //   })
  // }

  // setPriceSort = () => {
  //   this.setState({
  //     sortedInfo: {
  //       order: 'descend',
  //       columnKey: 'price',
  //     },
  //   })
  // }

  /**
   * 过滤是否已售出
   */
  filterSoldOutCheckBox = (e) => {
    console.log(`checked = ${e.target.checked}`)
    if (e.target.checked) {
      this.setState({
        filteredInfo: {
          soldOut: ['true'],
        },
      })
    } else {
      this.setState({
        filteredInfo: {
          soldOut: ['false'],
        },
      })
    }
  }

  onCloseDrawer = () => {
    this.setState({
      drawerVisible: false
    })
  }

  render() {
    let { filteredInfo, drawerVisible, drawerGallery } = this.state
    const me = this
    // sortedInfo = sortedInfo || {}
    filteredInfo = filteredInfo || {}
    const columns = [
      {
        title: 'id',
        dataIndex: 'carInfoId',
        key: 'carInfoId',
        sorter: (a, b) => a.carInfoId - b.carInfoId,
      },
      {
        title: '标题',
        dataIndex: 'title',
        key: 'title',
      },
      // {
      //   title: 'carOfficial',
      //   dataIndex: 'carOfficial',
      //   key: 'carOfficial',
      //   render(carOfficial) {
      //     return <span>{carOfficial.toString()}</span>
      //   }
      // },
      {
        title: 'link',
        dataIndex: 'link',
        key: 'link',
        render(link) {
          return (
            <a target='_blank' rel='noopener noreferrer' href={link}>
              link
            </a>
          )
        },
      },
      {
        title: '价格',
        dataIndex: 'price',
        key: 'price',
        sorter: (a, b) => a.price - b.price,
        render(price) {
          return <span>{+(price / 10000).toFixed(2)}w</span>
        },
      },
      {
        title: '新车价格',
        dataIndex: 'priceNewCar',
        key: 'priceNewCar',
        sorter: (a, b) => a.priceNewCar - b.priceNewCar,
        render(priceNewCar) {
          return <span>{+(priceNewCar / 10000).toFixed(2)}w</span>
        },
      },
      {
        title: '图片',
        dataIndex: 'img',
        key: 'img',
        render(img, record) {
          return (
            <img
              style={{
                cursor: 'pointer',
                width: '120px',
              }}
              src={img}
              alt=''
              onClick={() => {
                console.log(record.gallery)
                me.setState({
                  drawerVisible: true,
                  drawerGallery: record.gallery
                })
              }}
            />
          )
        },
      },
      {
        title: '是否售出',
        dataIndex: 'soldOut',
        key: 'soldOut',
        render(soldOut) {
          return <span>{soldOut.toString()}</span>
        },
        filters: [
          {
            text: '已售出',
            value: 'true',
          },
          {
            text: '未售出',
            value: 'false',
          },
        ],
        onFilter: (value, record) => record.soldOut.toString().includes(value),
        filteredValue: filteredInfo.soldOut || null,
      },
      // {
      //   title: 'birth',
      //   dataIndex: 'birth',
      //   key: 'birth',
      // },
      {
        title: '里程数',
        dataIndex: 'distance',
        key: 'distance',
        sorter: (a, b) => a.distance - b.distance,
        render(distance) {
          return <span>{(distance / 10000).toFixed(2)}万公里</span>
        },
      },
      {
        title: '月供',
        dataIndex: 'loanMoney',
        key: 'loanMoney',
        sorter: (a, b) => a.loanMoney - b.loanMoney,
      },
      {
        title: 'scanDate',
        dataIndex: 'scanDate',
        key: 'scanDate',
        sorter: (a, b) => {
          return Date.parse(a.scanDate) - Date.parse(b.scanDate)
        },
      },
      {
        title: '几几年款',
        dataIndex: 'yearVersion',
        key: 'yearVersion',
        sorter: (a, b) => parseInt(a.yearVersion, 10) - parseInt(b.yearVersion, 10),
      },
      {
        title: '热度',
        dataIndex: 'viewHeat',
        key: 'viewHeat',
        sorter: (a, b) => a.viewHeat - b.viewHeat,
      },

      {
        title: '地区',
        dataIndex: 'location',
        key: 'location',
      },
      {
        title: '销售厂商',
        dataIndex: 'agencyBrand',
        key: 'agencyBrand',
      },
      // {
      //   title: '销售',
      //   dataIndex: 'agencyName',
      //   key: 'agencyName',
      // },
      // {
      //   title: 'agencyTelArr',
      //   dataIndex: 'agencyTelArr',
      //   key: 'agencyTelArr',
      // },
      {
        title: '排放标准',
        dataIndex: 'emissionStandards',
        key: 'emissionStandards',
        sorter: (a, b) => a.emissionStandards - b.emissionStandards,
      },
      {
        title: 'color',
        dataIndex: 'color',
        key: 'color',
      },
      {
        title: 'engine',
        dataIndex: 'engine',
        key: 'engine',
        sorter: (a, b) => a.engine - b.engine,
      },
      {
        title: '气缸数',
        dataIndex: 'cylindersNum',
        key: 'cylindersNum',
        sorter: (a, b) => a.cylindersNum - b.cylindersNum,
      },
      {
        title: '排量',
        dataIndex: 'displacement',
        key: 'displacement',
        render(displacement) {
          return <span>{(displacement / 1000).toFixed(1)}L</span>
        },
      },
      {
        title: '出厂时间',
        dataIndex: 'factoryTime',
        key: 'factoryTime',
        sorter: (a, b) => {
          return Date.parse(a.factoryTime) - Date.parse(b.factoryTime)
        },
      },
      {
        title: '上牌时间',
        dataIndex: 'cardTime',
        key: 'cardTime',
        sorter: (a, b) => {
          return Date.parse(a.cardTime) - Date.parse(b.cardTime)
        },
      },
    ]

    return (
      <div>
        <div className='table-operations'>
          <Checkbox
            onChange={this.filterSoldOutCheckBox}
            checked={this.state.filteredInfo && this.state.filteredInfo.soldOut[0] === 'false'}
          >仅显示在售</Checkbox>
          {/* <Button onClick={this.setPriceSort}>价格排序</Button> */}
          <Button onClick={this.clearFilters}>Clear filters</Button>
          {/* <Button onClick={this.clearAll}>Clear filters and sorters</Button> */}
        </div>
        <Table
          columns={columns}
          dataSource={carsData}
          size='small'
          bordered
          pagination={false}
          onChange={this.handleChange}
        // scroll={{ y: 650 }}
        />
        <Drawer
          title='图集'
          placement='right'
          closable={false}
          onClose={this.onCloseDrawer}
          visible={drawerVisible}
          width={848}
          maskStyle={{
            backdropFilter: 'blur(5px)'
          }}
          destroyOnClose={true}
        >
          {
            drawerGallery.map((item, index) => <img
              key={`imgGallery_${index}`}
              src={item}
              alt="gallery"
              style={{
                width: '800px',
                marginBottom: index === drawerGallery.length - 1 ? '0px' : '24px'
              }}
            />)
          }
        </Drawer>
      </div>
    )
  }
}

export default App
