powersploit
===================


[![License](http://img.shields.io/:license-mit-blue.svg)](http://doge.mit-license.org)

#### Table of Contents

1. [Overview](#overview)
2. [Module Description - What the module does and why it is useful](#module-description)
3. [Setup - The basics of getting started with powersploit](#setup)
    * [What powersploit affects](#what-powersploit-affects)
    * [Setup requirements](#setup-requirements)
    * [Beginning with powersploit](#beginning-with-powersploit)
4. [Usage - Configuration options and additional functionality](#usage)
5. [Reference - An under-the-hood peek at what the module is doing and how](#reference)
5. [Limitations - OS compatibility, etc.](#limitations)
6. [Development - Guide for contributing to the module](#development)

## Overview

Used to install Powersploit

## Module Description

This module will install the Powersploit post exploitation tool

## Setup

### What powersploit affects

* A list of files, packages, services, or operations that the module will alter,
  impact, or execute on the system it's installed on.
* This is a great place to stick any warnings.
* Can be in list or paragraph form.

### Setup Requirements **OPTIONAL**

Both the git and stdlib puppet modules are required for this module to work
properly. Please add these to your Puppetfile like so:

```
mod 'puppetlabs/stdlib'
mod 'puppetlabs/git'
```

### Beginning with powersploit

This module should just work right out of the box. There are no parameters or variables.

## Usage

```
class { 'powersploit': }
```
## Limitations

This has been tested on Kali Linux, which is Debian based.

## Development

Feel free to fork this up and issue a pull request if you want to improve on the
work that has already been done.

## Release Notes/Contributors/Etc

Jayson Grace (l50) <jayson.e.grace@gmail.com
