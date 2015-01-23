class CreateCows < ActiveRecord::Migration
  def change
    create_table :cows do |t|
      t.string  :name
      t.string  :breed
      t.integer :age
    end
  end
end