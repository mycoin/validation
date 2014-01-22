[使用方法]

java -jar webpacker.jar [inputfile] [options]
参数说明：
    --charset charset ：指定文件的字符集。
    --line-break ：设置压缩结果保留行号。该选项常用于调试。
    --mode mode ：指定压缩模式。0：只去除空格和注释；1：优化gzip结果的压缩；2：压缩后活动最小的文本结果；3：采用文本压缩。
    -o outputfile ：指定输出文件。

java -jar webpacker.jar source.js --mode 1 --charset utf-8 -o target.js