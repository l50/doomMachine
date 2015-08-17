# == Class: powersploit
#
# This module installs Powersploit, a very powerful post-exploitation tool
# against Windows targets.
#
# === Parameters
#
# N/A
#
# === Variables
#
# N/A
#
# === Examples
#
#  class { 'powersploit' }
#
# === Authors
#
# l50 <jayson.e.grace@gmail.com>
#
# === Copyright
#
# Copyright 2015 l50
class powersploit {

# Clone Powersploit from git repo
  vcsrepo { '/opt/Powersploit':
    ensure   => present,
    provider => git,
    source   => 'git://github.com/mattifestation/PowerSploit.git',
    require  => Class['git'],
    before   => [
      Exec['download_listener'],
      Exec['download_ps_encoder'],
    ],
  }

# Get listener start script required by Powersploit to function
  exec { 'download_listener':
    command => "/usr/bin/wget -q https://raw.github.com/obscuresec/random/master/StartListener.py -O /opt/Powersploit/StartListener.py",
    creates => "/opt/Powersploit/StartListener.py",
    path    => ['/usr/bin', '/bin', '/sbin'],
  }

# Set permissions on the Listener
  file { '/opt/Powersploit/StartListener.py':
    ensure  => present,
    owner   => root,
    group   => root,
    mode    => 0755,
    require => [
      Vcsrepo['/opt/Powersploit'],
      Exec['download_listener'],
    ],
  }

  exec { 'download_ps_encoder':
    command => "/usr/bin/wget -q https://raw.github.com/darkoperator/powershell_scripts/master/ps_encoder.py -O /opt/Powersploit/ps_encoder.py",
    creates => "/opt/Powersploit/ps_encoder.py",
    path    => ['/usr/bin', '/bin', '/sbin'],
  }

  file { '/opt/Powersploit/ps_encoder.py':
    ensure  => present,
    owner   => root,
    group   => root,
    mode    => 0755,
    require => [
      Vcsrepo['/opt/Powersploit'],
      Exec['download_ps_encoder'],
    ],
  }
}
