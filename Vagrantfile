Vagrant.configure("2") do |config|
  config.vm.box = "/Users/l/programs/vagrant_boxes/packer-kali/Kali_virtualbox_2015-06-07T06:53:38Z.box"

  config.vm.define :doomMachine do |doomMachine|
    doomMachine.vm.hostname = 'doomMachine'
    config.vm.network "public_network", bridge: 'en0: Wi-Fi (AirPort)'

    config.librarian_puppet.puppetfile_dir = "puppet"

    doomMachine.vm.provider :virtualbox do |vm|
      vm.gui = true
      vm.customize [
        "modifyvm", :id,
        "--memory", 4096,
        "--cpus", "2"
      ]
    end
  end


  config.vm.provision :shell do |shell|
    # Install puppet on doomMachine
    shell.inline = "sudo gem install puppet --version 3.6.2 --no-ri --no-rdoc;"
  end

  config.vm.provision :puppet,
    :options => ["--debug", "--verbose", "--summarize", "--reports", "store"],
  :facter => { "fqdn" => "doomMachine" } do |puppet|
    puppet.manifests_path = "manifests"
    puppet.module_path    = "modules"
    puppet.manifest_file  = "base.pp"
  end
end
