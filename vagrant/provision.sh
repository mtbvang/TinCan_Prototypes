#!/usr/bin/env bash

# Remove leading and trailing whitespace chars.
trim() {
    local var=$@
    var="${var#"${var%%[![:space:]]*}"}"   # remove leading whitespace characters
    var="${var%"${var##*[![:space:]]}"}"   # remove trailing whitespace characters
    echo -n "$var"
}

installNode () {
	
	wget http://nodejs.org/dist/v${NODE_VERSION}/node-v${NODE_VERSION}-linux-x64.tar.gz
	tar -C /usr/local --strip-components 1 -xzf node-v${NODE_VERSION}-linux-x64.tar.gz
	npm install -g express-generator
	npm install -g nodemon

}

installConsul () {
	wget https://dl.bintray.com/mitchellh/consul/${CONSUL_VERSION}_linux_amd64.zip	
	unzip -o ${CONSUL_VERSION}_linux_amd64.zip -d /usr/local/bin
	apt-get install -yq psmisc
	
	# Install System V service scripts and start agent
	cp /vagrant/vagrant/consulagent /etc/init.d/	
	chmod 755 /etc/init.d/consulagent
	update-rc.d consulagent defaults
	service consulagent start	
	sleep 5
	consul join 172.17.42.1
}

NODE_VERSION=$(trim ${1:-0.12.2})
CONSUL_VERSION=$(trim ${2:-0.5.0})

installNode
installConsul
apt-get install -yq git
