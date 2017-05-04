FROM openshift/nodejs-010-centos7:latest

USER 0

RUN  curl -o oc.tar.gz https://github.com/openshift/origin/releases/download/v1.5.0/openshift-origin-client-tools-v1.5.0-031cbe4-linux-64bit.tar.gz && ls -l && yum install -y tar gzip && mkdir /tmp/oc && tar -xvf oc.tar.gz -C /tmp/oc && find /tmp/oc -name "oc" -type f -exec mv {} /usr/bin \; && rm -rf /tmp/oc oc.tar.gz && yum clean all -y

USER 1001
