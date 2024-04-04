```bash
npm i jsonwebtoken
```

```javascript
const jwt = require('jsonwebtoken')

// 密钥
const secretkey = 'key_key'

// 账号和密码作为载荷 生成token，设置过期时间为 1 hour
const token = jwt.sign({account, password}, secretkey, {expiresIn: '1h'})

// 收到账号和密码之后进行token验证
jwt.verify(token, secretkey, (err, data)=>{
    // 解析出来的是生成token时的载荷以及
    // ita: 签发时间，从1970年1月1日到现在的秒数
    // exp：过期时间，从1970年1月1日到过期时的秒数
    const {account, password, ita, exp} = data;
  
})
```
