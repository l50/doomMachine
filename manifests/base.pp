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
  }

  vcsrepo { '/opt/smbmap':
    ensure   => present,
    provider => git,
    source   => 'git://github.com/ShawnDEvans/smbmap.git',
    require  => Class['git'],
  }
}