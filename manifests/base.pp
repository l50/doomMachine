node 'doomMachine'
{
  exec { "apt-update":
    command => "/usr/bin/apt-get update"
  }

  include stdlib
  include git

  vcsrepo { '/opt/smbexec':
    ensure   => present,
    provider => git,
    source   => 'git://github.com/pentestgeek/smbexec.git',
    require  => Class['git'],
    user => root,
#    before => File['/opt/smbexec/installAutomated.sh'],
  }

   exec { 'bundle_install_smbexec':
    command => 'bundle install',
    cwd     => '/opt/smbexec',
    path    => '/usr/bin',
    require => [
      Vcsrepo['/opt/smbexec'],
    ],
    user => root,
  }

  #file { '/opt/smbexec/installAutomated.sh':
  #  ensure => present,
  #  source => "/vagrant/files/smbexec/installAutomated.sh",
  #  require => [
  #    Vcsrepo['/opt/smbexec'],
  #    Exec['bundle_install_smbexec'],
  #  ],
  #}

  #exec { 'install_smb_exec':
  #  command => '/vagrant/files/smbexec/installAutomated.sh',
  #  require => Exec['bundle_install_smbexec'],
  #}

  vcsrepo { '/opt/smbmap':
    ensure   => present,
    provider => git,
    source   => 'git://github.com/ShawnDEvans/smbmap.git',
    require  => Class['git'],
  }

   package {[
    'ipmitool',
    'shutter',
    'gimp',
    'firefox',
  ]:
    ensure => installed,
  }

}