#!/bin/bash
# author:  mycoin (nqliujiangtao@gmail.com)
# date:    2014/1/22
# repos:   https://github.com/mycoin/validation

java -jar tool/webpacker.jar source.js --mode 1 --charset utf-8 -o min.js
echo "OK."