RegisterCommand('inv', function (src, args)
    local xPlayer = RDX.GetPlayerFromId(src)
    if xPlayer.getGroup() == 'admin' then 
        local target = tonumber(args[1]) 
        if target then 
            if target ~= src then 
                if GetPlayerName(target) then 
                    TriggerClientEvent('1-K1Dev-Inventory:openPlayerInventory', src, target)
                else 
                    TriggerClientEvent('chatMessage', src, '^1SISTEMA', {255,255,255}, 'Este jugador no existe')
                end
            else 
                TriggerClientEvent('chatMessage', src, '^1SISTEMA', {255,255,255}, 'No puedes ver tu propio inventario.')
            end
        end
    end
end, false)
