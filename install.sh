#!/usr/bin/env bash
set -e

## install.sh
##
## Install all of the prerequisites with the exception of vagrant and virtualbox.
##
## Jayson Grace (jayson.e.grace@gmail.com)

gem install librarian-puppet --no-ri --no-rdoc
librarian-puppet install
vagrant plugin install vagrant-librarian-puppet
