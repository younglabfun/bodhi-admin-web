#!/bin/bash

SRVNAME="admin-web"

TAGFILE="dist.tar.gz"

build_bin(){
    echo "build ${SRVNAME}"
    npm run build:prod |grep "Build"
    echo "build finished"
}
tar_file(){
    tar zcvf ${TAGFILE} ./dist
}

echo "domail mode"
build_bin
tar_file
echo "tar file finished"
echo "upload ${TAGFILE} -> server"
scp ${TAGFILE} root@server:/root
