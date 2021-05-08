
// 写入数据
const asyncWriteChunk = async (chunk, writeStream) => {
    return new Promise((resolve, reject) => {
        writeStream.write(chunk, () => resolve());
    });
};

module.exports = {
    asyncWriteChunk,
};