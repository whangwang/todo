
$(document).ready(function(){
  $('body').on('click','.new-intro-skip',function(){
    $('.new-intro').fadeOut(500);
  });
  $('body').on('click','.new-intro-next',function(){
    if(parseInt($('.new-intro').attr('index'))==6){
      $('.new-intro').fadeOut(500);
    }else if(parseInt($('.new-intro').attr('index'))==5){
      $('.new-intro').attr('index',String(parseInt($('.new-intro').attr('index'))+1));
      $('.new-intro img').hide();
      $('.new-intro p').hide();
      $('.new-intro img').eq(parseInt($('.new-intro').attr('index'))).show();
      $('.new-intro p').eq(parseInt($('.new-intro').attr('index'))).show();
      $('.new-intro-next').html('完成');
    }else{
      $('.new-intro').attr('index',String(parseInt($('.new-intro').attr('index'))+1));
      $('.new-intro img').hide();
      $('.new-intro p').hide();
      $('.new-intro img').eq(parseInt($('.new-intro').attr('index'))).show();
      $('.new-intro p').eq(parseInt($('.new-intro').attr('index'))).show();
    }
  });
  $('body').on('click','.logout',function(){
    $.post('/ajax_user_logout',{},function(data){
        if(data.status){
          window.location = "/";
        }
    });
  });
  $('body').on('click','.user-change-name',function(){
    $('.user-panel-modal').fadeOut(500);
    $('.modal-background.change-name-modal').fadeIn(500);
  });
  $('body').on('click','.user-area',function(){
    $('.user-panel-modal').fadeIn(500);
  });
  $('body').on('click','.time-stamp',function(){
    $('.mobile-active').removeClass('mobile-active');
    $(this).addClass('mobile-active');
    $('.user-list').addClass('mobile-active');
  });
  $('body').on('click','.list-finished',function(){
    $('.mobile-active').removeClass('mobile-active');
    $(this).addClass('mobile-active');
    $('.finish-list').addClass('mobile-active');
  });
  $('body').on('click','.mobile-category-btn',function(){
    if($(this).hasClass('active')){
      $(this).removeClass('active');
      $('.mobile-category-background').fadeOut(1000);
      $('.left-menu').css('left','-100%');
    }else{
      $(this).addClass('active');
      $('.mobile-category-background').fadeIn(1000);
      $('.left-menu').css('left','0px');
    }
  });
  $('body').on('click','.mobile-category-background',function(){
    $('.mobile-category-btn').removeClass('active');
    $('.mobile-category-background').fadeOut(1000);
    $('.left-menu').css('left','-100%');
  });
  $('body').on('click','.list-remove-todo',function(){
    if(confirm('確認要刪除這項事件?若是完成此事件可以使用左方按鈕標注完成。')){
      $('body').addClass('loading');
      $.post('/ajax_delete_event',{
        key: $(this).parent().attr('key')
      },function(data){
        if(data.status){
          var todo=data.todo;
          var display_finish = [];
          var display_unfinish = [];
          for(var i = 0; i < todo.length; i++){
            if(todo[i].status)display_finish.push(todo[i]);
            else display_unfinish.push(todo[i]);
          }
          display_finish.sort(function(a,b){
            return a.order > b.order;
          });
          display_unfinish.sort(function(a,b){
            return a.order > b.order;
          });
          $('#todo-list').empty();
          for(var i = 0; i < display_unfinish.length; i++){
            if(typeof display_unfinish[i].description != "undefined"){
              display_unfinish[i].description = display_unfinish[i].description.replace(/\n/g,'<br />');
            }else{
              display_unfinish[i].description = "";
            }
            $('#todo-list').append('<li class="ui-state-default '+display_unfinish[i].category_id+'-list" category="'+display_unfinish[i].category_id+'" order="'+display_unfinish[i].order+'" key="'+display_unfinish[i].key+'"> <div class="checkbox"></div> <img class="list-sort-handle" src="/images/dragicon.svg" /><img class="list-remove-todo" src="/images/delete-todo.svg" /><img class="list-edit-todo" src="/images/edit-todo.svg" /><p class="category">'+display_unfinish[i].category_name+'</p> <p class="title"> '+display_unfinish[i].title+'</p><div class="detail-icon"> <label>Detail</label> <svg version="1.1" id="Layer_1" xmlns:cc="http://creativecommons.org/ns#" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:inkscape="http://www.inkscape.org/namespaces/inkscape" xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#" xmlns:sodipodi="http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd" xmlns:svg="http://www.w3.org/2000/svg" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 612 635.5" style="enable-background:new 0 0 612 635.5;" xml:space="preserve"><g><path class="st0" d="M575.3,215.5c0,4.7-1.8,8.8-5.4,12.5L317.5,480.4c-3.6,3.6-7.8,5.4-12.5,5.4c-4.7,0-8.8-1.8-12.5-5.4L40.1,227.9c-3.6-3.6-5.4-7.8-5.4-12.5c0-4.7,1.8-8.8,5.4-12.5l27.1-27.1c3.6-3.6,7.8-5.4,12.5-5.4c4.7,0,8.8,1.8,12.5,5.4L305,388.8l212.9-212.9c3.6-3.6,7.8-5.4,12.5-5.4c4.7,0,8.8,1.8,12.5,5.4l27.1,27.1C573.5,206.6,575.3,210.8,575.3,215.5L575.3,215.5z"/></g></svg></div><div class="detail-area"><p>'+display_unfinish[i].description+'</p></div></li>');
          }
          $('#finished-list').empty();
          for(var i = 0; i < display_finish.length; i++){
            if(typeof display_finish[i].description != "undefined"){
              display_finish[i].description = display_finish[i].description.replace(/\n/g,'<br />');
            }else{
              display_finish[i].description = "";
            }
            $('#finished-list').append('<li class="ui-state-default '+display_finish[i].category_id+'-list" category="'+display_finish[i].category_id+'" order="'+display_finish[i].order+'" key="'+display_finish[i].key+'"> <div class="checkbox" style="visibility: hidden;"></div> <img class="finish-list-sort-handle" style="display: none;" src="/images/dragicon.svg" /> <p class="category">'+display_finish[i].category_name+'</p> <p class="title"> '+display_finish[i].title+'</p><div class="detail-icon"> <label>Detail</label> <svg version="1.1" id="Layer_1" xmlns:cc="http://creativecommons.org/ns#" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:inkscape="http://www.inkscape.org/namespaces/inkscape" xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#" xmlns:sodipodi="http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd" xmlns:svg="http://www.w3.org/2000/svg" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 612 635.5" style="enable-background:new 0 0 612 635.5;" xml:space="preserve"><g><path class="st0" d="M575.3,215.5c0,4.7-1.8,8.8-5.4,12.5L317.5,480.4c-3.6,3.6-7.8,5.4-12.5,5.4c-4.7,0-8.8-1.8-12.5-5.4L40.1,227.9c-3.6-3.6-5.4-7.8-5.4-12.5c0-4.7,1.8-8.8,5.4-12.5l27.1-27.1c3.6-3.6,7.8-5.4,12.5-5.4c4.7,0,8.8,1.8,12.5,5.4L305,388.8l212.9-212.9c3.6-3.6,7.8-5.4,12.5-5.4c4.7,0,8.8,1.8,12.5,5.4l27.1,27.1C573.5,206.6,575.3,210.8,575.3,215.5L575.3,215.5z"/></g></svg></div><div class="detail-area"><p>'+display_finish[i].description+'</p></div></li>');
          }
          $('body').removeClass('loading');
        }else{
          $('body').removeClass('loading');
          alert(data.err);
        }
      });
    }
  });
  $('body').on('click','.left-menu button',function(){
    if(String($(this).data('id'))=="allcategory"){
      $('#todo-list li').show();
      $('#finished-list li').show();
      $('.ui-sortable-handle:not(.finish-list-sort-handle)').show();
      $('.left-menu button.active').removeClass('active');
      $(this).addClass('active');
    }else{
      $('#todo-list li').hide();
      $('#finished-list li').hide();
      $('.'+String($(this).data('id'))+'-list').show();
      $('.left-menu button.active').removeClass('active');
      $('.ui-sortable-handle').hide();
      $(this).addClass('active');
    }
  });
  $('body').on('click','.edit-category-btn',function(){
    if($('.left-menu').hasClass('edit')){
      var category = [{
        "id": $('.left-menu button.first').data('id'),
        "name": "All"
      }];
      $('.category-list-edit:not(.sample)').each(function(){
        var cid;
        if($(this).data('id')!="new-add")cid=$(this).data('id');
        else cid=makeid(8);
        category.push({
          "id": cid,
          "name": $(this).find('input').val()
        });
      });
      $('body').addClass('loading');
      $.post('/category_modified',{
        cg: category
      },function(data){
        if(data.status){
          $('.left-menu').removeClass('edit');
          $('.edit-category-btn').html('Edit...');
          $('.left-menu button').remove();
          $('.left-menu br').remove();
          $('.category-list-edit:not(.sample)').remove();
          $('.category-list-add').before('<button class="active first" data-id="'+data.category[0].id+'">'+data.category[0].name+'</button><br>');
          for(var i = 1; i < data.category.length; i++){
            $('.category-list-add').before('<button data-id="'+data.category[i].id+'">'+data.category[i].name+'</button><br>');
            var add_new_area = $('.category-list-edit.sample').clone();
            add_new_area.removeClass('sample').data('id',data.category[i].id).insertBefore('.category-list-add');
            add_new_area.find('input').val(data.category[i].name);
          };
          $('body').removeClass('loading');
        }else{
          alert(data.err);
          $('body').removeClass('loading');
        }
        });
    }else{
      $('.left-menu').addClass('edit');
      $(this).html('Save');
    }
  });
  $('body').on('click','.remove-category-btn',function(){
    if(confirm('確認刪除此類別?所有指向此類別的事件可能會失去關聯。')){
      $(this).parent().remove();
    }
  });
  $('body').on('click','.category-list-add',function(){
    var add_new_area = $('.category-list-edit.sample').clone();
    add_new_area.addClass('new-add').removeClass('sample').insertBefore('.category-list-add');
    add_new_area.find('input').focus().select();
  });
  $('body').on('click','.checkbox',function(){
    var target = $(this);
    $.post('/ajax_change_status',{
        key: $(this).parent().attr('key')
    },function(data){
      if(data.status){
        target.parent().css('transition','unset');
        if($('#finished-list li').length==0){
          target.parent().clone().hide().addClass('animating').appendTo($('#finished-list'));
        }else{
          var check = 0;
          var count = $('#finished-list li').length;
          for(var i = 0; i < count; i++){
            if((parseInt($('#finished-list li').eq(i).attr('order'))>parseInt(target.parent().attr('order')))&&(!check)){
              target.parent().clone().hide().addClass('animating').insertBefore($('#finished-list').find('li').eq(i));
              check++;
            }
          }
          if(!check){
            target.parent().clone().hide().addClass('animating').appendTo($('#finished-list'));
          }
        }
        $('.animating').find('list-sort-handle').removeClass('list-sort-handle').addClass('finish-list-sort-handle');
        target.parent().fadeOut(300,function(){
          target.remove();
        });
        $('.animating').fadeIn(300,function(){
          target.css('transition','opacity 0.5s');
          $('.animating').removeClass('animating');
        });
      }else{
        alert(data.err);
      }
    })
  });
  $( "#todo-list" ).sortable({
    handle: ".list-sort-handle",
    update: function(event,ui){
      var new_order = {};
      var i = 0;
      $('#todo-list li').each(function(){
        var key = $(this).attr('key');
        key = '/'+String(key)+'/order';
        new_order[key]=i;
        $(this).attr('order',i);
        i++;
      });
      $.post('/ajax_change_order',{
        "new_order": new_order
      },function(data){
        if(data.status){
          alert('success');
        }else{
          alert(data.err);
        }
      });
    }
  });
  $( "#finished-list" ).sortable({
    handle: ".finish-list-sort-handle"
  });
  $('body').on('mousedown','.list-sort-handle',function(){
    $('#todo-list li').css('opacity','0.5');
    $(this).parent().css('opacity','1');
  });
  $('body').on('mouseup','.list-sort-handle',function(){
    $('#todo-list li').css('opacity','1');
  });
  $('body').on('click','.detail-icon',function(){
    if($(this).parent().find('.detail-area').hasClass('active')){
      $(this).parent().find('.detail-area').removeClass('active');
      $(this).find('label').html('Detail');
      $(this).find('svg').css('transform','translate(0px, 2.5px) rotate(0deg)');
    }else{
      $(this).parent().find('.detail-area').addClass('active');
      $(this).find('label').html('Close');
      $(this).find('svg').css('transform','translate(0px, 2.5px) rotate(180deg)');
    }
  });
  $('body').on('click','.add-event-btn',function(){
    $('.add-new-event select').empty();
    $('.left-menu button').each(function(){
      $('.add-new-event select').append('<option value="'+$(this).data('id')+'">'+$(this).html()+'</option>');
    });
    $('.modal-background.add-new-event-modal').fadeIn(500);
    $('.add-new-event-title').focus();
  });
  $('body').on('click','.list-edit-todo',function(){
    $('.edit-event-modal .add-new-event select').empty();
    $('.left-menu button').each(function(){
      $('.edit-event-modal .add-new-event select').append('<option value="'+$(this).data('id')+'">'+$(this).html()+'</option>');
    });
    $('.edit-key').val($(this).parent().attr('key'));
    $('.add-new-event-title').val($(this).parent().find('p.title').html().trim().replace(/<br\s*[\/]?>/gi, "\n"));
    $('.edit-event-modal .add-new-event select').val($(this).parent().attr('category'));
    $('.edit-event-modal .add-new-event textarea').val($(this).parent().find('.detail-area p').html().trim().replace(/<br\s*[\/]?>/gi, "\n"));
    $('.modal-background.edit-event-modal').fadeIn(500);
    $('.edit-event-modal .add-new-event-title').focus();
  });
  $('body').on('click','.add-event-cancel',function(){
    $('.modal-background.add-new-event-modal').fadeOut(500);
  });
  $('body').on('click','.modal-content',function(e){
    e.stopPropagation();
  });
  $('body').on('click','.edit-event-cancel',function(){
    $('.modal-background.edit-event-modal').fadeOut(500);
  });
  $('body').on('click','.edit-event-confirm',function(){
    $('body').addClass('loading');
    $.post('/ajax_edit_event',{
      key: $('.edit-key').val(),
      update: {
        "title": $('.edit-event-modal .add-new-event-title').val(),
        "category_name": $('.edit-event-modal .add-new-event option:selected').text(),
        "category_id": $('.edit-event-modal .add-new-event select').val(),
        "description": $('.edit-event-modal .add-new-event textarea').val()
      }
    },function(data){
      console.log(data.todo);
      var todo=data.todo;
      var display_finish = [];
      var display_unfinish = [];
      for(var i = 0; i < todo.length; i++){
        if(todo[i].status)display_finish.push(todo[i]);
        else display_unfinish.push(todo[i]);
      }
      display_finish.sort(function(a,b){
        return a.order > b.order;
      });
      display_unfinish.sort(function(a,b){
        return a.order > b.order;
      });
      $('#todo-list').empty();
      for(var i = 0; i < display_unfinish.length; i++){
        if(typeof display_unfinish[i].description != "undefined"){
          display_unfinish[i].description = display_unfinish[i].description.replace(/\n/g,'<br />');
        }else{
          display_unfinish[i].description = "";
        }
        console.log(display_unfinish[i].description);
        $('#todo-list').append('<li class="ui-state-default '+display_unfinish[i].category_id+'-list" category="'+display_unfinish[i].category_id+'" order="'+display_unfinish[i].order+'" key="'+display_unfinish[i].key+'"> <div class="checkbox"></div> <img class="list-sort-handle" src="/images/dragicon.svg" /><img class="list-remove-todo" src="/images/delete-todo.svg" /><img class="list-edit-todo" src="/images/edit-todo.svg" /><p class="category">'+display_unfinish[i].category_name+'</p> <p class="title"> '+display_unfinish[i].title+'</p><div class="detail-icon"> <label>Detail</label> <svg version="1.1" id="Layer_1" xmlns:cc="http://creativecommons.org/ns#" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:inkscape="http://www.inkscape.org/namespaces/inkscape" xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#" xmlns:sodipodi="http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd" xmlns:svg="http://www.w3.org/2000/svg" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 612 635.5" style="enable-background:new 0 0 612 635.5;" xml:space="preserve"><g><path class="st0" d="M575.3,215.5c0,4.7-1.8,8.8-5.4,12.5L317.5,480.4c-3.6,3.6-7.8,5.4-12.5,5.4c-4.7,0-8.8-1.8-12.5-5.4L40.1,227.9c-3.6-3.6-5.4-7.8-5.4-12.5c0-4.7,1.8-8.8,5.4-12.5l27.1-27.1c3.6-3.6,7.8-5.4,12.5-5.4c4.7,0,8.8,1.8,12.5,5.4L305,388.8l212.9-212.9c3.6-3.6,7.8-5.4,12.5-5.4c4.7,0,8.8,1.8,12.5,5.4l27.1,27.1C573.5,206.6,575.3,210.8,575.3,215.5L575.3,215.5z"/></g></svg></div><div class="detail-area"><p>'+display_unfinish[i].description+'</p></div></li>');
      }
      $('#finished-list').empty();
      for(var i = 0; i < display_finish.length; i++){
        if(typeof display_finish[i].description != "undefined"){
          display_finish[i].description = display_finish[i].description.replace(/\n/g,'<br />');
        }else{
          display_finish[i].description = "";
        }
        $('#finished-list').append('<li class="ui-state-default '+display_finish[i].category_id+'-list" category="'+display_finish[i].category_id+'" order="'+display_finish[i].order+'" key="'+display_finish[i].key+'"> <div class="checkbox" style="visibility: hidden;"></div> <img class="finish-list-sort-handle" src="/images/dragicon.svg" /> <p class="category">'+display_finish[i].category_name+'</p> <p class="title"> '+display_finish[i].title+'</p><div class="detail-icon"> <label>Detail</label> <svg version="1.1" id="Layer_1" xmlns:cc="http://creativecommons.org/ns#" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:inkscape="http://www.inkscape.org/namespaces/inkscape" xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#" xmlns:sodipodi="http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd" xmlns:svg="http://www.w3.org/2000/svg" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 612 635.5" style="enable-background:new 0 0 612 635.5;" xml:space="preserve"><g><path class="st0" d="M575.3,215.5c0,4.7-1.8,8.8-5.4,12.5L317.5,480.4c-3.6,3.6-7.8,5.4-12.5,5.4c-4.7,0-8.8-1.8-12.5-5.4L40.1,227.9c-3.6-3.6-5.4-7.8-5.4-12.5c0-4.7,1.8-8.8,5.4-12.5l27.1-27.1c3.6-3.6,7.8-5.4,12.5-5.4c4.7,0,8.8,1.8,12.5,5.4L305,388.8l212.9-212.9c3.6-3.6,7.8-5.4,12.5-5.4c4.7,0,8.8,1.8,12.5,5.4l27.1,27.1C573.5,206.6,575.3,210.8,575.3,215.5L575.3,215.5z"/></g></svg></div><div class="detail-area"><p>'+display_finish[i].description+'</p></div></li>');
      }
      $('body').removeClass('loading');
      $('.modal-background.edit-event-modal').fadeOut(500);
    });
  });
  $('body').on('click','.add-event-confirm',function(e){
    $('body').addClass('loading');
    $.post('/ajax_add_event',{
      new_event: {
        "title": $('.add-new-event-modal .add-new-event-title').val(),
        "category_name": $('.add-new-event-modal .add-new-event option:selected').text(),
        "category_id": $('.add-new-event-modal .add-new-event select').val(),
        "description": $('.add-new-event-modal .add-new-event textarea').val(),
        "status": false,
        "order": parseInt($('#todo-list li').last().attr('order'))+1
      }
    },function(data){
         console.log(data.todo);
         var todo=data.todo;
         var display_finish = [];
         var display_unfinish = [];
         for(var i = 0; i < todo.length; i++){
           if(todo[i].status)display_finish.push(todo[i]);
           else display_unfinish.push(todo[i]);
         }
         display_finish.sort(function(a,b){
           return a.order > b.order;
         });
         display_unfinish.sort(function(a,b){
           return a.order > b.order;
         });
         $('#todo-list').empty();
         for(var i = 0; i < display_unfinish.length; i++){
           if(typeof display_unfinish[i].description != "undefined"){
             display_unfinish[i].description = display_unfinish[i].description.replace(/\n/g,'<br />');
           }else{
             display_unfinish[i].description = "";
           }
           $('#todo-list').append('<li class="ui-state-default '+display_unfinish[i].category_id+'-list" category="'+display_unfinish[i].category_id+'" order="'+display_unfinish[i].order+'" key="'+display_unfinish[i].key+'"> <div class="checkbox"></div> <img class="list-sort-handle" src="/images/dragicon.svg" /><img class="list-remove-todo" src="/images/delete-todo.svg" /><img class="list-edit-todo" src="/images/edit-todo.svg" /><p class="category">'+display_unfinish[i].category_name+'</p> <p class="title"> '+display_unfinish[i].title+'</p><div class="detail-icon"> <label>Detail</label> <svg version="1.1" id="Layer_1" xmlns:cc="http://creativecommons.org/ns#" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:inkscape="http://www.inkscape.org/namespaces/inkscape" xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#" xmlns:sodipodi="http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd" xmlns:svg="http://www.w3.org/2000/svg" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 612 635.5" style="enable-background:new 0 0 612 635.5;" xml:space="preserve"><g><path class="st0" d="M575.3,215.5c0,4.7-1.8,8.8-5.4,12.5L317.5,480.4c-3.6,3.6-7.8,5.4-12.5,5.4c-4.7,0-8.8-1.8-12.5-5.4L40.1,227.9c-3.6-3.6-5.4-7.8-5.4-12.5c0-4.7,1.8-8.8,5.4-12.5l27.1-27.1c3.6-3.6,7.8-5.4,12.5-5.4c4.7,0,8.8,1.8,12.5,5.4L305,388.8l212.9-212.9c3.6-3.6,7.8-5.4,12.5-5.4c4.7,0,8.8,1.8,12.5,5.4l27.1,27.1C573.5,206.6,575.3,210.8,575.3,215.5L575.3,215.5z"/></g></svg></div><div class="detail-area"><p>'+display_unfinish[i].description+'</p></div></li>');
         }
         $('#finished-list').empty();
         for(var i = 0; i < display_finish.length; i++){
           if(typeof display_finish[i].description != "undefined"){
             display_finish[i].description = display_finish[i].description.replace(/\n/g,'<br />');
           }else{
             display_finish[i].description = "";
           }
           $('#finished-list').append('<li class="ui-state-default '+display_finish[i].category_id+'-list" category="'+display_finish[i].category_id+'" order="'+display_finish[i].order+'" key="'+display_finish[i].key+'"> <div class="checkbox" style="visibility: hidden;"></div> <img class="finish-list-sort-handle" src="/images/dragicon.svg" /> <p class="category">'+display_finish[i].category_name+'</p> <p class="title"> '+display_finish[i].title+'</p><div class="detail-icon"> <label>Detail</label> <svg version="1.1" id="Layer_1" xmlns:cc="http://creativecommons.org/ns#" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:inkscape="http://www.inkscape.org/namespaces/inkscape" xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#" xmlns:sodipodi="http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd" xmlns:svg="http://www.w3.org/2000/svg" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 612 635.5" style="enable-background:new 0 0 612 635.5;" xml:space="preserve"><g><path class="st0" d="M575.3,215.5c0,4.7-1.8,8.8-5.4,12.5L317.5,480.4c-3.6,3.6-7.8,5.4-12.5,5.4c-4.7,0-8.8-1.8-12.5-5.4L40.1,227.9c-3.6-3.6-5.4-7.8-5.4-12.5c0-4.7,1.8-8.8,5.4-12.5l27.1-27.1c3.6-3.6,7.8-5.4,12.5-5.4c4.7,0,8.8,1.8,12.5,5.4L305,388.8l212.9-212.9c3.6-3.6,7.8-5.4,12.5-5.4c4.7,0,8.8,1.8,12.5,5.4l27.1,27.1C573.5,206.6,575.3,210.8,575.3,215.5L575.3,215.5z"/></g></svg></div><div class="detail-area"><p>'+display_finish[i].description+'</p></div></li>');
         }
         $('body').removeClass('loading');
         $('.modal-background.add-new-event-modal').fadeOut(500);
    });
  });

  //$( "#todo-list" ).disableSelection();
});
function makeid(k) {
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (var i = 0; i < k; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  return text;
}
