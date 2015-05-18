#!/bin/bash

consul agent -data-dir=/tmp/consul &
consul join 172.17.42.1
/usr/sbin/sshd -D -e

