## compiler的学习

### tokenizer的学习

* 记录一下current的值(每一个字符的位置，一个loop扫描所有的字符)
* 匹配到特殊字符直接返回定义的`token`值
  * 例如`(`, `)`等