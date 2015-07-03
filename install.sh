#!/usr/bin/env bash
## install.sh
##
## Install all of the prerequisites with the exception of vagrant and virtualbox.
##
## Jayson Grace (jayson.e.grace@gmail.com)
set -e

gem install librarian-puppet --no-ri --no-rdoc
librarian-puppet install
vagrant plugin install vagrant-librarian-puppet
