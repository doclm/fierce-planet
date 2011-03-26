# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended to check this file into your version control system.

ActiveRecord::Schema.define(:version => 20110324105609) do

  create_table "levels", :force => true do |t|
    t.string   "name"
    t.integer  "world_width"
    t.integer  "world_height"
    t.integer  "initial_agent_x"
    t.integer  "initial_agent_y"
    t.integer  "initial_agent_number"
    t.integer  "goal_x"
    t.integer  "goal_y"
    t.integer  "wave_number"
    t.integer  "expiry_limit"
    t.boolean  "allow_offscreen_cycling"
    t.boolean  "allow_patches_on_path"
    t.text     "notice"
    t.text     "tiles"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "profiles", :force => true do |t|
    t.integer  "user_id"
    t.string   "nickname"
    t.integer  "current_score"
    t.integer  "highest_score"
    t.integer  "current_level"
    t.integer  "highest_level"
    t.string   "status"
    t.text     "capabilities"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.integer  "total_patches",                 :default => 0
    t.integer  "total_economic_patches",        :default => 0
    t.integer  "total_environmental_patches",   :default => 0
    t.integer  "total_social_patches",          :default => 0
    t.integer  "total_saved",                   :default => 0
    t.integer  "total_expired",                 :default => 0
    t.integer  "total_resources",               :default => 0
    t.integer  "total_economic_resources",      :default => 0
    t.integer  "total_environmental_resources", :default => 0
    t.integer  "total_social_resources",        :default => 0
    t.integer  "credits",                       :default => 0
    t.string   "profile_class",                 :default => "0"
    t.integer  "progress_towards_next_class",   :default => 0
  end

  create_table "users", :force => true do |t|
    t.string   "email",                               :default => "",    :null => false
    t.string   "encrypted_password",   :limit => 128, :default => "",    :null => false
    t.string   "password_salt",                       :default => "",    :null => false
    t.string   "reset_password_token"
    t.string   "remember_token"
    t.datetime "remember_created_at"
    t.integer  "sign_in_count",                       :default => 0
    t.datetime "current_sign_in_at"
    t.datetime "last_sign_in_at"
    t.string   "current_sign_in_ip"
    t.string   "last_sign_in_ip"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.boolean  "admin",                               :default => false
  end

  add_index "users", ["email"], :name => "index_users_on_email", :unique => true
  add_index "users", ["reset_password_token"], :name => "index_users_on_reset_password_token", :unique => true

end
