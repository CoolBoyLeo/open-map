require('dotenv').config();
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const csv = require('csv-parser');

const AMAP_KEY = process.env.AMAP_KEY;
if (!AMAP_KEY) {
    console.error('❌ 请在.env文件中配置 AMAP_KEY');
    process.exit(1);
}

const fileName = process.argv[2];
if (!fileName) {
    console.error('❌ 请在命令行中指定 CSV 文件名，例如：node convert-to-geojson.js parking.csv');
    process.exit(1);
}

const INPUT_CSV = path.join(__dirname, '../data', fileName);
const OUTPUT_GEOJSON = path.join(__dirname, '../data', fileName.replace(/\.csv$/, '.geojson'));

// 调用高德 API 获取经纬度
async function geocode(address) {
    const url = `https://restapi.amap.com/v3/geocode/geo?address=${encodeURIComponent(address)}&output=JSON&key=${AMAP_KEY}`;
    try {
        const response = await axios.get(url);
        const result = response.data;
        if (result.status === '1' && result.geocodes.length > 0) {
            const [lng, lat] = result.geocodes[0].location.split(',').map(Number);
            return { lng, lat };
        }
    } catch (err) {
        console.error(`❌ 地理编码失败: ${address}`, err.message);
    }
    return null;
}

// 主函数
async function main() {
    const features = [];
    const rows = [];

    // 读取 CSV 文件内容
    await new Promise((resolve, reject) => {
        fs.createReadStream(INPUT_CSV)
            .pipe(csv())
            .on('data', (row) => rows.push(row))
            .on('end', resolve)
            .on('error', reject);
    });

    console.log(`📄 读取 ${rows.length} 条记录，正在地理编码...`);

    const collectionName = rows.length > 0 ? rows[0].name || 'Unknown' : 'Unknown';
    const collectionIcon = rows.length > 0 ? rows[0]?.icon : '🌏';

    for (const row of rows) {
        const { name, address, description } = row;

        if (!address) {
            console.warn(`⚠️ 跳过缺失地址的数据: ${name}`);
            continue;
        }

        const location = await geocode(address);
        if (!location) {
            console.warn(`⚠️ 跳过无法解析的地址: ${address}`);
            continue;
        }

        features.push({
            type: 'Feature',
            geometry: {
                type: 'Point',
                coordinates: [location.lng, location.lat],
            },
            properties: {
                name,
                address,
                description,
            },
        });

        await new Promise((res) => setTimeout(res, 200)); // 避免频繁请求被限速
    }

    const geojson = {
        type: 'FeatureCollection',
        name: collectionName,
        icon: collectionIcon,
        features,
    };

    fs.writeFileSync(OUTPUT_GEOJSON, JSON.stringify(geojson, null, 2), 'utf8');
    console.log(`✅ 成功写入 GeoJSON：${OUTPUT_GEOJSON}`);
}

main().catch((err) => {
    console.error('🚨 程序运行出错：', err);
});
