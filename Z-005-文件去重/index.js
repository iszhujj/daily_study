const crypto = require('crypto')
const {
    readFileSync,
    readdirSync,
    statSync,
    createWriteStream,
    unlink
} = require('fs');
const {resolve} = require('path');
const readline = require('readline');


// 判断是否为目录
const isDir = (path)=>{
    let info = statSync(path);
    return info.isDirectory();
}

// 根据文件的后缀名判断是否应该处理该项目
const shouldDeal = (targetArr, itemName)=>{
    return targetArr.some(e => itemName.includes(e))
}

const inp = readline.createInterface({  
    input: process.stdin,  
    output: process.stdout  
});
    
// 存放根据文件内容生成的hash值
let hashMap = new Map()

async function choiceToDel(existFilePath, curPath){
    try{
        let answer = await new Promise((res, rej)=>{
            inp.question(`
请选择要删除的文件(输入1、2、3)：
1、${curPath}
2、${existFilePath}
3、都保留
请输入： `, (answer) => {
                res(answer);
            });
        })
        let index = parseInt(answer) % 10;
        if(index !== 1 && index !== 2 && index !== 3){
            choiceToDel(existFilePath, curPath);
        }else if(index === 1 || index === 2){
            const targetPath = (index === 1 ? curPath : existFilePath)
            let result = await new Promise((res, rej)=>{
                unlink(targetPath, (err)=>{
                    if(err){
                        rej(`未能删除, ${targetPath}, ${err}`)
                    }else{
                        res(`已删除, ${targetPath}`)
                    }
                })
            })
            console.log(result)
        }
    }catch(err){
        console.log('Error: ', err)
    }
}

// 传入需要处理的路径
async function action(absPath, targetArr=[]){
    // 读取当前目录下的所有文件和目录
    let items = readdirSync(absPath);
    for(let itemName of items){
        let curAbsPath = resolve(absPath, itemName);
        if(!isDir(curAbsPath)){
            // 如果是文件而不是目录，并且是要处理的文件类型
            if(shouldDeal(targetArr, itemName)){
                const hash = crypto.createHash('sha256');
        
                // 读取文件的内容
                let fileData = readFileSync(curAbsPath, 'utf-8')
            
                // 根据文件的内容生成文件hash
                let fileHash = hash.update(fileData).digest('hex')
                
                if(hashMap.has(`${fileHash}`)){
                    let existFilePath = hashMap.get(`${fileHash}`)

                    await choiceToDel(existFilePath, curAbsPath)
                    
                    // writableStream.write(
                    //     `${curAbsPath}\t====>\t${existFilePath}\n`,
                    //     (err)=>{ if(err) console.log(err)}
                    // )
                }else{
                    hashMap.set(`${fileHash}`, curAbsPath);
                }
            }
        }else{
            await action(curAbsPath, targetArr)
        }
    }
}

(async ()=>{
    // 查重的目录
    const targetPath = './testFiles'

    // 查重结果写入文件
    // const resultPath = `${targetPath}\\查重结果.txt`
    // 创建写入流
    // const writableStream = createWriteStream(resultPath);

    const absPath = resolve(targetPath);
    // 设置需要查重的文件类型
    const targetArr = ['.jpg', '.png', '.webp', '.jpeg', '.mp4']
    await action(absPath, targetArr)

    // 关闭写入流
    // writableStream.close()

    inp.close()
})()



