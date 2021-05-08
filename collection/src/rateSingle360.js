const fs = require('fs');
const path = require('path');
const fse = require('fs-extra');
const dayjs = require('dayjs');
const axios = require('axios').default;
const iconv = require('iconv-lite');

const requestAndSaveRate360 = async (productId) => {
    // 确保路径存在
    const dirPath = path.resolve(__dirname, '../data', productId.toString());
    fse.ensureDirSync(dirPath);
    // 时间实际路径
    const filePath = path.resolve(dirPath, `${dayjs().format('YYYY-MM-DD')}.json`);
    const writeStream = fs.createWriteStream(filePath, { flags: 'w' });
    // 请求数据并写入
    // const response = await axios.get('https://www.baidu.com/user');

    const response = await axios.get('https://club.jd.com/comment/productPageComments.action', {
        params: {
            productId: productId,
            score: 0,
            sortType: 5,
            page: 0,
            pageSize: 10,
            isShadowSku: 0,
            fold: 1,
        },
        headers: {
            'cookie': '__jdv=76161171|direct|-|none|-|1620184483682; __jdu=16201844836811263192515; areaId=2; PCSYCityID=CN_310000_310100_310115; shshshfpa=e11a7c7a-3409-cda4-36ed-e4729b8981d0-1620184486; shshshfpb=zuX8QgbyjkAUzvUqGrI8HCw%3D%3D; ipLoc-djd=2-2830-51803-0; jwotest_product=99; __jda=122270672.16201844836811263192515.1620184484.1620213179.1620446020.3; __jdc=122270672; 3AB9D23F7A4B3C9B=B4DW3FAKMHOR6STSLDWMLQLYQRNAKJFGISLC7VFM2YJ4DWCYZBW5G3OJR4QPTJOGL6QMKVZ7L6YKESW6E232GHJV7Y; shshshfp=6bed3db876c23b56f34e0cf54030b359; shshshsID=ae0b0de45eaf04242698f7468288d55d_2_1620446039174; __jdb=122270672.3.16201844836811263192515|3.1620446020',
            'user-agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1'
        },
        responseType: 'stream'
    });
    if (response.status === 200) {
        response.data
        .pipe(iconv.decodeStream('GBK'))
        .pipe(iconv.encodeStream('utf8'))
        .pipe(writeStream)
    }
}

module.exports = requestAndSaveRate360;

// // iPhone 11
// requestAndSaveRate360(100008348530);
// // iPhone 12
// requestAndSaveRate360(100009077475);
// // iPhone 12 pro
// requestAndSaveRate360(100016034368);
// // iPhone 12 pro Max
// requestAndSaveRate360(100009077441);
