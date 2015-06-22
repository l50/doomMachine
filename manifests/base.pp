node 'doomMachine'
{
  package {[
    'ipmitool',
    'shutter',
    'gimp',
  #'firefox',
    'arachni',
    'smbmap',
  ]:
    ensure => installed,
  }

  include stdlib
  include git
  include phantomjs

  exec { "apt-update":
    command => "/usr/bin/apt-get update"
  }

  Exec["apt-update"] -> Package <| |>

# Install SMBExec
  vcsrepo { '/opt/smbexec':
    ensure   => present,
    provider => git,
    source   => 'git://github.com/pentestgeek/smbexec.git',
    require  => Class['git'],
  }

  exec { 'bundle_install_smbexec':
    command => 'bundle install',
    cwd     => '/opt/smbexec',
    path    => '/usr/bin',
    require => [
      Vcsrepo['/opt/smbexec'],
    ],
  }

  file { '/opt/smbexec/installAutomated.sh':
    ensure => present,
    owner => root,
    group => root,
    mode => 0755,
    source => "/vagrant/files/smbexec/installAutomated.sh",
    require => [
      Vcsrepo['/opt/smbexec'],
      Exec['bundle_install_smbexec'],
    ],
  }

# exec { 'install_smb_exec':
#   command => '/opt/smbexec/installAutomated.sh',
#   timeout     => 0,
#   path => '/usr/bin',
#   provider => 'shell',
#   require => [
#     Vcsrepo['/opt/smbexec'],
#     Exec['bundle_install_smbexec'],
#     File['/opt/smbexec/installAutomated.sh']
#     ],
# }

# Install Discover
  vcsrepo { '/opt/discover':
    ensure => present,
    provider => git,
    source => 'git://github.com/leebaird/discover.git',
    require => Class['git'],
    before => Exec['install_discover']
  }

  exec { 'install_discover':
    command => '/opt/discover/setup.sh',
    provider => 'shell',
  }

# Install PeepingTom
  vcsrepo { '/opt/peepingtom':
    ensure => present,
    provider => git,
    source => 'https://bitbucket.org/LaNMaSteR53/peepingtom.git',
    require => Class['git'],
  }

  file { '/opt/peepingtom/phantomjs':
    ensure => present,
    source => "/usr/local/bin/phantomjs",
    require => [
      Vcsrepo['/opt/peepingtom'],
    ],
  }

#  vcsrepo { '/opt/smbmap':
#    ensure   => present,
#    provider => git,
#    source   => 'git://github.com/ShawnDEvans/smbmap.git',
#    require  => Class['git'],
#  }

#  vcsrepo { '/opt/phishingfrenzy':
#    ensure => present,
#    provider => git,
#    source => 'git://github.com/pentestgeek/phishing-frenzy.git',
#    require => Class['git'],
#  } 

# vcsrepo { '/opt/veil':
#   ensure => present,
#   provider => git,
#   source => 'git://github.com/Veil-Framework/Veil-Evasion.git',
#   require => Class['git'],
# }

# Install Powersploit
  vcsrepo { '/opt/Powersploit':
    ensure => present,
    provider => git,
    source => 'git://github.com/mattifestation/PowerSploit.git',
    require => Class['git'],
    before => [
      Exec['download_listener'],
      Exec['download_ps_encoder'],
    ],
  }

  exec { 'download_listener':
    command => "/usr/bin/wget -q https://raw.github.com/obscuresec/random/master/StartListener.py -O /opt/Powersploit/StartListener.py",
    creates => "/opt/Powersploit/StartListener.py",
    path => ['/usr/bin', '/bin', '/sbin'],
  }

  file { '/opt/Powersploit/StartListener.py':
    ensure => present,
    owner => root,
    group => root,
    mode => 0755,
    require => [
      Vcsrepo['/opt/Powersploit'],
      Exec['download_listener'],
    ],
  }

  exec { 'download_ps_encoder':
    command => "/usr/bin/wget -q https://raw.github.com/darkoperator/powershell_scripts/master/ps_encoder.py -O /opt/Powersploit/ps_encoder.py",
    creates => "/opt/Powersploit/ps_encoder.py",
    path => ['/usr/bin', '/bin', '/sbin'],
  }

  file { '/opt/Powersploit/ps_encoder.py':
    ensure => present,
    owner => root,
    group => root,
    mode => 0755,
    require => [
      Vcsrepo['/opt/Powersploit'],
      Exec['download_ps_encoder'],
    ],
  }
}