node 'doomMachine'
{
  package { [
    'ipmitool',
    'shutter',
    'gimp',
    'arachni',
    'smbmap',
    'veil',
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

# Install Discover
  vcsrepo { '/opt/discover':
    ensure   => present,
    provider => git,
    source   => 'git://github.com/leebaird/discover.git',
    require  => Class['git'],
    before   => Exec['install_discover']
  }

  exec { 'install_discover':
    command  => '/opt/discover/setup.sh',
    provider => 'shell',
  }

# Install PeepingTom
  vcsrepo { '/opt/peepingtom':
    ensure   => present,
    provider => git,
    source   => 'https://bitbucket.org/LaNMaSteR53/peepingtom.git',
    require  => Class['git'],
  }

  file { '/opt/peepingtom/phantomjs':
    ensure  => present,
    source  => "/usr/local/bin/phantomjs",
    require => [
      Vcsrepo['/opt/peepingtom'],
    ],
  }

# Install Powersploit
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

  exec { 'download_listener':
    command => "/usr/bin/wget -q https://raw.github.com/obscuresec/random/master/StartListener.py -O /opt/Powersploit/StartListener.py",
    creates => "/opt/Powersploit/StartListener.py",
    path    => ['/usr/bin', '/bin', '/sbin'],
  }

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

# Install Banner-Plus NSE script
  exec { 'download_banner_plus':
    command => "/usr/bin/wget -q https://raw.github.com/hdm/scan-tools/master/nse/banner-plus.nse -O /usr/share/nmap/scripts/banner-plus.nse",
    creates => "/usr/share/nmap/scripts/banner-plus.nse",
    path    => ['/usr/bin', '/bin', '/sbin'],
  }

  file { '/usr/share/nmap/scripts/banner-plus.nse':
    ensure  => present,
    owner   => root,
    group   => root,
    mode    => 0755,
    require => [
      Exec['download_banner_plus'],
    ],
  }

# Install phishingfrenzy
  exec { 'install_docker':
    command => 'curl -sSL https://get.docker.io/ubuntu/ | sudo sh',
    path    => ['/usr/bin', '/bin'],
  }

  exec { 'install_phishing_frenzy':
    command => 'docker pull b00stfr3ak/ubuntu-phishingfrenzy',
    path    => ['/usr/bin/', '/bin'],
    require => [
      Exec['install_docker'],
    ]
  }

  exec { 'set_dns_for_phishing_frenzy':
    command => 'cp /etc/hosts /etc/hosts.orig && tail -n +2 /etc/hosts.orig > /etc/hosts; echo \'0.0.0.0 phishingfrenzy.local\' >> /etc/hosts',
    path    => ['/usr/bin/', '/bin'],
    require => [
      Exec['install_docker'],
      Exec['install_phishing_frenzy'],
      Exec['start_phishing_frenzy'],
    ]
  }

  exec { 'start_phishing_frenzy':
    command => 'docker run --restart=always -d -p 80:80 b00stfr3ak/ubuntu-phishingfrenzy',
    path    => ['/usr/bin/', '/bin'],
    require => [
      Exec['install_docker'],
      Exec['install_phishing_frenzy'],
    ]
  }

# Install smbexec
  exec { 'install_smbexec':
    command => 'docker pull l505/smbexec',
    path    => ['/usr/bin/', '/bin'],
    require => [
      Exec['install_docker'],
    ]
  }

  file_line { 'smbexec_shortcut':
    path => '/root/.bashrc',
    line => 'alias smbexec="docker run --restart=always -t -i l505/smbexec /opt/smbexec/smbexec.rb"',
    require => [
      Exec['install_docker'],
      Exec['install_smbexec'],
    ]
  }

# Install Firefox
  exec { 'download_firefox':
    command => "/usr/bin/wget -q http://ftp.mozilla.org/pub/mozilla.org/firefox/releases/38.0.1/linux-x86_64/en-US/firefox-38.0.1.tar.bz2 -O /opt/firefox-38.0.1.tar.bz2",
    creates => "/opt/firefox-38.0.1.tar.bz2",
    path    => ['/usr/bin', '/bin', '/sbin'],
  }

  exec { 'unzip_firefox':
    command => "/bin/tar -xvf /opt/firefox-38.0.1.tar.bz2 -C /opt",
    creates => "/opt/firefox",
    path    => ['/usr/bin', '/bin', '/sbin'],
    require => [
      Exec['download_firefox'],
    ]
  }

  exec { 'delete_iceweasel_link':
    command => "/bin/rm -r /usr/bin/firefox",
    path    => ['/usr/bin', '/bin', '/sbin'],
  }

  exec { 'link_firefox':
    command => "/bin/ln -s /opt/firefox/firefox /usr/bin/firefox",
    creates => "/usr/bin/firefox",
    path    => ['/usr/bin', '/bin', '/sbin'],
    require => [
      Exec['download_firefox'],
      Exec['unzip_firefox'],
      Exec['delete_iceweasel_link']
    ]
  }

# Install Addons for IceWeasel
  exec { 'install_addons_iceweasel':
    command => "/bin/cp -r /vagrant/files/firefoxAddons/* /usr/lib/iceweasel/browser/extensions/",
    path    => ['/usr/bin', '/bin', '/sbin'],
    require => [
      Exec['download_firefox'],
      Exec['unzip_firefox'],
      Exec['delete_iceweasel_link'],
      Exec['link_firefox'],
    ]
  }

# Install Addons for Firefox
  exec { 'install_addons_firefox':
    command => "/bin/cp -r /vagrant/files/firefoxAddons/* /opt/firefox/browser/extensions",
    path    => ['/usr/bin', '/bin', '/sbin'],
    require => [
      Exec['download_firefox'],
      Exec['unzip_firefox'],
      Exec['delete_iceweasel_link'],
      Exec['link_firefox'],
    ]
  }

# Install OpenSSL
  exec { 'download_openssl':
    command => "/usr/bin/wget -q http://openssl.org/source/openssl-1.0.2-latest.tar.gz -O /opt/openssl-1.0.2-latest.tar.gz",
    creates => "/opt/openssl-1.0.2-latest.tar.gz",
    path    => ['/usr/bin', '/bin', '/sbin'],
  }

  exec { 'unzip_openssl':
    command => "/bin/tar -xvf /opt/openssl-1.0.2-latest.tar.gz -C /opt",
    creates => "/opt/openssl-1.0.2c",
    path    => ['/usr/bin', '/bin', '/sbin'],
    require => [
      Exec['download_openssl'],
    ]
  }
  exec { 'install_openssl':
    command => 'bash config --prefix=/usr/; make; make install',
    path    => ['/usr/bin', '/bin'],
    cwd     => '/opt/openssl-1.0.2c',
    require => [
      Exec['download_openssl'],
      Exec['unzip_openssl'],
    ]
  }
}
