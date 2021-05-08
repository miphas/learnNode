const fs = require('fs');
const path = require('path');
const fse = require('fs-extra');
const dayjs = require('dayjs');
const axios = require('axios').default;
const iconv = require('iconv-lite');

const requestAndSaveRateSummery360 = async (groupName, productIds, _) => {
    // 确保路径存在
    const dirPath = path.resolve(__dirname, '../data', groupName);
    fse.ensureDirSync(dirPath);
    // 时间实际路径
    const filePath = path.resolve(dirPath, `${dayjs().format('YYYY-MM-DD')}.json`);
    const writeStream = fs.createWriteStream(filePath, { flags: 'w' });
    // 请求数据并写入
    const response = await axios.get(
        `https://club.jd.com/comment/productCommentSummaries.action?referenceIds=${productIds.join('%2C') + '%2C'}&_=${(_ || 1620458187545)}`, {
        headers: {
            'cookie': '__jdv=76161171|direct|-|none|-|1620184483682; __jdu=16201844836811263192515; areaId=2; PCSYCityID=CN_310000_310100_310115; shshshfpa=e11a7c7a-3409-cda4-36ed-e4729b8981d0-1620184486; shshshfpb=zuX8QgbyjkAUzvUqGrI8HCw%3D%3D; ipLoc-djd=2-2830-51803-0; jwotest_product=99; __jdc=122270672; shshshfp=6bed3db876c23b56f34e0cf54030b359; __jda=122270672.16201844836811263192515.1620184484.1620446020.1620457814.4; user-key=0b8dc2f4-2e46-4178-8c58-d79807c574a8; JSESSIONID=A78FAE76BB100F9EC434758A67B497DE.s1; shshshsID=94016ff0884e79869d8cd660218c4df0_7_1620458181872; 3AB9D23F7A4B3C9B=B4DW3FAKMHOR6STSLDWMLQLYQRNAKJFGISLC7VFM2YJ4DWCYZBW5G3OJR4QPTJOGL6QMKVZ7L6YKESW6E232GHJV7Y; __jdb=122270672.7.16201844836811263192515|4.1620457814',
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

module.exports = requestAndSaveRateSummery360;

// iPhone 11 Series
requestAndSaveRateSummery360(
    'iphone-11',
    [100008348530,100005492521,100012041880,100004770237,100004770255,100005492489,100010932317],
    1620458187545,
);

// iPhone 12 Series
requestAndSaveRateSummery360(
    'iphone-12',
    [100009077475,100016034372,100016034354,100009077453,100009344053,100010957457,100020227458,100010957449,100009836743,100010957445],
    1620460519723,
);

// Aidpods
requestAndSaveRateSummery360(
    'airpods',
    [100009691096,100004325476,100017128654],
    1620460676902,
);
