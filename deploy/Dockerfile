FROM nginx:1.25-alpine3.18

ENV TZ Asia/Shanghai

RUN sed -i 's/dl-cdn.alpinelinux.org/mirrors.tuna.tsinghua.edu.cn/g' /etc/apk/repositories && \
  apk add alpine-conf && \
  /sbin/setup-timezone -z Asia/Shanghai && \
  apk del alpine-conf


COPY conf/nginx.conf /etc/nginx/nginx.conf
COPY dist /usr/share/nginx/html/

EXPOSE 8092
