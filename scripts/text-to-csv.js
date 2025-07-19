require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { createObjectCsvWriter } = require('csv-writer');
const OpenAI = require('openai');

// 初始化 OpenAI
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    baseURL: process.env.OPENAI_BASE_URL,
});

const response_format = {
    type: 'json_schema',
    json_schema: {
        name: 'poi_data',
        schema: {
            "$schema": "http://json-schema.org/draft-07/schema#",
            "type": "object",
            "properties": {
                "name": { "type": "string" },
                "icon": { "type": "string" },
                "items": {
                    "type": "array",
                    "items": {
                        "type": "object",
                        "properties": {
                            "address": { "type": "string" },
                            "description": { "type": "string" }
                        },
                        "required": ["address", "description"]
                    }
                }
            },
            "required": ["name", "icon", "items"]
        }
    }
};
// 提取结构化数据
async function extractStructuredData(text) {
    const completion = await openai.chat.completions.parse({
        model: 'gpt-4.1-mini', // ✅ 支持 response_format 的模型
        messages: [
            {
                role: 'system',
                content: '你是一个帮助用户从文章中提取 POI 信息的助手。',
            },
            {
                role: 'user',
                content: `请从以下文章中提取 POI 类信息，icon用emoji图标，地址要是方便地图软件搜索的地址，返回结构需符合 JSON schema：\n${text}`,
            },
        ],
        response_format: response_format, // ✅ 传入一个非空的 name
    });

    return completion.choices[0].message.parsed;
}

// CLI 参数读取
const inputFilename = process.argv[2];
if (!inputFilename) {
    console.error('❌ 请传入输入文件名，例如 node extract-article.js article.txt');
    process.exit(1);
}

const INPUT_FILE = path.join(__dirname, '../data', inputFilename);
const OUTPUT_FILE = path.join(
    __dirname,
    '../data',
    inputFilename.replace(/\.\w+$/, '') + '.csv'
);

const article = fs.readFileSync(INPUT_FILE, 'utf-8').trim();

async function main() {
    const parsed = await extractStructuredData(article);

    if (!parsed || !parsed.items) {
        console.error('❌ 无法解析结构化数据');
        return;
    }

    const csvWriter = createObjectCsvWriter({
        path: OUTPUT_FILE,
        header: [
            { id: 'name', title: 'name' },
            { id: 'icon', title: 'icon' },
            { id: 'address', title: 'address' },
            { id: 'description', title: 'description' },
        ],
    });

    const records = parsed.items.map((item) => ({
        name: parsed.name,
        icon: parsed.icon,
        address: item.address,
        description: item.description,
    }));

    await csvWriter.writeRecords(records);
    console.log(`✅ 提取成功，CSV 文件已保存至：${OUTPUT_FILE}`);
}

main().catch(console.error);
