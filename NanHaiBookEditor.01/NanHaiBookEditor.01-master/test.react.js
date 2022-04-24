'use strict';

const fp = require('fs').promises;
const bom2buyV2Z = require('./test-bom2buy-zh.json');

const bom2buyZ2V = Object.keys(bom2buyV2Z).reduce((accr, v) => {
  accr[bom2buyV2Z[v].trim()] = v;
  return accr;
}, {});

// 获取目录下所有文件
async function getAllFiles(dir) {
  let allFiles = [];
  const files = await fp.readdir(dir, { withFileTypes: true });
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const filepath = `${dir}/${file.name}`;
    if (file.isDirectory()) {
      allFiles = allFiles.concat(await getAllFiles(filepath));
    } else {
      allFiles.push(filepath);
    }
  }
  return allFiles;
}

// 从字符串中匹配中文
function getChinese(p) {
  let str;
  let fileRows;
  let rowIndex;
  if (typeof p === 'string') {
    str = p;
  } else {
    fileRows = p.fileRows;
    rowIndex = p.rowIndex;
    str = fileRows[rowIndex];
  }

  // return [ ...string.matchAll(/[\u4e00-\u9fa5。？！，、；：“”‘'（）《》〈〉【】『』「」﹃﹄〔〕…～﹏￥—]+/g) ].map(ret => ret[0]);
  // const regexp = /[0-9。？！，、；：“”‘（）《》〈〉【】『』「」﹃﹄〔〕…～﹏￥—/]*[\u4e00-\u9fa5]+[0-9a-zA-Z\u0020。？！，、；：“”‘（）《》〈〉【】『』「」﹃﹄〔〕…～﹏￥—/]*[\u4e00-\u9fa5]*[0-9。？！，、；：“”‘（）《》〈〉【】『』「」﹃﹄〔〕…～﹏￥—/]*/g;
  // const regexp = /[\u4e00-\u9fa5][\u4e00-\u9fa50-9a-zA-Z\u0020。？！，、；：“”‘（）《》〈〉【】『』「」﹃﹄〔〕…～﹏￥—/]*/g;

  // 双、单引号，还需要判断是否为标签属性
  // 反引号，里面肯定要指定为变量

  const retDoubleQueto = Array.from(
    str.matchAll(/"[^"<{}>']*[\u4e00-\u9fa5]+[^"<{}>']*"/g)
  ).map(ret => ({ zh: ret[0].trim().replace(/[:：]$/, ''), type: 'double' }));
  retDoubleQueto.forEach(regRet => {
    str = str.replace(regRet.zh, '');
    if (fileRows) {
      const temp = fileRows[rowIndex];
      fileRows[rowIndex] = fileRows[rowIndex].replace(
        regRet.zh,
        'QQQQQQQQQQWWWWWWWWW'
      );
      const tempFileContent = fileRows.join('');
      regRet.isCode = !/<[^<]+=QQQQQQQQQQWWWWWWWWW/.test(tempFileContent);
      fileRows[rowIndex] = temp;
    }
  });

  const retSingleQueto = Array.from(
    str.matchAll(/'[^'<{}>"]*[\u4e00-\u9fa5]+[^'<{}>"]*'/g)
  ).map(ret => ({ zh: ret[0].trim().replace(/[:：]$/, ''), type: 'single' }));
  retSingleQueto.forEach(regRet => {
    str = str.replace(regRet.zh, '');
    if (fileRows) {
      const temp = fileRows[rowIndex];
      fileRows[rowIndex] = fileRows[rowIndex].replace(
        regRet.zh,
        'QQQQQQQQQQWWWWWWWWW'
      );
      const tempFileContent = fileRows.join('');
      regRet.isCode = !/<[^<]+=QQQQQQQQQQWWWWWWWWW/.test(tempFileContent);
      fileRows[rowIndex] = temp;
    }
  });

  const retBackQueto = [
    ...str.matchAll(/`[^`<]*[\u4e00-\u9fa5]+[^`<]*`/g)
  ].map(ret => ({ zh: ret[0].trim().replace(/[:：]$/, ''), type: 'back' }));
  // let retBackQuetoV2 = [];
  retBackQueto.forEach(regRet => {
    // `须按包装量 ${numeral(record.min_pack).format('0,0')} 递增`
    str = str.replace(regRet.zh, '');
    // retBackQuetoV2 = retBackQuetoV2.concat(Array.from(regRet.zh.matchAll(/[^`<{$}]*[\u4e00-\u9fa5]+[^<`{$}]*/g)).map(ret => ({ zh: ret[0].trim().replace(/[:：]$/, ''), type: 'back' })));
  });

  const retText = Array.from(str.matchAll(/[^<{}>]*[\u4e00-\u9fa5]+[^<{}>]*/g))
    .map(ret => ({ zh: ret[0].trim().replace(/[:：]$/, ''), type: 'text' }))
    .filter(ret => !(ret.zh.startsWith('/*') && ret.zh.endsWith('*/')));
  retText.forEach(regRet => {
    regRet.isCode = false;
  });

  return [...retDoubleQueto, ...retSingleQueto, ...retBackQueto, ...retText];
}

// 编辑距离
function minDistance(s1, s2) {
  const len1 = s1.length;
  const len2 = s2.length;

  const matrix = [];

  for (let i = 0; i <= len1; i++) {
    matrix[i] = [];
    for (let j = 0; j <= len2; j++) {
      if (i === 0) {
        matrix[i][j] = j;
      } else if (j === 0) {
        matrix[i][j] = i;
      } else {
        let cost = 0;
        if (s1[i - 1] !== s2[j - 1]) {
          cost = 1;
        }
        const temp = matrix[i - 1][j - 1] + cost;

        matrix[i][j] = Math.min(
          matrix[i - 1][j] + 1,
          matrix[i][j - 1] + 1,
          temp
        );
      }
    }
  }
  return matrix[len1][len2];
}

async function getTargetFiles() {
  const allFiles = await getAllFiles('./src/components/Timer');
  return allFiles.filter(file => {
    return (
      file.endsWith('.js') &&
      !file.endsWith('.test.js') &&
      !file.includes('.umi') &&
      file.includes('src/components/Timer')
    );
  });
}

async function genZh() {
  const files = await getTargetFiles();
  let zhs = [];
  for (const filepath of files) {
    const fileContent = await fp.readFile(filepath, { encoding: 'utf8' });
    const fileRows = fileContent.split('\n');
    for (let i = 0; i < fileRows.length; i++) {
      const row = fileRows[i];
      // 对于注释行，忽略不处理
      if (
        row.trim().startsWith('//') ||
        row.trim().startsWith('*') ||
        /[^\u4e00-\u9fa5]+\/\/[^\u4e00-\u9fa5]*[\u4e00-\u9fa5]+/.test(row)
      )
        continue;

      // 获取中文片段
      const chinese = getChinese(row);
      if (chinese.length) {
        for (const ret of chinese) {
          if (ret.zh.endsWith("'") && ret.zh.startsWith("'")) {
            ret.zh = ret.zh.replace(/'/g, '');
          }

          if (ret.zh.endsWith('"') && ret.zh.startsWith('"')) {
            ret.zh = ret.zh.replace(/"/g, '');
          }

          zhs.push(ret.zh);
        }
      }
    }
  }

  // 构建 map
  let count = 1;
  zhs = Array.from(new Set(zhs));
  const zhsMap = zhs.reduce((accr, zh) => {
    accr[bom2buyZ2V[zh] || 'variable' + count++] = zh;
    return accr;
  }, {});

  await fp.writeFile(
    './test-bom2buy-zh-v2.json',
    JSON.stringify(zhsMap, null, 4)
  );
}

async function findFilesChinese() {
  const files = await getTargetFiles();

  let chinesePhrases = [];
  const details = [];
  for (const filepath of files) {
    // console.log(filepath); return;
    const fileContent = await fp.readFile(filepath, { encoding: 'utf8' });
    const fileRows = fileContent.split('\n');

    // 这里按行匹配
    for (let i = 0; i < fileRows.length; i++) {
      const row = fileRows[i];
      // 对于注释行，忽略不处理
      if (
        row.trim().startsWith('//') ||
        row.trim().startsWith('*') ||
        /[^\u4e00-\u9fa5]+\s*\/\/\s*[\u4e00-\u9fa5]+/.test(row)
      )
        continue;

      // 获取中文片段
      const chinese = getChinese(row);
      if (chinese.length) {
        // console.log(filepath, index + 1, chinese);
        details.push({
          path: filepath,
          rowNum: i + 1,
          chinese
        });

        chinesePhrases = chinesePhrases.concat(chinese);
      }
    }
  }

  // 变量名处理
  // const erpV2Z = {};
  // let count = 1;
  // let count2 = 1;
  // const bom2buyzhs = Object.keys(bom2buyZ2V);
  // chinesePhrases = [...new Set(chinesePhrases.map(cp => cp.trim()))].forEach(zh => {
  //     if (bom2buyZ2V[zh] || bom2buyZ2V[zh.replace('：', '')]) {
  //         erpV2Z[bom2buyZ2V[zh] || bom2buyZ2V[zh.replace('：', '')]] = zh;
  //         return;
  //         // erpV2Z[ || 'variable' + count++] = zh;
  //     }

  //     const distanceRet = [];
  //     bom2buyzhs.forEach(bzh => {
  //         const distance = minDistance(zh, bzh);
  //         distanceRet.push({
  //             bzh,
  //             distance,
  //         });
  //     });
  //     distanceRet.sort((a, b) => a.distance - b.distance);
  //     const min = distanceRet[0];
  //     if (min.distance / zh.length < 0.4) {
  //         erpV2Z[erpV2Z[bom2buyZ2V[min.bzh]] ? bom2buyZ2V[min.bzh] + count2++ : bom2buyZ2V[min.bzh]] = zh;
  //     } else {
  //         erpV2Z['variable' + count++] = zh;
  //     }
  // });

  // 变量名处理
  const erpV2Z = {};
  let count = 1;
  chinesePhrases = [...new Set(chinesePhrases.map(cp => cp.trim()))].forEach(
    zh => {
      erpV2Z[
        bom2buyZ2V[zh] ||
          bom2buyZ2V[zh.replace('：', '')] ||
          'variable' + count++
      ] = zh;
    }
  );

  await fp.writeFile(
    './test-result-details.json',
    JSON.stringify(details, null, 4)
  );
  await fp.writeFile(
    './test-result-chinese.json',
    JSON.stringify(erpV2Z, null, 4)
  );
}

async function replaceFilesChinese() {
  const files = await getTargetFiles();
  const erpV2ZMap = JSON.parse(
    await fp.readFile('./test-enterprise.json', { encoding: 'utf8' })
  );
  const erpZ2VMap = Object.keys(erpV2ZMap).reduce((accr, v) => {
    accr[erpV2ZMap[v].trim()] = v;
    return accr;
  }, {});

  for (const filepath of files) {
    console.log(filepath);
    const fileContent = await fp.readFile(filepath, { encoding: 'utf8' });
    const fileRows = fileContent.split('\n');

    // 这里按行匹配
    let tempLoopLimitCount = 1;
    let hasChinese = false;
    for (let i = 0; i < fileRows.length; i++) {
      // if (tempLoopLimitCount++ > 2) break;

      const row = fileRows[i];
      // 对于注释行，忽略不处理
      if (
        row.trim().startsWith('//') ||
        row.trim().startsWith('*') ||
        /[^\u4e00-\u9fa5]+\s*\/\/\s*[\u4e00-\u9fa5]+/.test(row)
      )
        continue;

      // 获取中文片段
      const chinese = getChinese(row);
      if (chinese.length) {
        hasChinese = true;
        for (let j = 0; j < chinese.length; j++) {
          const zh = chinese[j];
          let notCode = false;
          let placeholder = 'GGGGGGGGGGJJJJJJJJJJJEEEEEEEE';
          fileRows[i] = fileRows[i].replace(zh, placeholder);
          const content = fileRows.join('');
          const indexes = [];
          const tempStack = [];
          [...content.matchAll(/(\(\s*<|>\s*\))/g)].forEach(ret => {
            const sym = ret[0].replace(/\s/g, '');
            const index = ret.index;
            if (!tempStack.length) {
              tempStack.push({ sym, index });
            } else if (tempStack[tempStack.length - 1].sym !== sym) {
              // console.log(tempStack[tempStack.length - 1].sym, sym);
              indexes.push({ start: tempStack.pop().index, end: index + 2 });
            } else {
              tempStack.push({ sym, index });
            }
            // console.log(ret[0].replace(/\s/g, ''), ret.index);
          });

          let htmlContent = '';
          while (indexes.length) {
            const indexInfo = indexes.shift();
            htmlContent += content.substring(indexInfo.start, indexInfo.end);
            // const str = content.substring(indexes.shift(), indexes.shift() + 2);
            // console.log(str);
          }

          // console.log(htmlContent, '\n\n\n\n');
          notCode =
            htmlContent.includes('GGGGGGGGGGJJJJJJJJJJJEEEEEEEE') &&
            !/{[^{}]*GGGGGGGGGGJJJJJJJJJJJEEEEEEEE[^{}]*}/.test(htmlContent);

          // isCode = !(
          //     (/<[^<]*GGGGGGGGGGJJJJJJJJJJJEEEEEEEE[^<]*\/[0-9a-zA-Z]*>/.test(filecontent)
          //     && !/<[^<]*{[^<{}]*GGGGGGGGGGJJJJJJJJJJJEEEEEEEE[^<{}]*}[^<]*\/[0-9a-zA-Z]*>/.test(filecontent))
          //     || (/<[^<]*>[^<]*GGGGGGGGGGJJJJJJJJJJJEEEEEEEE[^<]*<[^<]*\/[0-9a-zA-Z]*>/.test(filecontent)
          //     && !/<[^<]*>[^<]*{[^<{}]*GGGGGGGGGGJJJJJJJJJJJEEEEEEEE[^<{}]*}[^<]*<[^<]*\/[0-9a-zA-Z]*>/.test(filecontent))
          // );
          // isCode = !(
          //     /\(<[^;]*GGGGGGGGGGJJJJJJJJJJJEEEEEEEE[^;]*\/[0-9a-zA-Z]*>\)/.test(fileContent) && !/\(<[^;]*{[^;{}]*GGGGGGGGGGJJJJJJJJJJJEEEEEEEE[^;{}]*}[^;]*\/[0-9a-zA-Z]*>\)/.test(fileContent)
          // );

          if (fileRows[i].includes(`"${placeholder}"`)) {
            placeholder = `"${placeholder}"`;
            // fileRows[i] = fileRows[i].replace(`"${placeholder}"`, `{ formatMessage({ id: '${erpZ2VMap[zh.trim()]}' }) }`);
          } else if (fileRows[i].includes(`'${placeholder}'`)) {
            placeholder = `'${placeholder}'`;
            // fileRows[i] = fileRows[i].replace(`'${zh}'`, `{ formatMessage({ id: '${erpZ2VMap[zh.trim()]}' }) }`);
          }

          if (notCode) {
            fileRows[i] = fileRows[i].replace(
              placeholder,
              `{ props.trans.timer.${erpZ2VMap[zh.trim()]} }`
            );
          } else {
            fileRows[i] = fileRows[i].replace(
              placeholder,
              `props.trans.timer.${erpZ2VMap[zh.trim()]}`
            );
          }
        }
      }
    }

    // if (hasChinese) {
    //   fileRows.unshift("import { formatMessage } from 'umi/locale';");
    //   await fp.writeFile(filepath, fileRows.join('\n'), { encoding: 'utf8' });
    // }
  }
}

async function replaceFilesChineseV2() {
  const files = await getTargetFiles();
  const erpV2ZMap = {};
  const erpZ2VMap = {};

  let variableCount = 1;
  for (const filepath of files) {
    const fileContent = await fp.readFile(filepath, { encoding: 'utf8' });
    const fileRows = fileContent.split('\n');

    // 这里按行匹配
    let hasChinese = false;
    for (let i = 0; i < fileRows.length; i++) {
      const row = fileRows[i];
      // 对于注释行，忽略不处理
      if (
        row.trim().startsWith('//') ||
        row.trim().startsWith('*') ||
        /[^\u4e00-\u9fa5]+\/\/[^\u4e00-\u9fa5]*[\u4e00-\u9fa5]+/.test(row)
      )
        continue;

      // 获取中文片段
      const chinese = getChinese({ fileRows: fileRows.slice(), rowIndex: i });
      if (chinese.length) {
        hasChinese = true;
        for (let j = 0; j < chinese.length; j++) {
          const regRet = chinese[j];

          // zhkey for variable name
          regRet.zhkey = regRet.zh;
          if (regRet.zh.endsWith("'") && regRet.zh.startsWith("'")) {
            regRet.zhkey = regRet.zh.replace(/'/g, '').trim();
          }

          if (regRet.zh.endsWith('"') && regRet.zh.startsWith('"')) {
            regRet.zhkey = regRet.zh.replace(/"/g, '').trim();
          }

          // replace zh
          if (regRet.type === 'back') {
            let newZh = regRet.zh;
            const subzhs = Array.from(
              regRet.zh.matchAll(/[^`<{$}]*[\u4e00-\u9fa5]+[^<`{$}]*/g)
            ).map(ret => ret[0].trim().replace(/[:：]$/, ''));
            for (const subzh of subzhs) {
              if (!erpZ2VMap[subzh]) {
                erpZ2VMap[subzh] =
                  bom2buyZ2V[subzh] || 'variable' + variableCount++;
                erpV2ZMap[erpZ2VMap[subzh]] = subzh;
              }
              newZh = newZh.replace(
                subzh,
                '${' + `props.trans.timer.${erpZ2VMap[subzh]}` + '}'
              );
            }
            fileRows[i] = fileRows[i].replace(regRet.zh, newZh);
          } else if (regRet.isCode) {
            if (!erpZ2VMap[regRet.zhkey]) {
              erpZ2VMap[regRet.zhkey] =
                bom2buyZ2V[regRet.zhkey] || 'variable' + variableCount++;
              erpV2ZMap[erpZ2VMap[regRet.zhkey]] = regRet.zhkey;
            }
            fileRows[i] = fileRows[i].replace(
              regRet.zh,
              `props.trans.timer.${erpZ2VMap[regRet.zhkey]}`
            );
          } else {
            if (!erpZ2VMap[regRet.zhkey]) {
              erpZ2VMap[regRet.zhkey] =
                bom2buyZ2V[regRet.zhkey] || 'variable' + variableCount++;
              erpV2ZMap[erpZ2VMap[regRet.zhkey]] = regRet.zhkey;
            }
            fileRows[i] = fileRows[i].replace(
              regRet.zh,
              `{props.trans.timer.${erpZ2VMap[regRet.zhkey]}}`
            );
          }
        }
      }
    }

    if (
      hasChinese &&
      !fileContent.includes("import { formatMessage } from 'umi/locale';")
    ) {
      fileRows.unshift("import { formatMessage } from 'umi/locale';");
      await fp.writeFile(filepath, fileRows.join('\n'), { encoding: 'utf8' });
    }
  }

  // 在已有基础上，筛选
  Object.keys(erpV2ZMap).forEach(k => {
    if (bom2buyV2Z[k]) {
      delete erpV2ZMap[k];
    }
  });
  await fp.writeFile(
    './test-temp-enterprise-zh-v2.json',
    JSON.stringify(erpV2ZMap, null, 4)
  );
}

/**
 * 1. 提取中文片段
 * 2. 为每个中文片段，赋值一个变量名（优先从 bom2buy-zh.js 文件中找）
 * 3. 将前端文件中的中文片段，全部用变量名替代，目前替代主要分类四种情况讨论
 *      - 双引号下
 *      - 单引号下
 *      - 反引号下
 *      - 其它
 */
replaceFilesChineseV2();

// 检查是否存在 formatMessage({ id: 'undefined' }) 这样的情况，现在好像不会出现了
