## 目录结构说明

* fileFromSlice			-- 存放分片上传的文件
* routers
  * multiple.js		-- 处理多文件上传
  * single.js			-- 处理单文件上传
* tempChunk			-- 分片上传的临时存储目录
  * 为每一个分片上传的文件建立一个目录，用于存放分片，合并完成后该目录将被删除
* tempFile				-- 存放分分片上传的文件
* util
* index.js				-- express 入口文件
* test.html				-- 前端界面入口文件


## spark-md5

https://www.jsdelivr.com/package/npm/spark-md5

哈希算法，用于对指定内容单向生成一个哈希值

## multer

https://www.jsdelivr.com/package/npm/multer

nodejs 中间件，用于实现文件的上传

https://blog.csdn.net/Charissa2017/article/details/105207422


## 分片上传参考

https://blog.csdn.net/CRMEB/article/details/135203003#:~:text=%E5%88%86%E7%89%87%E4%B8%8A%E4%BC%A0%E7%9A%84%E5%8E%9F%E7%90%86%E5%B0%B1%E5%83%8F%E6%98%AF%E6%8A%8A%E4%B8%80%E4%B8%AA%E5%A4%A7%E8%9B%8B%E7%B3%95%E5%88%87%E6%88%90%E5%B0%8F%E5%9D%97%E4%B8%80%E6%A0%B7%E3%80%82%20%E9%A6%96%E5%85%88%EF%BC%8C%E6%88%91%E4%BB%AC%E5%B0%86%E8%A6%81%E4%B8%8A%E4%BC%A0%E7%9A%84%E5%A4%A7%E6%96%87%E4%BB%B6%E5%88%86%E6%88%90%E8%AE%B8%E5%A4%9A%E5%B0%8F%E5%9D%97%EF%BC%8C%E6%AF%8F%E4%B8%AA%E5%B0%8F%E5%9D%97%E5%A4%A7%E5%B0%8F%E7%9B%B8%E5%90%8C%EF%BC%8C%E6%AF%94%E5%A6%82%E6%AF%8F%E5%9D%97%E5%A4%A7%E5%B0%8F%E4%B8%BA1MB%E3%80%82,%E7%84%B6%E5%90%8E%EF%BC%8C%E6%88%91%E4%BB%AC%E9%80%90%E4%B8%AA%E4%B8%8A%E4%BC%A0%E8%BF%99%E4%BA%9B%E5%B0%8F%E5%9D%97%E5%88%B0%E6%9C%8D%E5%8A%A1%E5%99%A8%E3%80%82%20%E4%B8%8A%E4%BC%A0%E7%9A%84%E6%97%B6%E5%80%99%EF%BC%8C%E5%8F%AF%E4%BB%A5%E5%90%8C%E6%97%B6%E4%B8%8A%E4%BC%A0%E5%A4%9A%E4%B8%AA%E5%B0%8F%E5%9D%97%EF%BC%8C%E4%B9%9F%E5%8F%AF%E4%BB%A5%E4%B8%80%E4%B8%AA%E4%B8%80%E4%B8%AA%E5%9C%B0%E4%B8%8A%E4%BC%A0%E3%80%82%20%E4%B8%8A%E4%BC%A0%E6%AF%8F%E4%B8%AA%E5%B0%8F%E5%9D%97%E5%90%8E%EF%BC%8C%E6%9C%8D%E5%8A%A1%E5%99%A8%E4%BC%9A%E4%BF%9D%E5%AD%98%E8%BF%99%E4%BA%9B%E5%B0%8F%E5%9D%97%EF%BC%8C%E5%B9%B6%E8%AE%B0%E5%BD%95%E5%AE%83%E4%BB%AC%E7%9A%84%E9%A1%BA%E5%BA%8F%E5%92%8C%E4%BD%8D%E7%BD%AE%E4%BF%A1%E6%81%AF%E3%80%82
