RegisterNetEvent('1-K1Dev-Inventory:openPlayerInventory')
AddEventHandler('1-K1Dev-Inventory:openPlayerInventory', function (playerId)
    openInventory({type = 'player', label = GetPlayerName(GetPlayerFromServerId(playerId)), identifier = playerId})
end)