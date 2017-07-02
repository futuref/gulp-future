module.exports = {
  'extends': "google",
  // 执行环境
  'env': {
    "browser":true,
    "node":true
  },
  // 根据需要修改一些规则
  'rules': {
    'max-len': [1,
      {
        'code': 100,
        'tabWidth': 2,
        'ignoreUrls': true,
        "ignoreComments": true, // 忽略所有拖尾注释和行内注释
			}
    ], // warn 100强制一行的最大长度
     'no-var': 0  //禁用var，用let和const代替var
  }
}
