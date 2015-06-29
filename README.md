# Doom Machine
This is a penetration testing box that will be integrated into AndroPuppet (https://github.com/l50/AndroPuppet) as a module. It can also be used on its own.

## Included Tools

* Arachni
* PeepingTom
* Discover
* SMBMap
* Powersploit
* Banner-plus NSE Script
* Veil
* Docker
* PhishingFrenzy
* Firefox
* OpenSSL 1.0.2
* Web Developer Add-on (Firefox)
* Tamper Data Add-on (Firefox)
* HackBar Add-on (Firefox)
* FoxyProxy Add-on (Firefox)
* User Agent Switcher Add-on (Firefox)

##Installation Instructions
1. Download vagrant from here: http://www.vagrantup.com/downloads.html
2. To install on a debian-based platform, use dpkg -i
3. Download and install VirtualBox from here: https://www.virtualbox.org/wiki/Downloads
Be sure to install VirtualBox and Vagrant, these are important!

##Usage
1. git clone this repo: git clone git://github.com/l50/doomMachine.git
2. cd wherever you installed it/doomMachine
3. Open the Vagrant file and change this line: config.vm.network "public_network", bridge: 'en0: Wi-Fi (AirPort)' to reflect your network interface.
4. Build the box by typing: vagrant up
5. Wait for everything to install (you can monitor this by watching the terminal window)
6. Change the password for the vagrant user as well as the root user. 
7. Pwn things
8. Offload all the data you want to save
9. Destroy the box by typing: vagrant destroy -f

##Additional Information
###Veil:
Run veil-evasion and be sure to update if required - WINE = automation not happening.

###Firefox Addons:
Be sure to go in and enable them. They are disabled by default.

###You got an Oh no! Something has gone wrong after typing "vagrant up"
Don't worry about it, click Log Out and log back in. Be sure to "sudo -s"

### Something Missing?
Let me know: jayson.e.grace@gmail.com



Resources
---

Puppet - https://github.com/puppetlabs/puppet

Vagrant - https://github.com/mitchellh/vagrant

Kali Linux - https://www.kali.org/

License
----

Apache
