import fs from 'fs'
import 'colors'
import crud from './crud'

const path = 'src'
const fileName = 'cars.json'

const init = async () => {
  console.log('data correct start...')
  fs.access(`./${path}/${fileName}`, fs.constants.F_OK, async (err) => {
    if (err) {
      console.log(`./${path}/${fileName} does not exist! `.red)
    } else {
      const cars = await crud.read(path, fileName)
      const carsAfterCorrect = cars.map((element, index) => ({
        ...element,
        key: index + 1, // 增加 key
      }))
      crud.writeFile(path, fileName, JSON.stringify(carsAfterCorrect))
      console.log('data correct done! '.green)
    }
  })
}

init()
