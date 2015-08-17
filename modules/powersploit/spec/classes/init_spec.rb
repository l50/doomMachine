require 'spec_helper'
describe 'powersploit' do

  context 'with defaults for all parameters' do
    it { should contain_class('powersploit') }
  end
end
