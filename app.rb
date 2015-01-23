require 'sinatra' 
require 'sinatra/activerecord'
require './models/cow'

ActiveRecord::Base.establish_connection(
  adapter:  'sqlite3',
  database: 'cows.db'
)
ActiveRecord::Base.include_root_in_json = false

get '/cows' do
  Cow.all.to_json
end

get '/cows/:id' do |id|
  Cow.find(id).to_json
end

post '/cows' do
  c = Cow.create(JSON.parse request.body.read)
  c.to_json
end

patch '/cows/:id' do |id|
  json_params = JSON.parse request.body.read
  c = Cow.find(id)
  c.update_attributes(json_params)
  c.to_json
end

delete '/cows/:id' do |id|
  c = Cow.find(id)
  c.destroy
  204
end
