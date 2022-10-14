var move = document.createElement('audio');

move.src = './assets/audio/move.wav';

move.volume = 0.1;

move.controls = false;

var click = document.createElement('audio');

click.src = './assets/audio/click.wav';

click.volume = 0.05;

click.controls = false;



var info_open = false;

var hotbarActive = false;

var useSound = false;

var otherInv = false;

var closeKey = null;

var locked = false;

var shop_open = false;



$(() => {

    window.addEventListener('message', (e) => {

        var data = e.data;

        if (data.action == 'open') {

            closeKey = data.closeKey;

            $('.wszystko').fadeIn(200);

            $('#other').hide();

            $('.inv-hotbar').hide();

            $('.inv-hotbar2').hide();

            hotbarActive = false;

            $('#count').val(1);

            if (data.shop) {

                shop_open = data.shop;





            } else {

                shop_open = false;

            }



            if (data.otherInventory) {

                $('#other').find('.inv-data').css('height', '350px')

                $('#other').fadeIn(200);

                if (!data.shop) {

                    $('.inv-hotbar').show();

                }

               

                otherInv = true;



            } else {

                $('#other').hide();

                $('.inv-hotbar').show();

                otherInv = false;

            }



            if (!data.hotbar) {

                $('.inv-hotbar-btn').hide();

            }



            useSound = data.soundEffects;

            

            $('#players').html('');

            $.each(data.players, (index, player) => {

                $('#players').append(`<option value="${player.player}">${player.name}</option>`)

            });

            

        } else if (data.action == 'close') {

            closeInventory()

        } else if (data.action == 'hot') {

            setupHotbar2(data.hotbar);

            $('.inv-hotbar2').fadeIn(350);

            setTimeout(function(){  $('.inv-hotbar2').fadeOut(350); }, 2000);

        } else if (data.action == 'setInventory') {

            if (data.weight) {

                var current_weight = data.weight.current.toFixed(1)

                var max_weight = data.weight.max.toFixed(1)

                $('#player').find('.inv-title').html(`Inventory - <span style="font-weight: normal;">${current_weight}kg/${max_weight}kg</span>` + "<div class='weightbar'><div class='weightfill' style='width:" + (current_weight / max_weight) * 100 + "%;'></div><div><i class='fas fa-weight-hanging'></i></div></div>")



                shop_open = data.shop;



            }



            setupHotbar(data.hotbar)

            setupInventory($('#player'), 'main', data.inventory)

        } else if (data.action == 'setOtherInventory') {

            if (data.weight) {

                var current_weight = data.weight.current.toFixed(1)

                var max_weight = data.weight.max.toFixed(1)

                $('#other').find('.inv-title').html(`${data.label} - <span style="font-weight: normal;">${current_weight}kg/${max_weight}kg</span>` + "<div class='weightbar'><div class='weightfill' style='width:" + (current_weight / max_weight) * 100 + "%;'></div><div><i class='fas fa-weight-hanging'></i></div></div>")

            } else {

                $('#other').find('.inv-title').html(`${data.label}`)

            }

            if (data.shop) {

                setupInventory($('#other'), 'shop', data.inventory)

            } else {

                setupInventory($('#other'), 'other', data.inventory)

            }







        } else if (data.action == 'Notify') {

            if (data.error) {

                $.notify(data.msg, { position: "right bottom", autoHideDelay: 2500, className: 'error' });

            } else {

                $.notify(data.msg, { position: "right bottom", autoHideDelay: 2500, className: 'success' });

            }



        }

    });



    $('.inv-hotbar-btn').click(function () {

        if (hotbarActive) {

            hotbarActive = false;

            $('.inv-hotbar').slideUp();

            $(this).html('<i class="fas fa-arrow-alt-circle-down"></i> Hotbar');

        } else {

            hotbarActive = true;

            $('.inv-hotbar').slideDown();

            $(this).html('<i class="fas fa-arrow-alt-circle-up"></i> Hotbar')

            if (useSound) {

               // click.play()

            }

        }

    });



    $(document).keydown(e => {

        if (e.keyCode == 27 || e.keyCode == closeKey) {

            closeInventory();

        }

    });



    $(document).mousedown(function (e) {

        var container = $(".slot, .inv-actions, .inv-hotbar, .inv-hotbar-btn");

        if (!container.is(e.target) && container.has(e.target).length === 0) {

            closeInfo()

        }

    });



    $('#removeHotbar').click(function () {

        var item = $('.active').find('.item').data('item');

        var slot = $('.active').data('slot');



        if (!item) {

            return

        }



        $.post('https://1-K1Dev-Inventory/removeFromHotbar', JSON.stringify({

            slot: slot

        }))



        closeInfo()

    });



    $('#give').click(function () {

        var item = $('.active').find('.item').data('item');



        if (!item) {

            return

        }



        var num = $('#count').val();

        var player = $('#players').val()

        if (!player) {

            return

        }



        if (item.type == 'item_weapon') {

            num = item.count

        }



        if (num < 0) {

            return

        }



        //if (parseInt(num)) {

            $.post('https://1-K1Dev-Inventory/give', JSON.stringify({

                item: item,

                count: num,

                player: player

            }))

       // }



        if (num > item.count) {

            $.notify(`Insufficient Amount`, { position: "right bottom", autoHideDelay: 2500, className: 'error' });

            return

        }



        var newcount = item.count - num

        if (newcount == 0) {

            removeItem($('.active'))

            closeInfo()

        } else {

            if (item.type == 'item_money' || item.type == 'item_account') {

                $('.active').find('.item').find('.item-count').html('$' + numberWithCommas(newcount));

            } else {

                $('.active').find('.item').find('.item-count').html(numberWithCommas(newcount));

            }

        }

    });



    $('#use').click(function () {

        var item = $('.active').find('.item').data('item');



        if (!item) {

            return

        }



        $.post('https://1-K1Dev-Inventory/use', JSON.stringify({

            item: item

        }))



        var newcount = item.count - 1

        if (newcount == 0) {

            removeItem($('.active'))

            closeInfo()

        } else {

            if (item.type == 'item_money' || item.type == 'item_account') {

                $('.active').find('.item').find('.item-count').html('$' + numberWithCommas(newcount));

            } else {

                $('.active').find('.item').find('.item-count').html(numberWithCommas(newcount));

            }

        }

    });



    $('#drop').click(function () {

        var item = $('.active').find('.item').data('item');



        if (!item) {

            return

        }



        var num = $('#count').val();



        if (num < 0) {

            return

        }



        if (parseInt(num)) {

            $.post('https://1-K1Dev-Inventory/remove', JSON.stringify({

                item: item,

                count: num

            }))

        }



        if (item.type == 'item_weapon') {

            closeInfo()

            return

        }



        if (num > item.count) {

            $.notify(`Insufficient Amount`, { position: "right bottom", autoHideDelay: 2500, className: 'error' });

            return

        }



        var newcount = item.count - num

        if (newcount == 0) {

            removeItem($('.active'))

            closeInfo()

        } else {

            if (item.type == 'item_money' || item.type == 'item_account') {

                $('.active').find('.item').find('.item-count').html('$' + numberWithCommas(newcount));

            } else {

                $('.active').find('.item').find('.item-count').html(numberWithCommas(newcount));

            }

        }

    });

});



function setupHotbar(hotbar) {

    $('.inv-hotbar').html(``);



    for (let i = 0; i < 5; i++) {

        $('.inv-hotbar').append(slotTemplate(i, true))

    }



    $.each(hotbar, (index, item) => {

        var slot = $('.inv-hotbar').find('.slot2').filter(function () {

            return $(this).data('slot') == index

        })



        addItem(slot, item)



        slot.click(function () {

            $('.slot').removeClass('active');

            $('.slot2').removeClass('active');

            $(this).addClass('active');



            openInfo('hotbar', item)

        });



        slot.find('.item').draggable({

            zIndex: 1000,

            delay: 80,

            revert: 'invalid',

            revertDuration: 0,

            helper: 'clone',

            appendTo: '#app',

            cursorAt: { left: 60, top: 70 },

            start: function (e, ui) {

                $(this).addClass('orginal');

                ui.helper.addClass('dragging');

            },

            stop: function (e, ui) {

                $(this).removeClass('orginal');

                ui.helper.removeClass('dragging');

            }

        })

    });



    $('.inv-hotbar').find('.slot2').droppable({

        drop: function (e, ui) {

            var slot = $(this).data('slot');

            var item = ui.draggable.data('item');



            if (!item) {

                return

            }



            if (item.type == 'item_account' || item.type == 'item_money') {

                return

            }



            $.post('https://1-K1Dev-Inventory/transferToHotbar', JSON.stringify({

                slot: slot,

                item: item

            }))



            if (useSound) {

                move.play();

            }



        }

    })



}







function setupHotbar2(hotbar) {

    $('.inv-hotbar2').html(``);



    for (let i = 0; i < 5; i++) {

        $('.inv-hotbar2').append(slotTemplate(i, true))

    }



    $.each(hotbar, (index, item) => {

        var slot = $('.inv-hotbar2').find('.slot2').filter(function () {

            return $(this).data('slot') == index

        })



        addItem(slot, item)



    });

}









function setupInventory(inv, type, inventory) {

    var data = inv.find('.inv-data').find('.slots');

    inv.find('.inv-data').data('inventory', type);

    data.html('');



    if (inventory.length < 1) {

        data.parent().find('.no-items').fadeIn();

    } else {

        data.parent().find('.no-items').hide();

        $.each(inventory, (index, item) => {

            data.append(slotTemplate(index))



            var slot = data.find('.slot').filter(function () {

                return $(this).data('slot') == index

            })



            addItem(slot, item)



            slot.mousedown(function (e) {

                if (otherInv) {

                    if (e.which == 3) {

                        if (locked) {

                            return

                        }



                        var item = $(this).find('.item').data('item');

                        var currentInvType = $(this).parent().parent().data('inventory');



                        if (!item) {

                            return

                        }



                        if (currentInvType == 'main') {



                            if (dragInvType == 'shop') {

                                $.post('https://1-K1Dev-Inventory/BuyItem', JSON.stringify({

                                    item: item,

                                    number: num

                                }))



                            } else {

                                $.post('https://1-K1Dev-Inventory/transferToPlayer', JSON.stringify({

                                    item: item,

                                    count: num

                                }))

                            }



                        } else {

                            $.post('https://1-K1Dev-Inventory/transferToOther', JSON.stringify({

                                item: item,

                                count: num

                            }))

                        }



                        if (useSound) {

                            move.play()

                        }



                        LockInventory()

                        closeInfo()

                    }

                }

            })



            slot.find('.item').draggable({

                zIndex: 1000,

                delay: 80,

                revert: 'invalid',

                revertDuration: 0,

                helper: 'clone',

                appendTo: '#app',

                cursorAt: { left: 60, top: 70 },

                start: function (e, ui) {

                    $(this).addClass('orginal');

                    ui.helper.addClass('dragging');

                },

                stop: function (e, ui) {

                    $(this).removeClass('orginal');

                    ui.helper.removeClass('dragging');

                }

            })



            slot.click(function () {

                var item = $(this).find('.item').data('item');

                var inv = $(this).parent().parent().data('inventory');



                if (!item) {

                    return

                }



                $('.slot').removeClass('active');

                $('.slot2').removeClass('active');

                $(this).addClass('active');



                openInfo(inv, item)

            })

        })

    }



    data.parent().droppable({

        hoverClass: 'hover',

        drop: function (e, ui) {

            if (locked) {

                return

            }



            var currentInvType = $(this).data('inventory');

            var dragInvType = ui.draggable.parent().parent().parent().data('inventory');

            var item = ui.draggable.data('item');



            var hotBarItem = ui.draggable.parent().data('hotbar');



            if (hotBarItem) {

                var slot = ui.draggable.parent().data('slot');

                $.post('https://1-K1Dev-Inventory/removeFromHotbar', JSON.stringify({

                    slot: slot

                }))

            } else {



                if (!item) {

                    return

                }



                if (currentInvType == dragInvType) {

                    return

                }



                var num = $('#count').val();



                if (!parseInt(num)) {

                    return

                }



                if (num < 0) {

                    return

                }



                if (num > item.count) {

                    num = item.count

                }



                if (currentInvType == 'main') {



                    if (dragInvType == 'shop') {



                        $.post('https://1-K1Dev-Inventory/BuyItem', JSON.stringify({

                            item: item,

                            number: num

                        }))



                    } else {

                        $.post('https://1-K1Dev-Inventory/transferToPlayer', JSON.stringify({

                            item: item,

                            count: num

                        }))

                    }



                } else {

                    $.post('https://1-K1Dev-Inventory/transferToOther', JSON.stringify({

                        item: item,

                        count: num

                    }))

                }



                if (useSound) {

                    move.play()

                }

            }



            LockInventory()

            closeInfo()

        }

    })

}



function addItem(slot, item) {

    if (item.image) {

        slot.find('.item').css('background-image', `url(./assets/items/${item.image}.png)`);

    } else {

        slot.find('.item').css('background-image', `url(./assets/items/${item.name}.png)`);

    }

    if (shop_open == true) {



        slot.find('.item').find('.item-count').html('$' + numberWithCommas(item.price));



    } else {

        if (item.type == 'item_weapon') {

            slot.find('.item').find('.item-count').html('<i class="fas fa-angle-double-up"></i> ' + numberWithCommas(item.count));

        } else if (item.type == 'item_money' || item.type == 'item_account') {

            slot.find('.item').find('.item-count').html('$' + numberWithCommas(item.count));

        }

        else {

            slot.find('.item').find('.item-count').html(numberWithCommas(item.count));

        }



    }







    slot.find('.item').find('.item-name').html(item.label);

    slot.find('.item').data('item', item);

}



function removeItem(slot) {

    slot.find('.item').css('background-image', `none`);

    slot.find('.item').find('.item-count').html('');

    slot.find('.item').find('.item-name').html('');

    slot.find('.item').removeData('item');

}



function openInfo(inv, item) {

    $('.wrapper').show();



    $('.inv-actions-title').html(item.label + ' (' + item.weight + 'kg)');

    if (item.desc) {

        if (item.weight > 0) {

            $('.inv-actions-desc').html(item.desc + '<br>');

        } else {

            $('.inv-actions-desc').html(item.desc + '<br>');

        }

    } else {

        $('.inv-actions-desc').html('ไม่มีคำอธิบาย');

    }



    $('#removeHotbar').hide();



    if (inv == 'main') {

        if (item.usable) {

            $('#use').show();

        } else {

            $('#use').hide();

        }



        if (item.type != 'item_weapon') {

            $('#count').show();

            $('#drop').css('margin-left', '5px');

        } else {

            $('#count').hide();

            $('#drop').css('margin-left', 0);

        }



        if (item.remove) {

            $('#drop').show();

        } else {

            $('#drop').hide();

        }



        $('#give').show();

        $('#players').show();

    } else if (inv == 'hotbar') {

        $('#use').hide();

        $('#count').hide();

        $('#give').hide();

        $('#players').hide();

        $('#drop').hide();

        $('#removeHotbar').show();

    } else {

        $('#drop').hide();

        $('#use').hide();

        $('#give').hide();

        $('#players').hide();



        if (item.type != 'item_weapon') {

            $('#count').show();

            $('#drop').css('margin-left', '5px');

        } else {

            $('#count').hide();

            $('.wrapper').hide();

            $('#drop').css('margin-left', 0);

        }

    }



    if (!info_open) {

        if (useSound) {

            //click.play()

        }

    }

    info_open = true;

    $('.inv-actions').slideDown(200);

}



function closeInfo() {

    $('.slot').removeClass('active');

    $('.inv-actions').slideUp(200);

    info_open = false;

}



function slotTemplate(slotid, hotbar) {

    if (hotbar) {

        return (

            `<div class="slot2" data-slot=${slotid} data-hotbar='true'>

                <div class="item">

                    <div class="item-keybind">${slotid + 1}</div>

                    <div class="item-name"></div>

                </div>

            </div>`

        )

    } else {

        return (

            `<div class="slot" data-slot=${slotid}>

                <div class="item">

                    <div class="item-count"></div>

                    <div class="item-name"></div>

                </div>

            </div>`

        )

    }



}



function closeInventory() {

    $('.wszystko').fadeOut(200);

    $('#players').hide();

    $('#players').prop('selectedIndex', 0);

    closeInfo();

    $.post('https://1-K1Dev-Inventory/close');

}



function numberWithCommas(x) {

    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

}



function LockInventory() {

    locked = true

    setTimeout(() => {

        locked = false

    }, 500)

}



