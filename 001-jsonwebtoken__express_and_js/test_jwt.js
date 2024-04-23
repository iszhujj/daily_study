const express = require('express')
const jwt = require('jsonwebtoken')
const cors = require('cors')

const app = express()

// 解决跨域问题
app.use(cors())
// 解析请求体中的json对象，并将其转换成JavaScript对象，写回原处
app.use(express.json())
// express 默认不解析请求体中的数据，该中间件将请求体中的数据解析成JavaScript对象
// 并写入到req.body中
app.use(express.urlencoded({ extended: true }))

// 指定签名密钥用于加密和解密
const secretkey = "zhujj"

// 用于临时存储已有的用户信息
var userInfo = new Map()
userInfo.set('123123', '123123')

// 通过携带token来发起默认登录
app.post('/default_login', (req, res)=>{
    // 前端的请求头中携带 token在authorization中
    const token = req.headers['authorization']
    if(!token) {
        res.json({result:false, msg:'缺少token'})
        return
    }
    // 根据token和密钥进行验证
    jwt.verify(token, secretkey, (err, data)=>{
        // 解析出来的是生成token时的载荷以及
        // ita: 签发时间，从1970年1月1日到现在的秒数
        // exp：过期时间，从1970年1月1日到过期时的秒数
        const {account, password} = data;
        if(err) res.status(403).json({result:false, msg:'token不正确'})
        else{
            const token = jwt.sign({account, password}, secretkey, {expiresIn: '1h'})
            res.json({result:true, account, token, msg:''})
        }
    })
})

// 注册
app.post('/regist', (req, res)=>{
    const {account, password} = req.body;
    if(userInfo.has(account)){
        res.status(200).json({result:false, msg:'该用户已存在'})
    }else{
        // 添加用户信息
        userInfo.set(account, password)
        const token = jwt.sign({account, password}, secretkey, {expiresIn: '1h'})
        // 将token返回
        res.json({result:true, token, account, msg:''})
    }
})

// 登录
app.post('/login', (req, res)=>{
    const {account, password} = req.body;
    if(userInfo.has(account) && userInfo.get(account) === password){
        // 生成 token，载荷为用户名和密码，过期时间是一个小时
        const token = jwt.sign({account, password}, secretkey, {expiresIn: '1h'})
        res.json({result:true, token, account, msg:''})
    }else{
        res.status(401).json({result:false, msg:'用户名或密码错误'})
    }
})

app.listen(3000, ()=>{
    console.log(`3000 listening`)
})




