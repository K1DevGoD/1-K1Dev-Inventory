--[[
        
        💬 Export from K1Dev => discord: https://discord.gg/awayfromus ] 
        🐌 @Copyright K1Dev
        ☕ Thanks For Coffee Tips 
        🧠 Development team => "RDX-Dev"
--]]

fx_version 'adamant'
games {'rdr3'}
rdr3_warning 'I acknowledge that this is a prerelease build of RedM, and I am aware my resources *will* become incompatible once RedM ships.'

author 'K1Dev'
version '2.0'

ui_page 'html/index.html'

files {
    'html/index.html',
    'html/app.js',
    'html/index.css',
    'html/libs/jquery-ui.min.css',
    'html/libs/jquery-ui.min.js',
    'html/libs/jquery.min.js',
    'html/libs/notify.min.js',
    'html/assets/audio/move.wav',
    'html/assets/audio/click.wav',
    'html/assets/items/*.png',
    'html/assets/items/weapons/*.png',
    'html/assets/items/jobs/*.png',
    'html/assets/fonts/*.ttf'
}

shared_script 'config.lua'

client_scripts {
    'client/*.lua',
    -- modules
    'client/modules/*.lua'
}

server_scripts {
    '@mysql-async/lib/MySQL.lua',
    'server/main.lua',

    -- modules
    'server/modules/*.lua'
}
