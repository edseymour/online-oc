FROM fedora

USER 0

ENV OCREL=https://github.com/openshift/origin/releases/download/v3.7.1/openshift-origin-client-tools-v3.7.1-ab0f056-linux-64bit.tar.gz
ENV GOPATH=/go

# Install OC client tool
RUN  curl -L --silent -o oc.tar.gz $OCREL && ls -l && \
     yum install -y tar gzip findutils && \
     mkdir /tmp/oc && \
     tar -xvf oc.tar.gz -C /tmp/oc && \
     find /tmp/oc -name "oc" -type f -exec mv {} /usr/bin \; && \
     rm -rf /tmp/oc oc.tar.gz && \
     yum clean all 

# Install Gotty
RUN  mkdir /go && chmod 755 /go && yum install -y git golang-bin && go get github.com/yudai/gotty && yum clean all && mkdir /workspace && chmod 777 workspace

WORKDIR /workspace

EXPOSE 8080

USER 1001

ENTRYPOINT ["/go/bin/gotty"]
CMD ["-w","bash"]
